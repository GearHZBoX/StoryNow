<template>
	<view>
		<static-header-vue></static-header-vue>
		<view class="main">
			<image class="main-image" src="../../static/tick-success.png"></image>
			<text class="main-title">Payment success</text>
			<text class="main-desc">
				You can check your order from 
				<text class="link">
					here
				</text>
			</text>
		</view>
	</view>
</template>

<script>
	import staticHeaderVue from '../../components/static-header.vue';
	
	export default {
		data() {
			return {
				status: '',
			};
		},
		components: {
			staticHeaderVue,
		},
		onLoad(query) {
			this.status = query.status;
		}
	}
</script>

<style lang="scss">
	
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 50px;
		
		&-image {
			width: 100px;
			height: 100px;
			margin-bottom: 20px;
		}
		
		&-title {
			line-height: 40px;
		}
		
		&-desc {
			color: $light_text_gray3;
			font-size: 14px;
		}
		
		.link {
			color: $light_brand_02;
		}
	}
</style>
