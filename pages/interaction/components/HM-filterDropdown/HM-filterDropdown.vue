<template>
	<view class="HMfilterDropdown" :class="{'setDropdownBottom':maskVisibility}" :style="{'top':menuTop+'rpx'}" @touchmove.stop.prevent="discard" @tap.stop="discard">
		<view class="nav">
			<block v-for="(item,index) in menu" :key="index">
				<view class="first-menu" :class="{'on':showPage==index}" @tap="togglePage(index)">
					<text class="name">{{item.name}}</text>
					<text class="iconfont triangle" :style="'transform:rotate('+triangleDeg[index]+'deg);'"></text>
				</view>
			</block>
		</view>
		<view class="mask" :class="{'show':isShowMask,'hide':maskVisibility!=true}" @tap="togglePage(showPage)"></view>
		<block v-for="(page,page_index) in subData" :key="page_index">
			<view class="sub-menu-class" :class="{'show':showPage==page_index,'hide':pageState[page_index]!=true}">
				<block v-if="page.type=='hierarchy'&& page.submenu.length>0">
					<scroll-view class="sub-menu-list" :class="[activeMenuArr[page_index].length>1?'first':'alone']"
					 :scroll-y="true" :scroll-into-view="'first_id'+firstScrollInto">
						<block v-for="(sub,index) in page.submenu" :key="index">
							<view class="sub-menu" :id="'first_id'+index" :class="{'on':activeMenuArr[page_index][0]==index}" @tap="selectHierarchyMenu(page_index,index,null,null)">
								<view class="menu-name">
									<text>{{sub.name}}</text>
									<text class="iconfont selected"></text>
								</view>
							</view>
						</block>
					</scroll-view>
					<block v-for="(sub,index) in page.submenu" :key="index">
						<scroll-view class="sub-menu-list not-first" :scroll-y="true" v-if="activeMenuArr[page_index][0]==index&&sub.submenu.length>0"
						 :scroll-into-view="'second_id'+secondScrollInto">
							<block v-for="(sub_second,second_index) in sub.submenu" :key="second_index">
								<view class="sub-menu" :id="'second_id'+second_index" :class="{'on':activeMenuArr[page_index][1]==second_index}">
									<view class="menu-name" @tap="selectHierarchyMenu(page_index,activeMenuArr[page_index][0],second_index,null)">
										<text>{{sub_second.name}}</text>
										<text class="iconfont selected"></text>
									</view>
									<view class="more-sub-menu" v-if="sub_second.submenu&&sub.submenu.length>0&&sub_second.submenu.length>0">
										<block v-for="(sub2,sub2_index) in sub_second.submenu" :key="sub2_index">
											<text v-if="sub_second.showAllSub || (sub2_index<8)" :class="{'on':activeMenuArr[page_index][1]==second_index&&activeMenuArr[page_index][2]==sub2_index}"
											 @tap="selectHierarchyMenu(page_index,activeMenuArr[page_index][0],second_index,sub2_index)">{{sub2.name}}</text>
											<text v-if="sub_second.showAllSub!=true && sub2_index==8 && sub_second.submenu.length>9" @tap="showMoreSub(second_index)">??????<text
												 class="iconfont triangle"></text></text>
										</block>
									</view>
								</view>
							</block>
						</scroll-view>
					</block>
				</block>
				<block v-if="page.type=='filter'">
					<view class="filter">
						<scroll-view class="menu-box" :scroll-y="true">
							<view class="box" v-for="(box,box_index) in page.submenu" :key="box_index">
								<view class="title">{{box.name}}</view>
								<view class="labels">
									<view v-for="(label,label_index) in box.submenu" :key="label_index" @tap="selectFilterLabel(page_index,box_index,label_index)"
									 :class="{'on':label.selected}">{{label.name}}</view>
								</view>
							</view>
						</scroll-view>
						<view class="btn-box">
							<view class="reset" @tap="resetFilterData(page_index)">??????</view>
							<view class="submit" @tap="setFilterData(page_index)">??????</view>
						</view>
					</view>
				</block>
				<block v-if="page.type=='radio'">
					<view class="filter">
						<scroll-view class="menu-box" :scroll-y="true">
							<view class="box" v-for="(box,box_index) in page.submenu" :key="box_index">
								<view class="title">{{box.name}}</view>
								<view class="labels">
									<view v-for="(label,label_index) in box.submenu" :key="label_index" @tap="selectRadioLabel(page_index,box_index,label_index)"
									 :class="{'on':label.selected}">{{label.name}}</view>
								</view>
							</view>
						</scroll-view>
						<view class="btn-box">
							<view class="reset" @tap="resetFilterData(page_index)">??????</view>
							<view class="submit" @tap="setFilterData(page_index)">??????</view>
						</view>
					</view>
				</block>
			</view>
		</block>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				subData: [], //????????????
				menu: [], //??????????????????
				showPage: -1, //??????????????????/??????????????????
				pageState: [], //???????????????
				activeMenuArr: [], //UI??????
				shadowActiveMenuArr: [], //????????????
				defaultActive:[],
				triangleDeg: [], //?????????????????????????????????
				isShowMask: false, //???????????????/??????????????????
				maskVisibility: false, //???????????????/????????????
				//??????????????????
				firstScrollInto: 0,
				secondScrollInto: 0,
				componentTop:0	,//??????top
				isReadNewSelect:false
			}
		},
		props: {
			menuTop:{
				value: Number,
				default: false
			},
			filterData: {
				value: Array,
				default: []
			},
			defaultSelected:{
				value: Array,
				default: []
			},
			updateMenuName:{
				value: Boolean,
				default: true
			},
			dataFormat:{
				value: String,
				default: 'Array'
			}
		},
		watch: {
			filterData: {
				handler() {
					this.initMenu(); //filterData???????????????????????????
				},
				immediate: true
			},
			defaultSelected(newVal) {

				if(newVal.length==0){
					return;
				}
				this.defaultActive = JSON.parse(JSON.stringify(newVal));
				this.activeMenuArr = JSON.parse(JSON.stringify(newVal));
				this.shadowActiveMenuArr = JSON.parse(JSON.stringify(newVal));
				if(this.updateMenuName){
					this.setMenuName();
				}
			}
		},
		methods: {
			initMenu() {

				let tmpMenuActiveArr=[];
				let tmpMenu=[];
				for (let i = 0; i < this.filterData.length; i++) {
					let tmpitem = this.filterData[i];
					tmpMenu.push({
						//??????????????????name??????????????????????????????menu.name,filter????????????"??????"??????menu.name
						name: tmpitem.name || (tmpitem.type == "filter" ? "??????" : tmpitem.submenu[0].name),
						type: tmpitem.type
					});
					//????????????????????????-ui??????
					tmpMenuActiveArr.push(this.processActive(tmpitem));
					//?????????????????????
					this.triangleDeg.push(0);
					//?????????????????????????????????
					this.pageState.push(false);
					//???????????????????????????
					tmpitem = this.processSubMenu(tmpitem);
					this.filterData[i] = tmpitem;
				}
				this.menu = tmpMenu;
				//????????????????????????
				tmpMenuActiveArr = this.defaultActive.length>0?this.defaultActive:this.activeMenuArr.length>0?this.activeMenuArr:tmpMenuActiveArr;
				this.defaultActive = [];
				this.activeMenuArr = JSON.parse(JSON.stringify(tmpMenuActiveArr));
				this.shadowActiveMenuArr = JSON.parse(JSON.stringify(tmpMenuActiveArr));
				//??????????????????
				this.subData = this.filterData;
				//????????????????????????
				if(this.updateMenuName){
					this.setMenuName();
				}
			},
			setMenuName(){
				for(var i=0;i<this.activeMenuArr.length;i++){
					let row = this.activeMenuArr[i];
					if(this.subData[i].type=='hierarchy'){
						if (typeof(row[0]) == 'number'){
							let tmpsub = this.subData[i].submenu[row[0]];
							if(row.length>1){
								tmpsub = tmpsub.submenu[row[1]];
								if(row.length>2){
									tmpsub = tmpsub.submenu[row[2]];
								}
							}
							this.menu[i].name = tmpsub ? tmpsub.name : "";
						}else{
							this.menu[i].name = this.subData[i].name;
						}
					}
				}
			},
			//????????????
			showMoreSub(index) {
				this.subData[this.showPage].submenu[this.activeMenuArr[this.showPage][0]].submenu[index].showAllSub = true;
				this.$forceUpdate();
			},
			//??????
			selectHierarchyMenu(page_index, level1_index, level2_index, level3_index) {
				//????????????
				if (level1_index != null && level2_index == null && level3_index == null && this.shadowActiveMenuArr[page_index][0] ==
					level1_index) {
					this.activeMenuArr.splice(page_index, 1, JSON.parse(JSON.stringify(this.shadowActiveMenuArr[page_index])));
				} else {
					this.activeMenuArr[page_index].splice(0, 1, level1_index);
					(level2_index!=null||this.activeMenuArr[page_index].length>=2)&&this.activeMenuArr[page_index].splice(1, 1, level2_index) || this.activeMenuArr[page_index].splice(1, 1);
					(level3_index!=null||this.activeMenuArr[page_index].length>=3)&&this.activeMenuArr[page_index].splice(2, 1, level3_index) || this.activeMenuArr[page_index].splice(2, 1);
				}
				//????????????
				if (level3_index != null || level2_index != null || (level1_index != null && this.subData[page_index].submenu[level1_index].submenu.length == 0)
				) {
					let sub = this.subData[page_index].submenu[level1_index].submenu[level2_index];
					if(this.updateMenuName){
						this.menu[page_index].name = (level3_index != null && sub.submenu[level3_index].name) || (level2_index != null && sub.name) || this.subData[page_index].submenu[level1_index].name;
					}
					this.shadowActiveMenuArr[page_index] = JSON.parse(JSON.stringify(this.activeMenuArr[page_index]));
					this.togglePage(this.showPage);
				}
			},
			//?????????????????????
			setFilterData(page_index) {
				this.shadowActiveMenuArr[page_index] = JSON.parse(JSON.stringify(this.activeMenuArr[page_index]));
				this.togglePage(this.showPage);
			},
			//???????????????ui?????????
			resetFilterData(page_index) {
				let tmpArr = [];
				let level = this.shadowActiveMenuArr[page_index].length;
				while (level > 0) {
					tmpArr.push([]);
					let box = this.subData[page_index].submenu[level - 1].submenu;
					for (let i = 0; i < box.length; i++) {
						this.subData[page_index].submenu[level - 1].submenu[i].selected = false;
					}
					level--;
				}
				this.activeMenuArr[page_index] = JSON.parse(JSON.stringify(tmpArr));
				this.$forceUpdate();
			},
			//???????????????label-UI??????
			selectFilterLabel(page_index, box_index, label_index) {
				let find_index = this.activeMenuArr[page_index][box_index].indexOf(label_index);
				if (find_index > -1) {
					this.activeMenuArr[page_index][box_index].splice(find_index, 1);
					this.subData[page_index].submenu[box_index].submenu[label_index].selected = false;
				} else {
					this.activeMenuArr[page_index][box_index].push(label_index);
					this.subData[page_index].submenu[box_index].submenu[label_index].selected = true;
				}
				this.$forceUpdate();
			},
			//???????????????label-UI??????
			selectRadioLabel(page_index, box_index, label_index) {
				
				let activeIndex = this.activeMenuArr[page_index][box_index][0];
				if(activeIndex == label_index){
					this.subData[page_index].submenu[box_index].submenu[activeIndex].selected = false;
					this.activeMenuArr[page_index][box_index][0] = null;
				}else{
					if(activeIndex!=null && activeIndex<this.subData[page_index].submenu[box_index].submenu.length){
						this.subData[page_index].submenu[box_index].submenu[activeIndex].selected = false;
					}
					
					this.subData[page_index].submenu[box_index].submenu[label_index].selected = true;
					this.activeMenuArr[page_index][box_index][0] = label_index;
				}
				this.$forceUpdate();
			},
			//????????????
			togglePage(index) {
				if (index == this.showPage) {
					this.hidePageLayer(true);
					this.hideMask();
					this.showPage = -1;
				} else {
					if (this.showPage > -1) {
						this.hidePageLayer(false);
					}
					this.showPageLayer(index);
					this.showMask();
				}
			},
			//hide?????????
			hideMask() {
				this.isShowMask = false;
				setTimeout(() => {
					this.maskVisibility = false;
				}, 200);
			},
			//show?????????
			showMask() {
				this.maskVisibility = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.isShowMask = true;
					}, 0);
				})
			},
			//hide?????????
			hidePageLayer(isAnimation) {
				this.triangleDeg[this.showPage] = 0;
				let tmpIndex = this.showPage;
				if (isAnimation) {
					setTimeout(() => {
						this.pageState.splice(tmpIndex, 1, false);
					}, 200);
					this.confirm();
				} else {
					this.pageState.splice(tmpIndex, 1, false)
				}
				this.firstScrollInto = null;
				this.secondScrollInto = null;
			},
			confirm() {
				let index = JSON.parse(JSON.stringify(this.shadowActiveMenuArr));
				let value = JSON.parse(JSON.stringify(this.shadowActiveMenuArr));
				console.log("index", index, "value", value)
				//????????????????????????
				index.forEach((item, i) => {
					if (typeof(item[0]) == 'object') {
						//?????????????????????????????????
						item.forEach((s, j) => {
							if(s!=null){
								s.sort((val1, val2) => {
									return val1 - val2;
								});
								item[j] = s;
								s.forEach((v, k) => {
									value[i][j][k] = (v==null||v>=this.subData[i].submenu[j].submenu.length)?null:this.subData[i].submenu[j].submenu[v].value;
									if(this.subData[i].type == 'radio' && value[i][j][k] == null){
										value[i][j] = [];
										index[i][j] = [];
									}
								});
							}
						});
					}else{
						let submenu = this.subData[i].submenu[item[0]];
						value[i][0] = submenu ? submenu.value : null;
						if(value[i].length>=2  && item[1]!=null){
							if(submenu.submenu.length>0){
								submenu = submenu.submenu[item[1]];
								value[i][1] = submenu.hasOwnProperty('value')?(submenu ? submenu.value : null):null;
							}else{
								value[i][1] = null
							}
							if(value[i].length>=3 && item[2]!=null){
								if(submenu.submenu.length>0){
									submenu = submenu.submenu[item[2]];
									value[i][2] = submenu.hasOwnProperty('value')?(submenu ? submenu.value : null):null;
								}else{
									value[i][2] = null;
								}
							}
						}
					}
					index[i] = item;
					
				});
				// ??????
				this.$emit('confirm', {
					index: index,
					value: value
				});
			},
			//show?????????
			showPageLayer(index) {
				this.processPage(index);
				this.pageState.splice(index, 1, true);
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPage = index;
					}, 0);
				})
				this.triangleDeg[index] = 180;
			},
			reloadActiveMenuArr(){
				for (let i = 0; i < this.filterData.length; i++) {
					let tmpitem = this.filterData[i];
					let tmpArr = this.processActive(tmpitem);
					tmpitem = this.processSubMenu(tmpitem);
					if(this.activeMenuArr[i].length!=tmpArr.length){
						this.filterData[i] = tmpitem;
						this.activeMenuArr.splice(i, 1, JSON.parse(JSON.stringify(tmpArr)));
						this.shadowActiveMenuArr.splice(i, 1, JSON.parse(JSON.stringify(tmpArr)));
					}
				} 
				this.subData = this.filterData;
				this.$forceUpdate();
			},
			processPage(index) {
				//check UI???????????????????????????,???????????????????????????UI?????????????????????
				this.reloadActiveMenuArr();
				//??????UI????????????
				this.activeMenuArr.splice(index, 1, JSON.parse(JSON.stringify(this.shadowActiveMenuArr[index])));
				if (this.menu[index].type == 'filter') {
					//???????????????????????????
					let level = this.shadowActiveMenuArr[index].length;
					for (let i = 0; i < level; i++) {
						let box = this.subData[index].submenu[i].submenu;
						for (let j = 0; j < box.length; j++) {
							if (this.shadowActiveMenuArr[index][i].indexOf(j) > -1) {
								this.subData[index].submenu[i].submenu[j].selected = true;
							} else {
								this.subData[index].submenu[i].submenu[j].selected = false;
							}
						}
					}
				} else if (this.menu[index].type == 'hierarchy') {
					this.$nextTick(() => {
						setTimeout(() => {
							//??????????????????
							this.firstScrollInto = parseInt(this.activeMenuArr[index][0]);
							this.secondScrollInto = parseInt(this.activeMenuArr[index][1]);
						}, 0);
					})
				} else if (this.menu[index].type == 'radio') {
					//???????????????????????????
					let level = this.shadowActiveMenuArr[index].length;
					for (let i = 0; i < level; i++) {
						let box = this.subData[index].submenu[i].submenu;
						for (let j = 0; j < box.length; j++) {
							if (this.shadowActiveMenuArr[index][i].indexOf(j) > -1) {
								this.subData[index].submenu[i].submenu[j].selected = true;
							} else {
								this.subData[index].submenu[i].submenu[j].selected = false;
							}
						}
					}
				} 
			},
			processActive(tmpitem) {
				let tmpArr = []
				if (tmpitem.type == 'hierarchy'&&tmpitem.hasOwnProperty('submenu')&&tmpitem.submenu.length>0) {
					let level = this.getMaxFloor(tmpitem.submenu);
					while (level > 0) {
						tmpArr.push(null);
						level--;
					}
				} else if (tmpitem.type == 'filter') {
					let level = tmpitem.submenu.length;
					while (level > 0) {
						tmpArr.push([]);
						level--;
					}
				} else if (tmpitem.type == 'radio') {
					let level = tmpitem.submenu.length;
					while (level > 0) {
						tmpArr.push([]);
						level--;
					}
				}
				return tmpArr;
			},
			processSubMenu(menu) {
				if (menu.hasOwnProperty('submenu') && menu.submenu.length > 0) {
					for (let i = 0; i < menu.submenu.length; i++) {
						menu.submenu[i] = this.processSubMenu(menu.submenu[i]);
					}
				} else {
					menu.submenu = [];
				}
				return menu;
			},
			//??????????????????
			getMaxFloor(treeData) {
				let floor = 0
				let max = 0
				function each(data, floor) {
					data.forEach(e => {
						max = floor > max ? floor : max;
						if (e.hasOwnProperty('submenu') && e.submenu.length > 0) {
							each(e.submenu, floor + 1)
						}
					})
				}
				each(treeData, 1)
				return max;
			},
			discard() {

			}
		}
	}
