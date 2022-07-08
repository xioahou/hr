<template>
  <div>
    <el-upload list-type="picture-card" :on-preview="preview" :limit="1" :file-list="fileList" action="#" :class="{disabled:fileComputed}" :on-remove="removeFile" :on-change="changeFile" :before-upload="beforeFile" :http-request="upload">
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
    <!-- 进度条 -->
    <el-progress v-if="showprogress" :percentage="percentage" style="width:180px" />
  </div>
</template>
<script>
// 引入腾讯云
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDTjkV0C8mBKBlFfqnVx84kAJBn9E2btvh', // 身份id
  SecretKey: 'auxkGZeS0HI3WijU0GG0TfbGhtphJfkY' // 身份密钥
})
export default {
  name: 'Upload',
  data() {
    return {
      fileList: [],
      imgUrl: '',
      dialogVisible: false,
      currentUid: null,
      percentage: 0,
      showprogress: false
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      console.log(file)
      this.imgUrl = file.url
      this.dialogVisible = true
    },
    removeFile(file) {
    //   console.log(fileList)
      console.log(file)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    changeFile(file, fileList) {
      console.log(fileList)
      this.fileList = fileList.map(item => item)
    },
    beforeFile(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('格式不正确')
        return false
      }
      // 1M=1024kb 1kb=1024b
      const maxSize = 1024 * 1024 * 5
      if (file.size > maxSize) {
        this.$message.error('文件不能大于5M')
        return false
      }
      this.currentUid = file.uid
      this.showprogress = true
      return true
    },
    // 上传文件
    upload(params) {
    //   console.log(params)
    // 部署腾讯云
      cos.putObject({
        Bucket: 'xiaohou001-1312795403', // 存储桶名称
        Region: 'ap-chengdu', // 服务器所在地
        Key: params.file.name,
        StorageClass: 'STANDARD',
        Body: params.file,
        // 定义进度回调函数
        onProgress: (params) => {
          console.log(params)
          this.percentage = params.percent * 100
        }
      }, (err, data) => {
        console.log(err || data)
        // ~~ !err表示并且没有错误且statusCode等于200
        if (!err && data.statusCode === 200) {
          this.fileList = this.fileList.map(item => {
            if (item.uid === this.currentUid) {
              // 数据回血
              return { url: 'http://' + data.Location, upload: true }
              // 这个upload：true为后期埋伏笔
            }
            return item
          })
        }
        setTimeout(() => {
          this.showprogress = false
          this.percentage = 0
        }, 1000)
      })
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
    display: none;
}
</style>
