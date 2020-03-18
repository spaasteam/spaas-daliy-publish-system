<template>
  <div class="daliy-detail-page" v-loading="loading">
    <div class="daliy-detail-page-header">
      <h1 @click="handleGo2Github">
        {{ issueData.title }}
      </h1>

      <span class="time-text"
        >创建时间: {{ dateFormat(issueData.created_at) }}</span
      >
    </div>
    <div class="comemnt-content">
      <comment-card
        v-for="data in issueData.comments"
        :key="data.id"
        :data="data"
      ></comment-card>
    </div>
  </div>
</template>

<script>
import { onMounted, value } from "vue-function-api";
import github from "@/common/github-api";

import CommentCard from "./components/comment-card";

export default {
  components: {
    CommentCard
  },
  setup(props, ctx) {
    const loading = value(loading);
    const issueData = value({
      user: {}
    });

    onMounted(() => {
      getIssueContent();
    });

    const getIssueContent = async () => {
      const { id } = ctx.root.$route.query;
      loading.value = true;
      Promise.all([github.getIssue(id), github.getIssueContent(id)])
        .then(([{ data }, { data: comments }]) => {
          issueData.value = {
            ...data,
            comments: [
              {
                ...data,
                type: "created"
              },
              ...comments.map(v => ({ ...v, type: "commented" }))
            ]
          };
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const handleGo2Github = () => {
      window.open(issueData.value.html_url);
    };

    return {
      issueData,
      loading,

      // methods
      handleGo2Github
    };
  }
};
</script>

<style lang="less">
.daliy-detail-page {
  height: 100%;
  &-header {
    position: relative;
    height: 30px;
    > h1 {
      cursor: pointer;

      font-size: 18px;
      &:hover {
        color: #1890ff;
        text-decoration: underline;
      }
    }
    .time-text {
      margin-top: 5px;
      font-size: 12px;
      display: block;
      color: #999;
    }
  }
  .comemnt-content {
    margin-top: 20px;
    height: calc(100% - 30px);
    overflow: auto;
  }
}
</style>
