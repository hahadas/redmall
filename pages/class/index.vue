<template>
	<view class="category">
		<view class="category-wrapper" v-if="oneList.length>0">
			<!-- 左边导航 -->
			<scroll-view :style="{height:swiperHeight+'px'}" scroll-y="true" class="left-wrapper" scroll-with-animation="true" :scroll-top="left_scroll">
				<view class="left-content">
					<view 
						v-for="(title, index) in oneList" 
						:key="index"
						class="title-content" 
						:class="select_index === index ? 'onSelected' : ''" 
						@tap="choose(index)">
						{{ title.name }}
					</view>
				</view>
			</scroll-view>
			<!-- 右边内容 -->
			<scroll-view :style="{height:swiperHeight+'px'}" scroll-y="true" class="right-wrapper" scroll-with-animation="true" :scroll-top="right_scroll" @scroll="myscroll">
				<view class="right-content">
					<view class="product-wrapper">
						<block v-for="(a_item, a_index) in catrgoryList" :key="a_index">
							<view class="category-item" :id="'list-' + a_item.id" v-if="a_item.type === 1">
								<!-- banner区域 -->
								<view class="banner" v-if="a_item.mainImage">
									<image class="banner-img" :src="a_item.mainImage"></image>
								</view>
								<!-- 产品区 -->
								<block v-for="(b_item, b_index) in catrgoryList" :key="b_index">
									<block v-if="b_item.type === 2 && b_item.pid === a_item.id">
										<view class="flex flex-between" @click="twoJumpTo(a_item, b_item)">
											<text class="blod" style="padding-left: 30rpx;">{{b_item.name}}</text>
											<text class="iconfont color-9" style="padding-right: 30rpx;">&#xe770;</text>
										</view>
										<view class="category-content">
											<block v-for="(c_item, c_index) in catrgoryList" :key="c_index">
												<view class="product-item" v-if="c_item.type === 3 && c_item.pid === b_item.id" @click="jumpTo(c_item)">
													<image class="product-img" :src="c_item.mainImage"></image>
													<text class="product-title">{{c_item.name}}</text>
												</view>
											</block>
										</view>
									</block>
								</block>
							</view>
						</block>
					</view>
					<view style="width: 100%;height: 180upx;"></view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 弹框 -->
		<modal v-if="showModal">
			<image :src="advertData.ossUrl" mode="widthFix" @click="imgJump"></image>
			<text class="iconfont color-w font60" style="margin-top: 20rpx;" @click="showModal = false">&#xe64a;</text>
		</modal>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import publics from "@/common/utils/public.js"
	import empty from "@/components/empty.vue"
	import modal from "@/components/modal.vue"
	export default {
		components: { empty, modal },
		data() {
			return {
				swiperHeight: "900",
				windows_height: 0, //屏幕高度
				swiperList: [],
				catrgoryList: [],
				oneList: [],
				select_index: 0,
				right_height: [], //右侧每个内容的高度集合
				right_scroll: 0, //右侧的滑动值
				left_height: 0, //左侧总高度
				left_scroll: 0, //左侧滑动值
				last: 0,
				showModal: false,
				advertData: {}
			}
		},
		onLoad() {
			this.swiperHeight = uni.getSystemInfoSync().windowHeight
			this.windows_height = uni.getSystemInfoSync().windowHeight;
			this.init();
			// 广告弹框
			this.$http("GET", url.cms.advertisingMap, {position: 4}).then(res =>{
				if (res.data && res.data.length > 0) {
					this.advertData = res.data[0]
					if (this.advertData.popupMode === 2) {
						if (!publics.advertShowToStorage(this.advertData.id)) {
							this.showModal = true
						}
					} else {
						this.showModal = true
					}
				}
			})
		},
		onBackPress(){
			//隐藏到后台，不退出app
			let main = plus.android.runtimeMainActivity();
			main.moveTaskToBack(false);
			return true;
		},
		// 点击搜索时触发事件
		onNavigationBarSearchInputConfirmed(e){
			let value = e.text
			this.$navigateTo(`../home/productList?goodsName=${value}`)
		},
		methods: {
			init() {
				let _this = this
				this.oneList = []
				this.$http("GET", url.goods.getGoodsClass).then(res =>{
					this.catrgoryList = res.data
					res.data.map(v => {
						if (v.type === 1) {
							this.oneList.push(v)
						}
					})
					this.$nextTick(() => {
						setTimeout(()=>{
							_this.getHeightList()
						}, 500)
					})
					uni.stopPullDownRefresh();
					
				})
			},
			getHeightList() {
				let _this = this;
				let selectorQuery = uni.createSelectorQuery();
				selectorQuery.select('.left-content').boundingClientRect(function(rects) {
					_this.left_height = rects.height;
				});
				selectorQuery.selectAll('.category-item').boundingClientRect(function(rects) {
					_this.right_height = rects.map((item) => item.top-60);
				}).exec();
			},
			choose(index) {
				if (this.select_index === index) {
					return;
				}
				this.select_index = index;
				// 加入防抖
				if (this.timeout) {
					clearTimeout(this.timeout); //清除计时器				
				}
				this.timeout = setTimeout(() => {
					this.right_scroll = this.right_height[index];
				}, 300)
			}, 
			myscroll(e) {
				//引入节流	
				let right_content_height = e.detail.scrollHeight - this.windows_height;
				if (right_content_height == e.detail.scrollTop) {
					return;
				}
				let scroll_top = e.detail.scrollTop; //110是banner图的高度
				//判断当前的scrollTop在哪个区间内;
				let now = +new Date();
				if (now - this.last > 100) {		
					this.last = now;
					// let active_index = this.right_height.findIndex((value, index, arr) => value <= scroll_top && scroll_top < arr[index]);
					let active_index = this.right_height.findIndex((value, index, arr) => {
						let i = index + 1
						if (index === this.right_height.length - 1) {
							return this.right_height.length - 1
						} else {
							return value <= scroll_top && scroll_top < arr[index+1]
						}
					});
					let oldSelectIndex = this.select_index
					if (active_index < 0) {
						this.select_index = oldSelectIndex
					} else{
						this.select_index = active_index;
					}
					if (this.left_height - this.windows_height) {
						//如果有超出部分
						let diff = this.left_height - this.windows_height
						this.left_scroll = Math.round((active_index * diff) / (this.catrgoryList.length - 1))
					}
				}
			},
			twoJumpTo(pRow, row){
				this.$navigateTo("/pages/home/productClassList?pTitle="+pRow.name+"&&title="+row.name+"&&categoryTwoId="+row.id)
			},
			jumpTo(row){
				this.$navigateTo("/pages/home/productClassList?title="+row.name+"&&categoryThreeId="+row.id)
			},
			imgJump(){
				this.showModal = false
				this.$http("POST", url.cms.clickAdvertisingMap, {id: this.advertData.id})
				publics.advertOption(this.advertData.operationCode, this.advertData.operationValue)
			}
		}
	}
