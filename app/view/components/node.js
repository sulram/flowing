var html = require('choo/html')

module.exports = (node, emit) => {

    const [x,y] = node.pos

    return html`
        <g
            class="node"
            id="${node.id}"
            transform="translate(${x},${y})"
            ondblclick="${onDblClick}"
        >
            <rect rx="2" ry="2" width="40" height="40" class="fill"
                onclick="${onClick}"
                onmousedown="${onSelect}"
                onmouseup="${onRelease}"
            >
            <text x="10" y="55">node_${node.id}</text>
            <path class="glyph" transform="translate(5,5) scale(0.1)" d="M65,65 L65,65 L245,65 M65,125 L65,125 L245,125 M65,185 L65,185 L245,185 M65,245 L65,245 L245,245 "></path>
        </g>
    `
    function onClick(e) {
        e.stopPropagation()
        emit('node:click', node.id)
    }

    function onSelect(e) {
        e.stopPropagation()
        emit('node:select', node.id)
    }

    function onRelease(e) {
        e.stopPropagation()
        emit('node:release', node.id)
    }

    function onDblClick(e) {
        e.stopPropagation()
        emit('node:dblclick', node.id)
    }
}