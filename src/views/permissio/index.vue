<template>
  <div class="dashboard-container">
    <div class="app-container">
      <pageTools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1,0)">添加权限</el-button>
        </template>
      </pageTools>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column
          align="center"
          label="名称"
          prop="name"
        />
        <el-table-column
          align="center"
          label="标识"
          prop="code"
        />
        <el-table-column
          align="center"
          label="描述"
          prop="description"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template v-slot="{row}">
            <el-button v-if="row.type==1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPer(row.id)">编辑</el-button>
            <el-button type="text" @click="deletePer(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="showTitle" :visible="dialogVisible" @close="btnCancel">
        <el-form ref="ruleForm" label-width="80px" :rules="rules" :model="formData">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" style="width:300px" />
          </el-form-item>
          <el-form-item label="标识" prop="code">
            <el-input v-model="formData.code" style="width:300px" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="formData.description" style="width:300px" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" @click="btnOk()">确定</el-button>
            <el-button @click="btnCancel()">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission, updatePermission, getPermissionDetail, delPermission } from '@/api/permisson'
import { tranListToTreeDate } from '@/utils'
export default {
  name: 'Permissopn',
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      showswitch: true,
      formData: {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      },
      rules: {
        name: [{ required: true, message: '请输入名称' }],
        code: [{ required: true, message: '请输入标识' }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.m_getPermissionList()
  },
  methods: {
    async m_getPermissionList() {
      const data = await getPermissionList()
      console.log(data)
      // 将数据转换为树形
      this.tableData = tranListToTreeDate(data, '0')
    },
    // 添加根权限和添加子权限
    addPermission(type, pid) {
      this.dialogVisible = true
      this.formData.type = type
      this.formData.pid = pid
    },
    // 点击确定传值
    btnOk() {
      this.$refs.ruleForm.validate().then(() => {
        if (this.formData.id) {
          // 有id是编辑
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.m_getPermissionList()
        this.formData = {
          name: '',
          code: '',
          description: '',
          type: '',
          pid: '',
          enVisible: '0'
        }
        this.$refs.ruleForm.resetFields()
      })
    },
    // 编辑
    async editPer(id) {
      this.formData = await getPermissionDetail(id)
      this.dialogVisible = true
    },
    // 取消
    btnCancel() {
      this.dialogVisible = false
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
      this.$refs.ruleForm.resetFields()
    },
    // 删除
    async deletePer(id) {
      this.$confirm('是否删除此权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPermission(id)
        this.$message.success('删除成功')
        this.m_getPermissionList()
      })
    }
  }
}
</script>

<style>

</style>
