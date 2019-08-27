import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import router from "@/router";

function axiosExtra(axios) {
  for (let method of [
    "request",
    "delete",
    "get",
    "head",
    "options",
    "post",
    "put",
    "patch"
  ]) {
    axios["$" + method] = function() {
      return this[method].apply(this, arguments).then(res => res && res.data);
    };
  }
}

const instance = axios.create({
  timeout: 5000
  // transformResponse: [data => data]
  // validateStatus: function(status) {
  //   return true;
  // }
});

// http request 拦截器
instance.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `token ${store.getters.token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
instance.interceptors.response.use(
  res => {
    const { data, status } = res;

    if (status === 401) {
      Message.error({
        message: "无效的token"
      });
      router.push("/login");
      localStorage.removeItem("access_token");
      return Promise.reject(data);
    }

    if (data.code >= 500) {
      Message.error({
        message: data.message || "系统错误，请稍后再试..."
      });
      return Promise.reject(data);
    }

    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosExtra(instance);

export default instance;
