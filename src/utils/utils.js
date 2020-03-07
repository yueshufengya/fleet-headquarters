/**
 * 工具函数
 */
const Utils = {
  /**
   * 过滤特殊字符
   */
  filterCharacter: function(str) {
    let pattern = new RegExp(
      "[`~～!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]"
    );
    let rs = "";
    for (var i = 0; i < str.length; i++) {
      rs = rs + str.substr(i, 1).replace(pattern, "");
    }
    return rs;
  },
  /**
   * 验证是否含有特殊字符
   */
  isIncludeCharacter: function(str) {
    let reg = new RegExp(
      "[`~～!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]"
    );
    let rs = false;
    for (var i = 0; i < str.length; i++) {
      if (reg.test(str.substr(i, 1))) {
        rs = true;
        break;
      }
    }
    return rs;
  },
  /**
   * 验证账号 2至20位 字母/数字/下划线
   * 账号格式：baizheng 或者 baizheng01 或者 baizheng_01
   */
  validateAccount: function(value) {
    let reg = /^[a-zA-Z]\w{0,18}[a-zA-Z0-9]$/;
    if (!reg.test(value)) {
      return false;
    } else {
      return true;
    }
  },
  /**
   * 验证姓名是中文还是英文
   */
  validateCnEn: function(value) {
    // 判断姓名是中文还是英文
    let reg_en = /.*[a-zA-Z]+.*$/,
      reg_cn = /.*[\u4e00-\u9fa5]+.*$/;
    if (reg_en.test(value) && reg_cn.test(value)) {
      return false;
    } else {
      return true;
    }
  },
  /**
   * 验证姓名格式
   */
  validateName: function(value) {
    /**
     * 中文名可以使用中文的 "·" 分隔 "·" -> \u00B7
     * 英文名使用" "(空格) 分隔
     */
    let reg_en = /.*[a-zA-Z]+.*$/,
      reg_cn = /.*[\u4e00-\u9fa5]+.*$/,
      reg_name_en = /^([a-zA-Z]+\s?)+[a-zA-Z]+$/m,
      reg_name_cn = /^([\u4e00-\u9fa5]+|([\u4e00-\u9fa5]+[\u00B7]?)*[\u4e00-\u9fa5]+)$/;
    if (reg_en.test(value) && reg_name_en.test(value)) {
      return true;
    } else if (reg_cn.test(value) && reg_name_cn.test(value)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 验证密码
   */
  validatePass: function(value) {
    // let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,10}$/; // 6至10位 的字母+数字
    let reg = /^[a-zA-Z0-9]{6,10}$/;
    return reg.test(value) ? true : false;
  },
  /**
   * 验证电话 手机号
   */
  validateTel: function(value) {
    let reg = /^(13[0-9]|14[5|7]|15[0-9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    return reg.test(value) ? true : false;
  },
  /**
   * 验证邮箱
   */
  validateEmail: function(value) {
    let reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return reg.test(value) ? true : false;
  },
  /**
   * 验证验证码
   */
  validateVcode: function(value) {
    let reg = /^[a-zA-Z0-9]{4}$/;
    return reg.test(value) ? true : false;
  },
  /**
   * 过滤项去重
   */
  removeDuplicate: function(source) {
    let obj = {};
    return source.filter(function(item, index, array) {
      // Object的hasOwnProperty()方法返回一个布尔值，判断对象是否包含特定的自身（非继承）属性
      return obj.hasOwnProperty(typeof item.value + item.value)
        ? false
        : (obj[typeof item.value + item.value] = true);
    });
  },
  /**
   * 数组去重
   * [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}]
   * [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}]
   */
  unique: function(arr) {
    var obj = {};
    return arr.filter(function(item, index, array) {
      return obj.hasOwnProperty(typeof item + item)
        ? false
        : (obj[typeof item + item] = true);
    });
  }
};

export default Utils;
