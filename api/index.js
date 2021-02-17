'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.disable('x-powered-by')


/**
 * Routes Area
 */
const test_routes = require('./routes/test_routes')

app.use('/', [
  test_routes
])

/**
 * Stream Area
 */

const stream = require('./services/stream_service')

stream.start('192.168.1.132', '9991', 'admin', '202013js')
stream.start('192.168.1.139', '9992', 'admin', '202013js')

module.exports = app
