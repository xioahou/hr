<template>
  <el-dialog :visible="showDialog" title="新增员工" @close="btnCancal">
    <el-form ref="ruleForm" label-width="120px" :rules="rules" :model="formData">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" type="date" placeholder="选择入职时间" style="width:50%" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" placeholder="请选择入职时间" style="width:50%">
          <el-option v-for="item in employess.hireType" :key="item.id" :label="item.value" :value="item.id" />

        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请输入部门" @focus="m_tranListToTreeDate" />
        <el-tree v-if="showTree" v-loading="loading" :data="treeDate" :props="defaultProps" :default-expand-all="true" @node-click="nodeClick" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" type="date" placeholder="选择转正时间" style="width:50%" />
      </el-form-item>

    </el-form>
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnCancal">取消</el-button>
          <el-button type="success" size="small" @click="btnOk">确认</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>

</template>

<script>
import { getDepartments } from '@/api/departments'
import { addRole } from '@/api/employees'
import { tranListToTreeDate } from '@/utils/index'
import employess from '@/api/constant/employees'
export default {
  name: 'AddEmployees',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      employess,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }, { min: 1, max: 4, message: '用户名姓名为1~4位', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话号码', trigger: 'blur' }, { pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/, message: '手机号格式错误', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'change' }]
      },

      treeDate: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loading: false,
      showTree: false

    }
  },
  methods: {
    // 获取树形部门列表
    async m_tranListToTreeDate() {
      this.loading = true
      this.showTree = true
      const { depts } = await getDepartments()
      console.log(depts)
      this.treeDate = tranListToTreeDate(depts, '')
      this.loading = false
    },
    nodeClick(node) {
      console.log(node)
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOk() {
      try {
        await this.$refs.ruleForm.validate()
        await addRole(this.formData)
        this.$parent.m_employeesList()
        this.$emit('update:show-dialog', false)
        this.formData = {
          username: '',
          mobile: '',
          formOfEmployment: '',
          workNumber: '',
          departmentName: '',
          timeOfEntry: '',
          correctionTime: ''
        }
        this.$refs.ruleForm.resetFields()
      } catch (error) {
        console.log('失败')
      }
    },
    btnCancal() {
      this.$emit('update:show-dialog', false)
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style>

</style>
