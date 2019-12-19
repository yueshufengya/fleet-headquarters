<template>
  <div id="user-list">
    <div class="functional-area">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-input
            v-model="searchText"
            class="search-text"
            size="mini"
            prefix-icon="el-icon-search"
            placeholder="请输入需要搜索的用户姓名!"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-button
            type="primary"
            class="search-btn"
            size="mini"
            icon="el-icon-search"
            @click="searchFn"
            >搜索
          </el-button>
          <el-tooltip
            class="item"
            effect="dark"
            placement="top"
            content="重新获取数据!"
          >
            <el-button
              circle
              type="primary"
              class="search-btn"
              size="mini"
              icon="el-icon-refresh"
              @click="refreshData"
            >
            </el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="16" align="right"  v-if="hidden992">
          <transition name="el-zoom-in-center">
            <div class="mode-level" v-if="isFuzzy">
              <el-radio-group v-model="fuzzyLevel">
                <el-tooltip
                  class="item"
                  effect="dark"
                  placement="top"
                  content="英文:按单词搜索/中文:按词搜索"
                >
                  <el-radio border size="mini" class="mode-radio" label="g">
                    一般模式
                  </el-radio>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  placement="top"
                  content="英文:按单词搜索/中文:按字搜索"
                >
                  <el-radio border size="mini" class="mode-radio" label="s">
                    超级模式
                  </el-radio>
                </el-tooltip>
              </el-radio-group>
            </div>
          </transition>
          <el-tooltip
            class="item"
            effect="dark"
            placement="top"
            content="开启模糊匹配扩大搜索范围!"
          >
            <el-switch
              v-model="isFuzzy"
              active-text="开启汉字/单词模糊搜索"
              @change="switchFuzzy"
              inactive-color="#86806b"
            >
            </el-switch>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    <div class="content-area">
      <el-table
        border
        stripe
        v-loading="loading"
        :data="usersData"
        :default-sort="tableconfig.defaultsort"
        ref="filterTable"
        max-height="570"
        borderelement-loading-spinner="el-icon-loading"
        element-loading-text="拼命加载中..."
        @filter-change="filterChange"
      >
        <el-table-column
          sortable
          show-overflow-tooltip
          :sort-orders="sortorders"
          :sort-method="sortById"
          class-name="column-field"
          prop="uid"
          label="编号"
          width="80"
          key="uid"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :sort-orders="sortorders"
          :sort-method="sortById"
          class-name="column-field"
          prop="account"
          label="账号"
          width="100"
          key="account"
        >
        </el-table-column>
        <el-table-column
          :filters="filterOptions.unames"
          :filter-method="filterHandlerWithName"
          class-name="column-field"
          prop="uname"
          column-key="uname"
          width="100"
          filter-placement="right-start"
          show-overflow-tooltip
          key="uname"
        >
          <template slot="header">
            <el-tooltip
              class="item"
              effect="dark"
              content="过滤本地当前页数据，不向服务器请求数据"
              placement="top"
            >
              <span>姓名</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-if="hidden992"
          :filter-multiple="false"
          :filters="filterOptions.urns"
          :filter-method="filterHandlerWithRole"
          class-name="column-field"
          prop="urn"
          column-key="rid"
          width="100"
          filter-placement="right-start"
          show-overflow-tooltip
          key="rid"
        >
          <template slot="header">
            <el-tooltip
              class="item"
              effect="dark"
              content="向服务器请求数据,进行过滤"
              placement="top"
            >
              <span>职位</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column class-name="column-field" label="操作" key="options">
          <template slot-scope="scope">
            <el-popconfirm
              cancelButtonType
              class="options-btns"
              title="确定需要重置密码吗?"
              iconColor="#e6a23c"
              confirmButtonType="warning"
              @onConfirm="resetPwd(scope.row.uid)"
            >
              <el-button round size="mini" type="warning" slot="reference">
                重置密码
              </el-button>
            </el-popconfirm>
            <el-popconfirm
              cancelButtonType
              class="options-btns"
              title="确定需要注销该用户吗?"
              iconColor="#f56c6c"
              confirmButtonType="danger"
              @onConfirm="cancelUser(scope.row.uid)"
            >
              <el-button
                circle
                size="mini"
                type="danger"
                icon="el-icon-delete"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column
          v-if="hidden992"
          type="expand"
          label="更多信息"
          width="100"
          fixed="right"
        >
          <template slot-scope="props">
            <el-form inline label-position="left" class="demo-table-expand">
              <el-form-item label="联系电话:">
                <span>{{ props.row.utel }}</span>
              </el-form-item>
              <el-form-item label="EMAIL:">
                <span>{{ props.row.uemail }}</span>
              </el-form-item>
              <el-form-item label="创建时间:">
                <span>{{ props.row.ctime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <my-pagination
        v-if="paginationShow"
        :curpage="curpage"
        :total="total"
        :onePageHide="onePageHide"
        :pagesize="pagesize"
        @page-turning="flip"
      >
      </my-pagination>
    </div>
  </div>
</template>

<script>
// 组件
import MyPagination from "@/components/Customize/Pagination";
// 接口
import {
  GetUserList,
  GetUserListByName,
  GetUserListByRole,
  ResetPwd,
  CancelUser
} from "@/api/user";
import { GetRoleList } from "@/api/role";
// 工具
import sha1 from 'js-sha1';
import Qs from "qs";
import Utils from "@/utils/utils";

export default {
  name: "UserList",
  props: [],
  data: function() {
    return {
      /**
       * 表格的一些配置
       */
      tableconfig: {
        defaultsort: { prop: "uid", order: "ascending" } // 降序：descending
      },
      /**
       * 分页相关
       */
      // 数据总条数
      total: 0,
      // 当前页
      curpage: 1,
      // 每页显示多少条数据
      pagesize: 10,
      // 当前翻页类型
      curFlip: "default",
      // 一页数据时 是否隐藏翻页
      onePageHide: true,
      // 必要,通过paginationShow配合v-if切换翻页显示状态,:current-page="curpage"才能生效
      paginationShow: true,
      /**
       * 数据相关
       */
      // 用户数据
      usersData: [],
      // 过滤器的选项
      filterOptions: {
        unames: [],
        urns: []
      },
      // 被选中的过滤器的选项
      selectedOptions: { rid: "" },
      /**
       * 功能相关
       */
      // 搜索内容
      searchText: "",
      // 搜索是否开启模糊匹配 默认 false为关闭
      isFuzzy: false,
      // 模糊等级
      fuzzyLevel: "g",
      // 是否显示加载组件
      loading: false,
      // 数据在排序时所使用排序策略的轮转顺序，仅当 sortable 为 true 时有效
      sortorders: ["ascending", "descending"],
      // 视口宽度
      viewWidth: 1200,
      hidden992: true
    };
  },
  components: {
    MyPagination
  },
  methods: {
    /**
     * 功能操作
     */
    // 搜索
    searchFn: function() {
      let _self = this;
      //判断用户名是中文还是英文 姓名不支持中英文混用
      /**
       * 用户名可以是中文，也可以是英文，但是不能中英文混用
       * 中文名可以使用中文的 "·" 分隔
       * 英文名使用" "(空格) 分隔
       */
      let reg_en = /.*[a-zA-Z]+.*$/,
        reg_cn = /.*[\u4e00-\u9fa5]+.*$/;
      if (reg_en.test(_self.searchText) && reg_cn.test(_self.searchText)) {
        _self.tips("姓名不支持中英文混用", "warning");
      } else {
        _self.getUserListByName(1, _self.searchText);
        _self.resetFilter();
      }
    },
    // 切换搜索模式
    switchFuzzy: function(newState) {
      let _self = this;
      if (!newState) {
        _self.fuzzyLevel = "g";
      }
    },
    // 刷新数据
    refreshData: function() {
      let _self = this;
      _self.searchText = "";
      _self.resetFilter();
      _self.getUserList();
    },
    // 编号排序
    sortById: function(next, previous) {
      let pId = parseInt(previous.uid);
      let nId = parseInt(next.uid);
      return nId - pId;
    },
    // 筛选相关
    filterChange: function(filterObj) {
      /**
       * 在这个方法中需要的是让“职责(权限)”过滤器和“姓名”过滤器实现联动
       * 例如：
       * “职责”过滤器选择“舰队提督”进行过滤后,“姓名”过滤器选项中就只应该包含“职责”是“舰队提督”的用户的姓名
       * 并且只要“职责”过滤器使用的过滤选项改变,则重置“姓名”过滤器
       */
      let _self = this;
      let key = Object.keys(filterObj)[0];
      // console.log(filterObj);
      // console.log(key);
      switch (key) {
        case "rid": {
          // console.log(filterObj[key][0]);
          if (filterObj[key].length == 0) {
            _self.getUserList(_self.curpage);
          } else {
            _self.selectedOptions.rid = filterObj[key][0];
            _self.getUserListByRole(1, filterObj[key][0]);
          }
          _self.resetFilter("uname");
          break;
        }
        case "uname": {
          break;
        }
      }
    },
    filterHandlerWithRole: function(value, row, column) {
      // console.log("role====>");
      // console.log(row.rid + ":::" + row.uname + "->" + value);
      return row.rid === value;
    },
    filterHandlerWithName: function(value, row, column) {
      // console.log("name====>");
      // console.log(row.uid + ":::" + row.uname + "->" + value);
      return row.uname === value;
    },
    resetFilter: function(filter = "") {
      let _self = this;
      if (filter != "") {
        _self.$refs.filterTable.clearFilter(filter);
      } else {
        _self.$refs.filterTable.clearFilter();
      }
    },
    // 重置密码
    resetPwd: function(uid) {
      let _self = this;
      let data = Qs.stringify({ id: uid });
      let promise = ResetPwd(data);
      promise
        .then(response => {
          // 请求成功 status: 200
          if (response.data.stateCode == "301") {
            _self.tips("未登录或登录超时，请重新登录!", "error");
            _self.$store.commit("setLoginInfos");
            _self.$router.push({ name: "login" });
          } else if (response.data.stateCode == "2020") {
            _self.tips("没有权限执行该操作！", "warning");
          } else if (response.data.stateCode == "502") {
            _self.tips("密码已重置!", "success");
            if (uid == _self.$store.state.LoginInfos.userId) {
              _self.$store.commit("setLoginInfos");
              _self.$router.push({ name: "login" });
            }
          } else if (response.data.stateCode == "503") {
            _self.tips("似乎已经是初始密码啦！", "warning");
          } else {
            console.log("出错!");
            _self.tips("重置密码出错！", "error");
          }
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // 注销用户
    cancelUser: function(uid) {
      let _self = this;
      // 前端防止 注销当前登录的用户 但是还需要服务器端加以防止
      if (uid == _self.$store.state.LoginInfos.userId) {
        _self.tips("不能注销当前登录的用户!", "warning");
        return;
      }
      let data = Qs.stringify({ id: uid });
      let promise = CancelUser(data);
      promise
        .then(response => {
          // 请求成功 status: 200
          if (response.data.stateCode == "301") {
            _self.tips("未登录或登录超时，请重新登录!", "error");
            _self.$store.commit("setLoginInfos");
            _self.$router.push({ name: "login" });
          } else if (response.data.stateCode == "601") {
            _self.tips("不能注销当前登录的用户!", "warning");
          } else if (response.data.stateCode == "2020") {
            _self.tips("没有权限执行该操作！", "warning");
          } else if (response.data.stateCode == "602") {
            _self.tips("用户已经成功注销!", "success");
            switch (_self.curFlip) {
              case "by-name": {
                _self.getUserListByName(_self.curpage, _self.searchText);
                break;
              }
              case "by-role": {
                _self.getUserListByRole(
                  _self.curpage,
                  _self.selectedOptions.rid
                );
                break;
              }
              default: {
                _self.getUserList(_self.curpage);
              }
            }
          } else if (response.data.stateCode == "603") {
            _self.tips("没有数据被注销！", "warning");
          } else {
            console.log("出错!");
            _self.tips("注销用户出错！", "error");
          }
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // 翻页
    flip: function(cpage) {
      let _self = this;
      switch (_self.curFlip) {
        case "by-name": {
          _self.getUserListByName(cpage, _self.searchText);
          _self.resetFilter("uname");
          break;
        }
        case "by-role": {
          _self.getUserListByRole(cpage, _self.selectedOptions.rid);
          _self.resetFilter("uname");
          break;
        }
        default: {
          _self.getUserList(cpage);
          _self.resetFilter("uname");
        }
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
    // 获取权限列表
    getRoleList: function() {
      let _self = this;
      let promise = GetRoleList();
      promise
        .then(response => {
          response.data.forEach(element => {
            _self.filterOptions.urns.push({
              text: element.urn,
              value: element.rid
            });
          });
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // 获取用户列表
    getUserList: function(cpage = 1) {
      let _self = this;
      _self.filterOptions.unames = [];
      _self.curFlip = "default";
      _self.paginationShow = false;
      _self.loading = true;
      _self.curpage = cpage;
      let data = Qs.stringify({ curpage: cpage });
      let promise = GetUserList(data);
      promise
        .then(response => {
          // 请求成功 status: 200
          _self.total = parseInt(response.data.total);
          if (response.data.data.length != 0) {
            _self.usersData = response.data.data;
            response.data.data.forEach(element => {
              _self.filterOptions.unames.push({
                text: element.uname,
                value: element.uname
              });
            });
            _self.filterOptions.unames = Utils.removeDuplicate(
              _self.filterOptions.unames
            );
            _self.paginationShow = true;
          } else {
            // 当前页注销最后一个用户后取上一页数据
            _self.usersData = [];
            if (cpage > 1) {
              _self.curpage = cpage - 1;
              let data = Qs.stringify({ curpage: cpage - 1 });
              let promise = GetUserList(data);
              promise
                .then(response => {
                  _self.usersData = response.data.data;
                  response.data.data.forEach(element => {
                    _self.filterOptions.unames.push({
                      text: element.uname,
                      value: element.uname
                    });
                  });
                  _self.filterOptions.unames = Utils.removeDuplicate(
                    _self.filterOptions.unames
                  );
                  _self.paginationShow = true;
                })
                .catch(error => {
                  // 请求失败
                  console.log(error);
                });
            }
          }
          _self.loading = false;
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // 根据姓名获取
    getUserListByName: function(cpage = 1, qstr = "") {
      let _self = this;
      _self.filterOptions.unames = [];
      _self.curFlip = "by-name";
      _self.paginationShow = false;
      _self.loading = true;
      _self.curpage = cpage;
      let data = Qs.stringify({
        curpage: cpage,
        qstr: qstr,
        fuzzy: _self.isFuzzy ? "fuzzy" : "nofuzzy",
        fuzzyLV: _self.fuzzyLevel
      });
      let promise = GetUserListByName(data);
      promise
        .then(response => {
          // 请求成功 status: 200
          _self.total = parseInt(response.data.total);
          if (response.data.data.length != 0) {
            _self.usersData = response.data.data;
            response.data.data.forEach(element => {
              _self.filterOptions.unames.push({
                text: element.uname,
                value: element.uname
              });
            });
            _self.filterOptions.unames = Utils.removeDuplicate(
              _self.filterOptions.unames
            );
            _self.paginationShow = true;
          } else {
            // 当前页注销最后一个用户后取上一页数据
            _self.usersData = [];
            if (cpage > 1) {
              _self.curpage = cpage - 1;
              let data = Qs.stringify({ curpage: cpage - 1, qstr: qstr });
              let promise = GetUserListByName(data);
              promise
                .then(response => {
                  _self.usersData = response.data.data;
                  response.data.data.forEach(element => {
                    _self.filterOptions.unames.push({
                      text: element.uname,
                      value: element.uname
                    });
                  });
                  _self.filterOptions.unames = Utils.removeDuplicate(
                    _self.filterOptions.unames
                  );
                  _self.paginationShow = true;
                })
                .catch(error => {
                  // 请求失败
                  console.log(error);
                });
            }
          }
          _self.loading = false;
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    },
    // 根据权限获取
    getUserListByRole: function(cpage = 1, qstr = "") {
      let _self = this;
      _self.filterOptions.unames = [];
      _self.curFlip = "by-role";
      _self.paginationShow = false;
      _self.loading = true;
      _self.curpage = cpage;
      _self.curFilterOptions = qstr;
      let data = Qs.stringify({ curpage: cpage, qstr: qstr });
      let promise = GetUserListByRole(data);
      promise
        .then(response => {
          // 请求成功 status: 200
          _self.total = parseInt(response.data.total);
          if (response.data.data.length != 0) {
            _self.usersData = response.data.data;
            response.data.data.forEach(element => {
              _self.filterOptions.unames.push({
                text: element.uname,
                value: element.uname
              });
            });
            _self.filterOptions.unames = Utils.removeDuplicate(
              _self.filterOptions.unames
            );
            _self.paginationShow = true;
          } else {
            // 当前页注销最后一个用户后取上一页数据
            _self.usersData = [];
            if (cpage > 1) {
              _self.curpage = cpage - 1;
              let data = Qs.stringify({ curpage: cpage - 1, qstr: qstr });
              let promise = GetUserListByRole(data);
              promise
                .then(response => {
                  _self.usersData = response.data.data;
                  response.data.data.forEach(element => {
                    _self.filterOptions.unames.push({
                      text: element.uname,
                      value: element.uname
                    });
                  });
                  _self.filterOptions.unames = Utils.removeDuplicate(
                    _self.filterOptions.unames
                  );
                  _self.paginationShow = true;
                })
                .catch(error => {
                  // 请求失败
                  console.log(error);
                });
            }
          }
          _self.loading = false;
        })
        .catch(error => {
          // 请求失败
          console.log(error);
        });
    }
  },
  watch: {
    viewWidth: function(val) {
      this.$nextTick(() => {
        if(val < 992){
          this.hidden992 = false;
        }
      })
    }
  },
  computed: {
    filterObj: function() {
      let _self = this;
      let filterObj = _self.filterOptions.urns;
      return filterObj;
    }
  },
  beforeCreate: function() {},
  created: function() {},
  beforeMount: function() {
    let _self = this;
    // 获取权限列表
    _self.getRoleList();
    // 获取用户列表
    _self.getUserList();
  },
  mounted: function() {
    //可用于设置自适应屏幕，根据获得的可视宽度（兼容性）判断是否显示
    this.viewWidth = document.documentElement.offsetWidth || document.body.offsetWidth;
  },
  beforeUpdate: function() {},
  Updated: function() {},
  beforeDestroy: function() {},
  destroyed: function() {}
};
</script>
<style lang="scss">
#user-list {
  .el-table {
    .selection-column {
      .cell {
        text-align: center;
        padding: 0;
      }
    }
    .column-field {
      text-align: center;
      .options-btns {
        margin: 0 5px;
      }
    }
    .el-form-item {
      width: 100%;
      height: 36px;
      margin-bottom: 5px;
      margin-right: 0;
      padding-left: 15px;
      background-color: #e8e8e8;
      .el-form-item__label,
      .el-form-item__content {
        line-height: 36px;
        font-size: 16px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.functional-area {
  color: $tb_fff;
  font-size: 14px;
  line-height: 40px;
  background-color: $c_content;
  border: 2px dashed $tb_dcdfe6;
  text-align: left;
  padding: 0 20px;
  margin-bottom: 20px;
  .search-text,
  .search-btn {
    display: inline-block;
  }
  /deep/.el-switch {
    .el-switch__label {
      color: $c_switch;
      &.is-active {
        color: $c_switch-active;
      }
    }
  }
  .mode-level {
    margin-right: 10px;
    display: inline-block;
    vertical-align: middle;
    .mode-radio {
      display: inline-block;
      vertical-align: middle;
      margin-left: 5px;
      &.is-bordered {
        border-color: $c_radio;
        /deep/ span {
          vertical-align: middle;
          color: $c_radio;
        }
      }
      &.is-bordered.is-checked {
        border-color: $tb_409eff;
        /deep/ span {
          vertical-align: middle;
          color: $tb_409eff;
        }
      }
    }
  }
}
</style>
