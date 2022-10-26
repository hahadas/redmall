<template>
	<view class="content">
		<view class="wrap bg-w">
			<view class="box">
				<view class="box_left">名称:</view>
				<view class="box_right">
					<input type="text" v-model="form.titleName" :maxlength="20" placeholder-class="placeholder" placeholder="优惠券名称" />
				</view>
			</view>
			<view class="box">
				<view class="box_left">金额:</view>
				<view class="box_right">
					<input type="number" v-model="form.discountAmount" placeholder-class="placeholder" placeholder="优惠券金额" />
				</view>
			</view>
			<view class="box">
				<view class="box_left">数量:</view>
				<view class="box_right">
					<switch color="#381895" :checked="numberChecked" style="transform:scale(0.8)" @change="switchBtn($event, 'numberChecked')" />
					<text>不限制</text>
				</view>
			</view>
			<view class="box" v-if="!numberChecked">
				<view class="box_right">
					<input type="number" v-model="form.number" placeholder-class="placeholder" placeholder="请输入优惠券数量" />
				</view>
			</view>
			<view class="box">
				<view class="box_left">有效期:</view>
				<view class="box_right">
					<switch color="#381895" :checked="timeChecked" style="transform:scale(0.8)" @change="switchBtn($event, 'timeChecked')" />
					<text>永久有效</text>
				</view>
			</view>
			<view class="box" v-if="!timeChecked">
				<view class="box_right">
					<input type="number" v-model="form.expireTimeDay" placeholder-class="placeholder" placeholder="有效期(最长90天)" />
				</view>
			</view>
			<view class="box">
				<view class="box_left">重复领取:</view>
				<view class="box_right">
					<switch color="#381895" :checked="form.repeatedCollectionStatus === 2" style="transform:scale(0.8)" @change="switchBtn($event, 'repeatedCollectionStatus')" />
				</view>
			</view>
			<view class="box">
				<view class="box_left">使用标准:</view>
				<view class="box_right">
					<input type="number" v-model="form.useStandardAmount" placeholder-class="placeholder" placeholder="如100，买满100可用此优惠券抵扣" />
				</view>
			</view>
			<view class="box bor-no">
				<view class="box_left">状态:</view>
				<view class="box_right">
					<switch color="#381895" :checked="form.status === 1" style="transform:scale(0.8)" @change="switchBtn($event, 'status')" />
				</view>
			</view>
		</view>
		
		<button class="btn bg-base" :loading="loading" :disabled="loading" @click="submit">保存</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default{
		data(){
			return {
				loading: false,
				form: {
					status: 1,
					repeatedCollectionStatus: 1
				},
				numberChecked: true, // 数量不限制
				timeChecked: true, // 有效期
			}
		},
		onLoad(option) {
			let title = '新增优惠券';
			if (option.id) {
				title = '编辑优惠券';
				this.$http("GET", url.store.getDiscountInfoById, {discountId: option.id}).then(res =>{
					this.form = res.data
					if (res.data.number > 0) {
						this.numberChecked = false
					}
					if (res.data.expireTimeDay > 0){
						this.timeChecked = false
					}
					delete this.form.createTime
				})
			}
			uni.setNavigationBarTitle({
				title: title
			});
		},
		methods:{
			submit() {
				this.loading = true
				if (this.numberChecked) {
					this.form.number = -1
				}
				if (this.timeChecked){
					this.form.expireTimeDay = -1
				}
				let path = url.store.addDiscount
				if (this.form.id) {
					path = url.store.updateDiscount
				}
				this.$http("POST", path, this.form).then(res =>{
					this.$msg(res.data)
					this.$navigateBack(1, 500)
				}).catch(()=>{
					this.loading = false
				})
			},
			switchBtn(e, name) {
				let value = e.detail.value
				if (name === "repeatedCollectionStatus") { // 重复领取
					this.form[name] = value ? 2 : 1
				} else if (name === "status"){ // 状态
					this.form[name] = value ? 1 : 2
				} else { // 数量，有效期
					this[name] = value
				}
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		font-size: 28upx;
		color: #676769;
		min-height: 100vh;
		padding: 20rpx;
	}
	.wrap{
		padding: 20rpx;
		border-radius: 20rpx;
	}
	.box {
		height: 100upx;
		display: flex;
		align-items: center;
		border-bottom: 1upx solid #EEEEEE;
	}
	.placeholder{
		font-size: 32rpx;
		color: #c3c1c4;
	}
	.box_left {
		width: 25%;
		display: flex;
		align-items: center;
		font-size: 32rpx;
	}
	.box_left_two {
		width: 550upx;
		font-size: 32rpx;
	}
	.box_right {
		// width: 70%;
		display: flex;
		flex-grow: 1;
		align-items: center;
	}
	.box_right_right {
		width: 70%;
		height: 80upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-grow: 1;
		// padding-left: 3%;
	}
	.box_right_right input {
		width: 87%;
		height: 70upx;
		line-height: 70upx;
	}
	.box_right_right image {
		width: 60upx;
		height: 60upx;
		margin-left: 20rpx;
	}
	.box_right_two {
		width: 160upx;
		text-align: right;
	}
	
	.box_right input {
		width: 97%;
		height: 80upx;
		// padding-left: 3%;
		background-color: #ffffff;
	}
	.btn {
		width: 690upx;
		height: 90upx;
		line-height: 90upx;
		color: #ffffff;
		font-size: 32upx;
		margin-top: 120upx;
		border-radius: 50rpx;
	}
	.citybtn {
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		overflow: hidden;
	}
</style>
