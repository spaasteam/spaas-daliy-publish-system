const mdtoc = require("fe-markdown-toc");
import { postMessage2Group } from "@/services/v1/dingApi";

export const encodeBase64 = data => btoa(unescape(encodeURIComponent(data)));

export const decodeBase64 = data => decodeURIComponent(escape(atob(data)));

// 创建 summary 内容
export const createSummaryContent = ({ title, body, link, content }) => {
  const newQuestionContent = [title, body, link];

  const questionContent = [content].concat(newQuestionContent).join("\n\n");

  return encodeBase64(mdtoc.insert(questionContent)); // 返回可写数据
}

// 创建 README.md 内容
export const createReadmeContent = ({ title, body, link, content }) => {
  const TITLE = `# spaas-daily-practice\nspaas团队的每日一练，欢迎小伙伴们提交踊跃答案!\n\n`;

  const end_toekn = "<!-- end -->";

  const footerContent = content.slice(content.indexOf(end_toekn));

  const _content = [title, body, link].join("\n\n");

  return encodeBase64([].concat(TITLE, _content, footerContent).join("\n\n"));
}

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
}

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
  }
}

export const START_TIME = new Date("2019 08-27").getTime(); // 27 号开始，应该从 26开始算

const ONE_DAY = 60 * 60 * 1000 * 24;
const WEEK = 7;
const REPAIR_DAY = 3; // 要计算到周，但是我们是从周三开始的，所以加上

export const generatorDate = (d = new Date()) => {
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  return new Date(`${year} ${month}-${day}`);
}

// 判断是否是周六日
export const judgeIsWeekEnd = (date = new Date()) => {
  return [0, 6].includes(date.getDay());
}

export const getUser = (data = [], date = new Date()) => {
  const d = generatorDate(date);

  const endTime = d.getTime();

  const offset = (endTime - START_TIME) / ONE_DAY;

  const weekDay = Math.floor((offset + REPAIR_DAY) / WEEK) * 2; // 需要减去的周末天数

  const index = (offset - weekDay) % data.length; // data.length 就是安排的周期，除余 得到对应人员

  return !judgeIsWeekEnd(date) ? data[index] : null;
}

export const getRecentDays = (data, date = generatorDate(), days = 30) => {
  const result = [];
  const start = date.getTime();
  for (let i = 0; i < days; i++) {
    const d = new Date(start + i * ONE_DAY);
    result.push({
      date: d,
      user: getUser(data, d)
    });
  }
  return result;
}
