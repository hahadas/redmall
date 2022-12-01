<template>
	<view>
		<view class="flex flex-center header">
			<view class="flex flex-align-center search">
				<text class="iconfont icon">&#xe627;</text>
				<input type="text" v-model="keyName" @confirm="onConfirm" confirm-type="done" placeholder="商品编号/商品名称" class="flex-grow input" />
				<text class="iconfont del" v-if="keyName" @click="keyName=''">&#xe638;</text>
			</view>
		</view>
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view @tap="selectCupboard(item)">
					<view class="title flex flex-between">
						<text class="color-b9 font32">{{item.createTime}}</text>
						<text class="color-b9 font32">{{item.status | filterStatus}}</text>
					</view>
					<view class="flex">
						<view><image :src="item.mainImage" mode="" class="img"></image></view>
						<view>
							<text class="line line-2 font34">
								<text class="color-b6 font32">[{{item.isNewProducts === 2 ? '新品/' : ''}}{{item.goodsType | filterType}}]</text>
								{{item.titleName}}
							</text>
							<!-- <text class="line font30 color-b9" v-if="item.goodsNumber">商品编号：{{item.goodsNumber}}</text> -->
							<text class="font30 color-red mar">¥{{item.wholesalePrice}}</text>
						</view>
					</view>
				</view>
				<view class="bom">
					<view class="flex flex-align-center" v-if="item.status === 1 || item.status === 4">
						<text class="font32 color-b3">上架</text>
						<switch :checked="item.status === 1?true:false" @change.stop="switchChange($event, item, i, 'status')" style="transform: scale(0.7);" />
					</view>
					<view class="flex flex-align-center">
						<text class="font32 color-b3">推荐</text>
						<switch :checked="item.storeRecommendStatus === 2?true:false" @change.stop="switchChange($event, item, i, 'storeRecommendStatus')" style="transform: scale(0.7);" />
					</view>
					<view class="flex flex-align-center" v-if="item.status === 1 && item.goodsType === 2">
						<text class="font32 color-b3">进货</text>
						<switch :checked="item.boutiqueBuyingStatus === 1?true:false" @change.stop="switchChange($event, item, i, 'boutiqueBuyingStatus')" style="transform: scale(0.7);" />
					</view>
					<text class="btn" @tap.stop="onEdit(item)">编辑</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
		
		<!-- 左侧菜单 -->
		<uni-drawer ref="drawer" mode="right" :width="280">
		    <scroll-view scroll-y :style="{height: scrollHeight+'px'}">
		       <view class="drawer">
				   <view class="title">商品状态</view>
				   <view class="grid">
						<view class="grid-item" :class="{'active':statusIndex === i}" v-for="(item, i) in statusList" :key="i" @click="tabsSelect('status', i)">
						    <text>{{item.name}}</text>
						</view>
				   </view>
				   <view class="title">商品分类</view>
				   <view class="grid">
					   <view class="grid-item" :class="{'active':classIndex === i}" v-for="(item, i) in classList" :key="i" @click="tabsSelect('class', i)">
							<text>{{item.name}}</text>
					   </view>
				   </view>
				   <view class="title">商品推荐</view>
				   <view class="grid">
						<view class="grid-item" :class="{'active':recommendIndex === i}" v-for="(item, i) in recommendList" :key="i" @click="tabsSelect('recommend', i)">
							<text>{{item.name}}</text>
						</view>
				   </view>
				   <view class="title">商品类型</view>
				   <view class="grid">
						<view class="grid-item" :class="{'active':typeIndex === i}" v-for="(item, i) in typeList" :key="i" @click="tabsSelect('type', i)">
							<text>{{item.name}}</text>
						</view>
				   </view>
				   <view class="flex flex-between btns">
					   <view class="btn" @click="onReset">重置</view>
					   <view class="btn right" @click="onSave">确定</view>
				   </view>
			   </view>
		    </scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	export default{
		components:{
			uniLoadMore, uniDrawer
		},
		data(){
			return {
				scrollHeight: 0,
				loading: "loading",
				// 商品状态
				statusList: [
					{name: "全部", value: -1}
				],
				statusIndex: 0,
				// 分类
				classList: [
					{name: "全部", id: -1}
				],
				classIndex: 0,
				// 店铺首页商品推荐
				recommendList: [
					{name: "全部", value: -1},
					{name: "无", value: 1},
					{name: "推荐", value: 2},
				],
				recommendIndex: 0,
				// 商品类型
				typeList: [
					{name: "全部", value: -1}
				],
				typeIndex: 0,
				// 是否是新品
				newProductsList: [
					{name: "全部", value: -1},
					{name: "是", value: 2},
					{name: "不是", value: 1}
				],
				newProductsIndex: 0,
				list: [],
				keyName: "",
				cupboard: false
			}
		},
		filters:{
			filterStatus(value){
				let goodsStatusList = selectOptions.goodsStatusList
				let name = ""
				goodsStatusList.forEach(v =>{
					if (v.value === value) {
						name = v.name
						return false
					}
				})
				return name
			},
			filterType(val){
				switch(val){
					case 1:
						return "普通";
					case 2:
						return "精品";
					case 11: 
						return "新人";
					case 12:
						return "秒杀";
					case 13:
						return "特价";
					case 14:
						return "拼团";
					case 15:
						return "积分";
					default:
						return "其他";
				}
			}
		},
		onLoad(opt) {
			if (opt.cupboard) this.cupboard = true
			this.scrollHeight = uni.getSystemInfoSync().windowHeight
			this.statusList = [...this.statusList, ...selectOptions.goodsStatusList]
			this.$http("GET", url.store.getCategoryList).then(res =>{
				this.classList = this.classList.concat(res.data)
			})
			let goodsTypeList = JSON.parse(JSON.stringify(selectOptions.goodsTypeList))
			goodsTypeList.splice(2, 1)
			this.typeList = [...this.typeList, ...goodsTypeList]
			if (opt.status) {
				this.statusList.forEach((v, i) => {
					if (v.value === parseInt(opt.status)){
						this.statusIndex = i
						return
					}
				})
			}
		},
		onShow() {
			this.onConfirm()
		},
		onPullDownRefresh() {
			this.onConfirm()
		},
		onNavigationBarButtonTap(){
			this.$refs.drawer.open()
		},
		onReachBottom() {
			this.getList()
		},
		methods:{
			getList(){
				let params = {
					pageNum: this.list.length,
					keyName: this.keyName,
					status: this.statusList[this.statusIndex].value,
					storeCategoryId: this.classList[this.classIndex].id,
					storeRecommendStatus: this.recommendList[this.recommendIndex].value,
					isNewProducts: this.newProductsList[this.newProductsIndex].value,
					goodsType: this.typeList[this.typeIndex].value
				}
				this.$http("GET", url.store.getGoodsList, params).then(res =>{
					this.list = this.list.concat(res.data)
					this.loading = res.data.length < 12 ? "nomore" : "more"
					uni.stopPullDownRefresh()
				})
			},
			selectCupboard(item){
				if (!this.cupboard) return
				if (item.status !== 1) {
					return this.$msg("橱柜展示只能选择上架成功的商品～")
				}
				let cupboardItem = item
				let pages = getCurrentPages();
				let beforePage = pages[pages.length - 2];
				let list = beforePage.$vm.list
				let listIds = list.map(v =>{
					return v.id
				})
				if (listIds.includes(item.id)) {
					return this.$msg("该商品已存在橱柜中～")
				}
				if (list.length === 3) {
					return this.$msg("橱柜最多只能展示三个～")
				}
				beforePage.$vm.list.push(item)
				let cupboardGoodsIds = list.map(v => {
					return v.id
				})
				this.$http("POST", url.store.updateCupboardIds, {cupboardIds: cupboardGoodsIds.join(",")}).then(res =>{
					this.$navigateBack()
				}).catch(()=>{
					beforePage.$vm.list.pop()
				})
			},
			switchChange(e, row, index, name){
				// status 1=上架/4=下架
				// storeRecommendStatus 店铺推荐 1=无/2=推荐
				// boutiqueBuyingStatus 精品推荐 1=开启/2=关闭
				let path = url.store.updateGoodsStatus
				let status = e.detail.value ? 1 : 4
				let params = {
					goodsId: row.id,
				}
				if (name === 'storeRecommendStatus') {
					status = e.detail.value ? 2 : 1
					path = url.store.updateRecommendStatus
				} else if (name === 'boutiqueBuyingStatus'){
					status = e.detail.value ? 1 : 2
					path = url.store.updateGoodsBuyingStatus
				}
				params[name] = status
				this.$http("POST", path, params).then(res =>{
					this.$msg(res.data)
					this.list[index][name] = status
					this.$forceUpdate()
				})
			},
			onEdit(row){
				this.$navigateTo("add?id="+row.id)
			},
			onConfirm(){
				this.list = []
				this.getList()
			},
			tabsSelect(name, i){
				this[name+"Index"] = i
				this[name+"List"].map(v =>{
					v.select = false
				})
				this[name+"List"][i].select = true
				this.$forceUpdate()
			},
			onReset(){
				this.list = []
				this.keyName = ""
				this.statusIndex = 0
				this.classIndex = 0
				this.recommendIndex = 0
				this.newProductsIndex = 0
				this.typeIndex = 0
				this.getList()
			},
			onSave(){
				this.$refs.drawer.close()
				this.onConfirm()
			}
		}
	}
