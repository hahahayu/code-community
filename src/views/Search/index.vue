<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search
      @search="enterFn"
      v-model.trim="kw"
      @input="inputFn"
      v-searchFocus
      placeholder="请输入搜索关键词"
      background="#007BFF"
      shape="round" />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
      @click="suggestClickFn(str)"
      class="sugg-item"
      v-for="(str, index) in suggestList"
      :key="index"
      v-html="lightFn(str, kw)">
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
        @click="historyClickFn(str)"
        class="history-item"
         v-for="(str, index) in history"
         :key="index">
         {{str}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api'
import { lightFn } from '@/utils/str'
import { getStorage, setStorage } from '@/utils/storage'

export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null, // 防抖, 用的定时器
      suggestList: [], // 建议关键字列表
      lightFn, // key和value变量名同名
      history: JSON.parse(getStorage('his')) || [] // 搜索历史
    }
  },
  methods: {
    inputFn () {
      // 防抖，延时执行逻辑代码，事件再次触发时，清楚上一个定时器
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (this.kw.length === 0) {
          // 空内容触发下面逻辑
          this.suggestList = []
        } else {
          // console.log(this.kw)
          const res = await suggestListAPI({
            keywords: this.kw
          })
          // console.log(res)
          this.suggestList = res.data.data.options
        }
      }, 500)
    },
    // 输入框回车
    enterFn () {
      if (this.kw.length !== 0) {
        this.history.push(this.kw) // 保存搜索关键字
        // ES6 新增 Set， 传入数组类型->去重->返回无重复的Set对象， 如果值是对象，比较的是内存地址
        // Set类型对象->Array.from()->转回数组类型
        this.history = Array.from(new Set(this.history)) // 去重

        // 跳转页面会销毁组件，watch还未来的及执行，加setTimeout,让跳转最后执行
        setTimeout(() => {
          this.$router.push({
            path: `/search_result/${this.kw}`
          })
        })
      }
    },
    // 建议列表点击
    suggestClickFn (str) {
      this.history.push(str) // 保存搜索关键字
      this.history = Array.from(new Set(this.history)) // 去重

      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${str}`
        })
      })
    },
    // 历史记录点击
    historyClickFn (str) {
      this.$router.push({
        path: `/search_result/${str}`
      })
    },
    // 清空搜索历史
    clearFn () {
      this.history = [] // watch会触发, 把空数组保存到本地
    }
  },
  watch: {
    // 本地缓存history数组
    history: {
      deep: true,
      handler () {
        // 覆盖式保存到本地
        setStorage('his', JSON.stringify(this.history))
      }
    }
  }
}
</script>

  <style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}

/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
