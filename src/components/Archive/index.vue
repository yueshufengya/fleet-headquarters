<template>
  <div id="part-archives">
    <my-breadcrumb :crumbs="crumbs"></my-breadcrumb>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="档案列表" name="TabPane01">
        <ArchiveList></ArchiveList>
      </el-tab-pane>
      <el-tab-pane label="新增档案" name="TabPane02">
        <NewArchive></NewArchive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 组件
import MyBreadcrumb from "@/components/Customize/BreadCrumb";
import ArchiveList from './parts/ArchiveList';
import NewArchive from './parts/NewArchive';

export default {
  name: "Archives",
  data: function() {
    return {
      crumbs: [ { title: "战舰档案" } ],
      activeName: "TabPane01",
    };
  },
  components: {
    MyBreadcrumb,
    ArchiveList,
    NewArchive
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

<style lang="scss">
#part-archives{
    .el-breadcrumb__item{
        span.el-breadcrumb__separator,span.el-breadcrumb__inner,span.is-link{
            font-weight: normal;
            font-size: 14px;
            color: #fff;
        }
        span.is-link:hover{
            color: #409eff;
        }
    }
}
</style>
<style lang="scss" scoped></style>
