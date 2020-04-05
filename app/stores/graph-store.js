
const { interpret } = require('xstate')
const machine = require('./graph-machine')

module.exports = (state, bus) => {

    // get initial context
    state.graph = machine.context

    // start machine service
    const service = interpret(machine)
        .onTransition(machineState => {
            // side effects: mutate and render
            state.graph = machineState.context
            bus.emit('render')
            console.log('machine:transition', machineState.value, machineState.context)
        })
        .start()
    
    // listen choo nanobus messages
    // and send them to machine service
    bus.on('graph:machine', obj => service.send(obj))

}