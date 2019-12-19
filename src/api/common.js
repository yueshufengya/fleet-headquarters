/**
 *  一些公共api
 */
import _axios from "@/utils/request";
/**
 * 获取验证码
 */
export function GetSms(data) {
  return _axios.request({
    method: "post",
    url: "/home/Common/verifyImg?T=" + Math.round(Math.random() * 10000),
    responseType: "arraybuffer", //IE9 不支持arraybuffer
    data: data
  });
}

/**
 * 上传一张图片
 */
export function UploadOne(data) {
  return _axios.request({
    method: "post",
    url: "/home/Common/uploadOne",
    data: data
  });
}