<template>
  <div class="main-layout">
    <sidebar class="sidebar" />
    <div class="main-content">
      <v-header height="50px"></v-header>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue-function-api";

import Header from "./components/header";
import sidebar from "./components/menu";

export default {
  components: {
    [Header.name]: Header,
    [sidebar.name]: sidebar
  },
  setup(props, ctx) {
    const { $store } = ctx.root;

    const sidebar = computed(() => $store.getters.sidebar);

    const sideWidth = computed(() => {
      return sidebar.value.opened ? 200 : 120;
    });

    return {
      sidebar,
      sideWidth
    };
  }
};
</script>

<style lang="less">
.main-layout {
  height: 100vh;
  display: flex;

  justify-content: space-between;
  overflow: hidden;

  .sidebar {
    height: 100%;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .header {
      flex: 0 0 50px;
      padding: 0 24px;
    }

    .content {
      padding: 24px;
      height: calc(100vh - 100px);
      overflow: auto;
    }
  }
}

.el-header {
  border-bottom: 1px solid #efefef;
}
</style>
