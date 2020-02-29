var html = require('choo/html')
var node = require('./node')

module.exports =  (state, emit) => {

    const nodes = state.graph.nodes.map((s) => node(s, emit))
    const [x,y] = state.graph.offset

    return html`
        <svg
            id="riven"
            ondblclick="${onDblClick}"
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

    function onDblClick (e) {
        emit('editor:dblclick', e)
    }

    function onMouseMove(e) {
        emit('editor:mousemove', e)
    }

    function onMouseDown(e) {
        emit('editor:dragging', {dragging: true})
    }

    function onMouseUp(e) {
        emit('editor:dragging', {dragging: false})
    }
}