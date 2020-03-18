<template>
  <div class="daliy-publish">
    <h2 class="title-wrap">发布题目</h2>
    <el-form-renderer
      :content="postContent"
      ref="form"
      label-width="60px"
      class="publish-form"
      v-loading="readyLoading"
    >
      <div class="publish-content-mask" v-show="readyPublish"></div>
    </el-form-renderer>
    <el-form-renderer :content="[]">
      <el-form-item class="btn-wrap" v-if="!readyPublish">
        <el-button
          type="primary"
          @click="handleReadyPublish"
          v-loading="readyLoading"
          >预备发布</el-button
        >
      </el-form-item>
      <el-form-item v-show="eventList.length">
        <el-steps :active="activeIndex" simple>
          <el-step
            v-for="item in eventList"
            :key="item.title"
            :title="item.title"
          ></el-step>
          <!-- <el-step title="步骤 1" icon="el-icon-edit"></el-step>
          <el-step title="步骤 2" icon="el-icon-upload"></el-step>
          <el-step title="步骤 3" icon="el-icon-picture"></el-step>-->
        </el-steps>
      </el-form-item>
      <el-form-item class="btn-wrap" v-if="readyPublish">
        <el-button type="primary" :loading="loading"
@click="runTask"
          >发布</el-button
        >
      </el-form-item>
    </el-form-renderer>
  </div>
</template>

<script>
import { onMounted, value } from "vue-function-api";
import mavonEditor from "mavon-editor";

import {
  getLabels,
  postDaliy2Issue,
  getIssueList,
  getGithubFile,
  updateGithubFile
} from "@/services/v1/github";

import { postMessage2Group } from "@/services/v1/dingApi";

import {
  decodeBase64,
  createSummaryContent,
  createReadmeContent
} from "@/common/utils";

const getFileShaAndContent = path =>
  getGithubFile(path).then(({ sha, content }) => ({
    sha,
    content: decodeBase64(content)
  }));

// 获取最后题目的号码数
const getLastQuestionNumber = () =>
  getIssueList({
    per_page: 1,
    page: 1
  }).then(([data]) => ({
    titleNumber: Number(data.title.match(/\d+/)[0]) + 1,
    number: data.number
  }));

// 写汇总文件 为什么要返回 link ? 因为后续需要
const writeSummaryFile = async ({ gitMessage, title, link, body }) => {
  const summaryPath = "datum/summary.md";

  const { content, sha } = await getFileShaAndContent(summaryPath);
  const writeContent = createSummaryContent({
    title,
    link,
    body,
    content
  });

  // return writeContent;
  await updateGithubFile({
    path: summaryPath,
    sha,
    message: gitMessage,
    content: writeContent
  });
};

// 写 readme 文件
const writeReadmeFile = async ({ gitMessage, title, link, body }) => {
  const summaryPath = "README.md";

  const { content, sha } = await getFileShaAndContent(summaryPath);

  const writeContent = createReadmeContent({
    title,
    link,
    body,
    content
  });
  // return writeContent;
  await updateGithubFile({
    path: summaryPath,
    sha,
    message: gitMessage,
    content: writeContent
  });
};

const postFormData = [
  {
    type: "input",
    id: "title",
    label: "标题",
    el: { placeholder: "请输入" },
    rules: [
      {
        required: true,
        message: "标题为必填",
        trigger: "blur"
      }
    ]
  },
  {
    type: "select",
    id: "labels",
    el: { placeholder: "请选择", multiple: true },
    label: "标签",
    rules: [
      {
        type: "array",
        required: true,
        message: "标签为必选",
        trigger: ["blur", "change"]
      }
    ]
  },
  {
    id: "body",
    component: mavonEditor.mavonEditor,
    label: "内容",
    rules: [
      {
        validator: (rules, value, cb) => {
          if (!value) cb("内容必填");
          cb();
        },
        message: "内容必填",
        trigger: ["blur", "change"]
      }
    ]
  }
];

