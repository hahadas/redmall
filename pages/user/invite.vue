<template>
	<view class="content">
		<view class="invite-c">
			<view class="invite-w">
				<view class='invite-w-detail' style="font-size: 60upx;font-weight: bolder;line-height:60upx;">邀请好友领取红包</view>
				<view class='invite-w-detail' style="font-size: 30upx;line-height:30upx;">快邀请好友加入我们,一起赚钱</view>
				<view class='invite-w-t' style="margin-top: 50upx;">我的专属邀请码</view>
				<text class='invite-w-num'>{{code||userDetailInfo.recommendCode}}</text>
				<tki-qrcode
					ref="qrcode"
					:val="qrValue"
					:size="300"
					icon="/static/logo.png"
					:iconSize="30"
					:onval="true"
					></tki-qrcode>
				<view class='invite-w-bot' style="width: 100%;margin-top: 20px;margin-bottom: 0px;">
					<view bindtap='recommendlist'>
						<text class='invite-w-bot-red' style="font-size: 30upx;color: #000000;">
							已邀请 
							<text style="font-size: 40upx;color: #d10d0d;margin-left: 10upx;margin-right: 10upx;">{{number}}</text> 
							人
						</text>
					</view>
				</view>
				
				<view class='invite-btn' style="margin-top: 50upx;right: 35upx;">
					<view class='share btn' @click="$onCopy(code||userDetailInfo.recommendCode)">
						<view class="share-text-two">
							<image src='/static/user/ic-link.png'></image>	
						</view>
						<view class="share-text-two">
							<text class="share-text-two-text">复制邀请码</text>	
						</view>
					</view>
					<view class='share btn' @click="createPoster()">
						<view class="share-text-two">
							<image src='/static/user/ic-img.png'></image>	
						</view>
						<view class="share-text-two">
							<text class="share-text-two-text">生成邀请海报</text>	
						</view>
					</view>
					<!-- #ifdef APP-PLUS -->
					<view class='share btn' @click="onShare">
						<view class="share-text-two">
							<image src='/static/user/weact.png'></image>	
						</view>
						<view class="share-text-two">
							<text class="share-text-two-text">分享到微信</text>	
						</view>
					</view>
					<!-- #endif -->
				</view>
			</view>
			<view class="invite-w" style="opacity: 0;">
				<view class='invite-w-btn' style="opacity: 0;"></view>
			</view>
			<view class="invite-w" style="opacity: 0;" v-if="invitecode">
				<text class='invite-w-t-blue'></text>
				<view class='invite-w-btn'></view>
			</view>
		</view>
		
		
		<view class="flex_row_c_c modalView" :class="qrShow?'show':''" @tap="hideQr()">
			<view class="flex_column">
				<view class="backgroundColor-white padding1vh border_radius_10px">
					<image :src="poster.finalPath || ''" mode="widthFix" class="posterImage"></image>
				</view>
				<view class="flex_row marginTop2vh">
					<button type="primary" style="height: 80upx;line-height: 80upx;" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
				</view>
			</view>
		</view>
		<view class="hideCanvasView">
			<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||10) + 'px', height: (poster.height||10) + 'px'}"></canvas>
		</view>
		
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="flex flex-between bg-w title">
					<view style="color: #00c73a;">确定</view>
					<view class="color-b9" @tap="hideModal">取消</view>
				</view>
				<view class="padding-xl flex flex-center">
					<view class="invite-btn">
						<view class='share btn' style="width: 345upx;" @click="onShareType(0)">
							<view class="share-text-two">
								<image src='/static/user/weact.png'></image>	
							</view>
							<view class="share-text-two">
								<text class="share-text-two-text">分享到微信好友</text>	
							</view>
						</view>
						<view class='share btn' style="width: 345upx;" @click="onShareType(1)">
							<view class="share-text-two">
								<image src='/static/user/wechat_frend.png'></image>	
							</view>
							<view class="share-text-two">
								<text class="share-text-two-text">分享到微信朋友圈</text>	
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	import url from '@/common/http/url.js';
	import { getSharePoster } from '@/libs/QS-SharePoster/QS-SharePoster.js';
	import publics from "@/common/utils/public.js"
	import { inviteUrl } from "@/common/http/index.js"
	
	export default {
		components: { tkiQrcode },
		data() {
			return {
				memberData:{},
				modalName: null,
				code: '',
				money: 0,
				number: 0,
				appTitle:'',
				is_superior: false,
				invitecode: '',
				userDetailInfo:{},
				qrValue: "",
				poster: {},
				qrShow: false,
				canvasId: 'default_PosterCanvasId',
				codeBackGroundImageUrl:'http://yunjulai-oss.oss-cn-shenzhen.aliyuncs.com/web-20200428-08cb0876976e4f2a9900c503eb89c753.png',
			}
		},
		computed:{
			...mapState(["userInfo"])
		},
		onShow() {
			// this.getInviteData();
			// this.getImages();
			let _this = this
			this.userDetailInfo = this.userInfo;
			let data = {
				type: 99,
				data: this.userInfo.imAccount
			}
			this.qrValue = inviteUrl+this.userInfo.recommendCode+`&data=${JSON.stringify(data)}`
			setTimeout(()=> {
				_this.$refs.qrcode._makeCode()
			}, 300)
			this.$http("GET", url.user.getTeamList, {pageSize: 1}).then(res =>{
				this.number = res.data.total
			})
		},
		methods: {
			onShare(){
				this.modalName = 'bottomModal';
			},
			hideModal() {
				this.modalName = null;
			},
			onShareType(type){
				uni.showLoading({
					mask: true
				})
				if(type == 0){//好友
					publics.shareFriend(this.userDetailInfo.recommendCode,this.userDetailInfo.nickname,this.userDetailInfo.headPortrait);
				}else{//朋友圈
					publics.shareFriendcricle(this.userDetailInfo.recommendCode,this.userDetailInfo.nickname,this.userDetailInfo.headPortrait);
				}
				this.hideModal();
				uni.hideLoading()
			},
			// 获取页面背景图片
			async getImages(){
				let data = await this.$http('GET', url.common.codeBackGroundImage).then(res =>{
					this.codeBackGroundImageUrl = res.data;	
				})
			},
			//获取数据
			async getInviteData() {
				let res = await this.$http('GET', url.user.getInviteData);
				this.memberData = res.data;
				this.code = res.data.recommendCode;
				this.number = res.data.buyCount;
				this.invitecode = res.data.recommendCode;
			},
			// 生成邀请海报
			async createPoster() {
				let that = this;
				
				try {
					const d = await getSharePoster({
						_this: this, //若在组件中使用 必传
						type: 'testShareType',
						formData: {
							//访问接口获取背景图携带自定义数据
						},
						posterCanvasId: this.canvasId,	//canvasId
						delayTimeScale: 20, //延时系数
						backgroundImage: this.codeBackGroundImageUrl,
						/* background: {
							width: 1080,
							height: 1920,
							backgroundColor: '#666'
						}, */
						drawArray: ({
							bgObj,
							type,
							bgScale
						}) => {
							const dx = bgObj.width * 0.3;
							const fontSize = bgObj.width * 0.045;
							const lineHeight = bgObj.height * 0.04;
							//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
							return new Promise((rs, rj) => {
								rs([
									{
										type: 'text',
										fontStyle: 'italic',
										text: 'redMall',
										fontWeight: 'bold',
										size: fontSize+10,
										color: 'white',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {
												// dx: bgObj.width - textLength - fontSize,
												dx: 20,
												dy: bgObj.height - lineHeight * 3
											}
										},
										serialNum: 0,
										id: 'tag1'	//自定义标识
									},
									{
										type: 'text',
										text: '用户: '+that.userDetailInfo.nickname,
										fontWeight: 'bold',
										size: fontSize+10,
										color: 'white',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										serialNum: 1,
										infoCallBack(textLength) {
											return {
												// dx: bgObj.width - textLength - fontSize,
												dx: 20,
												dy: bgObj.height - lineHeight * 2
											}
										}
									},
									{
										type: 'text',
										text: '邀请码: '+that.userDetailInfo.recommendCode,
										fontWeight: 'bold',
										size: fontSize+10,
										color: 'white',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										serialNum: 2,
										infoCallBack(textLength) {
											return {
												dx: 20,
												dy: bgObj.height - lineHeight
											}
										}
									},
									//二维码内容
									{
										type: 'qrcode',
										text: inviteUrl+that.userDetailInfo.recommendCode,
										size: bgObj.width * 0.2,
										// size: 80,
										// dx: bgObj.width * 0.05,
										dx: bgObj.width - (bgObj.width * 0.2) - 20,
										dy: bgObj.height - bgObj.width * 0.25,
										image: '/static/logo.png',
										imageSize: bgObj.width * 0.05
										// dy: 380
									}
								]);
							})
						},
						setCanvasWH: ({
							bgObj,
							type,
							bgScale
						}) => { // 为动态设置画布宽高的方法，
							this.poster = bgObj;
						}
					});
					this.poster.finalPath = d.poster.tempFilePath;
					this.qrShow = true;
				} catch (e) {
					uni.hideLoading();
					this.$msg(JSON.stringify(e));
					console.log(JSON.stringify(e));
				}
			},
			saveImage() {
				let _this = this
				uni.saveImageToPhotosAlbum({
					filePath: this.poster.finalPath,
					success(res) {
						_this.$msg('保存成功');
					}
				})
			},
			hideQr() {
				this.qrShow = false;
			}
		}
	}
