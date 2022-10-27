<template>
	<view>
		<scroll-view scroll-y="true" :style="{height: swiperHeight+'px;'}">
			<!-- 聊天列表 -->
			<view class="cu-list menu-avatar" style="height: 100%;">
				<!-- 平台客服 -->
				<block v-if="customerList.length > 0">
					<text class="title">平台客服</text>
					<block v-for="(item, index) in customerList" :key="index+99">
						<view class="cu-item" @click="skipToSingleChat(item.imAccount, 1, true, index)" v-if="userInfo.imAccount !== item.imAccount">
							<image :src="filterImg(item.headPortrait)" class="cu-avatar round lg" mode=""></image>
							<view class="content" style="background-color: #ffffff;padding-top: 0upx;">
								<view class="text-grey">{{item.nickname}}</view>
								<view class="text-gray text-sm">
									<text class="line">{{item | filterContent}}</text>
								</view>
							</view>
							<view class="action" style="width: 200rpx;">
								<view class="text-grey text-xs">
									{{item.createTime | filterTime}}
								</view>
								<view class="cu-tag round bg-red sm" v-if="item.localUnreadNumber">{{item.localUnreadNumber}}</view>
							</view>
						</view>
					</block>
					<view class="tb"></view>
				</block>
				<block v-for="(item,index) in lists" :key="index" >
					<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" :data-target="'move-box-' + index"
					@click="skipToSingleChat(item.toImAccount, item.type, false, index)">
						<image :src="filterImg(item.toType === 3 ? item.storeLogoImage : item.headPortrait)" class="cu-avatar round lg" mode=""></image>
						<view class="content" style="background-color: #ffffff;padding-top: 0upx;">
							<view class="text-grey">
								<text class="tips bg-base" v-if="item.toType === 2">配送员</text>
								<text class="tips yellow" v-if="item.toType === 3">商家</text>
								<text class="tips green" v-if="item.toType === 4">配送员用户</text>
								<text class="tips redd" v-if="item.toType === 5">店铺客户</text>
								{{item.toType === 3 ? item.storeName : item.nickname}}
							</view>
							<view class="text-gray text-sm">
								<text class="line">{{item | filterContent}}</text>
							</view>
						</view>
						<view class="action" style="width: 200rpx;">
							<view class="text-grey text-xs">
								{{item.createTime | filterTime}}
							</view>
							<view class="cu-tag round bg-red sm" v-if="item.localUnreadNumber">{{item.localUnreadNumber}}</view>
						</view>
						<view class="move">
							<view class="bg-red" @tap.stop="deleteConversation(item, index)">删除</view>
							<view class="bg-grey" @tap.stop="touchLongByXiaoXiFalse(index)">取消</view>
						</view>
					</view>
				</block>
			</view>
			<view class="flex flex-center">
				<uni-load-more :status="loadingType"></uni-load-more>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	import { mapState, mapMutations } from "vuex"
	import url from "@/common/http/url.js"
	import imUtils from "@/common/im/imTools.js"
	import publics from "@/common/utils/public.js"
	import { selectInformationType, pullSQL, deleteInformationType, updateSessionInformation } from "@/common/im/db.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	export default {
		components: { uniLoadMore, vTabs },
		data(){
			return {
				swiperHeight: 0,
				modalName: null,
				lists: [],
				listTouchStart: 0,
				listTouchDirection: null,
				loadModal: false,
				loadingType: 'nomore', //加载更多状态
				customerList: [],
				isChatBack: false,
				isCustomer: false,
				listIndex: 0,
				lastMsg: {}
			}
		},
		filters:{
			filterTime(val){
				if (!val) return
				return imUtils.fromTimer(val);
			},
			filterContent(data){
				if (data.msgType === false) return ""
				switch(data.msgType) {
					case 0:
						return data.content.text;
					case 1:
						return "[图片]";
					case 2:
						return "[语音]";
					case 3:
						return "[位置]";
					case 4:
						return "[视频]";
					case 5:
						return "[视频/语音通话]";
					case 6:
						return "[商品配送]";
					case 7:
						return "[商品退款]";
					case 8:
						return "[商品下单]";
					default:
						return ""
				}
			},
		},
		computed: {
			...mapState(["isHandNewMsg", "userInfo"])
		},
		watch:{
			isHandNewMsg(val){
				if (val) {
					this.init()
					this.setHandNewMsg(false)
				}
			}
		},
		onShow() {
			this.setHandNewMsg(false)
			this.swiperHeight = uni.getSystemInfoSync().windowHeight
			if (this.isChatBack) {
				let name = null
				if (this.isCustomer) {
					name = "customerList"
				} else {
					name = "lists"
				}
				this[name][this.listIndex].msgType = this.lastMsg.msgType
				this[name][this.listIndex].content = this.lastMsg.content
				this[name][this.listIndex].createTime = this.lastMsg.createTime
				// 如果是第一条则不用重新排序
				if (this.listIndex && !this.isCustomer) {
					let data = {}
					this[name].forEach((v, i) => {
						if (i === this.listIndex) {
							data = v
							return
						}
					})
					this[name].splice(this.listIndex, 1)
					this[name].unshift(data)
				}
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			...mapMutations(["setHandNewMsg"]),
			init(){
				this.$http("GET", url.common.customerService).then(res => {
					this.customerList = JSON.parse(JSON.stringify(res.data.im))
					this.getList()
				})
			},
			// 从本地数据库中获取会话列表，默认按照会话的最后一条消息的时间，降序排列
			async getList() {
				// #ifdef APP-PLUS
				uni.stopPullDownRefresh();
				let that = this
				let res = await selectInformationType(null)
				console.log("会话列表。。。", res)
				if (res.length === 0) return
				let data = JSON.parse(JSON.stringify(res))
				let conversationUnReadData = publics.getConversationUnReadNum()
				let array = []
				let localUnreadNumberTotal = 0
				for(let i = 0; i<data.length; i++) {
					let e = data[i]
					e.localUnreadNumber = conversationUnReadData["c_"+e.id] || 0
					await updateSessionInformation(e, 'id', e.id)
					localUnreadNumberTotal = localUnreadNumberTotal + e.localUnreadNumber
					if (e.storeLogoImage === "null") {
						e.storeLogoImage = null
					}
					if (e.storeName === "null") {
						e.storeName = null
					}
					let isHas = false
					let customerIndex = 0
					this.customerList.forEach((v, i) => {
						if (v.imAccount === e.toImAccount) {
							isHas = true
							customerIndex = i
							return
						}
					})
					let doc = await pullSQL(null, 'conversationId', e.id, 0, 1, 'desc')
					if (doc.length > 0) {
						let chatObj = doc[0]
						e.createTime = chatObj.createTime
						e.msgType = chatObj.msgType
						e.content = JSON.parse(chatObj.content)
					} else {
						e.createTime = 0
						e.msgType = false
						e.content = null
					}
					if (isHas) {
						this.customerList[customerIndex].localUnreadNumber = e.localUnreadNumber
						this.customerList[customerIndex].conversationId = e.id
						this.customerList[customerIndex].createTime = e.createTime
						this.customerList[customerIndex].msgType = e.msgType
						this.customerList[customerIndex].content = e.content
						this.$forceUpdate()
					} else {
						array.push(e)
					}
				}
				array.sort(function(a, b){return b.createTime - a.createTime}) // 时间排序
				this.lists = array
				plus.runtime.setBadgeNumber(localUnreadNumberTotal)
				// #endif
			},
			deleteConversation(item,index) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定将 '+item.nickname+' 的会话消息删除吗？',
					success: res => {
						if(res.confirm){
							that.lists.splice(index, 1)
							deleteInformationType('sessionList', 'id', item.id)
						}
						that.touchLongByXiaoXiFalse(0);
					}
				});
			},
			touchLongByXiaoXiFalse(index){
				this.listTouchStart = 0;
				this.listTouchDirection = "right";
				this.modalName = null;
			},
			touchLongByXiaoXi(index){
				this.listTouchStart = 200;
				this.listTouchDirection = "left";
				this.modalName = "move-box-"+index;
			},
			/**
			 * 创建会话
			 * @param {String} imAccount 对方的imAccount
			 * @param {Number} type 会话类型 1-用户 2-配送员 3-商家
			 * @param {Bool} isCustomer 是否是客服 
			 * @param {Number} index 索引 
			 * */
			skipToSingleChat(imAccount, type, isCustomer, index) {
				this.$navigateTo('im-chat?pages=message&&id='+imAccount+"&&type="+type+"&&isCustomer="+isCustomer+"&&listIndex="+index)
				if (isCustomer) {
					this.customerList[index].localUnreadNumber = 0
				} else {
					this.lists[index].localUnreadNumber = 0
				}
				this.isChatBack = false
			},
			filterImg(img){
				if (img) {
					return publics.filterImgUrl(img, 1)
				} else {
					return "/static/user/avatar.png"
				}
			},
			isHasUnSendMsg(id){
				if (!id) return ""
				let value = publics.getUnsendMsg(id)
				console.log("unSendMsg......", value, id)
				return value
			}
		}
	}
