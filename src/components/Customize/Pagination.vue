<template>
  <div>
      <el-pagination
        background
        :current-page="curpage"
        :total="total"
        :hide-on-single-page="onePageHide"
        :page-size="pagesize"
        :pager-count="11"
        class="pages-area"
        layout="prev, pager, next"
        @current-change="flip"
      ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "MyPagination",
  props: [
      "curpage",
      "total",
      "onePageHide",
      "pagesize",
  ],
  data: function() {
    return {};
  },
  components: {},
  methods: {
     flip: function(cpage) {
         let _self = this;
         _self.$emit("page-turning",cpage);
     } 
  },
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

<style lang="scss" scoped>
.pages-area {
    margin-top: 20px;
    text-align: center;
}
</style>
