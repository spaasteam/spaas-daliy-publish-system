<template>
  <div class="daliy-questions">
    <div class="daliy-questions-header">
      <el-form inline>
        <el-form-item label="标题关键字">
          <el-input
            v-model="searchData.keyword"
            placeholder="请输入关键字"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-button
            @click="searchData.sort = !searchData.sort"
            :icon="`el-icon-caret-${searchData.sort ? 'top' : 'bottom'}`"
            >{{ searchData.sort ? "正" : "倒" }}序</el-button
          >
        </el-form-item>
        <el-form-item label="根据标签过滤">
          <el-select
            v-model="searchData.labels"
            placeholder="请选择标签"
            clearable
          >
            <el-option
              v-for="item in labelList"
              :key="item.name"
              :value="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="daliy-questions-content" v-loading="listLoading">
      <ul class="daliy-questions-content-list">
        <li
          class="daliy-questions-content-list-item"
          v-for="item in computedList"
          :key="item.node_id"
        >
          <router-link
            :to="{
              path: `/daliy-publish/daliy-detail`,
              query: { id: item.id }
            }"
            >{{ item.title }}</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import github from "@/common/github-api";
import { onMounted, value, computed } from "vue-function-api";

export default {
  name: "DaliyList",
  setup(props, ctx) {
    const list = value([]);
    const listLoading = value(false);
    const labelList = value([]);
    const searchData = value({
      labels: "",
      keyword: "",
      sort: false
    });

    onMounted(() => {
      getQuestionList();
      getLabelList();
    });

    const getQuestionList = async () => {
      listLoading.value = true;

      try {
        const { data } = await github.getIssueList({ state: "open" });
        list.value = data.map(item => ({
          ...item,
          labels: item.labels.map(v => v.name).join(",")
        }));
      } catch (error) {
        console.log(error);
      } finally {
        listLoading.value = false;
      }
    };

    const getLabelList = async () => {
      const { data } = await github.getLabelList();

      labelList.value = data.map(({ name }) => ({ value: name, label: name }));
    };

    const computedList = computed(() => {
      const { keyword, sort, labels } = searchData.value;

      const content = list.value
        .filter(item => item.title.includes(keyword))
        .filter(item => item.labels.includes(labels));

      return !sort ? content : content.reverse();
    });

    const resetSearch = () => {
      searchData.value = {
        labels: "",
        keyword: "",
        sort: false
      };
    };

    return {
      list,
      listLoading,
      labelList,
      computedList,
      content: [
        {
          id: "keyword",
          label: "题目关键字",
          default: "",
          type: "input",
          el: {
            placeholder: "请输入题目关键字"
          }
        },
        {
          type: "select",
          label: "排序",
          id: "sort",
          default: "",
          el: {
            clearable: true
          },
          options: [
            {
              label: "根据创建时间",
              value: "created"
            },
            {
              label: "根据更新时间",
              value: "updated"
            }
          ]
        },
        {
          id: "labels",
          type: "select",
          label: "标签",
          default: [],
          el: {
            multiple: true
          },
          remote: {
            async request() {
              const { data } = await github.getLabelList();
              return data.map(v => ({
                label: v.name,
                value: v.name
              }));
            }
          }
        }
      ],
      searchData,

      // methods
      getQuestionList,
      resetSearch
    };
  }
};
</script>

<style lang="less">
.daliy-questions {
  height: 100%;
  &-header {
    box-shadow: 3px 4px 5px #eee;
  }

  &-content {
    padding: 20px;
    height: calc(100% - 80px);
    overflow: scroll;
    &-list {
      &-item {
        > a {
          line-height: 30px;
          color: #3eaf7c;
          font-weight: 500;
          font-size: 16px;
          text-decoration: none;

          &:hover {
            color: #1890ff;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
