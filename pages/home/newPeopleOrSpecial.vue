<template>
	<view class="main">
		<image mode="widthFix" class="top" :src="staticUrl + 'home/class/' + type + '.png'"></image>
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i" @click="jumpTo(item)">
				<block v-if="item.goodsInfo">
					<view><image :src="item.goodsInfo.mainImage" mode="" class="img"></image></view>
					<view class="flex flex-column flex-wrap" style="width: 100%;">
						<text class="line">{{item.goodsInfo.titleName}}</text>
						<text class="font30 color-purple" style="margin-top: 10rpx;">¥{{item.goodsInfo.wholesalePrice}} {{type == 5 ? " - 赠"+(item.goodsInfo.bonusIntegral/100*item.goodsInfo.wholesalePrice).toFixed(2)+"积分":""}} - 已售{{item.goodsInfo.totalSales}}件</text>
						<view class="btn" v-if="type === 4">
							<text class="left">{{item.groupNumber}}人拼团</text>
							<text class="color-w flex-1">去拼团 ></text>
						</view>
						<view class="flex flex-between" style="margin-top: 20rpx;" v-else>
							<button type="primary" class="bg-base mar" size="mini">立即抢购</button>
							<block v-if="type === 2">
								<text class="font26 color-b6" v-if="item.time">距结束还剩 {{item.time}}</text>
								<text class="font26 color-b9" v-else>秒杀已结束</text>
							</block>
						</view>
					</view>
				</block>
			</view>
		</view>
		<uni-load-more color="#ffffff" :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default{
		components: { uniLoadMore },
		data(){
			return {
				staticUrl: this.$staticUrl,
				type: 1, // 1-新人大礼、2-限时秒杀、3-今日特价、4-拼团、5-积分大送
				loading: "nomore",
				list: []
			}
		},
		onLoad(opt) {
			this.type = opt.type ? parseInt(opt.type) : this.type
			uni.setNavigationBarTitle({
				title: opt.title
			})
			this.getList()
		},
		onPullDownRefresh() {
			this.list = []
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		onHide() {
			this.clear()
		},
		onUnload() {
			this.clear()
		},
		methods:{
			getList(){
				let params = {
					type: this.type,
					pageNum: this.list.length
				}
				this.$http("GET", url.goods.goodsByType, params).then(res =>{
					let list = res.data
					if (list && list.length > 0 && this.type === 2) { // 限时秒杀 倒计时
						list.map((v, i) => {
							/* this.countDownReturn(v, i) */
							v.time = this.countTime(v.dueDateTime);
						})
					}
					this.list = this.list.concat(list)
					this.loading = list.length < 12 ? 'nomore' : 'more'
					uni.stopPullDownRefresh()
				})
			},
			countTime(dueDateTime){
				let timeReplace = dueDateTime.replace(/\.|\-/g, '/')
				
				let startTime = new Date(); // 开始时间
				let endTime = new Date(timeReplace); // 结束时间
				let usedTime = endTime - startTime; // 相差的毫秒数
				let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
				let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
				let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
				let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
				let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
				
				let timer = days + '天' + hours + '时' + minutes + '分';
				console.log(timer)
				return timer;
			},
			countDownReturn(item, i){
				let _this = this
				this.countDown(item, time => {
					_this.list[i].time = time
					_this.$forceUpdate()
				})
			},
			countDown(item, callback){
				let time = null
				if (item.timer) {
					clearInterval(item.timer)
					item.timer = null
				}
				item.timer = setInterval(()=>{
					let timeReplace = item.dueDateTime.replace(/\.|\-/g, '/')
					let oldTime = new Date(timeReplace).getTime()
					let newTime = new Date().getTime()
					let result = parseInt(oldTime - newTime)
					if (result >= 0) {
						// let d = Math.floor(leftTime/1000/60/60/24);
						let h = Math.floor(result/1000/60/60%24);
						let m = Math.floor(result/1000/60%60);
						let s = Math.floor(result/1000%60);  
						function checkTime(i){
						    if (i<10) {
						        i = "0"+i;
						    }
						    return i;
						}
						h = checkTime(h)
						m = checkTime(m)
						s = checkTime(s)
						time = `${h}:${m}:${s}`
					} else {
						clearInterval(item.timer)
						item.timer = null
						time = null
					}
					callback(time)
				}, 1000)
			},
			clear(){
				this.list.map(v =>{
					if (v.timer){
						clearInterval(v.timer)
						v.timer = null
						v.time = null
					}
				})
			},
			jumpTo(row){
				this.$navigateTo('details?id='+row.goodsId)
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		background-color: #865afd;
		min-height: 100vh;
		.top{
			width: 100%;
		}
		.list{
			margin: 0 20rpx;
			&-item{
				background-color: white;
				border-radius: 20rpx;
				padding: 20rpx;
				margin-bottom: 20rpx;
				display: flex;
				.img{
					width: 180rpx;
					height: 180rpx;
					border-radius: 16rpx;
					margin-right: 20rpx;
				}
				.btn{
					background: linear-gradient(to right, #381895 0%, #865afd 100%);
					border-radius: 10rpx;
					padding: 16rpx;
					font-size: 24rpx;
					display: flex;
					margin-top: 10rpx;
					.left{
						color: #b9a1fe;
						width: 65%;
						text-align: center;
					}
				}
				.mar{
					margin: 0;
				}
			}
		}
	}
</style>
