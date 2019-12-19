<template>
  <div id="page">
    <el-container id="view-home">
      <el-header class="content-header">
        <el-row>
          <el-col :span="12" class="welcome-text">
            <el-avatar class="sculpture" :size="40" :src="sculptureSrc">
            </el-avatar>
            <p>
            你好，{{ LoginInfos.userName }}
            [
            {{ LoginInfos.userRole }}
            ]，欢迎来到碧蓝航线！
            </p>
          </el-col>
          <el-col :span="12" class="logout-btns">
            <el-button
              class="open-edit-infos"
              type="text"
              icon="el-icon-edit"
              @click="menuJump({ name: 'infos' })"
              >编辑个人资料
            </el-button>
            <el-popconfirm
            title="继续将退出登录!确定吗?"
            @onConfirm="logout"
            iconColor="#f56c6c"
            confirmButtonType="danger"
            cancelButtonType
            >
            <el-button type="text" size="mini" slot="reference">
                退出
            </el-button>
            </el-popconfirm>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="content-main">
        <el-aside class="content-aside">
          <el-row class="nav-menus">
            <el-col>
              <el-menu
                :default-active="String(menusconfigs.defaultActive)"
                :unique-opened="menusconfigs.uniqueOpened"
                :default-openeds="menusconfigs.defaultOpeneds"
                :collapse="menusconfigs.isCollapse"
                active-text-color="#409EFF"
                text-color="#fff"
                background-color="#2f4154"
              >
                <el-scrollbar
                  wrap-class=""
                  wrap-style=""
                  view-class=""
                  view-style=""
                  native="native"
                >
                  <el-submenu
                    v-if="menu.sonMenus"
                    v-for="(menu, index) in menusData"
                    :index="String(index + 1)"
                    :key="index"
                  >
                    <template slot="title">
                      <i class="menu-icon" :class="menu.icon"></i>
                      <span class="menu-text" slot="title">
                        {{ menu.menuTitle }}
                      </span>
                    </template>
                    <el-menu-item
                      :index="String(index + '-' + i)"
                      v-for="(sonMenu, i) in menu.sonMenus"
                      :key="i"
                      @click="menuJump({ name: sonMenu.routerName })"
                      >
                      <template slot="title">
                        <i class="menu-icon" :class="sonMenu.icon"></i>
                        <span class="menu-text" slot="title">
                          {{ sonMenu.menuTitle }}
                        </span>
                      </template>
                    </el-menu-item>
                  </el-submenu>
                  <el-menu-item
                    v-else
                    :index="String(index + 1)"
                    :key="index"
                    @click="menuJump({ name: menu.routerName })"
                  >
                    <i class="menu-icon" :class="menu.icon"></i>
                    <span class="menu-text" slot="title">
                      {{ menu.menuTitle }}
                    </span>
                  </el-menu-item>
                </el-scrollbar>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main class="content-area">
          <router-view></router-view>
        </el-main>
      </el-container>
      <el-footer class="content-footer">
        <!-- <主版本号>.<子版本号>.<阶段版本号>.<日期版本号>_<希腊字母版本号> -->
        <span>系统版本: 1.1.1.200115_beta</span>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
// 接口
import { LoggedIn, Logout } from "@/api/login";
// 工具
import Menus from "@/utils/menus";
import Bus from "@/utils/bus";

