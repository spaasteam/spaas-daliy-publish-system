import dayjs from 'dayjs'

export const DING_TOKEN = process.env.DING_TOKEN;

export const SYSTEM_NAME = "SPaas 每日一题发布系统";

// 仓库 owner
export const OWNER = "spaasteam";
// export const OWNER = "cjfff";

// 仓库名字
export const REPO_NAME = "spaas-daily-practice";
// export const REPO_NAME = "node-music";

// 8月27号开始时间
export const DAILY_START = new Date("2019 08-27").getTime()


export const getIndex = () => {
  let d = new Date();
  const day = d.getDate()
  const month = d.getMonth();
  const year = d.getFullYear()
  const endTime = new Date(`${year} ${month}-${day}`).getTime();
  console.log(endTime, )
}

console.log(getIndex());
