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
    bus.on('editor:dblclick',  obj => update(obj, createNode))
    bus.on('editor:mousemove', obj => update(obj, mouseMove))
    bus.on('editor:dragstate', obj => update(obj, dragState))
    bus.on('editor:click',     obj => update(obj, unselectAll))
    bus.on('node:click',       obj => update(obj, selectNode))
    bus.on('node:mousedown',   obj => update(obj, dragNode))
    bus.on('node:mouseup',     obj => update(obj, releaseNode))

    // side effects: mutate and render
    function update(obj, fn) {
        //console.log('update', e.event.type, fn.name)
        state.graph = fn(obj, state.graph)
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
    function mouseMove(obj, graph) {
        const {x,y} = obj.event
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
    function dragState(obj, graph) {
        const {dragGraph} = obj
        const diff = vec.sub(graph.mouse, graph.offset)
        return dragGraph
            ? {...graph, diff, dragGraph, mouseBeforeDrag: graph.mouse}
            : {...graph, diff, dragGraph}
    }

    // unselect everything
    function unselectAll(_obj, graph) {
        const dist = vec.dist(graph.mouse, graph.mouseBeforeDrag)
        return dist > 5
            ? graph
            : {...graph, selectedNode: null, selectedChoice: null}
    }

    // NODES

    // create a node
    function createNode(_obj, graph) {
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
    function selectNode(obj, graph) {
        const selectedNode = obj.id
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
    function dragNode(obj, graph) {
        return {...graph, dragNode: obj.id, mouseBeforeDrag: graph.mouse}
    }

    // on release node
    function releaseNode(_obj, graph) {
        return {...graph, dragNode: null}
    }

}