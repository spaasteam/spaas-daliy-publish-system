<template>
  <div class="daily-schedule">
    <el-calendar>
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template slot="dateCell" slot-scope="{date, data}">
        <p
          :class="data.isSelected ? 'is-selected' : ''"
        >{{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}</p>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import { onMounted } from "vue-function-api";
import { getUserJson } from "@/services/v1/data.js";
export default {
  setup() {
    onMounted(params => {
      getUserJson().then(data => {
        console.log(data);
      });
    });

    return {};
  }
};
</script>

<style>
</style>
