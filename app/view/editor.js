const html = require('choo/html')
const graph = require('./components/graph')
const inspector = require('./components/inspector')

module.exports = (state, emit) => {

    const [x,y] = state.graph.offset
    const lax = 0.5

    return html`
        <body class="${state.current}" style="background-position: ${x * lax}px ${y * lax}px">
            ${graph(state, emit)}
            ${inspector(state, emit)}
        </body>
    `
}