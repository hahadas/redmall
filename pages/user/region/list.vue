<template>
	<view>
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="flex flex-between title">
					<text class="font28">代理区域：{{item.adcode | filterCode}}</text>
					<text class="font28">{{item.areaReward}}%</text>
				</view>
				<view class="goods flex flex-align-center">
					<view class="goods-img" @click="jumpTo(item.userInfo.imAccount)">
						<image :src="filterImg(item.userInfo.headPortrait)" mode="" class="img"></image>
					</view>
					<view class="flex flex-column font28 color-b3">
						<view class="flex flex-align-center">
							<text class="line">昵称：{{item.userInfo.nickname}}</text>
							<text class="iconfont icon" style="color: #1995fc;" v-if="item.userInfo.gender === 2">&#xe621;</text>
							<text class="iconfont icon" style="color: #ff4d94;" v-if="item.userInfo.gender === 3">&#xe622;</text>
						</view>
						<text class="">账号：{{item.userInfo.mobile}}</text>
					</view>
				</view>
				<view class="flex flex-column mar">
					<text>累计收入金额：¥{{item.cumulativeEnter}}</text>
					<text>成为代理时间：{{item.createTime}}</text>
				</view>
				<view class="btns">
					<text class="btn base" @click="openPopup(item, 'edit')">编辑</text>
					<text class="btn base" @click="openPopup(item, 'del')">删除</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		
		</uni-popup>
		
		<!-- 删除modal -->
		<uni-popup ref="popup" type="bottom">
			<view class="popup">
				<text class="title" v-if="type === 'del'">删除代理</text>
				<text class="title" v-else>编辑代理</text>
				<view class="form" v-if="type === 'edit'">
					<text>分润比例</text>
					<input type="number" v-model="number" placeholder="请输入" class="flex-wrap color-b6 flex-1" style="margin-left: 20rpx;">
				</view>
				<view class="form">
					<text>登入密码</text>
					<input type="password" v-model="password" placeholder="请输入" class="flex-wrap color-b6 flex-1" style="margin-left: 20rpx;">
				</view>
				<view class="flex flex-align-center flex-space-around">
					<button type="default" class="btn" @click="closePopup">取消</button>
					<button type="primary" :disabled="btnLoading" :loading="btnLoading" class="btn bg-base" @click="onConfirm()">确认</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		data(){
			return {
				btnLoading: false,
				loadingType: "nomore",
				list: [],
				id: "",
				password: "",
				number: "",
				adCode: "",
				rsaKey: "",
				type: "",
			}
		},
		filters: {
			filterCode(val){
				if (!val) return
				let list = publics.getLngAndLatByCode(val)
				let name = list[list.length - 1].name
				return name
			}
		},
		async onLoad(opt) {
			this.adCode = opt.adCode
			let res = await this.$http("GET", url.login.getPublicKey)
			this.rsaKey = res.data
		},
		onShow() {
			this.getList()
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("add?adCode="+this.adCode)
		},
		onPullDownRefresh() {
			this.getList()
		},
		methods: {
			getList(){
				this.$http("GET", url.user.agentRegionList).then(res => {
					this.list = res.data
					uni.stopPullDownRefresh()
				})
			},
			async onConfirm(){
				let params = {
					agentId: this.id,
					loginPwd: await publics.passwordEncryption(this.rsaKey, this.password)
				}
				let path = null
				if (this.type === 'del') {
					if (!this.password) return this.$msg("请输入登入密码")
					path = url.user.delAgentRegion
				} else {
					params.areaReward = this.number
					path = url.user.updateAgentRegion
				}
				if (this.btnLoading) return
				this.btnLoading = true
				this.$http("POST", path, params).then(res =>{
					this.$msg(res.data)
					this.closePopup()
					this.btnLoading = false
					this.getList()
				}).catch(()=>{
					this.btnLoading = false
				})
			},
			openPopup(row, type){
				this.id = row.id
				this.type = type
				this.number = row.areaReward
				this.$refs.popup.open()
			},
			closePopup(){
				this.$refs.popup.close()
				this.password = ""
				this.number = ""
			},
			filterImg(img) {
				return publics.filterImgUrl(img, 1)
			},
			jumpTo(id){
				this.$navigateTo("/pages/interaction/user?userId="+id)
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		margin: 20rpx;
		&-item{
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			padding: 20rpx;
			background-color: white;
			.title{
				border-bottom: 2rpx solid #EEEEEE;
				padding-bottom: 20rpx;
			}
			.goods{
				margin-top: 20rpx;
				&-img{
					position: relative;
					margin-right: 20rpx;
					width: 100upx;
					height: 100upx;
					overflow: hidden;
					border-radius: 50%;
					.img{
						flex-shrink: 0;
						display: block;
						width: 100%;
						height: 100%;
					}
				}
				.icon{
					margin-bottom: 4rpx;
					margin-left: 8rpx;
				}
			}
			.mar{
				margin: 20rpx 0;
				color: #666666;
			}
			.btns{
				display: flex;
				justify-content: flex-end;
				.btn{
					margin-left: 10rpx;
					width: 160rpx;
					height: 60rpx;
					text-align: center;
					line-height: 60rpx;
					display: inline-block;
					border-radius: 50rpx;
					color: #666666;
					border: 2rpx solid #e9eae9;
					font-size: 26rpx;
				}
				.base{
					color: #381895;
					border: 2rpx solid #381895;
				}
			}
		}
	}
	.popup{
		background-color: white;
		border-radius: 20rpx 20rpx 0 0;
		padding: 20rpx;
		.title{
			display: block;
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
		}
		.form{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 40rpx;
			border-bottom: 2rpx solid #EEEEEE;
			padding-bottom: 20rpx;
			color: #333333;
		}
		.btn{
			width: 40%;
		}
	}
</style>
