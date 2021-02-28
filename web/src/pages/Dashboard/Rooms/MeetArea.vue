<template>
  <div class="main">
    <div class="main__left">
      <div class="main__videos">
        <div id="video-grid"></div>
      </div>
      <div class="main__controls">
        <div class="main__controls__block">
          <div onclick="muteUnmute()" class="main__controls__button main__mute_button">
            <i class="fas fa-microphone"></i>
            <span>Mute</span>
          </div>
          <div onclick="playStop()" class="main__controls__button main__video_button">
            <i class="fas fa-video"></i>
            <span>Stop Video</span>
          </div>
        </div>
        <div class="main__controls__block">
          <div class="main__controls__button">
            <i class="fas fa-shield-alt"></i>
            <span>Security</span>
          </div>
          <div class="main__controls__button">
            <i class="fas fa-user-friends"></i>
            <span>Participants</span>
          </div>
          <div class="main__controls__button">
            <i class="fas fa-comment-alt"></i>
            <span>Chat</span>
          </div>
        </div>
        <div class="main__controls__block">
          <div class="main__controls__button">
            <span class="leave_meeting">Leave Meeting</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main__right">
      <div class="main__header">
        <h6>Chat</h6>
      </div>
      <div class="main__chat_window">
        <ul class="messages"></ul>
      </div>
      <div class="main__message_container">
        <input id="chat_message" type="text" placeholder="Type message here..." />
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex'

  export default {
    name: "MeetArea",
    data() {
      return {
        loaded: false,
        myPeer: null,
        myVideoStream: null,
        peers: {}
      }
    },
    computed: {
      ...mapGetters(['getSocket'])
    },
    methods: {
      connectToNewUser(videoGrid, peerId, stream) {
        const call = this.myPeer.call(peerId, stream)
        const video = document.createElement("video")

        call.on("stream", (userVideoStream) => {
          addVideoStream(videoGrid, video, userVideoStream)
        })

        call.on("close", () => {
          video.remove()
        })

        this.peers[peerId] = call
      },
      addVideoStream(videoGrid, video, stream) {
        video.srcObject = stream
        video.addEventListener("loadedmetadata", () => {
          video.play()
        })
        videoGrid.append(video)
      },
      scrollToBottom() {
        var d = $(".main__chat_window")
        d.scrollTop(d.prop("scrollHeight"))
      },
      muteUnmute() {
        const enabled = this.myVideoStream.getAudioTracks()[0].enabled
        if (enabled) {
          this.myVideoStream.getAudioTracks()[0].enabled = false
          setUnmuteButton()
        } else {
          setMuteButton()
          this.myVideoStream.getAudioTracks()[0].enabled = true
        }
      },
      playStop() {
        let enabled = this.myVideoStream.getVideoTracks()[0].enabled
        if (enabled) {
          this.myVideoStream.getVideoTracks()[0].enabled = false
          setPlayVideo()
        } else {
          setStopVideo()
          this.myVideoStream.getVideoTracks()[0].enabled = true
        }
      },
      setMuteButton() {
        const html = `
            <i class="fas fa-microphone"></i>
            <span>Mute</span>
          `
        document.querySelector(".main__mute_button").innerHTML = html
      },
      setUnmuteButton() {
        const html = `
            <i class="unmute fas fa-microphone-slash"></i>
            <span>Unmute</span>
          `
        document.querySelector(".main__mute_button").innerHTML = html
      },
      setStopVideo() {
        const html = `
            <i class="fas fa-video"></i>
            <span>Stop Video</span>
          `
        document.querySelector(".main__video_button").innerHTML = html
      },
      setPlayVideo() {
        const html = `
            <i class="stop fas fa-video-slash"></i>
            <span>Play Video</span>
          `
        document.querySelector(".main__video_button").innerHTML = html
      },
      loadData() {
        this.myPeer = new Peer(undefined, {
          path: "/peerjs",
          host: "/",
          port: "3000",
        })

        const videoGrid = document.getElementById("video-grid")
        const myVideo = document.createElement("video")
        myVideo.muted = true

        // Browser stream event
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            this.myVideoStream = stream
            this.addVideoStream(videoGrid, myVideo, stream)

            // [peerjs] Answer call
            this.myPeer.on("call", (call) => {
              call.answer(stream)
              const video = document.createElement("video")
              call.on("stream", (userVideoStream) => {
                this.addVideoStream(videoGrid, video, userVideoStream)
              })
            })

            console.log('getSocket: ', this.getSocket)

            // [socket.io] user connect
            this.getSocket.on("peer-connected", (peerId) => {
              console.log('[SOCKET][user-connected] peerId: ', peerId)
              // start call
              this.connectToNewUser(videoGrid, peerId, stream)
            })

            // [socket.io] message
            this.getSocket.on("createMessage", (message) => {
              $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`)
              this.scrollToBottom()
            })

            // [dom] message input
            // input value
            let text = $("input")
            // when press enter send message
            $("html").keydown((e) => {
              if (e.which == 13 && text.val().length !== 0) {
                this.getSocket.emit("message", text.val())
                text.val("")
              }
            })
          })

        this.getSocket.on("peer-disconnected", (peerId) => {
          if (this.peers[peerId]) this.peers[peerId].close()
        })

        this.myPeer.on("open", (id) => {
          console.log('[myPeer][open] id: ', id)
          const room_id = this.$route.params.room_id
          console.log('[myPeer][open] room_id: ', room_id)
          this.getSocket.emit("join-room", room_id, id)
        })
      },
    },
    mounted() {
      var that = this
      this.loadScript("https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js").then(() => {
        this.loadData()
      })
    },
  }
</script>

<style>
  #video-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  video {
    height: auto;
    object-fit: cover;
    padding: 8px;
  }

  .main {
    height: 100vh;
    display: flex;
  }

  .main__left {
    flex: 0.8;
    display: flex;
    flex-direction: column;
  }

  .main__right {
    flex: 0.2;
  }

  .main__videos {
    flex-grow: 1;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  .main__controls {
    background-color: #1c1e20;
  }

  .main__right {
    background-color: #242324;
    border-left: 1px solid #3d3d42;
  }

  .main__controls {
    color: #d2d2d2;
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  .main__controls__block {
    display: flex;
  }

  .main__controls__button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8px 10px;
    min-width: 80px;
    cursor: pointer;
  }

  .main__controls__button:hover {
    background-color: #343434;
    border-radius: 5px;
  }

  .main__controls__button i {
    font-size: 24px;
  }

  .main__right {
    display: flex;
    flex-direction: column;
  }

  .main__header {
    padding-top: 5px;
    color: #f5f5f5;
    text-align: center;
  }

  .main__chat_window {
    flex-grow: 1;
    overflow-y: auto;
  }

  .messages {
    color: white;
    list-style: none;
  }

  .main__message_container {
    padding: 22px 12px;
    display: flex;
  }

  .main__message_container input {
    flex-grow: 1;
    background-color: transparent;
    border: none;
    color: #f5f5f5;
  }

  .leave_meeting {
    color: #eb534b;
  }

  .unmute,
  .stop {
    color: #cc3b33;
  }
</style>