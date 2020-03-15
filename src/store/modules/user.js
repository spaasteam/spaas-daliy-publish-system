import { getUserInfo } from "@/services/v1/github";

const state = {
  access_token: "",
  username: "admin",
  avatar_url: ""
};

async function getUserInfoNoop(access_token) {
  try {
    const data = await getUserInfo({ access_token });
    return data;
  } catch (error) {
    return getUserInfoNoop(access_token);
  }
}

const actions = {
  async login({ commit }, { username, access_token }) {
    const data = await getUserInfoNoop(access_token);

    if (data.login !== username) {
      throw new Error("用户名错误");
    }

    localStorage.setItem("access_token", access_token);

    commit("update", {
      access_token,
      username,
      avatar_url: data.avatar_url
    });
  },
  async getUserInfoByToken({ commit }, access_token) {
    const data = await getUserInfoNoop(access_token);

    localStorage.setItem("access_token", access_token);

    commit("update", {
      access_token,
      username: data.login,
      avatar_url: data.avatar_url
    });
  },
  clearUserInfo({ commit }) {
    commit("update", {
      access_token: "",
      username: "",
      avatar_url: ""
    });
  }
};

const mutations = {
  update(state, payload) {
    Object.entries(payload).forEach(([key, value]) => {
      state[key] = value;
    });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
