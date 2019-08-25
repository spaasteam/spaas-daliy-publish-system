import axios from "@/services";

// 发送消息到群聊
export const postMessage2Group = params =>
         axios.$post(`/.netlify/functions/sendMsg2Ding`, params);
