<template>
  <el-row type="flex" align="middle" justify="space-between" style="height:40px;width:100% ">

    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="5">
      <el-row type="flex">
        <el-col><span>{{ treeNode.manager }}</span></el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add" :disabled="!checkPermission('add-perm')">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isLoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isLoot" command="dele">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { DeleteDepartments } from '@/api/departments'
export default {
  name: 'TreeTooles',
  props: {
    treeNode: {
      required: true,
      type: Object

    },
    isLoot: {
      type: Boolean,
      // 默认不是根节点不显示
      default: false
    }
  },
  data() {
    return {

    }
  },
  // 树形结构下拉菜单
  methods: {
    // 点击编辑，修改，删除
    operateDepts(command) {
      if (command === 'dele') {
        // 删除
        this.$confirm('你确定要删除该组织部门吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
          // 如果点击确认就会进入then
          () => {
            return DeleteDepartments(this.treeNode.id) // 返回Promise对象
          }
        ).then(() => {
          // 只需要等到成功的时候，调用接口删除了，后端数据变化了，但是前端没变
          this.$emit('delDepts')
          this.$message.success('删除部门成功')
        })
      } else if (command === 'edit') {
        // 编辑

        this.$emit('editDepts', this.treeNode)
      } else {
        // 添加
        this.$emit('addDepts', this.treeNode)
      }
    }
  }
}
</script>

<style>

</style>
