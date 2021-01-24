<template>
    <section>
        <modal v-model="visible"
               title="Modal Dispositivos"
               @hide="onHideModal"
               ref="modal"
               id="modalDevices"
               size="lg"
               class="show">

            <h4 slot="title" class="modal-title">{{ this.params.id ? 'Editar Dispositivo' : 'Novo Dispositivo' }}</h4>

            <card>
                <template slot="header">
                    <h4 class="card-title">Geral</h4>
                </template>
                <div>
                    <div class="row">
                        <div class="col-sm-4">
                            <label>Número Serial</label>
                            <fg-input name="serialNumber" type="text" v-model="data.serialNumber"></fg-input>
                        </div>
                        <div class="col-sm-4">
                            <label>Wifi Mac Address</label>
                            <fg-input name="macAddress" 
                                      type="text"
                                      v-mask="'XX:XX:XX:XX:XX:XX'"
                                      masked="true"
                                      v-model="data.macAddress">
                            </fg-input>
                        </div>
                        <div class="col-sm-4">
                            <label>Nome Equipamento</label>
                            <fg-input name="deviceName" type="text" v-model="data.name"></fg-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <label>Modelo</label>
                            <fg-input name="model" type="text" v-model="data.model"></fg-input>
                        </div>
                        <div class="col-sm-4">
                            <label>Tamanho Tela (pol)</label>
                            <fg-input name="screenSize" type="text" v-model="data.sizeScreen"></fg-input>
                        </div>
                        <div class="col-sm-4">
                            <label>Resolução</label>
                            <fg-input name="resolution" type="text" v-model="data.resolution"></fg-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <label>Data da Compra</label>
                            <fg-input>
                                <el-date-picker
                                        type="date"
                                        placeholder="Date Picker"
                                        v-model="data.purchaseDt">
                                </el-date-picker>
                            </fg-input>
                        </div>
                        <div class="col-md-4">
                            <label>Orientação</label>
                            <v-select v-model="data.orientationType" :options="['VERTICAL','HORIZONTAL']"></v-select>
                        </div>
                        <div class="col-sm-2">
                            <label>Ativo?</label>
                            <n-switch v-model="data.active" style="display: block">
                                <i class="now-ui-icons ui-1_check" slot="on"></i>
                                <i class="now-ui-icons ui-1_simple-remove" slot="off"></i>
                            </n-switch>
                        </div>
                        <div class="col-sm-2">
                            <label>Múltiplas telas?</label>
                            <n-switch v-model="data.multiScreen" style="display: block">
                                <i class="now-ui-icons ui-1_check" slot="on"></i>
                                <i class="now-ui-icons ui-1_simple-remove" slot="off"></i>
                            </n-switch>
                        </div>
                    </div>
                </div>
            </card>

            <card v-if="this.params.id">
                <template slot="header">
                    <h4 class="card-title">Onde o dispositivo está?</h4>
                </template>
                <div>
                    <div class="row" v-if="data.allocatedCompany">
                        <div class="col-md-12">
                            <card class="card">
                                <div slot="header"></div>
                                <div class="text-center">
                                    <h4 class="font-weight-bold">{{ data.allocatedCompany.tradingName }}</h4>
                                    <h5>
                                        {{ data.allocatedCompany.companyName }}
                                    </h5>
                                    <h5 v-mask="'##.###.###/####-##'" masked="true">
                                        {{ data.allocatedCompany.revenueNumber }}
                                    </h5>
                                </div>
                            </card>
                        </div>
                    </div>
                    <div v-else class="row">
                        <div class="col-md-12">
                            <card class="card">
                                <div slot="header"></div>
                                <div class="text-center">
                                    <h5>Dispositivo ainda não alocado</h5>
                                </div>
                            </card>
                        </div>
                    </div>
                </div>
            </card>

            <div slot="footer" v-if="readonly"></div>

            <div slot="footer" v-else>
                <button type="button" class="btn btn-default flat" @click="hideModal">
                    <i class="fa fa-times"></i>
                    Cancelar
                </button>
                <button type="button" class="btn btn-success flat" @click="saveData">
                    <i class="fa fa-save"></i>
                    Salvar
                </button>
            </div>
        </modal>
    </section>
