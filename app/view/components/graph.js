var html = require('choo/html')
var node = require('./node')

module.exports =  (state, emit) => {

    const nodes = state.graph.nodes.map(nState => node(state, nState, emit))
    const [x,y] = state.graph.offset

    return html`
        <svg
            id="riven"
            ondblclick="${onDblClick}"
            onclick="${onClick}"
            onmousemove="${onMouseMove}"
            onmousedown="${onMouseDown}"
            onmouseup="${onMouseUp}"
        >
            <g id="viewport" style="transform: translate(${x}px,${y}px)">
                <g id="edges"></g>
                <g id="nodes">${nodes}</g>
            </g>
        </svg>
    `

    function onDblClick (event) {
        emit('graph:machine', {event, type: 'canvas:dblclick'})
    }

    function onClick (event) {
        emit('graph:machine', {event, type: 'canvas:click'})
    }

    function onMouseMove(event) {
        emit('graph:machine', {event, type: 'canvas:mousemove'})
    }

    function onMouseDown(event) {
        emit('graph:machine', {event, type: 'canvas:mousedown'})
    }

    function onMouseUp(event) {
        emit('graph:machine', {event, type: 'canvas:mouseup'})
    }
}