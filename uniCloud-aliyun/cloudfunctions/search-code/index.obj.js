const dayjs = require('dayjs');
const isBetween = require("dayjs/plugin/isBetween");

async function getStoryList(params, clientInfo) {
	const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
		clientInfo: clientInfo
	})
	const {
		pageSize,
		pageCurrent,
		searchVal
	} = params;

	const where = searchVal ? `${new RegExp(searchVal, 'i')}.test(title)` : {};
	const field = params.field || '_id,title,summary,uploader';
	const orderBy = params.orderBy || 'createdAt desc';

	const res = await dbJQL.collection('short-stories')
		.where(where)
		.field(field)
		.orderBy(orderBy)
		.skip(pageSize * (pageCurrent - 1))
		.limit(pageSize).get({
			getCount: true
		})
	return res;
}

async function getStoryByCode(params, clientInfo) {
	if (!params.searchVal) {
		return []
	}

	const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
		clientInfo: clientInfo
	})

	const res = await dbJQL.collection('code-config')
		.where({
			"_id": params.searchVal
		})
		.get();
		
	if(res&&res?.data&&res?.data?.length){
		addCodeSearchLog(res?.data[0])
	}	

	return res?.data || []
}



async function getStoryById({
	bookId,
	field
}, clientInfo) {
	const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
		clientInfo: clientInfo
	})

	const res = await dbJQL.collection('short-stories')
		.where({
			"_id": bookId
		})
		.field(field)
		.get({
			getCount: true
		})
	return res;
}

async function addCodeSearchLog(codeInfo,clientInfo){
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: clientInfo
		})
		
		const {_id,createdAt,user_id,...rest} = codeInfo;
		console.log("新增参数",rest)
		// const res = await dbJQL.collection('code-search-log').add({
		// 	search_time:dayjs().format("YYYY-MM-DD HH:mm:ss"),
		// 	...rest,
		// 	code_id:_id
		// })
		// return res;
		
		const db = uniCloud.database();
		const collection = db.collection('code-search-log');
		const dbCmd = db.command
		const res = await collection.add({
			search_time:dayjs().format("YYYY-MM-DD HH:mm:ss"),
			...rest,
			code_id:_id
		})
		
		return res;
}

module.exports = {
	_before: function() { // 通用预处理器

	},

	async getStoryListAndCode(params) {
		const clientInfo = this.getClientInfo();
		const {
			searchVal,
			field
		} = params;

		const bookList = await getStoryByCode(params, clientInfo);

		if (bookList && bookList.length) {
			return getStoryById({
				bookId: bookList[0].book_id,
				field
			}, clientInfo)
		}

		return getStoryList(params, clientInfo)
	}
}