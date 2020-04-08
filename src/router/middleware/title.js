import { APP_NAME } from "@/common/const";

export default (to, from, next) => {
  document.title = (to.meta && to.meta.title) || APP_NAME;
  next();
};
