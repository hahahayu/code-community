<template>
  <!-- 文章详情组件 -->
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <!-- loading 组件 -->
    <van-loading color="#1989fa" v-if="Object.keys(artObj).length === 0">加载中ing...</van-loading>

    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{artObj.title}}</h1>

        <!-- 用户信息 -->
        <van-cell center :title="artObj.aut_name" :label="formatDate(artObj.pubdate)">
          <template #icon>
            <img :src="artObj.aut_photo" alt="" class="avatar">
          </template>
          <template #default>
            <div>
              <van-button type="info" size="mini" v-if="artObj.is_followed" @click="followedFn(true)">已关注</van-button>
              <van-button icon="plus" type="info" size="mini" plain v-else @click="followedFn(false)">关注</van-button>
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="artObj.content"></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <!-- attitude: -1-无态度， 0-不喜欢， 1-喜欢 -->
        <div class="like-box">
          <van-button icon="good-job" type="danger" size="small" v-if="artObj.attitude === 1" @click="loveFn(true)">已点赞</van-button>
          <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="loveFn(false)">点赞</van-button>
        </div>
      </div>
      <!-- 文章评论区 -->
      <div>
        <CommentList></CommentList>
      </div>
    </div>
  </div>
</template>

<script>
import { articleDetailAPI, followedUserAPI, unFollowedUserAPI, articleLikeAPI, articleDisLikeAPI } from '@/api'
import { timeAgo } from '@/utils/date.js'
import CommentList from './CommentList.vue'

export default {
  name: 'Detail',
  data () {
    return {
      artObj: {} // 文章对象
    }
  },
  components: {
    CommentList
  },
  // 文章详情数据
  async created () {
    const res = await articleDetailAPI({
      id: this.$route.query.art_id
    })
    this.artObj = res.data.data
  },
  methods: {
    formatDate: timeAgo,
    // 关注/取关按钮
    async followedFn (bool) {
      if (bool === true) {
        // 点在 “已关注按钮上” --> 取关 --> 显示关注按钮
        this.artObj.is_followed = false
        await unFollowedUserAPI({
          uid: this.artObj.aut_id
        })
      } else {
        // 点在 “关注上” --> 关注
        this.artObj.is_followed = true
        await followedUserAPI({
          uid: this.artObj.aut_id
        })
      }
    },
    // 点赞/取消点赞
    async loveFn (bool) {
      if (bool === true) {
        // 点击 “已点赞”  --> 取消点赞
        this.artObj.attitude = 0
        await articleDisLikeAPI({
          artId: this.artObj.art_id
        })
      } else {
        // 点击 “点赞”  --> 点赞
        this.artObj.attitude = 1
        await articleLikeAPI({
          artId: this.artObj.art_id
        })
      }
    }
  }
}
</script>

  <style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

// 加载组件样式
.vant-loading {
  text-align: center;
  padding-top: 46px;
}
</style>
