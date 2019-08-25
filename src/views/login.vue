<template>
  <div class="login-page fillcontain">
    <h1 class="title">{{SYSTEM_NAME}}</h1>

    <!-- 登陆 -->
    <div class="login-panel">
      <h2>登陆</h2>
      <el-form-renderer :content="loginContent" ref="form">
        <el-form-item label=" ">
          <el-button type="primary" class="login-btn" :loading="loading" @click="login">登陆</el-button>
        </el-form-item>
      </el-form-renderer>
    </div>
  </div>
</template>

<script>
import { plugin, value, computed, watch, onMounted } from "vue-function-api";

import { SYSTEM_NAME } from "@/common/const";

const loginForm = [
  {
    type: "input",
    id: "username",
    el: {
      placeholder: "用户名/邮箱地址",
      prefixIcon: "el-icon-user"
    },
    rules: [
      {
        trigger: "blur",
        required: true,
        message: "请填写用户名"
      }
    ]
  },
  {
    type: "input",
    id: "access_token",
    el: {
      placeholder: "github token",
      prefixIcon: "el-icon-lock",
      type: "password"
    },
    rules: [
      {
        trigger: "blur",
        required: true,
        message: "请填写 github token"
      }
    ]
  }
];

export default {
  setup(props, ctx) {
    const loginContent = value(loginForm);
    const loading = value(false);
    const { $store, toast, $router } = ctx.root;

    const login = () => {
      const { form } = ctx.refs;

      form.validate(validate => {
        if (!validate) return;

        const data = form.getFormValue();
        loading.value = true;
        $store
          .dispatch("user/login", data)
          .then(() => {
            toast("登录成功");
            $router.push("/");
          })
          .catch((e) => {
            toast('用户名错误', 'error')
          })
          .finally(() => {
            loading.value = false;
          });
      });
    };

    return {
      loginContent,
      login,
      loading,
      SYSTEM_NAME
    };
  }
};
</script>

<style lang="less">
.login-page {
  background: #324057;
  color: #fff;

  .title {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 36px;
    font-weight: 700;
  }
  .login-panel,
  .register-panel {
    position: absolute;
    background: #fff;
    padding: 40px;
    border-radius: 10px;
    left: 50%;
    top: 30%;
    transform: translate(-50%, 0);
    width: 400px;

    > h2 {
      color: #324057;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }

  .login-btn {
    width: 100%;
  }
  .reset-main {
    text-align: right;
  }
}
</style>
