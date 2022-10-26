<template>
	<view>
		<shop :list="list"></shop>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import shop from "./modules/shop.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default{
		components: { shop, uniLoadMore },
		data(){
			return {
				loading: "more",
				list: [],
				myAddressData: {},
				storeName: ""
			}
		},
		
		onLoad(opt) {
			if (opt.storeName) this.storeName = opt.storeName
			let myAddressData = publics.getMyaddressLngLat()
			if (myAddressData) {
				this.myAddressData = JSON.parse(myAddressData)
				this.getList()
			}
		},
		onPullDownRefresh(){
			this.list = []
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		methods:{
			getList(){
				let params = {
					pageNum: this.list.length,
					storeName: this.storeName,
					lng: this.myAddressData.longitude, //经度
					lat: this.myAddressData.latitude   //纬度
				};
				this.$http('GET', url.store.getNearbyStores, params).then(res =>{
					this.list = this.list.concat(res.data);
					this.loading = res.data.length < 12 ? 'nomore' : 'more'
					uni.stopPullDownRefresh();
				})
			}
		}
	}
</script>


