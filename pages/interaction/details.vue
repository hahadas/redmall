<template>
	<view class="main">
		<view class="header">
			<view>
				<image :src="filterImg(detailInfo.icon, 1)" mode="aspectFill" class="avatar" @tap="jumpUser(detailInfo)"></image>
			</view>
			<view class="right">
				<view style="display: flex;align-items: center;">
					<text class="blue">{{detailInfo.nickname}}</text>
					<view class="six" :class="{'woman':detailInfo.gender === 3}">
						<text class="iconfont icon" v-if="detailInfo.gender === 2">&#xe621;</text>
						<text class="iconfont icon" v-if="detailInfo.gender === 3">&#xe622;</text>
						<text class="txt">{{detailInfo.age||0}}</text>
					</view>
				</view>
				<text class="con">{{detailInfo.comment}}</text>
				<view class="imgList" v-if="imgList.length > 0">
					<block v-if="imgList.length > 1">
						<image :src="filterImg(url, 2)" mode="aspectFill" class="item" v-for="(url, i) in imgList" :key="i" @tap="previewImg(imgList, i)"></image>
					</block>
					<image v-else :src="filterImg(imgList[0], 4)" class="itemMax" mode="aspectFill" @tap="previewImg(imgList, 0)"></image>
				</view>
				<view class="between">
					<text class="left">{{detailInfo.createTime}}</text>
					<text class="blue" v-if="detailInfo.userId === userId" @tap="onDel">删除</text>
				</view>
				<view class="between">
					<view class="item">
						<text class="iconfont icon">&#xe62e;</text>
						<text class="name">{{detailInfo.commentCount}}条评论</text>
					</view>
					<view class="item">
						<text class="iconfont icon" :class="{'red':isLike}">&#xe602;</text>
						<text class="name" @tap.stop="onLike">{{detailInfo.likeCount}}点赞</text>
					</view>
				</view>
			</view>
		</view>
		<text class="jiantou"></text>
		<div class="subnvue" @click.stop="">
			<div class="content" ref="content">
				<scroll-view scroll-y class="srcoll-view">
					<div v-if="dataList && dataList.length > 0" v-for="(item,index) in dataList" :style="index==0 ? 'margin-top: 20upx;':''" class="card" :key="index">
						<div class="card-left">
							<image v-if="item.status == 0" class="card-image" :src="item.icon" @tap="jumpUser(item)"></image>
							<image v-if="item.status != 0" class="card-image" :src="delVideoIcon"></image>
							<div class="card-content">
								<div class="card-top">
									<view style="display: flex;align-items: center;" v-if="item.status == 0" @click="commentByUser(item,0)">
										<text class="card-name" style="color: #55ADDF;font-size: 28upx;">{{item.nickname}}</text>
										<view class="six" :class="{'woman':item.gender === 2}" v-if="item.gender !== null">
											<image :src="'/static/six_w_'+ (item.gender === 1 ? 'man':'woman') + '.png'" mode="" class="icon"></image>
											<text class="txt">{{item.age||0}}</text>
										</view>
									</view>
									<text v-if="item.status != 0" class="card-name" style="width: 400rpx;color: #946565;font-size: 28upx;">-已删除</text>
									<text v-if="item.status == 0" @click="commentByUser(item,0)" class="color-grey" style="color: #999;font-size: 28upx;margin: 10rpx 0;">{{item.note}}</text>
									<text v-if="item.status != 0" class="color-grey" style="color: #999;font-size: 28upx; margin: 10rpx 0;">{{item.note}}</text>
									<text class="color-grey" style="color: #bdbdbd;font-size: 26upx;width: 500rpx;">{{item.createTime}}</text>
								</div>
								<!-- 二级评论、回复 -->
								<div class="card-message" style="padding-top: 10rpx;" 
								v-if="item.oneCommentsJson && item.oneCommentsJson.length > 0" 
								v-for="(itemTwo,indexTwo) in item.oneCommentsJson" :key="indexTwo">
									<image v-if="itemTwo.status == 0" class="card-image" style="height: 60rpx;width: 60rpx;" :src="itemTwo.icon" @tap="jumpUser(itemTwo)"></image>
									<image v-if="itemTwo.status != 0" class="card-image" style="height: 60rpx;width: 60rpx;" :src="delVideoIcon"></image>
									<div class="card-top">
										<view style="display: flex;align-items: center;" v-if="itemTwo.status == 0" @click="commentByUser(itemTwo,1)">
											<text class="card-name" style="color: #55ADDF;font-size: 28upx;">{{itemTwo.nickname}}</text>
											<view class="six" :class="{'woman':item.gender === 2}" v-if="item.gender !== null">
												<image :src="'/static/six_w_'+ (item.gender === 1 ? 'man':'woman') + '.png'" mode="" class="icon"></image>
												<text class="txt">{{item.age||0}}</text>
											</view>
										</view>
										<text v-if="itemTwo.status != 0" class="card-name" style="width: 350rpx;color: #946565;font-size: 28upx;">-已删除</text>
										
										<text v-if="itemTwo.status == 0" @click="commentByUser(itemTwo,1)" class="color-grey" style="color: #999;font-size: 28upx;width: 400rpx; margin: 10rpx 0;">{{itemTwo.note}}</text>
										<text v-if="itemTwo.status != 0" class="color-grey" style="color: #999;font-size: 28upx;width: 400rpx; margin: 10rpx 0;">{{itemTwo.note}}</text>
										
										<text v-if="itemTwo.commentsType == 1" class="color-grey" style="color: #bdbdbd;font-size: 26upx;width: 500rpx;">{{itemTwo.createTime}}</text>
										
										<text v-if="itemTwo.commentsType == 2 && itemTwo.status == 0" @click="commentByUser(itemTwo,2)" class="color-grey" style="color: #bdbdbd;font-size: 26upx;width: 500rpx;">{{itemTwo.createTime}} - 回复: @{{itemTwo.nicknameOne}}</text>
										<text v-if="itemTwo.commentsType == 2 && itemTwo.status != 0" class="color-grey" style="color: #bdbdbd;font-size: 26upx;width: 500rpx;">{{itemTwo.createTime}} - 回复的评论已删除</text>
									</div>
									<div class="card-right" @click="likeByComment(itemTwo)">
										<text v-if="itemTwo.commentLike > 0" class="color-gray" style="color: #ed1549;font-size: 28upx;">{{itemTwo.commentLike}}</text>
										<text v-else class="color-gray" style="color: #bdbdbd;font-size: 28upx;">{{itemTwo.commentLike}}</text>
										<image v-if="itemTwo.commentLike > 0" src="/static/video/love_red.png" style="width: 35upx;height: 35upx;margin-left: 10upx;"></image>
										<image v-else src="/static/video/love_grey.png" style="width: 35upx;height: 35upx;margin-left: 10upx;"></image>
									</div>
								</div>
								<div class="card-bottom" @click="commentsDatas(item.id,1)"
								v-if="item.oneCommentsJson && item.oneCommentsJson.length > 0 && (item.commentCount-item.oneCommentsJson.length) > 0">
									<text class="color-grey">查看{{item.commentCount-item.oneCommentsJson.length}}条回复></text>
								</div>
							</div>
						</div>
						
						<div class="card-right" @click="likeByComment(item)">
							<text v-if="item.commentLike > 0" class="color-gray" style="color: #ed1549;font-size: 28upx;">{{item.commentLike}}</text>
							<text v-else class="color-gray" style="color: #bdbdbd;font-size: 28upx;">{{item.commentLike}}</text>
							<image v-if="item.commentLike > 0" src="/static/video/love_red.png" style="width: 35upx;height: 35upx;margin-left: 10upx;"></image>
							<image v-else src="/static/video/love_grey.png" style="width: 35upx;height: 35upx;margin-left: 10upx;"></image>
						</div>
					</div>
					<div class="card" @click="commentsDatas(0,0)"
					v-if="dataList && dataList.length > 0 && (countOne-dataList.length) > 0">
						<text class="color-grey" style="font-size: 30rpx;text-align: center;">继续查看剩余{{countOne-dataList.length}}条评论></text>
					</div>
					
					<div v-if="!dataList || dataList.length <= 0" style="margin-top: 20upx;" class="card">
						<div class="card-bottom">
							<text class="color-grey">{{dataTitle}}</text>
						</div>
					</div>
				</scroll-view>
			</div>
		</div>
		<view style="height: 120rpx;"></view>
		<view class="bottom" :style="inputClassParent">
			<textarea class="input" :focus="focusTextarea"
			:adjust-position="false" cursor-spacing="10" maxlength="100" 
			v-model="message" :placeholder="placeholder"/>
			<view class="bottomBtn" @click="commint">
				<text class="bottom-text">{{message.trim().length > 0 ? '发送':'关闭'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import url from '@/common/http/url.js';
	import publics from "@/common/utils/public.js"
	export default{
		data(){
			return {
				id: "",
				commentId: 0,
				userId: "",
				detailInfo: {},
				imgList: [],
				dataList: [],
				countOne:0,
				dataTitle:'',
				focusTextarea:false,
				commentsId:0,
				placeholder:'有爱评论,说点好听的~',
				placeholderUserName:'回复@',
				message:'',
				type:0,
				jianPanHeight:0,
				inputClassParent:'',
				delVideoIcon:'https://yunjulai-oss.oss-cn-shenzhen.aliyuncs.com/defout/video_del_icon.png',
				isLike: false,
				pages: "", // 从哪个页面进来 dynamic-动态 my-我的 user-用户个人中心
				itemIndex: "" ,// 上一级列表的index
				isClickLike: false, // 是否点击点赞/取消点赞
				itemIsLike: false,
				isDel: false, // 是否删除了自己的动态
				isBack:false, // 是否拉黑了对方
			}
		},
		computed:{
			...mapState(["userInfo"])
		},
		onNavigationBarButtonTap() {
			let _this = this
			let itemList = ["举报", "拉黑"]
			if (this.isBack) {
				itemList = ["举报", "移除黑名单"]
			}
			uni.showActionSheet({
				itemList: itemList,
				success: function (res) {
					if (res.tapIndex === 0) {
						_this.$navigateTo("/pages/report/index?type=2&configType=1&id="+this.id)
					} else {
						let params = {
							toImAccount: _this.detailInfo.imAccount
						}
						let msg = "拉黑该用户后，在附近、配送员、动态、视频中将不会出现该用户以及该用户发布的任何内容，是否要拉黑？"
						let title = "拉黑"
						let path = url.user.addBackUser
						if (_this.isBack) {
							msg = "是否把该用户移除黑名单？"
							title = "移除黑名单"
							path = url.user.delBackUser
						}
						_this.$showModal(msg, title, r=>{
							if (r.confirm) {
								_this.$http("POST", path, params).then(doc => {
									_this.$msg(doc.data)
									_this.isBack = !_this.isBack
									itemList[1] = [_this.isBack?"移除黑名单":"拉黑"]
								})
							}
						})
					}
				}
			})
			
		},
		onBackPress() {
			// 返回时刷新上一页的数据
			let pages = getCurrentPages();
			let beforePage = pages[pages.length - 2];
			if (this.isClickLike){ // 是否点了点赞/取消点赞
				if (this.pages === "user") {
					beforePage.$vm.dynamicList[this.itemIndex].isLike = this.itemIsLike	// 点赞
					if (this.itemIsLike) {
						beforePage.$vm.dynamicList[this.itemIndex].likeCount++
					} else {
						beforePage.$vm.dynamicList[this.itemIndex].likeCount--
					}
				} else {
					beforePage.$vm.$refs[this.pages].dynamicList[this.itemIndex].isLike = this.itemIsLike
					if (this.itemIsLike) {
						beforePage.$vm.$refs[this.pages].dynamicList[this.itemIndex].likeCount++
					} else {
						beforePage.$vm.$refs[this.pages].dynamicList[this.itemIndex].likeCount--
					}
				}
			} else { // 更新上一层点评论数量
				if (this.pages === "user") {
					beforePage.$vm.dynamicList[this.itemIndex].commentCount = this.detailInfo.commentCount // 评论数量
				} else {
					beforePage.$vm.$refs[this.pages].dynamicList[this.itemIndex].commentCount = this.detailInfo.commentCount
				}
			}
			if (this.isDel) { // 是否删除了自己的动态
				if (this.pages === "user") {
					beforePage.$vm.dynamicList.splice(this.itemIndex, 1)
					beforePage.$vm.cellTabs[0].total--
				} else {
					beforePage.$vm.$refs[this.pages].dynamicList.splice(this.itemIndex, 1)
					if (this.pages === "my") {
						beforePage.$vm.$refs[this.pages].cellTabs[0].total--
					}
				}
			}
			
			return false
		},
		onLoad(option) {
			this.id = option.id
			this.commentId = option.commentId
			this.userId = this.userInfo.id
			if (option.pages) this.pages = option.pages
			if (option.itemIndex) this.itemIndex = option.itemIndex
			this.$http('get', url.interaction.getDynamicDetailById, {id: option.id}).then(res => {
				this.detailInfo = res.data[0]
				// 如果是自己，则隐藏导航栏上的举报拉黑
				if (this.detailInfo.userId === this.userId) {
					// #ifdef APP-PLUS
					let webView = this.$mp.page.$getAppWebview();  
					webView.setTitleNViewButtonStyle(0,{  
					    width: '0'  
					}); 
					// #endif
					// #ifdef H5
					let headerRight = document.getElementsByClassName("uni-page-head-ft")
					headerRight[1].style.display = 'none'
					// #endif
				} else {
					this.isUserBlock()
				}
				if (this.detailInfo.isLike !== 0) {
					this.isLike = true
				}
				if (this.detailInfo.images && typeof this.detailInfo.images === 'string') {
					this.imgList = this.detailInfo.images.split(",")
				}
			})
			
		},
		onShow() {
			let _this = this
			// 监听键盘高度
			uni.onKeyboardHeightChange(e => {
				if (e.height) {
					if(uni.getSystemInfoSync().platform == 'ios'){
						_this.jianPanHeight = e.height-35;
					}else{
						_this.jianPanHeight = e.height;
					}
					_this.inputClassParent = `bottom:${_this.jianPanHeight}px`;
				} else {
					_this.textareaBlur()
				}
			})
			this.commentsDatas(0,0);
		},
		methods: {
			textareaBlur(){
				this.focusTextarea = false;
				this.inputClassParent = 'bottom:0;';
				if(this.message && this.message.length > 0){
					this.placeholder = '';
				}else{
					this.placeholder = this.placeholderUserName;
				}
			},
			isUserBlock(){
				this.$http("GET", url.user.isBackUser, {toImAccount: this.detailInfo.imAccount}).then(res=>{
					this.isBack = res.data
				})
			},
			filterImg(img, type){
				return publics.filterImgUrl(img, type)
			},
			jumpUser(item){
				this.$navigateTo('/pages/interaction/user?userId='+(item.imAccountOne||item.imAccount));
			},
			onLike(){
				let type = this.detailInfo.isLike ? 1 : 0
				this.$http('post', url.interaction.likeByComment, {type:type, commentId: this.detailInfo.id}).then(res => {
					this.isClickLike = true
					this.detailInfo.isLike = !type
					this.isLike = !type
					this.itemIsLike = !type
					if (!type) {
						this.detailInfo.likeCount += 1
					} else {
						this.detailInfo.likeCount -= 1
					}
					this.$forceUpdate()
				})
			},
			previewImg(imgs, index){
				let _this = this
				let imgList = imgs
				uni.previewImage({
					urls: imgList,
					current: index
				});
			},
			async commentsDatas(commentsId,type){
				uni.showLoading({
					title: '评论加载中...'
				});
				setTimeout(function() {
					//最多10秒
					uni.hideLoading();
				}, 1000*10);
				let pageSize=0;
				let twoIndex=0;
				if(type == 0){//主评论
					pageSize=this.dataList.length;
				}else{//二级评论
					for(let i=0;i<this.dataList.length;i++){
						if(this.dataList[i].id == commentsId){
							pageSize = this.dataList[i].oneCommentsJson.length;
							twoIndex = i;
							break;
						}
					}
				}
				let params = {
					id: this.id,
					type:type,
					commentsId:commentsId,
					commentId: this.commentId,
					pageSize:pageSize
				}
				console.log("----获取动态评论信息,请求参数----", params)
				let newItems = [];
				let res = await this.$http('get', url.interaction.getDynamicComment, params);
				let data = res.data
				uni.hideLoading();
				if(data){
					console.log("----获取动态评论信息----", data)
					newItems = data.commentsList
					this.dataList = [...this.dataList, ...newItems]
					// if(newItems && newItems.length > 0){
					// 	if(type == 0){//主评论
					// 		// this.count = data.count;
					// 		this.countOne = data.countOne;
					// 		this.dataList = [...this.dataList,...newItems];
					// 	}else{//二级评论
					// 		this.dataList[twoIndex].oneCommentsJson = [...this.dataList[twoIndex].oneCommentsJson,...newItems];
					// 		this.dataList[twoIndex].commentCount = data.twoCount;
					// 	}
					// }
					if(!this.dataList || this.dataList.length<=0){
						this.dataTitle='当前未有任何评论~~~';
					}
				}
				return newItems
			},
			commentByUser(comment,type){
				this.focusTextarea = false;
				this.textareaBlur();
				let that = this;
				
				let nameTiele = "";
				if(type == 0){//一级评论
					nameTiele = "评论@"+comment.nickname;
				}else if(type == 1){//二级回复
					nameTiele = "回复@"+comment.nickname;
				}else if(type == 2){//同二级回复，回复的是别人回复的回复，有点乱，不要紧功能正常就行
					nameTiele = "回复@"+comment.nicknameOne;
				}
				
				let itemList = [nameTiele,'复制评论','进入Ta的主页'];
				if(comment.userId == this.userId && type != 2){
					itemList = [nameTiele,'复制评论','进入Ta的主页','删除评论'];
				}
				
				uni.showActionSheet({
				    itemList: itemList,
				    success: function (res) {
						if(res.tapIndex == 0){//回复
							that.commentsId = comment.id;
							that.placeholder = nameTiele;
							if(type == 0){//二级评论
								that.type = 1;
							}else if(type == 1){//二级回复
								that.type = 2;
							}else if(type == 2){//同二级回复，回复的是别人回复的回复，有点乱，不要紧功能正常就行
								that.type = 2;
								//这个的评论id就不一样了，切换为，当前评论的回复的评论的id
								that.commentsId = comment.twoId;
							}
							
							that.focusTextarea = true;
						}else if(res.tapIndex == 1){//复制评论
							uni.setClipboardData({
								data: comment.note,
								success:() => {
									that.$msg("复制成功~~~");
								}
							});
						}else if(res.tapIndex == 2){//进入主页
							that.$navigateTo('/pages/interaction/user?userId='+comment.imAccountOne);
						}else if(res.tapIndex == 3){//删除评价
							uni.showModal({
								title: '提示',
								content: '确定要删除该评论吗',
								success: res => {
									if(res.confirm){
										that.delComment(comment);
									}
								}
							});
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			async delComment(comment){
				if(comment.userId != this.userId){
					this$msg("删除失败,只能删除自己的评论");
					return;
				}
				
				let params = {
					id: this.id,
					commentId: comment.id
				}
				let res = await this.$http('post', url.interaction.delCommentById, params);
				let data= res.data
				if (data) {
					this.$msg("删除成功~~~");
					for(let i=0;i<this.dataList.length;i++){
						if(comment.commentsType == 0){//一级评论
							if(this.dataList[i].id == comment.id){
								//设置评论删除
								this.dataList[i].status = 1;
								this.dataList[i].userId = 0;
								this.dataList[i].note = "该评论已删除";
								this.dataList[i].nickname = "-";
								this.dataList[i].icon = this.delVideoIcon;
							}
						}else{//二级回复、二级评论
							for(let t=0;t<this.dataList[i].oneCommentsJson.length;t++){
								if(this.dataList[i].oneCommentsJson[t].id == comment.id){
									//设置评论删除
									this.dataList[i].oneCommentsJson[t].status = 1;
									this.dataList[i].oneCommentsJson[t].userId = 0;
									this.dataList[i].oneCommentsJson[t].note = "该评论已删除";
									this.dataList[i].oneCommentsJson[t].nickname = "-已删除";
									this.dataList[i].oneCommentsJson[t].icon = this.delVideoIcon;
								}
							}
						}
					}
				}
			},
			async likeByComment(comment){
				let type = 0;//默认点赞
				let likesNumber = 1;//默认添加赞
				let commentLikeSet = 1;//默认已经点赞
				//判断是点赞还是取消点赞
				if(comment.commentLike > 0){//取消点赞
					type = 1;
					likesNumber = -1;
					commentLikeSet = 0;
				}
				
				let params = {
					id:this.id,
					commentId:comment.id,
					type:type
				};
				console.log("-----点赞-----参数-----", params)
				let res = await this.$http('post', url.interaction.likeByCommentComment, params)
				let data = res.data
				if(data){
					for(let i=0;i<this.dataList.length;i++){
						if(comment.commentsType == 0){//一级评论
							if(this.dataList[i].id == comment.id){
								//设置评论点赞、点赞数量
								this.dataList[i].likes += likesNumber;
								this.dataList[i].commentLike = commentLikeSet;
							}
						}else{//二级回复、二级评论
							for(let t=0;t<this.dataList[i].oneCommentsJson.length;t++){
								if(this.dataList[i].oneCommentsJson[t].id == comment.id){
									//设置评论点赞、点赞数量
									this.dataList[i].oneCommentsJson[t].likes += likesNumber;
									this.dataList[i].oneCommentsJson[t].commentLike = commentLikeSet;
								}
							}
						}
					}
				}
			},
			async commint(){
				plus.key.hideSoftKeybord();
				this.textareaBlur();
				let that = this;
				if(this.message.trim().length > 100){
					this.$msg("评论内容过长,最多只能输入一百个字符");
					return;
				}
				if(!this.message || this.message.trim() == ''){
					return;
				}
				let type = this.type;
				let commentId = this.commentsId;
				
				let paremet = {id:this.id,type:type,commentId:commentId,note:this.message.trim()};
				let res = await this.$http('post', url.interaction.commentOrReplyDynamic, paremet)
				let data = res.data
				if (data) {
					this.message = "";
					this.type = 0;
					this.commentsId = 0;
					this.placeholder = '有爱评论,说点好听的~';
					this.placeholderUserName = '有爱评论,说点好听的~';
					this.$msg("评论成功~~~");
					if(data.createTime){
						//添加评论总数
						this.detailInfo.commentCount += 1;
						//插入评论
						if(type == 0){//一级评论
							this.countOne = data.commentCount;
							this.dataList.push(data);
						}else{//二级评论、二级回复
							let oneId = data.oneId;//获取到一级评论的id
							for(let i=0;i<that.dataList.length;i++){
								if(that.dataList[i].id == oneId){
									this.dataList[i].oneCommentsJson.push(data);
									this.dataList[i].commentCount = data.commentCount;
								}
							}
						}
					}
				}
			},
			onDel(){
				let _this = this
				uni.showModal({
					title: "提示",
					content: "删除该动态？",
					success(res){
						if (res.confirm) {
							_this.$http('post', url.interaction.delDynamic, {commentId: _this.id}).then(res => {
								_this.$msg('删除成功')
								_this.isDel = true
								setTimeout(()=>{
									uni.navigateBack()
								}, 500)
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header{
		padding: 30rpx 30rpx 0;
		display: flex;
		justify-content: flex-start;
		.avatar{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin-right: 10rpx;
		}
		.right{
			display: flex;
			flex-direction: column;
			font-size: 30rpx;
			flex-grow: 1;
			.blue{
				color: #348DFC;
			}
			.con{
				margin: 10rpx 0;
			}
			.imgList {
				margin-top: 20rpx;
				display: flex;
				flex-wrap: wrap;
				.itemMax{
					width: 300rpx;
					height: 300rpx;
					margin-bottom: 10rpx;
					border-radius: 10rpx;
				}
				.item{
					width: 170rpx;
					height: 170rpx;
					margin-right: 10rpx;
					margin-bottom: 10rpx;
					border-radius: 10rpx;
				}
			}
			.between {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				font-size: 26rpx;
				.left{
					color: #999999;
				}
				.item{
					display: flex;
					align-items: center;
					.icon{
						font-size: 36rpx;
						margin-right: 10rpx;
						color: #999999;
					}
					.name{
						color: #999999;
					}
				}
			}
		}
	}
	.red{
		color: #ed1549 !important;
	}
	.jiantou{
		display: block;
		width: 0;
		height: 0;
		border-left: 10rpx solid transparent;
		border-right: 10rpx solid transparent;
		border-bottom: 18rpx solid #F8F8F8;
		margin-left: 100rpx;
	}
</style>
<style lang="scss" scoped>
	.color-gray{
		color: #515352;
		font-size: 14px;
	}
	.card-name{
		line-height: 35rpx;
	}
	.color-grey{
		color: #A8ACAF;
		font-size: 12px;
		width: 600rpx;
		line-height: 35rpx;
	}
	.color-bule{
		color: #55ADDF;
		
	}
	.margin-right{
		margin-right: 20rpx;
	}
	
	
	.subnvue {
		margin: 0 30rpx;
		display: flex;
		flex-direction: column;
		background-color: #F8F8F8;
	}
	.mask{
		flex-direction: column;
		background-color:#f8f8f8;
		opacity: 0.4;
		flex: 1;
	}
	.content{
		display: flex;
		width: 690rpx;
		flex-direction: column;
		justify-content: space-between;
	}
	.top{
		display: flex;
		padding: 20rpx 20rpx 10rpx 20rpx;
		flex-direction: row;
		justify-content: space-between;
	}
	.title{
		flex: 1;
		align-items: center;
		color: #ffffff;
	}
	.hideBtn{
		display: flex;
		padding: 0rpx;
		justify-content: center;
		align-items: center;
	}
	
	/* 底部输入框 */
	.bottom{
		width: 710rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		box-shadow: 0 -1px 4px 1px rgba(0,0,0,0.1);
		align-items: center;
		justify-content: space-between;
		background-color: #F8F8F8;
		padding: 10rpx 20rpx;
	}
	.input{
		width: 500rpx;
		margin-right: 20rpx;
		height: 60rpx;
		max-height: 160rpx;
		background-color: #FFFFFF;
		color: #333;
		font-size: 30rpx;
		border-radius: 10rpx;
		flex-grow: 1;
		padding-top: 10rpx;
	}
	.bottomBtn{
		padding: 7rpx 20rpx;
		border-radius:10rpx;
		background-color: #DDDDDD;
	}
	.bottom-text{
		color: #999;
		font-size: 32rpx;
	}
	
	/* 评论滚动区 */
	.srcoll-view{
		flex: 1;
	}
	.card{
		display: flex;
		position: relative;
		flex-direction: row;
		justify-content: space-between;
		padding: 30rpx;
		padding-top: 0rpx;
	}
	
	.card-left{
		display: flex;
		flex-direction: row;
	}
	
	/* 中 */
	.card-content{
		flex: 1;
	}
	.card-image{
		height: 70rpx;
		width: 70rpx;
		border-radius: 50%;
		margin-right: 30rpx;
	}
	.card-top{
		display: flex;
		min-height: 70rpx;
		flex-direction: column;
	}
	.woman{
		background-color: #ff4d94 !important;
	}
	.six{
		min-width: 30rpx;
		max-width: 90rpx;
		border-radius: 20rpx;
		background-color: #1995fc;
		display: flex;
		align-items: center;
		padding: 0 16rpx;
		margin-left: 10rpx;
	}
	.six .icon{
		font-size: 26rpx;
		margin-top: 2rpx;
		margin-right: 10rpx;
		margin-top: -4rpx;
		color: white;
	}
	.six .txt{
		font-size: 24rpx;
		color: white;
	}
	.card-message{
		display: flex;
		padding: 20rpx 0rpx 10rpx 0rpx;
		flex-direction: row;
		// width: 550rpx;
	}
	.card-text{
		flex: 1;
	}


	/* 右 */
	.card-right{
		position: absolute;
		right: 0rpx;
	}
	.card-icon{
		margin-left: 40rpx;
		margin-right: 20rpx;
	}
	
</style>
