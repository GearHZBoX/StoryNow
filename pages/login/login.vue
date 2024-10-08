<template>
	<view class="page-view">
		<!-- <image src="../../static/img_bg.png" class="login-bg" :style="'width:' + pageWidth + 'px'" /> -->
		<static-header back-icon style="z-index: 10; position: relative;"></static-header>
		<view class="login-header">
			<image class="login-header-logo" src="../../static/logo.svg" />
			<view class="login-header-title">{{titleText}}</view>
			<view class="login-header-subtitle">{{subtitleText}}</view>
		</view>
		<view class="login-center">
			<LoginButton v-for="item in loginConfig" :key="item.type" :type="item.type" :icon="item.icon" :text="item.text"
				:background-color="item.backgroundColor" :text-color="item.textColor" />
			<view style="padding: 0 50px;">
				<Divider text="or"></Divider>
			</view>
			<view class="sign-in-with-password-button" @click="toPasswordLogin">
				<text class="sign-in-with-password-button-text">
					Sign In with Email
				</text>
			</view>
			<view class="create-button" @click="toPasswordRegister">
				<text class="create-button-text">
					Create Account
				</text>
			</view>
		</view>
		<view class="login-footer">
			<text class="login-footer-text">
				When you log in，we wil assume that you have read and agree to the 
				<text class="highlight" @click="goto('https://static-mp-2fd7334f-2482-4ac2-b562-dd8f8ddf3c00.next.bspapp.com/agreements/service-agreement.html')">
					"User Agreement"
				</text>
					, the 
				<text class="highlight" @click="goto('https://static-mp-2fd7334f-2482-4ac2-b562-dd8f8ddf3c00.next.bspapp.com/agreements/privacy-agreement.html')">
					"Privacy Policy"
				</text>.
			</text>
		</view>
	</view>
</template>

<script>
	import StaticHeader from '../../components/static-header.vue';
	import LoginButton from '../../components/login-button.vue';
	import Divider from '../../components/divider.vue';
	import {
		isIOS
	} from '../../common/constant';
	export default {
		components: {
			StaticHeader,
			LoginButton,
			Divider,
		},
		onLoad() {
			uni.loadFontFace({
			    family: 'Open Sans',
			    // 本地字体路径需转换为平台绝对路径
			    source: `url(${plus.io.convertLocalFileSystemURL('_www/static/OpenSans-Regular.ttf')})`,
			});
		},
		data() {
			return {
				pageHeight: 300,
				pageWidth: 200,
				titleText: 'Welcome back! ',
				subtitleText: 'We are so excited to see you again!',
				loginConfig: [{
						type: 'google',
						icon: '../../static/Google Logo.svg',
						text: 'Sign In with Google',
						backgroundColor: '$light_brand_04',
						textColor: '$light_text_gray2',
					},
					{
						type: 'facebook',
						icon: '../../static/Facebook Logo.svg',
						text: 'Sign In with Facebook',
						backgroundColor: '#1877F2',
						textColor: '#FFF',
					},
					{
						type: 'apple',
						icon: '../../static/Apple Logo.svg',
						text: 'Sign In with Apple',
						backgroundColor: '#000',
						textColor: '#FFF',
					} 
				]
			};
		},
		async onReady() {
			this.pageHeight = uni.getSystemInfoSync().windowHeight;
			this.pageWidth = uni.getSystemInfoSync().windowWidth;
		},
		created() {
			if (!isIOS) {
				this.loginConfig = this.loginConfig.filter(({ type }) => type !== 'apple');
			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			toPasswordLogin() {
				uni.navigateTo({
					url: '/pages/login/login-with-password',
				});
			},
			toPasswordRegister() {
				uni.navigateTo({
					url: '/pages/login/register-with-password',
				})
			},
			goto(url, title = '') {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/common/webview/webview?url=' + url + '&title=' + title,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
		}
	}
</script>

<style lang="scss">
	.page-view {
		width: 100%;
		min-height: 100%;
		font-family: "Open Sans";
		background-image: url('../../static/img_bg.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-color: #F6f6f6;
	}

	.login-bg {
		position: absolute;
		top: 0;
	}

	.login-header {
		padding: 5px 53px;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 25px;

		&-logo {
			width: 80px;
			height: 80px;
			margin-bottom: 12px;
		}

		&-title {
			color: $light_text_gray1;
			text-align: center;
			font-family: "SF UI Display";
			font-size: 24px;
			font-style: normal;
			font-weight: 600;
			line-height: normal;
			margin-bottom: 4px;
		}

		&-subtitle {
			color: $light_text_gray3;
			text-align: center;

			/* body/regular */
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 20px;
			/* 142.857% */
		}
	}

	.login-center {
		margin: 0 16px;
		border-radius: 20px;
		background: #FFF;
		padding: 24px 24px 90px;
		display: flex;
		flex-direction: column;
		// row-gap: 24px;
		&>* {
			margin-bottom: 24px;
		}
	}
	
	.create-button,
	.sign-in-with-password-button {
		display: flex;
		height: 30px;
		padding: 10px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		align-self: stretch;
		border-radius: 27px;
		background: var(--light-brand-04, $light_brand_04);
		
		&-text {
			color: var(--light-text-gray02, $light_text_gray2);
			
			/* Title/medium */
			font-family: "Open Sans";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: 20px; /* 125% */
		}
	}
	
	.login-footer {
		margin-top: 56px;
		padding: 16px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		
		&-text {
			width: 275px;
			color: var(--light-text-gray03, $light_text_gray3);
			text-align: center;
			
			/* label/regular */
			font-family: "PingFang SC";
			font-size: 10px;
			font-style: normal;
			font-weight: 400;
			line-height: 12px; /* 120% */
		}
	}
</style>