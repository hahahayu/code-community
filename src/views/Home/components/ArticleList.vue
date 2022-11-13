<template>
  <div>
    <!-- 下拉刷新， 最外层 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 底部刷新 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" offset="100">
        <!-- 文章列表 -->
        <ArticleItem v-for="obj in list" :key="obj.art_id" :artObj="obj" @dislike="dislikeFn" @reports="reportsFn" @click.native="itemClickFn(obj.art_id)"></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 问题1. 首次进入网页， created() 和 onLoad() 同时触发，请求的都是最新数据
// onLoad() 中两次数据合并，数据重复，造成 key 重复
// 原因： van-list 组件挂载时默认会判定一次是否触底， 第一页的数据也是网络请求的，标签先挂载
// 解决方案1： list组件添加 :immediate-check="false"
// 解决方案2： 在 onLoad()第一行进行数组长度判断
// 解决方案3： 删除 created() 中的代码

import ArticleItem from '@/components/ArticleItem.vue'
import { getAllArticleListAPI, articleDislikeAPI, articleReportsAPI } from '@/api'
import Notify from '@/ui/Notify.js'

export default {
  components: {
    ArticleItem
  },
  async created () {
    this.getArticleListFn()
  },
  data () {
    return {
      list: [], // 文章列表数据
      loading: false,
      isLoading: false,
      finished: false,
      theTime: new Date().getTime() // 系统时间，用于分页
    }
  },
  props: {
    // list: Array // 文章列表数组
    channelId: Number // 接收频道ID
  },
  methods: {
    // 获取文章列表请求
    async getArticleListFn () {
      const res = await getAllArticleListAPI({
        channel_id: this.channelId,
        timestamp: this.theTime
      })
      this.list = [...this.list, ...res.data.data.results] // 数组合并
      // pre_timestamp  -- 下一段开头那篇文章的时间戳
      // 第一次 系统时间(timestamp) -> 后台返回0-9条数据 -> 携带第10条的pre_timestamp返回值
      // 第二次 （timestamp）->上一次的pre_timestamp返回值（代表从指定时间戳再往后返回10条数据）
      // ...
      this.theTime = res.data.data.pre_timestamp // 获取下一段时间戳

      // 底部加载状态
      this.loading = false
      // 最后一次数据合并完成， 获取完所有数据后 finished = true
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }
      this.isLoading = false // 下拉状态
    },
    // 底部加载事件
    onLoad () {
      if (this.list.length === 0) { // 首次进入不触发
        this.loading = false
        return
      }
      this.getArticleListFn()
    },
    // 下拉刷新
    onRefresh () {
      this.list = []
      this.theTime = new Date().getTime()
      this.getArticleListFn()
    },
    // 反馈-不感兴趣文章
    async dislikeFn (artObj) {
      try {
        await articleDislikeAPI({
          artId: artObj.art_id
        })
        Notify({ type: 'success', message: '反馈成功!' })
      } catch (err) {
        Notify({ type: 'warning', message: '反馈失败：' + err.message })
      }
    },
    // 反馈举报
    async reportsFn (artObj, action) {
      try {
        await articleReportsAPI({
          target: artObj.art_id,
          type: action.value,
          remark: '其他问题的附加说明，还没有写'
        })
        Notify({ type: 'success', message: '举报成功' })
      } catch (err) {
        Notify({ type: 'warning', message: '举报失败' + err.message })
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
