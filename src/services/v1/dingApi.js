import axios from "@/services";

const apibase = "/.netlify/functions/sendMsg2Ding";
// 发送消息到群聊
export const postMessage2Group = params => axios.$post(apibase, params);
