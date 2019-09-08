<template>
  <div class="daily-schedule">
    <el-calendar>
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template slot="dateCell" slot-scope="{ date, data }">
        <div class="date-main">
          <div class="date">
            {{
              data.day
                .split("-")
                .slice(1)
                .join("-")
            }}
          </div>
          <div class="name">
            {{ getUserName(date) }} {{ data.isSelected ? "✔️" : "" }}
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import { onMounted, value, computed } from "vue-function-api";
import { getUserJson } from "@/services/v1/data.js";
import { getUser, START_TIME, getRecentDays } from "@/common/utils";
export default {
  setup(props, ctx) {
    const { $store } = ctx.root;
    const userList = value([]);

    const userInfo = computed(() => $store.getters.user);

    onMounted(() => {
      getUserJson().then(data => {
        userList.value = data;

        // const recentData = getRecentDays(data).filter(
        //   ({ user }) => user && user.account === userInfo.value.username
        // );

        // console.log(`您最近一天的发题时间为 ： ` + recentData[0].date.toLocaleDateString());
      })
    });

    const getUserName = date => {
      if (date.getTime() < START_TIME) return;

      const user = getUser(userList.value, date);
      return (user && user.name) || "休息";
    };

    return {
      userList,
      getUserName
    };
  }
};
</script>

<style lang="less">
.daily-schedule {
  .date-main {
    position: relative;
    height: 100%;

    .name {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
