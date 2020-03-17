<template>
  <div>
    <div v-for="m in menuList" :key="m.name" class="menu-item">
      <el-menu-item :index="m.path" v-if="!m.children || !m.children.length">
        <icon-font :icon="m.icon"></icon-font>
        <span slot="title" class="item-title">{{ m.name }}</span>
      </el-menu-item>

      <el-submenu v-else :index="m.name + ''">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <svg-icon v-if="m.icon" :icon-class="m.icon"></svg-icon>
          <span class="sub-menu-title">{{ m.name }}</span>
        </template>
        <menu-item :menuList="m.children"></menu-item>
      </el-submenu>
    </div>
  </div>
</template>

<script>
import IconFont from "./icon-font.vue";

export default {
  name: "MenuItem",
  components: {
    IconFont
  },
  props: {
    menuList: {
      type: Array
    },
    isCollapse: Boolean
  },
  methods: {
    checkUrl(urlString) {
      const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      return urlString && reg.test(urlString);
    }
  }
};
</script>
<style lang="less"></style>
