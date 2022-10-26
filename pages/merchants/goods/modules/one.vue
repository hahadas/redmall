<template>
	<view>
		<view class="list">
			<view class="list-item">
				<text class="label">
					<text class="color-red">*</text>
					商品标题：
				</text>
				<input type="text" placeholder="必填" v-model="form.titleName" class="flex-grow input">
			</view>
			<view class="list-item">
				<text class="label">
					<text class="color-w">*</text>
					商品编号：
				</text>
				<input type="text" placeholder="选填" v-model="form.goodsNumber" class="flex-grow input">
			</view>
			<view class="list-item">
				<text class="label">
					<text class="color-red">*</text>
					零售价格：
				</text>
				<input type="number" placeholder="0" v-model="form.wholesalePrice" class="flex-grow input">
			</view>
			<view class="list-item">
				<text class="label">
					<text class="color-red">*</text>
					平台分类：
				</text>
				<view class="flex flex-align-center color-b9" @click="visible = true">
					<text>{{className||"请选择"}}</text>
					<text class="iconfont font40">&#xe770;</text>
				</view>
			</view>
			<view class="list-item">
				<text class="label">
					<text class="color-red">*</text>
					商品分类：
				</text>
				<view class="flex flex-align-center color-b9" @click="selectClass">
					<text>{{classData.name || "请选择"}}</text>
					<text class="iconfont font40">&#xe770;</text>
				</view>
			</view>
			<view class="list-item">
				<text class="label">
					<text class="color-w">*</text>
					是否新品：
				</text>
				<switch color="#381895" :checked="form.isNewProducts === 2 ?true:false" @change="switchChange($event, 'isNewProducts')" class="switch" />
			</view>
			<view class="list-item">
				<text class="label">
					<text class="color-w">*</text>
					商品类型：
				</text>
				<picker class="flex-grow flex flex-space-end" mode="selector" range-key="name" :value="goodsTypeIndex" :range="goodsTypeList" @change="pickerChange">
					<view class="flex flex-align-center color-b9">
						<text v-if="goodsTypeList.length > 0">{{goodsTypeList[goodsTypeIndex].name}}</text>
						<text class="iconfont font40">&#xe770;</text>
					</view>
				</picker>
			</view>
			<!-- 商品类型为精品商品时不显示 -->
			<block v-if="goodsTypeIndex !== 1">
				<view class="list-item">
					<text>
						<text class="color-red">*</text>
						积分赠送比例：
					</text>
					<input type="number" placeholder="必填" :maxlength="4" v-model="form.bonusIntegral" class="flex-grow input">
				</view>
				<view class="list-item">
					<text>
						<text class="color-red">*</text>
						商品分润比例：
					</text>
					<input type="number" placeholder="必填" :maxlength="4" v-model="form.bonusProfit" style="width: 200rpx;" class="flex-grow input">
					<text class="font26 color-b9">最低：{{profit}}</text>
				</view>
			</block>
			<!-- 普通商品 -->
			<block v-if="goodsTypeIndex === 0">
				<view class="list-item">
					<text class="label">
						<text class="color-w">*</text>
						组合支付：
					</text>
					<switch color="#381895" :checked="form.paymentCombination === 1 ?true:false" @change="switchChange($event, 'paymentCombination')" class="switch" />
				</view>
				<view class="list-item bor-no" v-if="form.paymentCombination === 1">
					<block>
						<text style="width: 160rpx;">
							人民币：
						</text>
						<input type="number" :maxlength="3" placeholder="%" @input="onInput" v-model="form.paymentRmb" class="input" style="width: 200rpx;">
					</block>
					<block>
						<text style="width: 160rpx;">
							积分：
						</text>
						<input type="number" :maxlength="3" placeholder="自动计算" disabled v-model="form.paymentIntegral" class="input" style="width: 200rpx;">
					</block>
				</view>
			</block>
			<!-- 精品商品 -->
			<view class="list-item bor-no" v-if="goodsTypeIndex === 1">
				<text>
					<text class="color-red">*</text>
					进货实付比例：
				</text>
				<input type="number" placeholder="必填" :maxlength="3" v-model="form.boutiqueBuying" class="flex-grow input">
			</view>
			<!-- 限时秒杀 -->
			<view class="list-item bor-no" v-if="goodsTypeIndex === 3">
				<text>
					<text class="color-red">*</text>
					结束时间：
				</text>
				<view class="flex flex-grow flex-space-end" @click="timeVisible = true">
					<view class="flex flex-align-center color-b9">
						<text>{{endTime || "请选择"}}</text>
						<text class="iconfont font40">&#xe770;</text>
					</view>
				</view>
			</view>
			<!-- 拼团 -->
			<view class="list-item bor-no" v-if="goodsTypeIndex === 5">
				<text>
					<text class="color-red">*</text>
					拼团人数：
				</text>
				<input type="number" placeholder="2人起,最多10人" :maxlength="2" v-model="form.groupNumber" class="flex-grow input">
			</view>
		</view>
		<view class="btn">
			<button type="primary" class="bg-base item" @click="next">下一步，填写商品规格</button>
		</view>
		
		<!-- 分类 -->
		<w-picker
			:visible.sync="visible"
			ref="mpvueCityPicker"
			mode="linkage"
			:level="3"
			:options="newClassList"
			@confirm="onConfirm"
			themeColor="#3a2397"
			:default-props="{label:'name',value:'id',children:'children'}"
		></w-picker>
		
		<!-- 秒杀到期时间 -->
		<w-picker
			:visible.sync="timeVisible"
			mode="date" 
			:value="endTime"
			:current="true"
			fields="minute"
			@confirm="endTimeConfirm($event)"
			:disabled-after="false"
			themeColor="#3a2397"
			ref="date" 
		></w-picker>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import imToods from "@/common/im/imTools.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	import wPicker from "@/components/w-picker/w-picker.vue"
	export default{
		components: { wPicker },
		props:{
			form: {
				default: {}
			},
			classData: {
				default: {}
			}
		},
		data(){
			return {
				timeVisible: false,
				visible: false,
				classList: [],
				newClassList: [],
				className: "",
				profit: 0,
				goodsTypeList: [],
				goodsTypeIndex: 0,
				endTime: ""
			}
		},
		mounted() {
			// 初始化商品类型
			let goodsTypeList = JSON.parse(JSON.stringify(selectOptions.goodsTypeList))
			goodsTypeList.splice(2, 1)
			this.goodsTypeList = goodsTypeList
			
			this.$http("GET", url.goods.getGoodsClass).then(res =>{
				this.classList = res.data
				let newClassList = filterArray(res.data, 0)
				this.newClassList = newClassList
				if (this.form.categoryThreeId) {
					this.classList.map(v=>{
						if (v.id === this.form.categoryThreeId) {
							this.className = v.name
						}
					})
				}
			})
			// 获取分润比例
			this.$http("GET", url.store.minBonusProfit).then(res=>{
				this.profit = res.data
			})
		},
		methods:{
			onConfirm(e){
				console.log(e)
				this.form.categoryOneId = e.value[0]
				this.form.categoryTwoId = e.value[1]
				this.form.categoryThreeId = e.value[2]
				this.className = e.obj.col3.name
			},
			endTimeConfirm(e){
				console.log(e)
				this.endTime = e.result
				this.form.dueDateTime = imToods.dateTimeToTimeStamp(e.value) * 1000
			},
			switchChange(e, name){
				let value = e.detail.value ? 1 : 2
				if (name === "isNewProducts") { // 是否是新品，1=不是，2=是
					value = e.detail.value ? 2 : 1
				}
				this.form[name] = value
				this.$forceUpdate()
			},
			onInput(e){
				console.log("....e...", e.detail.value)
				let number = Number(e.detail.value)
				console.log("。。。number...", number)
				if (number > 100) {
					number = 100
					this.form.paymentRmb = "100"
				}
				this.form.paymentIntegral = 100 - number
				this.$forceUpdate()
			},
			pickerChange(e){
				this.goodsTypeIndex = e.detail.value
				this.form.goodsType = this.goodsTypeList[this.goodsTypeIndex].value
				// 精品商品时默认勾选平台配送
				this.form.deliveryPlatform = this.form.goodsType === 2 ? 1 : 2
				this.$emit("edit", this.form)
			},
			selectClass(){
				this.$navigateTo("/pages/merchants/class/index?select=true")
			},
			next(){
				this.$emit("next", this.form)
			}
		}
	}
	
	function filterArray(data, pid) {
		var tree = [];
		var temp;
		for (var i = 0; i < data.length; i++) {
			if (data[i].pid === pid) {
				var obj = data[i];
				temp = filterArray(data, data[i].id);
				if (temp.length > 0) {
					obj.children = temp;
				} else {
					obj.children = []
				}
				tree.push(obj);
			}
		}
		return tree;
	}
</script>

<style scoped lang="scss">
	.list{
		border-radius: 10rpx;
		background-color: #FFFFFF;
		padding: 0rpx 30rpx;
		&-item{
			border-bottom: 2rpx solid #EEEEEE;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 34rpx;
			.label{
				width: 200rpx;
			}
			.input{
				font-size: 34rpx;
			}
		}
		.tips{
			align-items: flex-start;
			flex-direction: column;
			height: auto;
			border: none;
			padding: 36rpx 0;
			.name{
				font-size: 26rpx;
				margin-left: 20rpx;
				line-height: 40rpx;
				color: #999999;
				margin-top: 20rpx;
			}
		}
	}
	.btn{
		margin-top: 80rpx;
		padding-bottom: 50rpx;
		.item{
			border-radius: 50rpx;
			width: 80%;
			margin-top: 30rpx;
		}
	}
</style>
