<template>
	<view class="page-view">
		<StaticHeader></StaticHeader>
		<view class="login-psw-header">
			<image class="login-psw-header-logo" src="../../static/logo.svg"></image>
			<view class="login-psw-header-title">
				<text class="login-psw-header-title-main">Welcome!</text>
				<text class="login-psw-header-title-sub">register now and begin to read</text>
			</view>
		</view>
		<uni-forms class="main-form" ref="form" :value="formData" :rules="rules" validate-trigger="submit" err-show-type="toast">
			<text class="main-title">Create Account</text>
			<uni-forms-item name="email">
				<uni-easyinput :placeholder-style="placeholderStyle" type="email" :inputBorder="false" :focus="focusEmail" @blur="focusEmail = false"
					class="input-box" placeholder="请输入邮箱" v-model="formData.email" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="nickname">
				<uni-easyinput :placeholder-style="placeholderStyle" :inputBorder="false" :focus="focusNickname" @blur="focusNickname = false" class="input-box" placeholder="请输入用户昵称" 
				v-model="formData.nickname" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="password" v-model="formData.password">
				<uni-easyinput :placeholder-style="placeholderStyle" :inputBorder="false" :focus="focusPassword" @blur="focusPassword = false"
					class="input-box" maxlength="20" :placeholder="'请输入' + (config.passwordStrength == 'weak'?'6':'8') + '-16位密码'" type="password"
					v-model="formData.password" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="password2" v-model="formData.password2">
				<uni-easyinput :placeholder-style="placeholderStyle" :inputBorder="false" :focus="focusPassword2" @blur="focusPassword2 =false"
					class="input-box" placeholder="再次输入密码" maxlength="20" type="password" v-model="formData.password2"
					trim="both" />
			</uni-forms-item>
			<uni-forms-item name="code" >
				<RegisterEmailForm ref="shortCode" :email="formData.email" type="register" v-model="formData.code">
				</RegisterEmailForm>
			</uni-forms-item>
			<uni-id-pages-agreements scope="register" ref="agreements" ></uni-id-pages-agreements>
			<!-- <button class="uni-btn" type="primary" @click="submit">注册</button> -->
			<view style="height: 16px;"></view>
			<PrimaryButton @click="submit">Register</PrimaryButton>
			<!-- <button @click="navigateBack" class="register-back">返回</button> -->
			<!-- <match-media :min-width="690">
				<view class="link-box">
					<text class="link" @click="registerByUserName">用户名密码注册</text>
					<text class="link" @click="toLogin">已有账号？点此登录</text>
				</view>
			</match-media> -->
		</uni-forms>
	</view>
</template>

<script>
	import rules from './validator.js';
	import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';
	import config from '@/uni_modules/uni-id-pages/config.js'
	import passwordMod from '@/uni_modules/uni-id-pages/common/password.js'
	import RegisterEmailForm from '@/components/register-email-form.vue';
	import StaticHeader from '../../components/static-header.vue';
	import PrimaryButton from '../../components/primary-button.vue';
	const uniIdCo = uniCloud.importObject("uni-id-co")
	export default {
		mixins: [mixin],
		components: {
			RegisterEmailForm,
			StaticHeader,
			PrimaryButton,
		},
		data() {
			return {
				formData: {
					email: "",
					nickname: "",
					password: "",
					password2: "",
					code: "",
				},
				placeholderStyle: `
					color: var(--light-text-gray04, #C0C0CC);
					font-family: "Open Sans";
					font-size: 16px;
					font-style: normal;
					font-weight: 400;
					line-height: 24px;
				`,
				rules: {
					email: {
						rules: [{
								required: true,
								errorMessage: '请输入邮箱',
							},{
								format:'email',
								errorMessage: '邮箱格式不正确',
							}
						]
					},
					nickname: {
						rules: [{
								minLength: 3,
								maxLength: 32,
								errorMessage: '昵称长度在 {minLength} 到 {maxLength} 个字符',
							},
							{
								validateFunction: function(rule, value, data, callback) {
									// console.log(value);
									if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
										callback('昵称不能是：手机号或邮箱')
									};
									if (/^\d+$/.test(value)) {
										callback('昵称不能为纯数字')
									};
									if(/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(value)){
										callback('昵称不能包含中文')
									}
									return true
								}
							}
						],
						label: "昵称"
					},
					...passwordMod.getPwdRules(),
					code: {
						rules: [{
								required: true,
								errorMessage: '请输入邮箱验证码',
							},
							{
								pattern: /^.{6}$/,
								errorMessage: '邮箱验证码不正确',
							}
						]
					}
				},
				focusEmail:false,
				focusNickname:false,
				focusPassword:false,
				focusPassword2:false,
				logo: "/static/logo.png"
			}
		},
		onReady() {
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
			 * 触发表单提交
			 */
			submit() {
				this.$refs.form.validate().then((res) => {
					if (this.needAgreements && !this.agree) {
						return this.$refs.agreements.popup(()=>{
							this.submitForm(res)
						})
					}
					this.submitForm(res)
				}).catch((errors) => {
					let key = errors[0].key
					key = key.replace(key[0], key[0].toUpperCase())
					// console.log(key);
					this['focus'+key] = true
				})
			},
			submitForm(params) {
				uniIdCo.registerUserByEmail(this.formData).then(e => {
					uni.navigateTo({
						url: '/pages/login/login-with-password',
						complete: (e) => {
						}
					})
				})
				.catch(e => {
					// console.log(e);
					console.log(e.message);
				})
			},
			navigateBack() {
				uni.navigateBack()
			},
			toLogin() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withpwd'
				})
			},
			registerByUserName() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/register/register'
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
			padding: 30px 40px;
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
	.uni-content ::v-deep .uni-forms-item__label {
		position: absolute;
		left: -15px;
	}

	button {
		margin-top: 15px;
	}
</style>
