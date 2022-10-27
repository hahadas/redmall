<template>
	<view style="height: 100%;">
		<view :style="{height: 50+statusBarHeight + 'px'}"></view>
		<v-tabs :tabs="tabs" :value="current" fontSize="30rpx" height="90rpx" :fixed="true" :scroll="false" @change="tabsChange"></v-tabs>
		<scroll-view scroll-y="true" style="height: 100%;">
			<view v-if="current === 0">
				<send-video></send-video>
				<view style="height: 180px;"></view>
			</view>
			<view v-else>
				<view style="height: 30rpx;"></view>
				<send-dynamic></send-dynamic>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import sendDynamic from "../add.vue"
	import sendVideo from "../../video/sendVideo.vue"
	export default{
		components: { vTabs, sendVideo, sendDynamic },
		data(){
			return {
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight, // 状态栏高度
				tabs: ["发布视频", "发布动态"],
				current: 0
			}
		},
		methods:{
			tabsChange(e){
				this.current = e
			}
		}
	}
</script>

<style>
</style>
