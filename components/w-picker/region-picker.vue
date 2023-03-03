<template>
	<view class="w-picker-view">
		<picker-view class="d-picker-view" :indicator-style="itemHeight" :value="pickVal" @change="handlerChange">
			<picker-view-column>
				<view class="w-picker-item" v-for="(item,index) in range.provinces" :key="index">{{item.label}}</view>
			</picker-view-column>
			<picker-view-column>
				<view class="w-picker-item" v-for="(item,index) in range.citys" :key="index">{{item.label}}</view>
			</picker-view-column>
			<picker-view-column v-if="!hideArea">
				<view class="w-picker-item" v-for="(item,index) in range.areas" :key="index">{{item.label}}</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import areaData from "./areadata/areadata.js"
	export default {
		data() {
			return {
				pickVal:[],
				range:{
					provinces:[],
					citys:[],
					areas:[]
				},
				checkObj:{},
				areaData: []
			};
		},
		props:{
			itemHeight:{
				type:String,
				default:"44px"
			},
			value:{
				type:[Array,String],
				default:""
			},
			defaultType:{
				type:String,
				default:"label"
			},
			hideArea:{
				type:Boolean,
				default:false
			}
		},
		watch:{
			value(val){
				this.initData();
			}
		},
		created() {
			this.initData();
		},
		methods:{
			async getExternalSources(callback){
				callback(areaData)
				// let key = 'EXTERNAL_SOURCES';
				// //先从缓存获取，如果缓存不存在，则请求数据后存入缓存中
				// let externalSources = uni.getStorageSync(key);
				// if(externalSources){
				// 	callback(externalSources);
				// }else{
				// 	await uni.request({
				// 		url: url.externalSources.areadataJson,
				// 		method: 'GET',
				// 		header:{
				// 			'Content-Type' : 'application/json',
				// 			'Access-Control-Allow-Origin': '*'
				// 		},
				// 		success: res => {
				// 			uni.setStorageSync(key, res.data)
				// 			callback(res.data);
				// 		},
				// 		fail: () => {},
				// 		complete: () => {}
				// 	});
				// }
			},
			async getData(callback){
				let that = this
				await this.getExternalSources(areaData => {
					// that.areaData = areaData
					//用来处理初始化数据
					let provinces=areaData;
					let dVal=[];
					let value=that.value;
					let a1=value[0];//默认值省
					let a2=value[1];//默认值市
					let a3=value[2];//默认值区、县
					let province,city,area;
					let provinceIndex=provinces.findIndex((v)=>{
						return v[that.defaultType]==a1
					});
					provinceIndex=value?(provinceIndex!=-1?provinceIndex:0):0;
					let citys=provinces[provinceIndex].children;
					let cityIndex=citys.findIndex((v)=>{
						return v[that.defaultType]==a2
					});
					cityIndex=value?(cityIndex!=-1?cityIndex:0):0;
					let areas=citys[cityIndex].children;
					let areaIndex=areas.findIndex((v)=>{
						return v[that.defaultType]==a3;
					});
					areaIndex=value?(areaIndex!=-1?areaIndex:0):0;
					dVal=that.hideArea?[provinceIndex,cityIndex]:[provinceIndex,cityIndex,areaIndex];
					province=provinces[provinceIndex];
					city=citys[cityIndex];
					area=areas[areaIndex];
					let obj=that.hideArea?{
						province,
						city
					}:{
						province,
						city,
						area
					}
					callback(that.hideArea?{
						provinces,
						citys,
						dVal,
						obj
					}:{
						provinces,
						citys,
						areas,
						dVal,
						obj
					})
				});
			},
			async initData(){
				let that = this
				await this.getData(dataData => {
					let provinces=dataData.provinces;
					let citys=dataData.citys;
					let areas=that.hideArea?[]:dataData.areas;
					let obj=dataData.obj;
					let province=obj.province,city=obj.city,area=that.hideArea?{}:obj.area;
					let value=that.hideArea?[province.value,city.value]:[province.value,city.value,area.value];
					let result=that.hideArea?`${province.label+city.label}`:`${province.label+city.label+area.label}`;
					that.range=that.hideArea?{
						provinces,
						citys,
					}:{
						provinces,
						citys,
						areas
					};
					that.checkObj=obj;
					that.$nextTick(()=>{
						that.pickVal=dataData.dVal;
					});
					that.$emit("change",{
						result:result,
						value:value,
						obj:obj
					})
				});
			},
			handlerChange(e){
				let arr=[...e.detail.value];
				let provinceIndex=arr[0],cityIndex=arr[1],areaIndex=this.hideArea?0:arr[2];
				// let provinces=this.areaData;
				let provinces=areaData;
				let citys=(provinces[provinceIndex]&&provinces[provinceIndex].children)||provinces[provinces.length-1].children||[];
				let areas=this.hideArea?[]:((citys[cityIndex]&&citys[cityIndex].children)||citys[citys.length-1].children||[]);
				let province=provinces[provinceIndex]||provinces[provinces.length-1],
				city=citys[cityIndex]||[citys.length-1],
				area=this.hideArea?{}:(areas[areaIndex]||[areas.length-1]);
				let obj=this.hideArea?{
					province,
					city
				}:{
					province,
					city,
					area
				}
				if(this.checkObj.province.label!=province.label){
					//当省更新的时候需要刷新市、区县的数据;
					this.range.citys=citys;
					if(!this.hideArea){
						this.range.areas=areas;
					}
					
				}
				if(this.checkObj.city.label!=city.label){
					//当市更新的时候需要刷新区县的数据;
					if(!this.hideArea){
						this.range.areas=areas;
					}
				}
				this.checkObj=obj;
				this.$nextTick(()=>{
					this.pickVal=arr;
				})
				let result=this.hideArea?`${province.label+city.label}`:`${province.label+city.label+area.label}`;
				let value=this.hideArea?[province.value,city.value]:[province.value,city.value,area.value];
				this.$emit("change",{
					result:result,
					value:value,
					obj:obj
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./w-picker.css";	
</style>

