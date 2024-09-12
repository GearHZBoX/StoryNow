<template>
	<view class="divider-view">
		<view class="prefix-line"></view>
		<text v-if="text" class="divider-text">{{text}}</text>
		<view class="suffix-line"></view>
	</view>
</template>

<script>
	export default {
		name: "divider",
		props: {
			text: String,
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.divider-view {
		display: flex;
		flex-direction: row;
		height: 5px;
		align-items: center;
	}

	.prefix-line {
		flex: 1;
		border-top: 1px solid;
		border-image: linear-gradient(to right, rgba(96, 92, 115, 0) 0%, rgba(150, 149, 157, 1) 100%);
		border-image-slice: 10% 0;
		border-image-repeat: stretch;
	}

	.divider-text {
		overflow: hidden;
		color: var(--light-text-gray03, #919099);
		text-overflow: ellipsis;

		/* body/regular */
		font-family: "Open Sans";
		font-size: 12px;
		font-style: normal;
		font-weight: 400;
		line-height: 16px;
		
		padding: 0 6px;
		
		lines: 1;
		/* 133.333% */
	}

	.suffix-line {
		flex: 1;
		border-top: 1px solid;
		border-image: linear-gradient(to left, rgba(96, 92, 115, 0) 0%, rgba(150, 149, 157, 1) 100%);
		border-image-slice: 10% 0;
		border-image-repeat: stretch;
	}
</style>