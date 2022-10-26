<template>
	<view class="main">
		<v-tabs 
			v-if="title === '公告'" :tabs="tabs" :value="current" 
			fontSize="30rpx" height="90rpx" :fixed="false" 
			:scroll="false" @change="tabsChange"></v-tabs>
		<module ref="module" :type='type'></module>
	</view>
</template>

<script>
	import module from './module.vue';
	export default {
		components: { module },
		data() {
			return {
				title: "",
				type: 1,
				current: 0,
				tabs: ["使用教程", "招商入驻"]
			};
		},
		onLoad(opt) {
			if (opt.type) {
				this.type = parseInt(opt.type)
			}
			if (opt.title) {
				this.title = opt.title
				uni.setNavigationBarTitle({
					title: opt.title
				})
			}
		},
		// onShow() {
		// 	if (this.$refs.module){
		// 		this.$refs.module.loadData();
		// 	}
		// },
		mounted() {
			this.$refs.module.loadData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.$refs.module.refresh();
		},
		//加载更多
		onReachBottom() {
			this.$refs.module.loadData();
		},
		methods:{
			tabsChange(e){
				this.current = e
				if (this.current === 0) {
					this.type = 2
				} else {
					this.type = 3
				}
				setTimeout(()=>{
					this.$refs.module.refresh();
				}, 300)
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}
	.main{
		width: 750rpx;
		overflow: hidden;
	}
</style>
