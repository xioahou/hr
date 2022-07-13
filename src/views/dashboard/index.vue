<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ userInfo }}</div>
    <uploadImg />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
// 引入组件
// import pageTools from '@/components/pageTools'

export default {
  name: 'Dashboard',

  // components: {
  //   pageTools
  // },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
