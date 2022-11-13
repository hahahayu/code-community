<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
    </div>
    <!-- 搜索结果 -->
    <div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <!-- 事件修饰符 .nataive -> 给组件内根标签，绑定原生click -->
        <ArticleItem
        v-for="obj in articleList"
        :key="obj.art_id"
        :artObj="obj"
        :isShow="false"
        @click.native="itemClickFn(obj.art_id)"
        >
        </ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { searchResultListAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'

export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1, // 页面
      articleList: [], // 文章列表数据
      loading: false, // 加载状态
      finished: false // 全部加载完成状态
    }
  },
  components: {
    ArticleItem
  },
  // 搜索结果数据
  async created () {
    const res = await searchResultListAPI({
      page: this.page,
      q: this.$route.params.kw // 拿到关键词, kw来源于router/index.js定义的动态路由参数名
    })
    this.articleList = res.data.data.results
  },
  methods: {
    async onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        const res = await searchResultListAPI({
          page: this.page,
          q: this.$route.params.kw // 拿到关键词, kw来源于router/index.js定义的动态路由参数名
        })
        if (res.data.data.results.length === 0) {
          // 没有更多数据了
          this.finished = true
          return
        }
        this.articleList = [...this.articleList, ...res.data.data.results]
        this.loading = false
      }
    },
    // 文章单元格-跳转到详情
    itemClickFn (id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
