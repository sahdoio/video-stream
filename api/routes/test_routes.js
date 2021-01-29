'use strict'

const router = require('express').Router()
const {
    test
} = require('../controllers/test_controller')

router.route('/test')
    .get(test)

module.exports = router