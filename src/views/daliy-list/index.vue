<template>
  <div class="daliy-questions">
    <div class="daliy-questions-header">
      <el-form-renderer
        :content="content"
        v-model="searchData"
        ref="form"
        inline
      >
        <el-form-item label="">
          <el-button type="primary" @click="getQuestionList">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form-renderer>
    </div>
    <div class="daliy-questions-content" v-loading="listLoading">
      <ul class="daliy-questions-content-list">
        <li
          class="daliy-questions-content-list-item"
          v-for="item in list"
          :key="item.node_id"
        >
          <router-link :to="`${$route.path}/${item.id}`">{{
            item.title
          }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import github from "@/common/github-api";
import { onMounted, value } from "vue-function-api";

export default {
  name: "DaliyList",
  setup(props, ctx) {
    const list = value([]);
    const listLoading = value(false);
    const searchData = value({
      labels: [],
      keyword: "",
      sort: ""
    });

    onMounted(() => {
      getQuestionList();
    });

    const getQuestionList = async () => {
      listLoading.value = true;
      const params = {
        ...searchData.value,
        state: "open",
        labels: searchData.value.labels.join(",")
      };

      try {
        const { data } = await github.getIssueList(params);
        list.value = data.filter(item =>
          item.title.includes(params.keyword || "")
        );
      } catch (error) {
        console.log(error);
      } finally {
        listLoading.value = false;
      }
    };

    const resetSearch = () => {
      searchData.value = {};
      getQuestionList();
    };

    return {
      list,
      listLoading,
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
    height: 100%;
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
