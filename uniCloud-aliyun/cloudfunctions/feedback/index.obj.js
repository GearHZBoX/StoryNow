// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器
		
	},
	
	// 新建 feedback
	async createFeedBack(params){
			const {content,imgList} = params;
			const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
				clientInfo: this.getClientInfo()
			})
			
			const feedbackInfo = await dbJQL.collection('feedback').add({
				"content": content,
				"img_list": imgList,
			})
			if(!feedbackInfo.id){
				 return {
					 errCode: -1,
					 errMsg: '创建feedback error'
				}
			}
			return data;
	}
}
