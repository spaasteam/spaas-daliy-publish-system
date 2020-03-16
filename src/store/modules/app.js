import cloneDeep from "lodash/cloneDeep";
import routes from "@/router/routes";
import { routeHandler } from "@/common/utils";

const state = {
  sidebar: {
    opened: true
  },
  menuList: routeHandler(cloneDeep(routes))
};

const mutations = {
  TOGGLE_SIDEBAR(state) {
    state.sidebar.opened = !state.sidebar.opened;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
