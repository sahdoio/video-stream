const Stream = require('node-rtsp-stream')

/**
 * Start stream connection
 * 
 * INTELBRAS:
 * 
 * 01 – rtsp://USUARIO:SENHA@DOMINIO:PORTA/cam/realmonitor?channel=1&subtype=0
 * 02 – rtsp://DOMINIO:PORTA/user=USUARIO&password=SENHA&channel=1&stream=0.sdp?
 * 
 * source: https://gist.github.com/alexishida/b804c0329e1a71d64336e1f0bcbd20da
 */

const start = (domain, wsPort, user, password) => {
    const sulfix = 'cam/realmonitor?channel=1&subtype=0'
    const streamUrl = 'rtsp://' + user + ':' + password + '@' + domain + '/' + sulfix

    const stream = new Stream({
        name: 'video_strean_port_' + wsPort,
        streamUrl: streamUrl,
        wsPort: wsPort,
        ffmpegOptions: { // options ffmpeg flags
            '-stats': '', // an option with no neccessary value uses a blank string
            '-r': 30 // options with required values specify the value after the key
        }
    })
}

module.exports = {
    start
}