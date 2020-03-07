<template>
  <div id="part-infos">
    <my-breadcrumb :crumbs="crumbs"></my-breadcrumb>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="完善资料" name="TabPane01">
        <UserInfos></UserInfos>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="TabPane02">
        <UserPass :sculpture="sculptureSrc"></UserPass>
      </el-tab-pane>
    </el-tabs>
    
  </div>
</template>

<script>
// 组件
import MyBreadcrumb from "@/components/Customize/BreadCrumb";
import UserInfos from './parts/UserInfos';
import UserPass from './parts/UserPass';
// 工具
import Bus from "@/utils/bus";

export default {
  name: "Information",
  props: [],
  data: function() {
    return {
      crumbs: [{ title: "个人资料" }],
      activeName: "TabPane01",
      sculptureSrc: ""
    };
  },
  components: {
    MyBreadcrumb,
    UserInfos,
    UserPass
  },
  methods: {},
  watch: {},
  computed: {},
  beforeCreate: function() {},
  created: function() {
    let _self = this;
    Bus.$on("photoSynchro", (arg) => {
      _self.sculptureSrc = arg;
    });
  },
  beforeMount: function() {},
  mounted: function() {},
  beforeUpdate: function() {},
  Updated: function() {},
  beforeDestroy: function() {},
  destroyed: function() {}
};
</script>

<style lang="scss" scoped></style>
