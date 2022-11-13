<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="profileObj.photo" @click="imageClickFn" />
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="profileObj.name" @click="showNameDialogFn" />
      <van-cell title="生日" is-link :value="profileObj.birthday" @click="birthdayClickFn" />
    </van-cell-group>

    <!-- 姓名修改的弹窗 -->
    <van-dialog v-model="isShowNameDialog" title="修改名称" show-cancel-button :before-close="onNameDialogBeforeClose">
      <!-- 输入框 -->
      <van-field v-model.trim="userName" input-align="center" maxlength="7" placeholder="请输入名称" v-searchFocus />
    </van-dialog>

    <!-- 生日修改的弹窗 -->
    <van-popup v-model="isShowBirth" position="bottom" style="height: 50%" round>
      <!-- 日期选择控件 -->
      <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate" :show-toolbar="true" @cancel="isShowBirth = false" @confirm="confirmFn"/>
    </van-popup>
  </div>
</template>

<script>
import { userProfileAPI, updatePhotoAPI, updateProfileAPI } from '@/api'
import Notify from '@/ui/Notify.js'
import { formatDate } from '@/utils/date.js'
import { mapMutations } from 'vuex'

export default {
  name: 'UserEdit',
  data () {
    return {
      profileObj: {}, // 用户基本资料
      isShowNameDialog: false, // 是否显示姓名弹出框
      userName: '', // 编辑用户名
      isShowBirth: false, // 显示时间选择器
      minDate: new Date(1900, 0, 1), // 最小的可选的日期
      maxDate: new Date(), // 最大的可选日期
      currentDate: new Date() // 当前日期
    }
  },
  // 用户基本资料
  async created () {
    const res = await userProfileAPI()
    this.profileObj = res.data.data
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO']),
    // 文件选择方法
    async onFileChange (e) {
      //   console.log(e.target.files[0]) // 用户选择中的文件对象， 数组是特殊的对象
      if (e.target.files.length === 0) return
      const fd = new FormData() // 图片文件以表单FormData形式传递给后台
      fd.append('photo', e.target.files[0])
      const res = await updatePhotoAPI(fd)
      console.log(res)
      this.profileObj.photo = res.data.data.photo // 更新最新头像
      this.SET_USERPHOTO(res.data.data.photo) // 更新成功后同步到 vuex 中
    },
    // 图片 - 点击事件
    imageClickFn () {
      this.$refs.iptFile.click() // js模拟标签的事件触发
    },
    // 点击名字-出现弹出框
    showNameDialogFn () {
      this.isShowNameDialog = true
      this.userName = this.profileObj.name // 设置默认显示内容
    },
    // 姓名修改弹出层-关闭前方法
    async onNameDialogBeforeClose (action, done) {
      // action的值: confirm或cancel(点击按钮区分)
      if (action === 'confirm') {
        // 确定
        // unicode编码 \u4092
        // url编码 %E2%C3%D1
        if (/^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/.test(this.userName)) {
          // 通过校验
          // 调用接口
          await updateProfileAPI({
            userName: this.userName
          })
          // 更新页面显示的名字
          this.profileObj.name = this.userName
          // 关闭弹窗
          done()
        } else {
          // 提示用户
          Notify({ type: 'warning', message: '用户名中英文和数字1-7位' })
          // 阻止弹窗关闭
          done(false)
        }
      } else if (action === 'cancel') {
        // 取消
        done()
      }
    },
    // 生日单元格 - 点击事件
    birthdayClickFn () {
      this.isShowBirth = true // 时间选择器出现
      // currentDate 需要日期对象， 将 this.profileObj.birthday 日期字符串转换成日期对象
      this.currentDate = new Date(this.profileObj.birthday)
    },
    // 日期选择器组件 - 点击完成
    async confirmFn () {
      // 日期选择器组件里currentDate里面是日期对象，后端需要年-月-日字符串
      await updateProfileAPI({
        birthday: formatDate(this.currentDate)
      })
      this.profileObj.birthday = formatDate(this.currentDate) // 前端页面同步
      this.isShowBirth = false // 时间选择器关闭
    }
  }
}
</script>

  <style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
