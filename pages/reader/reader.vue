<template>
	<view style="position: relative;overflow-x: hidden;">
		<fixed-header backIcon id="navigator">
			<text class="reader-navigator-text" :style="`opacity: ${showNavigatorTitle ? 1 : 0};`">
				{{storyTitle}}
			</text>
		</fixed-header>
		<view class="reader-header">
			<text class="reader-header-title" ref="title" id="title">
				{{storyTitle}}
			</text>
			<view v-if="story.uploader" class="reader-header-sub-title">
				<image class="reader-header-sub-title-icon" src="../../static/icon-book.png"></image>
				<text class="reader-header-sub-title-uploader">{{story.uploader + '. '}}</text>
				<text class="reader-header-sub-title-suffix">upload</text>
			</view>
		</view>
		<view class="reader-content">
			<text class="reader-content-text" v-if="story.text || story.preview">
				{{story.hasPermission ? story.text : `${story.preview}`}}
			</text>
		</view>
		<view class="preview-footer" v-if="!loading && !story.hasPermission"></view>
		<view class="ticket-view">
			<view id="ticket" class="ticket" :style="`transform: scale(${ticketScale}); transform-origin: left top;`"
				v-if="isLoaded && !story.hasPermission">
				<view class="ticket-left">
					<text class="ticket-left-title">Open Storynow Membership</text>
					<text class="ticket-left-description">Access to popular content across all platforms.</text>
				</view>
				<view class="ticket-divider"></view>
				<view class="ticket-right" @click.stop="purchaseVip">
					<text class="ticket-right-prefix">${{price}}/</text>
					<text class="ticket-right-suffix">day</text>
				</view>
			</view>
		</view>
		<uni-load-more :contentText="{ contentrefresh: 'Loading story' }" status="loading" v-if="loading"
			icon-type="auto"></uni-load-more>
		<uni-fab horizontal="right" :pattern="fabPattern" />
	</view>
</template>

<script>
	import {
		debounce
	} from 'lodash';
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js';
	import fixedHeader from '../../components/fixed-header.vue';
import { pick } from 'lodash';
	export default {
		components: {
			fixedHeader,
		},
		data() {
			return {
				storyId: '',
				storyTitle: '',
				showNavigatorTitle: false,
				field: '_id,title,uploader,preview',
				authorized: false,
				loading: false,
				error: '',
				story: {},
				debugInfo: '',
				navigatorBottomTop: 66,
				pageHeight: 300,
				pageWidth: 200,
				price: 0.3,
				ticketScale: 1,
				scrollTop: 0,
				// 路径参数对象
				query: {},
				fabPattern: {
					color: '#7A7E83',
					buttonColor: '#fff',
					iconColor: '#aaa',
					icon: 'down',
				}
			};
		},
		computed: {
			userInfo() {
				return store.userInfo || {};
			},
			isLoaded() {
				return this.story.text || this.story.preview;
			}
		},
		methods: {
			async loadNextStory() {
				const db = uniCloud.database();
				const collection = db.collection('short-stories');
				
				const existIds = map(this.$store.state.readerTrack.stack, '_id');
				
				const storyCount = collection.where({
					_id: db.command.neq(existIds),
				});
				
				
			},
			purchaseVip() {
				// 判断登录状态
				if (!store.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login',
					})

					return;
				}

				if (!this.story.hasPermission) {
					console.log('to purchase page');
					uni.navigateTo({
						url: `/pages/to-vip/to-vip?redirectUrl=${this.$page.fullPath}`,
					})
					return;
				}

				console.log('already has permission');
				this.loadData();
			},
			loadData: debounce(function() {
				this.loading = true;
				uniCloud.callFunction({
					name: 'get-story',
					data: {
						id: this.storyId,
					}
				}).then(res => {
					console.log('get-story-res', res);
					this.debugInfo = res;
					this.story = res.result?.data || {};
					this.storyTitle = this.story.title;
					this.scrollTo();
					this.$store.commit('pushReaderStack', pick(this.story, '_id'));
					console.log('vuex', this.$store.state.readerTrack);
				}).catch(err => {
					console.error(err);
					this.debugInfo = err;
					this.error = err;
				}).finally(() => {
					this.loading = false;
				}).then(() => {
					uni.createSelectorQuery().in(this).select('#ticket').boundingClientRect(data => {
						if (!data) {
							return;
						}
						const properWidth = this.pageWidth - 32;
						this.ticketScale = Math.min(properWidth / data.width, 2);
					}).exec();
				})
			}, 500),

			// 更新读书记录
			updateReadHistory: debounce(function() {
				const readHsitory = {
					_id: this.story._id,
					title: this.story.title,
					scrollTop: this.scrollTop
				}
				uni.setStorageSync('readHsitory', JSON.stringify(readHsitory));
			}, 500),

			scrollTo() {
				console.log("滚动条位置", this.query)
				if (!this.query.scrollTop) {
					return;
				}
				uni.pageScrollTo({
					scrollTop: Number(this.query.scrollTop),
					duration: 0,
				});
			}
		},
		onReady() {
			this.pageHeight = uni.getSystemInfoSync().windowHeight;
			this.pageWidth = uni.getSystemInfoSync().windowWidth;
		},
		onShow() {
			this.loadData();
		},
		onLoad(query) {
			this.storyId = query.id;
			this.storyTitle = query.title;
			this.query = query;

			this.loadData();
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#navigator').boundingClientRect(data => {
				this.navigatorBottomTop = data.height;
			}).exec();
		},
		onPageScroll({
			scrollTop
		}) {

			const query = uni.createSelectorQuery().in(this);
			query.select('#title').boundingClientRect(data => {
				if (data.height + data.top < this.navigatorBottomTop) {
					this.showNavigatorTitle = true;
				} else {
					this.showNavigatorTitle = false;
				}
			}).exec();

			this.scrollTop = scrollTop;
			this.updateReadHistory();
		},
		onReachBottom() {
			console.log('reach bottom');
			// uni.navigateTo({
			// 	url: '/pages/reader/reader',
			// 	animationType: 'slide-in-bottom',
			// })
		}
	}
