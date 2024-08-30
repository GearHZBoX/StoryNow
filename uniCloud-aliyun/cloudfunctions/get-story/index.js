'use strict';
const getUser = require('get-user');
const dayjs = require('dayjs');
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
exports.main = async (event, context) => {
	try {
		//event为客户端上传的参数
		console.log('event : ', event);
		const dbJQL = uniCloud.databaseForJQL({
			event,
			context,
		});
		console.log('context:', context);
		const [currentUser, { data: story }] = await Promise.all([getUser(event, context), dbJQL.collection('short-stories')
			.where(`_id=='${event.id}'`).get({
				getOne: true
			})
		]);
		console.log('currentUser', currentUser);
		let hasPermission = false;
		if (currentUser?.vip?.duration?.[0] && currentUser?.vip?.duration?.[1]) {
			const vipBeginAt = dayjs(currentUser.vip.duration[0]);
			const vipEndAt = dayjs(currentUser.vip.duration[1]);
			console.debug('dayjs', vipBeginAt, vipEndAt, dayjs());
			hasPermission = dayjs().isBetween(vipBeginAt, vipEndAt);
		}
		if (!hasPermission) {
			delete story.text;
		} else {
			delete story.preview;
		}
		story.hasPermission = hasPermission;
		console.log('story', story);
		return {
			errCode: 0,
			code: 0,
			data: story,
		};
	} catch (err) {
		console.error(err);
		return {
			errCode: 1,
			code: 1,
			message: typeof err === 'string' ? err : err?.message,
		};
	}
};