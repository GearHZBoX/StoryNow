<template>
	<view>
		<fixed-header :title="storyTitle" backIcon></fixed-header>
		<!-- <view>{{typeof debugInfo === 'object' ? JSON.stringify(debugInfo) : debugInfo}}</view> -->
		<view v-if="!loading && !error">
			<view class="uni-title-sub">{{story.uploader}}</view>
			<view>{{story.hasPermission ? story.text : `${story.preview}...`}}</view>
			<view>当前用户：{{userInfo.nickname}}，是否有阅读权限：{{story.hasPermission}}</view>
		</view>
		<view v-if="error">{{'error: ' + typeof error === 'object' ? JSON.stringify(error) : error}}</view>
		<uni-load-more status="loading" v-if="loading" icon-type="auto"></uni-load-more>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js';
	import fixedHeader from '../../components/fixed-header.vue';
	export default {
		components: {
			fixedHeader,
		},
		data() {
			return {
				storyId: '',
				storyTitle: '',
				field: '_id,title,uploader,preview',
				authorized: false,
				loading: false,
				error: '',
				story: {},
				debugInfo: '',
			};
		},
		computed: {
			userInfo() {
				return store.userInfo || {};
			},
		},
		onLoad(query) {
			this.storyId = query.id;
			this.storyTitle = query.title;
			this.loading = true;
			uniCloud.callFunction({
				name: 'get-story',
				data: {
					id: query.id,
				}
			}).then(res => {
				console.log('get-story-res', res);
				this.debugInfo = res;
				this.story = res.result?.data || {};
				this.storyTitle = this.story.title;
			}).catch(err => {
				console.error(err);
				this.debugInfo = err;
				this.error = err;
			}).finally(() => {
				this.loading = false;
			})
		}
	}
</script>

<style lang="scss">
	@import '@/common/uni-ui.scss';

	.reader-title {
		font-weight: bolder;
		font-size: 32upx;
	}
	page {
		background: none;
	}
</style>