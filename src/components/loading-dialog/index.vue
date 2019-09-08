<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :visible="visibleValue"
    :before-close="handleBeforeClose"
    class="loading-dialog"
  >
    <div
      class="loading-dialog-content"
      ref="content"
      :style="{ width: contentWidth }"
    >
      <slot></slot>
    </div>
    <slot name="footer">
      <span slot="footer" class="dialog-footer" v-if="hasFooter">
        <el-button v-if="hasCancel" @click="handleClose">{{
          cancelButtonText
        }}</el-button>
        <el-button
          type="primary"
          :disabled="
            typeof confirmDisabled === 'function'
              ? confirmDisabled()
              : confirmDisabled
          "
          @click="handleComfirm"
          :loading="btnLoading"
          >{{ confirmButtonText }}</el-button
        >
      </span>
    </slot>
  </el-dialog>
</template>

<script>
export default {
  name: "LoadingDialog",
  inheritAttrs: false,
  props: {
    /**
     * 是否显示 dialog
     */
    visible: {
      type: Boolean,
      default: false
    },
    /**
     * 内容宽度
     */
    contentWidth: {
      type: String,
      default: "100%"
    },
    confirmButtonText: {
      type: String,
      default: "确定"
    },
    cancelButtonText: {
      type: String,
      default: "取消"
    },
    // 是否有取消按钮
    hasCancel: {
      type: Boolean,
      default: true
    },
    /**
     * 是否有底部栏
     */
    hasFooter: {
      type: Boolean,
      default: true
    },

    /**
     * 关闭前会执行检查是否可以关闭
     */
    beforeClose: {
      type: Function,
      default: () => true
    },
    /**
     * 点击按钮触发的事件，传入对应的处理 promise 可以达到 loading 的效果
     */
    confirm: {
      type: Function,
      default: () => true
    },
    confirmDisabled: {
      type: [Function, Boolean],
      default: false
    }
  },
  data() {
    return {
      btnLoading: false,
      contentHeight: "auto"
    };
  },
  computed: {
    visibleValue: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },
  methods: {
    handleBeforeClose() {
      Promise.resolve(this.beforeClose()).then(flag => {
        if (!flag) return;
        this.handleClose();
      })
    },
    handleClose() {
      /**
       * 双向绑定 visible
       */
      this.$emit("update:visible", false);
      /**
       * 关闭时间
       */
      this.$emit("close");
    },
    handleComfirm() {
      this.btnLoading = true;

      Promise.resolve(this.confirm())
        .then(flag => {
          if (!flag) return;
          /**
           * 确认成功
           */
          this.$emit("confirm");
        })
        .catch(e => console.log(e))
        .finally(() => {
          this.btnLoading = false;
        })
    }
  }
};
</script>

<style lang="less">
.loading-dialog {
  .el-dialog {
    // width: 840px !important;
    // max-height: 608px;

    &__body {
      padding: 0 20px 20px;
    }
    &__header,
    &__footer {
      padding: 20px;
    }
  }
  &-bar {
    text-align: center;
  }
  &-content {
    display: inline-block;
    margin: 0 auto;
    height: 100%;
    text-align: left;
  }
}
</style>
