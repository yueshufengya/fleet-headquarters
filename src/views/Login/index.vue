<template>
  <div id="page">
    <el-container id="view-login">
      <el-main class="content-wrapper">
        <div class="main-content">
          <div class="carousel-box">
            <el-carousel trigger="click" height="4rem">
              <el-carousel-item
                v-for="(item, index) in carouselimgs"
                :key="index"
              >
                <el-image
                  class="img-item"
                  :src="$resource + item.src"
                  :alt="item.alt"
                  fit="contain"
                >
                </el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="form-box">
            <transition
              name="login"
              mode="out-in"
              appear
              appear-class="login-appear"
              appear-to-class="login-appear-to"
              appear-active-class="login-appear-active"
            >
              <div v-if="logonstatus" class="loggedIn-msg">
                <el-row class="msg-row">
                  <el-col>
                    <el-avatar class="sculpture" :size="120" :src="sculptureSrc"></el-avatar>
                  </el-col>
                </el-row>
                <el-row class="msg-row">
                  <el-col>
                    <span class="msg">你已经登录，请勿重复登录!</span>
                  </el-col>
                </el-row>
                <el-row class="logout-btns">
                  <el-col>
                    <el-popconfirm
                      title="继续将退出登录!确定吗?"
                      @onConfirm="logout"
                      iconColor="#f56c6c"
                      confirmButtonType="danger"
                      cancelButtonType
                    >
                      <el-button type="danger" size="mini" slot="reference" round>
                        切换账号
                      </el-button>
                    </el-popconfirm>
                  </el-col>
                </el-row>
              </div>
              <el-form
                v-else
                :model="loginForm"
                status-icon
                :rules="rules"
                ref="loginForm"
                class="login-form"
              >
                <el-form-item prop="account" class="form-item">
                  <label for="account">账号:</label>
                  <el-input
                    id="account"
                    type="text"
                    autofocus="true"
                    v-model="loginForm.account"
                    size="small"
                    placeholder="请输入登录账号!"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item prop="pass" class="form-item">
                  <label for="password">密码:</label>
                  <el-input
                    id="password"
                    type="password"
                    v-model="loginForm.pass"
                    size="small"
                    placeholder="请输入登录密码!"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item prop="vcode" class="form-item">
                  <label for="verificationcode">验证码:</label>
                  <el-row>
                    <el-col :span="12">
                      <el-input
                        id="verificationcode"
                        type="text"
                        v-model="loginForm.vcode"
                        size="small"
                        placeholder="请输入验证码!"
                      >
                      </el-input>
                    </el-col>
                    <el-col :span="10" :offset="2">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="点击更新验证码"
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
                    @click="submitForm('loginForm')"
                    >登录
                  </el-button>
                  <el-button @click="resetForm('loginForm')" size="mini"
                    >重置
                  </el-button>
                </el-form-item>
              </el-form>
            </transition>
          </div>
        </div>
        <el-alert class="alert-tips" center :closable="false" type="warning">
          <i class="el-icon-warning"></i>
          <span class="tips-text"
            >温馨提示：请使用谷歌浏览器 或者 拥有chrome内核的浏览器访问！！
          </span>
        </el-alert>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// 接口
import { Login, LoggedIn, Logout } from "@/api/login";
import { GetSms } from "@/api/common";
// 工具
import sha1 from 'js-sha1';
import Qs from "qs";

