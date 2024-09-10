<template>
	<view class="to-vip-page">
		<fixed-header backIcon id="navigator" :style="headerStyle">
			<view class="navigator-text">
				Become VIP Member
			</view>
		</fixed-header>

		<view class="pay-content">
			<view class="pay-content-title">
				<view class="title-icon"></view>
				VIP Member
			</view>

			<view class="pay-item-list">
				<view :class="`pay-item ${activeItem.id == item.id?'active':''}`" v-for="item in priceItemList" :key="item.id" @click="toSelect(item)">
					<view class="money">
						$<text>{{item.money}}</text>
					</view>
					<view class="desc">{{item.desc}}</view>
					<view class="notice">{{item.notice}}</view>
					<view class="select"></view>
				</view>
			
			</view>

			<view class="agreement-box" @click="toChecked">
				<view :class="`check-box ${checked?'active':''}`"></view>
				<view class="agreement">
					I have read and agree to the
					<text>
						"Continuous Subscription Service Agreement", the "StoryNow Membership Service Agreement", and
						the "Payment Agreement"
					</text>
				</view>
			</view>

			<view class="submit">
				Confirm and pay
			</view>
		</view>

		<view class="tip">
			<text class="tip-title">Tip:</text>
			<text>After confirming the purchase, your iTunes account will be charged. The auto-renewal will charge your
				iTunes account within 24 hours before the subscription expires. Before this, you can manually turn off
				auto-renewal in your iTunes/Apple ID settings.</text>
		</view>
	</view>
</template>

