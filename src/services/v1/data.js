import axios from "@/services";

export const getUserJson = () => axios.$get(
  "https://spaasusers.oss-cn-shenzhen.aliyuncs.com/account.json"
);
