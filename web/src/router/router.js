import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';

Vue.use(Router);

// configure router
const router = new Router({
  routes, // short for routes: routes
  linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
  // if not logged
  if (!localStorage.logged || !localStorage.token) {
    if (to.name != 'login' && to.name != 'register') {
      router.push({name: 'login'});
      return false;
    }
  }
  // if logged
  if (localStorage.logged && localStorage.token) {
    if (to.name == 'login' || to.name == 'register') {
      router.push({name: 'dashboard'});
      return true;
    }
  }
  return next();
});

export default router
