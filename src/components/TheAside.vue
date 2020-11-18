<template>
<div class="sidebar">
  <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#334256" text-color="#ffffff" active-text-color="blue" router>
    <template v-for="item in items">
      <template>
        <el-menu-item :index="item.index" :key="item.index">
          <i :class="item.icon"></i>
          {{item.title}}
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</div>
</template>

<script>
import bus from '../assets/js/bus'
export default {
  data () {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-document',
          index: 'Info',
          title: '系统首页'
        },
        {
          icon: 'el-icon-document',
          index: 'Consumer',
          title: '用户管理'
        },
        {
          icon: 'el-icon-document',
          index: 'Singer',
          title: '歌手管理'
        },
        {
          icon: 'el-icon-document',
          index: 'SongList',
          title: '歌单管理'
        }
      ]
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    // 通过vue的bus机制，进行组件间的通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  name: 'TheAside'
}
</script>

<style scoped>
.sidebar{
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0px;
  background-color: #334256;
  overflow-y: scroll;
}
  .sidebar-el-menu:not(.el-menu--collapse){
    width: 150px;
  }
  /*将滚动条宽度设置为0*/
.sidebar::-webkit-scrollbar{
  width: 0;
}
  .sidebar>ul{
    height: 100%;
  }
</style>
