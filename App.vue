<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			plus.screen.lockOrientation("portrait-primary");
			console.log('current theme is', uni.getSystemInfoSync().osTheme);
			// uni.showToast({
			// 	icon: 'none',
			// 	title: uni.getSystemInfoSync().osTheme,
			// });
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import '@/App.scss';
	@import '@/common/theme.scss';
</style>
