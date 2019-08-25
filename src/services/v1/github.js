import axios from "@/services";

import { OWNER, REPO_NAME } from "@/common/const";

const base = `https://api.github.com`;

const repos_base = `${base}/repos/${OWNER}/${REPO_NAME}`;

// 检查 token 是否有效
export const getUserInfo = params => axios.$get(`${base}/user`, { params });

// 获取全部标签
export const getLabels = params =>
  axios.$get(`${repos_base}/labels`, { params });

// 创建 issue
export const postDaliy2Issue = params =>
  axios.$post(`${repos_base}/issues`, params);

// 获取 issue
export const getIssueList = params =>
  axios.$get(`${repos_base}/issues`, { params });

// 获取 github 文件 sha
export const getGithubFile = path =>
  axios.$get(`${repos_base}/contents/${path}`);

  // 更新文件
export const updateGithubFile = ({ path, ...params }) =>
  axios.$put(`${repos_base}/contents/${path}`, params);
