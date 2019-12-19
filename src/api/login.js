/**
 *  对登录api接口进行封装
 */
import _axios from "@/utils/request";
/**
 * 登录
 */
export function Login(data) {
  return _axios.request({
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    url: "/home/index/index",
    data: data
  });
}
/**
 * 检查登录状态
 */
export function LoggedIn() {
  return _axios.request({
    method: "post",
    url: "/home/index/loggedIn"
  });
}
/**
 * 退出
 */
export function Logout() {
  return _axios.request({
    method: "post",
    url: "/home/index/logout"
  });
}
