<template>
    <section>
        <div class="row">
            <div class="col-md-6 m-auto">
                <card>
                    <div slot="header" class="text-center">
                        <h4 style="display: block">Selecione a linguagem do sistema:</h4>
                    </div>
                    <div class="text-center" style="padding: 30px 10px">
                        <div class="radio-group" style="display: inline-block">
                            <radio label="Português" v-model="language" class="float-left" style="margin-right: 7px">
                                Português
                            </radio>
                            <radio label="Inglês" v-model="language" class="float-left" style="margin-right: 7px">
                                Inglês
                            </radio>
                            <radio label="Espanhol" v-model="language" class="float-left">
                                Espanhol
                            </radio>
                        </div>
                    </div>
                </card>
            </div>
        </div>
    </section>
</template>

<script>
  import {Checkbox, Radio, Switch} from 'src/components/index';
  import {DatePicker, Option, Select, Table, TableColumn} from "element-ui";

  export default {
    name: "Language",
    components: {
      Checkbox,
      Radio
    },
    data() {
      return {
        'language': 'portuguese'
      }
    }
  };
</script>

<style>
    .el-dialog {
        width: 50%;
    }

    @media (max-width: 800px) {
        .el-dialog {
            width: 90%;
        }
    }
</style>