<script>
	import fixedHeader from '../../components/fixed-header.vue';
	export default {
		components: {
			fixedHeader,
		},
		data() {
			return {
				headerStyle: "background:rgba(0,0,0,0)",
				checked:false,
				activeItem:{},
				priceItemList:[
					{
						id:1,
						money:19,
						desc:"Read all VIP stories",
						notice:'30 day monthly package'
					},
					{
						id:2,
						money:19,
						desc:"Read all VIP stories",
						notice:'30 day monthly package'
					},
					{
						id:3,
						money:19,
						desc:"Read all VIP stories",
						notice:'30 day monthly package'
					},{
						id:4,
						money:1999,
						desc:"Read all VIP stories",
						notice:'30 day monthly package'
					},
					{
						id:5,
						money:165599,
						desc:"Read all VIP stories",
						notice:'30 day monthly package'
					}
				]
			}
		},
		onPageScroll({
			scrollTop
		}) {
			console.log(scrollTop)
			if (scrollTop < 60) {
				this.headerStyle = "background:rgba(0,0,0,0)";
			} else {
				this.headerStyle = "background:#F3DDAD";
			}
		},
		methods: {
			toChecked(){
				this.checked = !this.checked;
			},
			
			toSelect(item){
				this.activeItem = item;
			},

			toPay(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.to-vip-page {
		position: relative;
		box-sizing: border-box;
		background: #F6F6F9 url('../../static/user-center/pay_bg.png') top/100% auto no-repeat;

		.navigator-text {
			flex: 1;
			padding-right: 40px;
			text-align: center;
			color: var(--light-text-gray01, #221F33);
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

		.pay-content {
			margin-top: 30px;
			box-sizing: border-box;
			padding: 16px 16px 32px;
			border-radius: 20px;
			background: var(--light-function-00, #FFF);

			.pay-content-title {
				width: 100%;
				height: 44px;
				box-sizing: border-box;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				overflow: hidden;
				color: var(--light-text-gray01, #221F33);
				font-family: "Open Sans";
				font-size: 16px;
				font-style: normal;
				font-weight: 400;

				.title-icon {
					width: 20px;
					height: 20px;
					margin-right: 8px;
					background: url("../../static/pay/king.svg") center/100% auto no-repeat;
				}
			}

			.pay-item-list {
				margin-top: 8px;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.pay-item {
					width: 162px;
					height: 96px;
					margin-bottom: 10px;
					flex-grow: 0;
					flex-shrink: 0;
					box-sizing: border-box;
					position: relative;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					border-radius: 16px;
					overflow: hidden;
					position: relative;
					background: url("../../static/pay/pay_item.svg") center/100% auto no-repeat;

					&.active {
						border: 2px solid var(--light-membership-03, #F8D177);
						background: url("../../static/pay/item_bg_active.svg") center/100% auto no-repeat !important;

						.select {
							display: block;
						}

						.notice {
							color: var(--light-membership-01, #483510);
							background: var(--light-membership-03, #F8D177);
						}
					}

					.select {
						width: 20px;
						height: 20px;
						position: absolute;
						right: 0px;
						top: 0px;
						z-index: 10;
						display: none;
						background: url("../../static/pay/select.svg") center/100% auto no-repeat !important;
					}

					.money {
						color: var(--light-membership-01, #483510);
						text-align: center;
						font-family: Roboto;
						font-size: 16px;
						margin-top: 16px;
						font-style: normal;
						font-weight: 700;
						line-height: 28px;

						/* 175% */
						text {
							color: var(--light-membership-01, #483510);
							/* numeral/price */
							font-family: Roboto;
							font-size: 24px;
							font-style: normal;
							font-weight: 700;
							line-height: 28px;
						}
					}

					.desc {
						color: var(--light-membership-02, #A68332);
						text-align: center;
						margin-top: 2px;
						/* label/regular */
						font-family: "PingFang SC";
						font-size: 10px;
						font-style: normal;
						font-weight: 400;
						line-height: 12px;
						/* 120% */
					}

					.notice {
						width: 100%;
						height: 24px;
						display: flex;
						justify-content: center;
						align-items: center;
						box-sizing: border-box;
						padding: 0 4px;
						position: absolute;
						bottom: 0px;
						background: var(--light-membership-04, #FCEDCF);
						color: var(--light-membership-02, #A68332);
						text-align: center;

						/* body/regular */
						font-family: "Open Sans";
						font-size: 12px;
						font-style: normal;
						font-weight: 400;
						line-height: 16px;
						/* 133.333% */
					}
				}
			}

			.agreement-box {
				display: flex;
				margin-top: 20px;
				color: var(--light-text-gray03, #919099);

				/* body/regular */
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 16px;

				/* 133.333% */
				.check-box {
					width: 16px;
					height: 16px;
					flex-shrink: 0;
					flex-grow: 0;
					margin-right: 8px;
					background: url("../../static/pay/checkbox_no.svg") center/100% auto no-repeat;

					&.active {
						background: url("../../static/pay/checkbox.svg") center/100% auto no-repeat;
					}
				}

				text {
					color: var(--light-membership-02, #A68332);
					/* body/regular */
					font-family: "Open Sans";
					font-size: 12px;
					font-style: normal;
					font-weight: 400;
					line-height: 16px;
				}
			}

			.submit {
				width: 343px;
				height: 50px;
				margin-top: 8px;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-shrink: 0;
				border-radius: 50px;
				background: var(--vip, linear-gradient(90deg, #FCEBB1 0.26%, #F2D38D 99.82%));
				color: var(--light-membership-01, #483510);
				text-align: center;

				/* Title/medium */
				font-family: "Open Sans";
				font-size: 16px;
				font-style: normal;
				font-weight: 400;
				line-height: 20px;
				/* 125% */
			}
		}

		.tip {
			margin-top: 20px;
			padding: 0 16px 16px;
			display: flex;
			flex-direction: column;

			.tip-title {
				color: var(--light-text-gray02, #605C73);
				margin-bottom: 2px;
				/* body/regular */
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 16px;
				/* 133.333% */
			}

			text {
				color: var(--light-text-gray02, #605C73);
				/* body/regular */
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 16px;
				/* 133.333% */
			}
		}
	}
</style>