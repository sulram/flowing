module.exports = (state, emitter) => {

    // initial state
    state.graph = {
        dragging: false,
        mouse: {x: 0, y: 0},
        offset: {x: 0, y: 0},
        diff: {x: 0, y: 0},
        nodes: []
    }

    // events
    emitter.on('editor:dblclick',  (e) => update(e, createNode))
    emitter.on('editor:mousemove', (e) => update(e, mouseMove))
    emitter.on('editor:dragging',  (e) => update(e, dragState))

    function update(event, fn) {
        // mutate and render
        state.graph = fn(event, state.graph)
        emitter.emit('render')
    }
    
    // generate ID
    function idgen() {
        return (+new Date).toString(32)
    }

    // create a node
    function createNode(event, graph) {
        const {mouse, offset, nodes} = graph
        const node = {
            id: idgen(),
            x: mouse.x - offset.x - 20,
            y: mouse.y - offset.y - 20
        }
        return {...graph, nodes: [...nodes, node]}
    }

    // on mouse move
    function mouseMove(e, graph) {
        const {x,y} = e
        const {diff} = graph
        const mouse = {x,y}
        const offset = {
            x: x - diff.x,
            y: y - diff.y
        }
        // if dragging
        return state.graph.dragging
            ? {...graph, mouse, offset}
            : {...graph, mouse}
    }

    // update drag state
    function dragState(e, graph) {
        const {mouse, offset} = graph
        const {dragging} = e
        const diff = {
            x: mouse.x - offset.x,
            y: mouse.y - offset.y
        }
        return {...graph, diff, dragging}
    }

}