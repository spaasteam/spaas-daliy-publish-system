<template>
  <div class="header">
    <div class="left-panel">
      <i class="menu-icon" :class="menuIcon" @click="toggleMenu"></i>
    </div>
    <div class="right-panel">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <img class="user_avatar" :src="user.avatar_url" alt="avatar" />
          <span class="username">{{ user.username }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>-->
          <!-- <el-dropdown-item divided>蚵仔煎</el-dropdown-item> -->
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { computed } from "vue-function-api";
export default {
  name: "VHeader",
  setup(props, ctx) {
    const { $store, toast, $router } = ctx.root;

    const user = computed(() => {
      return $store.getters.user;
    })

    const toggleMenu = () => {
      $store.commit("app/TOGGLE_SIDEBAR");
    };

    const logout = () => {
      $store.dispatch("user/clearUserInfo");
      localStorage.removeItem("access_token");
      toast("退出登录成功");
      $router.push("/logi");
    };

    const handleCommand = key => {
      const fnMap = {
        logout
      };

      fnMap[key] && fnMap[key]();
    }

    const menuIcon = computed(() => {
      return $store.getters.sidebar.opened
        ? "el-icon-s-fold"
        : "el-icon-s-unfold";
    });

    return {
      user,
      menuIcon,
      toggleMenu,
      handleCommand
    };
  }
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  .left-panel {
    > .menu-icon {
      cursor: pointer;
      font-size: 24px;
      font-weight: 500;
    }
  }
  .user_avatar {
    display: inline-block;
    margin-right: 5px;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    vertical-align: middle;
  }
}
</style>
