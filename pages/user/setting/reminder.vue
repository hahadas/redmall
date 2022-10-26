<template>
	<view>
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<text>{{item.name}}</text>
				<switch class="switch" color="#381895" :checked="item.checked" @change="switchChange($event, i, item.value)" />
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from "vuex"
	export default{
		data(){
			return{
				list: [
					{name: "声音", value: "voice", checked: false},
					{name: "震动", value: "shock", checked: false}
				]
			}
		},
		computed:{
			...mapState(["reminderStatus"])
		},
		onLoad() {
			let reminderStatus = this.reminderStatus
			if (reminderStatus && reminderStatus.length > 0){
				reminderStatus.map((v, i)=>{
					if (v === "voice"){
						this.list[0].checked = true
					}
					if (v === "shock"){
						this.list[1].checked = true
					}
				})
			}
		},
		methods:{
			...mapMutations(["setReminderStatus"]),
			switchChange(e, index, value){
				this.list[index].checked = e.detail.value
				let statusList = []
				this.list.map(v =>{
					if (v.checked){
						statusList.push(v.value)
					}
				})
				console.log("statusList....", statusList)
				this.setReminderStatus(statusList)
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		background-color: white;
		padding-left: 30rpx;
		&-item{
			padding-right: 20rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #EEEEEE;
			.switch{
				transform: scale(.8);
			}
		}
		&-item:last-child{
			border: none;
		}
	}
</style>
