<template>
  <div>
      <the-header></the-header>
      <the-aside></the-aside>
    <!--将router-view的内容外加一个div 保证view的内容显示出来，不会被left覆盖-->
    <!--使用class变化，做到缩放的时候，字会跟着走-->
      <div class="content-box" :class="{'content-collapse':collapse}">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
import TheHeader from './TheHeader'
import TheAside from './TheAside'
import bus from '../assets/js/bus'
export default {
  components: {
    TheHeader,
    TheAside
  },
  data () {
    return {
      collapse: false
    }
  },
  created () {
    // 通过vue的bus机制，进行组件间的通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  name: 'Home'
}
</script>

<style scoped>

</style>
