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
    emitter.on('editor:dblclick', createNode)
    emitter.on('editor:mousemove', mouseMove)
    emitter.on('editor:mousedown', (e) => dragState(true))
    emitter.on('editor:mouseup', (e) => dragState(false))

    // generate ID
    function idgen() {
        return (+new Date).toString(32)
    }

    // create a node
    function createNode(e) {

        const {mouse, offset, nodes} = state.graph

        const node = {
            id: idgen(),
            x: mouse.x - offset.x - 20,
            y: mouse.y - offset.y - 20
        }

        state.graph.nodes = [...nodes, node]

        emitter.emit('render')
    }

    // on mouse move
    function mouseMove(e) {

        const {x,y} = e
        const {diff} = state.graph
        const mouse = {x,y}

        // if dragging
        if(state.graph.dragging){
            // update mouse and offset
            const offset = {
                x: x - diff.x,
                y: y - diff.y
            }
            state.graph = {...state.graph, mouse, offset}
            emitter.emit('render')
        } else {
            // update mouse
            state.graph = {...state.graph, mouse}
        }
    }

    // update drag state
    function dragState(dragging) {
        const {mouse, offset} = state.graph
        const diff = {
            x: mouse.x - offset.x,
            y: mouse.y - offset.y
        }
        state.graph = {...state.graph, diff, dragging}
    }

    
    
}