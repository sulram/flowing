// load choo
var choo = require('choo')

// load stores
var graphStore = require('./app/stores/graph-store')

// load editor view
var editor = require('./app/view/editor')

// initialize choo
var app = choo()

// initialize app stores
app.use(graphStore)

// create routes
app.route('/', editor)

// start app
app.mount('body')