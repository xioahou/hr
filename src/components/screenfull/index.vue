<template>
  <div>
    <svg-icon
      icon-class="fullscreen"
      style="coor:#fff;width:20px;height:20px"
      @click="fullView"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    fullView() {
      if (!ScreenFull.isEnabled) {
        this.$message.error('当前不能全屏')
      }
      ScreenFull.toggle()
    }
  }
}
</script>

<style>

</style>
