<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户管理" name="first">
            <el-row>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="isShowdig=true">新增角色</el-button>
            </el-row>
            <!-- //表格 -->
            <el-table

              border
              :data="list"
              style="width: 100%;margin-top:30px"
            >
              <el-table-column
                align="center"
                type="index"
                prop="id"
                label="序号"
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="名称"
                width="240"
              />
              <el-table-column
                align="center"
                prop="description"
                label="描述"
              />
              <el-table-column
                align="center"
                label="操作"
              >
                <!-- slot-scope可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
                <template slot-scope="{row}">
                  <el-button type="success" size="small" @click="dealRoot(row.id)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="m_roleDetail(row.id)">编辑</el-button>
                  <el-button type="danger" size="small" @click="m_deleteRole(row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                :background="true"
                :page-size="page.pagesize"
                :current-page="page.page"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="pagechange"
              />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :closable="false"
              :show-icon="true"
            />
            <!-- 表单 -->
            <el-form label-position="right" label-width="80px" style="margin-top:50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" style="width:400px" type="textarea" :rows:="3" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>

      </el-card>
    </div>
    <!-- 弹出层 -->
    <el-dialog title="角色编辑" :visible="isShowdig" @close="btnCanael">
      <el-form ref="ruleForm" label-width="80px" :rules="rules" :model="ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="ruleForm.description" />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCanael">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确认</el-button>
        </el-col>

      </el-row>
    </el-dialog>
    <!-- 分配权限弹层 -->
    <el-dialog :visible.sync="dialogVisible" title="分配权限" @close="btnCancel">
      <el-tree ref="tree" :data="listRoot" :props="defaultProps" :default-expand-all="true" :show-checkbox="true" :check-strictly="true" node-key="id" :default-checked-keys="keyId" />

      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="rootBtn">确定</el-button>
          <el-button @click=" btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { roleList, EnterpriseInquiries, deleteRole, roleDetail, updateRole, addRole, grantRoot } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeDate } from '@/utils'
export default {
  name: 'SettingIndex',
  data() {
    return {
      activeName: 'first',
      list: [],
      keyId: [], // 这里并不是数据双向绑定的，也就是说我的视图并不会随着数据的更新而更新，而element的tree组件是采用赋值的方式进行改变是否勾选。
      page: {
        // 当前页码
        page: 1,
        pagesize: 5,
        // 总条数
        total: 0
      },
      formData: {},
      isShowdig: false,
      ruleForm: {
        name: '',
        description: ''
      },
      rules: { name: [{ required: true, message: '必填项', trigger: 'blur' }] },
      dialogVisible: false,
      listRoot: [],
      defaultProps: {

        label: 'name'
      },
      roleId: null

    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.m_roleList()
    this.m_EnterpriseInquiries()
  },
  methods: {
    async  m_roleList() {
      const { total, rows } = await roleList(this.page)
      console.log(rows)
      this.page.total = total
      this.list = rows
    },
    pagechange(newpage) {
      // newpage是最新的页码
      this.page.page = newpage
      this.m_roleList()
    },
    async m_EnterpriseInquiries() {
      this.formData = await EnterpriseInquiries(this.companyId)
    },
    // 点击编辑
    async  m_roleDetail(id) {
      this.ruleForm = await roleDetail(id)
      this.isShowdig = true
    },
    // 点击删除
    async m_deleteRole(id) {
      // console.log(id)
      try {
        await this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 调用删除接口
        await deleteRole(id)
        this.m_roleList()
        this.$message.success('删除成功')
        if (this.list.length === 1) {
          this.page.page -= 1
          this.m_roleList()
        }
      } catch (error) {
        console.log('取消了')
      }
    },
    // 点击确认
    async btnOk() {
      try {
        await this.$refs.ruleForm.validate()
        // 根据id判断
        if (this.ruleForm.id) {
          // 编辑角色
          // alert('1234')
          await updateRole(this.ruleForm)

          // 更新数据
        } else {
          // 新增角色
          await addRole(this.ruleForm)
        }
        this.m_roleList()
        this.isShowdig = false
        this.$message.success('操作成功')
        this.ruleForm = {}
      } catch (error) {
        // console.log(error)
        console.log(error)
      }
    },
    // 点击取消
    btnCanael() {
      this.ruleForm = {}
      this.isShowdig = false
      this.$refs.ruleForm.resetFields()
    },
    // 分配权限
    async  dealRoot(id) {
      this.listRoot = tranListToTreeDate(await getPermissionList(), '0')
      const { permIds } = await roleDetail(id)
      this.keyId = permIds
      this.dialogVisible = true
      this.roleId = id
    },
    async rootBtn() {
      await grantRoot({ permIds: this.$refs.tree.getCheckedKeys(), id: this.roleId })
      this.dialogVisible = false
      // console.log(this.$refs.tree.getCheckedKeys())
    },
    btnCancel() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      })
      // this.keyId = []
    }
  }
}
</script>

<style>

</style>
