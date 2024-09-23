/**
 *  用于 story的增删改查 
 */


const getUser = require('get-user');
const {
	Workbook
} = require("exceljs");

function getStoryById(params) {

}

function addStory(storyInfo) {
	return new Promise(async (resolve) => {
		try {
			const db = uniCloud.database();
			const collection = db.collection('short-stories');
			const dbCmd = db.command
			const res = await collection.add(storyInfo)

			if (res.id) {
				resolve([null, res])
			} else {
				resolve([res, null])
			}
		} catch (e) {
			console.log("新增书籍失败", e)
			resolve([e, null])
		}
	})
}

function deleteStoryById(params) {

}

function getfileBlob(fileId) {
	return new Promise((reslove) => {
		uniCloud.httpclient.request(fileId, {
			method: "GET",
			dataType: ""
		}).then(res => {
			reslove([null, res.data])
		}).catch(err => {
			reslove([err, null])
		})
	})
}


async function parseExcel(fileId) {
	const workbook = new Workbook();
	console.log("fileId", fileId)

	const [blobErr, blobData] = await getfileBlob(fileId);

	console.log("blob 对象", blobErr, blobData)

	const books = await workbook.xlsx.load(blobData);

	console.log("books", books);

	books.eachSheet(sheet => {
		console.log("工作表", sheet);

		sheet.eachRow((row) => {
			console.log("行数据", row.values);
		})
	})
}

module.exports = {
	_before: async function() { // 通用预处理器
		// const clientInfo = this.getClientInfo()
		// const uniIdToken = this.getUniIdToken()

		// const currentUser = await getUser({
		// 	uniIdToken
		// }, clientInfo);

		// console.log('当期用户信息', currentUser);
		// this.currentUser = currentUser;

		// if (!currentUser) {
		// 	throw Error("getUserInfo fail")
		// }
	},

	async fileToStory(fileId) {
		let [fileErr, fileData] = await parseExcel(fileId);

		if (fileErr) {
			return {
				errCode: -1,
				errMsg: '解析文件失败'
			}
		}

		// let [addErr,addData] = await addStory(fileData);
	}
}