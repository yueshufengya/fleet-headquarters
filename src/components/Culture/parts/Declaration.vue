<template>
  <div id="declaration">
      <div class="plate-wrapper"></div>
  </div>
</template>

<script>
export default {
  name: "Declaration",
  props: [],
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

<style lang="scss" scoped>
.plate-wrapper {
  position: relative;
  display: block;
  width: 80%;
  margin: 20px auto 0px ;
  padding: 20px;
  background-color: #ddd;
  border: 2px solid #fff;
  box-shadow: 5px 5px 10px rgba($color: #333, $alpha: 0.5);
  border-radius: 10px;
}
</style>
