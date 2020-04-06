const R = require('ramda')

const choiceGetY = (n, i, step) => {
    step = step || 8
    return n * - 0.5 * step + i * step
}

const mapIndexed = R.addIndex(R.map)
const findNode = (id, nodes) => R.find(R.propEq('id', id))(nodes)
const findNodeIndex = (id, nodes) => R.findIndex(R.propEq('id', id))(nodes)

module.exports = {
    choiceGetY,
    mapIndexed,
    findNode,
    findNodeIndex
}