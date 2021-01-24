<template>
  <div class="row">
    <div class="col-md-12">
      <card>
        <template slot="header">
          <h4 class="card-title">{{ pageTitle }}</h4>
          <n-button type="success" class="btn-primary btn-round pull-right" @click.native="savePage">
            <i slot="label" class="now-ui-icons ui-1_check"></i>
            Salvar
          </n-button>
        </template>
        <div>
          <form method="get" action="/" class="form-horizontal">
            <div class="row">
              <label class="col-sm-2 col-form-label">NOME</label>
              <div class="col-sm-10">
                <fg-input name="name" type="name" @input="inputName" :value="page_name"></fg-input>
              </div>
            </div>

            <div class="row spacer"></div>

            <div class="row">
              <label class="col-sm-2 col-form-label">LOCALIZADOR - TIPO</label>
              <div class="col-sm-10">
                <el-select class="select-primary" size="large" placeholder="Tipo" v-model="typeModel">
                <el-option v-for="option in typeOptions" class="select-primary" :value="option.id"
                  :label="option.label" :key="option.label">
                </el-option>
              </el-select>
              </div>              
            </div>

            <div class="row spacer"></div>

            <div class="row">
              <label class="col-sm-2 col-form-label">HTML - PRODUTO</label>
              <div class="col-sm-10">
                <codemirror :value="page_item" :options="htmlProductEditorOptions" @input="htmlProductEditorChange">
                  ></codemirror>
              </div>
            </div>

            <div class="row spacer"></div>

            <div class="row">
              <label class="col-sm-2 col-form-label">HTML - CONTAINER</label>
              <div class="col-sm-10">
                <codemirror :value="page_container" :options="htmlContainerEditorOptions"
                  @input="htmlContainerEditorChange">
                  ></codemirror>
              </div>
            </div>

            <div class="row spacer"></div>

            <div class="row">
              <label class="col-sm-2 col-form-label">CSS</label>
              <div class="col-sm-10">
                <codemirror :value="page_css" :options="cssEditorOptions" @input="cssEditorChange">
                  ></codemirror>
              </div>
            </div>

            <div class="row spacer"></div>

            <div class="row">
              <label class="col-sm-2 col-form-label">Javascript</label>
              <div class="col-sm-10">
                <codemirror :value="page_js" :options="javascriptEditorOptions" @input="javascriptEditorChange">
                  ></codemirror>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12">
                <div class="card card-tasks">
                  <div class="card-header">
                    <h5 class="title">VARIÁVEIS</h5>
                    <button type="button" @click="addVariable" class="btn btn-icon btn-round btn-primary pull-right">
                      <i class="now-ui-icons ui-1_simple-add"></i>
                    </button>
                    <p class="category">Backend Development</p></div>
                  <div class="card-body">
                    <div class="col-md-12">
                      <div v-for="(page_var, index) in page_vars" :key="page_var.id">
                        <div class="row">
                          <fg-input v-model="page_var.name" class="col-sm-11"></fg-input>
                          <button @click="deleteVariable(index)"
                                  type="button" rel="tooltip" title=""
                                  data-original-title="Remove"
                                  class="btn btn-danger btn-round btn-icon btn-icon-mini btn-neutral"
                                  style="margin: 0;">
                            <i class="now-ui-icons ui-1_simple-remove"></i></button>
                        </div>
                        <div class="row">
                          <codemirror v-model="page_var.value" :options="javascriptEditorOptions" class="codemirror_page_vars col-sm-12"></codemirror>
                        </div>
                        <hr>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </card> <!-- end card -->
    </div>
  </div>
