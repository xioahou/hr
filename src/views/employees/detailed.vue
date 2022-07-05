<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="登录账号设置" name="first">
            <el-form ref="form" label-width="80px" :model="form" :rules="rules">
              <el-form-item label="用户名">
                <el-input v-model="form.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="form.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" round size="small" @click="savaUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详细" name="second">
            <!-- is动态组件 -->
            <component :is="userInfoComponents" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息" name="third">
            <component :is="jobComponents" />

          </el-tab-pane>

        </el-tabs>
      </el-card>

    </div>
  </div>
</template>

<script>
import { getUserImg } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import userInfo from './components/user_info.vue'
import JobInfo from './components/job-info.vue'
export default {
  name: 'Detailed',
  components: {
    userInfo,
    JobInfo
  },
  data() {
    return {
      // 动态组件
      userInfoComponents: userInfo,
      jobComponents: JobInfo,
      activeName: 'first',
      userId: this.$route.params.id,
      form: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.m_getUserImg()
  },
  methods: {
    async m_getUserImg() {
      this.form = await getUserImg(this.userId)
    },
    async savaUser() {
      console.log(123321)
      try {
        await this.$refs.form.validate()
        await saveUserDetailById({ ...this.form, password: this.form.password2 })
        this.$message.success('更新成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>

<style>

</style>