export default {
  name: "DaliyPublish",
  setup(props, ctx) {
    const labelList = value([]);
    const postContent = value(postFormData);
    const loading = value(false);
    const eventList = value([]);
    const readyPublish = value(false);
    const readyLoading = value(false);
    const activeIndex = value(0);
    const {
      refs,
      root: { toast }
    } = ctx;

    onMounted(() => {
      getLabels().then(data => {
        labelList.value = data.map(({ name }) => ({
          value: name,
          label: name
        }));
        refs.form && refs.form.setOptions("labels", labelList.value);
      });
    });

    const resetForm = () => {
      refs.form.updateForm({
        labels: [],
        body: "",
        title: ""
      });
      eventList.value = [];
      activeIndex.value = 0;
      readyPublish.value = false;
    };

    const runTask = async () => {
      loading.value = true;
      for (let i = 0; i < eventList.value.length; i++) {
        const item = eventList.value[i];

        if (item.success) continue;
        try {
          await item.cb().then(() => {
            item.success = true;
            activeIndex.value = i + 1;
          });
        } catch (error) {
          loading.value = false;
          toast(
            `由于网络原因导致任务异常，请再次点击发布， 任务 将从 ${item.title} 重新开始`,
            "warning"
          );
          return;
        }
      }
      loading.value = false;
      toast("发布成功!");
      resetForm();
    };

    // 提交 issue
    const handleReadyPublish = () => {
      refs.form.validate(async validate => {
        if (!validate) return;

        const data = refs.form.getFormValue();

        readyLoading.value = true;

        try {
          const { titleNumber, number } = await getLastQuestionNumber(); // 获取最近的题目标号

          const title = `第 ${titleNumber} 题: ${data.title}`;
          const toDayTitle = `今日题目 ${data.title}`;
          const gitMessage = `feat: ${title}`;
          const link = `https://github.com/spaasteam/spaas-daily-practice/issues/${number +
            1}`;

          const params = {
            ...data,
            title
          };

          const questionData = {
            gitMessage,
            title,
            body: data.body,
            link: `[做题连接](${link})`
          };

          // const { html_url } = await postDaliy2Issue(params);

          eventList.value.push({
            cb: () => postDaliy2Issue(params),
            success: false,
            title: "发布 issue 到 题目仓库"
          });

          // 添加写 readme 文件任务到队列
          eventList.value.push({
            cb: () =>
              writeReadmeFile({ ...questionData, title: `### ${toDayTitle}` }),
            success: false,
            title: "发布题目到 README 文件"
          });

          // 添加 写 smmary 文件任务到队列
          eventList.value.push({
            cb: () =>
              writeSummaryFile({ ...questionData, title: `### ${title}` }),
            success: false,
            title: "发布题目到 summary 文件"
          });

          // 推送钉钉
          eventList.value.push({
            cb: () =>
              postMessage2Group({
                title: toDayTitle,
                text: questionData.link
              }),
            success: false,
            title: "通知 钉钉 群聊"
          });

          toast("预备工作完成，请点击发布题目");
          // resetForm();
          readyPublish.value = true;
        } catch (error) {
          console.log(error);
        } finally {
          readyLoading.value = false;
        }

        // console.log(data);
      });
    };

    return {
      labelList,
      postContent,
      handleReadyPublish,
      readyLoading,
      loading,
      eventList,
      readyPublish,
      activeIndex,
      runTask
    };
  }
};
</script>

<style lang="less">
@import "~mavon-editor/dist/css/index.css";

.daliy-publish {
  .title-wrap {
    text-align: center;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 700;
  }
  .btn-wrap {
    text-align: center;
    .el-button {
      width: 300px;
    }
  }
  .v-note-wrapper {
    min-height: 400px;
  }

  .publish-form {
    position: relative;
    .publish-content-mask {
      cursor: not-allowed;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(255, 255, 255, 0.5);
      width: 100%;
      height: 100%;
      z-index: 1600;
    }
  }
}
</style>
