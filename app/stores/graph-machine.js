const R = require('ramda')
const vec = require('vec-la')
const mtx = vec.matrixBuilder()
const { createMachine, assign } = require('xstate')

// initial context
const context = {
    mouse:  [0,0], // mouse position
    offset: [0,0], // canvas offset
    diff:   [0,0], // diff mouse-canvas for dragging
    draggedNode:  null, // node id
    selectedNode: null, // node id
    nodes: [] // nodes array
}

// machine config
const MachineConfig = {
    id: 'GraphMachine',
    context,
    initial: 'IDLE',
    states: {
        IDLE: {
            on: {
                'canvas:dblclick': {
                    actions: ['createNode','selectLastNode']
                },
                'canvas:mousemove': {
                    actions: ['updateMouse']
                },
                'canvas:mousedown': {
                    target: 'CANVAS_HOLD',
                    actions: ['updateDiff']
                },
                'node:mousedown': {
                    target: 'NODE_HOLD',
                    actions: ['updateDiff','holdNode']
                }
            }
        },
        CANVAS_HOLD: {
            on: {
                'canvas:mousemove': {
                    target: 'CANVAS_DRAG',
                    actions: ['updateMouse','updateOffset']
                },
                'canvas:mouseup': {
                    target: 'IDLE',
                    actions: ['unselectNode']
                }
            }
        },
        CANVAS_DRAG: {
            on: {
                'canvas:mousemove': {
                    actions: ['updateMouse','updateOffset']
                },
                'canvas:mouseup': {
                    target: 'IDLE',
                }
            }
        },
        NODE_HOLD: {
            on: {
                'canvas:mousemove': {
                    target: 'NODE_DRAG',
                    actions: ['updateMouse','dragNode']
                },
                'node:mouseup': {
                    target: 'IDLE',
                    actions: ['selectNode','releaseNode']
                }
            }
        },
        NODE_DRAG: {
            on: {
                'canvas:mousemove': {
                    actions: ['updateMouse','dragNode']
                },
                'node:mouseup': {
                    target: 'IDLE',
                    actions: ['releaseNode']
                }
            }
        }
    }
}

// common FP methods
const idgen = () => (+new Date).toString(32)
const getID       = (ctx, obj) => obj.id
const getMouse    = (ctx, obj) => [obj.event.x,obj.event.y]
const getDiff     = (ctx, obj) => vec.sub(ctx.mouse, ctx.offset)
const getOffset   = (ctx, obj) => vec.sub(ctx.mouse, ctx.diff)
const getLastNode = (ctx, obj) => R.last(ctx.nodes).id
const centerNode  = (ctx, obj) => vec.transform(getDiff(ctx, obj), mtx.translate(-20, -20).get())
const createNode  = (ctx, obj) => {
    const id = idgen()
    const node = {
        id,
        title: 'node',
        pos: centerNode(ctx,obj)
    }
    return [...ctx.nodes, node]
}
const dragNode = (ctx, obj) => {
    const index = R.findIndex(R.propEq('id', ctx.draggedNode))(ctx.nodes)
    const node = {...ctx.nodes[index], pos: centerNode(ctx,obj)}
    return R.update(index, node, ctx.nodes);
}

// machine options & actions
const MachineOptions = {
    actions: {
        updateMouse:    assign({mouse: getMouse}),
        updateDiff:     assign({diff: getDiff}),
        updateOffset:   assign({offset: getOffset}),
        createNode:     assign({nodes: createNode}),
        selectNode:     assign({selectedNode: getID }),
        selectLastNode: assign({selectedNode: getLastNode}),
        unselectNode:   assign({selectedNode: null}),
        holdNode:       assign({draggedNode: getID}),
        dragNode:       assign({nodes: dragNode}),
        releaseNode:    assign({draggedNode: null}),
    }
}

module.exports = createMachine(MachineConfig, MachineOptions)