</script>

<style scoped lang="scss">
	.header{
		margin: 30rpx 0;
		.search{
			width: 600rpx;
			background-color: #eff1f8;
			height: 80rpx;
			border-radius: 50rpx;
			padding: 0rpx 20rpx;
			.icon{
				font-size: 48rpx;
				margin-right: 10rpx;
				color: #b2b6bb;
			}
			.del{
				margin-left: 10rpx;
				color: #999999;
			}
		}
	}
	.list{
		&-item{
			margin-bottom: 20rpx;
			background-color: white;
			padding: 30rpx;
			.title{
				border-bottom: 2rpx solid #EEEEEE;
				padding-bottom: 20rpx;
				margin-bottom: 20rpx;
			}
			.img{
				width: 140rpx;
				height: 140rpx;
				margin-right: 20rpx;
			}
			.mar{
				margin: 8rpx 0;
				display: block;
			}
			
			.bom{
				border-top: 2rpx solid #EEEEEE;
				padding-top: 20rpx;
				margin-top: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.btn{
					color: #381895;
					font-size: 28rpx;
					border: 2rpx solid #381895;
					border-radius: 30rpx;
					padding: 10rpx 30rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.drawer{
		padding: 0 30rpx;
		.title{
			font-size: 32rpx;
			margin-top: 50rpx;
			margin-bottom: 20rpx;
		}
		.grid{
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin-bottom: 30rpx;
			&-item{
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				width: 200rpx;
				height: 70rpx;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				background-color: #f3f4f3;
				color: #87878b;
			}
			.active{
				background-color: rgba($color: #381895, $alpha: .3);
				color: #381895;
			}
		}
		.btns{
			margin-top: 80rpx;
			padding-bottom: 40rpx;
			.btn{
				width: 45%;
				background-color: #f3f4f3;
				color: #87878b;
				font-size: 32rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
			}
			.right{
				background-color: rgba($color: #381895, $alpha: .3);
				color: #381895;
			}
		}
	}
</style>
