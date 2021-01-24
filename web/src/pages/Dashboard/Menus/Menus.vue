<template>
    <div id="main_content">
        <div class="row">
            <div class="col-12">
                <card card-body-classes="table-full-width" no-footer-line>
                    <div slot="header">
                        <h4 class="card-title">Menus por Empresa</h4>                        
                    </div>

                    <div>
                        <div class="d-flex justify-content-center justify-content-sm-between flex-wrap">
                            <fg-input>
                                <el-input type="search"
                                          class="mb-3"
                                          clearable
                                          prefix-icon="el-icon-search"
                                          style="width: 150px"
                                          placeholder="Filtrar"
                                          v-model="searchQuery"
                                          aria-controls="datatables">
                                </el-input>
                            </fg-input>

                            <el-select
                                    class="select-primary mb-3"
                                    style="width: 150px"
                                    v-model="pagination.perPage"
                                    placeholder="Por página">
                                <el-option
                                        class="select-default"
                                        v-for="item in pagination.perPageOptions"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <el-table stripe
                                  style="width: 100%; height: auto !important;"
                                  :data="queriedData"
                                  v-if="loaded">
                            <el-table-column v-for="column in tableColumns"
                                             :key="column.label"
                                             :min-width="column.minWidth"
                                             :prop="column.prop"
                                             :label="column.label">
                                <div slot-scope="props">
                                    <span v-if="column.prop == 'cityState'">
                                        {{ cityState(props.row) }}
                                    </span>
                                    <span v-else>{{ props.row[column.prop] }}</span>
                                </div>
                            </el-table-column>
                            <el-table-column
                                    :min-width="200"
                                    fixed="right">
                                <div slot-scope="props" class="table-actions text-center">
                                    <n-button @click.native="handleEdit(props.$index, props.row)"
                                              class="edit"
                                              type="warning"
                                              size="sm" 
                                              style="background: #ff00ba;"
                                              round icon>
                                        <i class="fa fa-list"></i>
                                    </n-button>         
                                </div>
                            </el-table-column>
                        </el-table>
                    </div>

                    <div slot="footer"
                         class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
                        <div class="">
                            <p class="card-category">Showing {{from + 1}} to {{to}} of {{total}} entries</p>
                        </div>
                        <n-pagination class="pagination-no-border"
                                      v-model="pagination.currentPage"
                                      :per-page="pagination.perPage"
                                      :total="total">
                        </n-pagination>
                    </div>
                </card>
            </div>
        </div>
        <modal-menus></modal-menus>
    </div>
</template>
<script>
  import {Table, TableColumn, Select, Option} from 'element-ui';
  import {Pagination as NPagination} from 'src/components';
  import Fuse from 'fuse.js';
  import swal from 'sweetalert2';
  import {
    Switch,
    Checkbox
  } from 'src/components';
  import ModalMenus from "./ModalMenus";

  export default {
    components: {
      NPagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Switch.name]: Switch,
      Checkbox,
      ModalMenus
    },
    computed: {
      /***
       * Returns a page from the searched data or the whole data. Search is performed in the watch section below
       */
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
        pagination: {
          perPage: 10,
          currentPage: 1,
          perPageOptions: [10, 15, 25, 50],
          total: 0
        },
        searchQuery: '',
        propsToSearch: [
          'tradingName',
          'companyName',          
          'address.city',          
          'address.country',          
          'address.number',          
          'revenueNumber'
        ],
        tableColumns: [
          {
            prop: 'tradingName',
            label: 'Nome Fantasia',
            minWidth: 150
          },
          {
            prop: 'companyName',
            label: 'Razão Social',
            minWidth: 200
          },      
          {
            prop: 'revenueNumber',
            label: 'Número Receita',
            minWidth: 150
          }
        ],
        tableData: [],
        searchedData: [],
        fuseSearch: null,
        switches: {
          defaultOn: true,
          defaultOff: false,
          plainOn: true,
          plainOff: false,
          withIconsOn: true,
          withIconsOff: false
        },
        loaded: false,
      };
    },
    methods: {
      handleEdit(index, row) {
        this.callModalMenus(row.id);
      },
      handleDevicesAssociation(index, row) {
        this.callModalCompanyDevices(row.id);
      },
      handleAdsAssociation(index, row) {
        this.callModalCompanyAds(row.id);
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
      cityState(company) {
        return company.address.city + '/' + company.address.province;
      },
      deleteRow(row) {
        var that = this;
        var payload = {id: row.id};
        this.$http
          .delete('companies/' + row.id, {
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
                text: `Você exluiu ${row.tradingName}`,
                type: 'success',
                confirmButtonClass: 'btn btn-success btn-fill',
                buttonsStyling: false
              });
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
      callModalMenus(id) {
        const params = {
          isVisible: true,
          id: id
        };
        this.$store.state.modalMenus = params;
      },
      callModalCompanyDevices(id) {
        const params = {
          isVisible: true,
          id: id
        };
        this.$store.state.modalCompanyDevices = params;
      },
      callModalCompanyAds(id) {
        const params = {
          isVisible: true,
          id: id
        };
        this.$store.state.modalCompanyAds = params;
      },
      loadData() {
        try {
          var that = this;
          this.startLoading();
          this.$http
            .get('/companies', {
              params: {
                public_key: localStorage.public_key,
              }
            })
            .then(function (response) {
              that.stopLoading();
              that.tableData = response.data.content;
              that.loaded = true;
              // Fuse search initialization.
              that.fuseSearch = new Fuse(that.tableData, {
                keys: that.propsToSearch,
                threshold: 0.3
              });
            });
        } catch (error) {
          console.error(error);
        }
      }
    },
    mounted() {
      this.loaded = false;      
      this.loadData();
    },
    watch: {
      /**
       * Searches through the table data by a given query.
       * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
       * @param value of the query
       */
      searchQuery(value) {
        let result = this.tableData;
        if (value !== '') {
          result = this.fuseSearch.search(this.searchQuery);
        }

        console.log('result: ', result);
        console.log('value: ', value);

        this.searchedData = result;
      }
    }
  };
</script>
<style>
</style>
