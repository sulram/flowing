const R = require('ramda')
const vec = require('vec-la')
const mtx = vec.matrixBuilder()

module.exports = (state, bus) => {

    // initial state
    state.graph = {
        dragGraph: false,
        dragNode: null,
        selectedNode: null,
        selectedChoice: null,
        mouse: [0,0],
        mouseBeforeDrag: [0,0],
        offset: [0,0],
        diff: [0,0],
        nodes: []
    }

    // events
    bus.on('editor:dblclick',  e => update(e, createNode))
    bus.on('editor:mousemove', e => update(e, mouseMove))
    bus.on('editor:dragstate', e => update(e, dragState))
    bus.on('editor:click',     e => update(e, unselectAll))
    bus.on('node:click',       e => update(e, selectNode))
    bus.on('node:mousedown',   e => update(e, dragNode))
    bus.on('node:mouseup',     e => update(e, releaseNode))

    // side effects: mutate and render
    function update(e, fn) {
        state.graph = fn(e, state.graph)
        bus.emit('render')
    }
    
    // UTIL

    // generate ID
    function idgen() {
        return (+new Date).toString(32)
    }

    // calculate center of node based on mouse - offset
    function centerNode(graph) {
        return vec.transform(vec.sub(graph.mouse, graph.offset), mtx.translate(-20, -20).get())
    }

    // GRAPH

    // on mouse move
    function mouseMove(e, graph) {
        const {x,y} = e
        const mouse = [x,y]
        const offset = vec.sub(mouse, graph.diff)
        // check if dragNode
        const nodes = graph.dragNode ? mouseMoveNode(graph) : graph.nodes
        // check if dragGraph
        return graph.dragGraph
            ? {...graph, nodes, mouse, offset}
            : {...graph, nodes, mouse}
    }

    // update drag state
    function dragState(e, graph) {
        const {dragGraph} = e
        const diff = vec.sub(graph.mouse, graph.offset)
        return dragGraph
            ? {...graph, diff, dragGraph, mouseBeforeDrag: graph.mouse}
            : {...graph, diff, dragGraph}
    }

    // unselect everything
    function unselectAll(e, graph) {
        const dist = vec.dist(graph.mouse, graph.mouseBeforeDrag)
        return dist > 5
            ? graph
            : {...graph, selectedNode: null, selectedChoice: null}
    }

    // NODES

    // create a node
    function createNode(e, graph) {
        const {nodes} = graph
        const id = idgen()
        const node = {
            id,
            title: 'node',
            pos: centerNode(graph)
        }
        return {...graph, nodes: [...nodes, node], selectedNode: id, selectedChoice: null}
    }

    // select node
    function selectNode(e, graph) {
        const selectedNode = e.id
        const dist = vec.dist(graph.mouse, graph.mouseBeforeDrag)
        return dist > 5
            ? graph
            : {...graph, selectedNode}
    }

    // called by mouseMove
    function mouseMoveNode(graph) {
        const index = R.findIndex(R.propEq('id', graph.dragNode))(graph.nodes)
        const node = {...graph.nodes[index], pos: centerNode(graph)}
        return R.update(index, node, graph.nodes);
    }

    // on start drag node
    function dragNode(e, graph) {
        return {...graph, dragNode: e.id, mouseBeforeDrag: graph.mouse}
    }

    // on release node
    function releaseNode(e, graph) {
        return {...graph, dragNode: null}
    }

}