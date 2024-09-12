const {
  preUnifiedLogin,
  postUnifiedLogin
} = require('../../lib/utils/unified-login')
/**
 * google 登录
 * @param {Object} params
 * @returns
 */
module.exports = async function (params = {}) {
  console.log('谷歌登录', params);
  const schema = {
    openid: 'string',
    nickname: 'string',
  }
  this.middleware.validate(params, schema)
  const { openid, nickname } = params;
  const {
    type,
    user
  } = await preUnifiedLogin.call(this, {
    user: {
      google_openid: openid
    }
  });
  
  return postUnifiedLogin.call(this, {
    user,
    extraData: {
		nickname: params.nickname,
	},
    isThirdParty: true,
    type,
  })
}
