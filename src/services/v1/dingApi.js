import axios from '@/services'
import { DING_TOKEN } from '@/common/const'

const base = 'https://oapi.dingtalk.com/robot/send'

// 发送消息到群聊
export const postMessage2Group = params =>
  axios.$post(`${base}?access_toekn=${DING_TOKEN}`, params);
