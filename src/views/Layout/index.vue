<template>
  <div>
    <!-- 套一层 div, 并防止二级页面内容被底部导航挡住 -->
    <div class="home_container">
        <!-- 二级路由 -->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
    </div>
    <!-- 底部导航 -->
    <div>
      <van-tabbar v-model="active" routo>
        <van-tabbar-item icon="home-o" to="/layout/home">首页</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/layout/user">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style scoped lang="less">
.home_container {
    padding-bottom: 50px;
}
.van-tabbar {
    border-top: 1px solid #f8f8f8;
}
</style>
