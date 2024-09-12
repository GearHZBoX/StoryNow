const {
	verifyCaptcha
} = require('../../lib/utils/captcha')
const {
	EMAIL_SCENE
} = require('../../common/constants')
const {
	ERROR
} = require('../../common/error')
const nodemailer = require('nodemailer');
/**
 * 发送邮箱验证码，可用于登录、注册、绑定邮箱、修改密码等操作
 * @tutorial
 * @param {Object} params
 * @param {String} params.email     邮箱
 * @param {String} params.captcha   图形验证码
 * @param {String} params.scene     使用场景
 * @returns
 */
module.exports = async function(params = {}) {
	const schema = {
		email: 'email',
		captcha: 'string',
		scene: 'string'
	}
	this.middleware.validate(params, schema)

	const {
		email,
		captcha,
		scene
	} = params

	if (!(Object.values(EMAIL_SCENE).includes(scene))) {
		throw {
			errCode: ERROR.INVALID_PARAM
		}
	}

	await verifyCaptcha.call(this, {
		scene: 'send-email-code',
		captcha
	})
	
	const verifyCode = 14250250;

	await require('../../lib/utils/verify-code')
		.setEmailVerifyCode.call(this, {
			email,
			code: verifyCode,
			expiresIn: 180,
			scene
		})

	console.log('ready to send email');

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: "storynow.app@gmail.com",
			pass: "LatteBabe@123",
		},
	});

	const mailOptions = {
		from: 'storynow.app@gmail.com',
		to: params.email,
		subject: '【StoryNow】verify your email',
		text: 'your verify code is ' + verifyCode,
	};

	await new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error(error);
				reject(`email send failed, ${error}`);
			} else {
				console.log('Email sent: ' + info.response);
				resolve(info);
			}
		})
	});

	return {
		errCode: 0,
	}
}