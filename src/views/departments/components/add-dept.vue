<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="isShow" @close="btnCancel">
    <!-- 放置表单 -->
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="部门编码" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in people" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, departmentDetail, commitEdit } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDepts',
  props: {
    isShow: {
      // 默认让弹出层关闭
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null

    }
  },
  data() {
    const checkNameRepeat = async(rules, value, callback) => {
      // value是部门名称
      console.log(value)
      const { depts } = await getDepartments()
      let newDepts = false
      // 判断是编辑还是新增
      if (this.formData.id) {
        // 有id是编辑
        // 找同级部门下pid相同的也就是同级部门，且查找id不能等于自身id,some找每一项name不能等于同级下的name
        newDepts = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 无id是新增
        // newDepts为true表示找到了同名
        console.log(1234)
        newDepts = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      // 如果是true就报错，如果不是就放行
      newDepts ? callback(new Error(`同级部门下已经存在${value}`)) : callback()
    }
    const checkCodeRepets = async(rules, value, callback) => {
      const { depts } = await getDepartments()
      let newCodeRepts = false
      // value当前名字，判断code是否等于当前输入的value，并且value不能为空
      if (this.formData.id) {
        // 有id是编辑
        // code整个结构中只能有一个
        newCodeRepts = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 无id新增
        newCodeRepts = depts.some(item => item.code === value && value)
      }
      newCodeRepts ? callback(new Error(`同级部门下已经存在${value}`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1到 10个字符', trigger: 'blur' }, {
            validator: checkNameRepeat,
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
          {
            validator: checkCodeRepets,
            trigger: 'blur'
          }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空 ', trigger: 'blur' },
          { min: 5, max: 50, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]

      },
      people: null
    }
  },
  computed: {
    showTitle() {
      // 根据有无id判断
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 获取员工列表接口
    async getEmployeeSimple() {
      this.people = await getEmployeeSimple()
    },
    // 如果使用treeNOde.id值因为它是Props传来的是异步
    async m_departmentDetail(id) {
      this.formData = await departmentDetail(id)
    },
    // 校验通过
    btnOk() {
      this.$refs.form.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            // 修改部门
            await commitEdit(this.formData)
          } else {
            // 新增部门
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 父组件传值
          this.$emit('addDepts')
          // 父组件关闭弹出层 update固定写法
          this.$emit('update:isShow', false)
          // 表单表格内容清空
          // this.$refs.form.resetFields()
        }
      })
    },
    btnCancel() {
      this.$emit('update:isShow', false)
      // 表单表格内容清空
      this.$refs.form.resetFields()
      // 表单表格内容清空
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    }
  }

}
</script>

<style>

</style>
