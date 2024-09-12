// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129\\
const getUser = require('get-user');
const dayjs = require('dayjs');
module.exports = {
	_before:async function () { // 通用预处理器
		const clientInfo = this.getClientInfo()
		const uniIdToken = this.getUniIdToken()
		
		const currentUser = await getUser({
			uniIdToken
		}, clientInfo);
		
		console.log('当期用户信息', currentUser);
		this.currentUser = currentUser;
		
		if(!this.currentUser){
			throw Error("getUserInfo fail")
		}
	},
	
	// 新建 feedback
	async createFeedBack(params){
			const {content,imgList} = params;
			const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
				clientInfo: this.getClientInfo()
			})
			console.log("imgList",imgList)
			const feedbackInfo = await dbJQL.collection('feedback').add({
				"content": content,
				"img_list": imgList,
				"user_id":this.currentUser._id,
				"createdAt":dayjs().format("YYYY-MM-DD HH:mm:ss")
			})
			if(!feedbackInfo.id){
				 return {
					 errCode: -1,
					 errMsg: '创建feedback error'
				}
			}
			return feedbackInfo;
	}
}
