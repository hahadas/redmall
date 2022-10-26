<template>
	<view>
		<v-tabs
			v-model="current" 
			:tabs="tabs" 
			field="name" 
			height="90rpx" 
			fontSize="30rpx" 
			:fixed="true"
			:scroll="false"
			@change="changeTab">
		</v-tabs>
		<view class="list" v-if="list.length > 0">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="title">
					<text class="color-purple font32">¥{{item.amount}}</text>
					<text class="font30 color-purple" v-if="item.status === 1">处理中</text>
					<text class="font30 color-b9" v-if="item.status === 2">已核实</text>
					<text class="font30 color-red" v-if="item.status === 3">查询不到转账记录</text>
					<text class="font30 color-red" v-if="item.status === 4">金额错误</text>
				</view>
				<view class="con">
					<view class="cell">
						<text class="color-b6">汇款方式</text>
						<text>{{item.bankName}}({{item.account}})</text>
					</view>
					<view class="cell">
						<text class="color-b6">对方账户</text>
						<text>{{item.platformName}}({{item.platformAccount | filterAccount}})</text>
					</view>
					<view class="cell" v-if="item.remarks">
						<text class="color-b6">汇款备注</text>
						<text>{{item.remarks}}</text>
					</view>
					<view class="cell">
						<text class="color-b6">创建时间</text>
						<text>{{item.createTime | filterTime}}</text>
					</view>
					<view class="cell">
						<text class="color-b6">汇款凭证</text>
						<text class="color-purple" @click="viewImg(item, i)">查看</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import { timestampToTime } from "@/common/utils/index.js"
	export default{
		components: { uniLoadMore, vTabs },
		data(){
			return {
				current: 0,
				tabs: [
					{name: "全部", value: -1},
					{name: "处理中", value: 1},
					{name: "已核实", value: 2},
					{name: "审核失败", value: 3}
				],
				pageSize: 1,
				loading: "loading",
				list: []
			}
		},
		filters:{
			filterAccount(val){
				if (!val) return
				return val.substring(val.length - 4, val.length)
			},
			filterTime(val){
				return timestampToTime(val)
			}
		},
		onPullDownRefresh() {
			this.list = []
			this.pageSize = 1
			this.getList('refresh')
		},
		onReachBottom() {
			this.getList('add')
		},
		onLoad() {
			this.getList('add')
		},
		methods:{
			getList(type){
				if (type === 'add') {
					if (this.loading === 'nomore') {
						return;
					}
					this.loading = 'loading';
				} else {
					this.loading = 'more';
				}
				let params = {
					status: this.tabs[this.current].value,
					pageSize: this.pageSize
				}
				this.$http("GET", url.deposit.getVoucherList, params).then(res =>{
					this.list = this.list.concat(res.data.records)
					if(this.list.length < res.data.total){
						this.pageSize++;
						this.loading = "more"
					} else{
						this.loading = "nomore"
					}
					uni.stopPullDownRefresh();
				})
			},
			changeTab(i){
				this.current = i
				this.list = []
				this.pageSize = 1
				this.getList('refresh')
			},
			viewImg(row, i){
				if (!row.voucherImgList){
					uni.showLoading({
						mask:true
					})
					this.$http("GET", url.deposit.getVoucherDetail, {id: row.id}).then(res =>{
						uni.hideLoading()
						let voucherImgList = res.data.voucherImgList
						if (voucherImgList && voucherImgList.length > 0) {
							this.list[i].voucherImgList = voucherImgList
							this.previewImage(voucherImgList)
						} else {
							this.$msg("未上传汇款凭证")
						}
					}).catch((err)=>{
						uni.hideLoading()
					})
				} else {
					this.previewImage(row.voucherImgList)
				}
			},
			previewImage(urls){
				uni.previewImage({
					urls:urls
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		margin: 20rpx;
		&-item{
			background-color: white;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			.title{
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2rpx solid #EEEEEE;
				padding: 20rpx 16rpx;
			}
			.con{
				padding: 10rpx 16rpx;
				.cell{
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 30rpx;
				}
			}
		}
	}
</style>
