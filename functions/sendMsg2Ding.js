const axios = require("axios");
const base = "https://oapi.dingtalk.com/robot/send";
exports.handler = function(event, context, callback) {
  const data = JSON.parse(event.body);

  const body = {
    msgtype: "markdown",
    markdown: {
      title: data.title,
      text: `#### ${data.title}\n` + `> ${data.text}\n`
    },
    at: {
      isAtAll: true
    }
  };
  axios
    .post(
      `${base}?access_token=25defed218f9ef430845d6aa5a515c727ffc9e47703176d455d2bd5a0cadbe25`,
      body,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(res => {
      // console.log(res)
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          code: 0,
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
