<template>
	<view class="user-center-page">
		<!-- 登录状态 -->
		<view class="login-status-box">
			<img src="" class="head-img" />
			Login in
			<i></i>
		</view>

		<view class="vip-box">
			<view class="vip-left-box">
				<view class="vip-title">Open Storynow Membership</view>
				<view class="vip-desc">Access to popular content across all platforms.</view>
			</view>
			<view class="vip-right">
				<text>0.3</text>$/day
			</view>
		</view>

		<view class="history">
			<view class="menu-item">
				<view class="menu-item-icon"></view>
				<view class="menu-item-title">历史记录</view>
				<view class="menu-item-more"></view>
			</view>
			
			<view class="read-continue">
					<text>Stepford Wives Literature's Overbearing President Loves Meg husband gets punished!
</text>
					<view class="continue">continue</view>
			</view>
		</view>

		<view class="menu-box">
			<view class="menu-item">
				<view class="menu-item-icon"></view>
				<view class="menu-item-title">标题</view>
				<view class="menu-item-more"></view>
			</view>
			<view class="menu-item">
				<view class="menu-item-icon"></view>
				<view class="menu-item-title">标题2</view>
				<view class="menu-item-more"></view>
			</view>
		</view>


		<!-- 	<view>用户信息</view>
		<view>{{JSON.stringify(userInfo, null, 2)}}</view>
		<button v-if="!userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/login/login-withpwd')">登录</button>
		<button v-if="!userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/register/register')">注册</button>
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
		data() {
			return {
				userInfo: store.userInfo,

				menuList: [{

				}]
			};
		},
		methods: {
			goto(url) {
				uni.navigateTo({
					url,
				});
			},
			logout() {
				mutations.logout();
			},
		},
	};
</script>

<style lang="scss" scoped>
	.user-center-page {
		display: flex;
		flex-direction: column;
		height: 100%;
		border: 1px solid red;

		.login-status-box {
			width: 100%;
			height: 44px;
			border: 1px solid black;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin: 24px;
			font-family: "Open Sans";
			font-size: 20px;
			font-style: normal;
			font-weight: 600;
			line-height: 28px;

			.head-img {
				width: 44px;
				height: 44px;
				border-radius: 50%;
				border: 1px solid red;
				margin-right: 14px;
			}

			i {
				width: 16px;
				height: 16px;
				border: 1px solid red;
				margin-left: 6px;
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
			.read-continue{
				margin:0 12px;
				border-radius: 12px;
				padding: 12px;
				margin-bottom: 16px;
				display: flex;
				align-items: center;
				background: var(--light-brand-03, #F0EDFF);
				text{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.continue{
					display: flex;
					justify-content: center;
					align-items: center;
					display: flex;
					height: 28px;
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
					line-height: 14px; /* 116.667% */
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
				border: 1px solid red;
				width: 20px;
				height: 20px;
				margin-right: 12px;
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
				border: 1px solid red;
			}
		}
	}
</style>