</script>

<style lang="scss">
	@import '@/common/uni-ui.scss';

	.reader-header {
		padding: 12px 16px 8px;

		&-title {
			overflow: hidden;
			color: $light_text_gray1;
			text-overflow: ellipsis;

			/* Title/bold */
			font-family: "Open Sans";
			font-size: 20px;
			font-style: normal;
			font-weight: 700;
			line-height: 28px;
			/* 140% */
		}

		&-sub-title {

			display: flex;
			flex-direction: row;
			align-items: center;
			margin-top: 8px;

			&-icon {
				width: 16px;
				height: 16px;
				margin-right: 6px;
			}

			&-uploader {
				overflow: hidden;
				color: $light_text_gray2;
				text-overflow: ellipsis;

				/* body/regular */
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 16px;
				/* 133.333% */
			}

			&-suffix {
				overflow: hidden;
				color: $light_text_gray3;
				text-overflow: ellipsis;

				/* body/regular */
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 16px;
			}
		}
	}

	.reader-content {
		padding: 0 16px;

		&-text {
			color: $light_text_gray2;
			overflow: hidden;
			text-overflow: ellipsis;

			/* body/regular */
			font-family: "PingFang SC";
			font-size: 20px;
			font-style: normal;
			font-weight: 400;
			line-height: 56px;
			/* 155.556% */
		}
	}

	.reader-navigator-text {
		lines: 1;
		overflow: hidden;
		color: $light_text_gray1;
		text-overflow: ellipsis;
		white-space: nowrap;

		/* Title/medium */
		font-family: "Open Sans";
		font-size: 16px;
		font-style: normal;
		font-weight: 700;
		line-height: 20px;
		/* 125% */

		transition: opacity .25s;
	}

	.ticket-view {
		position: absolute;
		bottom: 0;
		transform-origin: top left;

		.ticket {

			background-image: url('../../static/ticket.png');
			background-repeat: no-repeat;
			background-size: contain;
			margin: 0 0 4px 16px;
			padding: 18px 16px;
			display: flex;
			flex-direction: row;
			align-items: center;

			&-left {

				width: 200px;
				display: flex;
				flex-direction: column;

				&-title {
					color: $light_membership_01;

					/* Title/medium */
					font-family: "Open Sans";
					font-size: 14px;
					font-style: normal;
					font-weight: 500;
					line-height: 20px;
					/* 142.857% */
				}

				&-description {
					color: $light_membership_02;

					/* body/regular */
					font-family: "Open Sans";
					font-size: 12px;
					font-style: normal;
					font-weight: 400;
					line-height: 18px;
					/* 133.333% */
				}
			}

			&-divider {
				width: 0;
				height: 56px;
				border-left: 1px dashed $light_membership_03;
				margin-left: 49px;
			}

			&-right {
				border-radius: 40px;
				background: $light_membership_03;
				padding: 8px 20px;
				margin-left: 16px;
				display: flex;
				align-items: center;
				justify-content: center;

				&-prefix {
					color: $light_membership_01;
					text-align: center;

					/* Mobile/Button/B2_1_ZH */
					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 600;
					line-height: 20px;
					/* 142.857% */
				}

				&-suffix {
					color: $light_membership_01;

					/* label/regular */
					font-family: "PingFang SC";
					font-size: 10px;
					font-style: normal;
					font-weight: 400;
					line-height: 12px;
				}
			}
		}
	}


	.page-bottom {
		// height: 20px;
	}

	.preview-footer {
		background: linear-gradient(180deg, rgba(246, 246, 249, 0.00) 0%, #fff 56.25%, #fff 100%);
		height: 160px;
		width: 100%;
		position: absolute;
		bottom: 0;
	}
</style>