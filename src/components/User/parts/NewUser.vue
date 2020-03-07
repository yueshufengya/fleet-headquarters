<template>
  <div id="new-user">
    <div class="plate-wrapper">
      <el-popover
        trigger="hover"
        placement="bottom-start"
        class="popover-btn"
        popper-class="explain"
        title="相关说明-"
      >
        <template>
          <p>1-中文名至少一个汉字,可用'·'分隔/英文名最短两个字母,可用空格分隔(必填)。</p>
          <p>2-账号由字母/数字/下划线组成,以字母开头,字母或数字结尾(必填)。</p>
          <p>3-密码由6至20位字母/数字组成(必填)。</p>
          <p>4-联系方式和邮箱(选填)。</p>
        </template>
        <i class="el-icon-info popover-icon" slot="reference"></i>
      </el-popover>
      <el-form
        status-icon
        :model="registerForm"
        :rules="rules"
        ref="registerForm"
        size="small"
        class="register-form"
      >
        <el-form-item class="form-radios">
          <el-radio-group v-model="registerForm.role" size="medium">
            <el-radio-button label="3">舰队秘书</el-radio-button>
            <el-radio-button label="2">舰队提督</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="name" class="form-item">
          <el-row>
            <el-col :span="12">
              <label class="item-label"><i>*</i>姓名:</label>
            </el-col>
            <el-col :span="12" class="auto-account">
              <el-switch
                v-model="isAutoAccount"
                :disabled="switchDisabled"
                active-text="自动生产账号"
                inactive-color="#86806b"
                @change="autoAccount"
              >
              </el-switch>
            </el-col>
          </el-row>
          <el-input
            v-model="registerForm.name"
            placeholder="填写用户姓名[必填]"
            @input="inputName"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="account" class="form-item" ref="account-item">
          <label class="item-label"><i>*</i>账号:</label>
          <el-input
            show-word-limit
            v-model="registerForm.account"
            :disabled="isAutoAccount"
            placeholder="填写注册账号[必填]"
            maxlength="20"
            @input="inputAccount"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="pass" class="form-item">
          <el-row>
            <el-col :span="12">
              <label class="item-label"><i>*</i>密码:</label>
            </el-col>
            <el-col :span="12" class="default-pwd">
              <el-switch
                v-model="isDefaultPass"
                active-text="使用默认密码"
                inactive-color="#86806b"
                @change="useDefaultPass"
              >
              </el-switch>
            </el-col>
          </el-row>
          <el-input
            v-model="registerForm.pass"
            :disabled="isDefaultPass"
            :type="isSpecificPassword ? 'text' : 'password' "
            placeholder="填写密码[必填]"
            maxlength="20"
            @input="inputPass"
          >
            <i slot="suffix" class="el-input__icon el-icon-view" @click="showPass"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="tel" class="form-item">
          <label class="item-label">联系电话:</label>
          <el-input
            show-word-limit
            v-model="registerForm.tel"
            placeholder="联系电话[选填]"
            maxlength="11"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="email" class="form-item">
          <label class="item-label">邮箱:</label>
          <el-input
            v-model="registerForm.email"
            placeholder="邮箱[选填]"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="vcode" class="form-item">
          <label class="item-label"><i>*</i>验证码:</label>
          <el-row>
            <el-col :span="16">
              <el-input
                show-word-limit
                v-model="registerForm.vcode"
                placeholder="在此输入验证码!"
                maxlength="4"
              >
              </el-input>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-tooltip
                class="item"
                effect="dark"
                content="点击刷新验证码"
                placement="top"
              >
                <el-image
                  class="vcode-img"
                  :src="verificationcode"
                  fit="fill"
                  @click="updateVcode"
                >
                </el-image>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="form-btns">
          <el-button
            type="primary"
            size="mini"
            @click="submitForm('registerForm')"
            >注册
          </el-button>
          <el-button
            size="mini"
            @click="resetForm('registerForm')" 
            >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 接口
import { RegisterUser } from "@/api/user";
import { GetSms } from "@/api/common";
// 工具
import sha1 from 'js-sha1';
import Qs from "qs";
import py from "pinyin";
import Utils from "@/utils/utils";

