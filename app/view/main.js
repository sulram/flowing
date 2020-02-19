const html = require('choo/html')
const editor = require('./components/editor')

module.exports = (state, emit) => {
    return html`
        <body style="background-position: ${state.canvas.x * 0.5}px ${state.canvas.y * 0.5}px">
            ${editor(state, emit)}
        </body>
    `
}