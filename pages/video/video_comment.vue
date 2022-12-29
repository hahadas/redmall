<template>
	<view style="height: 100%;">
		<you-scroll
			@onPullDown="refresh"
			@onLoadMore="loadMore">
			<block v-for="(item,index) in list" :key="index">
				<view class="cu-card dynamic" @click="showVideo(item)">
					<view class="cu-item shadow">
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								<view class="cu-avatar round lg" :style="'background-image:url('+item.icon+');'"></view>
								<view class="content flex-sub">
									<view>
										{{item.nickname}}
										<text class="color-purple" v-if="item.commentsType == 0 || item.commentsType == 1"> #评论我</text>
										<text class="color-purple" v-if="item.commentsType == 2"> #回复我</text>
									</view>
									<view class="text-gray text-sm flex justify-between">
										{{item.createTime}}
									</view>
								</view>
							</view>
						</view>
						<view class="text-content">
							{{item.note}}
						</view>
						<view class="bg-grey padding-sm radius margin-top-sm  text-sm">
							<view class="flex" v-if="item.commentsType == 0">
								<view style="color: #ffffff;font-weight: bold;">评论我的视频: {{item.videoNode}}</view>
							</view>
							<view class="flex" v-if="item.commentsType == 1">
								<view style="color: #ffffff;font-weight: bold;">我的评论: {{item.myOneNote}}</view>
							</view>
							<view class="flex" v-if="item.commentsType == 2">
								<view style="color: #ffffff;font-weight: bold;">我的评论: {{item.myTwoNote}}</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			
			<uni-load-more :status="loadingType"></uni-load-more>
		</you-scroll>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import imUtils from '@/common/im/imTools.js';
	import youScroll from '@/components/you-scroll'
	export default {
		components: { youScroll },
		data() {
			return {
				staticUrl: getApp().staticUrl,
				loadingType: 'nomore',
				count:0,
				list:[]
			};
		},
		mounted(options) {
			//数据初始化
			this.loadMore();
		},
		methods:{
			async showVideo(item){
				//获取视频信息
				let res = await this.$http('get', url.interaction.getVideoByCommentId, {videoId:item.videoId});
				let data = res.data
				if(data){
					uni.setStorageSync("VideoByUserCommentOneData",JSON.stringify(data));
					this.$navigateTo("/pages/video/videoComment?commentId="+item.id);
				}
			},
			async loadMore(done){
				this.loadingType = 'loading';
				let that = this;
				let res = await this.$http('get', url.interaction.commentsByMe, {pageSize:this.list.length});
				let data = res.data
				if(data){
					// for(let i=0;i<data.list.length;i++){
					// 	if(data.list[i].createTime){
					// 		data.list[i].createTime = imUtils.fromTimer(data.list[i].createTime);
					// 	}
					// }
					that.list = [...that.list,...data.list];
					that.count = data.count;
					
					if(that.list.length < data.count){
						that.loadingType = 'more';
					}else{
						that.loadingType = 'nomore';
					}
				}
				if (typeof done === "function") done()
				
			},
			//下拉刷新
			refresh(done) {
				this.list = []
				this.loadMore(done);
			}
		}
	}
</script>

<style>
	@import url('../../common/main.css');
</style>
<style lang="less">
</style>