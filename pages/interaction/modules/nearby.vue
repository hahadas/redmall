<template>
	<view style="height: 100%;">
		<HMfilterDropdown
			:filterData="twoFilter" 
			:defaultSelected ="twoDropdownIndex" 
			@confirm="twoFilterConfirm">
		</HMfilterDropdown>
		<you-scroll
			@onPullDown="refresh"
			@onLoadMore="loadData">
			<view class="list">
				<block v-for="(item, i) in penpleNearbyList" :key="i">
					<view class="list-grid" @tap.stop="viewUser(item)">
						<image :src="filterImg(item.headPortrait, 1)" lazy-load mode="aspectFill" class="img"></image>
						<view class="six" :class="{'woman':item.gender === 3}">
							<text class="iconfont icon" v-if="item.gender === 2">&#xe621;</text>
							<text class="iconfont icon" v-if="item.gender === 3">&#xe622;</text>
							<text class="txt">{{item.age||0}}</text>
						</view>
						<view class="con">
							<text class="name line">{{item.nickname}}</text>
							<view class="flex flex-between">
								<text class="signature line">{{item.constellation}}</text>
								<text class="font28 color-b6">{{item.distance | distance}}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
			<uni-load-more :status="loading"></uni-load-more>
		</you-scroll>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import url from "@/common/http/url.js"
	import filter from "./filter.js"
	import mix from "./mix.js"
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue';
	import youScroll from '@/components/you-scroll'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default{
		mixins:[mix],
		components:{
			HMfilterDropdown, youScroll, uniLoadMore
		},
		props:["wordKey"],
		data(){
			return {
				twoFilter: filter.twoFilter,
				twoDropdownIndex: null,
				twoDropdownValue: null,
				penpleNearbyList: [],
				loading: "loading",
				keyWord: "",
				oldKeyWord: ""
			}
		},
		computed:{
			...mapState(["userInfo", "interactionOnlineStatus"])
		},
		watch:{
			wordKey(val){
				this.keyWord = val
			}
		},
		methods:{
			async loadData(done){
				this.loading = "loading"
				if (this.oldKeyWord !== this.keyWord){
					this.penpleNearbyList = []
				}
				let params = {
					lng: this.myAddressData.longitude,
					lat: this.myAddressData.latitude,
					gender: this.twoDropdownValue?(this.twoDropdownValue[0][0]||0):0,
					ageRange: this.twoDropdownValue?(this.twoDropdownValue[1][0]||0):"0",
					pageNum: this.penpleNearbyList.length,
					wordKey: this.keyWord
				}
				this.oldKeyWord = this.keyWord
				console.log("params....", params)
				let res = await this.$http('get', url.interaction.storeUmsList, params)
				let list = res.data
				this.penpleNearbyList = [...this.penpleNearbyList ,...list];
				this.loading = res.data.length < 12 ? 'nomore' : 'more'
				if (typeof done === "function") done()
			},
			filterSendMsg(toImAccount, index){
				return {
					from: this.userInfo.imAccount,
					to: toImAccount,
					cmd:11,
					chatType: 2,
					msgType: 88,
					content: JSON.stringify({index: index, type: "nearby"})
				}
			},
			twoFilterConfirm(e){
				this.twoDropdownIndex = e.index
				this.twoDropdownValue = e.value
				this.penpleNearbyList = []
				this.loadData()
			},
			refresh(done){
				this.penpleNearbyList = []
				this.loadData(done)
			}
		}
	}
</script>

<style scoped lang="scss">
	.woman{
		.icon{
			color: #ff4d94 !important;
		}
	}
	.list{
		padding: 0 10rpx;
		margin-top: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		&-grid{
			width: 360rpx;
			height: 450rpx;
			border-radius: 16rpx;
			display: flex;
			flex-direction: column;
			margin-bottom: 10rpx;
			border: 2rpx solid #EEEEEE;
			position: relative;
			.img{
				width: 100%;
				height: 400rpx;
				border-radius: 16rpx 16rpx 0 0;
				vertical-align: bottom;
			}
			.six{
				display: flex;
				align-items: center;
				border-radius: 20rpx;
				background-color: rgba($color: #000000, $alpha: .5);
				padding: 0 16rpx;
				position: absolute;
				right: 10rpx;
				top: 10rpx;
				.icon{
					font-size: 26rpx;
					margin-top: 2rpx;
					color: #1995fc;
					margin-right: 10rpx;
					margin-top: -4rpx;
				}
				.txt{
					font-size: 24rpx;
					color: white;
				}
			}
			.online{
				right: auto;
				left: 10rpx;
				.yuan{
					font-size: 20rpx;
					color: #13BB24;
					transform: scale(.6);
					margin-right: 4rpx;
				}
				.grey{
					color: #a6a4b4;
				}
			}
			.con{
				border-radius: 0 0 20rpx 20rpx;
				background: #FFFFFF;
				padding: 5rpx 20rpx 10rpx;
				color: #333333;
				.name{
					margin-bottom: 10rpx;
					font-size: 30rpx;
					width: 300rpx;
				}
				.addr{
					width: 100%;
					display: block;
					font-size: 26rpx;
					margin-top: 4rpx;
				}
			}
		}
		.signature{
			font-size: 26rpx;
			width: 310rpx;
		}
	}
</style>
