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
	uni-page-body{
		height:100%;
	}
	.user-center-page {
		display: flex;
		flex-direction: column;
		height: 100%;
		border: 1rpx solid red;
		background: pink;

		.login-status-box {
			height: 88rpx;
			border: 1rpx solid black;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin: 48rpx;
			font-family: "Open Sans";
			font-size: 40rpx;
			font-style: normal;
			font-weight: 600;
			line-height: 56rpx;

			.head-img {
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
				border: 2rpx solid red;
				margin-right: 28rpx;
			}

			i {
				width: 32rpx;
				height: 32rpx;
				border: 2rpx solid red;
				margin-left: 12rpx;
			}
		}

		.vip-box {
			border: 1rpx solid red;
			margin: 0 48rpx;
			padding: 24rpx 32rpx;
			background: #FCEDCF;
			border: 2rpx solid white;
			border-radius: 24rpx 24rpx 0 0;
			display: flex;
			align-items: center;
			justify-content: space-around;

			.vip-left-box {
				display: flex;
				flex-direction: column;

				.vip-title {
					color: #483510;
					font-family: "PingFang SC";
					font-size: 28rpx;
					font-style: normal;
					font-weight: 500;
					line-height: 40rpx;
					/* 142.857% */
				}

				.vip-desc {
					color: #A68332;
					font-family: "Open Sans";
					font-size: 24rpx;
					font-style: normal;
					font-weight: 400;
					line-height: 32rpx;
					/* 133.333% */
				}
			}

			.vip-right {
				width: 160rpx;
				height: 72rpx;
				padding: 16rpx 40rpx;
				border-radius: 80rpx;
				background: #F8D177;
				margin-left: 32rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #483510;
				font-family: "Open Sans";
				font-size: 24rpx;
				font-style: normal;
				font-weight: 400;

				text {
					color: #483510;
					font-family: Roboto;
					font-size: 28rpx;
					font-style: normal;
					font-weight: 600;
				}
			}
		}

		.history {
			margin: 0 32rpx;
			border-radius: 24rpx;
			overflow: hidden;
			margin-bottom: 24rpx;
			background: white;
			.read-continue{
				margin:0 24rpx;
				border-radius: 24rpx;
				padding: 24rpx;
				margin-bottom: 32rpx;
				display: flex;
				align-items: center;
				background:  #F0EDFF;
				text{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-family: "PingFang SC";
					font-size: 28px;
					font-style: normal;
					font-weight: 400;
					line-height: 40px; 
				}
				.continue{
					display: flex;
					justify-content: center;
					align-items: center;
					display: flex;
					height: 56rpx;
					padding: 16rpx 24rpx;
					justify-content: center;
					align-items: center;
					border-radius: 40rpx;
					background: rgba(255, 255, 255, 0.60);
					color: #6B4CFF;
					font-family: "PingFang SC";
					font-size: 24rpx;
					font-style: normal;
					font-weight: 500;
					line-height: 28rpx; /* 116.667% */
				}
			}
		}

		.menu-box {
			margin: 0 32rpx;
			border-radius: 24rpx;
			overflow: hidden;
		}

		.menu-item {
			background: #FFF;
			padding: 32rpx;
			display: flex;
			align-items: center;

			.menu-item-icon {
				border: 1rpx solid red;
				width: 40rpx;
				height: 40rpx;
				margin-right: 24rpx;
			}

			.menu-item-title {
				flex: 1;
				display: flex;
				align-items: center;
				color: #221F33;
				font-family: "PingFang SC";
				font-size: 28rpx;
				font-style: normal;
				font-weight: 500;
				line-height: 40rpx;
				/* 142.857% */
			}

			.menu-item-more {
				width: 32rpx;
				height: 32rpx;
				border: 1rrpx solid red;
			}
		}
	}
</style>