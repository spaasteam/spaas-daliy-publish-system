import Vue from "vue";
import { MessageBox } from "element-ui";
import axios from "@/services";
import dayjs from "dayjs";

Vue.mixin({
  methods: {
    toast(message = "操作成功", type = "success") {
      this.$message({
        message,
        type
      });
    },
    dateFormat(value) {
      return value && dayjs(value).format("YYYY-MM-DD HH:mm:ss");
    },

    validateForm(form) {
      return new Promise((resolve, reject) => {
        if (!form) reject(new Error("form unmounted"));

        form.validate(validate => {
          if (!validate) return reject();

          const data = form.getFormValue();

          resolve(data);
        });
      });
    }
  }
});

Vue.prototype.$axios = axios;
Vue.prototype.$dayjs = dayjs;

/* eslint-disable */
/**
 *
 */
Vue.prototype.$loadingConfirm = function ({
  title,
  text,
  confirm,
  confirmButtonText = '确定',
  cancelButtonText = '取消',
  type = 'warning'
}) {
  if (typeof confirm !== 'function') {
    throw new Error('confirm must be function')
  }
  return MessageBox.confirm(text, title, {
    confirmButtonText,
    cancelButtonText,
    type,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        const handleClose = () => {
          instance.confirmButtonLoading = false
          done()
        }
        instance.confirmButtonLoading = true
        Promise.resolve(confirm()).finally(handleClose)
      } else {
        return done()
      }
    }
  }).catch(() => { })
}
