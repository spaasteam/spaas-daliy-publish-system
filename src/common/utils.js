import toc from "./toc";
import { postMessage2Group } from "@/services/v1/dingApi";

export const encodeBase64 = data => btoa(unescape(encodeURIComponent(data)));

export const decodeBase64 = data => decodeURIComponent(escape(atob(data)));

// 创建 summary 内容
export const createSummaryContent = ({ title, body, link, content }) => {
  let newQuestionContent = [title, body, link];

  const questionContent = [content].concat(newQuestionContent).join("\n\n");

  return encodeBase64(toc(questionContent)); // 返回可写数据
};

// 创建 README.md 内容
export const createReadmeContent = ({ title, body, link, content }) => {
  const TITLE = `# spaas-daily-practice\nspaas团队的每日一练，欢迎小伙伴们提交踊跃答案!\n\n`;

  const end_toekn = "<!-- end -->";

  let footerContent = content.slice(content.indexOf(end_toekn));

  const _content = [title, body, link].join("\n\n");

  return encodeBase64([].concat(TITLE, _content, footerContent).join("\n\n"));
};

export const sendMsg2DingApi = ({ title, text }) => {
  const parmas = {
    msgtype: "markdown",
    markdown: {
      title,
      text
    },
    at: {
      isAtAll: true
    }
  };
  return postMessage2Group(parmas);
};
