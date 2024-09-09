<template>
	<view class="feedback">
		<fixed-header backIcon id="navigator">
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
				<view class="img-item" v-for="item in imgList" :key="item.value">
					<img :src="item">
					<view class="delete"></view>
				</view>
				<view class="upload-btn" @click="toPickImg" v-if="imgList.length<9">
					<img>
				</view>
			</view>
			<view class="notice">You can upload a screenshot of the issue.</view>
		</view>

		<view class="bottom-btn">
			<view class="submit" @click="toSubmit">Submit</view>
		</view>
	</view>
</template>

<script>
	const FeedbackCloud = uniCloud.importObject('feedback')
	import fixedHeader from '../../components/fixed-header.vue';
	export default {
		components: {
			fixedHeader,
		},
		data() {
			return {
				text: "",
				imgList: []
			}
		},
		methods: {
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
				try {
					const res = await FeedbackCloud.createFeedBack({
						content: this.text,
						imgList: this.imgList
					})
				} catch (e) {
				
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.feedback {
		box-sizing: border-box;

		.input-box {
			padding: 16px 24px 0;

			.title {
				display: flex;
				justify-content: space-between;

				.left {
					color: #221F33;
					font-family: "PingFang SC";
					font-size: 14px;
					font-style: normal;
					font-weight: 500;
					line-height: 20px;

					/* 142.857% */
					text {
						color: #FF5995;
					}
				}

				.right {
					color: #919099;
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
				background: #F6F6F9;
				margin-top: 10px;
				padding: 12px;
				box-sizing: border-box;
				color: #221F33;
				/* body/regular */
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: 20px;

				/* 142.857% */
				&::placeholder {
					color: #C0C0CC;
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
					background: #F6F6F9;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-grow: 0;
					flex-shrink: 0;
					margin: 0 8px 8px 0;

					img {
						width: 24px;
						height: 24px;
						border: 1px solid red;
					}
				}

				.img-item {
					width: 82px;
					height: 82px;
					border-radius: 12px;
					background: #F6F6F9;
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
						border: 1px solid red;
						position: absolute;
						right: 10px;
						top: 10px;
					}
				}
			}

			.notice {
				color: #919099;
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
			left: 18px;
		}
	}
</style>