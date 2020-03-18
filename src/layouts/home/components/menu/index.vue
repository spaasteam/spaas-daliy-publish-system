<template>
  <el-menu
    class="menu-container"
    background-color="#2d303b"
    text-color="#fff"
    :default-active="$route.path"
    :collapse-transition="false"
    router
    :collapse="isCollapse"
    :unique-opened="false"
    active-text-color="#1890ff"
  >
    <menu-item :isCollapse="isCollapse" :menuList="menuList"></menu-item>
  </el-menu>
</template>

<script>
import MenuItem from "./menu-item";
import { computed } from "vue-function-api";

export default {
  name: "Sidebar",
  components: {
    [MenuItem.name]: MenuItem
  },
  setup(props, ctx) {
    const { $store } = ctx.root;

    const isCollapse = computed(() => !$store.getters.sidebar.opened);
    const menuList = computed(() => $store.getters.menuList);

    return {
      menuList,
      isCollapse
    };
  }
};
</script>

<style lang="less">
.el-menu {
  width: 200px;
  flex: 0 0 200px;
  &--collapse {
    width: 64px;
    flex: 0 0 64px;
    .el-submenu__icon-arrow,
    .sub-menu-title,
    .menu-title {
      display: none;
    }
  }

  .menu-item {
    user-select: none;
    .el-icon-menu {
      position: relative;
      top: -2px;
    }
  }
}
.menu-container {
  overflow-y: hidden;
}
</style>
