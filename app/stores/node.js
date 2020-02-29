module.exports = (state, bus) => {

    bus.on('node:click', svg => {
        console.log(svg)
        bus.emit('render')
    })

    bus.on('node:select', id => {
        console.log('node:select', id)
    })

    bus.on('node:release', id => {
        console.log('node:release', id)
    })
    
}
