<template>
  <div class="sidebar" :data-color="backgroundColor">
    <div class="logo">
      <a href="/" class="simple-text logo-mini">
        <img :src="logo1">
      </a>
      <a href="/" class="simple-text logo-normal">
        <img :src="logo2">
      </a>
    </div>

    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <slot></slot>
      <ul class="nav">
        <slot name="links">
          <sidebar-item v-for="(link, index) in sidebarLinks" :key="link.name + index" :link="link">
            <sidebar-item v-for="(subLink, index) in link.children" :key="subLink.name + index" :link="subLink"></sidebar-item>
          </sidebar-item>
        </slot>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sidebar',
    props: {
      title: {
        type: String,
        default: 'Vue NUD PRO'
      },
      backgroundColor: {
        type: String,
        default: 'mdf',
        validator: value => {
          let acceptedValues = [
            '',
            'blue',
            'azure',
            'green',
            'orange',
            'red',
            'purple',
            'black',
            'mdf'
          ];
          return acceptedValues.indexOf(value) !== -1;
        }
      },
      logo1: {
        type: String,
        default: 'img/logo_1.png'
      },
      logo2: {
        type: String,
        default: 'img/logo_2.png'
      },
      sidebarLinks: {
        type: Array,
        default: () => []
      },
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    provide() {
      return {
        autoClose: this.autoClose
      };
    },
    methods: {
      minimizeSidebar() {
        if (this.$sidebar) {
          this.$sidebar.toggleMinimize();
        }
      }
    },
    beforeDestroy() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false;
      }
    }
  };
</script>

<style>
  @media (min-width: 992px) {
    .navbar-search-form-mobile,
    .nav-mobile-menu {
      display: none;
    }
  }
</style>