</template>
<script>
  import {
    codemirror
  } from 'vue-codemirror';
  import vSelect from 'vue-select';

  import {
    TimeSelect,
    DatePicker,
    Tag,
    Input,
    Button,
    Select,
    Option
  } from 'element-ui';

  import {
    Progress,
    Switch,
    FormGroupInput as FgInput,
    Slider
  } from 'src/components/index';

  // import codemirror resources
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/css/css.js'
  import 'codemirror/mode/htmlmixed/htmlmixed.js'
  import 'codemirror/mode/xml/xml.js'
  import 'codemirror/theme/ambiance.css'
  import 'codemirror/theme/monokai.css'
  import 'codemirror/keymap/sublime';

  export default {
    components: {
      codemirror,
      vSelect,
      [DatePicker.name]: DatePicker,
      [TimeSelect.name]: TimeSelect,
      [Tag.name]: Tag,
      [Input.name]: Input,
      [Button.name]: Button,
      [Option.name]: Option,
      [Select.name]: Select,
      [Switch.name]: Switch,
      [Progress.name]: Progress
    },
    data() {
      return {
        htmlProductEditorOptions: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          mode: 'xml',
          keyMap: "sublime",
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "monokai",
          extraKeys: {
            "Ctrl": "autocomplete"
          },
          hintOptions: {
            completeSingle: false
          }
        },
        htmlContainerEditorOptions: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          mode: 'xml',
          keyMap: "sublime",
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "monokai",
          extraKeys: {
            "Ctrl": "autocomplete"
          },
          hintOptions: {
            completeSingle: false
          }
        },
        javascriptEditorOptions: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          mode: 'text/javascript',
          keyMap: "sublime",
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "monokai",
          extraKeys: {
            "Ctrl": "autocomplete"
          },
          hintOptions: {
            completeSingle: false
          }
        },
        cssEditorOptions: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          mode: 'css',
          keyMap: "sublime",
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "monokai",
          extraKeys: {
            "Ctrl": "autocomplete"
          },
          hintOptions: {
            completeSingle: false
          }
        },
        typeModel: '',
        typeOptions: [{
          'id': 1,
          'label': 'url'
        }, {
          'id': 2,
          'label': 'html'
        }, {
          'id': 3,
          'label': 'variável'
        }],  
        api_endpoint: '',
        pageTitle: 'Página - Novo',
        page_id: null,
        page_name: '',
        page_item: '',
        page_container: '',
        page_css: '',
        page_js: '',
        count_page_vars: 0,
        page_vars: [],
      };
    },
    methods: {
      inputName(name) {
        this.page_name = event.target.value;
      },
      htmlProductEditorChange(newCode) {
        this.page_item = newCode;
      },
      htmlContainerEditorChange(newCode) {
        this.page_container = newCode;
      },
      cssEditorChange(newCode) {
        this.page_css = newCode;
      },
      javascriptEditorChange(newCode) {
        this.page_js = newCode;
      },
      savePage() {
        var payload = {
          name: this.page_name,
          page_item: this.page_item,
          page_container: this.page_container,
          page_css: this.page_css,
          page_js: this.page_js,
          page_status: this.page_status,
          page_vars: JSON.stringify(this.page_vars),
        };

        if (this.page_id) {
          payload.id = this.page_id;
        }

        var that = this;

        this.startLoading();

        this.$http
          .post(this.api_endpoint, {
            public_key: localStorage.public_key,
            payload: JSON.stringify(payload)
          }, {
            useCredentails: true
          })
          .then(function (response) {
            that.stopLoading();

            var data = response.data;
            var status = (typeof data.status != 'undefined') ? data.status : 'error';
            var message = (typeof data.message != 'undefined') ? data.message :
              'Nossos serviços estão indisponíveis no momento. Tente mais tarde.';

            switch (status) {
              case 'ok':
                swal({
                  title: 'Feito!',
                  text: message,
                  type: 'success',
                  showConfirmButton: false,
                  timer: 2000,
                  onClose: () => {
                    //that.$router.push({name: 'pages'});
                  }
                }).catch(swal.noop);
                break;
              case 'warning':
                swal({
                  title: 'Atenção!',
                  text: message,
                  type: 'warning',
                  confirmButtonClass: "btn btn-success"
                }).catch(swal.noop);
                break;
              case 'error':
                swal({
                  title: 'Algo deu errado!',
                  text: message,
                  type: 'error',
                  confirmButtonClass: "btn btn-success"
                }).catch(swal.noop);
                break;
              default:
                break;
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      addVariable() {
          this.count_page_vars++;

          this.page_vars.push({
              id: this.count_page_vars,
              name: '',
              value: ''
          });
      },
      deleteVariable(index) {
          this.page_vars.splice(index, 1)
      },
    },
    async mounted() {
      this.api_endpoint = 'pages/store';

      if (this.$route.name == 'pages_edit') {
        this.api_endpoint = 'pages/update';
        this.pageTitle = 'Página - Editar';
        this.page_id = this.isset(this.$route.params.id) ? this.$route.params.id : null;

        this.startLoading();

        const page_id = this.$route.params.id;
        var payload = {
          id: page_id
        }
        var api = await this.$http
          .get('pages/one', {
            params: {
              public_key: localStorage.public_key,
              payload: JSON.stringify(payload)
            }
          })
          .then(function (response) {
            return response.data;
          });

        this.page_name = api.data.name;
        this.page_item = api.data.page_item;
        this.page_container = api.data.page_container;
        this.page_css = api.data.page_css;
        this.page_js = api.data.page_js;
        this.page_vars = api.data.page_vars;
        this.count_page_vars = api.data.page_vars.slice(-1).pop().id;

        this.stopLoading();
      }
    }
  };

</script>

<style>
  .CodeMirror {
    border-radius: 1.5em !important;
    padding: 10px !important;
    font-size: 0.85em;
    min-height: 500px;
  }

</style>

<style>
  .style-chooser .vs__search::placeholder,
  .style-chooser .vs__dropdown-toggle,
  .style-chooser .vs__dropdown-menu {
    background: #dfe5fb;
    border: none;
    color: #394066;
    text-transform: lowercase;
    font-variant: small-caps;
  }

  .style-chooser .vs__clear,
  .style-chooser .vs__open-indicator {
    fill: #394066;
  }

  .codemirror_page_vars .CodeMirror {
    height: 100px;
    min-height: 100px;
  }
</style>

<style scoped>
  .row.spacer {
    margin: 10px 0;
  }

</style>
