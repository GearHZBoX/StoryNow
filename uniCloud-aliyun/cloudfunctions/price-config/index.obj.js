module.exports = {
	_before: function() { // 通用预处理器

	},

	async createPriceConfig(priceConfig) {
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})

		const res = await dbJQL.collection('price-config').add({
			...priceConfig
		})

		return res;
	},

	async getPriceConfig() {
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		const res = await dbJQL.collection('price-config').get()
		return res;
	}
}