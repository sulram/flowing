const html = require('choo/html')
const {findNode} = require('../../util')

module.exports =  (state, emit) => {

    const node = findNode(state.graph.selectedNode,state.graph.nodes)
    const content = node
        ? html`
            <pre>${ JSON.stringify(node, null, ' ') }</pre>
            <a href="#" onclick=${addChoice(node.id)}>add choice</a>
        `
        : 'none selected'

    return html`
        <div id="inspector">
            ${content}
        </div>
    `
    function addChoice(id) {
        return (event) => {
            event.stopPropagation()
            event.preventDefault()
            emit('graph:machine', {event, id, type: 'inspector:addChoice'})
        }
    }
}