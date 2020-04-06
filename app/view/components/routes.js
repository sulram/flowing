const R = require('ramda')
const vec = require('vec-la')
const html = require('choo/html')
const mtx = vec.matrixBuilder()

const {choiceGetY, findNode, mapIndexed} = require('../../util')

// draw svg path
const svgpath = (a,b, classes) => {
    return html`<path class="route ${classes}" d="M ${a.join(' ')} L ${b.join(' ')}">`
}

// transform position
const transPos = (pos, x, y) => vec.transform(pos, mtx.translate(x, y).get())

module.exports =  (state, emit) => {

    const {mouse, offset, selectedChoice, nodes} = state.graph

    // flatten all choices
    const flatChoices = (id) => mapIndexed((val, index) => {
        const {target} = val
        return { id, index, target }
    })

    // filter choices without target
    const hasTarget = R.reject(R.propEq('target', null))

    // filter choice that is on hold
    const notSelected = (selected) => R.reject((choice) => {
        return selected !== null
            && choice.id === selected.id
            && choice.index === selected.index
    })

    const filterRoutes = (acc, node) => {
        return [
            ...acc,
            ...R.pipe(
                flatChoices(node.id),
                hasTarget,
                //notSelected(selectedChoice)
            )(node.choices)
        ]
    }

    const getFrom = (obj,nodes) => {
        const from = findNode(obj.id, nodes)
        const fromY = choiceGetY(from.choices.length, obj.index)
        return {from,fromY}
    }

    const getSelected = () => {
        const {from,fromY} = getFrom(selectedChoice, nodes)
        return svgpath(
            transPos(from.pos, 42, 25 + fromY),
            vec.sub(mouse, offset),
            'output'
        )
    } 

    const svgroutes = R.map((route) => {
        const {from,fromY} = getFrom(route, nodes)
        const to = findNode(route.target, nodes)
        return svgpath(
            transPos(from.pos, 42, 25 + fromY),
            transPos(to.pos, -2, 20)
        )
    })

    const routes = svgroutes(R.reduce(filterRoutes, [], state.graph.nodes))
    const selected = selectedChoice !== null ? getSelected() : ''

    return html`
        ${routes}
        ${selected}
    `
}