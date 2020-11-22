<template>
    <div>
      <!--//gutter 间距-->
      <el-row :gutter="20" class="mgb20">
        <el-col :span="6">
          <el-card>
            <div class="grid-content">
              <div class="grid-cont-center">
                <div style="font-size: 30px;font-weight: bold">{{consumerCount}}</div>
                <div>用户总数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="grid-content">
              <div class="grid-cont-center">
                <div style="font-size: 30px;font-weight: bold">{{songCount}}</div>
                <div>歌曲总数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="grid-content">
              <div class="grid-cont-center">
                <div style="font-size: 30px;font-weight: bold">{{singerCount}}</div>
                <div>歌手总数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="grid-content">
              <div class="grid-cont-center">
                <div style="font-size: 30px;font-weight: bold">{{songListCount}}</div>
                <div>歌单总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mgb20">
        <el-col :span="12">
          <h3 style="text-align: center;margin-bottom: 10px">用户性别比例</h3>
          <div style="background-color: white">
            <ve-pie :data="consumerSex"></ve-pie>
          </div>
        </el-col>

        <el-col :span="12">
          <h3 style="text-align: center;margin-bottom: 10px">歌曲类型分布</h3>
          <div style="background-color: white">
            <!--柱状图-->
            <ve-histogram :data="songStyle"></ve-histogram>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mgb20">
        <el-col :span="12">
          <h3 style="text-align: center;margin-bottom: 10px">歌手性别比例</h3>
          <div style="background-color: white">
            <ve-pie :data="singerSex"></ve-pie>
          </div>
        </el-col>

        <el-col :span="12">
          <h3 style="text-align: center;margin-bottom: 10px">歌手地区分布</h3>
          <div style="background-color: white">
            <!--柱状图-->
            <ve-histogram :data="country"></ve-histogram>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import {getAllConsumer, allSong, getAllSinger, getAllSongList} from '../api/index'
export default {
  data () {
    return {
      consumerCount: 0, // consumer
      songCount: 0, // song
      singerCount: 0, // singer
      songListCount: 0, // songList 歌单
      consumer: [], // 所有用户的
      consumerSex: { // 按性别分类的用户数量
        columns: ['性别', '总数'],
        rows: [
          {'性别': '男', '总数': 0},
          {'性别': '女', '总数': 0}
        ]
      },
      songStyle: { // 按歌单风格分类
        columns: ['风格', '总数'],
        rows: [
          {'风格': '说唱', '总数': 0},
          {'风格': '流行', '总数': 0},
          {'风格': '华语', '总数': 0},
          {'风格': '欧美', '总数': 0},
          {'风格': '日韩', '总数': 0}
        ]
      },
      singerSex: { // 按性别分类的歌手数
        columns: ['性别', '总数'],
        rows: [
          {'性别': '女', '总数': 0},
          {'性别': '男', '总数': 0},
          {'性别': '组合', '总数': 0},
          {'性别': '未知', '总数': 0}
        ]
      },
      country: {
        columns: ['国籍', '总数'],
        rows: [
          {'国籍': '中国', '总数': 0},
          {'国籍': '韩国', '总数': 0},
          {'国籍': '日本', '总数': 0},
          {'国籍': '美国', '总数': 0},
          {'国籍': '新加坡', '总数': 0},
          {'国籍': '泰国', '总数': 0}
        ]
      }
    }
  },
  created () {
    // 页面加载时就开始执行
  },
  mounted () {
    // 页面元素加载完成开始执行
    this.getConsumer()
    this.getSong()
    this.getSinger()
    this.getSongList()
  },
  methods: {
    getConsumer () { // 用户总数
      getAllConsumer().then(res => {
        this.consumer = res
        this.consumerCount = res.length
        this.consumerSex.rows[0]['总数'] = this.setSex(1, this.consumer)
        this.consumerSex.rows[1]['总数'] = this.setSex(0, this.consumer)
      })
    },
    setSex (sex, val) { // 根据性别获取用户数
      let count = 0
      for (let item of val) {
        if (sex === item.sex) {
          count++
        }
      }
      return count
    },
    getSong () { // 歌曲总数
      allSong().then(res => {
        this.songCount = res.length
      })
    },
    getSinger () { // 歌手总数
      getAllSinger().then(res => {
        this.singerCount = res.length
        this.singerSex.rows[0]['总数'] = this.setSex(0, res)
        this.singerSex.rows[1]['总数'] = this.setSex(1, res)
        this.singerSex.rows[2]['总数'] = this.setSex(2, res)
        this.singerSex.rows[3]['总数'] = this.setSex(3, res)
        for (let item of res) {
          this.getByCountry(item.location)
        }
      })
    },
    getSongList () { // 歌单总数
      getAllSongList().then(res => {
        this.songListCount = res.length
        for (let item of res) {
          this.getByStyle(item.style)
        }
      })
    },
    getByStyle (style) { // 根据歌单风格获取数量
      for (let item of this.songStyle.rows) {
        if (style.includes(item['风格'])) {
          item['总数']++
        }
      }
    },
    getByCountry (location) { // 根据国际获取数量
      for (let item of this.country.rows) {
        if (location.includes(item['国籍'])) {
          item['总数']++
        }
      }
    }
  },
  name: 'InfoPage'
}
</script>

<style scoped>
.grid-content{
  display: flex;
  align-items: center;
  height: 50px;
}
  .grid-cont-center{
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: burlywood;
  }
</style>
