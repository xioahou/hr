<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部 -->
      <el-card class="tree-card">
        <!-- 头部信息 -->
        <TreeTools :tree-node="company" :is-loot="true" @addDepts="m_addDepts" />
        <!-- 树形结构 -->
        <!-- //这里的props和夫传子的props没关系 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true ">
          <!-- 传入内容插槽内容 会循环多次 有多少节点，就循环多少次 -->
          <!-- 作用域插槽 slot-scope='obj' 接收传递值给插槽数据 data每个节点的数据对象 -->
          <!-- 引入组件   -->
          <TreeTools slot-scope="{data}" :tree-node="data" @delDepts="m_getDepartments" @addDepts="m_addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 添加部门弹出层 -->
    <addDepts ref="addDepts" :is-show.sync="isShow" :tree-node="node" @addDepts="m_getDepartments" />
  </div>
</template>

<script>
// 引入组件
import TreeTools from './components/tree-tools.vue'
import addDepts from './components/add-dept.vue'
// 引入接口api
import { getDepartments } from '@/api/departments'
// 引入工具
import { tranListToTreeDate } from '@/utils/index'
export default {
  name: 'Index',
  components: {
    TreeTools,
    addDepts
  },
  data() {
    return {
      isShow: false, // 给子组件弹出层传值
      node: '',
      company: {}, // 头部信息
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.m_getDepartments()
  },
  methods: {
    async  m_getDepartments() {
      const result = await getDepartments()
      console.log(result)
      // 给company赋值
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // 给departs赋值
      this.departs = tranListToTreeDate(result.depts, '')
    },
    m_addDepts(node) {
      console.log(12356)
      this.isShow = true
      this.node = node
    },
    // 点击编辑的方法
    editDepts(node) {
      this.isShow = true
      this.node = node
      // 调用组件实例
      this.$refs.addDepts.m_departmentDetail(node.id)
    }
  }
}
</script>

<style  scoped>
.tree-card{
  padding:30px 140px;
  font-size:14px;
}
</style>
