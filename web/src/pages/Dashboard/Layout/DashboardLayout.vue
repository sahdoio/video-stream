<template>
  <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">
        <user-menu></user-menu>
        <h2 class="sidebar-group-title">Principal</h2>
        <sidebar-item :link="{name: 'Dashboard', icon: 'now-ui-icons design_app', path: '/dashboard'}"></sidebar-item>
        <h2 class="sidebar-group-title">Transmissão</h2>        
        <sidebar-item :link="{name: 'Salas', icon: 'now-ui-icons design-2_ruler-pencil', path: '/rooms'}"></sidebar-item>  
        <sidebar-item :link="{name: 'Dispositivos', icon: 'now-ui-icons tech_tablet', path: '/devices'}"></sidebar-item>  
        <h2 class="sidebar-group-title">Configurações</h2>
        <sidebar-item :link="{name: 'Sair', icon: 'now-ui-icons media-1_button-power', path: '/logout'}"></sidebar-item>  
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <router-view name="header"></router-view>

      <div :class="{content: !$route.meta.hideContent}" @click="toggleSidebar">
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import TopNavbar from './TopNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import DashboardContent from './Content.vue';
  import MobileMenu from './Extra/MobileMenu.vue';
  import UserMenu from './Extra/UserMenu.vue';
  import {
    SlideYDownTransition,
    ZoomCenterTransition
  } from 'vue2-transitions';

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu,
      UserMenu,
      SlideYDownTransition,
      ZoomCenterTransition
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    },
    mounted() {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith('Win');
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar('sidebar');
        initScrollbar('sidebar-wrapper');

        docClasses.add('perfect-scrollbar-on');
      } else {
        docClasses.add('perfect-scrollbar-off');
      }
    }
  };
</script>

<style lang="scss">
  $scaleSize: 0.95;

  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }

    to {
      opacity: 1;
    }
  }

  .main-panel .zoomIn {
    animation-name: zoomIn95;
  }

  @keyframes zoomOut95 {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .main-panel .zoomOut {
    animation-name: zoomOut95;
  }

</style>