export default {
  name: "NewUser",
  props: [],
  data: function() {
    return {
      // 自动生成账号
      isAutoAccount: false,
      // 自动生成账号是否可用 当name验证通过了才可用
      switchDisabled: true,
      // 默认密码
      defaultPass: "123456",
      // 是否使用默认密码
      isDefaultPass: false,
      // 是否显示密码 true为明文 false为暗文
      isSpecificPassword: false,
      // 验证码
      verificationcode: "",
      // 注册表单
      registerForm: {
        name: "",
        account: "",
        pass: "",
        tel: "",
        email: "",
        role: "3",
        vcode: ""
      },
      // 表单验证
      rules: {
        name: [ { validator: this.validateName, trigger: "blur" } ],
        account: [ { validator: this.validateAccount, trigger: "blur" } ],
        pass: [
          { required: true, message: "初始密码不能为空", trigger: "blur" },
          { validator: this.validatePass, trigger: "blur" }
        ],
        tel: [{ validator: this.validateTel, trigger: "blur" }],
        email: [{ validator: this.validateEmail, trigger: "blur" }],
        vcode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { validator: this.validateVcode, trigger: "blur" }
        ]
      }
    };
  },
  components: {},
  methods: {
    /**
     * 功能操作
     */
    // 更新验证码
    updateVcode: function() {
      let _self = this;
      let promise = GetSms();
      promise
        .then(response => {
          _self.verificationcode =
            "data:image/png;base64," +
            btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
        })
        .catch(error => {
          //Request failed
          console.log(error);
        });
    },
    // 提交表单
    submitForm: function(formName) {
      let _self = this;
      _self.$refs[formName].validate(valid => {
        if (valid) {
          // 表单验证通过 调用注册
          _self.register();
        } else {
          // 表单验证失败
          console.log("出错!");
        }
      });
    },
    // 重置表单
    resetForm: function(formName) {
      let _self = this;
      _self.registerForm.role = "3";
      _self.isAutoAccount = false;
      _self.switchDisabled = true;
      _self.isDefaultPass = false;
      _self.$refs[formName].resetFields();
      _self.updateVcode();
    },
    // 注册
    register: function() {
      let _self = this;
      let data = {
        name: _self.registerForm.name,
        account: _self.registerForm.account,
        pass: _self.registerForm.pass,
        tel: _self.registerForm.tel,
        email: _self.registerForm.email,
        role: _self.registerForm.role,
        vcode: _self.registerForm.vcode
      };
      data.pass = sha1(data.pass);
      let promise = RegisterUser(Qs.stringify(data));
      promise
        .then(response =>{
          // 请求成功 status: 200
          if (response.data.stateCode == "101") {
            _self.tips("验证码错误", "error");
            _self.updateVcode();
          } else if (response.data.stateCode == "301") {
            // 未登录或者登录超时
            _self.tips("未登录或登录超时，请重新登录!", "error");
            _self.$store.commit("setLoginInfos");
            _self.$router.push({ name: "login" });
          } else if (response.data.stateCode == "2020") {
            _self.tips("没有权限执行该操作！", "warning");
          } else if (response.data.stateCode == "701") {
            _self.tips("新用户注册成功!", "success");
          } else {
            _self.tips("新用户注册失败!", "warning");
          }
        }).catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // 自动生成账号
    autoAccount: function(newState) {
      let _self = this;
      if (newState) {
        _self.registerForm.account = _self.pinYin(_self.registerForm.name);
        _self.$refs["registerForm"].validateField("account");
      } else {
        _self.registerForm.account = "";
        _self.$refs["account-item"].resetField();
      }
    },
    // 使用默认密码
    useDefaultPass: function(newState) {
      let _self = this;
      _self.isSpecificPassword = false;
      if (newState) {
        _self.registerForm.pass = _self.defaultPass;
        _self.$refs["registerForm"].validateField("pass");
      } else {
        _self.registerForm.pass = "";
      }
    },
    showPass: function() {
      let _self = this;
      _self.isSpecificPassword = !_self.isSpecificPassword;
    },
    /**
     * 强力辅助
     */
    // 验证姓名
    validateName: function(rule, value, callback) {
      let _self = this;
      if (value == "") {
        _self.isAutoAccount = false; // 关闭自动生成账号
        _self.switchDisabled = true; // switch不可用
        _self.registerForm.account = "";
        _self.$refs["account-item"].resetField();
        callback(new Error("姓名不能为空!"));
      } else if (Utils.isIncludeCharacter(value)) {
        // 包含特殊字符
        _self.isAutoAccount = false;
        _self.switchDisabled = true;
        _self.registerForm.account = "";
        _self.$refs["account-item"].resetField();
        callback(new Error("请不要使用特殊字符!"));
      } else if (!Utils.validateCnEn(value)) {
        // 中英文混用
        _self.isAutoAccount = false;
        _self.switchDisabled = true;
        _self.registerForm.account = "";
        _self.$refs["account-item"].resetField();
        callback(new Error("姓名不支持中英文混用!"));
      } else if (!Utils.validateName(value)) {
        _self.isAutoAccount = false;
        _self.switchDisabled = true;
        _self.registerForm.account = "";
        _self.$refs["account-item"].resetField();
        callback(new Error("姓名格式不正确!"));
      } else {
        _self.switchDisabled = false;
        callback();
      }
    },
    // 验证账号
    validateAccount: function(rule, value, callback) {
      if (value == "") {
        callback(new Error("账号不能为空!"));
      } else if (Utils.isIncludeCharacter(value)) {
        // 包含特殊字符
        callback(new Error("请不要使用特殊字符!"));
      } else if (!Utils.validateAccount(value)) {
        callback(new Error("账号格式不正确!"));
      } else {
        callback();
      }
    },
    // 验证密码
    validatePass: function(rule, value, callback) {
      if (Utils.isIncludeCharacter(value)) {
        // 包含特殊字符
        callback(new Error("请不要使用特殊字符!"));
      } else if (!Utils.validatePass(value)) {
        callback(new Error("密码格式不正确!"));
      } else {
        callback();
      }
    },
    // 验证联系电话
    validateTel: function(rule, value, callback) {
      if (value == "") {
        callback();
      } else {
        if (!Utils.validateTel(value)) {
          callback(new Error("手机号码有误!"));
        } else {
          callback();
        }
      }
    },
    // 验证邮箱
    validateEmail: function(rule, value, callback) {
      if (value == "") {
        callback();
      } else {
        if (!Utils.validateEmail(value)) {
          callback(new Error("邮箱有误!"));
        } else {
          callback();
        }
      }
    },
    // 验证验证码
    validateVcode: function(rule, value, callback) {
      if (!Utils.validateVcode(value)) {
        callback(new Error("验证码输入有误!"));
      } else {
        callback();
      }
    },
    // 自动生成账号是否可用
    inputName: function(value) {
      let _self = this;
      _self.$refs["registerForm"].validateField("name");
      if (_self.isAutoAccount) {
        _self.$refs["account-item"].resetField();
        _self.registerForm.account = _self.pinYin(value);
        _self.$refs["registerForm"].validateField("account");
      } else {
        _self.registerForm.account = "";
        _self.$refs["account-item"].resetField();
      }
    },
    inputAccount: function(value) {
      let _self = this;
      _self.$refs["registerForm"].validateField("account");
    },
    inputPass: function(value) {
      let _self = this;
      _self.$refs["registerForm"].validateField("pass");
    },
    // 汉字转拼音
    pinYin: function(value) {
      let reg_en = /.*[a-zA-Z]+.*$/,
        reg_cn = /.*[\u4e00-\u9fa5]+.*$/;
      if (value != "" && reg_en.test(value) && !reg_cn.test(value)) {
        return value.replace(/\s/g, "");
      }
      if (value != "" && !reg_en.test(value) && reg_cn.test(value)) {
        return py(value.replace(/·/g, ""), { style: py.STYLE_NORMAL }).join("");
      }
    },
    // 信息提示
    tips: function(message, type) {
      let _self = this;
      _self.$message({
        message: message,
        type: type
      });
    }
  },
  watch: {},
  computed: {},
  beforeCreate: function() {},
  created: function() {},
  beforeMount: function() {
    let _self = this;
    // 更新验证码
    _self.updateVcode();
  },
  mounted: function() {},
  beforeUpdate: function() {},
  Updated: function() {},
  beforeDestroy: function() {},
  destroyed: function() {}
};
</script>

