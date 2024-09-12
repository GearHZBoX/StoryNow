
// app1
const PAYPAL_CLIENT_ID = 'AXquHhZpzIQvG0Qa5l639Qse_xm4wDs_LGNiT_g-MXVkhUpK4j8NTo_GB2e-5Eg5TUvA2JCg8d4hetGF';
const PAYPAL_CLIENT_SECRET = 'EOU3MrE7BaqGgT7ApNIgV5hv501biOH8A6G0WWyahLgQuQSU-i5BEKTztxEi7Z9oVJHvCtPqCpGsZopo';

// app2
// const PAYPAL_CLIENT_ID = 'AQNPRcj3_6DnmDDK3AtUTGAULXVR-DAc561UGorL8jC2-W9fRhjIiYS82MRVvB4yosVaGXYxqUSACo0E';
// const PAYPAL_CLIENT_SECRET = 'EAITsvNkVLnytlYy6uemUUN8N3VCVUs5eZJk32jUjS0NeIDkwNRUcY9yfAYONJ3amkdqJU3fcvpKJzS-';

const base = "https://api-m.sandbox.paypal.com";

const environment = "sandbox"; //运行环境 sandbox/live

/**
 * 生成access Token
 */
function generateAccessToken() {
	return new Promise((resolve) => {
		const auth = Buffer.from(
			PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
		).toString("base64");
		uniCloud.httpclient.request(`${base}/v1/oauth2/token`, {
			method: "POST",
			timeout:10*60*1000,
			contentType: "application/x-www-form-urlencode",
			data: "grant_type=client_credentials",
			headers: {
				Authorization: `Basic ${auth}`,
			},
			dataType: "json"
		}).then((res) => {
			console.log("获取accessToken成功回调", res)
			if (res.status != 200) {
				resolve([res, null])
			} else {
				resolve([null, res.data.access_token])
			}
		}).catch(err => {
			console.log("获取accessToken失败回调", err)
			resolve([err, null])
		})
	})

}

/**
 *  paypal 创建订单
 * @param {Object} payInfo
 * @param {Object} config 
 * @returns  返回调起支付的参数；
 */
async function createOrder(payInfo, config) {
	return new Promise((resolve) => {
		const payload = {
			intent: "CAPTURE",
			purchase_units: [{
				amount: {
					currency_code: payInfo.currency_code, // USD
					value: payInfo.amount,
				},
			}, ],
			payment_source: {
				"paypal": {
					"experience_context": {
						"payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
						"payment_method_selected": "PAYPAL",
						"brand_name": "StoryNow",
						// "locale": "en-US",
						// "landing_page": "LOGIN",
						// 无需收货地址
						"shipping_preference": "NO_SHIPPING",
						"user_action": "PAY_NOW",
						// "return_url": "https://example.com/returnUrl",
						// "cancel_url": "https://example.com/cancelUrl"
					}
				},
			}
		};
		uniCloud.httpclient.request(`${base}/v2/checkout/orders`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${config.accessToken}`,
			},
			timeout:10*60*1000,
			data: JSON.stringify(payload),
			dataType: "json"
		}).then(res => {
			console.log("paypal 创建订单回调成功",res)
			resolve([null, {
				"clientId": PAYPAL_CLIENT_ID, //客户端id
				"orderId": res.data.id, //订单id
				"userAction": "paynow", //  paynow/continue
				"currency": "USD", // 币种  
				"environment": environment,
			}])
		}).catch(err => {
			console.log("paypal 创建订单回调失败",err)
			resolve([err, null])
		})
	})
}


 function captureOrder(payInfo,config){
	return new Promise((resolve,reject)=>{
		const {
			orderId
		} = payInfo;
		const url = `${base}/v2/checkout/orders/${orderId}/capture`;
		
		uniCloud.httpclient.request(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${config.accessToken}`,
			},
			timeout:10*60*1000,
			dataType: "json"
		}).then(res=>{
			console.log("用户扣款回调成功",res);
			if(res.data.id&& res.data.status=== 'COMPLETED'){
				resolve([null,res])
			}else{
				resolve([res,null])
			}
		}).catch(err=>{
			console.log("用户扣款回调失败",err);
			resolve([err,null])
		})
	})
}


module.exports = {
	_before: async function() {
		const [err, accessToken] = await generateAccessToken();
		
		if (err) {
			throw new Error('accessToken获取失败')
		}

		this.accessToken = accessToken;
	},

	// _after(error, result) {
	// 	if (error) {
	// 		return [error, null];
	// 	}
	// 	return [null, result]
	// },

	/**
	 * 创建订单
	 * @param {Object} info 订单信息
	 */
	async createPayOrder(payInfo) {
		return  await createOrder(payInfo, {
			accessToken: this.accessToken
		});;
	},

	async captureOrder(payInfo) {
		return await captureOrder(payInfo, {
			accessToken: this.accessToken
		});
	}
}