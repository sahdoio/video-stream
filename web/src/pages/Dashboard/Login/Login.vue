<template>
    <div class="col-md-5 ml-auto mr-auto">
        <form @submit.prevent="logIn">
            <card class="card-login card-plain">
                <div slot="header">
                    <div class="logo-container">
                        <img src="img/logo_1.png" alt="">
                    </div>
                </div>

                <div>
                    <fg-input v-model="model.email" v-validate="'required|email'" name="email"
                              :error="getError('email')"
                              class="fg-input-login no-border form-control-lg" placeholder="Email"
                              addon-left-icon="now-ui-icons ui-1_email-85">
                    </fg-input>

                    <fg-input v-model="model.password" v-validate="'required|min:5'" type="password" name="password"
                              :error="getError('password')" class="fg-input-login no-border form-control-lg"
                              placeholder="Senha"
                              addon-left-icon="now-ui-icons ui-1_lock-circle-open"
                              style="margin-bottom: 10px !important;">
                    </fg-input>
                </div>

                <div slot="footer">
                    <n-button native-type="submit" type="primary" round block>
                        INICIAR
                    </n-button>
                </div>
            </card>
        </form>
    </div>
</template>
<script>
  export default {
    name: 'login',
    data() {
      return {
        model: {
          email: '',
          password: ''
        },
        token: false,
        logged: false,
        public_key: false
      };
    },
    methods: {
      getError(fieldName) {
        return this.errors.first(fieldName);
      },
      async logIn() {
        this.logInFake();
        return true;

        let isValidForm = await this.$validator.validateAll();
        var that = this;
        if (isValidForm) {
          this.$http
            .post('/auth/login', {
              email: this.model.email,
              password: this.model.password
            }, {
              useCredentails: true
            })
            .then(function (response) {
              that.saveSessionLogin(response.data);
            })
            .catch(function (error) {
              switch (error.response.status) {
                case 401:
                  swal({
                    title: 'Atenção!',
                    text: "Verifique se as credenciais estão corretas!",
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
            });
        }
      },
      saveSessionLogin(data) {
        localStorage.setItem('logged', true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        window.location.href = "./";
      },
      logInFake() {
        if (
          this.model.email == 'admin' &&
          this.model.password == '123456'
        ) {
          var data = {
            logged: true,
            token: '123456',
            userId: 1
          };
          this.saveSessionLogin(data);
        } else {
          swal({
            title: 'Atenção!',
            text: "Verifique se as credenciais estão corretas!",
            type: 'warning',
            confirmButtonClass: "btn btn-success"
          }).catch(swal.noop);
        }
      }
    }
  };

</script>

<style>
    .login-page .navbar-nav .nav-item p {
        line-height: inherit;
        margin-left: 5px;
    }

    .login-page .card-login .card-body {
        padding: 10px 15px 10px 15px !important;
    }

    .login-page .card .card-footer .btn {
        background: #36ae8b;
        font-weight: bold;
        padding: 13px 48px;
        font-size: 1em;
    }

    .login-page .card-login .logo-container {
        width: 90px;
        margin: 0 auto;
        margin-bottom: 15px;
    }

    .login-page .card-login {
        border-radius: 1.5rem !important;
        padding-bottom: 0.7rem !important;
        background: #00000029;
        border-radius: 20px;
    }

    .login-page .input-group-append .input-group-text i,
    .login-page .input-group-prepend .input-group-text i {
        font-size: 18px;
        width: 16px;
        padding-right: 30px;
    }

    .login-page .card-login.card-plain .form-group.no-border .form-control,
    .login-page .card-login.card-plain .input-group.no-border .form-control {
        font-size: 15px;
    }
</style>

