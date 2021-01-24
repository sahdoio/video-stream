<template>
    <section>
        <modal v-model.lazy="visible"
              :title="'Editar Menus - ' + data.companyName"
              @hide="onHideModal"
              ref="modal"
              id="modalMenus"
              size="lg"
              class="show">
               
            <div>
              <btn class="btn btn-success btn-round pull-right"
                  data-original-title="Adicionar Menu"
                  title="Adicionar Menu"
                  @click="callModalEditMenu(null)">
                  <i class="now-ui-icons ui-1_simple-add bold"></i>
                  <span class="bold">Adicionar</span>
              </btn>
            </div>

            <card>
                <template slot="header">
                </template>
                <div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="menu-wrapper">
                                <draggable v-model="menus">
                                  <transition-group class="menu-list">
                                      <div class="menu-item" v-for="element in menus" :key="element.id">
                                          <div class="menu-item-wrapper">
                                            <img class="menu-item-image" :src="element.url">
                                          </div>
                                          <div class="menu-item-overlay">
                                              <div class="btn-group">
                                                <btn class="btn btn-success btn-round pull-right edit"
                                                    data-original-title="Editar Menu"
                                                    title="Editar Menu"
                                                    @click="callModalEditMenu(element)">
                                                    <span class="bold">Editar</span>
                                                </btn>
                                                <btn class="btn btn-success btn-round pull-right remove"
                                                    data-original-title="Remover Menu"
                                                    title="Remover Menu"
                                                    @click="handleDelete(element.id)">
                                                    <span class="bold">Remover</span>
                                                </btn>
                                              </div>
                                              <div class="menu-overlay-title">
                                                <h4>[ MOVER ]</h4>
                                              </div>
                                          </div>
                                      </div>
                                  </transition-group>
                                </draggable>
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

        <modal-edit-menu></modal-edit-menu>
    </section>
