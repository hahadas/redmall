<template>
	<view style="height: 100%; overflow-y: scroll;">
		<view :style="{height: 50+statusBarHeight + 'px'}"></view>
		<v-tabs :tabs="tabs" :value="current" fontSize="30rpx" height="90rpx" :fixed="false" :scroll="false" @change="tabsChange"></v-tabs>
		<block v-if="current === 0">
			<video-comment></video-comment>
		</block>
		<block v-else>
			<dynamic-comment></dynamic-comment>
		</block>
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import videoComment from "../../video/video_comment.vue"
	import dynamicComment from "../commentList.vue"
	export default{
		components: { vTabs, videoComment, dynamicComment },
		data(){
			return{
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight, // 状态栏高度
				current: 0,
				tabs: ["视频评论", "动态评论"]
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
