module.exports = (state, emitter) => {

    emitter.on('onEditorDblClick', function (e) {
        console.log('onEditorDblClick', e)
        emitter.emit('createNode')
    })

    emitter.on('onEditorMouseMove', function(e) {
        const {x, y} = e
        //console.log(x,y)
        state.mouse = {...state.mouse, x, y}
        if(state.canvas.dragging){
            const ox = x - state.canvas.diff_x
            const oy = y - state.canvas.diff_y
            state.canvas = {...state.canvas, x: ox, y: oy}
            emitter.emit('render')
        }
    })

    emitter.on('onEditorMouseDown', () => dragState(true))
    emitter.on('onEditorMouseUp', () => dragState(false))

    function dragState(dragging) {
        const diff_x = state.mouse.x - state.canvas.x
        const diff_y = state.mouse.y - state.canvas.y
        state.canvas = {...state.canvas, diff_x, diff_y, dragging}
    }
    
}