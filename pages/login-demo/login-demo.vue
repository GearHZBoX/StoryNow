<template>
	<view>

		<button type="primary" @click="loginByGoogle()">google</button>
		<view style="height: 10px;"></view>
		<button type="primary" @click="loginByFC()">facebook</button>
		<view>loginRes: {{loginRes}}</view>
		<view>userInfo: {{userInfo}}</view>
		<view>err: {{err}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginRes: '',
				err: '',
				userInfo: '',
			}
		},
		methods: {
			loginByFC() {
				console.log('login by facebook');
				uni.login({
					provider: 'facebook',
					success: (loginRes) => {
						this.err = '';
						this.loginRes = typeof loginRes === 'object' ? JSON.stringify(loginRes) : loginRes;
						// 登录成功
						uni.getUserInfo({
							provider: 'facebook',
							success: (info) => {
								// 获取用户信息成功, info.authResult保存用户信息
								this.userInfo = typeof info === 'object' ? JSON.stringify(info) : info;
							}
						})
					},
					fail: (err) => {
						// 登录授权失败
						// err.code是错误码
						this.err = typeof err === 'object' ? JSON.stringify(err) : err;
						console.error(err);
					}
				})
			},
			loginByGoogle() {
				console.log('login by google');
				uni.login({
					provider: 'google',
					success: (loginRes) => {
						// 登录成功
						this.err = '';
						this.loginRes = typeof loginRes === 'object' ? JSON.stringify(loginRes) : loginRes;
						uni.getUserInfo({
							provider: 'google',
							success: (info) => {
								// 获取用户信息成功, info.authResult保存用户信息
								this.userInfo = typeof info === 'object' ? JSON.stringify(info) : info;
							}
						})
					},
					fail: (err) => {
						// 登录授权失败
						// err.code是错误码
						this.err = typeof err === 'object' ? JSON.stringify(err) : err;
						console.error(err);
					}
				})
			}
		}
	}
</script>

<style>
</style>