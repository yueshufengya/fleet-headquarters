<template>
  <div id="archive-list">
    <div class="functional-area">
      功能区: 筛选+排序+搜索
    </div>
    <div class="content-area">
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

export default {
  name: "ArchiveList",
  props: [],
  data: function() {
    return {
      /**
       * 分页相关
       */
      // 数据总条数
      total: 100,
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
    };
  },
  components: {
    MyPagination
  },
  methods: {
/**
 * 功能操作
 */
    // 翻页
    flip: function(cpage) {
      console.log(cpage);
      let _self = this;
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
 * 数据获取
 */
    
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
.functional-area{
  height: 60px;
  color: $tb_fff;
  font-size: 14px;
  line-height: 60px;
  background-color: $tb_409eff;
  border: 2px dashed $tb_dcdfe6;
}
</style>
