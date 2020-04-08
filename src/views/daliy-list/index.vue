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
      <ul class="daliy-questions-content-list" v-if="computedList.length">
        <li
          class="daliy-questions-content-list-item"
          v-for="item in computedList"
          :key="item.node_id"
        >
          <router-link
            :to="{
              path: `/daliy-publish/daliy-detail`,
              query: { id: item.number }
            }"
            >{{ item.title }}</router-link
          >
        </li>
      </ul>
      <div class="no-data" v-else>
        <span
          >仓库空空的，快去<el-button
            type="text"
            style="margin: 0 5px"
            @click="$router.push('/daliy-publish/index')"
            >发布题目</el-button
          >吧</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import github from "@/common/github-api";
import { onMounted, value, computed } from "vue-function-api";

export default {
  name: "DaliyList",
  setup() {
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
      listLoading,
      labelList,
      computedList,
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
    position: relative;
    padding: 20px;
    height: calc(100% - 80px);
    overflow: scroll;
    .no-data {
      background: #fff;
      text-align: center;
      > span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
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
