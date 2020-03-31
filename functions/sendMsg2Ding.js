const axios = require("axios");
require("dotenv").config();
const base = "https://oapi.dingtalk.com/robot/send";

exports.handler = function(event, context, callback) {
  const data = JSON.parse(event.body);

  const payload = {
    msgtype: "markdown",
    markdown: {
      title: `每日一题提醒: ${data.title} 题目发布了`,
      text: `#### ${data.title}\n` + `> ${data.text}\n`
    },
    at: {
      isAtAll: true
    }
  };

  axios
    .post(`${base}?access_token=${process.env.DING_TOKEN}`, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          code: 0,
          token: process.env.DING_TOKEN,
          message: "success"
        })
      });
    })
    .catch(() => {
      callback(null, {
        statusCode: 500,
        body: false
      });
    });
};