export default {
  name: "Login",
  data() {
    return {
      // 幻灯
      carouselimgs: [
        {
          src: "/images/carousel/carousel01.jpg",
          alt: "欢迎来到碧蓝航线！"
        },
        {
          src: "/images/carousel/carousel02.jpg",
          alt: "欢迎来到碧蓝航线！"
        },
        {
          src: "/images/carousel/carousel03.jpg",
          alt: "欢迎来到碧蓝航线！"
        }
      ],
      // 是否已登录 true:已经登录
      logonstatus: false, // 
      // 头像
      sculptureSrc: "",
      // 角色
      // 验证码
      verificationcode: "",
      // 登录表单
      loginForm: {
        account: "baizheng",
        pass: "123456",
        vcode: ""
      },
      // 表单验证
      rules: {
        account: [{ validator: this.validateAccount, trigger: "blur" }],
        pass: [{ validator: this.validatePass, trigger: "blur" }],
        vcode: [{ validator: this.validateVcode, trigger: "blur" }]
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
          // 表单验证通过
          _self.login();
        } else {
          // 表单验证失败
          console.log("出错!");
        }
      });
    },
    // 重置表单
    resetForm: function(formName) {
      let _self = this;
      _self.$refs[formName].resetFields();
      _self.updateVcode();
    },
    // 登录
    login: function() {
      let _self = this;
      let data = {
        account: _self.loginForm.account,
        pass: _self.loginForm.pass,
        vcode: _self.loginForm.vcode
      };
      data.pass = sha1(data.pass);
      let promise = Login(Qs.stringify(data));
      promise
        .then(response => {
          // 请求成功 status: 200
          if (response.data.stateCode == "101") {
            // 验证码错误
            _self.tips("验证码错误", "error");
            _self.updateVcode();
          } else {
            if (response.data.stateCode == "201") {
              // 成功登录
              _self.tips("登录成功!", "success");
              //vuex保存登录状态
              _self.$store.commit("setLoginInfos", {
                u_id: response.data.uid,
                u_name: response.data.uname,
                u_role: response.data.urn,
                u_photo: response.data.uphoto,
                tk: response.data.token
              });
              //vue-router路由跳转
              _self.$router.push({ name: "home" });
            } else if (response.data.stateCode == "202") {
              // 登录失败
              _self.tips("登录失败,请使用正确的登录账号和密码!", "error");
              _self.updateVcode();
            } else {
              console.log("出错!");
              _self.$store.commit("setLoginInfos");
              _self.logonstatus = false;
              _self.resetForm("loginForm");
            }
          }
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // 退出
    logout: function() {
      let _self = this;
      let promise = Logout();
      promise
        .then(response => {
          // 请求成功 status: 200
          if (response.data.stateCode == "401") {
            _self.tips("已退出,请重新登录!", "success");
            _self.$store.commit("setLoginInfos");
            _self.logonstatus = false;
            _self.updateVcode();
          } else if (response.data.stateCode == "402") {
            _self.tips("退出失败!", "error");
          } else {
            console.log("出错!");
          }
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // 信息提示
    tips: function(message, type) {
      let _self = this;
      _self.$message({
        message: message,
        type: type
      });
    },
    /**
     * 强力辅助
     */
    // 检查登录状态
    checkLoggedIn: function() {
      let _self = this;
      let promise = LoggedIn();
      promise
        .then(response => {
          // 请求成功 status: 200
          if (response.data.stateCode == "301") {
            // 未登录或者登录超时
            _self.$store.commit("setLoginInfos"); // 不传递载荷Payload(第二个参数)，$Store.state中数据会被修改为默认值。
            _self.logonstatus = false;
            _self.resetForm("loginForm");
          } else if (response.data.stateCode == "302") {
            // 有效登录
            _self.tips("您已经登录，请勿重复登录!", "success");
            _self.sculptureSrc = _self.$resource + sessionStorage.getItem("userPhoto");
            /**
             * 传递载荷Payload(第二个参数)，修改$Store.state中对应数据。
             * 本来可以值传递需要修改的"tk"，这里为了防止刷新页面后，$store.state数据丢失，才从sessionStorage中取回userId和userName
             */
            _self.$store.commit("setLoginInfos", {
              u_id: sessionStorage.getItem("userId"),
              u_name: sessionStorage.getItem("userName"),
              u_role: sessionStorage.getItem("userRole"),
              u_photo: sessionStorage.getItem("userPhoto"),
              tk: response.data.token
            });
            _self.logonstatus = true;
          } else if (response.data.stateCode == "303") {
            // 无效登录
            _self.tips("登录状态错误，请重新登录!", "error");
            _self.$store.commit("setLoginInfos");
            _self.logonstatus = false;
            _self.resetForm("loginForm");
          } else {
            console.log("出错!");
            _self.$store.commit("setLoginInfos");
            _self.logonstatus = false;
            _self.resetForm("loginForm");
          }
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // 验证账号
    validateAccount: function(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入账号!"));
      } else {
        callback();
      }
    },
    // 验证密码
    validatePass: function(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入密码!"));
      } else {
        callback();
      }
    },
    // 验证验证码
    validateVcode: function(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入验证码!"));
      } else {
        callback();
      }
    }
  },
  computed: {
    LoginInfos: function() {
      let _self = this;
      return _self.$store.state.LoginInfos;
    }
  },
  watch: {},
  beforeCreate: function() {},
  created: function() {},
  beforeMount: function() {
    let _self = this;
    // 更新验证码
    _self.updateVcode();
    // 检查登录状态
    _self.checkLoggedIn();
  },
  mounted: function() {},
  beforeUpdate: function() {},
  Updated: function() {},
  beforeDestroy: function() {},
  destroyed: function() {}
};
</script>
<style lang="scss">
#view-login {
  .el-form-item__error {
    font-size: 14px;
    line-height: 24px;
    padding-top: 0;
  }
}
</style>
<style lang="scss" scoped>
#view-login {
  height: 100%;
  background-color: $c_theme;
  text-align: center;
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .main-content {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 960px;
      background-color: $c_content;
      border-radius: 10px;
      overflow: hidden;
      border: 2px solid $tb_fff;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
      .carousel-box {
        width: 600px;
        .img-item {
          display: block;
          width: 600x;
          height: 400px;
        }
      }
      .form-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 340px;
        background-color: $c_form;
        margin: 10px;
        border-radius: 10px;
        .loggedIn-msg {
          padding: 20px;
          color: $c_tips;
          .msg-row {
            margin-bottom: 20px;
            padding: 0 10px;
            font-size: 18px;
            .sculpture{
              margin: 5px 10px;
              border: 3px solid $tb_fff;
              box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
            }
            .msg {
              line-height: 36px;
              font-size: 18px;
            }
          }
          .logout-btns {
            margin-top: 10px;
            padding: 0 10px;
            font-size: 14px;
          }
        }
        .login-form {
          padding: 10px;
          .form-item {
            margin-bottom: 30px;
            label {
              display: block;
              font-weight: bold;
              height: 30px;
              line-height: 30px;
              font-size: 16px;
              color: $tb_409eff;
              text-align: left;
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
          .form-btns {
            width: 100%;
            margin-top: 10px;
            text-align: right;
            margin-bottom: 0px;
          }
        }
      }
    }
    .alert-tips {
      display: inline-block;
      width: 960px;
      margin-top: 10px;
      padding: 0;
      height: 36px;
      line-height: 36px;
      /deep/ .el-alert__content {
        height: 36px;
        .el-alert__description {
          height: 36px;
          margin: 0;
          .el-icon-warning {
            margin-right: 10px;
            display: inline-block;
            vertical-align: top;
            height: 36px;
            &:before {
              font-size: 18px;
            }
          }
          .tips-text {
            display: inline-block;
            line-height: 36px;
            font-size: 14px;
            vertical-align: top;
          }
        }
      }
    }
  }
}
// 过度样式
.login-enter-active,
.login-leave-active {
  transition: all 0.2s ease;
}
.login-enter,
.login-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
// 初始过度样式
.login-appear-active {
  transition: all 0.5s ease;
}
.login-appear {
  opacity: 0;
}
.login-appear-to {
  opacity: 1;
}
</style>