</template>
<script>
  import ModalEditMenu from "./ModalEditMenu";
  export default {
    name: 'ModalMenus',
    components: {
      ModalEditMenu
    },
    computed: {
      params() {
        return (this.$store.state.modalMenus);
      },
      readonly() {
        return (this.$store.state.modalMenus.readOnly)
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
        menus:[
          {
            "id": 1,
            "companyId": 1,
            "url": "https://desenio.pt/bilder/artiklar/zoom/13272_1.jpg",
            "order": 1
          },
          {
            "id": 2,
            "companyId": 1,
            "url": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/cafe-menu-design-template-0fbd0b3c0a51f8bd4c81cd753cbe9b01_screen.jpg?ts=1567778948",
            "order": 2
          },
          {
            "id": 3,
            "companyId": 1,
            "url": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/menu-flyer-template-5632286b490608db0301a085b91cde86_screen.jpg?ts=1561491978",
            "order": 3
          },
          {
            "id": 4,
            "companyId": 1,
            "url": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/wallboard-bar-menu-flyer-template-420ae622e69c171ce3d52c0f6a36e990_screen.jpg?ts=1561485816",
            "order": 4
          },
          {
            "id": 5,
            "companyId": 1,
            "url": "https://image.freepik.com/vetores-gratis/menu-de-quadro-de-giz-de-cerveja_1284-14602.jpg",
            "order": 5
          },
          {
            "id": 6,
            "companyId": 1,
            "url": "https://www.vivermaisgourmet.com.br/fotos/20160401_192958_80.jpg",
            "order": 6
          },
          {
            "id": 7,
            "companyId": 1,
            "url": "https://3wftqo2m2mls1wr1c62cv1x6-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/image21-1.png",
            "order": 7
          },
          {
            "id": 8,
            "companyId": 1,
            "url": "https://i.pinimg.com/originals/0c/57/28/0c57285b287a354a2b20e5f89ccc46ef.jpg",
            "order": 8
          }

        ],
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
        this.$store.state.modalMenus.isVisible = false;
        this.$store.state.modalMenus.id = null;
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
      callModalEditMenu(menu) {
        const params = {
          isVisible: true,
          id: menu ? menu.id : null,
          companyId: this.params.id ? this.params.id : null,
          order: menu ? menu.order : this.menus.length,
          menuMediaLink: menu ? menu.url : null
        };
        this.$store.state.modalEditMenu = params;
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
        
        var promises = [];
        var results = [];

        console.log('menus: ', this.menus);

        this.startLoading();

        for (var i = 0; i < this.menus.length; i++) {
          var menu = this.menus[i];
          var endpoint = '/companies/' + this.params.id + '/menu-pages/' + menu.id;
          var formData = new FormData();
          formData.append('order', i);
          promises.push(
            this.$http.put(endpoint, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
              .then(response => {
                if (that.httpCheckStatus(response)) {
                  results.push(true);
                } else {
                  results.push(false);
                }
              })
              .catch(error => {
                  that.httpCheckStatus(error.response);
                  results.push(false);
              })
          );
        }

        Promise.all(promises).then(() => {
          console.log('results: ', results);
          const errorFound = results.find(element => element == false);        

          this.stopLoading();

          if (!errorFound) {            
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
        });
      },
      handleDelete(id) {
        swal({
          title: 'Tem certeza?',
          text: `Você não poderá recuperar esse registro`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success btn-fill',
          cancelButtonClass: 'btn btn-danger btn-fill',
          confirmButtonText: 'Sim, excluir',
          cancelButtonText: 'Cancelar',
          buttonsStyling: false
        }).then(result => {
          if (result.value) {
            this.deleteMenu(id);
          }
        });
      },
      deleteMenu(id) {
        var that = this;

        this.startLoading();

        this.$http
          .delete('companies/' + this.params.id + '/menu-pages/' + id)
          .then(function (response) {
            if (that.httpCheckStatus(response)) {             
              that.stopLoading();
              swal({
                title: 'Excluido!',
                text: `Sucesso ao excluir menu`,
                type: 'success',
                showConfirmButton: false,
                timer: 2000,
                onClose: () => {
                  that.loadData();
                }
              }).catch(swal.noop);
            }
          })
          .catch(function (error) {
            that.httpCheckStatus(error.response);
          });
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
              that.loadMenus();
            });
        } catch (error) {
          console.error(error);
        }
      },
      loadMenus() {
        console.log('loadMenus');
        try {
          var that = this;
          this.$http
            .get('/companies/' + this.params.id + '/menu-pages', {
              params: {
                public_key: localStorage.public_key,
              }
            })
            .then(function (response) {
              that.menus = that.sortObjsByField(response.data.content, 'order');
              setTimeout(function () {
                that.visible = true;
                that.stopLoading();
              }, 400);
            });
        } catch (error) {
          console.error(error);
          that.stopLoading();
        }
      }
    },
    mounted() {
      this.$eventBus.$on('refreshCompanyMenus', () => {
        this.loadData();
      });
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
    #modalMenus {
        .card {
            .card-body {
                padding: 10px;

                .menu-wrapper {
                    min-height: 400px;
                    background-color: #ececec;
                    border-radius: 5px;

                    .menu-list {
                        list-style-type: none;
                        position: relative;
                        display: block;
                        max-height: 500px;
                        overflow-y: auto;
                        
                        .menu-item {
                            width: 33%;  
                            float: left;        
                            padding: 10px;          
                            position: relative;   
                            border-radius: 5px;
                            overflow: hidden;

                            .menu-item-wrapper {
                                width: 100%;          
                                height: 17rem;                           
                                margin: 0 auto;
                                text-align: center;
                                background: #000000;
                                border-radius: 5px;
                                overflow: hidden;

                                .menu-item-image {
                                    height: 100%;
                                }
                            }

                            .menu-item-overlay {
                                position: absolute;
                                top: 10px;
                                left: 10px;
                                width: calc(100% - 20px);
                                height: calc(100% - 20px);
                                background: #40106eba;          
                                border-radius: 5px;
                                overflow: hidden;                      
                                opacity: 0;
                                transition: opacity .5s linear;

                                .btn-group {
                                  margin-right: 5px;
                                  float: right;

                                  .btn {
                                    background: transparent;
                                    border: 2px solid #ffffff;
                                    margin-right: 5px;
                                    padding: 8px;                                  

                                    &.edit {
                                      &:hover {
                                        background: rgb(250, 187, 51);
                                      }
                                    }

                                    &.remove {
                                      &:hover {
                                        background: rgb(255, 50, 50);
                                      }
                                    }
                                  }
                                }

                                .menu-overlay-title {
                                  position: absolute;
                                  top: 6.5rem;
                                  width: 100%;
                                  text-align: center !important;

                                  h4 {
                                    color: #ffffff;
                                    font-weight: 600;
                                  }
                                }
                            }

                            &:hover {
                              .menu-item-overlay {
                                opacity: 1;
                                transition: opacity .2s linear;
                              }
                            }
                        }
                    }
                }
            }
        }
    }

</style>
