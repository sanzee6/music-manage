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

    <el-table size="mini" ref="multipleTable" border style="width: 100%" height="670px" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>

      <el-table-column prop="name" label="歌手-歌名"  align="center"></el-table-column>

      <!--修改功能-->
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelet(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<div class="pagination">-->
      <!--<el-pagination-->
        <!--background-->
        <!--layout="total,prev,pager,next"-->
        <!--:current-page="currentPage"-->
        <!--:page-size="pageSize"-->
        <!--:total="tableData.length"-->
        <!--@current-change="handleCurrentChange"-->
      <!--&gt;-->

      <!--</el-pagination>-->
    <!--</div>-->

    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
        <el-form-item prop="singerName" label="歌手" size="mini">
          <el-input v-model="registerForm.singerName" placeholder="歌手名字"></el-input>
        </el-form-item>

        <el-form-item prop="songName" label="歌曲名字" size="mini">
          <el-input v-model="registerForm.songName" placeholder="歌曲名字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
      <el-button size="mini" @click="getSongId">确认上传</el-button>
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
import '@/assets/js/iconfont.js'
import {listSongDetail, songOfSongId, songOfSongName, listSongAdd, delListSong} from '../api'

export default {
  mixins: [mixin],
  data () {
    return {
      // singerId: '', // 歌手ID
      // singerName: '', // 歌手名i
      centerDialogVisible: false, // 添加弹窗是否显示
      delVisible: false, // 删除弹框是否显示
      registerForm: { // 添加框
        singerName: '', // 歌手名字
        songName: '' // 歌曲名字
      },
      tableData: [],
      tempData: [],
      select_word: '',
      pageSize: 5, // 分页每页大小
      currentPage: 1, // 当前页码
      idx: -1, // 当前选择项=
      multipleSelection: [], // 批量删除- 记录哪些选项已经打勾
      toggle: false, // 播放器的图标状态
      songListId: '' // 歌单ID
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
    this.songListId = this.$route.query.id
    this.getData()
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
      listSongDetail(this.songListId).then(res => {
        res.forEach((item) => {
          this.getSong(item.songId)
        })
      })
    },
    // 根据歌曲id查询歌曲对象，并放到tempData，tableData
    getSong (id) {
      let params = new URLSearchParams()
      params.append('songId', id) // 146
      songOfSongId(params)
        .then(res => {
          this.tempData.push(res)
          this.tableData.push(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 添加歌曲前的准备，获取到歌曲ID
    getSongId () {
      let _this = this
      var songOfName = _this.registerForm.singerName + '-' + _this.registerForm.songName
      let params = new URLSearchParams()
      params.append('songName', songOfName)
      songOfSongName(params).then(
        res => {
          // console.log(res)
          _this.addSong(res[0].id)
        }
      )
    },
    // 添加歌曲函数
    addSong (songId) {
      let _this = this
      let params = new URLSearchParams()
      params.append('songId', songId)
      params.append('songListId', this.songListId)

      listSongAdd(params)
        .then(res => {
          if (res.code === 1) {
            this.getData()
            this.notify('添加成功', 'success')
          } else {
            this.notify('添加失败', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
      _this.centerDialogVisible = false
    },
    // 删除一首歌曲
    deleteRow () {
      delListSong(this.idx, this.songListId)
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
    }

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
