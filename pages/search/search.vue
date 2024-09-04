<template>
	<view>
		<view class="page-header"></view>
		<view class="search-container">
			<uni-search-bar ref="searchBar" @clear="clear" @confirm="search" @cancel="cancel" focus="true" v-model="searchVal" bg-color="#ffffff"
				:radius="100"></uni-search-bar>
		</view>
		<view class="search-history">
			<view class="search-history-header">
				<text class="search-history-header-title">搜索历史</text>
				<text v-if="history.length" class="search-history-header-clean" @click="deleteHistory">
					<text>
						<image class="search-history-header-clean-icon" src="../../static/clear.svg"></image>
					</text>
					<text class="search-history-header-clean-text">
						清除
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
			};
		},
		async onLoad(query) {
			if (query.searchVal) {
				this.searchVal = query.searchVal;
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
							searchVal: this.searchVal?.trim()
						});
					}
				});
				if (!this.searchVal?.trim()) {
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

				const newHistory = [...new Set([this.searchVal, ...historyItems])];

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
					title: "删除全部搜索历史?",
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
	page {
		background-color: #F6F6F9;
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
				color: #221F33;
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
				color: #919099;

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
				border: 1px solid #F0EDFF;

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
				background-color: #ffffff;

				overflow: hidden;
				color: #605C73;
				text-overflow: ellipsis;

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
</style>