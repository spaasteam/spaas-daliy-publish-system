const mdtoc = require("fe-markdown-toc");
import { APP_NAME } from "./const";

import { postMessage2Group } from "@/services/v1/dingApi";

export const encodeBase64 = data => btoa(unescape(encodeURIComponent(data)));

export const decodeBase64 = data => decodeURIComponent(escape(atob(data)));

// 创建 summary 内容
export const createSummaryContent = ({ title, body, link, content }) => {
  const newQuestionContent = [title, body, link];

  const questionContent = [content].concat(newQuestionContent).join("\n\n");

  return encodeBase64(mdtoc.insert(questionContent)); // 返回可写数据
};

// 创建 README.md 内容
export const createReadmeContent = ({ title, body, link, content }) => {
  const TITLE = `# ${APP_NAME}\n每日一练，欢迎小伙伴们提交踊跃答案!\n\n`;

  const end_toekn = "<!-- end -->";

  const footerContent = content.slice(content.indexOf(end_toekn));

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

/**
 * @description 防抖
 * @param {Function}  callback
 * @param {Number}  时间间隔 默认500ms
 * @param {Boolean}  是否立即开始
 * @example
 * @return {Function}
 */
export function debounce(func, wait = 500, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = [].slice.apply(arguments);

    timestamp = +new Date();
    const callNow = immediate && !timeout;

    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
export function routeHandler(routes, paths = []) {
  return routes.reduce((acc, route) => {
    if (route.children && route.children.length) {
      route.children = routeHandler(route.children, [].concat(route.path));
    }

    if (!route.hidden) {
      acc.push({
        name: route.meta.title,
        icon: route.meta.icon,
        path: paths.concat([route.path]).join("/"),
        children: route.children
      });
    }

    return acc;
  }, []);
}
