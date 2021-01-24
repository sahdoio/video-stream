<template>
    <section>
        <modal v-model="visible"
               title="Modal Publicidades"
               @hide="onHideModal"
               ref="modal"
               id="modalAds"
               size="lg"
               :class="{'show':true,'modalReadOnly':this.params.readOnly ? true : false}">

            <h4 slot="title" class="modal-title"></h4>

            <card>
                <template slot="header"></template>
                <div>
                    <div class="row">
                        <div class="col-md-4">
                            <label style="display: block">Nome</label>
                            <p>{{ data.name || '-'}}</p>

                            <label style="display: block">Empresa da Publicidade</label>
                            <p>{{ data.advertiserCompany || '-'}}</p>

                            <label style="display: block">Categoria</label>
                            <p>{{ data.category || '-'}}</p>

                            <div class="row">
                                <div class="col-md-12">
                                    <label>Data Início</label>
                                    <p>{{ formatDate(data.initialDt) }}</p>
                                </div>
                                <div class="col-md-12">
                                    <label>Data Fim</label>
                                    <p>{{ formatDate(data.endDt) }}</p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <label style="display: block">Duração da exibição na grade (em segundos)</label>
                                    <p>{{ data.presentationTime || '-'}}</p>
                                </div>                               
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <label style="display: block">Orientação</label>
                                    <p>{{ data.orientationType || '-'}}</p>
                                </div>
                                <div class="col-md-12" style="margin-top: 15px">
                                    <label style="display: block">Layout</label>
                                    <p>{{ getLayout(data.layoutType) || '-' }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <card class="card">
                                <div slot="header" class="text-center">
                                    <label style="display: block">Visualização - Dispositivo</label>
                                </div>
                                <div v-if="visible" class="body-content" style="min-height: 270px">
                                    <div v-show="dropifyLoaded" class="device-view">
                                        <div class="vertical" v-show="data.orientationType == 'VERTICAL'">
                                            <div class="full_media" v-show="data.layoutType == 'BODY'">
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''" disabled="disabled"/>
                                            </div>
                                            <div class="two_media" v-show="data.layoutType == 'BODY_FOOTER'">
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''" disabled="disabled"/>
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'FOOTER')" :data-default-file="loadedMedias.FOOTER ? loadedMedias.FOOTER.url : ''" disabled="disabled"/>
                                            </div>
                                            <div class="three_media" v-show="data.layoutType == 'BODY_FOOTER_HEADER'">
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''" disabled="disabled"/>
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'FOOTER')" :data-default-file="loadedMedias.FOOTER ? loadedMedias.FOOTER.url : ''" disabled="disabled"/>
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'HEADER')" :data-default-file="loadedMedias.HEADER ? loadedMedias.HEADER.url : ''" disabled="disabled"/>
                                            </div>
                                        </div>
                                        <div class="horizontal" v-show="data.orientationType == 'HORIZONTAL'">
                                            <div class="full_media" v-show="data.layoutType == 'BODY'">
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''" disabled="disabled"/>
                                            </div>
                                            <div class="three_media row"
                                                 v-show="data.layoutType == 'BODY_FOOTER_SIDE'"
                                                 style="padding: 0; margin: 0">
                                                <div class="col col-md-8" style="padding: 0; margin: 0">
                                                    <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''" disabled="disabled"/>
                                                </div>
                                                <div class="col col-md-4" style="padding: 0; margin: 0">
                                                    <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'FOOTER')" :data-default-file="loadedMedias.FOOTER ? loadedMedias.FOOTER.url : ''" disabled="disabled"/>
                                                </div>
                                                <div class="col col-md-12" style="padding: 0; margin: 0">
                                                    <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'SIDE')" :data-default-file="loadedMedias.SIDE ? loadedMedias.SIDE.url : ''" disabled="disabled"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-show="!dropifyLoaded" class="dropify-loading">Loading...</div>
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

  import {Checkbox, Radio} from 'src/components/index';

  import {
    Select,
    Option,
    Table,
    TableColumn,
    DatePicker
  } from 'element-ui';

  import GoogleMapsLoader from 'google-maps';

  GoogleMapsLoader.KEY = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;

  export default {
    name: 'ModalAds',
    components: {
      Switch,
      [Switch.name]: Switch,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [DatePicker.name]: DatePicker,
      Checkbox,
      Radio
    },
    computed: {
      params() {
        return (this.$store.state.modalAds);
      },
      readonly() {
        return (this.$store.state.modalAds.readOnly)
      },
      orientation() {
        return this.data.orientationType;
      },
      layout() {
        return this.data.layoutType;
      }
    },
    data() {
      return {
        visible: false,
        saved: false,
        data: {},
        defaultData: {
          name: null,
          orientationType: 'VERTICAL',
          layoutType: 'BODY'
        },
        timeOptions: [
          {
            "value": 10,
            "label": "10"
          },
          {
            "value": 20,
            "label": "20"
          },
          {
            "value": 30,
            "label": "30"
          }
        ],
        filesToUpload: {},
        loadedMedias: {
          BODY: null,
          FOOTER: null,
          HEAD: null,
          SIDE: null
        },
        defaultLoadedMedias: {
          BODY: null,
          FOOTER: null,
          HEAD: null,
          SIDE: null
        },
        watchOn: false,
        dropifyLoaded: false
      }
    },
    methods: {
      hideModal() {
        this.$store.state.modalAds.isVisible = false;
        this.$store.state.modalAds.id = null;
        this.visible = false;
        this.data = this.defaultData;
        this.loadedMedias = this.defaultLoadedMedias;
      },
      onHideModal() {
        if (!this.readonly && this.saved) {
          this.$eventBus.$emit('refreshAds');
        }
        this.hideModal();
      },
      onOpenModal() {
        this.saved = false;
        this.visible = false;
        this.dropifyLoaded = false;

        if (this.params.id) {
          this.loadData();
        } else {
          this.data = this.defaultData;
          this.visible = true;
          var that = this;
          setTimeout(function () {
            that.setupDropify();
          }, 400);
        }
      },
      setupDropify(option = false, reset = true) {
        if (option == 'HORIZONTAL' || option == 'VERTICAL') {
          this.data.layoutType = 'BODY';
        }

        if (reset) {
          // reset all files
          this.filesToUpload = {};
          // clear dropify
          $('.dropify-clear').click();
        }

        $('.dropify').dropify({
          messages: {
            'default': '800x200',
            'replace': 'Arraste uma mídia ou clique para substituir',
            'remove': 'Remove',
            'error': 'Formato incorreto ou tamanho do arquivo acima de 25MB'
          }
        });

        this.watchOn = true;
        var that = this;
        setTimeout(function () {
          that.dropifyLoaded = true;
        }, 1000);
      },
      getLayout(layoutType) {
        switch(layoutType) {
          case 'BODY':
            return ''
            break;
          case 'BODY_FOOTER':
            return '2 mídias'
            break;
          case 'BODY_FOOTER_HEADER':
            return '3 mídias'
            break;
          case 'BODY_FOOTER_SIDE':
            return '3 mídias'
            break;
          default:
            return '-'
            break;
        }
      },
      dateFormatFront(date) {
        var date = date.split('T')[0].split('-'),
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
        return (day + "-" + month + "-" + year + 'T00:00:00Z');
      },
      onSelectFile(event, type) {
        this.filesToUpload[type] = event.target.files[0];
      },
      saveData() {
        var that = this;
        this.$validator.validateAll().then(isValid => {
          const finalData = {...that.data};
          finalData.initialDt = that.dateFormatDatabase(finalData.initialDt);
          finalData.endDt = that.dateFormatDatabase(finalData.endDt);
          
          this.startLoading();

          if (isValid) {
            if (this.params.id) {              
              that.$http.put('/advertisements/' + this.params.id, finalData)
                .then(response => {
                    switch (response.status) {
                      case 200:
                        that.saveMedias(this.params.id);
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
              that.$http.post('/advertisements', finalData)
                .then(response => {
                  switch (response.status) {
                    case 201:
                      that.saveMedias(response.data.id);
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
            this.startLoading();
            swal("Atenção!", 'Preencha todos os campos corretamente', "warning");
          }
        });
      },
      async saveMedias(adId) {
        let processSuccess = true;
        for (var type in this.filesToUpload) {
          var formData = new FormData();
          formData.append('file', this.filesToUpload[type], this.filesToUpload[type].name);
          let status = await this.$http.post(`/advertisements/${adId}/medias?type=${type}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          })
            .then(response => {
              switch (response.status) {
                case 200:
                  return true;
                  break;
                default:
                  swal("Atenção!", 'Sem resposta do servidor. Entre em contato com o suporte', "warning");
                  break;
              }
              return false;
            })
            .catch(error => {
              return false;
            });
          if (!status) {
            processSuccess = false;
            break;
          }
        }
        if (processSuccess) {
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
        } else {
          swal({
            title: 'Oops!',
            text: "Não foi possível carregar as mídias. Tente mais tarde ou entre em contato com o suporte",
            type: 'error',
            confirmButtonClass: "btn btn-success"
          }).catch(swal.noop);
        }

        this.stopLoading();
      },
      prepareMedias(medias) {
        var finalObj = {};
        for (var i = 0; i < medias.length; i++) {
          var media = medias[i];
          finalObj[media.positionMedia] = media;
        }
        return finalObj;
      },
      loadData() {
        try {
          var that = this;
          this.startLoading();
          this.$http
            .get('/advertisements/' + this.params.id, {
              params: {
                public_key: localStorage.public_key,
              }
            })
            .then(function (response) {
              that.data = response.data;
              that.data.initialDt = that.dateFormatFront(that.data.initialDt);
              that.data.endDt = that.dateFormatFront(that.data.endDt);
              that.loadedMedias = that.prepareMedias(that.data.medias);
              that.visible = true;

              console.log('prepared medias: ', that.loadedMedias);

              setTimeout(function () {
                that.setupDropify(false, false);
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
      },
      orientation: function (after, before) {
        if (this.watchOn)
            this.setupDropify(after);
      },
      layout: function (after, before) {
        if (this.watchOn)
            this.setupDropify(after);
      }
    }
  }
</script>
<style lang="scss">
    $vertical-width: 380px;
    $vertical-height: 520px;
    $horizontal-width: 520px;
    $horizontal-height: 380px;
    $padding-total: 20px;

    #modalAds {
        .dropify-preview {
            width: 100% !important;
            height: 100% !important;

            img, video {
                width: 100% !important;
                height: 100% !important;
            }
        }

        .dropify-loading {
            margin: 0 auto;
            display: block;
            text-align: center;
            margin-top: 45%;
            font-weight: bold;
        }

        .device-view {
            display: flex;
            align-items: center;

            .vertical {
                width: $vertical-width;
                height: $vertical-height;

                .full_media {
                    .dropify-wrapper {
                        height: $vertical-height - $padding-total;
                    }
                }

                .two_media {
                    .dropify-wrapper {
                        &:nth-child(1) {
                            height: (($vertical-height - $padding-total) * 0.7) !important;
                        }

                        &:nth-child(2) {
                            height: (($vertical-height - $padding-total) * 0.3) !important;
                        }
                    }
                }

                .three_media {
                    .dropify-wrapper {
                        &:nth-child(1) {
                            height: (($vertical-height - $padding-total) * 0.2) !important;
                        }

                        &:nth-child(2) {
                            height: (($vertical-height - $padding-total) * 0.6) !important;
                        }

                        &:nth-child(3) {
                            height: (($vertical-height - $padding-total) * 0.2) !important;
                        }
                    }
                }
            }

            .horizontal {
                width: $horizontal-width;
                height: $horizontal-height;

                .full_media {
                    .dropify-wrapper {
                        height: $horizontal-height - $padding-total;
                    }
                }

                .three_media {
                    .col {
                        &:nth-child(1) {
                            .dropify-wrapper {
                                height: (($horizontal-height - $padding-total) * 0.6) !important;
                            }
                        }

                        &:nth-child(2) {
                            .dropify-wrapper {
                                height: (($horizontal-height - $padding-total) * 0.6) !important;
                            }
                        }

                        &:nth-child(3) {
                            .dropify-wrapper {
                                height: (($horizontal-height - $padding-total) * 0.4) !important;
                            }
                        }
                    }
                }
            }

            .vertical,
            .horizontal {
                background: #000;
                padding: 10px;
                border-radius: 12px;
                overflow: hidden;
                margin: 0 auto;
            }
        }
    }
</style>
