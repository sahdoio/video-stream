<template>
  <div class="row">
    <div class="col-md-12">
      <card>
        <template slot="header">
          <h4 class="card-title">{{ pageTitle }}</h4>
          <n-button type="success" 
            class="btn-primary btn-round pull-right"
            @click.native="saveDesign"
          >
            <i slot="label" class="now-ui-icons ui-1_check"></i>
            Salvar
          </n-button>
        </template>
        <div>
          <form method="get" action="/" class="form-horizontal">
            <div class="row">
              <label class="col-sm-2 col-form-label">NOME</label>
              <div class="col-sm-10">
                <fg-input name="name" type="name" @input="inputName" :value="design_name"></fg-input>                
              </div>
            </div>

            <div class="row spacer"></div>

            <div class="row">
              <label class="col-sm-2 col-form-label">HTML - PRODUTO</label>
              <div class="col-sm-10">
                <codemirror 
                  :value="design_item" 
                  :options="htmlProductEditorOptions"
                  @input="htmlProductEditorChange">
                  ></codemirror>
              </div>
            </div>

            <div class="row spacer"></div>

            <div class="row">
              <label class="col-sm-2 col-form-label">HTML - CONTAINER</label>
              <div class="col-sm-10">
                <codemirror 
                  :value="design_container" 
                  :options="htmlContainerEditorOptions"
                  @input="htmlContainerEditorChange">
                  ></codemirror>
              </div>
            </div>

            <div class="row spacer"></div>

            <div class="row">
              <label class="col-sm-2 col-form-label">CSS</label>
              <div class="col-sm-10">
                <codemirror 
                  :value="design_css" 
                  :options="cssEditorOptions"
                  @input="cssEditorChange">
                  ></codemirror>
              </div>
            </div>

            <div class="row spacer"></div>

            <div class="row">
              <label class="col-sm-2 col-form-label">Javascript</label>
              <div class="col-sm-10">
                <codemirror 
                  :value="design_js" 
                  :options="javascriptEditorOptions"
                  @input="javascriptEditorChange">
                  ></codemirror>
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
      codemirror
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
        api_endpoint: '',
        pageTitle: 'Design - Novo', 
        design_id: null,
        design_name: '',
        design_item: '',
        design_container: '',
        design_css: '',
        design_js: ''
      };
    },
    methods: {
      inputName(name) {
        this.design_name = event.target.value;
      },
      htmlProductEditorChange(newCode) {
        this.design_item = newCode;
      },
      htmlContainerEditorChange(newCode) {
        this.design_container = newCode;
      },
      cssEditorChange(newCode) {
        this.design_css = newCode;
      },
      javascriptEditorChange(newCode) {
        this.design_js = newCode;
      },
      saveDesign() {
        var payload = {
          name: this.design_name,
          design_item: this.design_item,
          design_container: this.design_container,
          design_css: this.design_css,
          design_js: this.design_js,
          design_status: this.design_status
        };

        if (this.design_id) {
          payload.id = this.design_id;
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
            var message = (typeof data.message != 'undefined') ? data.message : 'Nossos serviços estão indisponíveis no momento. Tente mais tarde.';

            switch (status) {
              case 'ok':
                swal({
                  title: 'Feito!',
                  text: message,
                  type: 'success',
                  showConfirmButton: false,
                  timer: 2000,
                  onClose: () => {
                    //that.$router.push({name: 'designs'});
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
      }
    },
    async mounted() {
      this.api_endpoint = 'design/store';

      if (this.$route.name == 'designs_edit') {
        this.api_endpoint = 'design/update';
        this.pageTitle = 'Design - Editar';
        this.design_id = this.isset(this.$route.params.id) ? this.$route.params.id : null;

        this.startLoading();

        const design_id = this.$route.params.id;  

        console.log('design_id: ', design_id);

        var payload = { id: design_id }
        var api = await this.$http
          .get('design/one', {
              params: {
                  public_key: localStorage.public_key,
                  payload: JSON.stringify(payload)
              }
          })
          .then(function (response) {
              return response.data;
          });

        this.design_name = api.data.name;
        this.design_item = api.data.design_item;
        this.design_container = api.data.design_container;
        this.design_css = api.data.design_css;
        this.design_js = api.data.design_js;

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

<style scoped>
  .row.spacer {
    margin: 10px 0;
  }
</style>
