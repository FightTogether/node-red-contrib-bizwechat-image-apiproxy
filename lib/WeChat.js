const WXBizMsgCrypt = require('wechat-crypto')
const axios = require('axios')
const FormData = require('form-data')
const WeChatCode = require('./WeChatCode')

const EXPIRE_TIME = 1000 * 3600 * 2

class WechatClass {
  constructor (node, config, cryptor) {
    this.node = node
    this.config = config
    this.cryptor = cryptor
  }
  getToken () {
    const { set: setCache, get: getCache } = this.node.context().global
    const { corpid, corpsecret, agentid } = this.config
    return new Promise(async (resolve, reject) => {
      try {
        const cache_key = `wechat-${agentid}`
        const cache = getCache(cache_key)
        if (cache && cache.time && ((new Date().valueOf() - cache.time) < EXPIRE_TIME)) {
          resolve(cache.token)
          return
        }
        const { data } = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken', {
          params: { corpid, corpsecret }
        }).catch(err => {
          throw new Error(`[微信Token]:${err}`)
        })
        if (data.errcode != 0) {
          const msg = WeChatCode[data.errcode] || data.errmsg
          throw (new Error(`[微信Token]${msg}`))
        }
        setCache(cache_key, {
          token: data.access_token,
          time: new Date().valueOf()
        })
        resolve(data.access_token)
      } catch (err) { reject(err) }
    })
  }

  uploadImage (data) {
    return new Promise(async (resolve, reject) => {
      try {
        const access_token = await this.getToken()
		const { file, filename } = data
        const form = new FormData()
        form.append('fieldNameHere', file, filename)
        const header = Object.assign({
          'Content-Length': form.getLengthSync()
        }, form.getHeaders())
        const result = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/media/uploadimg`, form, {
		  params: { access_token },
          headers: header
        }).catch(err => {
          throw new Error(`[微信媒体上传]${err}`)
        })
        if (result.data.errcode && result.data.errcode != 0) {
          const msg = WeChatCode[result.data.errcode] || result.data.errmsg
          throw (new Error(`[微信媒体上传]${msg}`))
        }
        if (result.headers['error-code'] && result.headers['error-code'] != 0) {
          const msg = WeChatCode[result.headers['error-code']] || result.headers['error-msg']
          throw (new Error(`[微信媒体上传]${msg}`))
        }
        resolve(result.data)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = WechatClass
