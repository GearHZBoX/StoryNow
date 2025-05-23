<template>
	<!--
	 本页面模板教程：https://ext.dcloud.net.cn/plugin?id=2588
	 uni-list 文档：https://ext.dcloud.net.cn/plugin?id=24
	 uniCloud 文档：https://uniapp.dcloud.io/uniCloud/README
	 unicloud-db 组件文档：https://uniapp.dcloud.io/uniCloud/unicloud-db
	 DB Schema 规范：https://uniapp.dcloud.net.cn/uniCloud/schema
	 -->
	<view>
		<!-- 刷新页面后的顶部提示框 -->
		<view v-show="false" class="tips" :class="{ 'tips-ani': tipShow }">为您更新了10条最新新闻动态</view>
		<fixed-header className="list-header">
			<uni-search-bar :radius="100" @confirm="search" style="width: 100%;"></uni-search-bar>
		</fixed-header>
		<view class="top-left-bg"></view>
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="formData" :collection="collection"
		 :field="field" @load="load" :where="where" getcount :page-size="10" :page-current="1">
			<!-- 基于 uni-list 的页面布局 -->
			<uni-list style="background: none;" border="false">
				<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
				<uni-list-item style="background: none;" direction="column" v-for="item in data" :key="item.id" :to="'/pages/reader/reader?id='+item._id+'&title='+item.title">
					<!-- 通过header插槽定义列表的标题 -->
					<template v-slot:header>
						<view class="uni-title">{{item.title}}</view>
					</template>
					<!-- 通过body插槽定义列表内容显示 -->
					<template v-slot:body>
						<view class="uni-list-box">
							<view class="uni-content">
								<view class="uni-title-sub uni-ellipsis-2">{{item.summary + '...'}}</view>
								<!-- <view class="uni-note">{{item.user_name + ' '+item.last_modify_date}}</view> -->
							</view>
						</view>
					</template>
					<!-- 同步footer插槽定义列表底部的显示效果 -->
					<template v-slot:footer>
						<view class="uni-footer">
							<text class="uni-footer-text">{{item.uploader}}</text>
							<!-- <text class="uni-footer-text">点赞</text>
							<text class="uni-footer-text">分享</text> -->
						</view>
					</template>
				</uni-list-item>
			</uni-list>
			<!-- 通过 loadMore 组件实现上拉加载效果，如需自定义显示内容，可参考：https://ext.dcloud.net.cn/plugin?id=29 -->
			<uni-load-more v-if="loading || options.status === 'noMore' " :status="options.status" />
		</unicloud-db>
	</view>
</template>

<script>
	import fixedHeader from '../../components/fixed-header.vue';
	export default {
		components: {
			fixedHeader,
		},
		data() {
			return {
				// 数据表名
				collection: 'short-stories',
				// 查询字段，多个字段用 , 分割
				field: '_id,title,summary,uploader',
				formData: {
					status: 'loading' // 加载状态
				},
				tipShow: false ,// 是否显示顶部提示框
				where: '',
			};
		},
		onLoad() {},
		methods: {
			load(data, ended) {
				if (ended) {
					this.formData.status = 'noMore'
				}
			},
			search(event) {
				if (event.value) {
					this.where = `${new RegExp(event.value, 'i')}.test(title) || ${new RegExp(event.value, 'i')}.test(text)`
					return;
				}
				this.where = '';
			}
		},
		/**
		 * 下拉刷新回调函数
		 */
		onPullDownRefresh() {
			this.formData.status = 'more'
			this.$refs.udb.loadData({
				clear: true
			}, () => {
				this.tipShow = true
				clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					this.tipShow  = false
				},1000)
				uni.stopPullDownRefresh()
			})
		},
		/**
		 * 上拉加载回调函数
		 */
		onReachBottom() {
			this.$refs.udb.loadMore()
		}
	};
</script>

<style lang="scss">
	@import '@/common/uni-ui.scss';

	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}

	.tips {
		color: #67c23a;
		font-size: 14px;
		line-height: 40px;
		text-align: center;
		background-color: #f0f9eb;
		height: 0;
		opacity: 0;
		transform: translateY(-100%);
		transition: all 0.3s;
	}

	.tips-ani {
		transform: translateY(0);
		height: 40px;
		opacity: 1;
	}

	.content {
		width: 100%;
		display: flex;
	}

	.list-picture {
		width: 100%;
		height: 145px;
	}

	.thumb-image {
		width: 100%;
		height: 100%;
	}

	.ellipsis {
		display: flex;
		overflow: hidden;
	}

	.uni-ellipsis-1 {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.uni-ellipsis-2 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.list-header {
		background: url('../../static/index-header.png') no-repeat;
		background-size: cover;
		background-color: #F6F6F9;
	}
	.top-left-bg {
		background: url('../../static/bg.png') no-repeat;
		background-size: cover;
		position: fixed;
		width: 100%;
		height: 1000rpx;
		top: 0;
	}
</style>
