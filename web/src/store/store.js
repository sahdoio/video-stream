import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    modalCompanies: {
      isVisible: false,
      readOnly: false,
      id: null
    },
    modalDevices: {
      isVisible: false,
      readOnly: false,
      id: null
    },
    modalCompanyDevices: {
      isVisible: false,
      readOnly: false,
      id: null
    },
    modalCompanyAds: {
      isVisible: false,
      readOnly: false,
      id: null
    },
    modalAds: {
      isVisible: false,
      readOnly: false,
      id: null
    },
    modalMenus: {
      isVisible: false,
      readOnly: false,
      id: null
    },
    modalEditMenu: {
      isVisible: false,
      readOnly: false,
      id: null,
      companyId: null,
      order: 0,
      menuMediaLink: null
    }
  }
});
