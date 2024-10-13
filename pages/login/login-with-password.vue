<template>
	<view class="page-view">
		<StaticHeader></StaticHeader>
		<view class="login-psw-header">
			<image class="login-psw-header-logo" src="../../static/logo.svg"></image>
			<view class="login-psw-header-title">
				<text class="login-psw-header-title-main">Nice to see you！</text>
				<text class="login-psw-header-title-sub">We are so excited to see you again!</text>
			</view>
		</view>
		<view class="sign-in-view">
			<text class="sign-in-view-title">Sign In with Email</text>
			<uni-easyinput :placeholder-style="placeholderStyle" class="sign-in-view-title-username"
				placeholder="Enter the email" v-model="email" :focus="focusEmail" @blur="focusEmail = false">
				<template #left>
					<uni-icons :size="24" color="rgba(145, 144, 153, 1)" class="input-prefix"
						type='email-filled'></uni-icons>
				</template>
			</uni-easyinput>
			<uni-easyinput :placeholder-style="placeholderStyle" class="sign-in-view-title-password"
				placeholder="Password" type="password" v-model="password" :focus="focusPassword"
				@blur="focusPassword = false">
				<template #left>
					<uni-icons :size="24" color="rgba(145, 144, 153, 1)" class="input-prefix"
						type='locked-filled'></uni-icons>
				</template>
			</uni-easyinput>
			<PrimaryButton style="margin: 40px 0 16px;" @click="login" :disabled="isProcessing || !email || !password">
				Sign In
			</PrimaryButton>
			<text class="sign-in-view-forgot-password" @click="toResetPasswd">Forgot password?</text>
		</view>
	</view>
</template>

<script>
	import StaticHeader from '../../components/static-header.vue'
	import UniEasyinput from '../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue'
	import PrimaryButton from '../../components/primary-button.vue'
	import {
		debounce
	} from 'lodash';
	const uniIdCo = uniCloud.importObject("uni-id-co", {
		customUI: true
	});
	import {
		mutations,
		store
	} from '../../uni_modules/uni-id-pages/common/store';
import { goBackToLatestReaderPage } from '../../common/utils';
	export default {
		components: {
			StaticHeader,
			UniEasyinput,
			PrimaryButton,
		},
		data() {
			return {
				placeholderStyle: `
		color: $light_text_gray4;
		font-family: "Open Sans";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px;`,
				email: '',
				password: '',
				focusPassword: false,
				focusEmail: true,
				isProcessing: false,
			}
		},
		onLoad() {
			uni.loadFontFace({
			    family: 'Open Sans',
			    // 本地字体路径需转换为平台绝对路径
			    source: `url(${plus.io.convertLocalFileSystemURL('_www/static/OpenSans-Regular.ttf')})`,
			});
		},
		created() {
			this.login = debounce(this.login, 200);
		},
		methods: {
			login() {
				if (this.isProcessing) {
					return;
				}
				if (!this.email.length) {
					this.focusEmail = true
					return uni.showToast({
						title: 'Please enter email',
						icon: 'none',
						duration: 3000
					});
				}
				
				if (!this.password.length) {
					this.focusPassword = true
					return uni.showToast({
						title: 'Please enter password',
						icon: 'none',
						duration: 3000
					});
				}
				
				if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(this.email)) {
					this.focusEmail = true;
					return uni.showToast({
						title: 'Incorrect email format',
						icon: 'none',
						duration: 3000
					});
				}
				uni.showLoading({
					title: 'login'
				});
				this.isProcessing = true;
				uniIdCo.login({
					email: this.email,
					password: this.password,
				}).then(async () => {
					await mutations.updateUserInfo();
					if (goBackToLatestReaderPage()) {
						return;
					}
					uni.switchTab({
						url: '/pages/user-center/user-center',
					});
				}).catch(e => {
					console.error(e);
					uni.showToast({
						title: 'Incorrect email or password',
						icon: 'none',
					})
				}).finally(() => {
					uni.hideLoading();
					this.isProcessing = false;
				})
			},
			toResetPasswd() {
				uni.navigateTo({
					url: '/pages/login/reset-passwd-by-email',
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/uni-to-storynow.scss";
	.page-view {
		width: 100%;
		min-height: 100%;
		font-family: "Open Sans";
		background-image: url('../../static/img_bg.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-color: #f5f5f5;
	}

	.login-psw-header {

		display: flex;
		flex-direction: row;
		column-gap: 12px;
		padding: 16px 16px 24px;

		&-logo {
			width: 52px;
			height: 52px;
		}

		&-title {
			display: flex;
			flex-direction: column;
			row-gap: 4px;

			&-main {
				color: var(--light-text-gray01, $light_text_gray1);
				font-family: "SF UI Display";
				font-size: 24px;
				font-style: normal;
				font-weight: 600;
				line-height: normal;
			}

			&-sub {
				color: var(--light-text-gray03, $light_text_gray3);

				/* body/regular */
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: 20px;
				/* 142.857% */
			}
		}
	}

	.sign-in-view {
		margin: 0 16px;
		padding: 16px;
		background: #fff;
		display: flex;
		flex-direction: column;
		border-radius: 20px;

		&-title {
			padding: 8px 0;
			overflow: hidden;
			color: var(--light-text-gray01, $light_text_gray1);
			text-overflow: ellipsis;

			/* Title/medium */
			font-family: "Open Sans";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: 20px;
			/* 125% */

			margin-bottom: 8px;

			&-username {
				margin-bottom: 20px;
			}

			&-username,
			&-password {


				.uni-easyinput__content {
					background: $light_brand_04 !important;
					padding: 8px;
					border-radius: 12px;
				}

				.uni-easyinput__content-input {
					background: $light_brand_04;
					border-radius: 12px;
				}

				.input-prefix {
					padding-left: 12px;
					padding-right: 8px;
				}
			}
		}

		&-forgot-password {
			color: var(--light-brand-02, #9883FC);
			text-align: center;

			/* label/medium */
			font-family: "PingFang SC";
			font-size: 12px;
			font-style: normal;
			font-weight: 500;
			line-height: 14px;
			/* 116.667% */
		}

	}

	.login-input-placeholder {
		color: $light_text_gray4;
		font-family: "PingFang SC";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px;
	}
</style>