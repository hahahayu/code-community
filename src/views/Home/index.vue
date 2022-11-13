<template>
  <div>
    <!-- 头部导航 -->
    <div>
      <van-nav-bar fixed>
        <template v-slot:left>
          <span class="logo">Logo</span>
        </template>
        <template #right>
          <!-- search 图标 -->
          <!-- postcss 只能翻译style里css样式代码,标签内样式无法进行 px->rem,需要手动计算 -->
          <van-icon name="search" size="0.48rem" color="#fff" @click="moveSearchFn"/>
        </template>
      </van-nav-bar>
    </div>
    <!-- 标签导航 -->
    <div class="tab">
      <!--
        sticky 设置粘性布局
        每个 van-tab 代表一个标签导航，中间夹着的内容，对应下属列表内容
        每个 van-tab 都独立对应自己的ArticleList， 第一次切换到对应频道时，才会创建ArticleList组件， 第二次是 显示/隐藏
        （1）v-model 关联频道 ID
      -->
      <!--
        @change="channelChangeFn"   --  该方法已去掉
        （2）点击 tab 标签页 @change 触发，会重新发生请求，获取新数据，多个ArticleList用的同一个数组，相互之间会影响
            解决： 将列表、请求、数组分别放入ArticleList内部（自己请求自己的数据）
                  这里只传入频道ID给ArticleList
      -->
      <!-- offset-top="44px" , 这个位置用 1.226667rem 有BUG -->
      <van-tabs class="tabs" v-model="channelId" sticky offset-top="44px" @change="channelChangeFn">
        <van-tab v-for="obj in userChannelList" :key="obj.id" :title="obj.name" :name="obj.id">
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 （+） -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="showPopup"/>
      <!-- + 弹出层 -->
      <van-popup class="channel_popup" v-model="show" get-container="body">
        <ChannelEdit
        @changeChannel="changeChannelFn"
        @removeChannel="removeChannelFn"
        @addChannel="addChannelFn"
        @close="show = false"
        :userList="userChannelList"
        :unCheckList="unCheckChannelList">
      </ChannelEdit>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'

export default {
  name: 'Home',
  data () {
    return {
      channelId: 0, // tab导航-激活索引-- 关联频道ID
      userChannelList: [], // 用户频道列表
      allChannelList: [], // 所有频道列表
      show: false, // 弹出层， 默认隐藏
      channelScrollTObj: {} // 保存每个频道的滚动位置
    }
  },
  async created () {
    // 获取用户频道
    const resUser = await getUserChannelsAPI()
    this.userChannelList = resUser.data.data.channels

    // 获取所有频道
    const resAll = await getAllChannelsAPI()
    this.allChannelList = resAll.data.data.channels
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  methods: {
    // tabs 切换事件
    channelChangeFn () {
      // 设置滚动条位置
      // tab 切换时，这个组件内部会把切走的容器height设置为0，滚动条因为没有高度回到了顶部
      // 切回来的一瞬间没有高度， 设置滚动位置不生效
      // 让DOM更新完毕后再设置滚动位置
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollTObj[this.channelId]
        document.body.scrollTop = this.channelScrollTObj[this.channelId]
      })
    },
    // + 号小图标状态
    showPopup () {
      this.show = true
    },
    // 添加频道
    async addChannelFn (obj) {
      this.userChannelList.push(obj)
      // 推荐频道不进行传递
      const newArr = this.userChannelList.filter(obj => obj.id !== 0)
      // 数组里对象字段转换， 接口要求传递 id 和 顺序seq，对象里的值是 id 和 name
      const resultNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj } // 浅拷贝（让对象和原数组脱离关系）
        delete newObj.name // 删除对象里name键值对
        newObj.seq = index + 1
        return newObj
      })
      await updateChannelAPI({
        channels: resultNewArr
      })
      // -------------------------------------------------------------
      // 接口已经优化， 上面添加频道的代码可以直接用下面 3 行代替
      // await updateChannelAPI({
      //   channels: this.userChannelList
      // })
      // -------------------------------------------------------------
    },
    // 删除频道
    async removeChannelFn (obj) {
      const index = this.userChannelList.findIndex(item => item.id === obj.id)
      // splice(index,howmany) ——> 删除从index位置开始的数，howmany为删除的个数
      this.userChannelList.splice(index, 1)
      await updateChannelAPI({
        channels: this.userChannelList
      })
    },
    // 切换频道
    changeChannelFn (obj) {
      this.channelId = obj.id // 传过来的频道ID, 影响tabs默认v-model的选择
    },
    // 跳转到 Search 搜索路由
    moveSearchFn () {
      this.$router.push('/search')
    },
    // 保存滚动条位置
    scrollFn () {
      this.$route.meta.scrollT = document.documentElement.scrollTop || document.body.scrollTop
      // 保存当前频道的滚动距离, 动态变量用 []
      this.channelScrollTObj[this.channelId] = document.documentElement.scrollTop || document.body.scrollTop
    }
  },
  computed: {
    unCheckChannelList () {
      // 把所有频道数组对象挨个取出，去用户已选频道数组里面查找，如果找不到，则filter方法收集到一个新数组
      return this.allChannelList.filter(bigObj => {
        const index = this.userChannelList.findIndex(smallObj => {
          return smallObj.id === bigObj.id
          // findIndex() :true, 返回值为索引值 index, 如果没有符合条件的元素返回 -1
        })

        //  index为false 则，filter为true
        if (index !== -1) {
          return false
        } else {
          return true
        }
        // 代码简写
        // return this.allChannelList.filter(bigObj => this.userChannelList.findIndex(smallObj => smallObj.id === bigObj.id) === -1)
      })
    }
  },
  // 激活 - 触发事件
  activated () {
    window.addEventListener('scroll', this.scrollFn)
    // window 和 document，监听网页滚动事件
    // html标签获取scrollTop滚动的距离，和设置滚动的位置

    // 设置滚动条位置
    document.documentElement.scrollTop = this.$route.meta.scrollT
    document.body.scrollTop = this.$route.meta.scrollT
  },
  // 失活 - 移除事件
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped lang="less">
.logo {
  color: #fff;
  font-size: 18px;
  width: 10px;
  height: 30px;
}

.tab {
  padding-top: 46px;
}

// 设置 tabs 容器的样式
::v-deep .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置 + 小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}

.channel_popup {
  width: 100vw;
  height: 100vh;
}
</style>
