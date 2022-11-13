// 封装接口
// axios 会把参数对象转换成json字符串格式发后台，
// 会自动携带请求参数 headers 里的 content-Type: 'application/json'
import request from '@/utils/request.js'
import { getStorage } from '@/utils/storage.js'

// 登录接口
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

// 获取用户频道
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels',
  method: 'GET'
})

// 获取所有频道列表
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})

// 设置用户的频道（重置式）
export const updateChannelAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels: channels
  }
})

// 获取文章新闻推荐
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',
  params: {
    // 这里的参数axios会拼接到URL的?后面 （查询字符串）
    channel_id, // 频道ID
    timestamp // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
  }
})

// 对文章不喜欢
export const articleDislikeAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: artId
  }
})

// 举报文章
export const articleReportsAPI = ({ target, type, remark }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target,
    type,
    remark
  }
})

// 获取联想建议（自动补全）
export const suggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  method: 'GET',
  params: {
    q: keywords
  }
})

// 搜索 - 结果列表
export const searchResultListAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})

// 文章 - 详情
export const articleDetailAPI = ({ id }) => request({
  // :id是后台规定的参数名
  // 前端要在对应路径位置传值(不要写:)
  url: `/v1_0/articles/${id}`,
  method: 'GET'
})

// 文章 - 关注作者
export const followedUserAPI = ({ uid }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: uid
  }
})

// 文章 - 取消关注作者
export const unFollowedUserAPI = ({ uid }) => request({
  // 这uid只是个变量名, 把值拼接在url发给后台(无需指定参数名)
  url: `/v1_0/user/followings/${uid}`,
  method: 'DELETE'
})

// 文章 - 点赞
export const articleLikeAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})

// 文章 - 取消点赞
export const articleDisLikeAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 评论 - 获取列表
// offset第一页时, 不用在params携带(axios发现值为null会自动忽略此参数)
export const commentListAPI = ({ artId, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: {
    type: 'a',
    source: artId,
    offset,
    limit
  }
})

// 评论 - 喜欢
export const commentLikingAPI = ({ comId }) => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: comId // 点赞的评论id
  }
})

// 评论-取消喜欢
export const commentDisLikingAPI = ({ comId }) => request({
  url: `/v1_0/comment/likings/${comId}`,
  method: 'DELETE'
})

// 对文章进行评论 - 发布
export const sendCommentAPI = ({ id, content, art_id = null }) => {
  // axios中， data传参如果值为null， 不会忽略这个参数， params遇到null才会忽略
  // art_id（文章id）可选， 如果是对文章进行评论，则不需要art_id， 如果是对文章评论进行回复，则需要
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) {
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 获取用户自己信息(我的页面显示数据)
export const getUserInfoAPI = () => request({
  url: '/v1_0/user',
  method: 'GET'
})

// 用户- 个人资料(就为了获取生日)
export const userProfileAPI = () => request({
  url: '/v1_0/user/profile',
  method: 'GET'
})

// 用户- 更新头像
// 注意: formObj的值必须是一个表单对象
// '{"a": 10, "b": 20}' // 对象格式的JSON字符串
// new FormData() // 表单对象
export const updatePhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd // fd 外面传进来的 new FormData() 表单对象
  // 如果你的请求体内容是表单对象, 浏览器会自动携带请求头Content-Type为multipart/form-data
})

// 用户 - 更新资料
export const updateProfileAPI = ({ birthday, userName }) => request({
  url: '/v1_0/user/profile',
  method: 'PATCH',
  data: {
    birthday: birthday,
    name: userName
  }
})

// 用户 - 更新token
export const refreshTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: 'Bearer ' + getStorage('refresh_token')
  }
})
