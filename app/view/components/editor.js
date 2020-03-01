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

    function onDblClick (e) {
        emit('editor:dblclick', e)
    }

    function onClick (e) {
        emit('editor:click', e)
    }

    function onMouseMove(e) {
        emit('editor:mousemove', e)
    }

    function onMouseDown(e) {
        emit('editor:dragstate', {dragGraph: true})
    }

    function onMouseUp(e) {
        emit('editor:dragstate', {dragGraph: false})
    }
}