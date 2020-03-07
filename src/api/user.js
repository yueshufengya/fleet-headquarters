import _axios from "@/utils/request";

/**
 * 注册用户
 */
export function RegisterUser(data) {
  return _axios.request({
    method: "post",
    url: "/home/User/registerUser",
    data: data
  });
}

/**
 * 注销用户
 */
export function CancelUser(data) {
  return _axios.request({
    method: "post",
    url: "/home/User/cancelUser",
    data: data
  });
}

/**
 * 分页用户列表
 */
export function GetUserList(data) {
  return _axios.request({
    method: "post",
    url: "/home/User/getUserList",
    data: data
  });
}

/**
 * 分页用户列表-用户名
 */
export function GetUserListByName(data) {
  return _axios.request({
    method: "post",
    url: "/home/User/getUserListByName",
    data: data
  });
}

/**
 * 分页用户列表-用户权限
 */
export function GetUserListByRole(data) {
  return _axios.request({
    method: "post",
    url: "/home/User/getUserListByRole",
    data: data
  });
}

/**
 * 重置密码
 */
export function ResetPwd(data) {
  return _axios.request({
    method: "post",
    url: "/home/User/resetPwd",
    data: data
  });
}

/**
 * 修改密码
 */
export function ModifyPwd(data) {
  return _axios.request({
    method: "post",
    url: "/home/User/modifyPwd",
    data: data
  });
}

/**
 * 修改用户资料
 */
export function ModifyUser(data) {
  return _axios.request({
    method: "post",
    url: "/home/User/modifyUser",
    data: data
  });
}
