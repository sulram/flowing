// choo
var choo = require('choo')

// models
var graph = require('./app/stores/graph')

// load main view
var mainView = require('./app/view/main')

// initialize choo
var app = choo()

// app stores
app.use(graph)

// create routes
app.route('/', mainView)

// start app
app.mount('body')