<template>
    <section>
        <modal v-model="visible"
               title="Modal Empresa"
               @hide="onHideModal"
               ref="modal"
               id="modalCompanyAds"
               size="lg"
               class="show">

            <h4 slot="title" class="modal-title">Associar Publicidades</h4>

            <card>
                <template slot="header">
                    <h4 class="card-title">Empresa</h4>
                </template>
                <div>
                    <div class="row">
                        <div class="col-md-6">
                            <card class="card">
                                <div slot="header"></div>
                                <div class="text-center" style="min-height: 85px">
                                    <h4 class="font-weight-bold">{{company.tradingName}}</h4>
                                    <h6>{{company.revenueNumber}}</h6>
                                </div>
                            </card>
                        </div>
                        <div class="col-md-6">
                            <card class="card">
                                <div slot="header"></div>
                                <div v-if="company.address" class="text-center" style="min-height: 95px">
                                    <h5>{{ company.address.streetOne + ', ' + company.address.number }}</h5>
                                    <h6>{{ company.address.city + '/' + company.address.province }}</h6>
                                </div>
                            </card>
                        </div>
                    </div>
                </div>
            </card>

            <card v-if="adsVisible">
                <template slot="header">
                    <h4 class="card-title">Publicidades Associadas</h4>
                </template>
                <div>
                    <div class="row">
                        <div class="col-md-12">
                            <card card-body-classes="table-full-width">
                                <div slot="header"></div>
                                <div class="row" style="margin-bottom: 15px">
                                    <div class="col-md-6">
                                        <label>Publicidade</label>
                                        <v-select v-model="advertisementSelected" :options="advertisements"
                                                  @search="onSearch" label="name" @input="onChange"></v-select>
                                    </div>
                                    <div class="col-md-3">
                                        <label>Exibir em</label>
                                        <v-select v-model="showOn" :options="screens" label="name"
                                                  :reduce="name => name.value"></v-select>
                                    </div>
                                    <div class="col-md-3 pull-right">
                                        <label></label>
                                        <btn class="btn btn-success btn-round pull-right"
                                             data-original-title=""
                                             title=""
                                             @click="startAssociation"
                                             style="width: 100%">
                                            <i class="now-ui-icons ui-1_simple-add bold"></i>
                                            <span class="bold">Adicionar</span>
                                        </btn>
                                    </div>
                                </div>
                                <card style="border: 1px solid rgba(60,60,60,.2)">
                                    <el-table stripe
                                              style="width: 100%; min-height: 140px;"
                                              :data="queriedData">                                    

                                        <el-table-column v-for="column in tableColumns"
                                                         :key="column.label"
                                                         :min-width="column.minWidth"
                                                         :prop="column.prop"
                                                         :label="column.label">
                                            <div slot-scope="props">
                                                <span v-if="column.prop == 'showOn'">{{ getScreen(props.row.showOn) }}</span>
                                                <span>{{ props.row.advertisement[column.prop] }}</span>
                                            </div>
                                        </el-table-column>

                                        <el-table-column
                                                :min-width="100"
                                                fixed="right">
                                            <div slot-scope="props" class="table-actions">
                                                <n-button @click.native="callModalAds(props.row.advertisement.id)"
                                                          class="show"
                                                          type="primary"
                                                          size="sm" round icon>
                                                    <i class="fa fa-eye"></i>
                                                </n-button>
                                                <n-button @click.native="handleDelete(props.$index, props.row)"
                                                          class="remove"
                                                          type="danger"
                                                          size="sm" round icon>
                                                    <i class="fa fa-times"></i>
                                                </n-button>
                                            </div>
                                        </el-table-column>
                                    </el-table>

                                    <div slot="footer"
                                         class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
                                        <div class="">
                                            <p class="card-category">Exibindo {{from + 1}} a {{to}} de {{total}} entradas</p>
                                        </div>
                                        <n-pagination class="pagination-no-border"
                                                      v-model="pagination.currentPage"
                                                      :per-page="pagination.perPage"
                                                      :total="total">
                                        </n-pagination>
                                    </div>
                                </card>
                            </card>
                        </div>
                    </div>
                </div>
            </card>
            <card v-else>
                <div>
                    <div class="row">
                        <div class="col-md-12">
                            <card card-body-classes="table-full-width">
                                <div slot="header" class="text-center" style="margin: 30px 20px">
                                    <h6>Carregando...</h6>
                                </div>
                            </card>
                        </div>
                    </div>
                </div>
            </card>

            <div slot="footer" v-if="readonly"></div>

            <div slot="footer" v-else>
                <button type="button" class="btn btn-success flat" @click="saveData">
                    Concluir
                </button>
            </div>
        </modal>
        <modal-ads></modal-ads>
    </section>    
