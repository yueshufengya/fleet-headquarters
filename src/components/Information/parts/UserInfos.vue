<template>
  <div id="user-infos">
    <div class="plate-wrapper">
      <div class="infos-update">
        <el-avatar :size="100" :src="sculptureSrc" class="user-avatar"></el-avatar>
        <p class="base-infos">
          <span><i>姓名:</i>{{ infosForm.name }}</span><span><i>职务:</i>{{ infosForm.role }}</span>
        </p>
        <div class="define-sculpture">
          <el-upload
            :show-file-list="false"
            :on-change="handlePreview"
            :auto-upload="false"
            ref="upload"
            class="free-avatar"
            action="Must"
            >
              <el-button plain size="mini" type="primary" slot="trigger">
                <i class="el-icon-upload"></i>上传头像
              </el-button>
          </el-upload>
          <el-button plain size="mini" type="primary" class="sys-avatar">
            <i class="el-icon-discover"></i>系统头像
          </el-button>
        </div>
        <el-form
          status-icon
          :model="infosForm"
          :rules="rules"
          ref="infosForm"
          size="small"
          class="infos-form"
        >
          <el-form-item prop="tel" class="form-item">
            <label class="item-label">联系电话:</label>
            <el-input
              show-word-limit
              v-model="infosForm.tel"
              placeholder="联系电话[选填]"
              maxlength="11"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="email" class="form-item">
            <label class="item-label">邮箱:</label>
            <el-input
              v-model="infosForm.email"
              placeholder="邮箱[选填]"
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
              >保存
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
import { ModifyUser } from "@/api/user";
import { GetSms, UploadOne } from "@/api/common";
// 工具
import sha1 from 'js-sha1';
import Qs from "qs";
import Utils from "@/utils/utils";
import Bus from "@/utils/bus";

export default {
  name: "UserInfos",
  props: [],
  data: function() {
    return {
      // 头像
      sculptureSrc: this.$resource + sessionStorage.getItem("userPhoto"),
      // 头像文件
      sculptureFile: "",
      // 验证码
      verificationcode: "",
      // 资料表单
      infosForm: {
        name: sessionStorage.getItem("userName"),
        role: sessionStorage.getItem("userRole"),
        curpass: "",
        tel: "",
        email: "",
        photo: "",
        vcode: "",
        vcid: "infosvc"
      },
      // 表单验证
      rules: {
        curpass: [
          { required: true, message: "必须正确填写当前密码,才能成功保存", trigger: "blur" },
          { validator: this.validateCurPass, trigger: "blur" }
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
      let data = {
				vcid: "infosvc"
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
    // 头像上传成功 --默认上传才会自动调用
    // handleAvatarSuccess: function(res, file) {
    //   let _self = this;
    //   _self.infosForm.photo = res;
    //   // _self.sculptureSrc = URL.createObjectURL(file.raw); // 表单获取到提交时要传的图片路径
    //   _self.sculptureSrc = _self.$resource + res + "?" + new Date().getTime();
    // },
    // 头像上传前检验
    beforeAvatarUpload(file) {
      let isCorrectSuffix = file.type === "image/jpeg" ? true : (file.type === "image/png" ? true : (file.type === "image/gif" ? true : false));
      let isLt2M = file.size / 1024 / 1024 < 2;
      if (!isCorrectSuffix) {
        this.$message.error("上传头像图片可以是JPG/JPEG、PNG、gif格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // return false; // 屏蔽action的默认上传
      return isCorrectSuffix && isLt2M;
    },
    // 获取选择图片的base64编码 图片尚未上传到服务器
    handlePreview(file) {
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      let _self = this;
      if(file.status == "ready"){
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function(e){
          this.result; // 这个就是base64编码了
          _self.sculptureSrc = this.result;
          _self.sculptureFile = file;
        }
      }
    },
    // 提交表单
    submitForm: function(formName) {
      let _self = this;
      _self.$refs[formName].validate(valid => {
        if (valid) {
          // 表单验证通过 修改用户信息
          // 先上传图片
          if (_self.sculptureFile.raw != undefined) {
            let result = _self.beforeAvatarUpload(_self.sculptureFile.raw);
            if (!result) { return; }
            let formData = new FormData();
            formData.append('file', _self.sculptureFile.raw);
            let promise = UploadOne(formData);
            promise
              .then(response => {
                _self.infosForm.photo = response.data;
                _self.sculptureSrc = _self.$resource + response.data + "?" + new Date().getTime();
                Bus.$emit("photoSynchro", _self.sculptureSrc);    //存 Bus.$emit
                _self.modifyUser();
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            _self.modifyUser();
          }
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
    modifyUser: function() {
      let _self = this;
      let data = {
        id: sessionStorage.getItem("userId"),
        curpass: _self.infosForm.curpass,
        tel: _self.infosForm.tel,
        email: _self.infosForm.email,
        photo: _self.infosForm.photo,
        vcode: _self.infosForm.vcode
      };
      data.curpass = sha1(data.curpass);
      let promise = ModifyUser(Qs.stringify(data));
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
          } else if (response.data.stateCode == "1101") {
            _self.tips("更新用户资料出错", "error");
          } else if (response.data.stateCode == "1102") {
            _self.tips("用户资料已更新!", "success");
            _self.$store.commit("setLoginInfos", {
              u_id: sessionStorage.getItem("userId"),
              u_name: sessionStorage.getItem("userName"),
              u_role: sessionStorage.getItem("userRole"),
              u_photo: _self.infosForm.photo,
              tk: response.data.token
            });
            _self.resetForm("infosForm");
          } else {
            _self.tips("没有用户资料被更新!", "warning");
          }
        }).catch(error => {
          console.log("出错!");
          _self.$store.commit("setLoginInfos");
        });
    },
    /**
     * 强力辅助
     */
    // 验证当前密码
    validateCurPass: function(rule, value, callback) {
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
      font-size: 18px;
      font-weight: bold;
      color: $tb_409eff;
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
    .define-sculpture {
      text-align: center;
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
