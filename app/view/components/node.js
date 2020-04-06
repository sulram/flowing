const html = require('choo/html')

const {choiceGetY} = require('../../util')

module.exports = (state, node, emit) => {

    const [x,y] = node.pos
    const {id, title} = node
    const {selectedNode,draggedNode} = state.graph
    const classes = [
        'node',
        id === selectedNode ? 'node-selected' : null,
        id === draggedNode ? 'node-dragged' : null
    ]
    .filter(el => el != null)
    .join(" ")

    const numChoices = node.choices.length-1
    const choices = node.choices.map((el,i) => {
        const y = choiceGetY(numChoices, i)
        const selected = state.graph.selectedChoice
            && state.graph.selectedChoice.id === id
            && state.graph.selectedChoice.index === i
        return html`
            <g
                class="port out ${selected ? 'selected': ''}"
                transform="translate(20,${y})"
                onmousedown="${onChoiceMouseDown(i)}"
                onmouseup="${onChoiceMouseUp(i)}"
            >
                <polygon points="17 20.3333333 20.3333333 17 23.6666667 20.3333333 20.3333333 23.6666667"/>
            </g>
        `
    })

    return html`
        <g
            id="${id}"
            class="${classes}"
            transform="translate(${x},${y})"
            ondblclick="${onDblClick}"
            onclick="${onClick}"
        >
            <rect class="focus" rx="4" ry="4"/>
            <g class="node-rect">
                <rect rx="2" ry="2" width="40" height="40" class="fill"
                    onmousedown="${onMouseDown}"
                    onmouseup="${onMouseUp}"
                />
                <path class="glyph" transform="translate(5,5) scale(0.1)" d="M65,65 L65,65 L245,65 M65,125 L65,125 L245,125 M65,185 L65,185 L245,185 M65,245 L65,245 L245,245"/>
            </g>
            <text x="10" y="55">${title}_${id}</text>
            <g class="port in" transform="translate(-20,0)">
                <polygon onmousedown="${onInputDown}" onmouseup="${onInputUp}" points="17 20.3333333 20.3333333 17 23.6666667 20.3333333 20.3333333 23.6666667"/>
            </g>
            ${choices}
        </g>
    `

    function onMouseDown(event) {
        event.stopPropagation()
        emit('graph:machine', {event, id, type: 'node:mousedown'})
    }

    function onMouseUp(event) {
        // event.stopPropagation()
        emit('graph:machine', {event, id, type: 'node:mouseup'})
    }

    function onClick(event) {
        event.stopPropagation()
        emit('graph:machine', {event, id, type: 'node:click'})
    }

    function onDblClick(event) {
        event.stopPropagation()
        emit('graph:machine', {event, id, type: 'node:dblclick'})
    }

    function onChoiceMouseDown(index) {
        return (event) => {
            event.stopPropagation()
            emit('graph:machine', {event, id, index, type: 'choice:mousedown'})
        }
    }

    function onChoiceMouseUp(index) {
        return (event) => {
            // event.stopPropagation()
            emit('graph:machine', {event, id, index, type: 'choice:mouseup'})
        }
    }

    function onInputUp(event) {
        // event.stopPropagation()
        emit('graph:machine', {event, id, type: 'node:inputup'})
    }

    function onInputDown(event) {
        event.stopPropagation()
        emit('graph:machine', {event, id, type: 'node:inputdown'})
    }
}