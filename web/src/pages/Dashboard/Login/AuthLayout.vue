<template>
  <div>
    <navbar :show-navbar="showMenu">
      <template slot="navbar-menu">
        <li class="nav-item">
          <a class="nav-link" href="https://www.mdftechnology.com.br/">
            <i class="now-ui-icons location_world"></i>
            Website
          </a>
        </li>
      </template>
    </navbar>

    <div class="wrapper wrapper-full-page login-page">
      <div class="full-page" :class="pageClass" filter-color="black" data-image="/img/bg13.jpg">
        <div class="content">
          <div class="container">
            <zoom-center-transition :duration="pageTransitionDuration" mode="out-in">
              <router-view></router-view>
            </zoom-center-transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Navbar,
    NavbarToggleButton
  } from 'src/components';

  import {
    ZoomCenterTransition
  } from 'vue2-transitions';

  export default {
    components: {
      Navbar,
      NavbarToggleButton,
      ZoomCenterTransition
    },
    props: {
      backgroundColor: {
        type: String,
        default: 'black'
      }
    },
    data() {
      return {
        showMenu: false,
        menuTransitionDuration: 250,
        pageTransitionDuration: 200,
        year: new Date().getFullYear(),
        pageClass: 'login-page'
      };
    },
    methods: {
      toggleNavbar() {
        document.body.classList.toggle('nav-open');
        this.showMenu = !this.showMenu;
      },
      closeMenu() {
        document.body.classList.remove('nav-open');
        this.showMenu = false;
      },
      setPageClass() {
        this.pageClass = `${this.$route.name}-page`.toLowerCase();
      }
    },
    mounted() {
      //...
    },
    beforeDestroy() {
      this.closeMenu();
    },
    beforeRouteUpdate(to, from, next) {
      // Close the mobile menu first then transition to next page
      if (this.showMenu) {
        this.closeMenu();
        setTimeout(() => {
          next();
        }, this.menuTransitionDuration);
      } else {
        next();
      }
    },
    watch: {
      $route() {
        this.setPageClass();
      }
    }
  };

</script>

<style scoped>
  body {
    overflow: hidden;
  }

  .wrapper {
    background: -webkit-gradient(linear, left top, right top, from(#173047), color-stop(60%, #436381), to(#011629));
    background: linear-gradient(to right, #173047 0%, #436381 60%, #011629 100%);
    height: 1600px;
    overflow: hidden;
  }

  .bg-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 95%;
    height: 100%;
    z-index: 1;
  }

  .bg-bubbles li {
    position: absolute;
    list-style: none;
    display: block;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.15);
    bottom: -160px;
    -webkit-animation: square 25s infinite;
    animation: square 25s infinite;
    transition-timing-function: linear;
  }

  .bg-bubbles li:nth-child(1) {
    left: 10%;
  }

  .bg-bubbles li:nth-child(2) {
    left: 20%;
    width: 80px;
    height: 80px;
    -webkit-animation-delay: 2s;
    animation-delay: 2s;
    -webkit-animation-duration: 17s;
    animation-duration: 17s;
  }

  .bg-bubbles li:nth-child(3) {
    left: 25%;
    -webkit-animation-delay: 4s;
    animation-delay: 4s;
  }

  .bg-bubbles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    -webkit-animation-duration: 22s;
    animation-duration: 22s;
    background-color: rgba(255, 255, 255, 0.25);
  }

  .bg-bubbles li:nth-child(5) {
    left: 70%;
  }

  .bg-bubbles li:nth-child(6) {
    left: 80%;
    width: 120px;
    height: 120px;
    -webkit-animation-delay: 3s;
    animation-delay: 3s;
    background-color: rgba(255, 255, 255, 0.2);
  }

  .bg-bubbles li:nth-child(7) {
    left: 32%;
    width: 160px;
    height: 160px;
    -webkit-animation-delay: 7s;
    animation-delay: 7s;
  }

  .bg-bubbles li:nth-child(8) {
    left: 55%;
    width: 20px;
    height: 20px;
    -webkit-animation-delay: 15s;
    animation-delay: 15s;
    -webkit-animation-duration: 40s;
    animation-duration: 40s;
  }

  .bg-bubbles li:nth-child(9) {
    left: 25%;
    width: 10px;
    height: 10px;
    -webkit-animation-delay: 2s;
    animation-delay: 2s;
    -webkit-animation-duration: 40s;
    animation-duration: 40s;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .bg-bubbles li:nth-child(10) {
    left: 90%;
    width: 160px;
    height: 160px;
    -webkit-animation-delay: 11s;
    animation-delay: 11s;
  }

  @-webkit-keyframes square {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    100% {
      -webkit-transform: translateY(-700px) rotate(600deg);
      transform: translateY(-700px) rotate(600deg);
    }
  }

  @keyframes square {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    100% {
      -webkit-transform: translateY(-700px) rotate(600deg);
      transform: translateY(-700px) rotate(600deg);
    }
  }

  .full-page:after {
    background-color: rgba(0, 0, 0, 0.02);
  }

  #particles-js {
    height: 100%;
    display: block;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }

  .full-page>.content {
    padding-bottom: 150px;
    padding-top: 10%;
  }

</style>


<style lang="scss">
  $scaleSize: 0.8;

  @keyframes zoomIn8 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }

    100% {
      opacity: 1;
    }
  }

  .wrapper-full-page .zoomIn {
    animation-name: zoomIn8;
  }

  @keyframes zoomOut8 {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .wrapper-full-page .zoomOut {
    animation-name: zoomOut8;
  }

</style>
