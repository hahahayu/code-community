<template>
    <div>
      <!-- 弹出层的头部区域 -->
      <van-nav-bar title="频道管理">
        <template #right>
          <!-- x 图标 -->
          <van-icon name="cross" size="0.37333334rem" color="white" @click="closeFn"/>
        </template>
      </van-nav-bar>
      <!-- 我的频道 -->
      <div class="my-channel-box">
        <div class="channel-title">
          <span>我的频道
            <span class="small-title">
              {{ isEdit ? '点击删除频道' : '点击进入频道' }}
            </span>
          </span>
          <span @click="isEdit = !isEdit">{{isEdit ? '完成' : '编辑'}}</span>
        </div>
        <!-- 我的频道列表 -->
        <van-row type="flex">
          <van-col span="6" v-for="obj in userList" :key="obj.id" @click="updateFn(obj)">
            <div class="channel-item van-hairline--surround">
              {{obj.name}}
              <!-- 删除的徽标 -->
              <van-badge color="transparent" class="cross-badge" v-if="isEdit">
                <template #content>
                  <van-icon
                    name="cross"
                    class="badge-icon"
                    color="#cfcfcf"
                    size="0.32rem"
                  />
                </template>
              </van-badge>
            </div>
          </van-col>
        </van-row>
      </div>

      <!-- 更多频道 -->
      <div class="more-channel-box">
        <div class="channel-title">
          <span>点击添加更多频道：</span>
        </div>
        <!-- 更多频道列表 -->
        <van-row type="flex">
          <van-col span="6" v-for="obj in unCheckList" :key="obj.id" @click="addFn(obj)">
            <div class="channel-item van-hairline--surround">{{obj.name}}</div>
          </van-col>
        </van-row>
      </div>
    </div>
  </template>

<script>
export default {
  props: {
    userList: Array, // 用户已选频道
    unCheckList: Array // 用户未选频道
  },
  data () {
    return {
      isEdit: false // 控制编辑状态
    }
  },
  methods: {
    // 新增频道
    addFn (obj) {
      if (this.isEdit === true) {
        this.$emit('addChannel', obj)
      }
    },
    // 删除/切换 频道
    updateFn (obj) {
      if (this.isEdit === true && obj.name !== '推荐') {
        this.$emit('removeChannel', obj)
      } else {
        // 切换频道
        this.$emit('close') // 关闭弹出层
        this.$emit('changeChannel', obj)
      }
    },
    // 关闭弹出层
    closeFn () {
      this.$emit('close')
      this.isEdit = false // 重置编辑状态， 或者在父组件中的<van-popup>使用 ref(获取对象) 重置编辑状态
    }
  }
}
</script>

  <style scoped lang="less">
  .van-popup,
  .popup-container {
    background-color: transparent;
    height: 100%;
    width: 100%;
  }

  .popup-container {
    display: flex;
    flex-direction: column;
  }

  .pop-header {
    height: 90px;
    background-color: #007bff;
    color: white;
    text-align: center;
    font-size: 14px;
    position: relative;
    .title {
      width: 100%;
      position: absolute;
      bottom: 15px;
    }
  }

  .pop-body {
    flex: 1;
    overflow: scroll;
    padding: 8px;
    background-color: white;
  }

  .my-channel-box,
  .more-channel-box {
    .channel-title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: 28px;
      padding: 0 6px;
    }
  }

  .channel-item {
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    background-color: #fafafa;
    margin: 5px;
  }

  /*删除的微标 */
  .cross-badge {
    position: absolute;
    right: -3px;
    top: 0;
    border: none;
  }

  /*提示文字 */
  .small-title {
    font-size: 10px;
    color: gray;
  }
  </style>
