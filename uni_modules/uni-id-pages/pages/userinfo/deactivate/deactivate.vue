<!-- 注销（销毁）账号 -->
<template>
	<view class="uni-content">
		<fixed-header backIcon id="navigator" style="background: var(--light-brand-04, #F6F6F9);">
			<view class="navigator-text">
				Cancel Account
			</view>
		</fixed-header>
		<text class="words">
			First, the cancellation is irreversible operation, after the cancellation :\n
			1. The account cannot be logged in or retrieved. \n
			2. All account information will be cleared. Please back up the information yourself
			Information and data. \n

			Two, important tips
			1. Blocked accounts (permanent block, social block, live streaming permission block) cannot be cancelled. \n
			2. After the cancellation, the binding relationship between your ID card, third-party account (facebook,
			google), mobile phone number, etc. will be removed, and you can be bound to other accounts after the
			cancellation. \n
			3. After you log out, you can register a new account. The new account does not contain any information about
			the previous account. \n
			4. Before you cancel the application account, handle the fund problem in the account as soon as possible. \n
			5. Depending on the specific account, it takes up to 7 days to cancel. \n
		</text>
		<view class="button-group">
			<button @click="nextStep" class="next" type="default">Confirm</button>
			<button @click="cancel" type="warn">Cancel</button>
		</view>
	</view>
</template>

<script>
	import fixedHeader from '../../../../../components/fixed-header.vue';
	import {
		store,
		mutations
	} from "@/uni_modules/uni-id-pages/common/store.js";
	export default {
		components: {
			fixedHeader,
		},
		data() {
			return {

			}
		},
		onLoad() {},
		methods: {
			cancel() {
				uni.navigateBack()
			},
			nextStep() {
				uni.showModal({
					confirmText: "Confirm",
					cancelText: "Cancel",
					content: 'Have carefully read the logout prompt, understand the possible consequences, and confirm that you want to logout?',
					complete: (e) => {
						if (e.confirm) {
							const uniIdco = uniCloud.importObject("uni-id-co");
							uniIdco.closeAccount().then((e) => {
								uni.showToast({
									icon:"none",
									title: 'Cancel Account Success',
									duration: 3000
								});
								uni.removeStorageSync('uni_id_token');
								uni.setStorageSync('uni_id_token_expired', 0)
								uni.switchTab({
									url: "/pages/index/index"
								})
								uni.$emit('uni-id-pages-logout')
								mutations.setUserInfo({},{cover:true})
							}).catch((err)=>{
								console.log("注销失败",err)
							})
						} else {
							uni.navigateBack()
						}
					}
				});
			}
		}
	}
</script>

<style>
	.uni-content {
		display: flex;
		flex-direction: column;
		font-size: 28rpx;

		.navigator-text {
			flex: 1;
			padding-right: 40px;
			text-align: center;
			color: var(--light-text-gray01, $light_text_gray1);
			text-align: center;
			text-overflow: ellipsis;
			white-space: nowrap;
			/* Title/medium */
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: 20px;
			/* 142.857% */
		}
	}

	.words {
		padding: 30px 16px;
		color: $light_text_gray2;
		font-family: "PingFang SC";
		white-space: pre-wrap;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 20px;
		/* 142.857% */
	}

	.button-group button {
		border-radius: 100px;
		border: none;
		width: 300rpx;
		height: 42px;
		line-height: 42px;
		font-size: 32rpx;
		border-radius: 27px;
		background: var(--light-brand-02, #9883FC);
	}

	.button-group button:after {
		border: none;
	}

	.button-group button.next {
		border: 0.5px solid var(--light-brand-02, #9883FC);
		background: $light_brand_03;
		color: $light_brand_01;

	}

	.button-group {
		display: flex;
		flex-direction: row;
		position: fixed;
		height: 50px;
		bottom: 10px;
		width: 750rpx;
		justify-content: center;
		align-items: center;
		border-top: solid 1px #e4e6ec;
		padding-top: 10px;
		background-color: $light_function_01;
		max-width: 690px;
	}


	@media screen and (min-width: 690px) {
		.uni-content {
			max-width: 690px;
			margin-left: calc(50% - 345px);
		}
	}
</style>