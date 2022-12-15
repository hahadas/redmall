<template>
	<view class="main" v-if="isDone">
		<view class="header flex flex-align-center bg-w" :style="{'padding-top': statusBarHeight+'px'}">
			<text class="iconfont icon" @tap="$navigateBack()">&#xe771;</text>
			<v-tabs :tabs="tabs" :bold="false" :scroll="false" fontSize="30rpx" lineHeight="4rpx" v-model="current" @change="tabsChange"></v-tabs>
			<view class="iconfont icon" @click="showActive">&#xe60b;</view>
		</view>
		<swiper class="swiper" :style="{'marginTop': statusBarHeight+50+'px'}" :indicator-dots="true" :autoplay="true">
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<image :src="item" mode="" class="img" @click="swiperViewPhotos(i)"></image>
			</swiper-item>
		</swiper>
		<view class="price flex flex-between" v-if="goodsInfo.goodsType === 2">
			<text class="blod color-w font60">
				¥ {{rangePrice}}
				<!-- <text class="text-del color-b9 font26 del">¥{{goodsInfo.originalPrice}}</text>	 -->
			</text>
			<view class="flex flex-column flex-align-end">
				<view class="flex flex-align-center" style="margin-bottom: 6rpx;">
					<image :src="staticUrl + 'home/boutique.png'" mode="" class="icon"></image>
					<text class="font38 blod color-yellow">精 品 推 荐</text>
				</view>
				<view class="flex flex-align-center color-w">
					<text class="iconfont font34">&#xe639;</text>
					<text class="font26">该商品支持配送上门</text>
				</view>
			</view>
		</view>
		<view class="price flex flex-between" v-if="goodsInfo.goodsType === 12">
			<text class="blod color-w font60">
				¥ {{rangePrice}}
			</text>
			<view class="flex flex-column flex-align-end font24 color-w">
				<view class="flex flex-column align-center" v-if="time">
					<text>距结束还剩</text>
					<text class="text-cen">{{time}}</text>
				</view>
				<text v-else>秒杀已结束</text>
			</view>
		</view>
		<view class="new flex flex-between" v-else>
			<text class="blod color-purple font48">
				¥ {{rangePrice}}
				<!-- <text class="text-del color-b9 font26" style="margin-left: 10rpx;">¥{{goodsInfo.originalPrice}}</text> -->
			</text>
		</view>
		<!-- 普通商品才可以使用优惠券 -->
		<view class="flex flex-between d-list" v-if="goodsInfo.goodsType == 1 && goodsInfo.discountList&&goodsInfo.discountList.length > 0" @click="collectCoupons(goodsInfo.discountList)">
			<view class="flex flex-align-center">
				<block v-for="(d, i) in goodsInfo.discountList" :key="i">
					<text class="d-item" v-if="i<3">满{{d.useStandardAmount}}减{{d.discountAmount}}</text>
				</block>
			</view>
			<view class="flex flex-align-center color-purple">
				<text class="font28">领券</text>
				<text class="iconfont font34" style="margin-top: 4rpx;">&#xe770;</text>
			</view>
		</view>
		<view class="wrap">
			<view class="name">
				<text class="line line-2">
					<text class="bg-base tips" v-if="goodsInfo.goodsType === 2">精品</text>
					<text class="bg-base tips" v-else-if="goodsInfo.goodsType === 11">新人大礼</text>
					<text class="bg-base tips" v-else-if="goodsInfo.goodsType === 12">秒杀</text>
					<text class="bg-base tips" v-else-if="goodsInfo.goodsType === 13">特价</text>
					<text class="bg-base tips" v-else-if="goodsInfo.goodsType === 14">拼团</text>
					<text class="bg-base tips" v-else-if="goodsInfo.goodsType === 15">积分</text>
					<text class="bg-base tips" v-else-if="goodsInfo.isNewProducts === 2">新品</text>
					{{goodsInfo.titleName}}
				</text>
				<!-- <text class="line line-2" :class="{'txt':goodsInfo.goodsType === 2||goodsInfo.isNewProducts === 2}">{{goodsInfo.titleName}}</text> -->
			</view>
			<!-- <view class="font28 color-b9 line">{{goodsInfo.subTitle}}</view> -->
			<view class="flex flex-between color-b9 font28 other">
				<!-- <text>积分：{{ (parseInt((goodsInfo.bonusIntegral/100*goodsInfo.wholesalePrice)*100)/100).toFixed(2) }}</text> -->
				<text>积分：{{ goodsInfo.bonusIntegral }}%</text>
				<text>月售：{{goodsInfo.totalSales}}</text>
				<!-- <text v-if="dkUserFlag">附近的配送员：{{ dkUserSize }}</text> -->
				<text>浏览：{{goodsInfo.visitBrowse}}</text>
			</view>
			<view class="bg-w servies flex flex-align-center font28 color-b9">
				<text>服务说明：</text>
				<view class="flex flex-align-center">
					<text><text class="b blue">无</text>破损无忧</text>
					<text><text class="b red">正</text>正品保证</text>
					<text v-if="goodsInfo.deliveryNo === 2 || goodsInfo.deliveryBusiness == 1 || goodsInfo.deliveryPlatform === 1">
						<text class="b green">送</text>配送上门
					</text>
				</view>
			</view>
			<view class="reward" v-if="goodsInfo.goodsRewardLevelRule">
				<text>大礼详情：</text>
				<view class="reward-wrap">
					<view class="reward-wrap-cell" v-if="goodsInfo.goodsRewardLevelRule.cardsByPlatform">
						<text class="iconfont iconchoiceO icon"></text>
						<text>{{goodsInfo.goodsRewardLevelRule.cardsByPlatform.name}}¥{{goodsInfo.goodsRewardLevelRule.cardsByPlatform.amount}}</text>
					</view>
					<view class="reward-wrap-cell">
						<text class="iconfont iconchoiceO icon"></text>
						<text>升级为{{goodsInfo.goodsRewardLevelRule.roleManagerLevel | filterManager}}掌柜</text>
					</view>
					<view class="reward-wrap-cell">
						<text class="iconfont iconchoiceO icon"></text>
						<text>购买当前商品时自身必须为{{goodsInfo.goodsRewardLevelRule.limitRoleManagerLevel | filterManager}}掌柜级别</text>
					</view>
					<view class="reward-wrap-cell">
						<text class="iconfont iconchoiceO icon"></text>
						<text v-if="goodsInfo.goodsRewardLevelRule.repeatBuyNumber === -1">不限制购买数量</text>
						<text v-else>人均限购{{goodsInfo.goodsRewardLevelRule.repeatBuyNumber}}件</text>
					</view>
				</view>
			</view>
			<view class="group" v-if="goodsInfo.goodsType === 14 && groupList.length > 0">
				<view class="title" @click="showSpellPopup()">
					<text class="font28">正在拼单，可直接参与</text>
					<text class="color-b9 font26">查看全部</text>
				</view>
				<block v-for="(item, i) in groupList" :key="i">
					<view class="flex flex-between group-item" v-if="item.groupTrueNumber > 0">
						<image :src="item.groupUserInfo.headPortrait" mode="" class="img"></image>
						<text class="line font28 flex-grow" style="width: 200rpx;">{{item.groupUserInfo.nickname}}</text>
						<text class="font26 color-b6" style="margin-left: 10rpx;">还差{{item.groupNumber - item.groupTrueNumber}}人拼成</text>
						<button type="primary" size="mini" class="bg-base btn" @click="addCartOrBuy(1, item)">去拼单</button>
					</view>
				</block>
			</view>
			<view class="issue bg-w" @tap="goEvaluate">
				<view class="title flex flex-between">
					<text class="font34">商品评论({{goodsInfo.totalEvaluate}})</text>
					<view class="flex flex-align-center color-purple">
						<text class="font28">查看全部</text>
						<text class="iconfont font38">&#xe770;</text>
					</view>
				</view>
				<view class="list">
					<block v-if="goodsInfo.totalEvaluate > 0">
						<block v-for="(item, i) in commentList" :key="i">
							<view class="list-item" v-if="i<2">
								<view class="flex flex-align-center">
									<image :src="filterImg(item.evaluateUserInfo.headPortrait, 1)" mode="" class="avatar"></image>
									<view class="flex-grow flex flex-column">
										<text class="color-purple font26">{{item.evaluateUserInfo.nickname}}</text>
										<text class="font26 color-b9">{{item.createTime}}</text>
									</view>
								</view>
								<text class="line line-2 font30 txt">{{item.evaluateGoodsComment}}</text>
								<view class="imgs" v-if="item.evaluateGoodsImages && item.evaluateGoodsImages.length > 0">
									<image :src="filterImg(img, 5)" mode="" class="pic" v-for="(img, index) in item.evaluateGoodsImages" :key="index"></image>
								</view>
							</view>
						</block>
					</block>
					<text v-else class="font30 color-b6">暂无评论</text>
				</view>
			</view>
			<view class="flex flex-between store bg-w">
				<view>
					<image :src="filterImg(storeInfo.logoImage, 1)" mode="" class="img"></image>
				</view>
				<view class="flex flex-column" style="width: 380rpx;">
					<view class="flex flex-align-center">
						<text class="blod font34">{{storeInfo.name}}</text>
					</view>
					<text class="font26 color-b6 line line-2">{{storeInfo.introduce}}</text>
				</view>
				<text class="color-purple btn font32" @tap="goStore">进店</text>
			</view>
		</view>
		<view class="detail">
			<view class="flex flex-center title">
				<text class="xian">—————</text>
				<text class="font26 color-b9">商品详情</text>
				<text class="xian">—————</text>
			</view>
			<rich-text :nodes="goodsInfo.detailsTextHtml"></rich-text>
			<view v-if="goodsInfo.detailsImgList">
				<image 
					style="width: 750rpx; display: block;" 
					:src="item" v-for="(item, i) in goodsInfo.detailsImgList" :key="i" mode="widthFix"></image>
			</view>
		</view>
		<view class="fixed">
			<uni-goods-nav
				:fill="true" 
				:options="options" 
				:buttonGroup="buttonGroup" 
				@click="navClick" 
				@buttonClick="buttonClick" />
		</view>
		<view class="fixed-height"></view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup bg-w">
				<view class="flex">
					<image :src="mainImage" mode="" class="img" @click="skuViewPhoto(mainImage)"></image>
					<text class="flex-grow color-purple font44 blod">¥{{money}}</text>
					<text class="iconfont font48 color-b9" @click="closePopup">&#xe7be;</text>
				</view>
				<view class="flex flex-column norms">
					<text class="color-b6 font30">商品规格</text>
					<view class="flex flex-align-center list" v-if="skuList">
						<block v-for="(sku, i) in skuList" :key="i">
							<text class="list-item" :class="{'active':sku.select}" v-if="sku.skuStock && sku.skuStock > 0" @click="skuSelect(i)">{{sku.skuName}}</text>
						</block>
					</view>
				</view>
				<view class="flex flex-between mar">
					<text class="color-b6 font30">购买数量</text>
					<uni-number-box :min="1" :max="numberMax" :value="number" @change="numberChange"></uni-number-box>
				</view>
				<button type="primary" class="bg-base btn" @click="addCartOrBuy(btnClickIndex, null)">{{btnTxt}}</button>
			</view>
		</uni-popup>
		<!-- 优惠明细 -->
		<uni-popup ref="discountPopup" type="bottom">
			<view class="discount">
				<text class="font32 color-purple">优惠明细</text>
				<view class="d-list">
					<block v-for="(item, i) in discountList" :key="i">
						<view class="d-list-item" v-if="item.status === 1">
							<view class="left">
								<text class="font26 tip">¥</text>
								<text class="font46 blod">{{item.discountAmount}}</text>
							</view>
							<view class="right flex flex-column flex-grow">
								<text class="font28">{{item.titleName}}</text>
								<text class="font30">满{{item.useStandardAmount}}可用</text>
								<text class="font26">{{item.expireTimeDay > 0 ? `有效期${item.expireTimeDay}天`:'永久有效'}}</text>
							</view>
							<text class="btn" v-if="item.number === 0">已领完</text>
							<text class="btn" v-else @tap.stop="onReceive(i)">{{item.userReceiveFlag ? '立即领取' : '已领取'}}</text>
						</view>
					</block>
				</view>
				<button type="primary" class="bg-base close" @click="closePopup">关闭</button>
			</view>
		</uni-popup>
		<!-- 拼团 -->
		<uni-popup ref="spellPopup" type="center">
			<view class="spell">
				<text class="title">正在拼单</text>
				<scroll-view scroll-y="true" style="height: 600rpx;" @scrolltolower="getGroupList()">
					<block v-for="(item, i) in groupList" :key="i">
						<view class="flex flex-between spell-item" v-if="item.groupTrueNumber > 0">
							<image :src="item.groupUserInfo.headPortrait" mode="" class="img"></image>
							<text class="line font28 flex-grow" style="width: 200rpx;">{{item.groupUserInfo.nickname}}</text>
							<text class="font26 color-b6" style="margin-left: 10rpx;">还差{{item.groupNumber - item.groupTrueNumber}}人拼成</text>
							<button type="primary" size="mini" class="bg-base btn" @click="addCartOrBuy(1, item)">去拼单</button>
						</view>
					</block>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import { sendRequestJson } from "@/common/http/api.js"
	import uniGoodsNav from '@/components/uni-goods-nav/uni-goods-nav.vue'
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	let timer = null
	export default{
		components: { vTabs, uniGoodsNav, uniPopup, uniNumberBox },
		data(){
			return {
				staticUrl: this.$staticUrl,
				isDone: false,
				statusBarHeight: getApp().statusBarHeight,
				current: 0,
				tabs: ["商品", "评论", "详情"],
				options: [
					{text: "店铺", icon: "\ue616", iconColor: "#381895"},
					{text: "客服", icon: "\ue608", iconColor: "#381895"},
					{text: "收藏", icon: "\ue615", iconColor: "#381895"}
				],
				buttonGroup: [
					{text: "立即购买", color: "#fff", backgroundColor: "#381895"}
				],
				btnTxt: "立即购买",
				btnClickIndex: null,
				myAddressData: {},
				id: "",
				swiperList: [],
				commentList: [],
				skuList: [],
				skuObj: {},
				mainImage: "",
				money: "",
				goodsInfo: {},
				storeInfo: {},
				isCollection: false, // 收藏
				distanceStoreFlag: false, // 是否支持配送上门
				dkUserFlag: false, // 附近是否有代理
				dkUserSize: 0, // 附近代理人数
				detailTop: 0, // 详情距离顶部的距离
				issueTop: 0 ,// 评论距离顶部的距离
				storeType: 0,
				number: 1,
				numberMax: 99,
				discountList: [],
				rangePrice: "",
				time: null,
				groupList: []
			}
		},
		computed:{
			...mapState(["userInfo"])
		},
		filters:{
			filterManager(val){
				switch(val) {
					case 0:
						return "不是";
					case 1:
						return "初级";
					case 2:
						return "中级";
					case 3:
						return "高级";
					default:
						return "其他";
				}
			}
		},
		onLoad(opt) {
			let addressData = publics.getMyaddressLngLat()
			if (addressData) {
				this.myAddressData = JSON.parse(addressData)
			} else {
				this.$msg("请先设置您当前的位置")
				this.openMap()
			}
			let id = opt.id
			this.id = id
			if (id) {
				this.getCommentList()
			} else {
				this.$msg("查找不到该商品信息,可能该商品已下架");
				this.$navigateBack(1, 1000);
			}
			this.getScrollTop()
		},
		onShow() {
			// 初始化底部按钮
			this.buttonGroup = [
				{text: "立即购买", color: "#fff", backgroundColor: "#381895"}
			]
			this.getGoodsDetail()
		},
		onHide() {
			this.clear()
		},
		onUnload() {
			this.clear()
		},
		onPageScroll(e) {
			if (e.scrollTop > 0 && e.scrollTop < this.issueTop) {
				this.current = 0
			}
			if (e.scrollTop > this.issueTop && e.scrollTop < this.detailTop) {
				this.current = 1
			}
			if (e.scrollTop > this.detailTop) {
				this.current = 2
			}
		},
		methods: {
			filterImg(img, type){
				return publics.filterImgUrl(img, type)
			},
			getScrollTop(){
				let _this = this
				setTimeout(()=>{
					_this.$getRect(".detail").then(res =>{
						if (res) {
							_this.detailTop = res.top - 60
						}
					})
					_this.$getRect(".issue").then(res =>{
						if (res) {
							_this.issueTop = res.top - 60
						}
					})
				}, 500)
			},
			getGoodsDetail(){
				let params = {
					goodsId: this.id,
					lng: this.myAddressData.longitude, //经度
					lat: this.myAddressData.latitude   //纬度
				}
				this.$http("GET", url.goods.goodsDetail,params).then(res =>{
					this.goodsInfo = res.data
					this.storeInfo = res.data.storeInfo
					this.swiperList = this.goodsInfo.topImgList
					this.skuList = this.goodsInfo.skuList
					this.mainImage = this.goodsInfo.mainImage
					this.isDone = true
					// 是否收藏
					this.isCollection = res.data.isCollection
					if (this.isCollection) {
						this.options[2].icon = "\ue614"
					}
					// 是否具备进货资格(当前商品为精品商品，并且自己为配送员, 并且开启精品商品进货)
					if (res.data.goodsType === 2 && this.userInfo.distributorIsOpen === 1 && res.data.boutiqueBuyingStatus === 1){
						// this.btnTxt = "进货"
						this.buttonGroup.push({text: "进货", color: "#fff", backgroundColor: "#764de8"})
					}
					// 幅度价格
					this.rangePrice = this.goodsInfo.wholesalePrice
					if (res.data.skuList){
						let skuList = res.data.skuList
						if (skuList.length > 1){
							let maxArray = skuList.sort((a,b)=>{
								return b.skuPrice - a.skuPrice
							})
							let maxPrice = maxArray[0].skuPrice
							let minPrice = maxArray[maxArray.length - 1].skuPrice
							this.rangePrice = minPrice + '-' + maxPrice
						}
					}
					this.money = this.rangePrice
					if (res.data.goodsType === 12 && res.data.homeGoodsSeckill) {
						this.countDown(res.data.homeGoodsSeckill.dueDateTime)
					}
					if (res.data.goodsType === 14) {
						this.btnTxt = "发起拼单"
						this.buttonGroup[0].text = this.btnTxt
						// this.buttonGroup.push({text: this.btnTxt, color: "#fff", backgroundColor: "#764de8"})
						this.getGroupList()
					}
					this.skuSelect(0)
				}).catch((err)=>{
					this.$msg(err.msg)
					this.$navigateBack(1, 1000);
				})
			},
			countDown(time){
				if (timer) {
					this.clear()
				}
				timer = setInterval(()=>{
					let timeReplace = time.replace(/\.|\-/g, '/')
					let oldTime = new Date(timeReplace).getTime()
					let newTime = new Date().getTime()
					let leftTime = parseInt(oldTime - newTime)
					if (leftTime >=0) {
						let h = Math.floor(leftTime/1000/60/60%24);
						let m = Math.floor(leftTime/1000/60%60);  
						let s = Math.floor(leftTime/1000%60);  
						function checkTime(i){
						    if (i<10) {
						        i = "0"+i;
						    }
						    return i;
						}
						h = checkTime(h)
						m = checkTime(m)
						s = checkTime(s)
						this.time = `${h}:${m}:${s}`
					} else {
						this.clear()
					}
				}, 1000)
			},
			clear(){
				if (timer){
					clearInterval(timer)
					timer = null
					this.time = null
				}
			},
			getCommentList(){
				this.$http("GET", url.goods.getEvaluateList, {goodsId: this.id, pageNum: 0}).then(res =>{
					let list = res.data.data
					list.map(v => {
						if (v.sysStaticResources) {
							v.evaluateGoodsImages = []
							v.evaluateDistributionImages = []
							v.sysStaticResources.forEach(k => {
								if (k.type === 20) {
									v.evaluateGoodsImages.push(k.ossUrl)
								}
								if (k.type === 21) {
									v.evaluateDistributionImages.push(k.ossUrl)
								}
							})
						}
					})
					this.commentList = list
				})
			},
			getGroupList(){
				this.$http("GET", url.goods.getGroupById, {goodsId: this.id, pageNum: this.groupList.length}).then(res =>{
					this.groupList = this.groupList.concat(res.data)
				})
			},
			openMap() {
				var _this = this;
				uni.chooseLocation({
					keyword: "",
					success: function(res) {
						publics.setMyaddressLngLat(JSON.stringify(res));
						//设置地址
						_this.myAddressData = res;
					}
				});
			},
			navClick(e) {
				if (e.index === 0) {
					this.goStore()
				} else if (e.index === 1) {
					this.$navigateTo("../interaction/im-chat?type=3&&id="+this.storeInfo.imAccount)
				} else {
					this.isCollection = !this.isCollection
					this.options[2].icon = this.isCollection ? "\ue614" :"\ue615"
					this.$http("POST", url.goods.collectionGoods,{goodsId: this.id}).catch(()=>{
						this.isCollection = false
						this.options[2].icon = this.isCollection ? "\ue614" :"\ue615"
					})
				}
			},
			buttonClick(e){
				this.btnClickIndex = e.index
				this.btnTxt = this.buttonGroup[e.index].text
				if (this.goodsInfo.skuList) {
					// if (this.goodsInfo.skuList.length === 1) { // 如果sku只有一个，那么默认选中
					// 	this.skuSelect(0)
					// }
					this.$refs.popup.open()
				} else {
					this.addCartOrBuy(0, null)
				}
				
			},
			// 立即购买 / 进货 / 发起拼单
			addCartOrBuy(index, row){
				if (index === 1 && this.goodsInfo.goodsType === 14 && row && row.groupUserInfo.imAccount === this.userInfo.imAccount) { // 点击自己发起的拼单
					return this.$msg("不能拼自己发起的拼单")
				}
				if (this.goodsInfo.goodsType === 12 && !this.time) { // 如果是限时秒杀商品并且已结束
					return this.$msg("该商品秒杀已结束")
				}
				if (this.userInfo.userStoreId === this.goodsInfo.userStoreId) {
					return this.$msg("不能购买自己店铺的商品！");
				}
				if (JSON.stringify(this.skuObj) === "{}"){
					return this.$msg("请选择商品规格");
				}
				if (this.skuObj.skuStock < 1){
					return this.$msg("库存不足！");
				}
				let params = {
					goodsId: this.id,
					number: this.number,
					goodsSkuId: this.skuObj.id,
					orderType: index === 0 ? this.goodsInfo.goodsType : 3, // 订单类型 1-普通 2-精品 3-进货
					groupParentId: 0 //默认拼团id为0，防止传null后台报错
				}
				if (this.goodsInfo.goodsType === 14){
					params.orderType = this.goodsInfo.goodsType
					params.groupParentId = row ? row.id : 0
				}
				sendRequestJson("GET", url.order.getOrderInfo, params).then(res=>{
					let data = res.data
					data.orderType = params.orderType
					uni.setStorageSync("commitOrderData", data)
					this.$navigateTo("/pages/order/createOrder")
				})
			},
			showActive(){
				let _this = this
				uni.showActionSheet({
				    itemList: ['举报'],
				    success: function (res) {
						if (res.tapIndex === 0) {
							_this.$navigateTo("/pages/report/index?type=4&configType=3&id="+_this.id)
						}
				    }
				});
			},
			swiperViewPhotos(i){
				let _this = this
				uni.previewImage({
					current: i,
					urls: _this.swiperList
				})
			},
			skuViewPhoto(url){
				uni.previewImage({
					current: url,
					urls: [url]
				})
			},
			showSpellPopup(){
				this.$refs.spellPopup.open()
			},
			closePopup(){
				this.$refs.popup.close()
				this.$refs.discountPopup.close()
			},
			numberChange(val){
				this.number = val
			},
			skuSelect(i){
				this.skuList.map(v => {
					v.select = false
				})
				this.skuList[i].select = true
				this.skuObj = this.skuList[i]
				this.numberMax = this.skuList[i].skuStock
				this.mainImage = this.skuList[i].mainImage
				this.money = this.skuList[i].skuPrice
			},
			collectCoupons(list){
				this.discountList = list
				this.$refs.discountPopup.open()
			},
			onReceive(index){
				if (!this.discountList[index].userReceiveFlag) return
				let discountId = this.discountList[index].id
				this.$http("POST", url.user.receiveDiscount, {discountId: discountId}).then(res =>{
					this.$msg("恭喜，抢到了")
					this.discountList[index].userReceiveFlag = false
					if (this.discountList[index].number !== -1) {
						this.discountList[index].number--
					}
					this.goodsInfo.discountList = this.discountList
				})
			},
			tabsChange(i) {
				this.current = i
				if (i === 0){
					uni.pageScrollTo({
						scrollTop: 0
					})
				}else if (i === 1) {
					uni.pageScrollTo({
						scrollTop: this.issueTop
					})
				} else{
					uni.pageScrollTo({
						scrollTop: this.detailTop
					})
				}
			},
			goEvaluate(){
				let data = {
					id: this.id,
					all: this.goodsInfo.totalEvaluate,
					good: this.goodsInfo.evaluateGood,
					secondary: this.goodsInfo.evaluateSecondary,
					difference: this.goodsInfo.evaluateDifference
				}
				this.$navigateTo("evaluate?data="+JSON.stringify(data))
			},
			goStore(){
				this.$navigateTo("store?id="+this.goodsInfo.userStoreId)
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		background-color: #f4f5f6;
	}
	.header{
		padding: 0rpx 30rpx;
		height: 100rpx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 99;
		.icon{
			font-size: 60rpx;
			width: 100rpx;
			margin-bottom: -10rpx;
		}
	}
	.swiper{
		// margin-top: 100rpx;
		width: 750rpx;
		height: 700rpx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
	.price{
		background-color: #381895;
		padding: 20rpx 20rpx;
		margin-bottom: 10rpx;
		.del{
			margin-left: 10rpx;
		}
		.icon{
			width: 56rpx;
			height: 56rpx;
			margin-right: 10rpx;
		}
	}
	.new{
		padding: 0rpx 20rpx;
	}
	.d-list{
		padding: 0 20rpx;
		.d-item{
			font-size: 24rpx;
			color: #381895;
			background-color: rgba($color: #381895, $alpha: .3);
			border-radius: 6rpx;
			margin-right: 10rpx;
			padding: 4rpx 10rpx;
		}
	}
	.wrap{
		margin: 0 20rpx;
		.name{
			position: relative;
			margin-bottom: 10rpx;
			.tips{
				color: white;
				font-weight: normal;
				border-radius: 8rpx;
				font-size: 26rpx;
				padding: 0 10rpx;
				margin-right: 6rpx;
				// display: inline-block;
				// position: absolute;
				// left: 0;
				// top: 12rpx;
			}
			// .txt{
			// 	text-indent: 2.2em;
			// }
		}
		.other{
			margin-bottom: 10rpx;
		}
		.servies{
			padding: 26rpx 20rpx;
			border-radius: 16rpx;
			margin-bottom: 20rpx;
			.b{
				width: 34rpx;
				height: 34rpx;
				font-size: 24rpx;
				color: white;
				text-align: center;
				line-height: 34rpx;
				display: inline-block;
				border-radius: 50%;
				margin-left: 20rpx;
				margin-right: 6rpx;
			}
			.blue{
				background-color: #007AFF;
			}
			.red{
				background-color: #ff342a;
			}
			.green{
				background-color: #00a743;
			}
		}
		.reward{
			background-color: white;
			padding: 26rpx 20rpx;
			border-radius: 16rpx;
			margin-bottom: 20rpx;
			color: #999999;
			font-size: 28rpx;
			&-wrap{
				&-cell{
					display: flex;
					align-items: center;
					margin-top: 10rpx;
					.icon{
						font-size: 36rpx;
						margin-right: 10rpx;
						color: #381895;
					}
				}
			}
		}
		.group{
			background-color: white;
			padding: 20rpx 20rpx 0;
			margin-bottom: 20rpx;
			border-radius: 20rpx;
			.title{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 20rpx;
			}
			&-item{
				border-top: 2rpx solid #EEEEEE;
				padding: 20rpx 0;
				.img{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 10rpx;
				}
				.btn{
					margin: 0;
					margin-left: 10rpx;
				}
			}
		}
		.issue{
			padding: 20rpx;
			border-radius: 16rpx;
			.list{
				// margin-top: 30rpx;
				&-item{
					padding-bottom: 20rpx;
					border-bottom: 2rpx solid #eee;
					margin-top: 30rpx;
					.avatar{
						width: 110rpx;
						height: 110rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}
					.txt{
						margin-top: 20rpx;
						color: #666;
						line-height: 48rpx;
					}
					.imgs{
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						margin-top: 10rpx;
						.pic{
							width: 160rpx;
							height: 160rpx;
							margin-right: 10rpx;
							margin-bottom: 10rpx;
							border-radius: 10rpx;
						}
					}
				}
				&-item:last-child{
					border: none;
				}
			}
		}
		.store{
			margin-top: 20rpx;
			padding: 20rpx;
			border-radius: 16rpx;
			.img{
				width: 120rpx;
				height: 120rpx;
				margin-right: 20rpx;
				border-radius: 20rpx;
				display: block;
			}
			.tips{
				color: white;
				font-size: 24rpx;
				border-radius: 30rpx;
				padding: 0 10rpx;
				font-weight: normal;
				margin-left: 10rpx;
				transform: scale(0.9);
				display: inline-block;
			}
			.btn{
				border: 2rpx solid #381895;
				border-radius: 30rpx;
				padding: 0 20rpx;
				margin-left: 20rpx;
			}
		}
	}
	.detail {
		margin-bottom: 100rpx;
		.title{
			margin: 20rpx;
			.xian{
				font-size: 28rpx;
				color: #cccccc;
				margin: 0 20rpx;
			}
		}
	}
	.fixed{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.fixed-height{
		height: 1px;
	}
	.popup{
		padding: 20rpx 30rpx;
		.img{
			width: 160rpx;
			height: 160rpx;
			margin-right: 20rpx;
			border-radius: 10rpx;
		}
		.norms{
			margin-top: 20rpx;
			padding-top: 20rpx;
			border-top: 2rpx solid #f6f4f8;
			border-bottom: 2rpx solid #f6f4f8;
			.list{
				flex-wrap: wrap;
				margin-top: 20rpx;
				&-item{
					color: #555555;
					background-color: #F5F5F5;
					font-size: 28rpx;
					padding: 10rpx 20rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
				}
				.active{
					color: #381895;
					background-color: rgba(#381895, .3);
				}
			}
		}
		.mar{
			margin: 20rpx 0 50rpx;
		}
		.btn{
			border-radius: 50rpx;
		}
	}
	.discount{
		padding: 20rpx;
		border-radius: 20rpx 20rpx 0 0;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.d-list{
			margin-top: 50rpx;
			&-item{
				width: 650rpx;
				background-color: rgba($color: #381895, $alpha: .3);
				border-radius: 20rpx;
				padding: 30rpx;
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				color: #381895;
				.left{
					display: flex;
					align-items: flex-end;
					margin-right: 20rpx;
					.tip{
						margin-bottom: 10rpx;
						margin-right: 6rpx;
						display: inline-block;
					}
				}
				.btn{
					margin-right: 10rpx;
					font-size: 34rpx;
				}
			}
		}
		.close{
			width: 710rpx;
			margin-top: 50rpx;
			border-radius: 50rpx;
		}
	}
	.spell{
		// width: 90%;
		width: 100%;
		background-color: white;
		border-radius: 20rpx;
		.title{
			width: 100%;
			text-align: center;
			border-bottom: 2rpx solid #EEEEEE;
			padding: 30rpx 0;
			font-size: 32rpx;
			color: #444444;
			display: block;
		}
		&-item{
			padding: 20rpx;
			.img{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			.btn{
				margin: 0;
				margin-left: 10rpx;
			}
		}
	}
</style>
