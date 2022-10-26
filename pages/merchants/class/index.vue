<template>
	<view class="main">
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" @tap="jumpTo(item)">
				<text class="name">{{item.name}}</text>
				<view class="flex flex-align-center">
					<text class="edit" @tap.stop="onEdit(item)">编辑</text>
					<text class="del" @tap.stop="onDel(item)">删除</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default{
		components:{
			uniLoadMore
		},
		data(){
			return {
				loading: "loading",
				list: [],
				isSelect: false
			}
		},
		onLoad(opt) {
			if (opt.select) this.isSelect = true
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList(){
				this.$http("GET", url.store.getCategoryList).then(res =>{
					this.list = res.data
					this.loading = "nomore"
				})
			},
			onDel(row){
				if (row.goodsNumber > 0) {
					return this.$msg("当前分类有关联商品，请先去除相关商品分类后再删除此分类")
				}
				this.$http("POST", url.store.delCategory, {id: row.id}).then(res=>{
					this.$msg(res.data)
					this.getList()
				})
			},
			onEdit(row){
				uni.setStorageSync("classDetail", row)
				this.$navigateTo("add?isEdit=true")
			},
			jumpTo(row){
				if (this.isSelect) {
					let pages = getCurrentPages(); //当前页面栈  
					let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
					beforePage.$vm.classObj = row;
					this.$navigateBack()
				}
			}
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("add")
		}
	}
</script>

<style scoped lang="scss">
	.main{
		background-color: white;
		min-height: 100vh;
	}
	.list{
		&-item{
			height: 100rpx;
			border-bottom: 2rpx solid #EEEEEE;
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.name{
				color: #555555;
				font-size: 34rpx;
			}
			.edit{
				border-right: 2rpx solid #EEEEEE;
				padding: 20rpx;
				margin-right: 20rpx;
				display: inline-block;
				color: #999999;
			}
			.del{
				color: #999999;
				// font-size: 34rpx;
			}
		}
		// &-item{
		// 	border: none;
		// }
	}
</style>
