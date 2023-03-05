<template>
	<view style="height: 100%;">
		<HMfilterDropdown
			:filterData="threeFilter" 
			:defaultSelected ="threeDropdownIndex" 
			@confirm="threeFilterConfirm">
		</HMfilterDropdown>
		<you-scroll
			@onPullDown="refresh"
			@onLoadMore="loadData">
			<view class="list">
				<block v-for="(item, i) in proxyList" :key="i">
					<view class="list-item" @tap="viewUser(item, 2)">
						<image :src="filterImg(item.headPortrait, 1)" lazy-load mode="aspectFill" class="avatar"></image>
						<text class="status" style="background-color: #0488a9;" v-if="item.distributorWorkStatus === 2">已开工</text>
						<text class="status" style="background-color: #ffa800;" v-else-if="item.distributorWorkStatus === 3">工作中</text>
						<text class="status" v-else>休息中</text>
						<view class="bom">
							<view class="bom-con">
								<view class="box">
									<view class="left">
										<text class="iconfont six" style="color: #1995fc;" v-if="item.gender === 2">&#xe621;</text>
										<text class="iconfont six" style="color: #ff4d94;" v-if="item.gender === 3">&#xe622;</text>
										<text class="name">{{item.nickname}}</text>
									</view>
									<text class="right">{{item.constellation}}/{{item.age||0}}岁</text>
								</view>
								<view class="box mar">
									<text class="right">评分：{{item.distributorScore || '-'}}</text>
									<text class="right">{{item.distance | distance}}</text>
								</view>
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
	import HMfilterDropdown from '../components/HM-filterDropdown/HM-filterDropdown.vue';
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
				threeFilter: filter.threeFilter,
				threeDropdownIndex: null,
				threeDropdownValue: null,
				proxyList: [],
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
					this.proxyList = []
				}
				let params = {
					lng: this.myAddressData.longitude,
					lat: this.myAddressData.latitude,
					status: this.threeDropdownValue?(this.threeDropdownValue[0][0]||0):0,
					gender: this.threeDropdownValue?(this.threeDropdownValue[1][0]||0):0,
					ageRange: this.threeDropdownValue?(this.threeDropdownValue[2][0]||0):0,
					pageNum: this.proxyList.length,
					wordKey: this.keyWord
				}
				this.oldKeyWord = this.keyWord
				
				let res = await this.$http('get', url.interaction.getAngelNearbyList, params)
				let list = res.data
				this.proxyList = [...this.proxyList ,...list];
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
					content: JSON.stringify({index: index, type: "angel"})
				}
			},
			threeFilterConfirm(e){
				console.log("threeDropdownValue.....", e.value)
				this.threeDropdownIndex = e.index
				this.threeDropdownValue = e.value
				this.proxyList = []
				this.loadData()
			},
			refresh(done){
				this.proxyList = []
				this.loadData(done)
			}
		}
	}
</script>

<style scoped lang="scss">
	.woman{
		background-color: #ff4d94 !important;
	}
	.list{
		padding: 0 10rpx;
		margin-top: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		&-item{
			width: 364rpx;
			height: 450rpx;
			border-radius: 16rpx;
			position: relative;
			margin-bottom: 10rpx;
			overflow: hidden;
			.avatar{
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 450rpx;
				border-radius: 16rpx;
				background-color: #161922;
			}
			.status {
				position: absolute;
				left: 0;
				top: 0;
				color: #FFFFFF;
				background-color: #7c7d7e;
				font-size: 26rpx;
				padding: 4rpx 16rpx;
				border-radius: 16rpx 26rpx 26rpx 0;
				display: block;
			}
			.online{
				display: flex;
				align-items: center;
				border-radius: 20rpx;
				background-color: rgba($color: #000000, $alpha: .5);
				padding: 0 16rpx;
				position: absolute;
				right: 10rpx;
				top: 10rpx;
				.yuan{
					font-size: 20rpx;
					color: #13BB24;
					transform: scale(.6);
					margin-right: 4rpx;
				}
				.grey{
					color: #a6a4b4;
				}
				.txt{
					font-size: 24rpx;
					color: white;
				}
			}
			.bom{
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				&-con{
					padding: 0 10rpx 10rpx;
					color: #FFFFFF;
					background: linear-gradient(to top, rgba($color: #000, $alpha: .8) 0%, rgba($color: #000, $alpha: .6) 33%, rgba($color: #000, $alpha: .3) 66%, rgba($color: #000, $alpha: 0) 100%);
					border-radius: 0rpx 0rpx 26rpx 26rpx;
					.box{
						margin-top: 10rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.left{
							display: flex;
							align-items: center;
							.six{
								color: #FFFFFF;
								margin-top: -4rpx;
								font-size: 26rpx;
								margin-right: 10rpx;
							}
							.name{
								font-size: 28rpx;
								width: 120rpx;
								overflow: hidden;
								text-overflow: ellipsis; 
								display: -webkit-box; 
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
							}
						}
						.right{
							font-size: 24rpx;
						}
						.text{
							font-size: 26rpx;
						}
						.score{
							display: flex;
							align-items: center;
							.icon{
								font-size: 46rpx;
								color: #ffc600;
								margin-right: -6rpx;
							}
						}
					}
					.mar{
						margin: 0;
					}
				}
			}
		}
		&-grid{
			width: 346rpx;
			height: 450rpx;
			border-radius: 16rpx;
			display: flex;
			flex-direction: column;
			margin-bottom: 16rpx;
			border: 2rpx solid #EEEEEE;
			.img{
				width: 100%;
				height: 400rpx;
				border-radius: 16rpx 16rpx 0 0;
				vertical-align: bottom;
			}
			.con{
				border-radius: 0 0 20rpx 20rpx;
				background: #F5F5F5;
				padding: 5rpx 20rpx 10rpx;
				color: #333333;
				.name{
					font-size: 30rpx;
					width: 300rpx;
					overflow: hidden;
					text-overflow: ellipsis; 
					display: -webkit-box; 
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}
				.six{
					margin-top:10rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.left{
						border-radius: 20rpx;
						background-color: #1995fc;
						display: flex;
						align-items: center;
						padding: 0 16rpx;
						.icon{
							font-size: 26rpx;
							margin-top: 2rpx;
							color: white;
							margin-right: 10rpx;
							margin-top: -4rpx;
						}
						.txt{
							font-size: 24rpx;
							color: white;
						}
					}
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
			overflow: hidden;
			text-overflow: ellipsis; 
			display: -webkit-box; 
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}
	}
</style>