</template>
<script>
  import {
    Pagination as NPagination,
    Switch,
  } from 'src/components';

  import {
    Select,
    Option,
    Table,
    TableColumn
  } from 'element-ui';
  import Fuse from "fuse.js";
  import ModalAds from "../Ads/ModalAdsReadOnly";

  export default {
    name: 'ModalCompanyAds',
    components: {
      Switch,
      [Switch.name]: Switch,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      NPagination,
      ModalAds
    },
    computed: {
      params() {
        return (this.$store.state.modalCompanyAds);
      },
      readonly() {
        return (this.$store.state.modalCompanyAds.readOnly)
      },
      queriedData() {
        let result = this.tableData;
        if (this.searchedData.length > 0) {
          result = this.searchedData;
        }
        return result.slice(this.from, this.to);
      },
      to() {
        let highBound = this.from + this.pagination.perPage;
        if (this.total < highBound) {
          highBound = this.total;
        }
        return highBound;
      },
      from() {
        return this.pagination.perPage * (this.pagination.currentPage - 1);
      },
      total() {
        return this.searchedData.length > 0
          ? this.searchedData.length
          : this.tableData.length;
      }
    },
    data() {
      return {
        visible: false,
        adsVisible: false,
        saved: false,
        advertisements: [],
        screens: [
          {
            'name': 'Tela Frontal',
            'value': 'SCREEN_1'
          },
          {
            'name': 'Tela Traseira',
            'value': 'SCREEN_2'
          },
          {
            'name': 'Ambas',
            'value': 'BOTH',
          }
        ],
        company: {},
        pagination: {
          perPage: 3,
          currentPage: 1,
          perPageOptions: [3],
          total: 0
        },
        searchQuery: '',
        propsToSearch: ['name'],
        tableColumns: [
          {
            prop: 'name',
            label: 'Nome',
            minWidth: 100
          },
          {
            prop: 'advertiserCompany',
            label: 'Empresa',
            minWidth: 100
          },
          {
            prop: 'category',
            label: 'Categoria',
            minWidth: 100
          },
          {
            prop: 'showOn',
            label: 'Exibir Em',
            minWidth: 100
          }
        ],
        tableData: [],
        searchedData: [],
        fuseSearch: null,
        advertisementSelected: null,
        showOn: null
      }
    },
    methods: {
      hideModal() {
        this.$store.state.modalCompanyAds.isVisible = false;
        this.visible = false;
        this.adsVisible = false;
        this.advertisements = [];
        this.tableData = [];
        this.fuseSearch = null;
        this.searchedData = [];
      },
      onHideModal() {
        if (!this.readonly && this.saved) {
          this.$eventBus.$emit('refreshCompanyAdvertisements');
        }
        this.hideModal();
      },
      onOpenModal() {
        this.saved = false;
        this.loadData();
        this.loadAdvertisements(false, 1000);
      },
      onSearch(query, loading) {
        loading(true);
        this.loadAdvertisements(query, 1000, function (status) {
          if (status) {
            loading(false);
          }
        });
      },
      onChange(value) {
        console.log('advertisementSelected: ', this.advertisementSelected);
      },
      startAssociation() {
        if (this.advertisementSelected && this.advertisementSelected.allocatedCompany) {
          swal({
            title: 'Associação Detectada!',
            text: `Esse dispositivo está asociado a outra empresa. Deseja continuar?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success btn-fill',
            cancelButtonClass: 'btn btn-danger btn-fill',
            confirmButtonText: 'Sim, continuar',
            cancelButtonText: 'Cancelar',
            buttonsStyling: false
          }).then(result => {
            if (result.value) {
              this.associateAdvertisement();
            }
          });
        } else {
          this.associateAdvertisement();
        }
      },
      callModalAds(id) {
        console.log('id: ', id);
        const params = {
          isVisible: true,
          readOnly: true,
          id: id
        };
        this.$store.state.modalAds = params;
      },
      associateAdvertisement(event) {
        var that = this;
        this.startLoading();
        this.$http.post(`/companies/${this.params.id}/advertisements`, {
          idAdvertisement: this.advertisementSelected.id,
          showOn: this.showOn
        })
          .then(response => {
              that.stopLoading();
              switch (response.status) {
                case 200:
                  swal({
                    title: 'Successo!',
                    text: 'Item associado com sucesso!',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    onClose: () => {
                      that.loadCompanyAdvertisements();
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
            that.stopLoading();
            console.log('response status: ', error.response.status);
            if (error.response) {
              switch (error.response.status) {
                case 400:
                  var backMessage = (error.response.data && error.response.data.messages.length > 0) ? error.response.data.messages[0] : "Preencha todos os dados corretamente!";
                  var message = backMessage;
                  
                  switch (backMessage) {
                    case 'Link already existing':
                      message = 'Vínculo já criado para esta empresa';
                      break;
                    case 'Maximum amount of display for screen 2':
                      message = 'Limite máximo atingido para a tela 2';
                      break;
                    case 'Maximum amount of display for screen 1':
                      message = 'Limite máximo atingido para a tela 1';
                      break;
                  }
                  
                  swal({
                    title: 'Atenção!',
                    text: message,
                    type: 'warning',
                    confirmButtonClass: "btn btn-succefss"
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
      },
      getScreen(toFind) {
        if (toFind) {
          var result = this.screens.filter(function (el) {
            return el.value === toFind;
          });
          if (result) {
            return result[0].name;
          } else {
            return '-';
          }
        } else {
          return '-';
        }
      },
      handleDelete(index, row) {
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
            this.deleteRow(row.advertisement);
          }
        });
      },
      deleteRow(advertisement) {
        var that = this;
        var payload = {id: advertisement.id};
        this.$http
          .delete(`/companies/${this.params.id}/advertisements/${advertisement.id}`, {
            public_key: localStorage.public_key,
            payload: JSON.stringify(payload)
          })
          .then(function (response) {
            if (response.status == 200) {
              let indexToDelete = that.tableData.findIndex(
                tableRow => tableRow.id === advertisement.id
              );

              if (indexToDelete >= 0) {
                that.tableData.splice(indexToDelete, 1);
              }

              swal({
                title: 'Excluido!',
                text: `Você exluiu ${advertisement.name}`,
                type: 'success',
                confirmButtonClass: 'btn btn-success btn-fill',
                buttonsStyling: false
              });

              that.loadCompanyAdvertisements();
            } else {
              swal({
                title: 'Oops!',
                text: `Erro ao tentar excluir design '${advertisement.tradingName}'`,
                type: 'warning',
                confirmButtonClass: 'btn btn-success btn-fill',
                buttonsStyling: false
              });
            }
          });
      },
      saveData() {
        this.saved = true;
        this.hideModal();
      },
      loadData() {
        try {
          var that = this;
          this.startLoading();
          this.$http
            .get(`/companies/${this.params.id}`, {
              params: {
                public_key: localStorage.public_key,
              }
            })
            .then(function (response) {
              that.company = response.data;
              that.visible = true;
              that.stopLoading();
              that.loadCompanyAdvertisements();
            });
        } catch (error) {
          console.error(error);
        }
      },
      loadCompanyAdvertisements() {
        try {
          this.advertisementSelected = null;
          this.showOn = null;

          var params = {
            public_key: localStorage.public_key
          };
          var that = this;
          this.$http
            .get(`/companies/${this.params.id}/advertisements`, {
              params: params
            })
            .then(function (response) {
              that.tableData = response.data.content;
              // Fuse search initialization.
              that.fuseSearch = new Fuse(that.tableData, {
                keys: ['name'],
                threshold: 0.3
              });
              that.adsVisible = true;
            });
        } catch (error) {
          console.error(error);
        }
      },
      loadAdvertisements(query = false, size = false, callback = false) {
        //this.advertisementSelected = null;
        this.showOn = null;

        var config = {
          params: {
            public_key: localStorage.public_key,
          }
        };

        if (size) {
          config['params']['size'] = size;
        }

        if (query) {
          config['params']['query'] = query;
        }

        try {
          var that = this;
          this.$http
            .get('/advertisements', config)
            .then(function (response) {
              that.advertisements = response.data.content;
              callback && callback(true);
            });
        } catch (error) {
          console.error(error);
          callback && callback(false);
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
      advertisementSelected: function(after, before) {
        console.log('advertisementSelected - before: ', after);
        console.log('advertisementSelected - after: ', after);        
      }
    }
  }
</script>
<style lang="scss">
    #modalCompanyAds {
        .vs__dropdown-toggle {
            height: 43px;
            border-width: 1px;
            border-radius: 5px;
            margin-top: 7px;
        }
    }
</style>
