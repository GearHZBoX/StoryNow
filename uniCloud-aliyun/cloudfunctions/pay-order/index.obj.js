/**
 * 用于 业务订单的  增删改查
 */
const PayPal = uniCloud.importObject('payPal');
const getUser = require('get-user');
const dayjs = require('dayjs');
const isBetween = require("dayjs/plugin/isBetween");
const stripeUtils = require('./third-party/stripe');
dayjs.extend(isBetween);


// 创建业务订单
function createBusinessOrder(businessOrder) {
	return new Promise(async (resolve) => {
		try {
			const db = uniCloud.database();
			const collection = db.collection('pay-order');
			const dbCmd = db.command
			const orderInfo = await collection.add(businessOrder)

			if (orderInfo.id) {
				resolve([null, orderInfo])
			} else {
				resolve([orderInfo, null])
			}
		} catch (e) {
			console.log("创建业务订单失败", e)
			resolve([e, null])
		}
	})
}

function updateBusinessOrder(payInfo, updateInfo) {
	return new Promise(async (resolve) => {
		try {
			const {
				orderId,
				id
			} = payInfo;

			const db = uniCloud.database();
			const collection = db.collection('pay-order');
			const dbCmd = db.command
			const res = await collection.doc(id).updateAndReturn({
				...updateInfo,
				"updatedAt": dayjs().format("YYYY-MM-DD HH:mm:ss")
			})
			if (res.doc) {
				resolve([null, res.doc])
			} else {
				resolve([res, null])
			}
		} catch (e) {
			console.log("创建业务订单失败", e)
			resolve([e, null])
		}
	})
}

function updateVipTime(userInfo, days, clientInfo) {
	return new Promise(async (resolve) => {
		let {
			vip,
			_id
		} = userInfo;

		try {
			if (vip && vip.duration) {
				vip.duration = getVipTime({
					startTime: vip.duration[0],
					endTime: vip.duration[1],
					days,
					unit: 'day'
				})
			} else {
				vip = {
					duration: getVipTime({
						days
					})
				}
				console.log("更新后时间", vip)
			}

			const db = uniCloud.database();
			const collection = db.collection('uni-id-users');
			const dbCmd = db.command

			let res = await collection.doc(_id).updateAndReturn({
				vip: dbCmd.set(vip)
			})

			if (res.doc) {
				resolve([null, res.doc])
			} else {
				resolve([res, null])
			}
		} catch (e) {
			console.log("更新vip 数据失败回调", e)
			resolve([e, null])
		}
	})
}

/**
 * 获取Vip 时间
 */
function getVipTime({
	startTime = dayjs().format("YYYY-MM-DD HH:mm:ss"),
	endTime = dayjs().format("YYYY-MM-DD HH:mm:ss"),
	days = 0,
	unit = "day"
}) {
	if (dayjs().isBetween(startTime, endTime)) {
		endTime = dayjs(endTime).add(days, unit).format("YYYY-MM-DD HH:mm:ss");
	} else {
		startTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
		endTime = dayjs(startTime).add(days, unit).format("YYYY-MM-DD HH:mm:ss");
	}
	return [startTime, endTime]
}

