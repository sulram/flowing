var html = require('choo/html')

// import components
var node = require('./node')

function editorView (state, emit) {

    return html`
        <svg
            id="riven"
            ondblclick="${onDblClick}"
            onmousemove="${onMouseMove}"
            onmousedown="${onMouseDown}"
            onmouseup="${onMouseUp}"
        >
            <g id="viewport" style="transform: translate(${state.canvas.x}px,${state.canvas.y}px)">
                <g id="edges"></g>
                <g id="nodes">
                    ${state.nodes.map(nodesMap)}
                </g>
            </g>
        </svg>
    `

    function nodesMap(obj, i) {
        return node(obj, emit)
    }

    function onDblClick (e) {
        emit('onEditorDblClick', e)
    }

    function onMouseMove(e) {
        emit('onEditorMouseMove', e)
    }

    function onMouseDown(e) {
        emit('onEditorMouseDown', e)
    }

    function onMouseUp(e) {
        emit('onEditorMouseUp', e)
    }
}

module.exports = editorView