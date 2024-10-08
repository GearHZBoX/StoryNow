<template>
	<view>
		<view class="page-header"></view>
		<view class="search-container">
			<uni-search-bar :placeholder="placeholder" ref="searchBar" @clear="clear" @confirm="search" @cancel="cancel" focus="true" v-model="searchVal" bg-color="$light_function_01"
				:radius="100" cancel-text="Cancel"></uni-search-bar>
		</view>
		<view class="search-history">
			<view class="search-history-header">
				<text class="search-history-header-title">Search History</text>
				<text v-if="history.length" class="search-history-header-clean" @click="deleteHistory">
					<text>
						<image class="search-history-header-clean-icon" src="../../static/clear.svg"></image>
					</text>
					<text class="search-history-header-clean-text">
						clean
					</text>
				</text>
			</view>
			<view class="search-history-content">
				<text class="search-history-content-item" v-for="item in history" @click="searchByHistory(item)" :key="item">{{item}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		SEARCH_HISTORY_STORAGE_KEY
	} from '../../common/constant';
	export default {
		data() {
			return {
				searchVal: '',
				history: [],
				placeholder: '',
			};
		},
		computed: {
			realSearchVal() {
				try{
					return this.searchVal.trim() || this.placeholder.trim()
				}catch(e){
					console.error(e);
					return '';
				}
			},
		},
		async onLoad(query) {
			uni.loadFontFace({
			    family: 'Open Sans',
			    // 本地字体路径需转换为平台绝对路径
			    source: `url(${plus.io.convertLocalFileSystemURL('_www/static/OpenSans-Regular.ttf')})`,
			});
			
			if (query.searchVal) {
				this.searchVal = query.searchVal;
			}
			if (query.placeholder) {
				this.placeholder = query.placeholder;
			}
			const {
				data: history
			} = await uni.getStorage({
				key: SEARCH_HISTORY_STORAGE_KEY,
			});
			if (Array.isArray(history)) {
				this.history = history;
			}
		},
		methods: {
			clear() {
				this.searchVal = '';
			},
			searchByHistory(historySearchVal) {
				this.searchVal = historySearchVal;
				this.search();
			},
			async search() {
				uni.navigateBack({
					success: () => {
						uni.$emit('index-search', {
							searchVal: this.realSearchVal,
						});
					}
				});
				if (!this.realSearchVal) {
					return;
				}
				let historyItems = [];
				try {
					const {
						data: searchHistory
					} = await uni.getStorage({
						key: SEARCH_HISTORY_STORAGE_KEY
					});
					console.log('history', searchHistory);
					if (Array.isArray(searchHistory)) {
						historyItems = searchHistory;
					}
				} catch (err) {
					console.error(err);
				}

				const newHistory = [...new Set([this.realSearchVal, ...historyItems])];

				uni.setStorage({
					key: SEARCH_HISTORY_STORAGE_KEY,
					data: newHistory,
				})
			},
			cancel() {
				uni.navigateBack();
			},
			deleteHistory() {
				uni.showModal({
					title: "Clear search histories?",
					success: ({
						confirm,
						cancel
					}) => {
						if (confirm) {
							uni.removeStorage({
								key: SEARCH_HISTORY_STORAGE_KEY,
							}).then(() => {
								this.history = [];
							})
						}
					},

				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/uni-to-storynow.scss';
	
	page {
		background-color: $light_brand_04;
	}

	.search-container {
		margin: 0 8px;
		margin-bottom: 16px;
	}

	.search-history {
		padding: 8px 16px;

		&-header {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0 3px;
			margin-bottom: 8px;


			&-title {
				overflow: hidden;
				color: $light_text_gray1;
				text-overflow: ellipsis;

				/* Title/medium */
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 500;
				line-height: 20px;
				/* 142.857% */
			}

			&-clean {
				color: $light_text_gray3;

				/* body/regular */
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 16px;
				/* 133.333% */
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				padding: 4px 8px;
				border-radius: 16px;
				border: 1px solid $light_brand_03;

				&-icon {
					width: 9px;
					height: 9px;
					margin-right: 2px;
				}
			}
		}

		&-content {
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			column-gap: 8px;
			row-gap: 8px;

			&-item {
				padding: 6px 16px;
				border-radius: 20px;
				background-color: $light_function_01;
				lines: 1;
				max-width: 120px;

				overflow: hidden;
				color: $light_text_gray2;
				text-overflow: ellipsis;
				white-space: nowrap;

				/* body/regular */
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: 20px;
				/* 142.857% */
			}
		}
	}
	.search-container {		
		.uni-searchbar {
			padding-top: 0;
		}
	}
</style>