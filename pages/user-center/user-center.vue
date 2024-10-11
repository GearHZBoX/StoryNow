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
			<i class="king" v-if="vipStatus==3"></i>
			<i class="king expire" v-else-if="vipStatus==2"></i>
		</view>

		<view class="vip-time" v-if="vipStatus==3" @click="toPage('/pages/to-vip/to-vip',true)">
			vip valid until {{userInfo.vip.duration[1]}}  <view class="to-vip">Renew</view>
		</view>
		<view class="vip-time expire" v-else-if="vipStatus==2" @click="toPage('/pages/to-vip/to-vip',true)">
			vip expired on  {{userInfo.vip.duration[1]}}  <view class="to-vip">Renew</view>
		</view>

		<view class="vip-box" v-if="vipStatus!=3" @click="toPage('/pages/to-vip/to-vip',true)">
			<view class="vip-left-box">
				<view class="vip-title">Open Storynow Membership</view>
				<view class="vip-desc">Access to popular content across all platforms.</view>
			</view>
			<view class="vip-right" >
				<text>0.3</text>$/day
			</view>
		</view>

		<view class="history" v-if="readHsitory">
			<view class="menu-item">
				<view class="menu-item-icon history-icon ">
				</view>
				<view class="menu-item-title">History</view>
				<!-- <view class="menu-item-more"></view> -->
			</view>

			<view class="read-continue" >
				<text class="summary"> {{readHsitory.title}}
				</text>
				<view class="continue" @click="toHistory">continue</view>
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
			
			<view class="menu-item" v-if="hasLogin" @click="logoff">
				<view class="menu-item-icon logout-icon">
				</view>
				<view class="menu-item-title">Cancel Account</view>
				<view class="menu-item-more"></view>
			</view>
			
			<!-- <button @click="toTest"> 测试文件解析</button> -->
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
	import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';
	import {
		store,
		mutations
	} from "@/uni_modules/uni-id-pages/common/store.js";

	export default {
		mixins: [mixin],
		computed: {
			userInfo() {
				return store.userInfo || {};
			},
			hasLogin() {
				return store.hasLogin
			},
		},
		data() {
			return {
				readHsitory: null
			};
		},
		onShow() {
			console.log("用户信息", store.userInfo)
			try {
				const readHsitory = uni.getStorageSync('readHsitory');
				this.readHsitory = JSON.parse(readHsitory);
				console.log("历史记录",this.readHsitory )
			} catch (e) {
				console.log("暂无历史记录")
			}

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
							mutations.logout()
						} else if (res.cancel) {
							console.log('用户点击取消1');
						}
					}
				});
			},

			toHistory() {
				console.log("滚动条跳转",this.readHsitory.scrollTop)
				uni.navigateTo({
					url: `/pages/reader/reader?id=${this.readHsitory._id}&title=${this.readHsitory.title}&scrollTop=${this.readHsitory.scrollTop}`
				})
			},
			
			logoff(){
				uni.navigateTo({
					url:"/uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate"
				})	
			},
			
			toTest(){
				uni.chooseFile({
				  count: 1, 
				  type:"all",
					success:  (res)=> {
						console.log(JSON.stringify(res.tempFilePaths));
						this.uploadImg(res.tempFilePaths[0])
					}
				});
			},
			
			uploadImg(filePath) {
				uni.showLoading({
					title: 'uploading...'
				});
				uniCloud.uploadFile({
					filePath: filePath,
					cloudPath: `/storyExcle/${new Date().getTime()}.xlsx`,
					cloudPathAsRealPath: true,
					success: (res) => {
						console.log("文件上传成功", res.fileID)
						// this.imgList.push(res.fileID);
					},
					fail(err) {
						console.log("文件上传失败", err)
						uni.showToast({
							title: "文件上传失败"
						})
					},
					complete() {
						uni.hideLoading()
					}
				});
			},
		},
	};
</script>

<style lang="scss">
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
		background: $light_brand_04 url("../../static/img_bg.png") top/100% auto no-repeat;

		.login-status-box {
			height: 44px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin: 68px 24px 0px;
			border:1px soilid red;
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

				&.expire {
					background: url('../../static/user-center/no_king.svg') center/100% auto no-repeat;
				}
			}
		}

		.vip-time {
			margin: 0px 24px 10px;
			color:$light_membership_02;
			font-size: 12px;
			font-style: normal;
			font-weight: 400;
			line-height: 16px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&.expire{
				color:$light_text_gray4;
			}
			.to-vip{
				background: var(--vip, linear-gradient(90deg, #FCEBB1 0.26%, #F2D38D 99.82%));
				color: var(--light-membership-01, #483510);
				font-family: "Open Sans";
				font-size: 16px;
				font-style: normal;
				font-weight: 400;
				line-height: 20px;
				padding: 8px 15px;
				border-radius: 24px;
			}
		}

		.vip-box {
			border: 1px solid red;
			margin: 6px 24px 0;
			padding: 12px 16px;
			background: $light_membership_04;
			border: 1px solid white;
			border-radius: 12px 12px 0 0;
			display: flex;
			align-items: center;
			justify-content: space-around;

			.vip-left-box {
				display: flex;
				flex-direction: column;

				.vip-title {
					color: $light_membership_01;
					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 500;
					line-height: 20px;
					/* 142.857% */
				}

				.vip-desc {
					color: $light_membership_02;
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
				background: $light_membership_03;
				margin-left: 16px;
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				color: $light_membership_01;
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;

				text {
					color: $light_membership_01;
					font-family: Roboto;
					font-size: 14px;
					font-style: normal;
					font-weight: 600;
				}
			}
		}

		.history {
			margin: 0 16px 0;
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
				background: $light_brand_03;

				.summary {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					flex-wrap: nowrap;
					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 400;
					line-height: 20px;
					height: 20px;
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
					color: $light_brand_01;
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
				color: $light_text_gray1;
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