'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.disable('x-powered-by')

const jwe_routes = require('./routes/jwe_routes')

app.use('/', [
  jwe_routes
])

module.exports = app
