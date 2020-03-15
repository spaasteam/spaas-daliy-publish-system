import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";
import rotuerExtra from "./middleware";

Vue.use(Router);

const router = new Router(routes);

rotuerExtra(router);

export default router;
