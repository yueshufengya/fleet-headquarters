<template>
    <div id="cur-position">
        <i class="position-icon el-icon-location"></i>
        <el-breadcrumb class="breadcrumb-nav" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in crumbs" :key="index">{{ item.title }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
  name: "MyBreadCrumb",
  props: ["crumbs"],
  data: function() {
    return {};
  },
  components: {},
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

<style lang="scss">
#cur-position{
    .el-breadcrumb__item{
        span.el-breadcrumb__separator,span.el-breadcrumb__inner,span.is-link{
            font-weight: normal;
            font-size: 14px;
            color: $tb_fff;
        }
        span.is-link:hover{
            color: $tb_409eff;
        }
    }
}
</style>
<style lang="scss" scoped>
#cur-position{
    text-align: left;
    height: 50px;
    background-color: $c_theme;
    .position-icon{
        display: inline-block;
        line-height: 50px;
        vertical-align: middle;
        margin:0 10px;
        color: $tb_fff;
    }
    .breadcrumb-nav{
        display: inline-block;
        line-height: 50px;
        vertical-align: middle;
    }
}
</style>
