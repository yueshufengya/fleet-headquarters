<template>
  <div id="part-wsgrade">
    <my-breadcrumb :crumbs="crumbs"></my-breadcrumb>
  </div>
</template>

<script>
// 组件
import MyBreadcrumb from "@/components/Customize/BreadCrumb";

export default {
  name: "",
  props: [],
  data: function() {
    return {
      crumbs: [ 
        { title: "航线建设" },
        { title: "战舰级别" }
      ],
    };
  },
  components: {
    MyBreadcrumb
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
