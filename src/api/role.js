import _axios from "@/utils/request";

/**
 * 权限列表
 */
export function GetRoleList() {
  return _axios.request({
    method: "post",
    url: "/home/Role/getRoleList"
  });
}