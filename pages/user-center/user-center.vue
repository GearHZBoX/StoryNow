<template>
	<view>
		<view>用户信息</view>
		<view>{{JSON.stringify(userInfo, null, 2)}}</view>
		<button v-if="!userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/login/login-withpwd')">{{$t('login')}}</button>
		<button v-if="!userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/register/register')">{{$t('register')}}</button>
		<button v-if="userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd')">修改密码</button>
		<button v-if="userInfo._id" @click="logout">退出登录</button>
		<button v-if="userInfo._id" @click="goto('/uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate')">注销</button>
	</view>
</template>

<script>
	import {
	  store,
	  mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	
	export default {
		data() {
			return {
				userInfo: store.userInfo
			};
		},
		methods: {
			goto(url) {
				uni.navigateTo({
					url,
				});
			},
			logout() {
				mutations.logout();
			},
			
		}
	}
</script>

<style lang="scss">

</style>