</script>

<style scoped>
	.content{
		width: 750rpx;
		min-height: 100vh;
		overflow: hidden;
	}
	.invite {
		width: 100%;
		height: 100%;
		background: linear-gradient(to right, #4c21d2, #4864f8);
	}

	.invite-bg {
		position: absolute;
		width: 750upx;
		height: 753upx;
		z-index: 66;
	}

	.invite-c {
		position: relative;
		z-index: 67;
		width: 750upx;
		padding: 0 30upx;
		background: linear-gradient(to right, #4c21d2, #4864f8);
	}

	.invite-w {
		background-color: #fff;
		width: 690upx;
		text-align: center;
		padding: 40upx 40upx;
		box-sizing: border-box;
		border-radius: 30upx;
		margin-bottom: 70upx;
		position: relative;
		top: 6vh
	}

	.invite-w-t {
		width: 70%;
		margin: 0 auto;
		color: #fff;
		border-radius: 50upx;
		font-size: 30upx;
		box-sizing: border-box;
		padding: 10upx;
		display: block;
		background: linear-gradient(to right, #5f2ef6, #b945dd);
	}

	.invite-w-num {
		color: #5f2ef6;
		display: block;
		font-size: 36upx;
		margin-top: 20upx;
		margin-bottom: 20rpx;
	}

	.invite-w-detail {
		color: #666;
		font-size: 24upx;
		line-height: 1.5;
		margin-top: 20upx;
	}

	.invite-w-bot {
		margin: 20upx 0 20upx;
	}

	.invite-w-bot>view {
		width: 49%;
		display: inline-block;
	}

	.invite-w-bot-ic {
		width: 48upx;
		height: 48upx;
	}

	.invite-w-bot-red {
		font-size: 24upx;
		color: #ca0400;
		display: block;
	}

	.invite-w-bot-gray {
		font-size: 24upx;
		color: #acacac;
		display: block;
	}

	.invite-w-t-blue {
		color: #348dfc;
		font-size: 30upx;
		margin-bottom: 50upx;
		display: block;
	}

	.invite-w-input {
		font-size: 30upx;
		border-bottom: 1px solid #dadada;
		margin-bottom: 50upx;
		color: #999;
	}

	.invite-w-btn {
		background: linear-gradient(to right, #4a6af9, #28c4ff);
		color: #fff;
		width: 50%;
		margin: 0 auto;
		border-radius: 50upx;
		font-size: 30upx;
		padding: 10upx 0;
	}

	.invite-btn {
		position: relative;
		/* top: -160upx; */
		text-align: center;
		width: 690upx;
	}

	.share {
		background-color: none;
		position: relative;
		width: 230upx;
		height: 98upx;
		display: inline-block;
		border-radius: 50%;
		padding: 0;
		/* margin: 0 40rpx 40rpx; */
	}
	
	.share-text-two {
		width: 100%;
		text-align: center;
	}
	
	.share-text-two-text {
		color: #000000;
		font-size: 30upx;
	}

	.invite-btn image {
		width: 98upx;
		height: 98upx;
	}
</style>
<style>
	.hideCanvasView {
		position: relative;
	}

	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}

	.flex_row_c_c {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.modalView {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		transform: scale(1.2);
		perspective: 2500upx;
		background: rgba(0, 0, 0, 0.6);
		transition: all .3s ease-in-out;
		pointer-events: none;
		backface-visibility: hidden;
		z-index: 999;
	}

	.modalView.show {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.flex_column {
		display: flex;
		flex-direction: column;
	}

	.backgroundColor-white {
		background-color: white;
	}

	.border_radius_10px {
		border-radius: 10px;
	}

	.padding1vh {
		padding: 1vh;
	}

	.posterImage {
		width: 60vw;
	}

	.flex_row {
		display: flex;
		flex-direction: row;
	}

	.marginTop2vh {
		margin-top: 2vh;
	}
	/* ==================
	         模态窗口
	 ==================== */
	
	.cu-modal {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1110;
		opacity: 0;
		outline: 0;
		text-align: center;
		-ms-transform: scale(1.185);
		transform: scale(1.185);
		backface-visibility: hidden;
		perspective: 2000upx;
		background: rgba(0, 0, 0, 0.6);
		transition: all 0.3s ease-in-out 0s;
		pointer-events: none;
	}
	
	.cu-modal::before {
		content: "\200B";
		display: inline-block;
		height: 100%;
		vertical-align: middle;
	}
	
	.cu-modal.show {
		opacity: 1;
		transition-duration: 0.3s;
		-ms-transform: scale(1);
		transform: scale(1);
		overflow-x: hidden;
		overflow-y: auto;
		pointer-events: auto;
	}
	
	.cu-dialog {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		margin-left: auto;
		margin-right: auto;
		width: 680upx;
		max-width: 100%;
		background-color: #f8f8f8;
		border-radius: 10upx;
		overflow: hidden;
	}
	
	.cu-dialog .title{
		padding: 20rpx 30rpx;
		font-size: 30rpx;
	}
	.cu-dialog .padding-xl{
		padding: 50rpx 0;
	}
	.cu-modal.bottom-modal::before {
		vertical-align: bottom;
	}
	
	.cu-modal.bottom-modal .cu-dialog {
		width: 100%;
		border-radius: 0;
	}
	
	.cu-modal.bottom-modal {
		margin-bottom: -1000upx;
	}
	
	.cu-modal.bottom-modal.show {
		margin-bottom: 0;
	}
	
	.cu-modal.drawer-modal {
		transform: scale(1);
		display: flex;
	}
	
	.cu-modal.drawer-modal .cu-dialog {
		height: 100%;
		min-width: 200upx;
		border-radius: 0;
		margin: initial;
		transition-duration: 0.3s;
	}
	
	.cu-modal.drawer-modal.justify-start .cu-dialog {
		transform: translateX(-100%);
	}
	
	.cu-modal.drawer-modal.justify-end .cu-dialog {
		transform: translateX(100%);
	}
	
	.cu-modal.drawer-modal.show .cu-dialog {
		transform: translateX(0%);
	}
	.cu-modal .cu-dialog>.cu-bar:first-child .action{
	  min-width: 100rpx;
	  margin-right: 0;
	  min-height: 100rpx;
	}
</style>
