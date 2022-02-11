const WXBizMsgCrypt = require('wechat-crypto')
const WeChat = require('./lib/WeChat')

module.exports = RED => {
  RED.nodes.registerType('bizwechat-image', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
      const biz_config = RED.nodes.getNode(config.bizwechat)
      node.on('input', async data => {
		const { payload, filename } = data
        const cryptor = new WXBizMsgCrypt(biz_config.token, biz_config.aeskey, biz_config.corpid)
        const wx = new WeChat(node, biz_config, cryptor)
        try {
		  const result = await wx.uploadImage({ file: payload, filename })
          node.status({ text: `上传成功:${data._msgid}` })
          data.payload = result
          node.send(data)
        } catch (err) {
          node.status({ text: err.message, fill: 'red', shape: 'ring' })
          node.warn(err)
        }
      })
    }
  })
}
