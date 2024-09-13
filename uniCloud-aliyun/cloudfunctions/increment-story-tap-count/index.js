'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database();
	
	await db.collection('short-stories').doc(event._id).update({
		statistics: {
			tap_in: db.command.inc(1),
		}
	}).then(res => console.log('inc', res)).catch(err => console.error('ee', err));
	
	return {
		errCode: 0,
	}
};
