<template>
  <div class="table">
    <div class="crumbs" style="text-align: center;">
      <i class="el-icon-tickets"></i>歌单歌曲信息
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delALL">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="请输入歌曲名" class="handle-input">

        </el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible =true">添加歌曲</el-button>
      </div>
    </div>

    <el-table size="mini" ref="multipleTable" border style="width: 100%" height="670px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="歌曲图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="song-img">
            <img :src="getUrl(scope.row.pic)" style="width:100%"/>
          </div>
          <div class="play" @click="setSongUrl(scope.row.url,scope.row.name)">
            <div v-if="toggle == scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-zanting"></use>
              </svg>
            </div>

            <div v-if="toggle != scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-bofanganniu"></use>
              </svg>
            </div>
          </div>
          <!--<el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">-->
          <!--<el-button size="mini">更新图片</el-button>-->
          <!--</el-upload>-->
        </template>
      </el-table-column>

      <el-table-column prop="name" label="歌手-歌名" width="120" align="center"></el-table-column>
      <!--专辑-->
      <el-table-column prop="introduction" label="专辑" width="150" align="center"></el-table-column>

      <!--歌词管理-->
      <el-table-column label="歌词"  align="center">
        <template slot-scope="scope">
          <ul style="height: 100px;overflow: scroll">
            <li v-for="(item,index) in parseLyric(scope.row.lyric)" :key="index">
              {{item}}
            </li>
          </ul>
        </template>
      </el-table-column>

      <el-table-column label="资源更新"  align="center">
        <template slot-scope="scope">
          <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">
            <el-button size="mini" type="primary" round>更新图片</el-button>
          </el-upload>
          <br/>
          <el-upload :action="uploadSongUrl(scope.row.id)" :before-upload="beforeSongUpload" :on-success="handleSongSuccess">
            <el-button size="mini" type="primary" round>更新歌曲</el-button>
          </el-upload>
        </template>
      </el-table-column>

      <!--修改功能-->
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelet(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableData.length"
        @current-change="handleCurrentChange"
      >

      </el-pagination>
    </div>

    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
        <div>
          <label>歌名</label>
          <el-input type="text" name="name"></el-input>
        </div>
        <div>
          <label>专辑</label>
          <el-input type="text" name="introduction"></el-input>
        </div>
        <div>
          <label>歌词</label>
          <el-input type="textarea" name="lyric"></el-input>
        </div>
        <div>
          <label>歌曲上传</label>
          <input type="file" name="file">
        </div>
      </el-form>
      <span slot="footer">
      <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
      <el-button size="mini" @click="addSong">确认上传</el-button>
    </span>
    </el-dialog>

    <el-dialog title="修改歌曲" :visible.sync="editVisible" width="400px" center>
      <el-form :model="Form" ref="Form" label-width="80px">

        <el-form-item prop="name" label="歌手-歌名" size="mini">
          <el-input v-model="Form.name" placeholder="歌手-歌名"></el-input>
        </el-form-item>

        <el-form-item prop="introduction" label="专辑" size="mini">
          <el-input v-model="Form.introduction" placeholder="专辑"></el-input>
        </el-form-item>
        <el-form-item prop="lyric" label="歌词" size="mini">
          <el-input v-model="Form.lyric" placeholder="歌词" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button size="mini" @click="editVisible = false">取消</el-button>
      <el-button size="mini" @click="editSave">确认上传</el-button>
    </span>
    </el-dialog>

    <el-dialog title="删除歌曲" :visible.sync="delVisible" width="400px" center>
      <div align="center">确认删除嘛</div>
      <span slot="footer">
      <el-button size="mini" @click="delVisible = false">取消</el-button>
      <el-button size="mini" @click="deleteRow">确认删除</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import {mixin} from '../mixins'
import {mapGetters} from 'vuex'
import '@/assets/js/iconfont.js'
import {songOfSingerId, updateSong, delSong} from '../api'

export default {
  mixins: [mixin],
  data () {
    return {
      singerId: '', // 歌手ID
      singerName: '', // 歌手名i
      centerDialogVisible: false, // 添加弹窗是否显示
      editVisible: false, // 编辑弹窗是否显示
      delVisible: false, // 删除弹框是否显示
      registerForm: { // 添加框
        name: '',
        singerName: '',
        introduction: '',
        lyric: ''
      },
      Form: { // 编辑框
        id: '',
        name: '',
        introduction: '',
        lyric: ''
      },
      tableData: [],
      tempData: [],
      select_word: '',
      pageSize: 5, // 分页每页大小
      currentPage: 1, // 当前页码
      idx: -1, // 当前选择项=
      multipleSelection: [], // 批量删除- 记录哪些选项已经打勾
      toggle: false // 播放器的图标状态
    }
  },
  computed: {
    ...mapGetters([
      'isPlay'
    ]),
    // 计算当前搜索结果表里的数据
    data () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  watch: {
    // 搜索框里面的内容发生变化的时候，搜索结果table列表的内容跟着变化
    select_word: function () {
      if (this.select_word === '') {
        this.tableData = this.tempData
      } else {
        this.tableData = []
        for (let item of this.tempData) {
          if (item.name.includes(this.select_word)) {
            this.tableData.push(item)
          }
        }
      }
    }
  },
  created () {
    this.singerId = this.$route.query.id
    this.singerName = this.$route.query.name
    this.getData()
  },
  destroyed () {
    this.$store.commit('setIsPlay', false)
  },
  methods: {
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },

    // 查询所有歌手
    getData () {
      this.tempData = []
      this.tableData = []
      let params = new URLSearchParams()
      params.append('singerId', this.singerId)
      // let params = this.singerId
      songOfSingerId(params).then(res => {
        this.tempData = res
        this.tableData = res
        this.currentPage = 1
      })
    },
    // 添加歌曲函数
    addSong () {
      let _this = this
      var form = new FormData(document.getElementById('tf'))
      form.append('singerId', this.singerId)
      form.set('name', this.singerName + '-' + form.get('name'))
      if (!form.get('lyric')) {
        form.set('lyric', '[00:00:00]暂无歌词')
      }
      var req = new XMLHttpRequest()
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          let res = JSON.parse(req.response)
          if (res.code) {
            _this.getData()
            _this.registerForm = {}
            _this.notify(res.msg, 'success')
          } else {
            _this.notify('保存失败', 'error')
          }
        }
      }
      req.open('post', `${_this.$store.state.HOST}/song/add`, false)
      req.send(form)
      _this.centerDialogVisible = false
    },

    // 编辑歌手信息
    handleEdit (row) { // 弹出编辑页面
      this.editVisible = true
      this.Form = {
        id: row.id,
        name: row.name,
        introduction: row.introduction,
        lyric: row.lyric
      }
    },
    editSave () { // 保存编辑页面的数据
      let params = new URLSearchParams()
      params.append('id', this.Form.id)
      params.append('name', this.Form.name)
      params.append('introduction', this.Form.introduction)
      params.append('lyric', this.Form.lyric)
      updateSong(params)
        .then(res => {
          if (res.code === 1) {
            this.getData()
            this.notify('修改成功', 'success')
          } else {
            this.notify('修改失败', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.editVisible = false
    },

    // 更新图片
    uploadUrl (id) {
      return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
    },
    // 删除一名歌手
    deleteRow () {
      let params = new URLSearchParams()
      params.append('id', this.idx)
      delSong(params)
        .then(res => {
          if (res) {
            this.getData()
            this.notify('删除成功', 'success')
          } else {
            this.notify('删除失败', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.delVisible = false
    },

    // 解析歌词
    parseLyric (text) {
      let lines = text.split('\n') // 一行行
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g
      let result = []
      // 通过便利，删除歌词前的时间
      for (let item of lines) {
        let value = item.replace(pattern, '')
        result.push(value)
      }
      return result
    },
    // 上传歌曲之前的校验
    beforeSongUpload (file) {
      var testMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (testMsg !== 'mp3') {
        this.$message({
          message: '上传文件只能是mp3格式',
          type: 'error'
        })
        return false
      }
      return true
    },

    // 上传图片成功之后要做什么
    handleSongSuccess (res, file) {
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

    // 更新歌曲Url
    uploadSongUrl (id) {
      return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
    },
    // 切换播放歌曲
    setSongUrl (url, name) {
      this.toggle = name
      this.$store.commit('setUrl', this.$store.state.HOST + url)
      if (this.isPlay) {
        this.$store.commit('setIsPlay', false)
      } else {
        this.$store.commit('setIsPlay', true)
      }
    }
    // 切换页面 歌曲暂停

  },
  name: 'SingerPage'
}
</script>

<style scoped>
  .handle-box{
    margin-bottom: 20px;
  }
  .song-img{
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
  }
  .handle-input{
    width: 300px;
    display: inline-block;
  }
  .pagination{
    display: flex;
    justify-content: center;
  }
  .play{
    position: absolute;
    z-index: 5;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    top: 18px;
    left: 15px;
  }
  .icon{
    width: 2em;
    height: 2em;
    color: green;
    fill: currentColor;
    overflow: hidden;
  }
</style>
