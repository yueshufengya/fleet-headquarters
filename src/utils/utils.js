/**
 * 工具函数
 */
const Utils = {
    /**
     * 过滤特殊字符
     */
    filterCharacter: function (str) {
        var pattern = new RegExp("[`·~～!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]")
        var rs = "";
        for (let i = 0; i < str.length; i++) {
            rs = rs + str.substr(i, 1).replace(pattern, '');
        }
        return rs;
    },
    /**
     * 验证是否含有特殊字符
     */
    isIncludeCharacter: function (str) {
        let reg = new RegExp("[`·~～!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]");
        let rs = false;
        for (var i = 0; i < str.length; i++) {
            if(reg.test(str.substr(i, 1))) {
                rs = true;
                break;
            }
        }
        return rs;
    },
    /**
     * 验证用户名
     */
    validateUsername: function (value) {},
    /**
     * 验证密码 6至20位的字母+数字
     */
    validatePass: function (value){
        let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
        return !reg.test(value) ? true : false;
    },
    /**
     * 验证邮箱
     */
    validateEmail: function (value) { 
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/; 
        return !reg.test(value) ? true : false;
    },
    /**
     * 验证验证码
     */
    validateVcode: function (value) {
        let reg = /^[a-z0-9]{4}$/;
        return !reg.test(value) ? true : false;
    },
}

export default Utils;