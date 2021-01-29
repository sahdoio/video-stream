'use strict'

const test = (req, res, next) => {
    Stream = require('node-rtsp-stream')

    //rtsp://DOMINIO:PORTA/user=USUARIO&password=SENHA&channel=1&stream=0.sdp?real_stream

    const streamUrl = 'rtsp://177.103.216.179:8181/user=USUARIO&password=SENHA&channel=1&stream=0.sdp?real_stream'

    const stream = new Stream({
        name: 'Test Stream',
        streamUrl: streamUrl,
        wsPort: 9999,
        ffmpegOptions: { // options ffmpeg flags
            '-stats': '', // an option with no neccessary value uses a blank string
            '-r': 30 // options with required values specify the value after the key
        }
    })

    return res.json({
        'message': 'test'
    })
}

module.exports = {
    test
}