</script>

<style scoped lang="scss">
	.cu-list {
		display: flex;
		flex-direction: column;
		.title{
			border-left: 8rpx solid #381895;
			padding-left: 26rpx;
			font-size: 28rpx;
			color: #777;
			margin-bottom: 20rpx;
			margin-left: 30rpx;
		}
		.tb{
			width: 750rpx;
			height: 20rpx;
			background-color: #F8F8F8;
		}
		.cu-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			transition: all .6s ease-in-out 0s;
			transform: translateX(0upx);
			background-color: #FFFFFF;
	
			&:after {
				position: absolute;
				top: 0;
				left: 0;
				box-sizing: border-box;
				width: 200%;
				height: 200%;
				border-bottom: 1px solid #ddd;
				border-radius: inherit;
				content: " ";
				transform: scale(.5);
				transform-origin: 0 0;
				pointer-events: none
			}
	
			&:last-child::after {
				border-bottom: none;
			}
			.tips{
				font-size: 20upx;
				padding: 5upx 8upx;
				border-radius: 15%;
				margin-right: 5upx; 
				line-height: 30upx;
				color: white;
			}
			.yellow{
				background: linear-gradient(to bottom, #b69700 0%, #c66d00 100%);
			}
			.green{
				background: linear-gradient(to bottom, #38b948 0%, #238300 100%);
			}
			.redd{
				background: linear-gradient(to bottom, #dc4839 0%, #e20b3b 100%);
			}
		}
	
		&.menu {
			margin-top: 30rpx;
			.cu-item {
				padding: 30rpx;
				.icon{
					img,image{
						width: 50rpx;
					}
				}
				.content {
					margin-left: 20rpx;
					font-size: 32rpx;
				}
			}
		}
	}
</style>

<style scoped lang="scss">
	@import "../../common/main.css";
</style>

