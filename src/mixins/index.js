export const mixin = {
  methods: {
    // 提示信息
    notify (title, type) {
      this.$notify({
        title: title,
        type: type
      })
    },

    // 根据相对地址获取绝对地址
    getUrl (url) {
      return `${this.$store.state.HOST}/${url}`
    },

    // 获取性别中午
    changeSex (value) {
      if (value === 0) {
        return '女'
      }
      if (value === 1) {
        return '男'
      }
      if (value === 2) {
        return '组合'
      }
      if (value === 3) {
        return '未知'
      }
      return value
    },

    // 获取生日
    attachBirth (value) {
      return String(value).substr(0, 10)
    },

    // 上传图片之前的校验
    beforeAvatorUpload (file) {
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')
      if (!isJPG) {
        this.$message.error('只能上传JPG或PNG格式')
        return false
      }
      const isLt2M = (file.size / 1024 / 1024) < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能大于2M')
        return false
      }
      return true
    },

    // 上传图片成功之后要做什么
    handleAvatorSuccess (res, file) {
      let _this = this
      if (res.code === 1) {
        _this.getData()
        _this.$notify({
          title: '恭喜,上传成功',
          type: 'success'
        })
      } else {
        _this.$notify({
          title: '恭喜,上传失败',
          type: 'error'
        })
      }
    },

    // 弹出删除窗口
    handleDelet (id) {
      this.idx = id
      this.delVisible = true
    },
    // 把已经选择的项赋值给 multipleSelection
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 批量删除已经选择的项
    delALL () {
      for (let item of this.multipleSelection) {
        this.handleDelet(item.id)
        this.deleteRow()
      }
      this.multipleSelection = []
    }

  }
}
