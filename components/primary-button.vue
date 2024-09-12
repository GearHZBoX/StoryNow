<template>
	<view @click="click" :style="style" :class="`primary-button ${disabled ? 'primary-button-disabled' : ''} ${className}`">
		<text class="primary-button-text">
			<slot></slot>
		</text>
	</view>
</template>

<script>
	export default {
		name:"primary-button",
		emits: ['click'],
		props: {
			className: String,
			disabled: Boolean,
			style: String,
		},
		methods: {
			click(e) {
				if (this.disabled) {
					return;
				}
				this.$emit('click', e);
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.primary-button {
		padding: 12px 32px;
		background-color: rgba(152, 131, 252, 1);
		border-radius: 27px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		
		&-text {
			color: var(--light-function-00, #FFF);
			text-align: center;
			
			/* Title/medium */
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: 20px; /* 142.857% */
		}
	}
	
	.primary-button-disabled {
		background-color: #cbc0fc;
	}
</style>