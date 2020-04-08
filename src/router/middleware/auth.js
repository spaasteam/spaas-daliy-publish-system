import store from "@/store";

const whiteRoutes = ["/login"];

export default (to, from, next) => {
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
        next();
      }
    }
  }
};
