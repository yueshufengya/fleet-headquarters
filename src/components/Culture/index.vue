<template>
  <div id="part-declaration">
    <my-breadcrumb :crumbs="crumbs"></my-breadcrumb>
    <Declaration></Declaration>
  </div>
</template>

<script>
// 组件
import MyBreadcrumb from "@/components/Customize/BreadCrumb";
import Declaration from './parts/Declaration';

export default {
  name: "Culture",
  props: [],
  data: function() {
    return {
      crumbs: [ 
        { title: "航线建设" },
        { title: "航线文化" }
      ]
    };
  },
  components: {
    MyBreadcrumb,
    Declaration
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
