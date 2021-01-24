export default {
  data() {
    return {
      loaderParams: null,
      fullPage: true
    };
  },
  methods: {
    startLoading() {
      this.loader = this.$loading.show(this.loaderParams);
    },
    stopLoading() {
      if (this.loader) this.loader.hide();
    },
    isset(variable) {
      if (typeof variable != 'undefined') 
        return true;
      return false;
    },
    getOnlyNumbers(str) {
      if (str) {
        return str.replace(/\D/g, "");
      }
      return str;
    },
    getOnlyAlphaNumeric(str) {
      if (str) {
        str = str.replace(/^[0-9a-zA-Z]/g, "");
        return str;
      }
      return str;
    },
    logOut() {
      this.isLoggingOut = true;

      localStorage.removeItem('logged');
      localStorage.removeItem('token');
      localStorage.removeItem('public_key');
      localStorage.removeItem('user_id');

      this.$router.push({
        name: 'login'
      });
    },
    sortObjsByField(objs, field) {
      console.log('objs: ', objs);
      const compare = (a, b) => {
        if (a[field] < b[field]){
          return -1;
        }
        if (a[field] > b[field]){
          return 1;
        }
        return 0;
      }
      
      return objs.sort(compare);
    },
    prepareDate(date) {
      var datetime = date.split('T');
      var date = datetime[0];
      date = date.replace('Z','');
      
      var dateArr = date.split('-');
      var day = dateArr[0];
      var month = dateArr[1];
      var year = dateArr[2];

      var time = datetime[1];
      time = time.replace('Z', '');

      var finalDate = '' + year + '-' + month + '-' + day + ' ' + time;

      return finalDate;
    },
    formatDate(date, prepareDate = false) {
      if (prepareDate) date = this.prepareDate(date);
      date = new Date(date);
      var dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
      var [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date );
      return (`${day}/${month}/${year }`);
    },
    httpCheckStatus(response, redirectRoute = 'dashboard') {
      console.log('[helperMixin][httpCheckStatus] response: ', response);

      var that = this;

      if (!(response && response.status)) {
        swal({
          title: 'Oops!',
          text: 'Serviço temporariamente indisponível. Contate o suporte',
          type: 'error',
          showConfirmButton: false,
          timer: 2500,
          onClose: () => {
            // ...
          }
        }).catch(swal.noop);

        console.error('[helperMixin][httpCheckStatus] response not found');
        return false;
      }

      switch (response.status) {
        case 200:
        case 201:
          return true;
          break;
        case 404:
          if (!this.isLoggingOut) {
            this.isLoggingOut = true;
            swal({
              title: '404!',
              text: 'Não encontrado',
              type: 'error',
              showConfirmButton: false,
              timer: 2000,
              onClose: () => {
                that.stopLoading();
                that.$router.push({name: redirectRoute});
              }
            }).catch(swal.noop);
          }
          return false;
          break;
        case 401:
          swal({
            title: 'Acesso negado!',
            text: 'É necessário fazer login',
            type: 'warning',
            showConfirmButton: false,
            timer: 2000,
            onClose: () => {
              this.stopLoading();
              that.logOut();
            }
          }).catch(swal.noop);
          return false;
          break;
        case 500:
          swal({
            title: 'Oops!',
            text: 'Serviço temporariamente indisponível',
            type: 'warning',
            showConfirmButton: false,
            timer: 2000,
            onClose: () => {
              //that.logOut();
            }
          }).catch(swal.noop);
          return false;
          break;
        default:
          return false;
          break;
      }
    }
  },
  mounted() {
    this.loaderParams = {
      container: this.fullPage ? null : this.$refs.formContainer,
      canCancel: false,
      onCancel: this.onCancel,
      loader: 'bars',
      color: "#49DCB1",
      width: 128,
      height: 128,
      zIndex: 9999,
      backgroundColor: '#000000',
      opacity: 0.6
    };
  }
};