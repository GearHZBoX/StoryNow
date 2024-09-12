<template>
	<view :id="id">
		<view :class="`fixed-header ${className}`" :style="style">
			<uni-icons v-if="backIcon" type="left" class="fixed-header-icon" @click="goBack()"></uni-icons>
			<text v-if="title" class="fixed-header-title">{{title}}</text>
			<slot></slot>
		</view>
		<view class="header-padding"></view>
	</view>
</template>

<script>
	export default {
		name: "fixed-header",
		props: {
			title: [String, Number],
			backIcon: Boolean,
			className: String,
			style: String,
			id: String,
		},
		data() {
			return {

			};
		},
		methods: {
			goBack(url) {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fixed-header {
		height: 44rpx;
		padding: 4rpx 16rpx;
		display: flex;
		align-items: center;
		column-gap: 10rpx;
		position: fixed;
		background-color: #ffffff;
		width: calc(100% - 35rpx);
		padding-top: 80rpx;
		padding-bottom: 16px;
		z-index: 100;

		&-icon {
			font-weight: bolder;
			font-size: 40rpx !important;
			width: 40rpx;
		}

		&-title {
			font-weight: bolder;
			font-size: 35rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.header-padding {
		padding-top: 120rpx;
	}
</style>