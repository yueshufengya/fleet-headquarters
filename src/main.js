import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import 'element-ui/lib/theme-chalk/display.css';
import promise from "es6-promise";
import router from "./router";
import store from "./store";
import "babel-polyfill";
import "./utils/rem";

promise.polyfill();
Vue.use(ElementUI);

// 是否显示生产模式的提示信息
Vue.config.productionTip = false;

Vue.prototype.$resource = process.env.NODE_ENV === "production" ? "/public" : "/resource";

/**
 * 自定义指令
 */
// 自动获取焦点
// Vue.directive("focus",{
//   inserted: function(el,obj){
//     el.focus();
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
