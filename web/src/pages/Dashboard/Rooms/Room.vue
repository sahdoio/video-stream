<template>
  <section>
    <div class="row">
      <div class="col-md-12 m-auto">
        <card>
          <div slot="header" class="text-center">
            <h1>SALA DE AULA</h1>
          </div>
          <!-- <rstp-area></rstp-area> -->
          <!-- <meet-area></meet-area> -->
          <div class="stream-outside-area">
            <iframe src='https://k2ponto.com.br/plataforma/streaming.php?id=314&user=116' width='100%' height='100%' frameborder='0' allowfullscreen></iframe>
          </div>
        </card>
      </div>
    </div>
  </section>
</template>

<script>
  import MeetArea from './MeetArea.vue';
  import RstpArea from './RstpArea.vue';

  export default {
    name: "Room",
    components: {
      MeetArea,
        RstpArea
    },
    data() {
      return {
        loaded: false
      };
    },
    methods: {
     
    },
    mounted() {
      
    },
  };
</script>

<style>  
.stream-outside-area {
    max-width: 1300px;
    width: 100%;
    margin: 0 auto;
    min-height: 800px;
}

.stream-outside-area iframe {
  height: 700px;
}
</style>