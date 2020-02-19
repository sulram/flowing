module.exports = (state, emitter) => {

    emitter.on('node:click', function (svg) {
        console.log(svg)
        emitter.emit('render')
    })

    emitter.on('node:select', function (id) {
        console.log('node:select', id)
    })

    emitter.on('node:release', function (id) {
        console.log('node:release', id)
    })
    
}