function testResolve(val) {
	return Promise.resolve(val)
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

		if (!currentUser) {
			throw Error("getUserInfo fail")
		}
	},

	/** 
	 * 创建业务订单
	 * @param {Object} payInfo
	 */
	async createBusinessOrder(payInfo) {
		const {
			amount,
			currency_code,
		} = payInfo;

		const [err, data] = await PayPal.createPayOrder(payInfo);

		if (err) {
			return {
				errCode: -1,
				errMsg: 'payPal创建订单失败'
			}
		}
	

		const [businessErr, orderInfo] = await createBusinessOrder({
			"amount": amount,
			"currency_code": currency_code,
			"order_id": data.orderId,
			"pay_status": 1,
			"pay_type": 1,
			"user_id": this.currentUser._id,
			"pay_detail": data,
			"createdAt": dayjs().format("YYYY-MM-DD HH:mm:ss")
		})

		if (businessErr) {
			return {
				errCode: -1,
				errMsg: '业务订单创建失败'
			}
		}
		return {
			paymanet: data,
			orderInfo: orderInfo
		};
	},

	async captureBusinessOrder(payInfo) {
		try {
			const db = uniCloud.database();
			const transaction = await db.startTransaction();

			let [err, data] = await PayPal.captureOrder(payInfo);

			if (err) {
				await transaction.rollback({
					errCode: -1,
					errMsg: 'payPal扣款失败',
					detail: err
				})
				return [{
					errCode: -1,
					errMsg: 'payPal扣款失败',
					detail: err
				},null]
			}

			const [businessErr, businessData] = await updateBusinessOrder(payInfo, {
				pay_status: 2
			})

			if (businessErr) {
				await transaction.rollback({
					errCode: -1,
					errMsg: '业务订单更新失败',
					detail: businessErr
				})
				return [{
					errCode: -1,
					errMsg: '业务订单更新失败',
					detail: businessErr
				},null]
			}

			const [userErr, userInfo] = await updateVipTime(this.currentUser, payInfo.days);

			if (userErr) {
				await transaction.rollback({
					errCode: -1,
					errMsg: '更新用户vip信息失败',
					detail: userErr
				})
				
				return [{
					errCode: -1,
					errMsg: '更新用户vip信息失败',
					detail: userErr
				},null]
			}

			return [null,{
				userInfo,
				businessData
			}]
		} catch (e) {
			console.error(`事务异常`, e)
			return [ {
				errCode: -1,
				errMsg: '事务异常',
				detail: e
			},null]
		}
	},

	async testUpdate() {
		try {
			const db = uniCloud.database();
			const transaction = await db.startTransaction();
			
			const  res = await testResolve(1);
			console.log("res",res);
			if(res==1){
				 await transaction.rollback({
					 errCode: -1,
					 errMsg: '2222事务异常',
					 detail: "234"
				 })
				 return {
				 	errCode: -1,
				 	errMsg: '2222事务异常',
				 	detail: "234"
				 }
			}
			return {
				success:1
			}
		} catch (e) {
			console.error(`事务异常`, e)
			return {
				errCode: -1,
				errMsg: '事务异常',
				detail: e
			}
		}
	},
	
	async createBusinessOrderV2(params) {
		const { amount, currency_code, provider } = params;
		
		const [businessErr, orderInfo] = await createBusinessOrder({
			"amount": amount,
			"currency_code": currency_code,
			"pay_status": 1,
			"user_id": this.currentUser._id,
			provider,
			"createdAt": dayjs().format("YYYY-MM-DD HH:mm:ss")
		})
		
		if (businessErr) {
			return {
				errCode: -1,
				errMsg: '业务订单创建失败'
			}
		}
		
		return {
			orderInfo,
		};
	},
	
	async stripeHandler(params) {
		const { id, payResp } = params;
		const payInfo = JSON.parse(payResp);
		
		console.log('---------payinfo', payInfo);
		
		const db = uniCloud.database();
		
		const transaction = await db.startTransaction();
		
		try {
			const { data: orderRecord } = await transaction.collection('pay-order').doc(id).get()
			
			console.log('-=order', orderRecord);
			
			await transaction.collection('pay-order').doc(id).update({
				// ready to charge
				pay_status: 5,
				
			});
			
			const createResp = await stripeUtils.create(payInfo, orderRecord);
			
			console.log('create resp', createResp);
			
			await transaction.collection('pay-order').doc(id).update({
				// charging，need polling
				order_id: createResp.id,
				pay_status: 6,
			});
			
			const captureResp = await stripeUtils.capture(createResp);
			
			console.log('capture resp', captureResp);
			
			let payStatus = 3;
			if (captureResp.status === 'succeeded') {
				payStatus = 2;
			}
			
			await transaction.collection('pay-order').doc(id).update({
				pay_status: payStatus,
			})
			
			if (captureResp.status !== 'succeeded') {
				return {
					errCode: -1,
					errMsg: 'payment failed'
				}
			}
			
			return {
				errCode: 0,
				orderInfo: orderRecord,
			};
		} catch (err) {
			console.error(err)
			return {
				errCode: -1,
				errMsg: 'payment failed'
			}
		} finally {
			await transaction.commit();
		}
	}
}