</template>
<script>
  import {
    Switch,
  } from 'src/components';

  import {
    DatePicker,
    Select,
  } from 'element-ui';

  import GoogleMapsLoader from 'google-maps';

  GoogleMapsLoader.KEY = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;

  export default {
    name: 'ModalDevices',
    components: {
      Switch,
      [Switch.name]: Switch,
      [DatePicker.name]: DatePicker,
      [Select.name]: Select
    },
    computed: {
      params() {
        return (this.$store.state.modalDevices);
      },
      readonly() {
        return (this.$store.state.modalDevices.readOnly)
      }
    },
    data() {
      return {
        visible: false,
        saved: false,
        data: {},
        defaultData: {
          active: true,
          multiScreen: false
        },
      }
    },
    methods: {
      hideModal() {
        this.$store.state.modalDevices.isVisible = false;
        this.$store.state.modalDevices.id = null;
        this.visible = false;
      },
      onHideModal() {
        if (!this.readonly && this.saved) {
          this.$eventBus.$emit('refreshDevices');
        }
      },
      onOpenModal() {
        this.saved = false;
        if (this.params.id) {
          this.loadData();
        } else {
          this.data = this.defaultData;
          this.visible = true;
        }
      },
      validateResponse(backMessage) {
        return true;

        var message = backMessage;
        switch (true) {
          case message.indexOf('revenueNumber') > -1:
            message = 'Número receita inválido!';
            break;
          case message.indexOf('zipCode') > -1:
            message = 'Cep inválido!';
            break;
          case message.indexOf('tradingName') > -1:
            message = 'Nome fantasia inválido!';
            break;
          case message.indexOf('streetOne') > -1:
            message = 'Rua do endereço inválida!';
            break;
          case message.indexOf('addressNumber') > -1:
            message = 'Número do endereço inválido!';
            break;
          case message.indexOf('phoneNumber') > -1:
            message = 'Número de telefone inválido!';
            break;
          case message.indexOf(ddd) > -1:
            message = 'ddd inválido!';
            break;
        }
        return message;
      },
      dateFormatFront(date) {
        var date = date.split('-'),
          day = date[0],
          month = date[1],
          year = date[2];
        return (year + "-" + month + "-" + day + 'T00:00:00.000Z');
      },
      dateFormatDatabase(date) {
        var date = new Date(date),
          day = date.getDate().toString().padStart(2, '0'),
          month = (date.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
          year = date.getFullYear();
        return (day + "-" + month + "-" + year);
      },
      saveData(event) {
        var that = this;
        this.$validator.validateAll().then(isValid => {
          const finalData = {...that.data};
          // finalData.revenueNumber = that.getOnlyNumbers(finalData.revenueNumber);
          // finalData.ddd = that.getOnlyNumbers(finalData.ddd);
          finalData.purchaseDt = that.dateFormatDatabase(finalData.purchaseDt);

          if (isValid) {
            if (this.params.id) {
              that.$http.put('/devices/' + this.params.id, finalData)
                .then(response => {
                    switch (response.status) {
                      case 200:
                        swal({
                          title: 'Salvo!',
                          text: 'Item salvo com sucesso!',
                          type: 'success',
                          showConfirmButton: false,
                          timer: 2000,
                          onClose: () => {
                            this.saved = true;
                            this.hideModal();
                          }
                        }).catch(swal.noop);
                        break;
                      case 500:
                        swal({
                          title: 'Atenção!',
                          text: "Verifique se os campos estão preenchidos de forma correta",
                          type: 'warning',
                          confirmButtonClass: "btn btn-success"
                        }).catch(swal.noop);
                        break;
                      default:
                        swal("Atenção!", 'Sem resposta do servidor. Entre em contato com o suporte', "warning");
                        break;
                    }
                  }
                )
                .catch(error => {
                  if (error.response) {
                    switch (error.response.status) {
                      case 400:
                        var backMessage = (error.response.data && error.response.data.messages.length > 0) ? error.response.data.messages[0] : "Preencha todos os dados corretamente!";
                        var message = backMessage;
                        this.validateResponse(message);
                        swal({
                          title: 'Atenção!',
                          text: message,
                          type: 'warning',
                          confirmButtonClass: "btn btn-success"
                        }).catch(swal.noop);
                        break;
                      case 500:
                        swal({
                          title: 'Atenção!',
                          text: "Verifique se os campos estão preenchidos de forma correta",
                          type: 'warning',
                          confirmButtonClass: "btn btn-success"
                        }).catch(swal.noop);
                        break;
                      default:
                        swal({
                          title: 'Atenção!',
                          text: "Nossos serviços estão temporariamente inativos. Tente mais tarde",
                          type: 'warning',
                          confirmButtonClass: "btn btn-success"
                        }).catch(swal.noop);
                        break;
                    }
                  } else {
                    console.error(error);
                  }
                });
            } else {
              that.$http.post('/devices', finalData)
                .then(response => {
                  switch (response.status) {
                    case 201:
                      swal({
                        title: 'Salvo!',
                        text: 'Item salvo com sucesso!',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 2000,
                        onClose: () => {
                          this.saved = true;
                          this.hideModal();
                        }
                      }).catch(swal.noop);
                      break;
                    default:
                      swal("Atenção!", 'Sem resposta do servidor. Entre em contato com o suporte', "warning");
                      break;
                  }
                })
                .catch(error => {
                  if (error.response) {
                    switch (error.response.status) {
                      case 400:
                        var backMessage = (error.response.data && error.response.data.messages.length > 0) ? error.response.data.messages[0] : "Preencha todos os dados corretamente!";
                        var message = backMessage;

                        this.validateResponse(message);

                        swal({
                          title: 'Atenção!',
                          text: message,
                          type: 'warning',
                          confirmButtonClass: "btn btn-success"
                        }).catch(swal.noop);

                        break;
                      default:
                        swal({
                          title: 'Atenção!',
                          text: "Nossos serviços estão temporariamente inativos. Tente mais tarde",
                          type: 'warning',
                          confirmButtonClass: "btn btn-success"
                        }).catch(swal.noop);
                        break;
                    }
                  } else {
                    console.error(error);
                  }
                });
            }
          } else {
            swal("Atenção!", 'Preencha todos os campos corretamente', "warning");
          }
        });
      },
      restartMask() {
        var that = this;
        setTimeout(function () {
          const temp = that.data;
          that.data = {};
          that.data = temp;
          that.stopLoading();
        }, 500);
      },
      loadData() {
        try {
          var that = this;
          this.startLoading();
          this.$http
            .get('/devices/' + this.params.id, {
              params: {
                public_key: localStorage.public_key,
              }
            })
            .then(function (response) {
              that.data = response.data;
              that.data.purchaseDt = that.dateFormatFront(that.data.purchaseDt);
              setTimeout(function () {
                that.visible = true;
                that.stopLoading();
              }, 400);
            });
        } catch (error) {
          console.error(error);
        }
      }
    }
    ,
    mounted() {
      // ...
    }
    ,
    watch: {
      params: function (after, before) {
        if (after.isVisible) {
          this.onOpenModal();
        }
      }
    }
  }
</script>
<style>
</style>
