<template>
	<view class="to-vip-page">
		<fixed-header backIcon id="navigator" :style="headerStyle">
			<view class="navigator-text">
				{{vipStatus === 3 ? 'Prolong VIP Period' : 'Become VIP Member'}}
			</view>
		</fixed-header>

		<view class="pay-content">
			<view class="pay-content-title">
				<view class="title-icon"></view>
				VIP Member
			</view>

			<view class="pay-item-list">
				<view :class="`pay-item ${activeItem._id == item._id?'active':''}`" v-for="item in priceItemList"
					:key="item._id" @click="toSelect(item)">
					<view class="money">
						$<text>{{item.amount}}</text>
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

			<view class="submit" @click="choosePaymentMethods()">
				{{confirmText}}
			</view>
		</view>

		<view class="tip">
			<text class="tip-title">Tip:</text>
			<text>After confirming the purchase, your iTunes account will be charged. The auto-renewal will charge your
				iTunes account within 24 hours before the subscription expires. Before this, you can manually turn off
				auto-renewal in your iTunes/Apple ID settings.</text>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="confirm-view">
				<view class="confirm-popup">
					<text class="confirm-popup-title">
						Payment methods
					</text>
					<view class="google-pay-btn" @click="toCreateOrder('google')">
						<image src="../../static/Google Logo.svg" class="c-icon"></image>
						<text class="c-text">Pay</text>
					</view>
					<view class="paypal-pay-btn" @click="toCreateOrder('paypal')">
						<image src="../../static/paypal.png" class="c-icon"></image>
					</view>
				</view>
				<view @click="$refs.popup.close()" class="confirm-view-footer" hover-class="confirm-view-footer-hover">
					<text>Cancel</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';
	import fixedHeader from '../../components/fixed-header.vue';
	import {
		importObjectConfig
	} from "../../utils/index.js"
	import {
		store,
		mutations
	} from "@/uni_modules/uni-id-pages/common/store.js";
