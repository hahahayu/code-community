<template>
  <div>
    <van-nav-bar title="登录"/>
    <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          name="mobile"
          label="手机号"
          required
          :rules="[{ required: true, message: '请填写正确的手机号', pattern: /^1\d{10}$/ }]"
        />
        <van-field
          v-model="user.code"
          type="password"
          name="code"
          label="验证码"
          required
          :rules="[{ required: true, message: '请填写正确的6位验证码', pattern: /^\d{6}$/ }]"
        />
        <div style="margin: 16px;">
          <van-button round block :loading="isLoading" loading-text="正在登录..." :disabled="isLoading" type="info" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import Notify from '@/ui/Notify.js'
import { setToken } from '@/utils/token.js'
import { setStorage } from '@/utils/storage'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '18066666666', // 手机号
        code: '246810' // 验证码（246810）
      },
      isLoading: false // 登录按钮的加载状态
    }
  },
  methods: {
    // 提交 form整体通过验证才会触发
    async onSubmit (values) {
      // 直接用 values 就可以手机参数名和值，或 this,user
      console.log('submit', values)
      // 登录按钮状态设置
      this.isLoading = true

      try {
        const res = await loginAPI(this.user)
        // 成功通知
        Notify({ type: 'success', message: '登录成功' })
        // 存储 token
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        // 跳转到首页, $router.push() 压栈--会产生历史记录,  $router.replace() 替换--不产生历史记录
        this.$router.replace({
          path: '/layout/home'
        })
      } catch (err) {
        // 危险通知
        Notify({ type: 'warning', message: err.response.data.message })
      }

      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="less">
// .van-nav-bar{
//   background-color: #007bff;
// }

// // .van-nav-bar__title 是组件内样式， 用了 scoped 以后，需要修改的话要在选择器前加 deep
// ::v-deep .van-nav-bar__title{
//   color: white
// }
</style>
