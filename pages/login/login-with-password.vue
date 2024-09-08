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
			<text class="sign-in-view-title">Sign In</text>
			<uni-easyinput :placeholder-style="placeholderStyle" class="sign-in-view-title-username"
				placeholder="Enter the username">
				<template #left>
					<uni-icons :size="24" color="rgba(145, 144, 153, 1)" class="input-prefix" type='person-filled'></uni-icons>
				</template>
			</uni-easyinput>
			<uni-easyinput :placeholder-style="placeholderStyle" class="sign-in-view-title-password"
				placeholder="Password" type="password">
				<template #left>
					<uni-icons :size="24" color="rgba(145, 144, 153, 1)" class="input-prefix" type='locked-filled'></uni-icons>
				</template>
			</uni-easyinput>
		</view>
	</view>
</template>

<script>
	import StaticHeader from '../../components/static-header.vue'
	import UniEasyinput from '../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue'
	export default {
		components: {
			StaticHeader,
			UniEasyinput,
		},
		data() {
			return {
				placeholderStyle: `
		color: var(--light-text-gray04, #C0C0CC);
		font-family: "Open Sans";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px;`,
			}
		},
		methods: {

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
				color: var(--light-text-gray01, #221F33);
				font-family: "SF UI Display";
				font-size: 24px;
				font-style: normal;
				font-weight: 600;
				line-height: normal;
			}

			&-sub {
				color: var(--light-text-gray03, #919099);

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
			color: var(--light-text-gray01, #221F33);
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
					background: #f6f6f9 !important;
					padding: 8px;
					border-radius: 12px;
				}

				.uni-easyinput__content-input {
					background: #f6f6f9;
					border-radius: 12px;
				}

				.input-prefix {
					padding-left: 12px;
					padding-right: 8px;
				}
			}
		}

	}

	.login-input-placeholder {
		color: var(--light-text-gray04, #C0C0CC);
		font-family: "PingFang SC";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px;
	}
</style>