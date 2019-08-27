<template>
  <div class="label-management">
    <el-table :data="list" v-loading="loading">
      <el-table-column label="标签名" prop="name"></el-table-column>
      <el-table-column label="颜色" prop="color">
        <template v-slot="{ row }">
          <div class="color-main">
            <div
              class="color-span"
              :style="{ background: `#${row.color}` }"
            ></div>
            <el-button
              v-clipboard:copy="`#${row.color}`"
              v-clipboard:success="clipboardSuccess"
              class="button"
              type="text"
              >复制</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { value, onMounted } from "vue-function-api";
import { getlabelList } from "@/services/v1/github";
import clipboard from "@/directive/clipboard/index.js";

export default {
  directives: {
    clipboard
  },
  setup(props, ctx) {
    const list = value([]);
    const loading = value(false);

    const { toast } = ctx.root;

    onMounted(async () => {
      loading.value = true;
      list.value = await getlabelList();
      loading.value = false;
    });

    const clipboardSuccess = () => toast("复制成功");

    return {
      list,
      clipboardSuccess,
      loading
    };
  }
};
</script>

<style lang="less">
.label-management {
  .color-main {
    .button {
      display: none;
    }
    &:hover .button {
      position: absolute;
      display: inline-block;
    }
  }

  .color-span {
    cursor: pointer;
    display: inline-block;
    height: 30px;
    width: 30px;
    vertical-align: top;
    margin-right: 10px;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
