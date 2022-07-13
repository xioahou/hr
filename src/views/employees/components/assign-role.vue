<template>
  <el-dialog :visible="isdialog" title="分配角色" @close="btnCanel">
    <!-- 复选框 -->
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button type="primary" size="small" @click="btnCanel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { roleList } from '@/api/setting'
import { getUserImg } from '@/api/user'
import { assignRoot } from '@/api/employees'
export default {
  name: 'AssignIndex',
  // props传过来的值都是异步的
  props: {
    isdialog: {
      type: Boolean,
      default: false
    },
    userId: {
    //   required: true,
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      checkList: [] // 选中的角色
    }
  },
  created() {
    console.log(111111)
    this.m_roleList()
  },
  methods: {
    async  m_roleList() {
      const { rows } = await roleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    async m_getUserImg(id) {
      const { roleIds } = await getUserImg(id)
      this.checkList = roleIds
    },
    async btnOk() {
      await assignRoot({ id: this.userId, roleIds: this.checkList })
      this.$emit('update:isdialog', false)
    },
    btnCanel() {
      this.checkList = []
      this.$emit('update:isdialog', false)
    }
  }

}
</script>

<style>

</style>
