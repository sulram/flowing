var html = require('choo/html')

module.exports = (state, node, emit) => {

    const [x,y] = node.pos
    const {id, title} = node
    const {selectedNode,dragNode} = state.graph
    const classes = [
        'node',
        id === selectedNode ? 'node-selected' : null,
        id === dragNode ? 'node-dragged' : null
    ]
    .filter(el => el != null)
    .join(" ")

    return html`
        <g
            id="${id}"
            class="${classes}"
            transform="translate(${x},${y})"
            ondblclick="${onDblClick}"
            onclick="${onClick}"
        >
            <rect rx="2" ry="2" width="40" height="40" class="fill"
                onmousedown="${onMouseDown}"
                onmouseup="${onMouseUp}"
            >
            <circle cx="20" cy="20"/>
            <text x="10" y="55">${title}_${id}</text>
            <path class="glyph" transform="translate(5,5) scale(0.1)" d="M65,65 L65,65 L245,65 M65,125 L65,125 L245,125 M65,185 L65,185 L245,185 M65,245 L65,245 L245,245 "></path>
        </g>
    `

    function onMouseDown(event) {
        event.stopPropagation()
        emit('node:mousedown', {event, id})
    }

    function onMouseUp(event) {
        event.stopPropagation()
        emit('node:mouseup', {event, id})
    }

    function onClick(event) {
        event.stopPropagation()
        emit('node:click', {event, id})
    }

    function onDblClick(event) {
        event.stopPropagation()
        emit('node:dblclick', {event, id})
    }
}