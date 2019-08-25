<template>
  <div class="daliy-publish">
    <h2 class="title-wrap">发布题目</h2>
    <el-form-renderer :content="postContent" ref="form" label-width="60px" v-loading="loading">
      <el-form-item class="btn-wrap">
        <el-button type="primary" :loading="loading" @click="post">发布</el-button>
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

import { postMessage2Group } from '@/services/v1/dingApi'

import {
  encodeBase64,
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
  }).then(([data]) => Number(data.title.match(/\d+/)[0]) + 1);

// title, body, link
const writeSummaryFile = async ({ gitMessage, title, link, body }) => {
  const summaryPath = "datum/summary.md";

  const { content, sha } = await getFileShaAndContent(summaryPath);

  const writeContent = createSummaryContent({
    title,
    link,
    body,
    content
  });


  return writeContent;
  // await updateGithubFile({
  //   path: summaryPath,
  //   sha,
  //   message: gitMessage,
  //   content: writeContent
  // });
};

const writeReadmeFile = async ({ gitMessage, title, link, body }) => {
  const summaryPath = "README.md";

  const { content, sha } = await getFileShaAndContent(summaryPath);
  const writeContent = createReadmeContent({
    title,
    link,
    body,
    content
  });
  return writeContent;
  // await updateGithubFile({
  //   path: summaryPath,
  //   sha,
  //   message: gitMessage,
  //   content: writeContent
  // });
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
    const {
      refs,
      root: { toast }
    } = ctx;

    onMounted(() => {
      getLabels().then(data => {
        labelList.value = data.map(({ id, name }) => ({
          value: name,
          label: name
        }));
        refs.form.setOptions("labels", labelList.value);
      });
    });

    const resetForm = () => {
      refs.form.updateForm({
        labels: [],
        body:'',
        title: ''
      })
    }

    // 提交 issue
    const post = () => {
      refs.form.validate(async validate => {
        if (!validate) return;

        const data = refs.form.getFormValue();

        loading.value = true;

        try {
          const number = await getLastQuestionNumber(); // 获取最近的题目标号

          const title = `第 ${number} 题: ${data.title}`;
          const toDayTitle = `今日题目 ${data.title}`;
          const gitMessage = `feat: ${title}`;

          const params = {
            ...data,
            title: data.title,
            body: encodeBase64(data.bdoy)
          };

          // const { html_url } = await postDaliy2Issue(data);
          const html_url =
            "https://api.github.com/repos/octocat/Hello-World/issues/1347";

          const questionData = {
            gitMessage,
            title,
            body: data.body,
            link: `[做题连接](${html_url})`
          };

          // 更新文件
          await Promise.all([
            writeReadmeFile({
              ...questionData,
              title: `### ${toDayTitle}`
            }),
            writeSummaryFile({ ...questionData, title: `### ${title}` })
          ])

          await postMessage2Group({
            title: toDayTitle,
            text: questionData.link
          })

          toast("发布题目成功");
          resetForm()
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }

        console.log(data);
      });
    };

    return {
      labelList,
      postContent,
      post,
      loading
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
}
</style>
