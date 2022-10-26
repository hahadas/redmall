import { distanceTransform } from "@/common/utils/index.js"
import publics from "@/common/utils/public.js"
export default{
	props: {
		swiperHeight: {
			default: 0
		},
		myAddressData: {
			default: {longitude:0,latitude:0}
		}
	},
	filters:{
		distance(distance){
			return distanceTransform(distance)
		}
	},
	data(){
		return {
			statusBarHeight: uni.getSystemInfoSync().statusBarHeight, // 状态栏高度
		}
	},
	methods: {
		goDetails(item){
			this.$navigateTo("details?id="+item.id)
		},
		viewUser(item, current=0) {
			this.$navigateTo("user?userId="+item.imAccount+"&&current="+current)
		},
		filterImg(img, type){
			return publics.filterImgUrl(img, type)
		}
	}
}