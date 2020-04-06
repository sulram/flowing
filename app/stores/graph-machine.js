const R = require('ramda')
const vec = require('vec-la')
const mtx = vec.matrixBuilder()
const { createMachine, assign } = require('xstate')
const { findNode, findNodeIndex } = require('../util')

// initial context
const context = {
    mouse:  [0,0], // mouse position
    offset: [0,0], // canvas offset
    diff:   [0,0], // diff mouse-canvas for dragging
    draggedNode:  null, // node id
    selectedNode: null, // node id
    selectedChoice: null,
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
                },
                'choice:mousedown': {
                    target: 'CHOICE_CONNECT',
                    actions: ['choiceHold']
                },
                'inspector:addChoice': {
                    actions: ['addNodeChoice']
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
                },
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
                'canvas:mouseup': {
                    target: 'IDLE',
                    actions: ['releaseNode']
                },
            }
        },
        CHOICE_CONNECT: {
            on: {
                'canvas:mousemove': {
                    actions: ['updateMouse']
                },
                'node:mouseup': {
                    target: 'IDLE',
                    actions: ['targetChoice','releaseChoice']
                },
                'node:inputup': {
                    target: 'IDLE',
                    actions: ['targetChoice','releaseChoice']
                },
                'canvas:mouseup': {
                    target: 'IDLE',
                    actions: ['releaseChoice']
                },
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
const snapPos     = (pos, snap) => {
    snap = snap || 64
    return [Math.floor(pos[0] / snap) * snap, Math.floor(pos[1] / snap) * snap]
}
const choiceModel = {
    text: 'ok',
    target: null
}
const createNode  = (ctx, obj) => {
    const id = idgen()
    const node = {
        id,
        title: 'node',
        pos: snapPos(getDiff(ctx,obj)),
        choices: [choiceModel]
    }
    return [...ctx.nodes, node]
}
const dragNode = (ctx, obj) => {
    const index = findNodeIndex(ctx.draggedNode,ctx.nodes)
    const pos = snapPos(getDiff(ctx,obj))
    const node = {...ctx.nodes[index], pos}
    return R.update(index, node, ctx.nodes)
}
const selectedChoice  = (ctx, obj) => {
    return {id: obj.id, index: obj.index}
}
const addNodeChoice = (ctx, obj) => {
    const index = findNodeIndex(obj.id,ctx.nodes)
    const node = {...ctx.nodes[index], choices: [...ctx.nodes[index].choices, choiceModel] }
    return R.update(index, node, ctx.nodes)
}
const targetChoice = (ctx, obj) => {
    if(obj.id !== ctx.selectedChoice.id) {
        const {id, index} = ctx.selectedChoice
        const nodeIndex = findNodeIndex(id,ctx.nodes)
        const node = ctx.nodes[nodeIndex]
        const choices = R.update(index, {...node.choices[index], target: obj.id}, node.choices)
        return R.update(nodeIndex, {...node, choices }, ctx.nodes);
    }
    return ctx.nodes
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
        choiceHold:     assign({selectedChoice: selectedChoice}),
        releaseChoice:  assign({selectedChoice: null }),
        addNodeChoice:  assign({nodes: addNodeChoice}),
        targetChoice:   assign({nodes: targetChoice}),
    }
}

module.exports = createMachine(MachineConfig, MachineOptions)