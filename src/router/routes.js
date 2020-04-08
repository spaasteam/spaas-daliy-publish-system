import Layout from "@/layouts/home";

export default [
  {
    path: "/",
    name: "home",
    component: Layout,
    hidden: true,
    redirect: "/daliy-publish/index"
  },
  {
    path: "/login",
    name: "login",
    hidden: true,
    component: () => import(`@/views/login.vue`)
  },
  {
    path: "/daliy-publish",
    name: "daliy-publish",
    component: Layout,
    meta: {
      title: "每日一题",
      icon: "el-icon-menu"
    },
    redirect: "/daliy-publish/index",
    children: [
      {
        path: "index",
        name: "daliy-publish-index",
        meta: {
          title: "发布题目"
        },
        component: () => import("@/views/daliy-publish")
      },
      {
        path: "label-management",
        name: "labelManagement",
        meta: {
          title: "标签管理"
        },
        component: () => import("@/views/label-management")
      },
      {
        path: "daliy-list",
        name: "daliyList",
        meta: {
          title: "题目列表"
        },
        component: () => import("@/views/daliy-list")
      },
      {
        path: "daliy-detail",
        name: "daliyDetail",
        hidden: true,
        meta: {
          tilte: "题目详情"
        },
        component: () => import("@/views/daliy-detail")
      }
      // {
      //   path: "daliy-record",
      //   name: "daliyRecord",
      //   meta: {
      //     title: "发题记录"
      //   },
      //   component: () => import("@/views/daliy-record")
      // }
    ]
  },
  {
    path: "/*",
    hidden: true,
    component: () => import(`@/views/404/index.vue`)
  }
];
