<template>
	<view style="position: relative;">
		<fixed-header backIcon id="navigator">
			<text class="navigator-text" :style="`opacity: ${showNavigatorTitle ? 1 : 0};`">
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
		<view class="ticket" v-if="!loading && !story.hasPermission">
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
			};
		},
		computed: {
			userInfo() {
				return store.userInfo || {};
			},
		},
		methods: {
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
					return;
				}
				
				console.log('already has permission');
			},
		},
		onReady() {
			this.pageHeight = uni.getSystemInfoSync().windowHeight;
			this.pageWidth = uni.getSystemInfoSync().windowWidth;
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
		}
	}
</script>

<style lang="scss">
	@import '@/common/uni-ui.scss';

	.reader-header {
		padding: 12px 16px 8px;

		&-title {
			overflow: hidden;
			color: #221F33;
			text-overflow: ellipsis;

			/* Title/bold */
			font-family: "Open Sans";
			font-size: 20px;
			font-style: normal;
			font-weight: 600;
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
				color: #605C73;
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
				color: #919099;
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
			color: #605C73;
			overflow: hidden;
			text-overflow: ellipsis;

			/* body/regular */
			font-family: "PingFang SC";
			font-size: 18px;
			font-style: normal;
			font-weight: 400;
			line-height: 28px;
			/* 155.556% */
		}
	}

	.navigator-text {
		lines: 1;
		overflow: hidden;
		color: #221F33;
		text-overflow: ellipsis;
		white-space: nowrap;

		/* Title/medium */
		font-family: "Open Sans";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: 20px;
		/* 125% */
		
		transition: opacity .25s;
	}
	
	.ticket {
		
		background-image: url('../../static/ticket.png');
		background-repeat: no-repeat;
		background-size: contain;
		margin: 0 16px;
		padding: 18px 16px;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: absolute;
		bottom: 0;
		
		&-left {
			
			width: 200px;
			display: flex;
			flex-direction: column;
			
			&-title {
				color: #483510;
				
				/* Title/medium */
				font-family: "Open Sans";
				font-size: 14px;
				font-style: normal;
				font-weight: 500;
				line-height: 20px; /* 142.857% */
			}
			
			&-description {
				color: #A68332;
				
				/* body/regular */
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 18px; /* 133.333% */
			}
		}
		
		&-divider {
			width: 0;
			height: 56px;
			border-left: 1px dashed #F8D177;
			margin-left: 49px;
		}
		
		&-right {
			border-radius: 40px;
			background: #F8D177;
			padding: 8px 20px;
			margin-left: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			
			&-prefix {
				color: #483510;
				text-align: center;
				
				/* Mobile/Button/B2_1_ZH */
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 600;
				line-height: 20px; /* 142.857% */
			}
			
			&-suffix {
				color: #483510;
				
				/* label/regular */
				font-family: "PingFang SC";
				font-size: 10px;
				font-style: normal;
				font-weight: 400;
				line-height: 12px;
			}
		}
	}
	
	.page-bottom {
		// height: 20px;
	}
	
	.preview-footer {
		background: linear-gradient(180deg, rgba(246, 246, 249, 0.00) 0%, #fff 100%);
		height: 70px;
		width: 100%;
		position: absolute;
		bottom: 90px;
	}
</style>