import { map } from 'lodash';
import { debounce } from 'lodash';

	const PayOrderCloud = importObjectConfig('pay-order');

	const PaypalCloud = importObjectConfig('paypal');

	const PriceConfigCloud = importObjectConfig('price-config')
	export default {
		mixins: [mixin],
		components: {
			fixedHeader,
		},
		computed: {
			// 1 == 非vip   2 = vip已过期  3 = vip
			confirmText() {
					if(this.vipStatus==3){
						return "Confirm payment to increase VIP validity"
					}else if(this.vipStatus==2){
						return "Confirm payment to become a VIP again"
					}else {
						return "Confirm payment to become a new VIP"
					}
			}
		},
		data() {
			return {
				headerStyle: "background:rgba(0,0,0,0)",
				checked: false,
				activeItem: {},
				priceItemList: [],
				showOrderCheck: false,
			}
		},
		onLoad() {
			this.getPriceConfig();
		},
		onPageScroll({
			scrollTop
		}) {
			if (scrollTop < 60) {
				this.headerStyle = "background:rgba(0,0,0,0)";
			} else {
				this.headerStyle = "background:#F3DDAD";
			}
		},
		methods: {
			async test() {
				const a = await PayOrderCloud.testUpdate();
				console.log("测试更新1", a);
			},

			async getPriceConfig() {
				const res = await PriceConfigCloud.getPriceConfig();
				console.log("测试", res)
				if (res.data) {
					this.priceItemList = res.data;
					this.setMax();
				}
			},

			toChecked() {
				this.checked = !this.checked;
			},

			toSelect(item) {
				this.activeItem = item;
			},
			
			choosePaymentMethods() {
				if (!this.activeItem._id) {
					uni.showToast({
						icon: "none",
						title: 'Please select the payment item first'
					})
					return;
				}
				
				if (!this.checked) {
					uni.showModal({
						title: 'Do you agree to the agreement?',
						content: 'You can only make the payment after agreeing to the terms',
						cancelText: "Cancel",
						confirmText: "Confirm",
						success: (res) => {
							if (res.confirm) {
								this.checked = true;
							} else if (res.cancel) {
								console.log('用户点击取消1');
							}
						}
					});
					return;
				}
				
				this.$refs.popup.open();
			},
			
			googlePayHandler({
				success,
				fail,
			}) {
				plus.payment.getChannels((providers) => {
					let provider = providers.find(function(e) {
						return e.id === "google-pay";
					});
					
					console.log('provide', provider, this.activeItem);

					let paymentMethodType = "CARD";
					
					let cardPaymentMethodConfig = {
						environment: 3, // 必填 1 是product  3是test
						paymentMethodType: paymentMethodType, //必填 CARD、PAYPAL
						existingPaymentMethodRequired: false, //可选 如果设置为true同时已经准备好了支付allowedPaymentMethods中的付款方式，isReadyToPay就会返回true。
					
						currencyCode: "USD", //必填
						countryCode: "US", //在欧洲经济区必填
						transactionId: "", //当你想要接收googlepay回调的时候必填
						totalPriceStatus: "FINAL", //必填  NOT_CURRENTLY_KNOWN、ESTIMATED、FINAL
						totalPrice: String(this.activeItem.amount), //必填 满足正则格式^[0-9]+(\.[0-9][0-9])?$
						// totalPriceLabel: "100heelo", //可选
						// checkoutOption: "DEFAULT", //可选 DEFAULT、COMPLETE_IMMEDIATE_PURCHASE
					
						// merchantName: "Example Merchant", //可选
						// emailRequired: true, //可选
						// shippingAddressRequired: true, //可选
						// shippingPhoneNumberRequired: false, //可选
						// allowedCountryCodes: ["US", "GB"], //可选
						allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"], //必填
						allowedCardNetworks: ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"], //必填
						// allowPrepaidCards: false, //可选
						// // allowCreditCards:false,//可选  
						// assuranceDetailsRequired: false, //可选
						// billingAddressRequired: true, //可选
						// billingAddressParametersFormat: "FULL", //可选 MIN
						// phoneNumberRequired: false, //可选
						// tokenizationSpecificationType: "PAYMENT_GATEWAY", //必填 PAYMENT_GATEWAY、DIRECT
						// gateway: "stripe", //PAYMENT_GATEWAY时必填
						// gatewayMerchantId: "exampleGatewayMerchantId", //PAYMENT_GATEWAY时必填
						merchantId: "BCR2DN4T6PKY5MIC", //必填
						buildTokenizationSpecification:{//可选，此字段是为了方便开发者自定义构造tokenizationSpecification参数,设置此字段时，会覆盖掉`tokenizationSpecificationType`、`gateway`、`gatewayMerchantId`、`protocolVersion`、`publicKey`字段。(HBuilderX 3.5.1+支持)
							"type":"PAYMENT_GATEWAY",
							"parameters":{
								"gateway": "stripe",
								"stripe:version": '2018-10-31',
								"stripe:publishableKey": "pk_test_51Q2xHaK0pp9uOY0tFBZeZPmUOjxY0xHKzKJ1o40RJ7jSr3UmdW960rJESAyeYn1GCznMGAcAkC0b0rqQab9iyDiE00irGmLNdh"
							}
						}
					};
					

					let paypalPaymentMethodConfig = {
						environment: 3, // 必填 1 是product  3是test
						paymentMethodType: paymentMethodType, //必填 CARD、PAYPAL
						existingPaymentMethodRequired: false, //可选 如果设置为true同时已经准备好了支付allowedPaymentMethods中的付款方式，isReadyToPay就会返回true。

						currencyCode: "USD", //必填
						countryCode: "US", //在欧洲经济区必填
						transactionId: "", //当你想要接收googlepay回调的时候必填
						totalPriceStatus: "FINAL", //必填  NOT_CURRENTLY_KNOWN、ESTIMATED、FINAL
						totalPrice: "111.00", //必填 满足正则格式^[0-9]+(\.[0-9][0-9])?$
						totalPriceLabel: "100heelo", //可选
						checkoutOption: "DEFAULT", //可选 DEFAULT、COMPLETE_IMMEDIATE_PURCHASE

						merchantName: "TIANHE STORY TECHNOLOGY LIMITED", //可选
						// emailRequired: true, //可选
						// shippingAddressRequired: true, //可选
						shippingPhoneNumberRequired: false, //可选
						allowedCountryCodes: ["US", "GB"], //可选
						merchantId: "BCR2DN4T6PKY5MIC", //必填
					};

					let statement;

					if (paymentMethodType === "CARD") {
						statement = {
							...cardPaymentMethodConfig
						};
					} else {
						statement = {
							...paypalPaymentMethodConfig
						};
					}

					console.log(JSON.stringify(statement));

					plus.payment.request(provider, statement, (result) => {
						// console.log("支付成功 :" + JSON.stringify(result));
						success?.(result);
					}, (e) => {
						// console.log("支付失败： " + JSON.stringify(e));
						fail?.(e);
					})
				});
			},

			toCreateOrder: debounce(async function(provider) {
				this.$refs.popup.close();
				
				if (['paypal'].includes(provider)) {
					const res = await PayOrderCloud.createBusinessOrder({
						...this.activeItem,
						provider,
					});
					uni.requestPayment({
						"provider": "paypal",
						"orderInfo": res.paymanet,
						success: (result) => {
							var rawdata = JSON.parse(result.rawdata);
							console.log('---', rawdata);
							this.captureOrder({
								...res,
								days: this.activeItem.days,
							})
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
							uni.showToast({
								title: "payment fail",
								icon: "none"
							})
						}
					});
					return;
				}
				
				if (provider === 'google') {
					const res = await PayOrderCloud.createBusinessOrderV2({
						...this.activeItem,
						provider,
						days: this.activeItem.days,
					});
					this.googlePayHandler({
						success: (result) => {
							var rawdata = JSON.parse(result.rawdata);
							console.log('---', rawdata);
							PayOrderCloud.stripeHandler({
								payResp: rawdata.paymentMethodData.tokenizationData.token,
								id: res.orderInfo.id,
								days: this.activeItem.days,
							}).then(resp => {
								console.log('ggggggg', resp);
								if (resp.errCode === 0) {
									uni.showToast({
										icon: 'none',
										title: 'payment succeeded',
									});
									mutations.updateUserInfo();
									uni.redirectTo({
										url: '/pages/payment-result/payment-result?orderId=' + resp.orderInfo._id,
									});
								} else {
									uni.showToast({
										icon: 'none',
										title: 'payment failed ' + resp.errMsg,
									});
									console.error(resp.errMsg);
								}
							}).catch(err => {
								console.error(err);
								uni.showModal({
									content: JSON.stringify(err),
								})
								uni.showToast({
									icon: 'none',
									title: 'payment failed',
								});
							})
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
							uni.showModal({
								content: JSON.stringify(err),
							})
							uni.showToast({
								title: "payment fail",
								icon: "none"
							})
						}
					})
				}

			}, 200),

			async captureOrder(params) {
				const orderInfo = {
					orderId: params.paymanet.orderId,
					id: params.orderInfo.id,
					days: params.days
				}

				console.log("开始扣款", orderInfo)

				const [err, data] = await PayOrderCloud.captureBusinessOrder(orderInfo);


				console.log("支付结果1", data)
				if (err) {
					uni.showToast({
						icon: "none",
						title: "payment fail"
					})
					return;
				}
				
				uni.showToast({
					icon: "none",
					title: `VIP validity：\r\n ${data?.userInfo?.vip?.duration[0]}-${data?.userInfo?.vip?.duration[1]}`,
					duration: 10 * 1000
				})
				await mutations.updateUserInfo();
				
				uni.redirectTo({
					url: '/pages/payment-result/payment-result?orderId=' + orderInfo.id, 
				});
			},
			
			setMax(){
				this.activeItem = this.priceItemList.find((item)=>{
					console.log(item.isDefault)
					return item.isDefault
				}) 
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	page {
		width: 100%;
		min-height: 100%;
		background-color: $light_brand_04;
	}

	/* #endif */
	.to-vip-page {
		position: relative;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		flex-direction: column;
		background: $light_brand_04 url('../../static/user-center/pay_bg.png') top/100% auto no-repeat;

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

		.pay-content {
			margin-top: 30px;
			box-sizing: border-box;
			padding: 16px 16px 32px;
			border-radius: 20px;
			display: flex;
			flex-direction: column;
			align-items: center;
			background: var(--light-function-00, #FFF);

			.pay-content-title {
				width: 100%;
				height: 44px;
				box-sizing: border-box;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				overflow: hidden;
				color: var(--light-text-gray01, $light_text_gray1);
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
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: center;
				column-gap: 16px;
				padding: 16px;

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
						border: 2px solid var(--light-membership-03, $light_membership_03);
						background: url("../../static/pay/item_bg_active.svg") center/100% auto no-repeat !important;

						.select {
							display: block;
						}

						.notice {
							color: var(--light-membership-01, $light_membership_01);
							background: var(--light-membership-03, $light_membership_03);
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
						color: var(--light-membership-01, $light_membership_01);
						text-align: center;
						font-family: Roboto;
						font-size: 16px;
						margin-top: 16px;
						font-style: normal;
						font-weight: 700;
						line-height: 28px;

						/* 175% */
						text {
							color: var(--light-membership-01, $light_membership_01);
							/* numeral/price */
							font-family: Roboto;
							font-size: 24px;
							font-style: normal;
							font-weight: 700;
							line-height: 28px;
						}
					}

					.desc {
						color: var(--light-membership-02, $light_membership_02);
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
						background: var(--light-membership-04, $light_membership_04);
						color: var(--light-membership-02, $light_membership_02);
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
				color: var(--light-text-gray03, $light_text_gray3);

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
					color: var(--light-membership-02, $light_membership_02);
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
				color: var(--light-membership-01, $light_membership_01);
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
				color: var(--light-text-gray02, $light_text_gray2);
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
				color: var(--light-text-gray02, $light_text_gray2);
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
	
	.confirm-view {
		border-radius: 8px;
		overflow: hidden;
		background-color: #FFF;
		
		&-footer {
			border-top: 1px solid #c1c1c1;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 45px;
			
			text {
				color: $light_text_gray2;
				font-size: 16px;
			}
		}
		
		&-footer-hover {
			background-color: #f1f1f1;
		}
	}
	
	
	.confirm-popup {
		padding: 16px 48px;
		
		&-title {
			color: $light_text_gray3;
			margin-bottom: 15px;
			display: block;
			font-size: 14px;
		}
	}
	
	.google-pay-btn {
		background-color: #000000;
		border-radius: 5px;
		width: 250px;
		height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-bottom: 10px;
		
		.c-text {
			color: #FFF;
		}
		
		.c-icon {
			margin-right: 5px;
			width: 18px;
		}
	}
	
	.paypal-pay-btn {
		background-color: #ffc539;
		border-radius: 5px;
		width: 250px;
		height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		
		.c-text {
			color: #FFF;
		}
		
		.c-icon {
			margin-right: 5px;
			height: 80px;
			width: 80px;
		}
	}
	
</style>