/**
 * 用于 业务订单的  增删改查
 */
const PayPal = uniCloud.importObject('payPal');

module.exports = {
	_before: function() { // 通用预处理器
	},

	/** 
	 * 创建业务订单
	 * @param {Object} payInfo
	 */
	async createBusinessOrder(payInfo) {
		console.log("测试云函数createBusinessOrder",payInfo)
		
		const {amount} = payInfo;
		
		let  [err,data]  = await PayPal.createPayOrder(payInfo);
		
		if(err){
			return {
				 errCode: -1,
				 errMsg: 'payPal创建订单失败'
			}
		}
		
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})

		const orderInfo = await dbJQL.collection('pay-order').add({
			"amount": amount,
			"currency_code": "USD",
			"order_id": data.orderId,
			"pay_status": 1,
			"pay_type": 1,
			"user_id": "用户001",
			"pay_detail":data
		})
		if(!orderInfo.id){
			 return {
				 errCode: -1,
				 errMsg: '业务创建订单失败'
			}
		}
		console.log("返回支付参数",data)
		return data;
	}
}