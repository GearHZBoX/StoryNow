<template>
	<view class="about-us">
		<fixed-header backIcon id="navigator"  style="background: var(--light-brand-04, #F6F6F9);"> 
			<view class="navigator-text">
				About Us
			</view>
		</fixed-header>

		<view class="content-box">
			<view class="content-title">
				This is the 'About Us' section title，this is the 'About Us' section title.
			</view>
			Lena walked briskly along the path that wound through the small park, the early evening sun casting long
			shadows on the ground. The lake at the center of the park shimmered with the reflection of the orange and
			pink sky. She had come here every day for the past week, always at the same time, hoping to see him again. A
			week ago, Lena had been sitting on the old wooden bench by the lake, sketching the scene before her. The
			tranquility of the water, the rustle of leaves, and the distant laughter of children had always brought her
			peace. But that day, her peace was interrupted by the sound of footsteps approaching. “Mind if I sit here?”
			a gentle voice asked. Startled, Lena looked up to see a man about her age, with kind brown eyes and an easy
			smile. He wore a simple white shirt and jeans, his dark hair slightly tousled by the breeze. “Of course,”
			she had replied, moving her sketchpad to make room. He sat down, close enough for her to catch the faint
			scent of his cologne. For a moment, they sat in comfortable silence, both watching the ducks glide across
			the water. “Do you come here often?” he eventually asked. “Almost every day,” Lena said, glancing at him
			with curiosity. “It’s my favorite place to draw.” He smiled, a little sheepishly. “I just moved to the
			neighborhood. Thought I’d explore a bit.” They talked for what felt like hours, about everything and
			nothing. His name was Ethan, and he had recently started a new job in the city. He asked about her art, and
			she shyly showed him a few of her sketches. He admired them genuinely, making her cheeks flush with a warmth
			she hadn’t felt in a long time. When the sun dipped below the horizon, they both stood, reluctant to part
			ways. “Maybe I’ll see you here again?” Ethan had asked, hope glinting in his eyes. “Maybe,” Lena had
			replied, her heart fluttering. And so, she had returned every day since, replaying their conversation in her
			mind. But each time, she left the park alone, her anticipation turning to disappointment.
		</view>
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

			}
		},
		methods: {
			
		},
		onLoad() {
			uni.loadFontFace({
			    family: 'Open Sans',
			    // 本地字体路径需转换为平台绝对路径
			    source: `url(${plus.io.convertLocalFileSystemURL('_www/static/OpenSans-Regular.ttf')})`,
			})
		}
	}
</script>

<style scoped lang="scss">
	.about-us {
		position: relative;
		.navigator-text{
			padding-right: 40px;
			text-align: center;
			color: var(--light-text-gray01, $light_text_gray1);
			text-align: center;
			text-overflow: ellipsis;
			white-space: nowrap;
			/* Title/medium */
			
			
			font-family: "Open Sans";
			font-size: 16px;
			font-style: normal;
			font-weight: 600;
			line-height: 20px; /* 142.857% */
			flex:1;
		}
		.content-box {
			padding: 30px 16px;
			color:  $light_text_gray2;
			font-family: "PingFang SC";
			white-space: pre-wrap;
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 20px; /* 142.857% */
			.content-title{
				overflow: hidden;
				color: $light_text_gray1;
				font-family: "Open Sans";
				font-size: 16px;
				font-style: normal;
				font-weight: 400;
				line-height: 20px; /* 125% */
				margin-bottom:8px;
			}
		}
	}
</style>