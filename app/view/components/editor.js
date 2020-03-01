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
        emit('editor:dblclick', {event})
    }

    function onClick (event) {
        emit('editor:click', {event})
    }

    function onMouseMove(event) {
        emit('editor:mousemove', {event})
    }

    function onMouseDown(event) {
        emit('editor:dragstate', {event, dragGraph: true})
    }

    function onMouseUp(event) {
        emit('editor:dragstate', {event, dragGraph: false})
    }
}