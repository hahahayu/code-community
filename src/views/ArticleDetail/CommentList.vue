<!-- 评论组件 -->
<template>
  <div>
    <!-- 评论列表 -->
    <!-- 写法二： :class="isShowCmtInput ? 'art-cmt-container-2' : 'art-cmt-container-1'" -->
    <div class="cmt-list" :class="{'art-cmt-container-1': !isShowCmtInput, 'art-cmt-container-2': isShowCmtInput}">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in commentList" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar">
              <span class="uname">{{obj.aut_name}}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="obj.is_liking === true" @click="loveFn(true, obj)" />
              <van-icon name="like-o" size="16" color="gray" v-else @click="loveFn(false, obj)" />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{obj.content}}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{timeAgo(obj.pubdate)}}</div>
        </div>
      </van-list>
    </div>

    <!-- 发表评论的容器 -->
    <div>
      <!-- 底部添加评论区域 - 1（短） -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmtInput === false">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="isShowCmtInput = true">发表评论</div>
        <div class="icon-box">
          <!-- 评论图标 -->
          <van-badge :content="totalCount" :max="99">
            <van-icon name="comment-o" size="0.53333334rem" @click="moveFn" />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2（高） -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵" v-model.trim="comValue" v-searchFocus @blur="blurFn"></textarea>
        <van-button type="default" :disabled="comValue.length === 0" @click="sendFn">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { commentListAPI, commentLikingAPI, commentDisLikingAPI, sendCommentAPI } from '@/api'
import { timeAgo } from '@/utils/date'
export default {
  data () {
    return {
      offset: null, // 偏移量评论id
      commentList: [], // 评论数据
      isShowCmtInput: false, //  评论区域状态
      totalCount: '', // 评论总数(后台返回)
      comValue: '', // 评论内容
      loading: false, // 底部加载状态
      finished: false, // 底部是否加载完成
      lastId: null // 分页
    }
  },
  async created () {
    const res = await commentListAPI({
      artId: this.$route.query.art_id // 文章id
    })
    this.commentList = res.data.data.results
    this.totalCount = res.data.data.total_count || '' // 如果无评论数(0),给空字符串(防止0微标出现)
    this.lastId = res.data.data.last_id // 分页
    // 网页打开，没有评论
    if (res.data.data.results.length === 0) {
      this.finished = true
    }
  },
  methods: {
    timeAgo,
    // 文章状态
    async loveFn (bool, obj) {
      if (bool === true) {
        // 点了 “红心”  --> 取消红心
        obj.is_liking = false
        await commentDisLikingAPI({
          comId: obj.com_id
        })
      } else {
        // 点了 “灰心” --> 点亮红心
        obj.is_liking = true
        await commentLikingAPI({
          comId: obj.com_id
        })
      }
    },
    // 评论滑动
    moveFn () {
      // 真实DOM都在document(所以不再一个vue文件内), 也是可以获取的
      // scrollIntoView()方法将调用它的元素滚动到浏览器窗口的可见区域。
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
      // ------------------------ 评论够长的情况下 ---------------------------------
      // js 动画， 计时器间隔时间，修改目标状态
      // const now = window.scrollY // 获取当前评论已经滚出的Y值
      // const dist = document.querySelector('.article-container').offsetHeight // 文章高度
      // const step = (dist - now) / 10 //  剩余要走的值/10  -- 步长递减
      // setTimeout(() => {
      //   if (step < 1) { // 判断是否滚动结束
      //     window.scrollTo(0, dist)
      //     return
      //   }
      //   window.scrollTo(0, now + step)
      //   this.moveFn() // 递归
      // }, 10)
    },
    // 输入框 - 失去焦点
    blurFn () {
      setTimeout(() => {
        // 先失去焦点了, 用v-if, DOM移除, 发布按钮 - 点击事件 未来的及触发, 解决: 失去焦点, 延时执行
        this.isShowCmtInput = false
      }, 0)
    },
    // 发布按钮 - 点击事件
    async sendFn () {
      const res = await sendCommentAPI({
        id: this.$route.query.art_id, // 文章id
        content: this.comValue
      })
      this.commentList.unshift(res.data.data.new_obj)
      this.totalCount++ // 评论总数量+1
      this.comValue = '' // 成功后, 清除输入框内容
      this.moveFn() // 让第一条评论滚动到屏幕上
    },
    // 底部加载更多
    async onLoad () {
      if (this.commentList.length > 0) {
        const res = await commentListAPI({
          artId: this.$route.query.art_id, // 文章id
          offset: this.lastId
        })
        this.commentList = [...this.commentList, ...res.data.data.results]
        this.totalCount = res.data.data.total_count || '' // 如果无评论数(0),给空字符串(防止0微标出现)
        this.lastId = res.data.data.last_id // 分页
        if (res.data.data.last_id === null) {
        // 没有下一页
          this.finished = true
        }
        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
