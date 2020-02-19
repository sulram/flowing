module.exports = (state, emitter) => {

    emitter.on('clickSVG', function (svg) {
        console.log(svg)
        emitter.emit('render')
    })

    emitter.on('onNodeSelect', function (id) {
        console.log('onNodeSelect', id)
    })

    emitter.on('onNodeRelease', function (id) {
        console.log('onNodeRelease', id)
    })
    
}
