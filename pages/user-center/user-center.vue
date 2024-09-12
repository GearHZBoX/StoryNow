<template>
	<view class="user-center-page">
		<!-- 登录状态 -->
		<view class="login-status-box" v-if="!hasLogin" @click="toLogin">
			Login in
			<i></i>
		</view>
		<view class="login-status-box" v-else>
			<!-- <img :src="userInfo.avatar_url" class="head-img" /> -->
			{{userInfo.nickname}}
			<i class="king"></i>
		</view>

		<view class="vip-box">
			<view class="vip-left-box">
				<view class="vip-title">Open Storynow Membership</view>
				<view class="vip-desc">Access to popular content across all platforms.</view>
			</view>
			<view class="vip-right" @click="toPage('/pages/to-vip/to-vip',true)">
				<text>0.3</text>$/day
			</view>
		</view>


		<view class="history">
			<view class="menu-item">
				<view class="menu-item-icon history-icon ">
				</view>
				<view class="menu-item-title">历史记录</view>
				<!-- <view class="menu-item-more"></view> -->
			</view>

			<view class="read-continue" v-if="1||hasLogin">
				<text>Stepford Wives Literature's Overbearing President Loves Meg husband gets punished!
				</text>
				<view class="continue">continue</view>
			</view>
		</view>

		<view class="menu-box">
			<view class="menu-item" @click="toPage('/pages/about-us/about-us')">
				<view class="menu-item-icon aubout-us-icon">
				</view>
				<view class="menu-item-title">About Us</view>
				<view class="menu-item-more"></view>
			</view>
			<view class="menu-item" @click="toPage('/pages/feedback/feedback',true)">
				<view class="menu-item-icon feedback-icon">
				</view>
				<view class="menu-item-title">Report and Feedback</view>
				<view class="menu-item-more"></view>
			</view>
			<view class="menu-item" v-if="hasLogin" @click="logout">
				<view class="menu-item-icon logout-icon">
				</view>
				<view class="menu-item-title">Log Out</view>
				<view class="menu-item-more"></view>
			</view>
		</view>


		<!-- 		<view>用户信息</view>
		<view>{{JSON.stringify(userInfo, null, 2)}}</view>
		<button v-if="!userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/login/login-withpwd')">{{$t('login')}}</button>
		<button v-if="!userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/register/register')">{{$t('register')}}</button>
		<button v-if="userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd')">修改密码</button>
		<button v-if="userInfo._id" @click="logout">退出登录</button>
		<button v-if="userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate')">注销</button> -->
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from "@/uni_modules/uni-id-pages/common/store.js";

	export default {
		computed: {
			userInfo() {
				return store.userInfo || {};
			},
			hasLogin() {
				return store.hasLogin
			}
		},
		data() {
			return {};
		},
		methods: {
			toPage(url, auth) {
				if (auth && !this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login',
					})
					return;
				}

				uni.navigateTo({
					url: url,
					animationDuration: 200,
				});
			},


			// 跳转登录
			toLogin() {
				uni.navigateTo({
					url: '/pages/login/login',
				})
			},

			logout() {
				uni.showModal({
					title: 'Storynow',
					content: 'Are you sure you want to log out？',
					cancelText: "Cancel",
					confirmText: "Confirm",
					success: function(res) {
						if (res.confirm) {
							mutations.logout();
						} else if (res.cancel) {
							console.log('用户点击取消1');
						}
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	page {
		width: 100%;
		min-height: 100%;

	}

	/* #endif */
	.user-center-page {
		display: flex;
		flex-direction: column;
		height: 100%;
		background:#F6F6F9  url("../../static/img_bg.png") top/100% auto no-repeat;
		
		.login-status-box {
			height: 44px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin: 68px 24px 24px;
			font-family: "Open Sans";
			font-size: 20px;
			font-style: normal;
			font-weight: 600;
			line-height: 28px;

			.head-img {
				width: 44px;
				height: 44px;
				border-radius: 50%;
				margin-right: 14px;
			}

			i {
				width: 16px;
				height: 16px;
				margin-left: 6px;
				background: url('../../static/user-center/arrow.svg') center/100% auto no-repeat;
			}

			.king {
				width: 20px;
				height: 20px;
				margin-left: 6px;
				background: url('../../static/user-center/king.svg') center/100% auto no-repeat;
			}
		}

		.vip-box {
			border: 1px solid red;
			margin: 0 24px;
			padding: 12px 16px;
			background: #FCEDCF;
			border: 1px solid white;
			border-radius: 12px 12px 0 0;
			display: flex;
			align-items: center;
			justify-content: space-around;

			.vip-left-box {
				display: flex;
				flex-direction: column;

				.vip-title {
					color: #483510;
					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 500;
					line-height: 20px;
					/* 142.857% */
				}

				.vip-desc {
					color: #A68332;
					font-family: "Open Sans";
					font-size: 12px;
					font-style: normal;
					font-weight: 400;
					line-height: 16px;
					/* 133.333% */
				}
			}

			.vip-right {
				width: 80px;
				height: 36px;
				padding: 8px 20px;
				border-radius: 40px;
				background: #F8D177;
				margin-left: 16px;
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #483510;
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;

				text {
					color: #483510;
					font-family: Roboto;
					font-size: 14px;
					font-style: normal;
					font-weight: 600;
				}
			}
		}

		.history {
			margin: 0 16px;
			border-radius: 12px;
			overflow: hidden;
			margin-bottom: 12px;
			background: white;

			.read-continue {
				margin: 0 12px;
				border-radius: 12px;
				padding: 12px;
				margin-bottom: 16px;
				display: flex;
				align-items: center;
				background: #F0EDFF;

				text {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 400;
					line-height: 20px;
				}

				.continue {
					display: flex;
					justify-content: center;
					align-items: center;
					display: flex;
					height: 28px;
					box-sizing: border-box;
					padding: 8px 12px;
					justify-content: center;
					align-items: center;
					border-radius: 20px;
					background: rgba(255, 255, 255, 0.60);
					color: #6B4CFF;
					font-family: "PingFang SC";
					font-size: 12px;
					font-style: normal;
					font-weight: 500;
					line-height: 14px;
					/* 116.667% */
				}
			}
		}

		.menu-box {
			margin: 0 16px;
			border-radius: 12px;
			overflow: hidden;
		}

		.menu-item {
			background: #FFF;
			padding: 16px;
			display: flex;
			align-items: center;

			.menu-item-icon {
				// border: 1px solid red;
				width: 20px;
				height: 20px;
				margin-right: 12px;

				&.aubout-us-icon {
					background: url("../../static/user-center/about.svg") center/20px 20px no-repeat;
				}

				&.feedback-icon {
					background: url("../../static/user-center/feedback.svg") center/20px 20px no-repeat;
				}

				&.history-icon {
					background: url("../../static/user-center/history.svg") center/20px 20px no-repeat;
				}

				&.logout-icon {
					background: url("../../static/user-center/logout.svg") center/20px 20px no-repeat;
				}

				// img {
				// 	width: 100%;
				// 	height: 100%;
				// }
			}

			.menu-item-title {
				flex: 1;
				display: flex;
				align-items: center;
				color: #221F33;
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 500;
				line-height: 20px;
				/* 142.857% */
			}

			.menu-item-more {
				width: 16px;
				height: 16px;
				background: url('../../static/user-center/arrow.svg') center/100% auto no-repeat;
			}
		}
	}
</style>