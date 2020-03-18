<template>
  <div class="daliy-detail-page" v-loading="loading">
    <h1 @click="handleGo2Github">{{ issueData.title }}</h1>
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
          console.log(issueData);
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

  > h1 {
    cursor: pointer;
    font-size: 18px;
    &:hover {
      color: #1890ff;
      text-decoration: underline;
    }
  }
  .comemnt-content {
    margin-top: 20px;
  }
}
</style>
