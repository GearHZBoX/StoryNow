<template>
	<view class="feedback">
		<fixed-header backIcon id="navigator" style="background: $light_brand_04;">
			<view class="navigator-text">
				Report and Feedback
			</view>
		</fixed-header>

		<view class="input-box">
			<view class="title">
				<view class="left">Feedback Content <text>*</text></view>
				<view class="right">{{text.length}}/500</view>
			</view>
			<textarea class="textarea" v-model.trim="text" :maxlength="500"
				placeholder="Providing additional details will help us identify the issue more accurately."></textarea>
		</view>


		<view class="input-box">
			<view class="title">
				<view class="left">Upload Image </view>
				<view class="right">{{imgList.length}}/9</view>
			</view>
			<view class="img-list">
				<view class="img-item" v-for="(item,index) in imgList" :key="item.value">
					<img :src="item">
					<view class="delete" @click="deleteImg(index)"></view>
				</view>
				<view class="upload-btn" @click="toPickImg" v-if="imgList.length<9">
					<view class="upload-btn-icon"></view>
				</view>
			</view>
			<view class="notice">You can upload a screenshot of the issue.</view>
		</view>

		<view class="bottom-btn">
			<view :class="`submit ${text.length?'':'disabled'}`" @click="toSubmit">Submit</view>
		</view>
	</view>
</template>

<script>
	import {
		importObjectConfig
	} from "../../utils/index.js"
	import fixedHeader from '../../components/fixed-header.vue';
	const FeedbackCloud = importObjectConfig('feedback')
	export default {
		components: {
			fixedHeader,
		},
		data() {
			return {
				text: "",
				imgList: [],
			}
		},
		onLoad() {
			uni.loadFontFace({
			    family: 'Open Sans',
			    // 本地字体路径需转换为平台绝对路径
			    source: `url(${plus.io.convertLocalFileSystemURL('_www/static/OpenSans-Regular.ttf')})`,
			});
		},
		methods: {
			deleteImg(i) {
				this.imgList.splice(i, 1)
			},

			// 文件上传
			toPickImg() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						console.log(JSON.stringify(res.tempFilePaths));

						console.log("文件上传", this, res.tempFilePaths);

						this.uploadImg(res.tempFilePaths[0])
					},
				});
			},

			uploadImg(filePath) {
				uni.showLoading({
					title: 'uploading...'
				});
				uniCloud.uploadFile({
					filePath: filePath,
					cloudPath: `/feedback/${new Date().getTime()}`,
					cloudPathAsRealPath: true,
					// onUploadProgress: function(progressEvent) {
					//   console.log(progressEvent);
					//   var percentCompleted = Math.round(
					//     (progressEvent.loaded * 100) / progressEvent.total
					//   );
					// },
					success: (res) => {
						console.log("文件上传成功", res.fileID)
						this.imgList.push(res.fileID);

					},
					fail(err) {
						console.log("文件上传失败", err)
						uni.showToast({
							title: "文件上传失败"
						})
					},
					complete() {
						uni.hideLoading()
					}
				});
			},

			async toSubmit() {
				if (!this.text) {
					uni.showToast({
						icon: "none",
						title: "Please enter text first"
					})
					return;
				}
				uni.showLoading({
					mask: true,
					title:"loading..."
				})
				try {
					const res = await FeedbackCloud.createFeedBack({
						content: this.text,
						imgList: this.imgList
					})

					if (res.id) {
						uni.showToast({
							icon: "none",
							title: "Submission successful. We will address it as soon as possible.",
							success(){
								uni.navigateBack();
							}
						})
						
					}
				} catch (e) {
					console.log(e)
				}
				uni.hideLoading();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.feedback {
		box-sizing: border-box;

		.navigator-text {
			flex: 1;
			padding-right: 40px;
			text-align: center;
			color: var(--light-text-gray01, $light_text_gray1);
			text-align: center;
			text-overflow: ellipsis;
			white-space: nowrap;
			/* Title/medium */
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: 20px;
			/* 142.857% */
		}

		.input-box {
			padding: 26px 24px 0;

			.title {
				display: flex;
				justify-content: space-between;

				.left {
					color: $light_text_gray1;
					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 500;
					line-height: 20p

					/* 142.857% */
					text {
						color: $light_function_red;
					}
				}

				.right {
					color: $light_text_gray3;
					text-align: center;
					/* 12-16-regular */
					font-family: "PingFang SC";
					font-size: 12px;
					font-style: normal;
					font-weight: 400;
					line-height: 16px;
					/* 133.333% */
				}

			}

			.textarea {
				width: 100%;
				border-radius: 12px;
				background: $light_brand_04;
				margin-top: 10px;
				padding: 12px;
				box-sizing: border-box;
				color: $light_text_gray1;
				/* body/regular */
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: 20px;

				/* 142.857% */
				&::placeholder {
					color: $light_text_gray4;
					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 400;
					line-height: 20px;
					/* 142.857% */
				}
			}

			.img-list {
				margin-top: 10px;
				display: flex;
				flex-wrap: wrap;

				.upload-btn {
					width: 82px;
					height: 82px;
					border-radius: 12px;
					background: $light_brand_04;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-grow: 0;
					flex-shrink: 0;
					margin: 0 8px 8px 0;

					.upload-btn-icon {
						width: 24px;
						height: 24px;
						background: url("../../static/user-center/photo.svg") center/100% auto no-repeat;
					}
				}

				.img-item {
					width: 82px;
					height: 82px;
					border-radius: 12px;
					background: $light_brand_04;
					margin: 0 8px 8px 0;
					flex-grow: 0;
					flex-shrink: 0;
					position: relative;
					overflow: hidden;

					img {
						width: 100%;
						height: 100%;
						border-radius: 12px;
						object-fit: contain;
					}

					.delete {
						width: 16px;
						height: 16px;
						position: absolute;
						right: 10px;
						top: 10px;
						background: url('../../static/user-center/clear.svg') center/100% auto no-repeat;
					}
				}
			}

			.notice {
				color: $light_text_gray3;
				margin-top: 0px;
				/* body/regular */
				font-family: "Open Sans";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 16px;
				/* 133.333% */
			}
		}

		.bottom-btn {
			height: 88px;
			display: flex;
			justify-content: center;
		}

		.submit {
			width: 339px;
			height: 44px;
			border-radius: 27px;
			background: var(--light-brand-02, #9883FC);
			display: flex;
			justify-content: center;
			align-items: center;
			color: var(--light-function-00, #FFF);
			text-align: center;
			/* Title/medium */
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: 20px;
			/* 142.857% */
			position: fixed;
			bottom: 44px;

			&.disabled {
				opacity: 0.8;
			}
		}
	}
</style>