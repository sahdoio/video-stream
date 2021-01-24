<template>
    <section>
        <modal v-model="visible"
               title="Modal Empresa"
               @hide="onHideModal"
               ref="modal"
               id="ModalCompanyDevices"
               size="lg"
               class="show">

            <h4 slot="title" class="modal-title">Associar Dispositivos</h4>

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

            <card v-if="devicesVisible">
                <template slot="header">
                    <h4 class="card-title">Dispositivos Associados</h4>
                </template>
                <div>
                    <div class="row">
                        <div class="col-md-12">
                            <card card-body-classes="table-full-width">
                                <div slot="header"></div>
                                <div class="row">
                                    <div class="col-md-8">
                                        <v-select v-model="deviceSelected" :options="devices" @search="onSearch"
                                                  label="name"></v-select>
                                    </div>
                                    <div class="col-md-4 pull-right">
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
                                                <span>{{ props.row[column.prop] }}</span>
                                            </div>
                                        </el-table-column>

                                        <el-table-column
                                                :min-width="100"
                                                fixed="right">
                                            <div slot-scope="props" class="table-actions">
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
                                            <p class="card-category">Showing {{from + 1}} to {{to}} of {{total}}
                                                entries</p>
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

  export default {
    name: 'ModalCompanyDevices',
    components: {
      Switch,
      [Switch.name]: Switch,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      NPagination,
    },
    computed: {
      params() {
        return (this.$store.state.modalCompanyDevices);
      },
      readonly() {
        return (this.$store.state.modalCompanyDevices.readOnly)
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
        devicesVisible: false,
        saved: false,
        devices: [],
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
            minWidth: 200
          },
          {
            prop: 'model',
            label: 'Modelo',
            minWidth: 200
          },
          {
            prop: 'resolution',
            label: 'Resolução',
            minWidth: 200
          }
        ],
        tableData: [],
        searchedData: [],
        fuseSearch: null,
        deviceSelected: null
      }
    },
    methods: {
      hideModal() {
        this.$store.state.modalCompanyDevices.isVisible = false;
        this.visible = false;
        this.devicesVisible = false;
      },
      onHideModal() {
        if (!this.readonly && this.saved) {
          this.$eventBus.$emit('refreshCompanyDevices');
        }
        this.hideModal();
      },
      onOpenModal() {
        this.saved = false;
        this.deviceSelected = null;
        this.loadData();
        this.loadDevices(false, 10);
      },
      onSearch(query, loading) {
        loading(true);
        this.loadDevices(query, 1000, function (status) {
          if (status) {
            loading(false);
          }
        });
      },
      startAssociation() {
        var that = this;
        if (this.deviceSelected && this.deviceSelected.allocatedCompany) {
          this.startLoading();
          this.$http
            .get('/companies/' + this.deviceSelected.allocatedCompany.id, {
              params: {
                public_key: localStorage.public_key,
              }
            })
            .then(function (response) {
              var company = response.data;
              setTimeout(function () {
                swal({
                  title: 'Associação Detectada!',
                  html: `Esse dispositivo está associado a empresa <strong>${company.tradingName}</strong>. Deseja continuar?`,
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonClass: 'btn btn-success btn-fill',
                  cancelButtonClass: 'btn btn-danger btn-fill',
                  confirmButtonText: 'Sim, continuar',
                  cancelButtonText: 'Cancelar',
                  buttonsStyling: false
                }).then(result => {
                  if (result.value) {
                    that.associateDevice();
                  }
                });
                that.stopLoading();
              }, 400);
            });
        } else {
          this.associateDevice();
        }
      },
      associateDevice(event) {
        this.$http.post(`/companies/${this.params.id}/devices`, {
          idDevice: this.deviceSelected.id
        })
          .then(response => {
              switch (response.status) {
                case 201:
                  swal({
                    title: 'Successo!',
                    text: 'Item associado com sucesso!',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    onClose: () => {
                      this.loadCompanyDevices();
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
            this.deleteRow(row);
          }
        });
      },
      deleteRow(row) {
        var that = this;
        var payload = {id: row.id};
        this.$http
          .delete(`/companies/${this.params.id}/devices/${row.id}`, {
            public_key: localStorage.public_key,
            payload: JSON.stringify(payload)
          })
          .then(function (response) {
            if (response.status == 200) {
              let indexToDelete = that.tableData.findIndex(
                tableRow => tableRow.id === row.id
              );

              if (indexToDelete >= 0) {
                that.tableData.splice(indexToDelete, 1);
              }

              swal({
                title: 'Excluido!',
                text: `Você exluiu ${row.name}`,
                type: 'success',
                confirmButtonClass: 'btn btn-success btn-fill',
                buttonsStyling: false
              });

              this.loadCompanyDevices();
            } else {
              swal({
                title: 'Oops!',
                text: `Erro ao tentar excluir design '${row.tradingName}'`,
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
              that.loadCompanyDevices();
            });
        } catch (error) {
          console.error(error);
        }
      },
      loadCompanyDevices() {
        try {
          var params = {
            public_key: localStorage.public_key
          };
          var that = this;
          this.$http
            .get(`/companies/${this.params.id}/devices`, {
              params: params
            })
            .then(function (response) {
              that.tableData = response.data.content;
              that.fuseSearch = new Fuse(that.tableData, {
                keys: ['name'],
                threshold: 0.3
              });
              that.devicesVisible = true;
            });
        } catch (error) {
          console.error(error);
        }
      },
      loadDevices(query = false, size = false, callback = false) {
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
            .get('/devices', config)
            .then(function (response) {
              that.stopLoading();
              that.devices = response.data.content;
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
      }
    }
  }
</script>
<style lang="scss">
    #ModalCompanyDevices {
        .vs__dropdown-toggle {
            height: 43px;
            border-width: 1px;
            border-radius: 5px;
            margin-top: 7px;
        }
    }
</style>
