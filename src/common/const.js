export const DING_TOKEN = process.env.DING_TOKEN;

export const isDev = process.env.NODE_ENV === "development";

export const APP_NAME =
  process.env.VUE_APP_APP_NAME || "SPaas 每日一题发布系统";

// 仓库 owner
export const OWNER = process.env.VUE_APP_GITHUB_OWNER;

// 仓库名字
export const REPO_NAME = process.env.VUE_APP_GITHUB_REPO_NAME;