</script>
<style lang="scss">
	.HMfilterDropdown {
		flex-shrink: 0;
		width: 100%;
		position: fixed;
		// position: sticky;
		z-index: 997;
		flex-wrap: nowrap;
		display: flex;
		flex-direction: row;
		top: var(--window-top);
		left:0;
		// top:100px;
		overflow-y: hidden;
		&.setDropdownBottom{
			// height: 345px;
			bottom: 0;
		}
		view {
			display: flex;
			flex-wrap: nowrap;
		}
	}
	.region {
		flex: 1;
		height: 44px;
	}
	.nav {
		width: 100%;
		height: 44px;
		border-bottom: solid 1rpx #eee;
		z-index: 12;
		background-color: #ffffff;
		flex-direction: row;
		.first-menu {
			width: 100%;
			font-size: 13px;
			color: #757575;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			transition: color .2s linear;

			&.on {
				color: #381895;

				.iconfont {
					color: #381895;
				}
			}
			.name {
				height: 20px;
				text-align: center;
				text-overflow: clip;
				overflow: hidden;
			}
			.iconfont {
				width: 13px;
				height: 13px;
				align-items: center;
				justify-content: center;
				transition: transform .2s linear, color .2s linear;
			}
		}
	}
	.sub-menu-class {
		width: 100%;
		position: absolute;
		left: 0;
		transform: translate3d(0, - 100%, 0);
		max-height: 345px;
		background-color: #ffffff;
		z-index: 11;
		box-shadow: 0 5px 5px rgba(0, 0, 0, .1);
		overflow: hidden;
		flex-direction: row;
		transition: transform .15s linear;
		&.hide {
			display: none;
		}

		&.show {
			transform: translate3d(0, calc(44px + 1rpx), 0);
		}
	}
	.sub-menu-list {
		width: 100%;
		height: 345px;
		flex-direction: column;
		.sub-menu {
			min-height: 44px;
			font-size: 13px;
			flex-direction: column;
			padding-right: 15px;
			>.menu-name {
				height: 44px;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				>.iconfont {
					display: none;
					font-size: 18px;
					color: #381895;
				}
			}
		}
		&.first {
			flex-shrink: 0;
			width: 236rpx;
			background-color: #f0f0f0;
			.sub-menu {
				padding-left: 15px;

				&.on {
					background-color: #fff;
				}
			}
		}
		&.alone {
			max-height: 345px;
			min-height: 170px;
			height: auto;
			.sub-menu {
				min-height: calc(44px - 1rpx);
				margin-left: 15px;
				border-bottom: solid 1rpx #e5e5e5;

				&.on {
					color: #381895;

					>.menu-name {
						>.iconfont {
							display: block;
						}
					}
				}
			}
		}
		&.not-first {
			.sub-menu {
				min-height: calc(44px - 1rpx);
				margin-left: 15px;
				border-bottom: solid 1rpx #e5e5e5;
				>.menu-name {
					height: calc(44px - 1rpx);
					>.iconfont {
						display: none;
						font-size: 18px;
						color: #381895;
					}
				}
				&.on {
					color: #381895;
					>.menu-name {
						>.iconfont {
							display: block;
						}
					}
				}
				.more-sub-menu {
					flex-direction: row;
					flex-wrap: wrap;
					padding-bottom: 9px;
					>text {
						height: 30px;
						border-radius: 3px;
						background-color: #f5f5f5;
						color: #9b9b9b;
						margin-bottom: 6px;
						margin-right: 6px;
						text-align: center;
						line-height: 30px;
						border: solid #f5f5f5 1rpx;
						flex: 0 0 calc(33.33% - 6px);
						overflow: hidden;
						font-size: 12px;
						&:nth-child(3n) {
							margin-right: 0;
						}
						&.on {
							border-color: #f6c8ac;
							color: #381895;
						}
						.iconfont {
							color: #9b9b9b;
						}
					}
				}
			}
		}
	}
	.filter {
		width: 100%;
		height: 345px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		.menu-box {
			width: 698rpx;
			height: calc(345px - 75px);
			flex-shrink: 1;
			.box {
				width: 100%;
				margin-top: 16px;
				flex-direction: column;
				.title {
					width: 100%;
					font-size: 13px;
					color: #888;
				}
				.labels {
					flex-direction: row;
					flex-wrap: wrap;
					.on {
						border-color: #381895;
						background-color: #381895;
						color: #fff;
					}
					>view {
						width: 148rpx;
						height: 30px;
						border: solid 1rpx #adadad;
						border-radius: 2px;
						margin-right: 15px;
						margin-top: 8px;
						font-size: 12px;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						&:nth-child(4n) {
							margin-right: 0;
						}
					}
				}
			}
		}
		.btn-box {
			flex-shrink: 0;
			width: 698rpx;
			height: 75px;
			flex-direction: row !important;
			align-items: center;
			justify-content: space-between;
			>view {
				width: 320rpx;
				height: 40px;
				border-radius: 40px;
				border: solid 1rpx #381895;
				align-items: center;
				justify-content: center;
			}
			.reset {
				color: #381895;
			}
			.submit {
				color: #fff;
				background-color: #381895;
			}
		}
	}
	.mask {
		z-index: 10;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0);
		transition: background-color .15s linear;
		&.show {
			background-color: rgba(0, 0, 0, 0.5);
		}
		&.hide {
			display: none;
		}
	}
	/* ???????????? */
	@font-face {
		font-family: "HM-FD-font";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAALAAAsAAAAABpQAAAJzAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgp4gQIBNgIkAwwLCAAEIAWEbQc5G8sFERWMIbIfCbbzqA4hp7InSBibVsYGb4J42o82b3e/nJlHMw/NHbGOlwKJRCRpwzPtpAECCOZubdqxjYpQLMlVg+70/08edrgQOtx2ukpVyApZn+dyehPoQObHo3O85rYx9vOjXoBxQIHugW2yIkqIW2QXcScu4jwE8CSWbKSmrqUHFwOaJoCsLM5P4haSGIxRcRHshrUGucLCVcfqI3AZfV/+USguKCwNmtsxVztDxU/n55C+3W0Z4QQpEOTNFqCBbMCAjDUWB9CIwWk87aa70cYgqLkyd3dEmm+18R8eKATEBrV7A5CulBT8dKiWOYZk412XNcDdKSEKSGODnyKIDl+dmVt9/Dx4pu/xyeutkMlHISGPTsPCnoTNP9nOT6wTtDdlO6dPr47efvj942lkYuQzrhMKEjq9N6y98P3340gmlJ/RStUD6F31CAEEPtUW94/7rf+7XgaAz57X0ZHXAGsFFwVgw38yALuMb0IBbVyNamFYEw4oKMDTj3AHRQP5Pt4dci9VwSVkRNQh5r7CLskZadhsWHhRDBsXczk8ZYk3ewnCxmQeQKa3BOHvA8XXO2j+vqRhf7CE+sPmn4anvoL29JLa4qqaUQkmoK+QG2osCckq7txi2leK86aIPyJ3eQZ8xytXYmyQ51jQndJAxIJlqiGSLsOqImiZCjTiZCJt6Lq26U2OoXqwUo0hRaAE0K5AziANy/uLVeXzWyjVqyjcoeupjxDr5MMDn8MDkLG9Aenu5ZrOSSoghAUsRmogkkahSoWAtnlUARnCkY3It0Iu7mWhdmd9Z/19BwBP6GidEi0G56opckXTGZVSPxgAAAA=');
	}
	.iconfont {
		font-family: "HM-FD-font" !important;
		font-size: 13px;
		font-style: normal;
		color: #757575;
		&.triangle {
			&:before {
				content: "\e65a";
			}
		}
		&.selected {
			&:before {
				content: "\e607";
			}
		}
	}
</style>
