export const defautCloudObjConfig = {
	customUI: false,
	loadingOptions: { // loading相关配置
		title: 'loading...', // 显示的loading内的提示文字。默认值为：加载中...
		mask: true // 是否使用透明遮罩，配置为true时不可点击页面其他内容。默认值为：true
	},
	errorOptions: { // 错误界面相关配置
		type: 'toast', // 错误信息展示方式，可取值：modal（弹框，默认）、toast（toast消息框）。默认值为：modal
		retry: false // 是否展示重试按钮，仅在type为modal时生效。用户点击重试按钮时将重新请求调用的方法，默认为false
	},
}

export const importObjectConfig = (cloudObj, config = defautCloudObjConfig) => {
	return uniCloud.importObject(cloudObj, config);
}