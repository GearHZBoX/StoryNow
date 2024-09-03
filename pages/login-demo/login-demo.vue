<template>
	<view>

		<button type="primary" @click="loginByGoogle()">google</button>
		<view style="height: 10px;"></view>
		<button type="primary" @click="loginByFC()">facebook</button>
		<view>loginRes: {{loginRes}}</view>
		<view>userInfo: {{userInfo}}</view>
		<view>err: {{err}}</view>

		<button type="primary" @click="toPay">paypal1</button>
		<view>payInfo 调起支付参数: {{payInfo}}</view>
		<view>captureInfo 付款成功结果: {{captureInfo}}</view>

		<button type="primary" @click="toGooglePay">谷歌支付</button>
	</view>
</template>

<script>
	const PayOrder = uniCloud.importObject('pay-order')
	const Paypal = uniCloud.importObject('paypal')

	export default {
		data() {
			return {
				loginRes: '',
				err: '',
				userInfo: '',
				payInfo: '',
				captureInfo: ''
			}
		},
		methods: {
			loginByFC() {
				console.log('login by facebook');
				uni.login({
					provider: 'facebook',
					success: (loginRes) => {
						this.err = '';
						this.loginRes = typeof loginRes === 'object' ? JSON.stringify(loginRes) : loginRes;
						// 登录成功
						uni.getUserInfo({
							provider: 'facebook',
							success: (info) => {
								// 获取用户信息成功, info.authResult保存用户信息
								this.userInfo = typeof info === 'object' ? JSON.stringify(info) :
									info;
							}
						})
					},
					fail: (err) => {
						// 登录授权失败
						// err.code是错误码
						this.err = typeof err === 'object' ? JSON.stringify(err) : err;
						console.error(err);
					}
				})
			},
			loginByGoogle() {
				console.log('login by google');
				uni.login({
					provider: 'google',
					success: (loginRes) => {
						// 登录成功
						this.err = '';
						this.loginRes = typeof loginRes === 'object' ? JSON.stringify(loginRes) : loginRes;
						uni.getUserInfo({
							provider: 'google',
							success: (info) => {
								// 获取用户信息成功, info.authResult保存用户信息
								this.userInfo = typeof info === 'object' ? JSON.stringify(info) :
									info;
							}
						})
					},
					fail: (err) => {
						// 登录授权失败
						// err.code是错误码
						this.err = typeof err === 'object' ? JSON.stringify(err) : err;
						console.error(err);
					}
				})
			},

			async toPay() {
				const data = await PayOrder.createBusinessOrder({
					amount: 15
				});

				this.payInfo = data;
				uni.requestPayment({
					"provider": "paypal",
					"orderInfo": data,
					success: async function(res) {
						var rawdata = JSON.parse(res.rawdata);
						console.log("orderId：" + rawdata.orderId);
						let captureInfo = await Paypal.captureOrder({
							orderId: rawdata.orderId
						})

						this.captureInfo = captureInfo
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},

			// 
			toGooglePay() {
				let cardPaymentMethodConfig = {
					environment: 3, // 必填 1 是product  3是test
					paymentMethodType: "CARD", //必填 CARD、PAYPAL
					existingPaymentMethodRequired: false, //可选 如果设置为true同时已经准备好了支付allowedPaymentMethods中的付款方式，isReadyToPay就会返回true。

					currencyCode: "USD", //必填
					countryCode: "US", //在欧洲经济区必填
					transactionId: "", //当你想要接收googlepay回调的时候必填
					totalPriceStatus: "FINAL", //必填  NOT_CURRENTLY_KNOWN、ESTIMATED、FINAL
					totalPrice: "111.00", //必填 满足正则格式^[0-9]+(\.[0-9][0-9])?$
					totalPriceLabel: "100heelo", //可选
					checkoutOption: "DEFAULT", //可选 DEFAULT、COMPLETE_IMMEDIATE_PURCHASE

					merchantName: "Example Merchant", //可选
					emailRequired: true, //可选
					shippingAddressRequired: true, //可选
					shippingPhoneNumberRequired: false, //可选
					allowedCountryCodes: ["US", "GB"], //可选
					allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"], //必填
					allowedCardNetworks: ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"], //必填
					allowPrepaidCards: false, //可选
					// allowCreditCards:false,//可选  
					assuranceDetailsRequired: false, //可选
					billingAddressRequired: true, //可选
					billingAddressParametersFormat: "FULL", //可选 MIN
					phoneNumberRequired: false, //可选
					tokenizationSpecificationType: "PAYMENT_GATEWAY", //必填 PAYMENT_GATEWAY、DIRECT
					gateway: "example", //PAYMENT_GATEWAY时必填
					gatewayMerchantId: "exampleGatewayMerchantId", //PAYMENT_GATEWAY时必填
					protocolVersion: "", //DIRECT时必填
					publicKey: "", //DIRECT时必填
					buildTokenizationSpecification: { //可选，此字段是为了方便开发者自定义构造tokenizationSpecification参数,设置此字段时，会覆盖掉`tokenizationSpecificationType`、`gateway`、`gatewayMerchantId`、`protocolVersion`、`publicKey`字段。(HBuilderX 3.5.1+支持)
						"type": "PAYMENT_GATEWAY",
						"parameters": {
							"gateway": "custom-gateway",
							"gatewayMerchantId": "mock-gatewayMerchantId"
						}
					}
				};


				uni.requestPayment({
					"provider": "google-pay",
					"orderInfo": cardPaymentMethodConfig,
					success: async function(res) {
						console.log("谷歌支付：", res);
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				})
			}
		}
	}
</script>

<style>
</style>