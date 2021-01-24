<template>
    <div class="row">
        <div class="col-md-10" style="margin: 0 auto">
            <card>
                <template slot="header">
                    <h4 class="card-title">Perfil</h4>
                    <form @submit.prevent="validate">
                        <n-button type="success"
                                  class="btn-primary btn-round pull-right"
                                  native-type="submit"
                        >
                            <i slot="label" class="now-ui-icons ui-1_check"></i>
                            Salvar
                        </n-button>
                    </form>
                </template>
                <div>
                    <form @submit.prevent>
                        <div class="row">
                            <div class="col-md-12">
                                <fg-input type="text"
                                          label="Nome"
                                          placeholder="Nome"
                                          v-validate="'required'"
                                          name="name"
                                          :error="getError('name')"
                                          v-model="user.name">
                                </fg-input>
                            </div>
                            <div class="col-md-12">
                                <fg-input type="email"
                                          label="Email"
                                          placeholder="Email"
                                          v-validate="'required|email'"
                                          name="email"
                                          :error="getError('email')"
                                          v-model="user.email">
                                </fg-input>
                            </div>
                            <div class="col-md-12">
                                <fg-input type="password"
                                          label="Senha"
                                          placeholder="Senha"
                                          v-validate="'min:5'"
                                          name="password"
                                          :error="getError('password')"
                                          v-model="user.password">
                                </fg-input>
                            </div>
                        </div>
                    </form>
                </div>
            </card> <!-- end card -->
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                user: {
                    _id: null,
                    name: null,
                    email: null,
                    password: null
                },
                modelValidations: {
                    name: {
                        required: true,
                    },
                    email: {
                        required: true
                    },
                    password: {
                        min: 5,
                    },
                }
            };
        },
        methods: {
            getError(fieldName) {
                return this.errors.first(fieldName);
            },
            async validate() {
                let isValidForm = await this.$validator.validateAll();

                if (isValidForm) {
                    this.save();
                }
            },
            save() {
                this.startLoading();

                var that = this;

                this.$http
                    .post('profile/update', {
                        public_key: localStorage.public_key,
                        payload: JSON.stringify(this.user)
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
                        console.error(error);
                    });
            }
        },
        async mounted() {
            this.startLoading();

            var payload = {
                public_key: localStorage.public_key,
                user_id: localStorage.user_id
            };

            var api = await this.$http
                .get('profile/one', {
                    params: {
                        public_key: localStorage.public_key,
                        payload: JSON.stringify(payload)
                    }
                })
                .then(function (response) {
                    return response.data;
                });

            this.user = {
                _id: api.data._id,
                name: api.data.name,
                email: api.data.email,
                password: null
            };

            this.stopLoading();
        }
    };
</script>