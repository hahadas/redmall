<template>
	<view>
		<!-- 左侧红包 -->
		<view class="r_bag" v-if="data.show && data.pageThatAppears === type">
			<image 
				class="bag1 animated tada infinite" 
				:style="{bottom: bottom+'px'}"
				v-if="!rbagmodelshow && !openrbagmodelshow" 
				:src="staticUrl + 'home/redBag.png'" mode="" @click="openrbagbtn()"></image>
		</view>
		<!-- 红包封面 -->
		<view class="rbag_model" v-if="rbagmodelshow" @touchmove.prevent.stop>
			<view class="close animated rubberBand">
				<image class="redBag" :src="staticUrl + 'home/redBagClose.png'" mode="widthFix"></image>
				<view class="redBag-word">
					<view class="subTit">{{data.titleName}}</view>
					<view class="tips">{{data.describeDetails}}</view>
				</view>
				<button class='getMoney' type='primary' :animation="openbrnanimation" hover-class="btnDown" withCredentials="true" lang="zh_CN" @click="imageanimation">
					立即领取
				</button>
				<view class="hide_btn" @click.stop="hidebtn">
					<icon type="cancel" color="#fbd977" size="28" />
				</view>
			</view>
		</view>

		<!-- 打开红包 -->
		<view class="open_rbag_model" v-if="openrbagmodelshow" @touchmove.prevent.stop>
			<view class="close animated rubberBand">
				<image class="redBag" :src="staticUrl + 'home/redBagOpen.png'" mode="widthFix"></image>
				<view v-if="!isTake">
					<view class="youhuiTip">
						<text>{{data.receiveDetails}}</text>
						<!-- <view class="youhuiTit">专享红包</view> -->
					</view>
					<view class="redBag-word">
						<view class="subTit">恭喜您获得</view>
					</view>
					<button class='getYouhui' type='primary' lang="zh_CN" @click="checkMoney" hover-class="btnDown">
						查看我的福利
					</button>
				</view>
				<view v-else class="youhuiTip">
					<view class="subTit">您已领取过专享红包</view>
					<button class='getYouhui old' type='primary' lang="zh_CN" @click="checkMoney" hover-class="btnDown">
						查看我的福利
					</button>
				</view>
				<view class="hide_btn" @click.stop="hidebtnALL">
					<icon type="cancel" color="#fbd977" size="28" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import url from "@/common/http/url.js"
	import { getUUID } from "@/common/utils/index.js"
	const music = uni.createInnerAudioContext(); //创建播放器对象
	export default{
		props: {
			type: {
				type: Number,
				default: 0
			},
			data: {
				type: Object,
				default: {}
			},
			bottom: {
				type: Number,
				default: 100
			}
		},
		computed: {
			...mapState(["userInfo"])
		},
		data(){
			return{
				staticUrl: this.$staticUrl,
				rbagmodelshow: false,
				openrbagmodelshow: false,
				isTake: false, // 是否已领取过了
				openbrnanimation: {}
			}
		},
		mounted() {
			if (this.data.automaticCollection === 2 && this.data.pageThatAppears === this.type) {
				this.openrbagbtn()
				setTimeout(()=>{
					this.imageanimation()
				}, 500)
			}
		},
		methods:{
			imageanimation: function() {
				var that = this;
				var next = true;
				var animation = uni.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
				})
				this.$http("POST", url.cms.receiveRedEnvelopes, {id: this.data.id}).then(res =>{
					that.openbrnanimation = animation;
					animation.rotateY(360).step();
					if (this.data.audioUrl) {
						music.loop = false; //循环播放
						music.src = this.data.audioUrl;
						music.play(); //执行播放
					}
					setTimeout(function() {
						that.openbrnanimation = animation.export()
						that.rbagmodelshow = false
						that.openrbagmodelshow = true
						that.data.show = false
						// #ifdef APP-PLUS
						// 如果返回imAccount，并且直推人奖励开启，并且需要提示声音
						if (res.data && that.data.directPushRewardStatus === 1 && that.data.directPushRewardAudioUrl) {
							that.imSendMsg(res.data)
						}
						// #endif
					}, 1100)
				}).catch(err=>{
					console.log(err)
					this.rbagmodelshow = false
				})
			},
			openrbagbtn(){
				if (this.isTake) {
					this.openrbagmodelshow = true
				} else {
					this.rbagmodelshow = true
				}
			},
			hidebtn(){
				this.rbagmodelshow = false
			},
			hidebtnALL(){
				this.openrbagmodelshow = false
				this.isTake = true
			},
			checkMoney(){
				if (this.data.welfareType === "1") {
					this.$navigateTo("/pages/user/cardBag")
				} else {
					this.$navigateTo("/pages/user/wallet/index")
				}
			},
			imSendMsg(toImAccount){
				this.$http("GET", url.im.createConversation, {toImAccount: toImAccount, type: 1}).then(doc =>{
					let conversationId = doc.data.id
					let uid = getUUID() + this.userInfo.recommendCode
					let params = {
						conversationId: conversationId,
						id: uid,
						uid: uid,
						from: this.userInfo.imAccount,
						to: toImAccount,
						cmd: 11,
						createTime: new Date().getTime(),
						chatType: 2,
						msgType: 77,
						content: JSON.stringify({
							type: 1,
							musicUrl: this.data.directPushRewardAudioUrl
						})
					};
					getApp().globalData.socket.sendSocketMessage(params)
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rbag_model .close,.open_rbag_model .close{
			position: fixed;
			top:50%;
			left:0%;
			width:750upx;
			transform: translate(-50%,-50%);
			image{
				width:100%;
			}
			.redBag{
				width:600upx;
				z-index:9;
				position: absolute;
				top:50%;
				left:50%;
				transform: translate(-50%,-50%);
			}
			.openImg{
				z-index:99;
				position: absolute;
				top: 180upx;
				left: 0;
				right: 0;
				width: 140upx;
				height: 140upx;
				margin: 0 auto;
			}
			.redBag-word{
				z-index:99;
				position: absolute;
				// top: 340upx;
				top: -180upx;
				left: 0;
				right: 0;
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				color:#fff;
				.subTit{
					font-size:70upx;
					line-height: 100upx;
					font-weight: bold;
				}
				.tips{
					width: 60%;
				}
			}
			.getMoney{
				z-index:99;
				position: absolute;
				// top: 520upx;
				left: 0;
				right: 0;
				// width: 400upx;
				// height:80upx;
				// line-height: 80upx;
				// border-radius: 40upx;
				// color:#af8b00;
				// line-height: 80upx;
				top:80upx;
				width: 160upx;
				height:160upx;
				line-height: 50upx;
				vertical-align: middle;
				font-weight:bold;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:40upx;
				border-radius: 50%;
				box-shadow:inset 0 0 0 10upx #fff06e,0 10upx 0 0 #f69614;
				margin: 0 auto;
				background:linear-gradient(to bottom, #fff6a5,#ffcd1b);
				color:#ff2400;
			}
			.hide_btn{
				// margin-top:200upx;
				z-index:99;
				position: absolute;
				left: 0;
				right: 0;
				top:360upx;
				text-align: center;
			}
			button.btnDown{
				background:#ebcc3d;
				color:#c19a1e;
			}
		}
		.open_rbag_model .close{
			.openImg{
				top: 300upx;
			}
			.redBag-word{
				// top: 420upx;
				top: -20upx;
			}
			.getYouhui{
				z-index:99;
				position: absolute;
				// top: 630upx;
				top: 280upx;
				left: 0;
				right: 0;
				width: 300upx;
				height:60upx;
				line-height: 60upx;
				border-radius: 30upx;
				text-align: center;
				margin: 0 auto;
				font-size:26upx;
				box-shadow:inset 0 0 0 10upx #fff06e,0 10upx 0 0 #f69614;
				background:linear-gradient(to bottom, #fff6a5,#ffcd1b);
				color:#ff2400;
			}
			.getYouhui.old{
				top:120upx;
			}
			.youhuiTip{
				z-index:99;
				position: absolute;
				top: 100upx;
				left: 0;
				right: 0;
				width: 100%;
				text-align: center;
				color:#fff06e;
				display: flex;
				justify-content: center;
				align-items: center;
				text{
					width: 60%;
					font-size:50upx;
					font-weight: bold;
					color: #ffcc1a;
				}
			}
			.hide_btn{
				z-index:99;
				position: absolute;
				left: 0;
				right: 0;
				top:420upx;
				text-align: center;
			}
		}
		.zaiui-modal-box {
		    position: fixed;
			width:100vw;
			height:100vh;
			opacity: 0;
			top: inherit;
			left: inherit;
			right: inherit;
			bottom: inherit;
			z-index: 99999999;
		    text-align: center;
		    background: rgba(0, 0, 0, 0.6);
		    transition: all 0.3s;
			pointer-events: none;
			&::before {
			    content: "\200B";
			    display: inline-block;
			    height: 100%;
			    vertical-align: middle;
			}
			.dialog {
				position: relative;
				display: inline-block;
				vertical-align: middle;
				width: 618.18rpx;
				position: relative;
				.img {
					width: 100%;
					border-radius: 3%;
				}
				.close {
				    color: #dadada;
				    top: 18.18rpx;
				    position: relative;
				    font-size: 54.54rpx;	
				}
				.bottom{
					background:#FDEB03;
					color:#D82817;
					font-weight:bold;
					width:400upx;
					border-radius: 100upx;
					position: absolute;
					bottom:80upx;
					height:100upx;
					line-height: 100upx;
					left:50%;
					transform: translateX(-50%);
				}
			}
		}
		.zaiui-modal-box.show {
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			opacity: 1;
			pointer-events: auto;
		}
	.r_bag {
		.bag1 {
			position: fixed;
			right: -30upx;
			bottom: 200upx;
			width: 130upx;
			height: 85upx;
			z-index: 99;
		}
	}
	
	// 红包封面
	.rbag_model {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(0,0,0,0.3);
		z-index: 1000;
		.rbag_con {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 80%;
			height: 840upx;
			background-color: #da4d44;
			margin: auto;
			border-radius: 14upx;
			box-shadow: 0upx 0upx 10upx rgba(0,0,0,0.2);
			.rbag_top {
				position: absolute;
				left: -20%;
				top: 0;
				width: 140%;
				height: 540upx;
				background-color: #e0534a;
				border-radius: 0 0 50% 50%;
				box-shadow: 0 0 14upx rgba(0,0,0,0.4);
				z-index: 1001;
				.rbag_top_info {
					margin-top: 60upx;
					.rbag_logo {
						width: 160upx;
						height: 160upx;
						border-radius: 50%;
						display: block;
						margin: 0 auto;
						overflow: hidden;
					}
					.app_name {
						font-size: 38upx;
						color: #f6ac96;
						text-align: center;
						margin-top: 18upx;
						letter-spacing: 1upx;
					}
					.rbag_tips {
						font-size: 50upx;
						color: #edddd3;
						text-align: center;
						margin-top: 34upx;
						letter-spacing: 1upx;
					}
				}
			}
			.open_rbag_btn {
				position: absolute;
				top: 450upx;
				left: 0;
				right: 0;
				width: 180upx;
				height: 180upx;
				line-height: 180upx;
				border-radius: 50%;
				margin: 0 auto;
				text-align: center;
				background-color: #ffd287;
				font-size: 55upx;
				color: #fef5e8;
				box-shadow: 2upx 2upx 6upx rgba(0,0,0,0.2);
				z-index: 1002;
			}
			.hide_btn {
				position: absolute;
				bottom: -110upx;
				left: 0;
				right: 0;
				width: 80upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				margin: 0 auto;
			}
		}
		.hidden {
			overflow: hidden;
		}
	}
	
	// 打开红包
	.open_rbag_model {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(0,0,0,0.3);
		z-index: 1000;
		.rbag_conbg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 80%;
			height: 840upx;
			margin: auto;
			z-index: 1001;
		}
		.open_rbag_con {
			z-index: 1002;
			.open_title {
				height: 120upx;
				line-height: 120upx;
				text-align: center;
				font-size: 38upx;
				letter-spacing: 2upx;
				color: #e46965;
			}
			.rbag_detail {
				margin-top: 90upx;
				.open_money {
					text-align: center;
					font-size: 80upx;
					color: #c95948;
					font-weight: bold;
					display: flex;
					justify-content: center;
					.danwei {
						font-size: 30upx;
						margin-left: 16upx;
						margin-top: 24upx;
					}
				}
				.open_tips {
					text-align: center;
					font-size: 30upx;
					color: #d26762;
					margin-top: 30upx;
				}
			}
			.lookbag_box {
				margin-top: 200upx;
				display: flex;
				justify-content: center;
				.lookbag_btn {
					width: 70%;
					height: 90upx;
					line-height: 90upx;
					text-align: center;
					font-size: 32upx;
					color: #c95948;
					letter-spacing: 2upx;
					background-color: #ffd356;
					border-radius: 50upx;
					box-shadow: 0upx 0upx 4upx rgba(0,0,0,0.2);
				}
			}
			.hide_btn {
				position: absolute;
				bottom: -110upx;
				left: 0;
				right: 0;
				width: 80upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				margin: 0 auto;
			}
		}
	}
</style>
