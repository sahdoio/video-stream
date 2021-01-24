<template>
    <section>
        <modal v-model.lazy="visible"
              :title="(params.id ? 'Editar Menu' : 'Adicionar Menu')" 
              @hide="onHideModal"
              ref="modal"
              id="modalEditMenu"
              class="show">

            <card>
                <template slot="header">
                </template>
                <div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="menu-wrapper">
                                <div v-if="visible" >
                                    <div v-show="dropifyLoaded">
                                        <input 
                                            type="file" 
                                            class="dropify" data-max-file-size="25M" :data-default-file="data.file ? data.file : ''" 
                                            @change="onSelectFile($event)"/>
                                    </div>
                                    <div v-show="!dropifyLoaded">
                                        <div class="media-loading">
                                            <h3>Carregando...</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    name: 'ModalEditMenu',
    computed: {
      params() {
        return (this.$store.state.modalEditMenu);
      },
      readonly() {
        return (this.$store.state.modalEditMenu.readOnly)
      }
    },
    data() {
      return {
        visible: false,
        saved: false,
        dropifyLoaded: false,
        data: {},
        defaultData: {
          file: null,
          order: null       
        }
      }
    },
    methods: {
      hideModal() {
        this.$store.state.modalEditMenu.isVisible = false;
        this.$store.state.modalEditMenu.id = null;
        this.$store.state.modalEditMenu.companyId = null;
        this.$store.state.modalEditMenu.menuMediaLink = null;
        this.visible = false;
        this.data.file = null;
        this.data.order = null;
      },
      onHideModal() {
        if (!this.readonly && this.saved) {
          this.$eventBus.$emit('refreshCompanyMenus');
        }
      },
      onOpenModal() {
        this.saved = false;   
        this.dropifyLoaded = false;
        this.data.file = null;
        this.data.order = null;

        if (this.params.id) {
          this.loadData();
        } else {          
          this.visible = true;
          this.data.order = this.params.order;
          var that = this;
          setTimeout(function () {
            that.setupDropify(true);
          }, 400);
        }
      },
      setupDropify(reset = true) {       
        if (reset) {
          // reset all files
          this.filesToUpload = {};
          // clear dropify
          $('.dropify-clear').click();
        }

        $('.dropify').dropify({
          messages: {
            'default': 'Menu',
            'replace': 'Arraste uma mídia ou clique para substituir',
            'remove': 'Remove',
            'error': 'Formato incorreto ou tamanho do arquivo acima de 25MB'
          }         
        });

        this.watchOn = true;
        var that = this;
        setTimeout(function () {
          that.dropifyLoaded = true;
        }, 200);
      },
      onSelectFile(event) {        
        this.data.file = event.target.files[0];
        console.log('[onSelectFile] data: ', this.data);
      },
      saveData(event) {
        var that = this;        

        this.startLoading();

        var formData = new FormData();
        var isFile = typeof this.data.file.name == 'string';
        if (isFile) {
          formData.append('file', this.data.file, this.data.file.name);
        }
        formData.append('order', this.data.order);
        
        if (this.params.id) {
          var endpoint = '/companies/' + this.params.companyId + '/menu-pages/' + this.params.id;
          that.$http.put(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
            .then(response => {
              this.stopLoading();
              if (that.httpCheckStatus(response)) {
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
              }               
            })
            .catch(error => {
                this.stopLoading();
                that.httpCheckStatus(error.response);                
            });
        } else {
          var endpoint = '/companies/' + this.params.companyId + '/menu-pages';
          that.$http.post(endpoint, formData, {            
            headers: {
                'Content-Type': 'multipart/form-data'
            },
          })
            .then(response => {
              this.stopLoading();
              if (that.httpCheckStatus(response)) {                
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
              }
            })
            .catch(error => {
              this.stopLoading();
              that.httpCheckStatus(error.response);                
            });
        }       
      },
      loadData() {
        var that = this;

        this.data.file = this.params.menuMediaLink;
        this.data.order = this.params.order;

        this.visible = true;
        setTimeout(function () {
            that.setupDropify(false);
        }, 800);
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
      menus: function (after, before) {
        //console.log('menus: ', after);
      }
    }
  }
</script>
<style lang="scss">
    #modalEditMenu {
        .card {
            .card-body {
                padding: 10px;

                .menu-wrapper {
                    min-height: 300px;
                    background-color: #ffffff;
                    border-radius: 5px;

                    .dropify-wrapper {
                        min-height: 300px;

                        .dropify-message {
                            top: 40%
                        }
                    }

                    .media-loading {
                        display: block;
                        width: 100%;
                        text-align: center;
                        top: 160px;
                        position: relative;
                        

                        h3 {
                            font-size: 15px;
                            font-weight: bold;
                        }                        
                    }
                }
            }
        }
    }

</style>
