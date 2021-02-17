<template>
  <div class="stream-area">
    <div id="cam1" class="video-wrapper">
      <canvas class="camera" id="videoStream1" width="640" height="360"></canvas>
    </div>
    <div id="cam2" class="video-wrapper">
      <canvas class="camera" id="videoStream2" width="640" height="360"></canvas>
    </div>
  </div>
</template>

<script>
import MeetArea from "./MeetArea.vue";

export default {
  name: "RstpArea",
  components: {
    MeetArea,
  },
  data() {
    return {
      loaded: false,
    };
  },
  methods: {
    loadStream() {
      var canvas1 = document.getElementById("videoStream1");
      var player1 = new JSMpeg.Player("ws://localhost:9991", {
        canvas: canvas1, // Canvas should be a canvas DOM element
      });

      var canvas2 = document.getElementById("videoStream2");
      var player2 = new JSMpeg.Player("ws://localhost:9992", {
        canvas: canvas2, // Canvas should be a canvas DOM element
      });
    },
  },
  mounted() {
    var that = this;
    this.loadScript("js/jsmpeg.min.js").then(() => {
      that.loadStream();
    });
  },
};
</script>

<style>
.stream-area {
  position: relative;
  margin: 0px 20px;
  display: flex;
  padding: 40px 20px;
}

.video-wrapper {
  width: 100%;
  display: block;
  padding: 20px;
}

canvas {
  display: block;
  float: left;
  transform: scale(1);
  transform-origin: 0% 0% 0px;
}

.camera {
  display: block;
  margin-left: 10px;
  padding: 0px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>
