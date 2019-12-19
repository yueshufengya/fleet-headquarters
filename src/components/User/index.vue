<template>
  <div id="part-user">
    <my-breadcrumb :crumbs="crumbs"></my-breadcrumb>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="核星战舰列队" name="TabPane01">
        <UserList></UserList>
      </el-tab-pane>
      <el-tab-pane label="新晋核星战舰" name="TabPane02">
        <NewUser></NewUser>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 组件
import MyBreadcrumb from "@/components/Customize/BreadCrumb";
import UserList from './parts/UserList';
import NewUser from './parts/NewUser';

export default {
  name: "Users",
  props: [],
  data: function() {
    return {
      crumbs: [ 
        { title: "航线建设" },
        { title: "核星战舰" }
      ],
      activeName: "TabPane01",
    };
  },
  components: {
    MyBreadcrumb,
    UserList,
    NewUser
  },
  methods: {},
  watch: {},
  computed: {},
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

<style lang="scss" scoped></style>
