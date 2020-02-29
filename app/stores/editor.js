const vec = require('vec-la')
const mtx = vec.matrixBuilder()

module.exports = (state, emitter) => {

    // initial state
    state.graph = {
        dragging: false,
        mouse: [0,0],
        offset: [0,0],
        diff: [0,0],
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
            pos: vec.transform(vec.sub(mouse, offset), mtx.translate(-20, -20).get())
        }
        return {...graph, nodes: [...nodes, node]}
    }

    // on mouse move
    function mouseMove(e, graph) {
        const {x,y} = e
        const mouse = [x,y]
        const offset = vec.sub(mouse, graph.diff)
        // if dragging
        return state.graph.dragging
            ? {...graph, mouse, offset}
            : {...graph, mouse}
    }

    // update drag state
    function dragState(e, graph) {
        const {dragging} = e
        const diff = vec.sub(graph.mouse, graph.offset)
        return {...graph, diff, dragging}
    }

}