</script>

<style lang="less">
	.category {
		height: 100%;
		background-color: #FFFFFF;
		.tabs {
			justify-content: space-around;
			align-items: center;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 9999;
			background-color: #FFFFFF;
			.tab{
				padding: 10rpx 0;
				.icon{
					font-size: 48rpx;
					margin-right: 10rpx;
				}
				.name{
					font-size: 32rpx;
					color: #555;
				}
			}
			.active{
				border-bottom: 6rpx solid #381895;
				.name{
					color: #000;
					font-size: 34rpx;
					font-weight: bold;
				}
			}
		}
		.category-wrapper {
			// width: 100%;
			// display: flex;
			// flex-direction: row;
			// position: absolute;
			// top: 0;
			// bottom: 0;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: row;
			overflow-y: scroll;
			.left-wrapper {
				width: 200rpx;
				flex: 0 0 200rpx;
				background-color: #FFFFFF;

				.left-content {

					.title-content {
						width: 100%;
						height: 100rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 30rpx;
						cursor: pointer;

						&:last-child {
							// border-bottom: 0;
						}

						&.onSelected {
							background-color: #fff;
							position: relative;
							color: #381895;
							font-weight: bold;

							&::before {
								content: '';
								position: absolute;
								left: 0;
								top: 0;
								width: 5rpx;
								height: 100%;
								background: #381895;
							}
						}
					}
				}
			}

			.right-wrapper {
				flex: 1;
				height: 100%;
				.right-content {
					width: 100%;
					padding: 20rpx 0;
					// border-left: 1rpx solid #efefef;
					box-sizing: border-box;
					overflow-y: scroll;

					.product-wrapper {
						.category-item {
							.banner{
								width: 94%;
								height: 180upx;
								border-radius: 20upx;
								margin-left: 3%;
								margin-bottom: 30rpx;
								.banner-img{
									width: 100%;
									height: 180upx;
									border-radius: 20upx;
									overflow: hidden;
									box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.3);
								}
							}
							.category-title {
								height: 60rpx;
								font-size: 26rpx;
								line-height: 60rpx;
								font-weight: 500;
								background-color: #f6f6f6;
								padding-left: 20rpx;
								color: #000;
							}

							.category-content {
								display: flex;
								flex-direction: row;
								flex-flow: wrap;
								padding: 20rpx 20rpx 50rpx;
								.product-item {
									width: 33%;
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
									margin-bottom: 20rpx;

									.product-img {
										width: 150rpx;
										height: 150rpx;
										margin-bottom: 10rpx;
										border-radius: 10rpx;
										background-color: #f6f4f7;
									}

									.product-title {
										font-size: 28rpx;
										color: #777;
									}
								}
							}
						}
					}
				}
			}
		}

	}
</style>
