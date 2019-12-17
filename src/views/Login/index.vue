<template>
  <div id="page">
    <div id="view-login">
      <div class="content-wrapper">
        <div class="carousel-box">
          <el-carousel trigger="click" height="4rem">
            <el-carousel-item v-for="(item, index) in carouselimgs" :key="index">
              <el-image class="img-item" :src="item.src" :alt="item.alt" fit="contain"></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="form-box">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form">
            <el-form-item prop="username" class="form-item">
              <label for="username">用户名:</label>
              <el-input id="username" type="text" v-model="ruleForm.username" size="small"></el-input>
            </el-form-item>
            <el-form-item prop="pass" class="form-item">
              <label for="password">密码:</label>
              <el-input id="password" type="password" v-model="ruleForm.pass" size="small"></el-input>
            </el-form-item>
            <el-form-item prop="vcode" class="form-item">
              <label for="verificationcode">验证码:</label>
              <el-row>
                <el-col :span="15"><el-input id="verificationcode" type="text" v-model="ruleForm.vcode" size="small"></el-input></el-col>
                <el-col :span="6" :offset="3"><el-image class="vcode-img" :src="verificationcode" fit="contain"></el-image></el-col>
              </el-row>
              
            </el-form-item>
            <el-form-item class="form-btns">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    // 验证用户名
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名！'));
      } else {
        callback();
      }
    };
    // 验证密码
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码!'));
      } else {
        callback();
      }
    };
    // 验证验证码
    var validateVcode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码!'));
      } else {
        callback();
      }
    };
    return {
      /**
       * 幻灯片
       */
      carouselimgs: [
        {
          src: require("../../assets/images/carousel01.jpg"),
          alt: "欢迎来到碧蓝航线！"
        },
        {
          src: require("../../assets/images/carousel02.jpg"),
          alt: "欢迎来到碧蓝航线！"
        },
        {
          src: require("../../assets/images/carousel03.jpg"),
          alt: "欢迎来到碧蓝航线！"
        }
      ],
      verificationcode: require("../../assets/images/vcode.jpg"),
      /**
       * 登录表单
       */
      ruleForm: {
        username: '',
        pass: '',
        vcode: ''
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        vcode: [
          { validator: validateVcode, trigger: 'blur' }
        ]
      }
    };
  },
  components: {},
  methods: {
    /**
     * 提交表单
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /**
     * 重置表单
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  computed: {},
  watch: {},
  beforeCreate: function() {},
  created: function() {},
  beforeMount: function() {},
  mounted: function() {},
  beforeUpdate: function() {},
  Updated: function() {},
  beforeDestroy: function() {},
  destroyed: function() {}
};
</script>
<style lang="scss">
#view-login {
  height: 100%;
  background-color: #0a77b6;
  text-align: center;
  &::after {
    content: "";
    display: inline-block;
    vertical-align: middle;
    height: 100%;
    width: 0;
  }
}
.content-wrapper {
  display: inline-block;
  width: 960px;
  text-align: center;
  vertical-align: middle;
  background-color: #efefef;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.12);
  border: 2px solid #fff;
  .carousel-box {
    display: inline-block;
    width: 600px;
    vertical-align: top;
    .img-item {
      display: block;
      width: 600x;
      height: 400px;
    }    
  }
}
.form-box {
  display: inline-block;
  width: 340px;
  height: 380px;
  vertical-align: top;
  text-align: left;
  background-color: #4198e0;
  margin: 10px;
  border-radius: 10px;
  .login-form{
    padding: 10px;
    .form-item{
      margin-bottom: 30px;
      label{
        display: block;
        font-weight: bold;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        color: #fff;
      }
      .vcode-img{
        display: inline-block;
        height: 40px;
        vertical-align: top;
      }
      .el-form-item__error{
        font-size: 16px;
        line-height: 24px;
        padding-top: 0;
      }
    }
    .form-btns{
      display: inline-block;
      width: 100%;
      margin-top: 10px;
      text-align: right;
      margin-bottom: 0px;
    }
  }
}

</style>
