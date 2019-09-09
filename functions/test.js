exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      msg: "hello world",
      code: 0
    })
  });
};
