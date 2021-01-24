import Vue from 'vue';
import axios from 'axios';
import { install } from 'element-ui';

axios.defaults.baseURL = 'http://3.135.187.52:8000';

Vue.use({
    install(Vue) {
        Vue.prototype.$http = axios;
    }
});