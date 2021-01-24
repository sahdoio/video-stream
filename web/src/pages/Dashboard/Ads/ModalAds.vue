<template>
    <section>
        <modal v-model="visible"
               title="Modal Publicidades"
               @hide="onHideModal"
               ref="modal"
               id="modalAds"
               size="lg"
               class="show">

            <h4 slot="title" class="modal-title">{{ this.params.id ? 'Editar Publicidade' : 'Nova Publicidade' }}</h4>            

            <card>
                <template slot="header"></template>
                <div>
                    <div class="row">
                        <div class="col-md-4">
                            <label style="display: block">Nome</label>
                            <fg-input name="name" type="text" v-model="data.name"></fg-input>

                            <label style="display: block">Empresa da Publicidade</label>
                            <fg-input name="advertiserCompany" type="text" v-model="data.advertiserCompany"></fg-input>

                            <label style="display: block">Categoria</label>
                            <fg-input name="category" type="text" v-model="data.category"></fg-input>

                            <div class="row">
                                <div class="col-md-6">
                                    <label>Data Início</label>
                                    <fg-input>
                                        <el-date-picker
                                                type="date"
                                                placeholder="Date Picker"
                                                v-model="data.initialDt">
                                        </el-date-picker>
                                    </fg-input>
                                </div>
                                <div class="col-md-6">
                                    <label>Data Fim</label>
                                    <fg-input>
                                        <el-date-picker
                                                type="date"
                                                placeholder="Date Picker"
                                                v-model="data.endDt">
                                        </el-date-picker>
                                    </fg-input>
                                </div>
                            </div>

                            <div class="row">
                                <div v-if="hasVideo > 0" class="col-md-12">
                                  <label style="display: block;color: white;font-size: 9px;background: #009da7;padding: 3px 10px;border-radius: 5px;">*Tempo do maior vídeo foi definido para esta publicidade</label>
                                </div>
                                <div class="col-md-6">
                                    <label style="display: block">Duração da exibição na grade (em segundos)</label>
                                    <el-select 
                                      class="select-primary"
                                      size="large"
                                      placeholder="-"
                                      :disabled="hasVideo > 0"
                                      v-model="data.presentationTime">
                                        <el-option v-for="option in timeOptions"
                                                   class="select-primary"
                                                   :value="option.value"
                                                   :label="option.label"
                                                   :key="option.label">
                                        </el-option>
                                    </el-select>                                    
                                </div>
                                <div class="col-md-6">
                                    <label style="display: block">Alterar essa informação fará com que seja alterado o
                                        tempo de exibição desta mídia em todas as grades em que ela foir
                                        inserida</label>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <label style="display: block">Orientação</label>
                                    <radio label="VERTICAL" v-model="data.orientationType" class="float-left"
                                           style="margin-right: 7px">
                                        Vertical
                                    </radio>
                                    <radio label="HORIZONTAL" v-model="data.orientationType" class="float-left">
                                        Horizontal
                                    </radio>
                                </div>
                                <div class="col-md-12" style="margin-top: 15px">
                                    <label style="display: block">Layout</label>
                                    <radio label="BODY"
                                           v-model="data.layoutType"
                                           class="float-left"
                                           style="margin-right: 7px">
                                        Full
                                    </radio>
                                    <radio v-if="data.orientationType == 'VERTICAL'"
                                           label="BODY_FOOTER"
                                           v-model="data.layoutType"
                                           class="float-left"
                                           style="margin-right: 7px">
                                        2 mídias
                                    </radio>
                                    <radio v-if="data.orientationType == 'VERTICAL'"
                                           label="BODY_FOOTER_HEADER"
                                           v-model="data.layoutType"
                                           class="float-left">
                                        3 mídias
                                    </radio>
                                    <radio v-else
                                           label="BODY_FOOTER_SIDE"
                                           v-model="data.layoutType"
                                           class="float-left">
                                        3 mídias
                                    </radio>
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
                                            <div :class="['full_media',{'active':data.orientationType == 'VERTICAL' && data.layoutType == 'BODY'}]" v-show="data.layoutType == 'BODY'">
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''"/>
                                            </div>
                                            <div :class="['two_media',{'active':data.orientationType == 'VERTICAL' && data.layoutType == 'BODY_FOOTER'}]" v-show="data.layoutType == 'BODY_FOOTER'">
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''"/>
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'FOOTER')" :data-default-file="loadedMedias.FOOTER ? loadedMedias.FOOTER.url : ''"/>
                                            </div>
                                            <div :class="['three_media', {'active':data.orientationType == 'VERTICAL' && data.layoutType == 'BODY_FOOTER_HEADER'}]" v-show="data.layoutType == 'BODY_FOOTER_HEADER'">
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'HEADER')" :data-default-file="loadedMedias.HEADER ? loadedMedias.HEADER.url : ''"/>
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''"/>
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'FOOTER')" :data-default-file="loadedMedias.FOOTER ? loadedMedias.FOOTER.url : ''"/>
                                            </div>
                                        </div>
                                        <div class="horizontal" v-show="data.orientationType == 'HORIZONTAL'">
                                            <div :class="['full_media', {'active':data.orientationType == 'HORIZONTAL' && data.layoutType == 'BODY'}]" v-show="data.layoutType == 'BODY'">
                                                <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''"/>
                                            </div>
                                            <div :class="['three_media', 'row', {'active':data.orientationType == 'HORIZONTAL' && data.layoutType == 'BODY_FOOTER_SIDE'}]"
                                                 v-show="data.layoutType == 'BODY_FOOTER_SIDE'"
                                                 style="padding: 0; margin: 0">
                                                <div class="col col-md-8" style="padding: 0; margin: 0">
                                                    <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'BODY')" :data-default-file="loadedMedias.BODY ? loadedMedias.BODY.url : ''"/>
                                                </div>
                                                <div class="col col-md-4" style="padding: 0; margin: 0">
                                                    <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'FOOTER')" :data-default-file="loadedMedias.FOOTER ? loadedMedias.FOOTER.url : ''"/>
                                                </div>
                                                <div class="col col-md-12" style="padding: 0; margin: 0">
                                                    <input type="file" class="dropify" data-max-file-size="25M" @change="onSelectFile($event, 'SIDE')" :data-default-file="loadedMedias.SIDE ? loadedMedias.SIDE.url : ''"/>
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
        hasVideo: 0,
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
        this.hasVideo = 0;

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
        setTimeout(() => {
          this.dropifyLoaded = true;
          this.checkVideo((qty) => '');
        }, 400);
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
      checkVideo(callback) {
        var verifyVideo = () => {
          var videoQty = document.querySelectorAll('#modalAds .active .dropify-preview .dropify-render video').length;
          if (videoQty) {
            this.hasVideo = videoQty;
          } else {
            this.hasVideo = 0;
          }
          return videoQty;
        };

        if (this.dropifyLoaded) {
          setTimeout(() => {            
            callback(verifyVideo());
          }, 200);     
        } else {
          setTimeout(() => {
            callback(verifyVideo());
          }, 1000);     
        }
      },
      onSelectFile(event, type) {
        var target = event.target;
        var file = target.files[0];
        if (this.checkFileRules(target, file, type)) {
          this.filesToUpload[type] = file;
          if (file.type == 'video/mp4') {
            this.startLoading();
            // get video duration
            setTimeout(() => {              
              var videoPreview = target.closest('.dropify-wrapper').querySelector('.dropify-preview video');
              var duration = Math.ceil(videoPreview.duration);
              this.filesToUpload[type].duration = duration;
              this.data.presentationTime = this.getGreatestTime();
              this.stopLoading();
            }, 1000);                

            this.checkVideo((qty) => '');
          } else {
            this.checkVideo((qty) => {
              if (qty) {
                this.data.presentationTime = this.getGreatestTime();
              } else {
                this.data.presentationTime = null;
              }
            });          
          }        
        }
      },
      checkFileRules(target, file, type) {
        switch (true) {
          case this.data.layoutType == 'BODY_FOOTER_HEADER' && type == 'HEADER':
          case this.data.layoutType == 'BODY_FOOTER_HEADER' && type == 'FOOTER':
            if (file.type != 'image/jpeg' && file.type != 'image/png') {
              swal("Atenção!", 'Esta secção aceita apenas arquivos PNG ou JPEG', "warning");
              var button = target.closest('.dropify-wrapper').querySelector('.dropify-clear');
              delete this.filesToUpload['BODY_FOOTER_HEADER'];
              $(button).click();
              return false;
            }
            break;
          case this.data.layoutType == 'BODY_FOOTER_HEADER' && type == 'BODY':
            if (file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'video/mp4') {
              swal("Atenção!", 'Esta secção aceita apenas arquivos PNG, JPEG ou MP4', "warning");
              var button = target.closest('.dropify-wrapper').querySelector('.dropify-clear');
              delete this.filesToUpload['BODY_FOOTER_HEADER'];
              $(button).click();
              return false;
            }
            break;
          case this.data.layoutType == 'BODY_FOOTER_SIDE' && type == 'SIDE':
          case this.data.layoutType == 'BODY_FOOTER_SIDE' && type == 'FOOTER':
            if (file.type != 'image/jpeg' && file.type != 'image/png') {
              swal("Atenção!", 'Esta secção aceita apenas arquivos PNG ou JPEG', "warning");
              var button = target.closest('.dropify-wrapper').querySelector('.dropify-clear');
              delete this.filesToUpload['BODY_FOOTER_SIDE'];
              $(button).click();
              return false;
            }
            break;
          case this.data.layoutType == 'BODY_FOOTER_SIDE' && type == 'BODY':
            if (file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'video/mp4') {
              swal("Atenção!", 'Esta secção aceita apenas arquivos PNG, JPEG ou MP4', "warning");
              var button = target.closest('.dropify-wrapper').querySelector('.dropify-clear');
              delete this.filesToUpload['BODY_FOOTER_SIDE'];
              $(button).click();
              return false;
            }
            break;
          case this.data.layoutType == 'BODY_FOOTER' && type == 'FOOTER':
            if (file.type != 'image/jpeg' && file.type != 'image/png') {
              swal("Atenção!", 'Esta secção aceita apenas arquivos PNG ou JPEG', "warning");
              var button = target.closest('.dropify-wrapper').querySelector('.dropify-clear');
              delete this.filesToUpload['BODY_FOOTER'];
              $(button).click();
              return false;
            }
            break;
          case this.data.layoutType == 'BODY_FOOTER' && type == 'BODY':
            if (file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'video/mp4') {
              swal("Atenção!", 'Esta secção aceita apenas arquivos PNG, JPEG ou MP4', "warning");
              var button = target.closest('.dropify-wrapper').querySelector('.dropify-clear');
              delete this.filesToUpload['BODY_FOOTER'];
              $(button).click();
              return false;
            }
            break;
          case this.data.layoutType == 'BODY' && type == 'BODY':
            if (file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'video/mp4') {
              swal("Atenção!", 'Esta secção aceita apenas arquivos PNG, JPEG ou MP4', "warning");
              var button = target.closest('.dropify-wrapper').querySelector('.dropify-clear');
              delete this.filesToUpload['BODY'];
              $(button).click();
              return false;
            }
            break;
        }
        
        var size = Math.ceil(file.size/1000000);

        if (size > 25) {
          swal("Atenção!", 'Limite máximo para upload é 25MB', "warning");
          return false;
        }

        return true;
      },
      checkMedias() {
        var medias = document.querySelectorAll('#modalAds .active .dropify-preview .dropify-render');
        if (!medias.length) return false;
        for (var i = 0; i < medias.length; i++) {
          var media = medias[i];
          if (!media.hasChildNodes()) {
            return false;
          }
        }          
        return true;
      },
      getGreatestTime() {
        var videos = document.querySelectorAll('#modalAds .active .dropify-preview .dropify-render video');
        if (!videos.length) return this.data.presentationTime;
        var greatestTime = 0;
        for (var i = 0; i < videos.length; i++) {
          var video = videos[i];
          if (video.duration > greatestTime) {
            greatestTime = video.duration;
          }
        }          
        return Math.ceil(greatestTime);
      },
      getPresentationTime() {
        var greatestTime = 0;
        for (var type in this.filesToUpload) {
          var file = this.filesToUpload[type];
          var duration = file.duration;
          if (duration > greatestTime) {
            greatestTime = duration;
          }
        }
        return greatestTime;
      },
      saveData() {
        var that = this;
        this.$validator.validateAll().then(isValid => {
          const finalData = {...that.data};
          finalData.initialDt = that.dateFormatDatabase(finalData.initialDt);
          finalData.endDt = that.dateFormatDatabase(finalData.endDt);
          finalData.presentationTime = that.getGreatestTime();

          if (finalData.presentationTime < 5) {
            swal("Atenção!", 'Escolha a duração da publicidade', "warning");
            return false;
          }

          if (!this.checkMedias()) {
            swal("Atenção!", 'Preencha todas as mídas da publicidade', "warning");
            return false;
          }
          
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
          var file = this.filesToUpload[type];
          formData.append('file', file, file.name);
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
