// choo
var choo = require('choo')

// models
var editor = require('./app/stores/editor')
var node = require('./app/stores/node')

// load main view
var mainView = require('./app/view/main')

// initialize choo
var app = choo()

// app stores
app.use(editor)
app.use(node)

// create routes
app.route('/', mainView)

// start app
app.mount('body')