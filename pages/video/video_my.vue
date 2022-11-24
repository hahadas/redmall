<template>
	<view class="my">
		
		<!-- 标题栏和状态栏占位符 -->
		<view class="status-bar-height" style="background-color: #161823;"></view>
		<view class="status-bar-height-height" style="background-color: #161823;"></view>
		
		<view @click="uploadImages" class="banner" :style="'background-image: url('+memberData.userAvatar+');'"></view>
		
		<view class="user-info color-w flex flex-between">
			<view class="header">
				<image :src="memberData.userIcon" class="round" mode="aspectFill"></image>
			</view>
			<view class="right" v-if="showFlag && userFlag">
				<text class="btn" @tap="sendVideo">
					<text class="iconfont icon-shipin">&#xe643;</text>
				</text>
				<text class="btn" @tap="commentMsg">
					<text class="iconfont">&#xe62e;</text>
				</text>
				<text class="btn" @tap="settingMsg">
					<text class="iconfont">&#xe628;</text>
				</text>
			</view>
			<view class="right" v-if="showFlag && !userFlag">
				<text class="btn" @tap="guanZhuByUser(1)" v-if="likeItsByUserId">
					取关
					<text class="iconfont icon">&#xe619;</text>
				</text>
				<text class="btn" style="background-color: #dd2d70;border-color: #c82866;" @tap="guanZhuByUser(0)" v-else>
					关注
					<text class="iconfont icon">&#xe618;</text>
				</text>
				<text class="btn" @tap="jiGuangMsg">
					私信
					<text class="iconfont icon">&#xe690;</text>
				</text>
			</view>
		</view>
		
		<!-- username -->
		<view class="user-detail">
			<view class="left flex">
				<text class="color-w font36"> {{memberData.userNickName}} </text>
				<!-- 签名 -->
				<text class="font28 color-b9">{{memberData.userNote ? memberData.userNote:"未填写个性签名"}} </text>
			</view>
		</view>
		
		<!--  -->
		<view class="tabs">
			<view class="flex flex-center">
				<text class="number">{{userData.dianZan}}</text>
				<text class="font30 color-b9">获赞</text>
			</view>
			<view class="flex flex-center">
				<text class="number">{{userData.guanZhu}}</text>
				<text class="font30 color-b9">关注</text>
			</view>
			<view class="flex flex-center">
				<text class="number">{{userData.fenSi}}</text>
				<text class="font30 color-b9">粉丝</text>
			</view>
		</view>
		
		<!-- 广告 -->
		<view class="adv flex flex-center">
			<image :src="staticUrl + 'video/adv.png'" mode="widthFix"></image>
			<!-- <image v-else :src="subjectByKey.pic" @click="navByNotices(subjectByKey.id)" mode="widthFix"></image> -->
		</view>
		
		<!-- tab -->
		<view class="list tabs">
			<view class="item" :class="index==tabCurrentIndex?'active':''" v-for="(item,index) in navList" :key="index" @tap="tabSelect" :data-id="index">
				<text class="">{{item.text}} {{item.number}}</text>
			</view>
		</view>
		
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab" :style="{height:videoAllHeight+'px'}" style="background-color: #161823;">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				
				<scroll-view :style="{height:videoAllHeight+'px'}" scroll-y>
					<view v-if="tabItem.videoList.length > 0 && tabItem.type != 1" class="grid">
						<block v-for="(item, index) in tabItem.videoList" :key="index">
							<view @click="showVideo(tabItem.type,index)" class="grid-item" :style="{height:videoHeight+'px'}">
								<image :src="item.image" mode="heightFix" class="img"></image>
								<view style="position: relative;left: 20upx;bottom: 70upx;">
									<image :src="staticUrl + 'video/video_love.png'" style="width: 50upx;height: 50upx;"></image>
									<text style="color: #ffffff;font-weight: bold;font-size: 32upx;">{{item.likes}}</text>
								</view>
							</view>
						</block>
					</view>
					<view v-if="tabItem.videoList.length > 0 && tabItem.type == 1" class="flex flex-column">
						<view class="cu-item" style="background-color: #161823;" v-for="(item, index) in tabItem.videoList" :key="index" v-if="item.likeId > 0">
							<view class="flex flex-align-center">
								<view @click="showByLikeUser(item.videoUserId)" class="cu-avatar" :style="'background-image:url('+item.icon+');'"></view>
								<view @click="showByLikeUser(item.videoUserId)" class="content">
									<view class="font32" style="color: #ffffff;font-weight: bold;">{{item.nickname}}</view>
									<view class="flex flex-align-center font26 color-b9">
										<view class="text-cut" style="width: 40%;">
											获赞: <text style="color: #ffffff;margin-left: 10upx;">{{item.dianZan}}</text>
										</view>
										<view class="text-cut" style="width: 40%;">
											粉丝: <text style="color: #ffffff;margin-left: 10upx;">{{item.fenSi}}</text>
										</view> 
									</view>
								</view>
							</view>
							<view class="time">
								<text>关注时间: {{myImUtils.formatDateTime(item.createTime, "Y-m-d")}}</text>
							</view> 
							<view class="action" v-if="showFlag && userFlag && item.likeId > 0">
								<text @click="cancelGuanZu(item.videoUserId,index)">取关</text>
							</view>
						</view>
					</view>	
					
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
				
			</swiper-item>
		</swiper>
		
		<avatar style="background-color: #161823;" @upload="myUpload" ref="avatar"></avatar>
		
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import imUtils from '@/common/im/imTools.js';
	import upload from "@/common/http/upload.js"
	import publics from "@/common/utils/public.js"
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	
	
	export default {
		components: {
			avatar
		},
		data() {
			return {
				staticUrl: this.$staticUrl,
				subjectByKey:null,
				myImUtils:imUtils,
				avatarFlag:'display: none;',
				avatarDefoutUrl:'https://yunjulai-oss.oss-cn-shenzhen.aliyuncs.com/defout/jiuYinUserImage.jpg',
				showOnByStatus:false,
				showFlag: false,
				userFlag: false,
				likeItsByUserId: false,
				userId:0,
				videoAllHeight:400,
				videoHeight:300,
				TabCur: 0,
				scrollLeft: 0,
				memberData:{},
				userData:{
					dianZan:"-",
					guanZhu:"-",
					fenSi:"-"
				},
				tabCurrentIndex: 0,
				navList: [
					{
						type: 0,
						text: '作品',
						loadingType: 'more',
						pageNum:0,
						number: "-",
						videoList: []
					},
					{
						type: 1,
						text: '关注',
						loadingType: 'more',
						pageNum:0,
						number: "-",
						videoList: []
					},
					{
						type: 2,
						text: '喜欢',
						loadingType: 'more',
						pageNum:0,
						number: "-",
						videoList: []
					}
				],
				tabList:[
					{
						name:'作品',
						number: "-"
					},
					{
						name:'关注',
						number: "-"
					},
					{
						name:'喜欢',
						number: "-"
					}
				],
				videoList: []
			};
		},
		onLoad(options) {
			//计算屏幕宽度算出合理的高度
			let systemInfo = uni.getSystemInfoSync();
			let windowWidth = ((systemInfo.windowWidth)/3)-20;//三个一排减去空隙得到每个的宽度
			let autoHeight = (windowWidth/3)*5;//采用比例为5:3
			this.videoHeight = parseInt(autoHeight);//取整
			
			if(options.userId){
				this.userId = options.userId;
			}
			
			//计算高度
			this.videoAllHeight = this.videoHeight;
			
			//数据初始化
			this.userVideoInit();
		},
		onShow() {
			console.log(this.showOnByStatus);
			if(this.showOnByStatus){
				//数据初始化
				this.pullDownRefreshMain();
			}
			// this.subjectDetailByKey();
		},
		methods:{
			navByNotices(id){
				this.$navigateTo("/pages/notice/details?id="+id);
			},
			async subjectDetailByKey(){
				let _this = this;
				let data = await this.$http('get', url.cms.subjectDetailKey, {key:"public_jiuyin_center",categoryId:1});
				if(data){
					_this.subjectByKey = data;
				}
			},
			uploadImages(){
				if(this.showFlag && this.userFlag){
					// 关闭下拉刷新
					const pages = getCurrentPages();  
					const page = pages[pages.length - 1];  
					const currentWebview = page.$getAppWebview();
					currentWebview.setStyle({  
					  pullToRefresh: {  
					    support: false
					  }  
					});  
					
					this.avatarFlag = '';
					upload.showAvatarModal(this, 750, 400)
				}
			},
			async myUpload(rsp) {
				// 开启下拉刷新
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];  
				const currentWebview = page.$getAppWebview();
				currentWebview.setStyle({  
					pullToRefresh: {  
						support: true
					}  
				}); 
				let that = this;
				let res = upload.imgUpload(rsp)
				if(res){
					that.userAvatarUpdatae(res.cursorId,res.fileUrl);
				}
			 },
			 async userAvatarUpdatae(id,url){
				 let that = this;
				 let res = await this.$http('post', url.interaction.updateJiuYinAvatar, {id:id},true);
				 that.memberData.userAvatar = url;
				 uni.hideLoading();
				 this.$msg("修改成功");
			 },
			async userVideoInit(){
				let that = this;
				let res = await this.$http('get', url.interaction.userVideoInit, {userId:this.userId});
				if(res.code === 200){
					let data = res.data
					if(!data.memberMap.userAvatar || data.memberMap.userAvatar.trim() == ''){
						data.memberMap.userAvatar = that.avatarDefoutUrl;
					}
					that.memberData = data.memberMap;
					that.userData.dianZan = data.dianZan;
					that.userData.guanZhu = data.guanZhu;
					that.userData.fenSi = data.fenSi;
					
					that.navList[0].number = data.zuoPin;
					that.navList[1].number = data.guanZhu;
					that.navList[2].number = data.xiHuan;
					
					that.userFlag = data.userFlag;
					that.likeItsByUserId = data.likeItsByUserId;
					
					that.showFlag = true;

					that.getVideoList();
				}
			},
			sendVideo(){
				this.showOnByStatus = true;
				this.$navigateTo("/pages/video/sendVideo");
			},
			jiGuangMsg(){
				let that = this;
				this.$navigateTo("../interaction/im-chat?title="+that.memberData.userNickName)
			},
			commentMsg(){
				this.$navigateTo("/pages/video/video_comment");
			},
			settingMsg(){
				this.showOnByStatus = true;
				this.$navigateTo("/pages/user/setting/personal");
			},
			tabSelect(e) {
				this.tabCurrentIndex = e.currentTarget.dataset.id;
				//this.getVideoList();
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.getVideoList();
			},
			//下拉刷新
			onPullDownRefresh() {
				this.pullDownRefreshMain();
				//this.getVideoList();
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 5000);
			},
			pullDownRefreshMain(){
				this.navList[0].loadingType = 'more';
				this.navList[1].loadingType = 'more';
				this.navList[2].loadingType = 'more';
				
				this.navList[0].videoList = [];
				this.navList[1].videoList = [];
				this.navList[2].videoList = [];
				
				this.navList[0].pageNum = 0;
				this.navList[1].pageNum = 0;
				this.navList[2].pageNum = 0;
				
				this.userVideoInit();
			},
			//加载更多
			onReachBottom() {
				this.getVideoList();
			},
			showByLikeUser(videoUserId){
				uni.navigateTo({
					url:'/pages/video/video_my?userId='+videoUserId
				})
			},
			//取消关注
			async cancelGuanZu(id,index){
				let that = this;
				that.followByUser(id,1);
				that.navList[1].videoList[index].likeId = -1;
				that.navList[1].number -= 1;
			},
			//关注、取消关注当前博主
			async guanZhuByUser(type){
				// type-0关注 1-取消关注
				this.followByUser(this.userId,type);
				publics.setGuanZhuDatasJiLu(this.userId,type);
			},
			//关注/取消关注
			async followByUser(userId, type) {
				let res = await this.$http('post', url.interaction.followByUserId, {
					userId: userId,
					type: type
				});
				this.userVideoInit();
			},
			//浏览视频
			showVideo(type,index){
				//保存数据到本地
				let data;
				if(type == 0){//作品
					data = this.navList[0];
				}else{//喜欢
					data = this.navList[2];
				}
				data.userId = this.userId;
				data.icon = this.memberData.userIcon;
				data.nickname = this.memberData.userNickName;
				data.index = index;
				data.userFlag = this.userFlag;
				this.showOnByStatus = true;
				uni.setStorageSync("VideoByUserData",JSON.stringify(data));
				this.$navigateTo("/pages/video/indexByUser");
			},
			async getVideoList() {
				let that = this;
				let navList = this.navList[this.tabCurrentIndex];
				
				//计算高度
				if(this.navList[this.tabCurrentIndex].videoList.length>0){
					if(navList.type == 1){
						this.videoAllHeight = this.navList[this.tabCurrentIndex].videoList.length*150;
					}else{
						let sizeLength = ((this.navList[this.tabCurrentIndex].videoList.length)/3);
						if(sizeLength <= 1){
							this.videoAllHeight = this.videoHeight+100;		
						}else{
							sizeLength = sizeLength+"";
							if(sizeLength.indexOf(".") != -1){
								sizeLength = parseInt(sizeLength)+1;
							}
							this.videoAllHeight = (sizeLength*this.videoHeight)+100;		
						}
					}
				}
				
				if(navList.loadingType == "noMore"){
					uni.stopPullDownRefresh();
					return;
				}
				this.navList[this.tabCurrentIndex].loadingType = 'loading';
				
				let res = await this.$http('get', url.interaction.userVideoType, {userId:this.userId,type:navList.type,pageSize:navList.pageNum});
				uni.stopPullDownRefresh();
				if(res.code === 200){
					let data = res.data
					that.navList[that.tabCurrentIndex].videoList = [...that.navList[that.tabCurrentIndex].videoList,...data];	
					
					//计算高度
					if(data && data.length > 0){
						if(navList.type == 1){
							that.videoAllHeight = that.navList[that.tabCurrentIndex].videoList.length*150;
						}else{
							let sizeLength = ((that.navList[that.tabCurrentIndex].videoList.length)/3);
							if(sizeLength <= 1){
								that.videoAllHeight = that.videoHeight+100;		
							}else{
								sizeLength = sizeLength+"";
								if(sizeLength.indexOf(".") != -1){
									sizeLength = parseInt(sizeLength)+1;
								}
								that.videoAllHeight = (sizeLength*that.videoHeight)+100;		
							}
						}
					}
					
					//判断是否还有数据
					if(navList.type == 1){//关注
						if(that.navList[that.tabCurrentIndex].videoList.length >= parseInt(that.navList[1].number)){
							that.navList[that.tabCurrentIndex].loadingType = "noMore";
						}else{
							that.navList[that.tabCurrentIndex].loadingType = "more";
							that.navList[that.tabCurrentIndex].pageNum += 1;
						}
					}else if(navList.type == 2){//喜欢
						if(that.navList[that.tabCurrentIndex].videoList.length >= parseInt(that.navList[2].number)){
							that.navList[that.tabCurrentIndex].loadingType = "noMore";
						}else{
							that.navList[that.tabCurrentIndex].loadingType = "more";
							that.navList[that.tabCurrentIndex].pageNum += 1;
						}
					}else{//作品
						if(that.navList[that.tabCurrentIndex].videoList.length >= parseInt(that.navList[0].number)){
							that.navList[that.tabCurrentIndex].loadingType = "noMore";
						}else{
							that.navList[that.tabCurrentIndex].loadingType = "more";
							that.navList[that.tabCurrentIndex].pageNum += 1;
						}
					}
				}
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.my{
	background-color: #161823;
	height: 100vh;
	width: 100vw;
}
.banner{
	width: 100vw;
	height: 400upx;
	background-size: 100% 100%;
}
.user-info{
	.header{
		padding: 20upx 0upx 0upx 60upx;
		.round{
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
		}
	}
	.right{
		.btn{
			background-color: rgba(57,58,68,0.5);
			color: #FFFFFF;
			padding: 10upx 30upx;
			margin: 0 8upx;
			border: 1px solid rgba(217,210,194,0.3);
			font-size: 30rpx;
			.icon{
				margin-left: 10rpx;
				font-size: 38rpx;
			}
		}
	}
}

.user-detail{
	border-bottom: 1px solid rgba(217,210,194,0.2);
	padding: 10upx 0;
	.left{
		flex-direction: column;
		padding: 0upx 10upx 0upx 40upx;
		.number{
			margin: 10upx 0;
		}
	}
}
.tabs{
	display: flex;
	align-items: center;
	justify-content: space-around;
	color: #FFFFFF;
	padding: 20rpx;
	.number{
		font-weight: bold;
		margin-right: 10rpx;
		font-size: 32rpx;
	}
}
.list{
	.item{
		display:  flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		width: 33.33%;
		border-bottom: 2rpx solid #161823;
		padding-bottom: 20rpx;
		color: #999999;
	}
	.active{
		color: #FFFFFF;
		border-bottom: 6rpx solid #fff;
	}
}

.adv{
	padding: 20upx;
	image{
		width: 100%;
		height: 50rpx;
	}
}

.grid{
	display: flex;
	flex-wrap: wrap;
	&-item{
		width: 32%;
		margin-left: 10rpx;
		margin-bottom: 10rpx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
}
.cu-item{
	padding: 20rpx 20rpx 0;
	border-bottom: 2rpx solid #d5d4d7;
	position: relative;
	.cu-avatar{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 16rpx;
		background-size: cover;
		margin-bottom: 4rpx;
	}
	.content{
		width: 100%;
	}
	.time{
		display: flex;
		justify-content: flex-end;
		font-size: 26rpx;
		color: #a5a5a5;
	}
	.action{
		position: absolute;
		right: 20rpx;
		top: 40rpx;
		color: #fc1e1e;
		border: solid 1px #fc1e1e;
		border-radius: 30%;
		padding: 6upx 20upx;
		font-size: 28rpx;
	}
}
</style>
