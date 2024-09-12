/**
 * 用于 业务订单的  增删改查
 */
const PayPal = uniCloud.importObject('payPal');
const getUser = require('get-user');

function updateBusinessOrder(payInfo, updateInfo, clientInfo) {
	return new Promise(async (resolve) => {
		const {
			orderId,
			id
		} = payInfo;

		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: clientInfo
		})
		try {
			const res = await dbJQL.collection('pay-order').where({
				_id: id
			}).update({
				...updateInfo,
				"updatedAt": new Date().getTime()
			})
			if(res.updated==1){
				resolve([null, res])
			}else{
				resolve([res, null])
			}
		} catch (e) {
			console.log("更新订单失败回调", res)
			
		}
	})
}

module.exports = {
	_before: async function() { // 通用预处理器
		const clientInfo = this.getClientInfo()
		const uniIdToken = this.getUniIdToken()

		const currentUser = await getUser({
			uniIdToken
		}, clientInfo);

		console.log('当期用户信息', currentUser);
		this.currentUser = currentUser;

		// if(!currentUser){
		// 	throw Error("当前用户不存在，或未登录")
		// }
	},

	/** 
	 * 创建业务订单
	 * @param {Object} payInfo
	 */
	async createBusinessOrder(payInfo) {
		const {
			amount,
			currency_code
		} = payInfo;

		let [err, data] = await PayPal.createPayOrder(payInfo);

		if (err) {
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
			"currency_code": currency_code,
			"order_id": data.orderId,
			"pay_status": 1,
			"pay_type": 1,
			"user_info": this.currentUser,
			"pay_detail": data,
			"createdAt": new Date().getTime()
		})
		if (!orderInfo.id) {
			return {
				errCode: -1,
				errMsg: '业务创建订单失败'
			}
		}
		return {
			paymanet: data,
			orderInfo: orderInfo
		};
	},


	async captureBusinessOrder(payInfo) {

		let [err, data] = await PayPal.captureOrder(payInfo);


		console.log("paypay", err, data);

		if (err) {
			return {
				errCode: -1,
				errMsg: 'payPal扣款失败',
				detail: err
			}
		}

		const [businessErr, BusinessData] = await updateBusinessOrder(payInfo, {
			pay_status: 2
		}, {
			clientInfo: this.getClientInfo()
		})

		if (businessErr) {
			return {
				errCode: -1,
				errMsg: '业务订单更新失败',
				detail: businessErr
			}
		}
		return payInfo
	},

}