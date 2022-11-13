<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ artObj.title }}</span>
          <!-- 单图 -->
          <img class="thumb" v-lazy="artObj.cover.images[0]" v-if="artObj.cover.type === 1" />
        </div>
        <!-- 多图片 -->
        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <img class="thumb" v-for="(imgUrl, index) in artObj.cover.images" :key="index" v-lazy="imgUrl" />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ artObj.aut_name }}</span>
            <span>{{ artObj.comm_count }}</span>
            <span>{{ formatTime(artObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross"  @click.stop="show = true" v-if="isShow"/>
        </div>
      </template>
    </van-cell>

    <!-- 反馈面板 -->
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" @cancel="onCancel" @close="closeFn" :cancel-text="cancelText" get-container="body"/>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js' // timeAgo 不能直接使用， 需要通过 Vue
import { firstActions, secondActions } from '@/api/report.js'

export default {
  props: {
    artObj: Object, // 文章对象
    isShow: {
      type: Boolean,
      default: true // 默认值
    }
  },
  methods: {
    formatTime: timeAgo,
    // 反馈面板-点击事件
    onSelect (action, item) {
      // action 返回 {name: 'xxx'}
      // item 返回索引值
      if (action.name === '反馈垃圾内容') {
        // 切换actions数组里面的数据
        this.actions = secondActions
        this.cancelText = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('dislike', this.artObj)
        this.show = false
      } else {
        // 二级反馈
        this.$emit('reports', this.artObj, action)
        this.actions = firstActions
        this.show = false
      }

      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
    },
    // 反馈面板-取消事件
    onCancel () {
      if (this.cancelText === '返回') {
        this.actions = firstActions
        this.cancelText = '取消'
        this.show = true // 点返回不要让弹窗关闭, 点取消文字按钮, 弹窗默认关闭
      }
    },
    // 反馈面板-关闭面板触发事件
    closeFn () {
      this.actions = firstActions
      this.cancelText = '取消'
    }
  },
  data () {
    return {
      show: false, // 反馈面板， 默认隐藏
      actions: firstActions,
      cancelText: '取消'
    }
  }
}
</script>

  <style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
