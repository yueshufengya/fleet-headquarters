import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  //数据源
  state: {
    LoginInfos: {
      userId: "",
      userName: "",
      userRole: "",
      userPhoto: "",
      token: ""
    }
  },
  /**
   * getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
   */
  getters: {},
  /**
   * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
   * 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数。
   * Mutation 必须是同步函数。
   */
  mutations: {
    /**
     * localStorage:同一客户端的同一款浏览器的同一窗口中的不同页面用的是同一个localStorage;
     * 同一客户端的同一款浏览器的不同窗口中的页面也是用的同一个localStorage.
     * 问题就是:同一款浏览器同一窗口不同页面或者不同窗口中的页面,向localStorage存储的信息会相互影响.
     * localStorage与sessionStorage的唯一一点区别就是localStorage属于永久性存储，而sessionStorage属于当会话
     * 会话结束的时候，sessionStorage中的键值对会被清空
     * localStorage.setItem('loginName', name);
     */
    /**
     * 这里添加LI的默认值是为了在“登录超时”、“登录无效登录”等情况下，commit通过不传递载荷Payload(第二个参数)的方式将state中的数据重置为初始值。
     */
    setLoginInfos: (
      state,
      LI = { u_id: "", u_name: "", u_role: "", u_photo: "", tk: "" }
    ) => {
      state.LoginInfos.userId = LI.u_id;
      state.LoginInfos.userName = LI.u_name;
      state.LoginInfos.userRole = LI.u_role;
      state.LoginInfos.userPhoto = LI.u_photo;
      state.LoginInfos.token = LI.tk;
      sessionStorage.setItem("userId", state.LoginInfos.userId);
      sessionStorage.setItem("userName", state.LoginInfos.userName);
      sessionStorage.setItem("userRole", state.LoginInfos.userRole);
      sessionStorage.setItem("userPhoto", state.LoginInfos.userPhoto);
      sessionStorage.setItem("token", state.LoginInfos.token);
    }
  },
  /**
   * Action 类似于 mutation，不同在于：
   * Action 提交的是 mutation，而不是直接变更状态。
   * Action 可以包含任意异步操作。
   */
  actions: {},
  /**
   * Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。
   */
  modules: {}
});
