const html = require('choo/html')

const node = require('./node')
const routes = require('./routes')

module.exports =  (state, emit) => {

    const nodes = state.graph.nodes.map(nState => node(state, nState, emit))
    const [x,y] = state.graph.offset

    const routesHtml = routes(state,emit)

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
                <g id="routes">${routesHtml}</g>
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