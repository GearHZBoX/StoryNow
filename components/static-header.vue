<template>
	<view :style="style" :id="id" class="static-header">
		<uni-icons v-if="backIcon" type="left" class="static-header-icon" @click="goBack()"></uni-icons>
		<slot />
	</view>
</template>

<script>
	export default {
		name:"static-header",
		props: {
			id: String,
			backIcon: {
				type: Boolean,
				default: true,
			},
			navigateBackOptions: Object,
			style: String,
		},
		methods: {
			goBack() {
				uni.navigateBack(this.navigateBackOptions);
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.static-header {
		height: 44rpx;
		padding: 4rpx 16rpx;
		display: flex;
		align-items: center;
		column-gap: 10rpx;
		padding-top: 80rpx;
		padding-bottom: 16px;
		
		&-icon {
			font-weight: bolder;
			font-size: 40rpx !important;
			width: 40rpx;
		}
	}
</style>