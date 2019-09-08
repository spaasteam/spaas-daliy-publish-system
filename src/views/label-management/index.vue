<template>
  <div class="label-management">
    <div class="table-header">
      <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
    </div>
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
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <div class="opertion-main">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <loading-dialog
      :visible.sync="dialogVisible"
      :title="labelTitle"
      width="500px"
      :confirm="handleValidateForm"
    >
      <el-form-renderer :content="content" ref="form" />
    </loading-dialog>
  </div>
</template>

<script>
import { value, onMounted, computed } from "vue-function-api";
import {
  getlabelList,
  postLabel,
  deleteLabel,
  patchLabel
} from "@/services/v1/github";
import clipboard from "@/directive/clipboard/index.js";
import LoadingDialog from "@/components/loading-dialog";

export default {
  directives: {
    clipboard
  },
  components: {
    [LoadingDialog.name]: LoadingDialog
  },
  setup(props, ctx) {
    const list = value([]);
    const loading = value(false);
    const dialogVisible = value(false);
    const labelEdit = value(false);
    let oldName = ""; // 保存旧的 name

    const { refs, root } = ctx;
    const { toast, validateForm, $nextTick, $loadingConfirm } = root;

    const getList = async () => {
      loading.value = true;
      list.value = await getlabelList();
      loading.value = false;
    }

    const clipboardSuccess = () => toast("复制成功");

    const handleAdd = () => {
      dialogVisible.value = true;
      labelEdit.value = false;

      $nextTick(() => {
        refs.form.updateForm({
          color: "#000000",
          name: ""
        });
        refs.form.clearValidate && refs.form.clearValidate();
      })
    }

    const handleEdit = row => {
      oldName = row.name;
      dialogVisible.value = true;
      labelEdit.value = true;

      $nextTick(() => {
        refs.form.updateForm({
          color: `#${row.color}`,
          name: row.anme
        });
      })
    }

    const handleDelete = row => {
      $loadingConfirm({
        title: "删除提示",
        text: "确定要删除该标签吗?",
        confirm: () =>
          deleteLabel(row.name).then(() => {
            toast("操作成功");
            getList();
          })
      });
    }

    const handleValidateForm = async () => {
      const data = await validateForm(refs.form);

      const params = {
        ...data,
        color: data.color.slice(1)
      };

      const promise = labelEdit.value
        ? patchLabel({
            ...params,
            currentName: oldName
          })
        : postLabel(params);

      return promise.then(() => {
        toast("操作成功");
        getList();
        dialogVisible.value = false;
      })
    }

    onMounted(() => {
      getList();
    })

    const labelTitle = computed(() =>
      labelEdit.value ? "编辑标签" : "新增标签"
    );

    return {
      // methods
      clipboardSuccess,
      handleAdd,
      handleDelete,
      handleEdit,

      // getters
      labelTitle,

      // data
      list,
      loading,
      content: [
        {
          id: "name",
          label: "标签名",
          type: "input",
          rules: [
            {
              trigger: "blur",
              required: true,
              message: "标签名必填"
            }
          ]
        },
        {
          id: "color",
          label: "颜色",
          type: "colorPicker",
          default: "#000000"
        }
      ],
      dialogVisible,
      handleValidateForm
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
