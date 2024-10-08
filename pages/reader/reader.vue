<template>
	<view id="container" @touchmove="touchMove" @touchstart="touchStart" @touchend="touchEnd" ref="page" class="reader" style="position: relative;overflow-x: hidden;">
		<fixed-header @back="headerBack"
			:navigate-back-params="{ delta: $store.state.readerTrack?.stack.length, animationType: 'pop-out', }"
			backIcon id="navigator">
			<text class="reader-navigator-text" :style="`opacity: ${showNavigatorTitle ? 1 : 0};`">
				{{storyTitle}}
			</text>
		</fixed-header>
		<mescroll-body topBar statusBarHeight="100" height="0" :down="{ 
			 auto: false,
			 bgColor: '#f1f1f1',
			 textColor: isFirst ? '#C0C0CC' : '#AB9AFC',
			 textInOffset: isFirst ? 'It is already the first story.' : 'Pull down to go back to last story',
			 textOutOffset: isFirst ? 'It is already the first story' : 'Release to go back to last story',
			 textLoading: isFirst ? 'It is already the first story' : 'Going to go back to last story',
			 textSuccess: isFirst ? 'It is already the first story' : 'Going to go back to last story',
			}" :up="{ use: false }" @init="mescrollInit" @down="downCallback" @up="upCallback">
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
				<view id="ticket" class="ticket"
					:style="`transform: scale(${ticketScale}); transform-origin: left top;`"
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
		</mescroll-body>

		<uni-load-more :contentText="{ contentrefresh: 'Loading story' }" status="loading" v-if="loading"
			icon-type="auto"></uni-load-more>
		<!-- <uni-fab horizontal="right" :pattern="fabPattern" @click="goDownToNextStory" /> -->
		<view class="next-story-button" :style="{width: showText ? '100px' : '18px'}" @click="goDownToNextStory">
			<uni-icons class="next-story-button-icon" type="down"></uni-icons>
			<text v-if="showText" class="next-story-button-text">next story</text>
		</view>

			<view v-if="nextStory?._id" class="next-footer">
				<view class="next-footer-banner">
					<text :class="`next-footer-banner-text ${canSlideToNext ? 'highlight' : ''}`">{{nextFooterText}}</text>
				</view>
				<view class="reader-header">
					<text class="reader-header-title" ref="title" id="title">
						{{nextStory?.title}}
					</text>
					<view v-if="story.uploader" class="reader-header-sub-title">
						<image class="reader-header-sub-title-icon" src="../../static/icon-book.png"></image>
						<text class="reader-header-sub-title-uploader">{{nextStory?.uploader + '. '}}</text>
						<text class="reader-header-sub-title-suffix">upload</text>
					</view>
				</view>
			</view>
	</view>
</template>

