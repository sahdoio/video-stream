<template>
    <div id="dashoboard" class="container">
        <div class="row" style="margin-top: 5%">
            <div class="col-md-5 ml-auto">
                <card>
                    <div class="text-center">
                        <n-button type="primary" style="width: 100%; height:170px; border-radius:20px; margin: 0px" onclick="window.location.href='/#/rooms'">
                            <i class="now-ui-icons design-2_ruler-pencil" style="font-size: 40px"></i>
                            <p class="card-text font-weight-bold">SALAS</p>
                        </n-button>
                    </div>
                </card>
            </div>
            <div class="col-md-5 mr-auto">
                <card>
                    <div class="text-center">
                        <n-button type="primary" style="width: 100%; height:170px; border-radius:20px; margin: 0px" onclick="window.location.href='/#/devices'">
                            <i class="now-ui-icons tech_tablet" style="font-size: 40px"></i>
                            <p class="card-text font-weight-bold">DISPOSITIVOS</p>
                        </n-button>
                    </div>
                </card>
            </div>          
        </div>
    </div>
</template>
<script>
  export default {
    methods: {
      logOut() {
        localStorage.removeItem('logged');
        localStorage.removeItem('token');
        localStorage.removeItem('public_key');
        localStorage.removeItem('user_id');

        this.$router.push({
          name: 'login'
        });
      }
    }
  };
</script>
<style>
    #dashoboard .el-dialog {
        width: 50%;
    }

    @media (max-width: 800px) {
        #dashoboard  .el-dialog {
            width: 90%;
        }
    }

    #dashoboard .card {
        border-radius: 20px;
    }

    #dashoboard .card .card-body {
        padding: 25px;
    }
</style>
