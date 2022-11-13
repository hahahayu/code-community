module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // 能把所有元素的px单位转成rem
      // rootValue：转换px的基准值
      // 编码时，一个元素宽是75px --> 2rem
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
