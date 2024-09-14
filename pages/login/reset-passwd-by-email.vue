<!-- 找回密码页 -->
<template>
	<view class="page-view">
		<StaticHeader></StaticHeader>
		<view class="login-psw-header">
			<view class="login-psw-header-title">
				<text class="login-psw-header-title-main">Forgot Password</text>
				<text class="login-psw-header-title-sub">reset your password with email</text>
			</view>
		</view>
		<uni-forms class="main-form" ref="form" :value="formData" err-show-type="toast">
			<!-- <text class="main-title">Reset Password</text> -->
			<uni-forms-item name="email">
				<uni-easyinput :placeholderStyle="placeholderStyle" :focus="focusEmail" @blur="focusEmail = false" class="input-box" :disabled="lock" :inputBorder="false"
					v-model="formData.email" placeholder="Enter you email">
				</uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="code">
				<RegisterEmailForm ref="shortCode" :email="formData.email" type="reset-pwd-by-email" v-model="formData.code">
				</RegisterEmailForm>
			</uni-forms-item>
			<uni-forms-item name="password">
				<uni-easyinput :placeholderStyle="placeholderStyle" :focus="focusPassword" @blur="focusPassword = false" class="input-box" type="password" :inputBorder="false" v-model="formData.password"
					placeholder="Please enter a new password"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="password2">
				<uni-easyinput :placeholderStyle="placeholderStyle" :focus="focusPassword2" @blur="focusPassword2 = false" class="input-box" type="password" :inputBorder="false" v-model="formData.password2"
					placeholder="Please enter the new password again"></uni-easyinput>
			</uni-forms-item>
			<PrimaryButton @click="submit">Confirm</PrimaryButton>
		</uni-forms>
		<uni-popup-captcha @confirm="submit" v-model="formData.captcha" scene="reset-pwd-by-sms" ref="popup"></uni-popup-captcha>
	</view>
</template>

<script>
	import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';
	import passwordMod from '@/uni_modules/uni-id-pages/common/password.js';
	import RegisterEmailForm from '@/components/register-email-form.vue';
	import StaticHeader from '../../components/static-header.vue';
	const uniIdCo = uniCloud.importObject("uni-id-co",{
		errorOptions:{
			type:'toast'
		},
		loadingOptions: { 
			title: 'loading...', 
			mask: true,
		},
	})
	export default {
		mixins: [mixin],
		components: {
			RegisterEmailForm,
			StaticHeader,
		},
		data() {
			return {
				lock: false,
				focusEmail:true,
				focusPassword:false,
				focusPassword2:false,
				formData: {
					"email": "",
					"code": "",
					'password': '',
					'password2': '',
					"captcha": ""
				},
				rules: {
					email: {
						rules: [{
								required: true,
								errorMessage: 'Please enter email',
							},
							{
								format:'email',
								errorMessage: 'Incorrect email format',
							}
						]
					},
					code: {
						rules: [{
								required: true,
								errorMessage: 'Please enter verification code',
							},
							{
								pattern: /^.{6}$/,
								errorMessage: 'Please enter the six - digit verification code.',
							}
						]
					},
					...passwordMod.getPwdRules()
				},
				logo: "/static/logo.png"
			}
		},
		computed: {
			isEmail() {
				let reg_email = /@/;
				let isEmail = reg_email.test(this.formData.email);
				return isEmail;
			},
			isPwd() {
				let reg_pwd = /^.{6,20}$/;
				let isPwd = reg_pwd.test(this.formData.password);
				return isPwd;
			},
			isCode() {
				let reg_code = /^\d{6}$/;
				let isCode = reg_code.test(this.formData.code);
				return isCode;
			}
		},
		onLoad(event) {
			if (event && event.emailNumber) {
				this.formData.email = event.emailNumber;
				if(event.lock){
					this.lock = event.lock //如果是已经登录的账号，点击找回密码就锁定指定的账号绑定的邮箱码
					this.focusEmail = true
				}
			}
		},
		onReady() {
			if (this.formData.email) {
				this.$refs.shortCode.start();
			}
			this.$refs.form.setRules(this.rules)
		},
		onShow() {
			// #ifdef H5
			document.onkeydown = event => {
				var e = event || window.event;
				if (e && e.keyCode == 13) { //回车键的键值为13
					this.submit()
				}
			};
			// #endif
		},
		methods: {
			/**
			 * 完成并提交
			 */
			submit() {
				this.$refs.form.validate()
					.then(res => {
						let {
							email,
							password: password,
							captcha,
							code
						} = this.formData
						uniIdCo.resetPwdByEmail({
								email,
								code,
								password,
								captcha
							}).then(e => {
								uni.redirectTo({
									url: '/pages/login/login',
									complete: (e) => {
										// console.log(e);
									}
								})
							})
							.catch(e => {
								if (e.errCode == 'uni-id-captcha-required') {
									this.$refs.popup.open()
								}
							}).finally(e => {
								this.formData.captcha = ""
							})
					}).catch(errors=>{
						let key = errors[0].key
						if(key == 'code'){
							return this.$refs.shortCode.focusSmsCodeInput = true
						}
						key = key.replace(key[0], key[0].toUpperCase())
						this['focus'+key] = true
					})
			},
			retrieveByPhone() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/retrieve/retrieve'
				})
			},
			backLogin () {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uni-id-pages/common/login-page.scss";
	@import "@/common/uni-to-storynow.scss";

	@media screen and (max-width: 690px) {
		.uni-content{
			margin-top: 15px;
		}
	}
	@media screen and (min-width: 690px) {
		.uni-content{
			padding: 30px 40px 40px;
			max-height: 650px;
		}

		.link-box {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			justify-content: space-between;
			margin-top: 10px;
		}

		.link {
			font-size: 12px;
		}
	}
</style>
