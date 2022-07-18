<template>
  <el-dropdown trigger="click" @command="changLaguage">
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="this.$i18n.locale==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="this.$i18n.locale==='en'">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changLaguage(type) {
      console.log(type)
      Cookie.set('language', type)
      this.$i18n.locale = type
    }
  }
}
</script>

<style>

</style>
