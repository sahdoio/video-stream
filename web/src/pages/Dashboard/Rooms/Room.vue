<template>
  <section>
    <div class="row">
      <div class="col-md-12 m-auto">
        <card>
          <div slot="header" class="text-center">
            <!-- <h1>SALA DE AULA</h1> -->
          </div>
          <!-- <rstp-area></rstp-area> -->
          <meet-area></meet-area>
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
</style>