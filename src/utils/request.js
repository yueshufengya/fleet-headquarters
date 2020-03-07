/**
 * 对axios进行封装,定义axios拦截器
 */
import axios from "axios";

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";

// 创建axios对象 在api目录中封装api接口的时候，会使用这里创建的axios对象
const _axios = axios.create({
  baseURL: BASEURL, // http://192.168.2.194:8080/devApi 或者 http://localhost:8080/devApi
  timeout: 15000 // 请求超时设置
});

// 添加axios拦截器
/**
 * 请求拦截器--请求接口前，做一些数据处理
 */
_axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    config.headers["Authorization"] = sessionStorage.token;
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器--请求接口后，返回数据进行拦截
 */
_axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default _axios;