<script>
	import {
		debounce,
		map,
	} from 'lodash';
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js';
	import fixedHeader from '../../components/fixed-header.vue';
	import MescrollMixin from '../../uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins';
	import {
		pick
	} from 'lodash';
	import {
		uniq
	} from 'lodash';
	import {
		findIndex
	} from 'lodash';
	import {
		throttle
	} from 'lodash';
	import {
		indexOf
	} from 'lodash';
	export default {
		components: {
			fixedHeader,
		},
		mixins: [MescrollMixin],
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
				},
				nextStory: null,
				loadNextCount: 0,
				mescroll: null,
				goLast: false,
				mescrollFooter: null,
				atBottom: false,
				touchStartY: 0,
				touchEndY: 0,
			};
		},
		computed: {
			userInfo() {
				return store.userInfo || {};
			},
			isLoaded() {
				return this.story.text || this.story.preview;
			},
			isFirst() {
				return this.storyId === this.$store.state.readerTrack?.stack[0]._id
			},
			showText() {
				return this.$store.state.readerTrack.displayNextText;
			},
			scrollTopGetter() {
				return this.$store.getters['readerTrack/getScrollTop'];
			},
			nextFooterText() {
				if (this.canSlideToNext) {
					return 'Release to move to next story'
				}
				return 'Next story';
			},
			canSlideToNext() {
				return this.touchStartY - this.touchEndY > 100 && this.atBottom
			},
		},
		methods: {
			touchStart(e) {
				console.log('start', e)
				this.touchStartY = e.touches[0].pageY;
				this.touchEndY = e.touches[0].pageY;
			},
			touchEnd(e) {
				console.log('end', e)
				this.touchEndY = e.changedTouches[0].pageY;
				console.log('--==--', this.touchStartY, this.touchEndY)
				if (this.canSlideToNext) {
					console.log('next story');
					this.goDownToNextStory();
				}
				this.touchStartY = 0;
				this.touchEndY = 0;
			},
			touchMove(e) {
				this.touchEndY = e.changedTouches[0].pageY;
			},
			headerBack() {
				this.$store.commit('setDisplayNextText', true);
				this.$store.commit('clearReaderStack');
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			downCallback() {
				console.log('here', this.isFirst, this.storyId, this.$store.state.readerTrack?.stack[0]._id);
				if (this.isFirst) {
					setTimeout(() => {
						this.mescroll.endSuccess();
					}, 1000);
					return;
				}
				this.goLast = true;
				setTimeout(() => {
					uni.navigateBack({
						complete: () => {
							this.mescroll.endSuccess();
							this.goLast = false;
						},
						// animationDuration: 200,
						// animationType: "slide-out-bottom"
					})
				}, 300)
			},
			async loadNextStory() {

				const db = uniCloud.database();
				const collection = db.collection('short-stories');

				const indexInStack = indexOf(map(this.$store.state.readerTrack.stack, '_id'), this.storyId);
				if (indexInStack > -1) {
					const nextStoryId = this.$store.state.readerTrack.stack[indexInStack + 1]?._id;
					if (nextStoryId) {
						const queryResp = await collection.doc(nextStoryId).field('_id,title,preview,uploader').get({
							getOne: true
						});
						this.nextStory = queryResp.result.data;
						console.log('get next story success by vuex', this.nextStory);
						return;
					}
				}

				this.loadNextCount++;

				if (this.loadNextCount > 5) {
					this.nextStory = -1;
					return;
				}

				const existIds = uniq(map(this.$store.state.readerTrack.stack, '_id'));

				console.log('here', existIds);
				const resp = await collection.where({
					'_id': db.command.nin(existIds),
				}).count();

				const count = resp.result.total;

				console.log('coo', count);

				if (!count) {
					console.log('no more story');
					this.nextStory = -1;
					return;
				}

				const skip = Math.round(Math.random() * (count - 1));

				const findResp = await collection.where({
					'_id': db.command.nin(existIds),
				}).field('_id,title,preview,uploader').skip(skip).get({
					getOne: true,
				});

				const nextStory = findResp?.result?.data;

				if (existIds.includes(nextStory._id)) {
					console.log('detect exist story', nextStory._id);
					this.loadNextStory();
					return;
				}

				this.nextStory = nextStory;

				console.log('get next story success', nextStory);
			},
			goDownToNextStory: throttle(function() {
				if (!this.nextStory) {
					uni.showToast({
						icon: 'none',
						title: 'Next story is loading',
					});
					return;
				}

				if (this.nextStory === -1) {
					uni.showToast({
						icon: 'none',
						title: 'No more story',
					});
					return;
				}

				uni.navigateTo({
					url: `/pages/reader/reader?id=${this.nextStory._id}&title=${this.nextStory.title}&uploader=${this.nextStory.uploader}`,
					animationType: 'slide-in-bottom',
					animationDuration: 200,
				})
			}, 1000),
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
			loadData() {
				this.loading = true;
				return uniCloud.callFunction({
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
			},

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
			uni.loadFontFace({
			    family: 'Open Sans',
			    // 本地字体路径需转换为平台绝对路径
			    source: `url(${plus.io.convertLocalFileSystemURL('_www/static/OpenSans-Regular.ttf')})`,
			})
			
			this.storyId = query.id;
			this.storyTitle = query.title;
			this.query = query;

			if (!this.$store.state.readerTrack.stack.find(story => story._id === this.storyId)) {
				this.$store.commit('pushReaderStack', {
					'_id': this.storyId
				});
			}

			this.loadData().then(() => {
				this.loadNextStory();
			});
			
			
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
			// console.log('----', scrollTop);
			
			const query = uni.createSelectorQuery().in(this);
			query.select('#title').boundingClientRect(data => {
				if (data.height + data.top < this.navigatorBottomTop) {
					this.showNavigatorTitle = true;
				} else {
					this.showNavigatorTitle = false;
				}
			}).exec();
			
			uni.createSelectorQuery().in(this).select('#container').boundingClientRect(data => {
				// console.log('data', data.height,this.pageHeight - data.top);
				
				if (Math.abs(data.height - this.pageHeight + data.top) > 50) {
					this.atBottom = false;
				} 
			}).exec();

			this.scrollTop = scrollTop;
			if (scrollTop > 4000) {
				this.$store.commit('setDisplayNextText', false);
			}
			this.updateReadHistory();
		},
		onReachBottom() {
			console.log('reach bottom');
			// uni.navigateTo({
			// 	url: '/pages/reader/reader',
			// 	animationType: 'slide-in-bottom',
			// })
			this.atBottom = true;
		},
		onBackPress() {
			if (this.isFirst) {
				this.$store.commit('setDisplayNextText', true);
				this.$store.commit('clearReaderStack');
			}
		},
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

	.mescroll-totop.mescroll-totop-in {
		display: none;
	}

	.next-story-button {
		position: fixed;
		bottom: 15%;
		right: 7%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px;
		background-color: #fff;
		border-radius: 20px;
		box-shadow: #f1f1f1 -1px -1px 5px;
		border: 1px solid #f1f1f1;
		transition: width .5s;
		justify-content: center;


		&-icon {
			color: $light_text_gray3;
		}
		
		&-text {
			margin-left: 5px;
			color: $light_text_gray3;
			lines: 1;
		}
	}

	.reader {
		min-height: 105%;
		.downwarp-progress {
			display: none !important;
		}
	}

	.next-footer {
		margin-top: 20px;

		&-banner {
			background-color: #f1f1f1;
			height: 50px;
			display: flex;
			justify-content: center;
			align-items: center;

			&-text {
				color: #C0C0CC;
			}
		}
	}
	
	.highlight {
		color: $light_brand_02;
	}
</style>