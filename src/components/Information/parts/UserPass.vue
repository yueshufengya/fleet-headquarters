<template>
  <div id="user-pass">
    <div class="plate-wrapper">
      <div class="infos-update">
        <el-avatar :size="100" :src="sculptureSrc" class="user-avatar"></el-avatar>
        <p class="base-infos">
            <span><i>姓名:</i>{{ infosForm.name }}</span><span><i>职务:</i>{{ infosForm.role }}</span>
        </p>
        <el-form
          status-icon
          :model="infosForm"
          :rules="rules"
          ref="infosForm"
          size="small"
          class="infos-form"
        >
          <el-form-item prop="pass" class="form-item">
						<label class="item-label"><i>*</i>新密码:</label>
						<el-input
						show-password
						v-model="infosForm.pass"
						placeholder="新密码"
						>
						</el-input>
          </el-form-item>
          <el-form-item prop="curpass" class="form-item">
            <label class="item-label"><i>*</i>当前密码:</label>
            <el-input
              type="password"
              v-model="infosForm.curpass"
              placeholder="当前密码"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="vcode" class="form-item">
            <label class="item-label"><i>*</i>验证码:</label>
            <el-row>
              <el-col :span="16">
                <el-input
                  show-word-limit
                  v-model="infosForm.vcode"
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
              @click="submitForm('infosForm')"
              >设置
            </el-button>
            <el-button @click="resetForm('infosForm')" size="mini"
              >重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// 接口
import { ModifyPwd } from "@/api/user";
import { GetSms, UploadOne } from "@/api/common";
// 工具
import sha1 from 'js-sha1';
import Qs from "qs";
import Utils from "@/utils/utils";

export default {
  name: "UserInfos",
  props: [
		"sculpture"
	],
  data: function() {
    return {
      // 头像
      sculptureSrc: this.$resource + sessionStorage.getItem("userPhoto"),
      // 验证码
      verificationcode: "",
      // 资料表单
      infosForm: {
        name: sessionStorage.getItem("userName"),
        role: sessionStorage.getItem("userRole"),
        curpass: "",
        pass: "",
        vcode: ""
      },
      // 表单验证
      rules: {
        pass: [
					{ required: true, message: "新设密码不能为空", trigger: "blur" },
          { validator: this.validatePass, trigger: "blur" }
				],
				curpass: [
          { required: true, message: "必须正确填写当前密码,才能成功保存", trigger: "blur" },
          { validator: this.validatePass, trigger: "blur" }
        ],
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
			let data = {
				vcid: "passvc"
			};
      let promise = GetSms(Qs.stringify(data));
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
          _self.modifyPwd();
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
    // 修改用户信息
    modifyPwd: function() {
      let _self = this;
      let data = {
        id: sessionStorage.getItem("userId"),
        curpass: _self.infosForm.curpass,
        pass: _self.infosForm.pass,
        vcode: _self.infosForm.vcode
      };
      data.curpass = sha1(data.curpass);
      data.pass = data.pass == "" ? data.pass : sha1(data.pass);
      let promise = ModifyPwd(Qs.stringify(data));
        promise
        .then(response => {
          // 请求成功 status: 200
          if (response.data.stateCode == "101") {
            _self.tips("验证码错误", "error");
            _self.updateVcode();
          } else if (response.data.stateCode == "301") {
            // 未登录或者登录超时
            _self.tips("未登录或登录超时，请重新登录!", "error");
            _self.$store.commit("setLoginInfos");
            _self.$router.push({ name: "login" });
          } else if (response.data.stateCode == "303") {
             // 无效登录
            _self.tips("登录状态错误，请重新登录!", "error");
            _self.$store.commit("setLoginInfos");
            _self.$router.push({ name: "login" });
          } else if (response.data.stateCode == "1401") {
            _self.tips("修改密码出错!", "error");
          } else if (response.data.stateCode == "1402") {
            _self.tips("修改密码成功,请重新登录！", "success");
            _self.$store.commit("setLoginInfos");
            _self.$router.push({ name: "login" });
          } else {
            _self.tips("没有用户被修改!", "warning");
          }
        }).catch(error => {
          console.log("出错!");
          _self.$store.commit("setLoginInfos");
        });
    },
    /**
     * 强力辅助
     */
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
    // 验证验证码
    validateVcode: function(rule, value, callback) {
      if (!Utils.validateVcode(value)) {
        callback(new Error("验证码输入有误!"));
      } else {
        callback();
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
  watch: {
		sculpture: function(newVal,oldVal) {
			let _self = this;
			_self.sculptureSrc = newVal;
		}
	},
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

<style lang="scss" scoped>
.plate-wrapper {
  position: relative;
  display: block;
  width: 80%;
  margin: 20px auto 0px ;
  padding: 20px;
  background-color: $c_form;
  border: 2px solid $tb_fff;
  box-shadow: 5px 5px 10px rgba($color: #333, $alpha: 0.5);
  border-radius: 10px;
  .infos-update {
    width: 50%;
    margin: 0 auto;
    padding: 5px;
    .user-avatar {
       display: block;
      border: 3px solid $tb_409eff;
      box-shadow: 0px 0px 10px rgba($color: #333, $alpha: 0.5);
      margin: 10px auto;
      &:hover{
        cursor: default;
        border: 3px solid $tb_ffb226;
      }
    }
    .base-infos {
      margin-bottom: 10px;
      color: $tb_409eff;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      span {
        display: inline-block;
        line-height: 18px;
        margin: 0px 5px;
        &:hover{
          cursor: default;
          color: $tb_ffb226;
        }
      }
    }
    .avatar-uploader {
      display: inline-block;
    }
    .sys-avatar,
    .free-avatar {
      margin: 0 5px;
      font-size: 14px;
      display: inline-block;
    }
    .form-item {
      margin-bottom: 20px;
      text-align: left;
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
