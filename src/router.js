import Vue from "vue";
import Router from "vue-router";
import store from "./store";

Vue.use(Router);

import Layout from "@/layouts/home";

const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Layout,
      redirect: "/daliy-publish/index"
    },
    {
      path: "/login",
      name: "login",
      component: () => import(`@/views/login.vue`)
    },
    {
      path: "/daliy-publish",
      name: "daliy-publish",
      component: Layout,
      redirect: "/daliy-publish/index",
      children: [
        {
          path: "index",
          name: "daliy-publish-index",
          component: () => import("@/views/daliy-publish")
        },
        {
          path: 'label-management',
          name: 'labelManagement',
          component: () => import("@/views/label-management")
        }
      ]
    }
  ]
});

const whiteRoutes = ["/login"];

router.beforeEach((to, from, next) => {
  // 白名单路由
  if (whiteRoutes.includes(to.path)) {
    if (to.path === "/login" && localStorage.getItem("access_token")) next("/");

    next();
  } else {
    // 其他路由
    if (!localStorage.getItem("access_token")) {
      next("/login");
    } else {
      if (!store.getters.user.access_token) {
        store
          .dispatch(
            "user/getUserInfoByToken",
            localStorage.getItem("access_token")
          )
          .then(next);
      } else {
        next()
      }
    }
  }
});

export default router;
