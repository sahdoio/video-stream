<template>
    <div id="main_content">
        <div class="row">
            <div class="col-12">
                <card card-body-classes="table-full-width" no-footer-line>
                    <div slot="header">
                        <h4 class="card-title">Publicidades</h4>
                        <btn class="btn btn-success btn-round pull-right"
                             data-original-title="Adicionar nova publicidade"
                             title="Adicionar nova publicidade"
                             @click="callModalAds(null)">
                            <i class="now-ui-icons ui-1_simple-add bold"></i>
                            <span class="bold">Adicionar</span>
                        </btn>
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
                                  style="width: 100%;"
                                  :data="queriedData"
                                  v-if="loaded">
                            <el-table-column v-for="column in tableColumns"
                                             :key="column.label"
                                             :min-width="column.minWidth"
                                             :prop="column.prop"
                                             :label="column.label">
                                <div slot-scope="props">
                                    <span v-if="column.prop == 'initialDt'">
                                        <span class="spanInitialDt">
                                          {{ formatDate(props.row[column.prop], true) }}
                                        </span>
                                    </span>
                                    <span v-else-if="column.prop == 'endDt'">
                                        <span class="spanEndDt">
                                          {{ formatDate(props.row[column.prop], true) }}
                                        </span>
                                    </span>
                                    <span v-else>{{ props.row[column.prop] }}</span>
                                </div>
                            </el-table-column>

                            <el-table-column
                                    :min-width="85"
                                    fixed="right">
                                <div slot-scope="props" class="table-actions">
                                    <n-button @click.native="handleEdit(props.$index, props.row)"
                                              class="edit"
                                              type="warning"
                                              size="sm" round icon>
                                        <i class="fa fa-edit"></i>
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
        <modal-ads></modal-ads>
    </div>
</template>
<script>
  import {Table, TableColumn, Select, Option} from 'element-ui';
  import {Pagination as NPagination} from 'src/components';
  import Fuse from 'fuse.js';
  import swal from 'sweetalert2';
  import {
    Progress,
    Switch,
    FormGroupInput as FgInput,
    Slider,
    Checkbox
  } from 'src/components';
  import ModalAds from "./ModalAds";

  export default {
    components: {
      NPagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Switch.name]: Switch,
      Checkbox,
      ModalAds
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
          'name',
          'advertiserCompany',
          'category',
          'initialDt',
          'endDt'
        ],
        tableColumns: [
          {
            prop: 'name',
            label: 'Nome Publicidade',
            minWidth: 150
          },
          {
            prop: 'advertiserCompany',
            label: 'Empresa',
            minWidth: 150
          },
          {
            prop: 'category',
            label: 'Categoria',
            minWidth: 150
          },
          {
            prop: 'initialDt',
            label: 'Início da campanha',
            minWidth: 150
          },
          {
            prop: 'endDt',
            label: 'Fim da campanha',
            minWidth: 150
          }
        ],
        tableData: {},
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
        this.callModalAds(row.id);
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
          .delete('advertisements/' + row.id, {
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
            } else {
              swal({
                title: 'Oops!',
                text: `Erro ao tentar excluir design '${row.name}'`,
                type: 'warning',
                confirmButtonClass: 'btn btn-success btn-fill',
                buttonsStyling: false
              });
            }
          });
      },
      callModalAds(id) {
        const params = {
          isVisible: true,
          id: id
        };
        this.$store.state.modalAds = params;
      },
      loadData() {
        try {
          var that = this;
          this.startLoading();
          this.$http
            .get('/advertisements', {
              params: {
                public_key: localStorage.public_key,
              }
            })
            .then(function (response) {
              that.stopLoading();
              that.tableData = response.data.content;
              that.searchQuery = '';
              that.searchedData = that.tableData;
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
      var that = this;
      this.$eventBus.$on('refreshAds', () => {
        that.loadData();
      });
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
        this.searchedData = result;
      }
    }
  };
</script>
<style>
</style>
