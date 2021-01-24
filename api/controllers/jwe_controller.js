'use strict'

const jwt = require('node-webtokens')
const base64 = require('base-64')

const key = "82a645babc5cd41c9a2cb4d0d3ba17ad"

const jweEncrypt = (req, res, next) => {
    const payload = req.body.payload
    const jweAlgorithm = 'dir'   
    const jweEncryption = 'A128CBC-HS256'   
    const token = jwt.generate(jweAlgorithm, jweEncryption, payload, getKey(key))

    return res.json({
        'token': token
    })
}

const jweDecrypt = (req, res, next) => {
    const token = req.body.token
    const parsedToken = jwt.parse(token).verify(getKey(key))
    const data = parsedToken.payload

    return res.json({
        data
    })
}

const getKey = (key) => {
    return base64.encode(key)
}

module.exports = {
    jweEncrypt,
    jweDecrypt
}