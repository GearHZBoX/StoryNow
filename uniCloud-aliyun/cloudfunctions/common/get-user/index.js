const uniID = require('uni-id-common');
module.exports = async function(event, context) {
	try {
		// 公用模块用法请参考 https://uniapp.dcloud.io/uniCloud/cf-common
		if (!event.uniIdToken) {
			console.warn('no uniIdToken');
			return;
		}
		const uniIDIns = uniID.createInstance({
			context,
		});
		const payload = await uniIDIns.checkToken(event.uniIdToken);
		if (payload.code) {
			console.warn('checkToken failed', payload.message);
			return;
		};
		const uniJQL = uniCloud.databaseForJQL({
			context,
			event,
		});
		const queryRes = await uniJQL.collection('uni-id-users').where(`_id=='${payload.uid}'`).field({
			_id: true,
			username: true,
			nickname: true,
			vip: true
		}).get({
			getOne: true
		});
		if (queryRes.errCode) {
			console.warn('query database failed', queryRes.message);
			return;
		}
		console.debug('here', queryRes);
		return queryRes.data;
	} catch (err) {
		console.error('get-user error', err);
	}
}