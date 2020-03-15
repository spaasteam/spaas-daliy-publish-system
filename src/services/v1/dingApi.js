import axios from "@/services";
import { isDev } from "@/common/const";

const apibase = isDev
  ? "http://127.0.0.1:9000/sendMsg2Ding"
  : "/.netlify/functions/sendMsg2Ding";
// 发送消息到群聊
export const postMessage2Group = params => axios.$post(apibase, params);
