module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");
  },
  configureWebpack: {
    externals: {
      vue: "Vue",
      "element-ui": "ELEMENT"
    }
  },

  devServer: {
    proxy: {
      "/.netlify": {
        target: "http://127.0.0.1:9000",
        changeOrigin: true,
        pathWrite: {
          "/.netlify/functions": ""
        }
      }
    }
  }
};
