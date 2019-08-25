const axios = require("axios");

exports.handler = async function(event, context, cb) {
  await axios.post(
    `${base}?access_toekn=7cd2c0105cc43f47486078ef15b73b8e0eb59a9763524627da74a5d37cec5df9`,
    event.body
  );

  cb(null, {
    statusCode: 200,
    body: {
      code: 0,
      message: "success"
    }
  });
};
