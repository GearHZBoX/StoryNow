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
		<view>payError 支付失败: {{payError}}</view>
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
				captureInfo:'',
				payError:''
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
					success: async (res)=> {
						var rawdata = JSON.parse(res.rawdata);
						console.log("orderId：" + rawdata.orderId);
						let [err,captureInfo] = await Paypal.captureOrder({
							orderId:rawdata.orderId
						})
						if(err){
							this.payError = err;
							return;
						}
						console.log("付款结果",captureInfo)
						this.captureInfo = captureInfo
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			}
		}
	}
</script>

<style>
</style>