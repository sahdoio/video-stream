<template>
    <section>
        <modal v-model.lazy="visible"
               title="Modal Empresa"
               @hide="onHideModal"
               ref="modal"
               id="modalCompanies"
               size="lg"
               class="show">

            <h4 slot="title" class="modal-title">{{ this.params.id ? 'Editar Empresa' : 'Nova Empresa' }}</h4>

            <card>
                <template slot="header">
                    <h4 class="card-title">Institucional</h4>
                </template>
                <div>
                    <div class="row">
                        <div class="col-sm-4">
                            <label>Número Receita</label>
                            <fg-input name="revenueNumber"
                                      type="text"
                                      v-model.lazy="data.revenueNumber"
                                      v-mask="'##.###.###/####-##'"
                                      masked="true"
                                      v-validate="modelValidations.revenueNumber"></fg-input>
                        </div>
                        <div class="col-sm-4">
                            <label>Razão Social</label>
                            <fg-input name="companyName"
                                      type="text"
                                      v-model.lazy="data.companyName"
                                      :maxlength="255"></fg-input>
                        </div>
                        <div class="col-sm-4">
                            <label>Nome Fantasia</label>
                            <fg-input name="tradingName"
                                      type="text"
                                      v-model.lazy="data.tradingName"
                                      :maxlength="255"></fg-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-2">
                            <label>DDD</label>
                            <fg-input name="ddd"
                                      type="number"
                                      v-model.lazy="data.ddd"
                                      v-mask="'##'"
                                      masked="raw"></fg-input>
                        </div>
                        <div class="col-sm-3">
                            <label>Telefone</label>
                            <fg-input name="phoneNumer"
                                      type="text"
                                      v-model.lazy="data.phoneNumber"
                                      v-mask="['####-####', '#####-####']"
                                      masked="raw"></fg-input>
                        </div>
                        <div class="col-sm-4">
                            <label>Contato - Nome</label>
                            <fg-input name="contactName"
                                      type="text"
                                      v-model.lazy="data.contactName"
                                      :maxlength="255"></fg-input>
                        </div>
                        <div class="col-sm-3">
                            <label>Contato - E-mail</label>
                            <fg-input name="email"
                                      type="email"
                                      v-model.lazy="data.email"
                                      :maxlength="255"></fg-input>
                        </div>
                    </div>
                </div>
            </card>

            <card v-if="data.address">
                <template slot="header">
                    <h4 class="card-title">Endereço</h4>
                </template>
                <div>
                    <div class="row">
                        <div class="col-sm-6">
                            <label>Logradouro</label>
                            <fg-input name="streetOne"
                                      type="text"
                                      v-model.lazy="data.address.streetOne"
                                      :maxlength="255"></fg-input>
                        </div>
                        <div class="col-sm-3">
                            <label>Número</label>
                            <fg-input name="number"
                                      type="text"
                                      v-model.lazy="data.address.number"
                                      :maxlength="10"></fg-input>
                        </div>
                        <div class="col-sm-3">
                            <label>CEP</label>
                            <fg-input name="zipCode"
                                      type="text"
                                      v-model.lazy="data.address.zipCode"
                                      v-mask="'#####-###'"
                                      masked="raw"></fg-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <label>Cidade</label>
                            <fg-input name="city"
                                      type="text"
                                      v-model.lazy="data.address.city"
                                      :maxlength="255"></fg-input>
                        </div>
                        <div class="col-sm-4">
                            <label>Estado</label>
                            <fg-input name="province"
                                      type="text"
                                      v-model.lazy="data.address.province"
                                      :maxlength="255"></fg-input>
                        </div>
                        <div class="col-sm-4">
                            <label>País</label>
                            <fg-input name="country"
                                      type="text"
                                      v-model.lazy="data.address.country"
                                      :maxlength="255"></fg-input>
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
  export default {
    name: 'ModalCompanies',
    computed: {
      params() {
        return (this.$store.state.modalCompanies);
      },
      readonly() {
        return (this.$store.state.modalCompanies.readOnly)
      }
    },
    data() {
      return {
        visible: false,
        saved: false,
        data: {},
        defaultData: {
          revenueNumber: '',
          ddd: '',
          phoneNumber: '',
          address: {
            zipCode: ''
          }
        },
        modelValidations: {
          revenueNumber: {
            max: 18,
            min: 18,
            required: true
          },
          required: {
            required: true
          },
          email: {
            email: true
          },
          number: {
            numeric: true
          },
          url: {
            url: true
          },
          equalToSource: {
            required: true
          },
          equalToDest: {
            required: true,
            confirmed: 'equalToSource'
          }
        }
      }
    },
    methods: {
      hideModal() {
        this.$store.state.modalCompanies.isVisible = false;
        this.$store.state.modalCompanies.id = null;
        this.visible = false;
      },
      onHideModal() {
        if (!this.readonly && this.saved) {
          this.$eventBus.$emit('refreshCompanies');
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
      saveData(event) {
        var that = this;
        this.$validator.validateAll().then(isValid => {
          const finalData = {...that.data};
          finalData.revenueNumber = that.getOnlyNumbers(finalData.revenueNumber);
          finalData.ddd = that.getOnlyNumbers(finalData.ddd);
          finalData.phoneNumber = that.getOnlyNumbers(finalData.phoneNumber);
          finalData.address.zipCode = that.getOnlyNumbers(finalData.address.zipCode);

          if (isValid) {
            if (this.params.id) {
              that.$http.put('/companies/' + this.params.id, finalData)
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
              that.$http.post('/companies', finalData)
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
        })
        ;
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
            .get('/companies/' + this.params.id, {
              params: {
                public_key: localStorage.public_key,
              }
            })
            .then(function (response) {
              that.data = response.data;
              setTimeout(function () {
                that.visible = true;
                that.stopLoading();
              }, 400);
            });
        } catch (error) {
          console.error(error);
        }
      }
    },
    mounted() {
      // ...
    },
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
