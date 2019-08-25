module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");

    // config.module
    //   .rule("unlazy")
    //   .include(/node_modules\/markdown-toc/)
    //   .test(/\.js$/)
    //   .use("unlazy-loader")
    //   .end();
  }

  // devServer: {
  //   proxy: "http://localhost:3000"
  // }
};
