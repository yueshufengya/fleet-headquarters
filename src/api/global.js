import _axios from "@/utils/request";
/**
 * 获取验证码
 */
export function GetSms(){
    return _axios.request({
        method: "post",
        url: "/home/index/verifyImg?T=" + Math.round(Math.random() * 10000),
        responseType: 'arraybuffer' 
    })
}