<style lang="scss">
.explain {
  width: 260px;
  .el-popover__title {
    color: #409eff;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
<style lang="scss" scoped>
.plate-wrapper {
  position: relative;
  display: block;
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: $c_form;
  border: 2px solid $tb_fff;
  box-shadow: 5px 5px 10px rgba($color: #333, $alpha: 0.5);
  border-radius: 10px;
  .popover-btn {
    position: absolute;
    width: 26px;
    height: 26px;
    top: 20px;
    left: 20px;
    border-radius: 50%;
    border: 2px solid $tb_fff;
    box-sizing: content-box;
    background-color: $c_popover;
    box-shadow: 2px 2px 5px rgba($color: #333, $alpha: 0.5);
    .popover-icon {
      display: inline-block;
      vertical-align: top;
      width: 26px;
      height: 26px;
      cursor: pointer;
      &::before {
        display: inline-block;
        width: 26px;
        height: 26px;
        line-height: 26px;
        vertical-align: top;
        color: $tb_fff;
        font-size: 26px;
      }
      &::after {
        display: inline-block;
        width: 0px;
        height: 100%;
        vertical-align: top;
      }
    }
  }
  .register-form {
    width: 50%;
    margin: 0 auto;
    padding: 20px;
    .form-item {
      margin-bottom: 20px;
      text-align: left;
      .auto-account,
      .default-pwd {
        text-align: right;
        /deep/.el-switch {
          .el-switch__label {
            color: $c_switch;
            &.is-active {
              color: $c_switch-active;
            }
          }
        }
      }
      /deep/.el-icon-view {
        cursor: pointer;
      }
      .item-label {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        color: $tb_409eff;
        i {
          display: inline-block;
          line-height: 30px;
          vertical-align: middle;
          color: $c_asterisk;
          margin-right: 3px;
          font-size: 14px;
        }
      }
      .vcode-img {
        display: inline-block;
        height: 28px;
        vertical-align: middle;
        cursor: pointer;
        border: 2px solid $tb_fff;
        border-radius: 5px;
      }
    }
    .form-radios {
      width: 100%;
      text-align: center;
      margin-bottom: 0px;
    }
    .form-btns {
      width: 100%;
      margin-top: 10px;
      text-align: center;
      margin-bottom: 0px;
    }
  }
}
</style>
