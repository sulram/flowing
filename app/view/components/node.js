var html = require('choo/html')

module.exports = (state, node, emit) => {

    const [x,y] = node.pos
    const {id} = node
    const isSelected = id === state.graph.selectedNode

    return html`
        <g
            class="node${isSelected ? ' node-selected' : ''}"
            id="${node.id}"
            transform="translate(${x},${y})"
            ondblclick="${onDblClick}"
            onclick="${onClick}"
        >
            <rect rx="2" ry="2" width="40" height="40" class="fill"
                onmousedown="${onMouseDown}"
                onmouseup="${onMouseUp}"
            >
            <circle cx="20" cy="20"/>
            <text x="10" y="55">${node.title}_${node.id}</text>
            <path class="glyph" transform="translate(5,5) scale(0.1)" d="M65,65 L65,65 L245,65 M65,125 L65,125 L245,125 M65,185 L65,185 L245,185 M65,245 L65,245 L245,245 "></path>
        </g>
    `

    function onMouseDown(e) {
        e.stopPropagation()
        emit('node:mousedown', {mouseEvent: e, id})
    }

    function onMouseUp(e) {
        e.stopPropagation()
        emit('node:mouseup', {mouseEvent: e, id})
    }

    function onClick(e) {
        e.stopPropagation()
        emit('node:click', {mouseEvent: e, id})
    }

    function onDblClick(e) {
        e.stopPropagation()
        emit('node:dblclick', {mouseEvent: e, id})
    }
}