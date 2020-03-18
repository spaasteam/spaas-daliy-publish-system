import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import { plugin } from "vue-function-api";
import ElFormRenderer from "@femessage/el-form-renderer";
import "@/assets/styles/index.less";

import "./global";

Vue.use(ElementUI);

Vue.use(plugin);
Vue.component(ElFormRenderer.name, ElFormRenderer);

import VueHighlightJS from "vue-highlightjs";

// Tell Vue.js to use vue-highlightjs
Vue.use(VueHighlightJS);
Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV === "development";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
