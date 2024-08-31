const {
  preUnifiedLogin,
  postUnifiedLogin
} = require('../../lib/utils/unified-login')
/**
 * Facebook登录
 * @param {Object} params
 * @returns
 */
module.exports = async function (params = {}) {
  console.log('脸书登录', params);
  const schema = {
    openid: 'string',
    nickname: 'string',
	email: {
		type: 'string',
		required: false,
	},
	headimgurl: {
		type: 'string',
		required: false,
	},
  }
  this.middleware.validate(params, schema)
  const { openid, nickname, email, headimgurl } = params;
  const {
    type,
    user
  } = await preUnifiedLogin.call(this, {
    user: {
      facebook_openid: openid
    }
  });
  
  return postUnifiedLogin.call(this, {
    user,
    extraData: {
		nickname: params.nickname,
		email: params.email,
		avatar_url: params.headimgurl,
	},
    isThirdParty: true,
    type,
  })
}
