/**
 *  对登录api接口进行封装
 */
import _axios from "@/utils/request";
/**
 * 登录
 */
export function Login(data){
    return _axios.request({
        method: "post",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: "/home/index/index",
        data:data
    })
}