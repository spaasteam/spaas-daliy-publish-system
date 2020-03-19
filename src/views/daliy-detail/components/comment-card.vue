<template>
  <div class="comment-item">
    <div class="comment-item-header">
      <a :href="data.user.html_url" target="_blank">
        <v-img :src="data.user.avatar_url" :alt="data.user.login"></v-img>
      </a>
      {{ data.user.login }} {{ data.type }}
    </div>
    <div class="comment-item-body">
      <mavon-editor
        ref="mavonArea"
        class="md"
        :ishljs="true"
        :value="data.body ? data.body : ''"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :boxShadow="false"
        :placeholder="'暂无内容'"
        codeStyle="github"
        :scrollStyle="false"
      ></mavon-editor>
    </div>
  </div>
</template>

<script>
import Vimg from "@femessage/v-img";
import { mavonEditor } from "mavon-editor";
export default {
  components: {
    [Vimg.name]: Vimg,
    mavonEditor: mavonEditor
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          user: {}
        };
      }
    }
  }
};
</script>

<style lang="less">
.comment-item {
  border: 1px solid #efefef;
  border-radius: 4px;
  .style-class {
    position: fixed;
    left: 9999px;
    top: 9999px;
  }
  & + .comment-item {
    margin-top: 20px;
  }

  &-header {
    background-color: #f6f8fa;
    border-bottom: 1px solid #e0e0e0;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: #586069;
    padding: 10px 15px;
    font-size: 14px;
    img {
      cursor: pointer;
      height: 30px;
      width: 30px;
      border-radius: 100%;
      vertical-align: middle;
      display: inline-block;
      margin-right: 10px;
    }
  }

  &-body {
    overflow: visible;
    word-break: break-all;
    .v-note-wrapper {
      min-height: auto;
    }
    .v-show-content {
      padding: 15px 25px 0px 25px !important;
    }
    pre {
      padding: 0;
    }
  }
}
</style>
