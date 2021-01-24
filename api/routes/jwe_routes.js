'use strict'

const router = require('express').Router()
const {
    jweEncrypt,
    jweDecrypt
} = require('../controllers/jwe_controller')

router.route('/jwe/encrypt')
    .post(jweEncrypt)

router.route('/jwe/decrypt')
    .post(jweDecrypt)

module.exports = router