<template>
  <div id="main_content">
    <div class="row">
      <div class="col-12">
        <card card-body-classes="table-full-width" no-footer-line>
          <div slot="header">
            <h4 class="card-title">Salas de Aula</h4>
            <btn
              class="btn btn-success btn-round pull-right"
              data-original-title="Adicionar novo dispositivo"
              title="Adicionar novo dispositivo"
              @click="callModalDevices(null)"
            >
              <i class="now-ui-icons ui-1_simple-add bold"></i>
              <span class="bold">Adicionar</span>
            </btn>
          </div>

          <div>
            <div
              class="d-flex justify-content-center justify-content-sm-between flex-wrap"
            >
              <fg-input>
                <el-input
                  type="search"
                  class="mb-3"
                  clearable
                  prefix-icon="el-icon-search"
                  style="width: 150px"
                  placeholder="Filtrar"
                  v-model="searchQuery"
                  aria-controls="datatables"
                >
                </el-input>
              </fg-input>

              <el-select
                class="select-primary mb-3"
                style="width: 150px"
                v-model="pagination.perPage"
                placeholder="Por página"
              >
                <el-option
                  class="select-default"
                  v-for="item in pagination.perPageOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <el-table stripe style="width: 150%" :data="queriedData" v-if="loaded">
              <el-table-column
                v-for="column in tableColumns"
                :key="column.label"
                :min-width="column.minWidth"
                :prop="column.prop"
                :label="column.label"
              >
                <div slot-scope="props">
                  <span v-if="column.prop == 'active'">
                    <!-- read only-->
                    <checkbox
                      :checked="props.row[column.prop]"
                      onclick="return false"
                    ></checkbox>
                  </span>
                  <span v-else>{{ props.row[column.prop] }}</span>
                </div>
              </el-table-column>

              <el-table-column :min-width="120" fixed="right">
                <div slot-scope="props" class="table-actions">
                  <n-button
                    @click.native="handleEdit(props.$index, props.row)"
                    class="edit"
                    type="warning"
                    size="sm"
                    round
                    icon
                  >
                    <i class="fa fa-edit"></i>
                  </n-button>
                  <n-button
                    @click.native="handleDelete(props.$index, props.row)"
                    class="remove"
                    type="danger"
                    size="sm"
                    round
                    icon
                  >
                    <i class="fa fa-times"></i>
                  </n-button>
                </div>
              </el-table-column>
            </el-table>
          </div>

          <div
            slot="footer"
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <div class="">
              <p class="card-category">
                Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
              </p>
            </div>
            <n-pagination
              class="pagination-no-border"
              v-model="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="total"
            >
            </n-pagination>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { Pagination as NPagination } from "src/components";
import Fuse from "fuse.js";
import swal from "sweetalert2";
import {
  Progress,
  Switch,
  FormGroupInput as FgInput,
  Slider,
  Checkbox,
} from "src/components";

export default {
  name: "Rooms",
  components: {
    NPagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Switch.name]: Switch,
    Checkbox,
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
    },
  },
  data() {
    return {
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [10, 15, 25, 50],
        total: 0,
      },
      searchQuery: "",
      propsToSearch: [
        "name",
        "serialNumber",
        "macAddress",
        "model",
        "active",
        "resolution",
        "purchaseDt",
      ],
      tableColumns: [
        {
          prop: "class",
          label: "Aula",
          minWidth: 150,
        },
        {
          prop: "teacher",
          label: "Professor",
          minWidth: 150,
        },
        {
          prop: "date",
          label: "Dia da Semana",
          minWidth: 150,
        },
        {
          prop: "time",
          label: "Hora",
          minWidth: 150,
        },
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
        withIconsOff: false,
      },
      loaded: false,
      create_url: this.$router.resolve({ name: "designs_create" }).href,
    };
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push({name: 'room', params: { room_id:row.id }});
    },
    handleDelete(index, row) {
      swal({
        title: "Tem certeza?",
        text: `Você não poderá recuperar esse registro`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-success btn-fill",
        cancelButtonClass: "btn btn-danger btn-fill",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.deleteRow(row);
        }
      });
    },
    deleteRow(row) {
      var that = this;
      var payload = { id: row.id };
      this.$http
        .delete("devices/" + row.id, {
          public_key: localStorage.public_key,
          payload: JSON.stringify(payload),
        })
        .then(function (response) {
          if (response.status == 200) {
            let indexToDelete = that.tableData.findIndex(
              (tableRow) => tableRow.id === row.id
            );

            if (indexToDelete >= 0) {
              that.tableData.splice(indexToDelete, 1);
            }

            swal({
              title: "Excluido!",
              text: `Você exluiu ${row.name}`,
              type: "success",
              confirmButtonClass: "btn btn-success btn-fill",
              buttonsStyling: false,
            });
          } else {
            swal({
              title: "Oops!",
              text: `Erro ao tentar excluir design '${row.name}'`,
              type: "warning",
              confirmButtonClass: "btn btn-success btn-fill",
              buttonsStyling: false,
            });
          }
        });
    },
    loadData() {
      this.tableData = [
        {
          id: "room1",
          class: "Matemática",
          teacher: "Ana Cláudia",
          date: "Segunda-Feira",
          time: "09:00",
        },
        {
          id: "room2",
          class: "Geografia",
          teacher: "Ricardo Souza",
          date: "Quarta-Feira",
          time: "11:00",
        },
        {
          id: "room3",
          class: "História",
          teacher: "Victor Ferreira",
          date: "Quinta-Feira",
          time: "14:00",
        },
        {
          id: "room4",
          class: "Português",
          teacher: "Laís Matos",
          date: "Segunda-Feira",
          time: "16:00",
        },
        {
          id: "room5",
          class: "Física",
          teacher: "George Almeida",
          date: "Sexta-Feira",
          time: "10:00",
        },
      ];
      this.loaded = true;
      // Fuse search initialization.
      this.fuseSearch = new Fuse(this.tableData, {
        keys: that.propsToSearch,
        threshold: 0.3,
      });

      /*
        try {
          var that = this
          this.startLoading()
          this.$http
            .get('/devices', {
              params: {
                public_key: localStorage.public_key,
              }
            })
            .then(function (response) {
              that.stopLoading()
              that.tableData = response.data.content
              that.loaded = true
              // Fuse search initialization.
              that.fuseSearch = new Fuse(that.tableData, {
                keys: that.propsToSearch,
                threshold: 0.3
              })
            })
        } catch (error) {
          console.error(error)
        }
        */
    },
  },
  mounted() {
    this.loaded = false;
    var that = this;
    this.$eventBus.$on("refreshDevices", () => {
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
      if (value !== "") {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedData = result;
    },
  },
};
</script>
<style></style>
