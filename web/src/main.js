import Vue from 'vue';
import router from './router/router';
import DashboardPlugin from './dashboard-plugin';
import io from 'socket.io-client';

// Plugins
import App from './App.vue';

// Custom
import './plugins/axios';
import store from './store/store';
import helper from './mixins/helperMixin';

Vue.mixin(helper);

// plugin setup
Vue.use(DashboardPlugin);

// Load script
import LoadScript from 'vue-plugin-load-script';
Vue.use(LoadScript);

// jquery
window.$ = require('jquery');
window.JQuery = require('jquery');

// dropify plugin
import 'dropify/dist/css/dropify.min.css';
Vue.loadScript("/js/dropify.js");

// import 'dropify/dist/js/dropify';

// vue the mask
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask);

// v-select
import vSelect from 'vue-select'
Vue.component('vSelect', vSelect);
import 'vue-select/dist/vue-select.css';

// draggable
import draggable from 'vuedraggable'
Vue.component('Draggable', draggable);

/**
 * Socket Area
 */
let socket = null;

/** Socket IO Client - Store in Vuex State for use in components */
if (process.env.NODE_ENV === 'development') {
    socket = io(process.env.VUE_APP_API);   
} else {
    socket = io('/');
}
// End socket area

store.dispatch('assignSocket', socket);

// bus
Vue.prototype.$eventBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
  router
});
