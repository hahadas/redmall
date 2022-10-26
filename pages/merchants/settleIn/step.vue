<template>
	<view class="flex flex-column flex-center">
		<image src="/static/merchants/top.png" mode="widthFix" class="top" @click="onClick()"></image>
		<view class="con">
			<view class="tabs bg-w">
				<text class="font30" :class="[current === i?'color-purple':'color-b5']" v-for="(item, i) in tabs" @click="current = i">{{item}}</text>
			</view>
			<view class="about" v-if="current === 0">
				<view class="about-item">
					<image src="/static/merchants/introduce1.png" mode="widthFix"></image>
					<!-- <text class="name">喝酒么APP通过大量的广告宣传，吸引了大量用户。</text> -->
				</view>
				<view class="about-item">
					<image src="/static/merchants/introduce2.png" mode="widthFix"></image>
					<!-- <text class="name">品牌代理为客户配送，粘性高，销售量增加，收益上升。</text> -->
				</view>
				<view class="about-item">
					<image src="/static/merchants/introduce3.png" mode="widthFix"></image>
					<!-- <text class="name">降低宣传成本，人工成本，销售成本。</text> -->
				</view>
			</view>
			<view class="procedure bg-w" v-if="current === 1">
				<view class="flex procedure-item">
					<text class="number">1</text>
					<view class="flex flex-column">
						<text class="title">填写资料</text>
						<text class="desc">填写地址信息，提交经营资质照片；</text>
						<text class="desc">填写联系方式，以及详细地址。</text>
					</view>
				</view>
				<view class="flex procedure-item">
					<text class="number">2</text>
					<view class="flex flex-column">
						<text class="title">等待审核</text>
						<text class="desc">审核时间为3～7个工作日；</text>
						<text class="desc">签约合同。</text>
					</view>
				</view>
				<view class="flex procedure-item">
					<text class="number">3</text>
					<view class="flex flex-column">
						<text class="title">店铺上线</text>
						<text class="desc">开通相关账号，店铺装修，上传产品。</text>
					</view>
				</view>
			</view>
			<view class="demand" v-if="current === 2">
				<view class="title">
					<image src="/static/merchants/attestation.png" mode="" class="icon"></image>
					<text>经营资质</text>
				</view>
				<text class="font28 color-b9">申请开店过程中，需要您提供符合国家法律规定的经营许可证照，包括但不限于营业执照，各类许可证，特许证件。 </text>
				<view class="title">
					<image src="/static/merchants/class.png" mode="" class="icon"></image>
					<text>品类范围</text>
				</view>
				<text class="font28 color-b9">喝酒么支持一下经营项目</text>
				<view class="flex wrap">
					<text class="name">1.酒水饮料</text>
					<text class="name">2.服装鞋帽</text>
					<text class="name">3.日用百货</text>
					<text class="name">4.农副产品</text>
					<text class="name">5.美妆日化</text>
					<text class="name">6.预包装食品</text>
					<text class="name">7.散装食品</text>
					<text class="name">8.办公用品</text>
				</view>
			</view>
		</view>
		<view class="bom">
			<button type="primary" class="bg-base btn" @click="onClick">立即入驻</button>
			<text class="font26 color-b9">
				入驻即表示同意喝酒么的<text class="color-purple" @click="jumpTo()">《商家入驻条款》</text>
			</text>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js";
	export default{
		data(){
			return {
				tabs: ["平台介绍", "入驻流程", "入驻要求"],
				current: 0,
				noticeId: 0
			}
		},
		onLoad() {
			this.$http("GET", url.common.privacyAgreement).then(res =>{
				if (res.data && res.data.length > 0) {
					res.data.forEach(v => {
						if (v.keyCode === "platform_privacy_agreement_store"){
							this.noticeId = v.keyValue
							return
						}
					})
				}
			})
		},
		methods:{
			onClick(){
				this.$navigateTo("index")
			},
			jumpTo(){
				this.$navigateTo("/pages/notice/agreement?id="+this.noticeId)
			}
		}
	}
</script>

<style scoped lang="scss">
	.top{
		width: 100%;
	}
	.con{
		width: 710rpx;
		margin-top: -60rpx;
		position: relative;
		.tabs{
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			height: 80rpx;
			margin-bottom: 20rpx;
		}
		.about{
			width: 100%;
			&-item{
				margin-bottom: 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				image{
					width: 100%;
				}
			}
		}
		.procedure{
			border-radius: 10rpx;
			padding: 40rpx 0rpx 40rpx 80rpx;
			&-item{
				margin-bottom: 40rpx;
				.number{
					width: 60rpx;
					height: 60rpx;
					text-align: center;
					line-height: 60rpx;
					color: white;
					background-color: #381895;
					border-radius: 50%;
					margin-right: 20rpx;
				}
				.title{
					margin-bottom: 10rpx;
				}
				.desc{
					font-size: 28rpx;
					color: #888888;
					line-height: 48rpx;
				}
			}
		}
		.demand{
			background-color: white;
			border-radius: 10rpx;
			padding: 20rpx 20rpx 80rpx 30rpx;
			.title{
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				margin-top: 40rpx;
				.icon{
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}
			}
			.wrap{
				flex-wrap: wrap;
				margin-top: 10rpx;
				.name{
					color: #999999;
					font-size: 28rpx;
					width: 25%;
					margin-bottom: 10rpx;
				}
			}
		}
	}
	.bom{
		width: 710rpx;
		margin: 50rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.btn{
			width: 100%;
			margin-bottom: 30rpx;
		}
	}
</style>
