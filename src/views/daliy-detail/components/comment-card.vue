<template>
  <div class="comment-item">
    <div class="comment-item-header">
      <a :href="html_url"></a>
      <v-img :src="data.user.avatar_url" :alt="data.user.login"></v-img>
      {{ data.user.login }} {{ data.type }}
    </div>
    <div class="comment-item-body markdown-body">
      <div class="v-note-read-content" v-html="renderValue"></div>
    </div>
  </div>
</template>

<script>
import mavonEditor from "mavon-editor";
import Vimg from "@femessage/v-img";

export default {
  components: {
    [Vimg.name]: Vimg
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
  },
  setup(props, ctx) {
    const { data } = props;

    const renderValue = mavonEditor.mavonEditor
      .getMarkdownIt()
      .render(data.body);

    return {
      data,
      renderValue
    };
  }
};
</script>

<style lang="less">
.comment-item {
  border: 1px solid #efefef;
  border-radius: 4px;
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
    > img {
      cursor: pointer;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      vertical-align: middle;
      display: inline-block;
      margin-right: 10px;
    }
  }

  &-body {
    overflow: visible;
    word-break: break-all;
    padding: 20px;
    .v-note-read-content {
      pre {
        background: #fff;
        margin-bottom: 0;
      }
    }
    p {
      margin-bottom: 0;
    }
    pre {
      padding: 0;
    }
  }
}
</style>
