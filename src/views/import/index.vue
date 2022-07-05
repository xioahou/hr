<template>
  <div>
    <UploadExcel :on-success="success" /></div>
</template>

<script>
import { batchRole } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      const userRoles = {
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '姓名': 'username',
        '工号': 'workNumber',
        '转正日期': 'correctionTime'

      }
      const arr = []
      results.forEach(async item => {
        const userInfo = {}

        Object.keys(item).forEach(key => {
          console.log(item[key])
          console.log(userRoles[key])
          if (userRoles[key] === 'timeOfEntry' || userRoles[key] === 'correctionTime') {
            userInfo[userRoles[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRoles[key]] = item[key]
          }
        })
        arr.push(userInfo)
        console.log(userInfo)
      })
      await batchRole(arr)
      this.$message.success('导入成功')
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }

}
</script>

<style>

</style>
