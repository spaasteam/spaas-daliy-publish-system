require("dotenv").config();

exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      msg: "hello world",
      token1: "a",
      token: process.env.DING_TOKEN,
      code: 0
    })
  });
};