export default {
  name: "Home",
  data: function() {
    return {
      // Menus配置
      menusconfigs: {
        defaultActive: 1,
        uniqueOpened: true,
        defaultOpeneds: ["1"],
        isCollapse: false
      },
      // menu数据
      menusData: [],
      // 头像
      sculptureSrc: "",
      // 角色
      curRole: "",
      native: false
    };
  },
  components: {},
  methods: {
    /**
     * 功能操作
     */
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
            _self.$router.push({ name: "login" });
          } else if (response.data.stateCode == "402") {
            _self.tips("退出失败!", "error");
          } else {
            console.log("退出出错!");
          }
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // Menu跳转
    menuJump: function(ro) {
      let _self = this;
      if (_self.$route.name != ro.name) {
        _self.$router.replace(ro);
      }
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
    checkLoggedIn: function() {
      let _self = this;
      let promise = LoggedIn();
      promise
        .then(response => {
          // 请求成功 status: 200
          if (response.data.stateCode == "301") {
            // 未登录或者登录超时
            _self.tips("未登录或登录超时，请重新登录!", "error");
            _self.$store.commit("setLoginInfos");
            _self.curRole = "";
            _self.$router.push({ name: "login" });
          } else if (response.data.stateCode == "302") {
            // 有效登录
            _self.sculptureSrc = _self.$resource + sessionStorage.getItem("userPhoto");
            _self.$store.commit("setLoginInfos", {
              u_id: sessionStorage.getItem("userId"),
              u_name: sessionStorage.getItem("userName"),
              u_role: sessionStorage.getItem("userRole"),
              u_photo: sessionStorage.getItem("userPhoto"),
              tk: response.data.token
            });
            _self.curRole = response.data.urc;
          } else if (response.data.stateCode == "303") {
            // 无效登录
            _self.tips("登录状态错误，请重新登录!", "error");
            _self.$store.commit("setLoginInfos");
            _self.curRole = "";
            _self.$router.push({ name: "login" });
          } else {
            console.log("出错!");
            _self.$store.commit("setLoginInfos");
            _self.curRole = "";
            _self.$router.push({ name: "login" });
          }
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    }
  },
  watch: {
    curRole: {
      handler(newVal) {
        let _self = this;
        for (let i = 0; i < Menus.length; i++) {
          let element = Menus[i];
          if (element.roleLv.indexOf(newVal) != -1) {
            _self.menusData.push(element);
          }
        }
        /**
         * $router 路由实例
         * $route  当前路由
         * _self.$router.currentRoute与_self.$route等价
         */
        if (_self.menusData[0].sonMenus) {
           _self.menuJump({ name: _self.menusData[0].sonMenus[0].routerName });
        } else {
           _self.menuJump({ name: _self.menusData[0].routerName });
        }
      }
    }
  },
  computed: {
    LoginInfos: function() {
      let _self = this;
      return _self.$store.state.LoginInfos;
    }
  },
  beforeCreate: function() {},
  created: function() {
    let _self = this;
    Bus.$on("photoSynchro", (arg) => {
        _self.sculptureSrc = arg;
    });
  },
  beforeMount: function() {
    let _self = this;
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
#view-home {
  .el-scrollbar__wrap {
    overflow-y: scroll;
    overflow-x: hidden;
    .el-scrollbar__view {
      .el-submenu {
        border-bottom: 1px dashed $tb_fff;
        text-align: left;
        .menu-icon {
          color: $tb_fff;
          line-height: 0.5rem;
          font-size: 24px;
          margin-right: 15px;
          vertical-align: top;
        }
        .menu-text {
          display: inline-block;
          vertical-align: top;
          line-height: 0.5rem;
          font-size: 16px;
        }
      }
      & > .el-menu-item {
        border-bottom: 1px dashed $tb_fff;
        text-align: left;
        .menu-icon {
          color: $tb_fff;
          line-height: 0.5rem;
          font-size: 24px;
          margin-right: 15px;
          vertical-align: top;
        }
        .menu-text {
          color: $tb_fff;
          display: inline-block;
          vertical-align: top;
          line-height: 0.5rem;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
#view-home {
  position: relative;
  height: 100%;
  overflow: hidden;
  .content-header {
    position: absolute;
    top: 0;
    width: 100%;
    height: 60px;
    padding: 0 20px;
    background-color: $c_theme;
    border-bottom: 1px solid $tb_dcdfe6;
    .welcome-text {
      .sculpture {
        display: inline-block;
        vertical-align: middle;
        margin: 5px 10px;
        border: 3px solid $tb_fff;
        img {
          display: block;
          font-size: 0;
        }
      }
      p {
        display: inline-block;
        font-size: 14px;
        color: $tb_fff;
        line-height: 60px;
      }
    }
    .logout-btns {
      text-align: right;
      line-height: 60px;
      .open-edit-infos {
        margin: 5px 10px;
        height: 40px;
        font-size: 14px;
        color: $tb_fff;
        &:hover {
          color: $tb_409eff;
        }
      }
      .el-button--text {
        font-size: 14px;
        color: $tb_fff;
        &:hover {
          color: $tb_ffb226;
        }
      }
    }
  }
  .content-main{
    height: 100%;
    padding: 60px 0px;
    .content-aside {
      overflow: hidden;
      position: relative;
      text-align: center;
      width: 200px !important;
      height: 100%;
      font-size: 24px;
      background-color: $tb_fff;
      border-right: 1px solid $tb_dcdfe6;
      .self-infos {
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 999;
        height: 50px;
        text-align: left;
        background-color: $c_theme;
        border-right: 1px solid $tb_dcdfe6;
        border-bottom: 1px solid $tb_dcdfe6;
        
        .info-name {
          margin: 5px 10px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          color: $tb_fff;
        }
        
      }
      .nav-menus {
        height: 100%;
        .el-col {
          height: 100%;
          .el-menu {
            height: 100%;
            .el-scrollbar {
              height: 100%;
            }
          }
        }
      }
    }
    .content-area {
      text-align: center;
      font-size: 24px;
      background-color: $c_content;
    }
  }
  .content-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    padding: 0 20px;
    line-height: 60px;
    font-size: 14px;
    color: $tb_fff;
    text-align: center;
    border-top: 1px solid $tb_dcdfe6;
    background-color: $c_theme;
  }
}
</style>
