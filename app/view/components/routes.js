const R = require('ramda')
const vec = require('vec-la')
const html = require('choo/html')
const mtx = vec.matrixBuilder()

const {choiceGetY, findNode, mapIndexed} = require('../../util')

const svgpath = (a,b, classes) => {
    return html`<path class="route ${classes}" d="M ${a.join(' ')} L ${b.join(' ')}">`
}

module.exports =  (state, emit) => {

    const {mouse,offset} = state.graph
    const {selectedChoice} = state.graph

    const from = (obj) => {
        const {id,index} = obj
        const node = findNode(id, state.graph.nodes)
        const cy = choiceGetY(node.choices.length,index)
        return vec.transform(node.pos, mtx.translate(42, 25 + cy).get())
    }

    const to = (obj) => {
        const node = findNode(obj.target, state.graph.nodes)
        return vec.transform(node.pos, mtx.translate(-2, 20).get())
    }

    const svgroute = R.map((route) => svgpath(from(route),to(route)))

    const filterRoutes = (acc, node) => {
        // index and flat every choice
        const allchoices = mapIndexed((val, index) => {
            return {
                id: node.id,
                index,
                target: val.target
            }
        }, node.choices)
        // filter choices with null target
        const choicesNotNull = R.reject(R.propEq('target', null))(allchoices)
        // filter choice that is on hold
        const choicesNotSelected = R.reject((choice) => {
            return selectedChoice !== null
                && choice.id === selectedChoice.id
                && choice.index === selectedChoice.index
        })(choicesNotNull)
        return [
            ...acc,
            ...choicesNotSelected
        ]
    }

    const routes = svgroute(R.reduce(filterRoutes, [], state.graph.nodes))

    const routeOnHold = selectedChoice !== null
        ? svgpath(from(selectedChoice),vec.sub(mouse, offset),'output')
        : '';

    return html`
        ${routes}
        ${routeOnHold}
    `
}