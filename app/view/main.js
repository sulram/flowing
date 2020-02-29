const html = require('choo/html')
const editor = require('./components/editor')

module.exports = (state, emit) => {

    const [x,y] = state.graph.offset
    const lax = 0.5

    return html`
        <body style="background-position: ${x * lax}px ${y * lax}px">
            ${editor(state, emit)}
        </body>
    `
}