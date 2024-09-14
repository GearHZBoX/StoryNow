<template>
	<view class="login-button" :style="`background-color: ${backgroundColor}`" @click="exec">
		<image class="login-button-icon" :src="icon"></image>
		<text class="login-button-text" :style="`color: ${textColor}`">{{text}}</text>
	</view>
</template>

<script>
import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js';
	export default {
		name:"login-button",
		props: {
			type: String,
			icon: String,
			text: String,
			backgroundColor: String,
			textColor: String,
		},
		data() {
			return {
				
			};
		},
		methods: {
			exec() {
				uni.showLoading({
					title: 'login'
				});
				const type = this.type;
				console.log('here1');
				uni.login({
					provider: type,
					onlyAuthorize: true,
					success: async (e) => {
						console.log('here2');
						const res = await this.getUserInfo({
							provider: type
						})
						Object.assign(e.authResult, res.userInfo)
						try {
							this.login(e.authResult, type)
						} catch(e) {
							console.error(e);
							uni.hideLoading();
						}
					},
					fail: (err) => {
						console.log(err);
						uni.hideLoading();
						uni.showModal({
							title: 'Login failed',
							content: err.errMsg,
							showCancel: false,
						})
					}
				})
			},
			async login(params, type) { 
				console.log({params,type});
				//toLowerCase
				let action = 'loginBy' + type.trim().replace(type[0], type[0].toUpperCase())
				const uniIdCo = uniCloud.importObject("uni-id-co",{
					customUI:true
				})
				uniIdCo[action](params).then(result => {
					uni.showToast({
						title: 'Login success',
						icon: 'none',
						duration: 2000
					});
					// #ifdef H5
					result.loginType = type
					// #endif
					mutations.updateUserInfo();
					uni.switchTab({
						url: '/pages/user-center/user-center',
					})
				})
				.catch(e=>{
					uni.showModal({
						content: e.message,
						confirmText:"Confirm",
						showCancel: false
					});
				})
				.finally(e => {
					if (type == 'univerify') {
						uni.closeAuthView()
					}
					uni.hideLoading()
				})
			},
			async getUserInfo(e) {
				return new Promise((resolve, reject) => {
					uni.getUserInfo({
						...e,
						success: (res) => {
							resolve(res);
						},
						fail: (err) => {
							uni.showModal({
								content: JSON.stringify(err),
								showCancel: false
							});
							reject(err);
						}
					})
				})
			},
		},
	}
</script>

<style lang="scss">
	.login-button {
		border-radius: 27px;
		background: var(--light-brand-04, #F6F6F9);
		display: flex;
		padding: 10px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		column-gap: 12px;
		height: 30px;
		
		&-icon {
			width: 20px;
			height: 20px;
		}
		
		&-text {
			color: #605C73;
			
			/* Title/medium */
			font-family: "Open Sans";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: 20px; /* 125% */
			
			lines: 1;
		}
	}
</style>