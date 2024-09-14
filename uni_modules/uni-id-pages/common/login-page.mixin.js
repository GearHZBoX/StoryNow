import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import {
	store,
	mutations
} from '@/uni_modules/uni-id-pages/common/store.js'
import config from '@/uni_modules/uni-id-pages/config.js'
import {
	placeholderStyle
} from '../../../common/constant';
import PrimaryButton from '../../../components/primary-button.vue';
const mixin = {
	components: {
		PrimaryButton,
	},
	data() {
		return {
			config,
			uniIdRedirectUrl: '',
			isMounted: false,
			placeholderStyle,
		}
	},
	onUnload() {
		// #ifdef H5
		document.onkeydown = false
		// #endif
	},
	mounted() {
		this.isMounted = true
	},
	onLoad(e) {
		if (e.is_weixin_redirect) {
			uni.showLoading({
				mask: true
			})

			if (window.location.href.includes('#')) {
				// 将url通过 ? 分割获取后面的参数字符串 再通过 & 将每一个参数单独分割出来
				const paramsArr = window.location.href.split('?')[1].split('&')
				paramsArr.forEach(item => {
					const arr = item.split('=')
					if (arr[0] == 'code') {
						e.code = arr[1]
					}
				})
			}
			this.$nextTick(n => {
				// console.log(this.$refs.uniFabLogin);
				this.$refs.uniFabLogin.login({
					code: e.code
				}, 'weixin')
			})
		}

		if (e.uniIdRedirectUrl) {
			this.uniIdRedirectUrl = decodeURIComponent(e.uniIdRedirectUrl)
		}

		// #ifdef MP-WEIXIN
		if (getCurrentPages().length === 1) {
			uni.hideHomeButton()
			console.log('已隐藏：返回首页按钮');
		}
		// #endif
	},
	computed: {
		needAgreements() {
			if (this.isMounted) {
				if (this.$refs.agreements) {
					return this.$refs.agreements.needAgreements
				} else {
					return false
				}
			}
		},
		agree: {
			get() {
				if (this.isMounted) {
					if (this.$refs.agreements) {
						return this.$refs.agreements.isAgree
					} else {
						return true
					}
				}
			},
			set(agree) {
				if (this.$refs.agreements) {
					this.$refs.agreements.isAgree = agree
				} else {
					console.log('不存在 隐私政策协议组件');
				}
			}
		},
		testData() {
			return "3242342"
		},
		// 1 == 非vip   2 = vip已过期  3 = vip
		vipStatus() {
			console.log("测试数据1231", store.userInfo, dayjs())
			if (store.userInfo && store.userInfo?.vip) {
				const duration = store.userInfo?.vip?.duration;
				const [startTime, endTime] = duration;
				console.log("测试数据", startTime, endTime)
				return dayjs().isBetween(startTime, endTime) ? 3 : 2
			}

			return 1;
		},
		
		vipDuration(){
			return store.userInfo?.vip?.duration ||[];
		}
	},
	methods: {
		loginSuccess(e) {
			mutations.loginSuccess({
				...e,
				uniIdRedirectUrl: this.uniIdRedirectUrl
			})
		}
	}
}

export default mixin