import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login/index";
import Home from "../views/Home/index";
import User from "../components/User/index";
import Fleet from "../components/Fleet/index";
import WSGrade from "../components/WSGrade/index";
import WSType from "../components/WSType/index";
import Culture from "../components/Culture/index";
import Management from "../components/Management/index";
import Information from "../components/Information/index";
import Archive from "../components/Archive/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "login" }
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    children: [
      // 核星战舰
      {
        path: "user",
        name: "user",
        component: User
      },
      // 舰队组建
      {
        path: "fleet",
        name: "fleet",
        component: Fleet
      },
      // 战舰级别
      {
        path: "WarshipGrade",
        name: "WarshipGrade",
        component: WSGrade
      },
      // 战舰类型
      {
        path: "warshipType",
        name: "warshipType",
        component: WSType
      },
      // 航线文化
      {
        path: "culture",
        name: "culture",
        component: Culture
      },
      // 舰队管理
      {
        path: "management",
        name: "management",
        component: Management
      },
      // 战舰档案
      {
        path: "archive",
        name: "archive",
        component: Archive
      },
      // 个人信息
      {
        
        path: "infos",
        name: "infos",
        component: Information
      },
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
