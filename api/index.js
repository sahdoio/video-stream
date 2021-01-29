'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.disable('x-powered-by')

const test_routes = require('./routes/test_routes')

app.use('/', [
  test_routes
])

module.exports = app
