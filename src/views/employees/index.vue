<template>
  <div class="dashboard-container">
    <div class="app-container">
      <pageTools :show-before="true">
        <!-- 左侧显示记录 -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <template v-slot:after>
          <el-button type="success" size="small" @click="$router.push('/import')">excel导入</el-button>
          <el-button type="danger" size="small" @click="exportDate">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog=true">新增员工</el-button>
        </template>
      </pageTools>
      <!-- 放入表格 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <!-- 头像插槽 -->
          <el-table-column label="头像">
            <template v-slot="{row}">
              <img v-imagerror="require('@/assets/common/head.jpg')" :src="row.staffPhoto" alt="" style="border-radius:50%;width:50px;height:50px;" @click="showQcode(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployess" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`employees/detailed/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="m_deleRole(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" align="middle" style="height:60px">
          <el-pagination
            layout="prev, pager, next"
            :total="page.total"
            :current-page="page.page"
            :page-size="page.size"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 传值的语法糖 -->
    <addEmployees :show-dialog.sync="showDialog" />
    <!-- 二维码 -->
    <el-dialog title="扫码查看头像" :visible.sync="dialogVisible">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>

</template>

<script>
import employees from '@/api/constant/employees'
import { formatDate } from '@/filters'
import { employeesList, deleRole } from '@/api/employees'
import addEmployees from './components/add-employees'
import Qrcode from 'qrcode'

export default {
  name: 'EmployessIndex',
  components: {
    addEmployees
  },
  data() {
    return {
      list: [],
      page: {
        page: 1, // 当前页
        size: 10, // 每页显示条数
        total: 0
      },
      loading: true,
      showDialog: false,
      dialogVisible: false
    }
  },
  created() {
    this.m_employeesList()
  },
  methods: {
    async  m_employeesList() {
      const { total, rows } = await employeesList(this.page)
      console.log(rows)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newpage) {
      this.page.page = newpage
      this.m_employeesList()
    },
    // 处理聘用形势格式化
    formatEmployess(row, column, cellValue, index) {
      // debugger
      // console.log(cellValue)
      console.log(employees.hireType)
      const obj = employees.hireType.find(item => item.id === parseInt(cellValue))
      // debugger
      // console.log(employees.hireType.find(item => item.id === 1))
      // console.log(obj)
      return obj ? obj.value : '未知'
    },
    async m_deleRole(id) {
      try {
        await this.$confirm('确认要删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 调用删除接口
        await deleRole(id)
        this.$message.success('删除成功')
        // 重新获取数据
        this.m_employeesList()
      } catch (error) {
        this.$message.warning(error)
      }
    },
    // 导出excel
    exportDate() {
      import('@/vendor/Export2Excel').then(async excel => {
        const headers = {
          '姓名': 'username',
          '手机号': 'mobile',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        const { rows } = await employeesList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // 复杂表头
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 合并单元格
        // excel是引入文件的导出对象
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          multiHeader,
          merges
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            console.log(parseInt(item[headers[key]]))
            const obj = employees.hireType.find(it => it.id === parseInt(item[headers[key]]))

            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    showQcode(url) {
      if (url) {
        this.dialogVisible = true
        this.$nextTick(() => {
          Qrcode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.error('用户还未上传对象')
      }
    }
  }
}
</script>

<style>

</style>
