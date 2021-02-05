'use strict'

const test = (req, res, next) => {
    return res.json({
        'message': 'test'
    })
}

module.exports = {
    test
}