import axios from "@/services";

// const apibase = `http://127.0.0.1:9000/sendMsg2Ding`;
const apibase = "/.netlify/functions/sendMsg2Ding";
// 发送消息到群聊
export const postMessage2Group = params => axios.$post(apibase, { params });
