<template>
  <div class="user user__menu">
    <div class="photo">
      <img :src="image" alt="avatar"/>
    </div>
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click.stop="toggleMenu" href="#">
           <span>
             {{title}}
          </span>
      </a>
    </div>
  </div>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';

export default {
  name: 'user-menu',
  components: {
    CollapseTransition
  },
  props: {
    title: {
      type: String,
      default: 'MDF Technology'
    },
    image: {
      type: String,
      default: 'img/default-avatar.png'
    }
  },
  data() {
    return {
      isClosed: true
    };
  },
  methods: {
    toggleMenu() {
      this.isClosed = !this.isClosed;
    }
  }
};
</script>
<style>
  .user__menu ul.user-menu__nav {
    margin-top: 0;
    padding-top: 20px;
  }
</style>
