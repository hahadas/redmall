const BindingX = uni.requireNativePlugin('bindingx');
export default {
	data(){
		return{
			typeX:false, //是否开启左右滑动
			playCount:2,//剩余多少视频加载视频列表
			startDistance:5, //开启左右滑动时有效,判断左右上下拖动的启动距离
			minTime:300, //判断为快速滑动的时间,该时间内无视回弹
			backDistance:200, //上下滑动的回弹距离
			
			
			oldTime:0,
			oldTouces:{},
			touchType:null,
			gesToken:0,
			height:'667px',
			index:0,
			oldIndex:0,
			width:'',
			sysheight:0,
			distance:0,
			distance_1:0,
			distance1:0,
			distanceX:0,
			scroll:false,
		}
	},
	created(){
		plus.screen.lockOrientation("portrait-primary")
		this.sysheight = uni.getSystemInfoSync().windowHeight
		this.height = `${this.sysheight}px` 
		let width = uni.getSystemInfoSync().windowWidth 
		this.width = `${width}px` 
	},
	methods:{
		getEl: function(el) {
		    if (typeof el === 'string' || typeof el === 'number') return el;
			if (WXEnvironment) {
			    return el.ref;
			} else {
			    return el instanceof HTMLElement ? el : el.$el;
			}
		},
		// ListTouch触摸开始
		ListTouchStart(e) {
			
			this.oldTime = new Date()
			this.oldTouces = e.changedTouches[0]
		},
		ListTouchEnd(e) {
			console.log('end')
		},
		//判定方向
		ListTouchMove(e){
			
			//结束启动判断
			if(this.touchType == 'stop') return
			let { oldTouces,oldValue,touchType } = this
			let newTouces = e.changedTouches[0]
			
			if(!this.touchType){
				let startDistance = this.typeX?this.startDistance: 0 
				
				//滑动启动条件
				this.touchType = Math.abs( newTouces.pageY - oldTouces.pageY ) > startDistance ? 'moveY' : null
				if(this.touchType=='moveY'&&newTouces.pageY> oldTouces.pageY){
					this.touchType = 'moveYB'
				}else if(this.touchType=='moveY'&&newTouces.pageY<oldTouces.pageY){
					this.touchType = 'moveYT'
				}
				//是否开启左右滑动
				if(!this.touchType&&this.typeX){
					this.touchType = newTouces.pageX - oldTouces.pageX > startDistance ? 'moveXR' : this.touchType
					this.touchType = newTouces.pageX - oldTouces.pageX < -startDistance ? 'moveXL' : this.touchType
				}
				
			}else{
				
				
				// 如果在执行动画，就不触发
				if(this.scroll) return 
				// 解绑动画
				if(this.gesToken != 0) {
					BindingX.unbind({
						eventType:'pan',
						token:this.gesToken
					})
					this.gesToken = 0
					// return
				}
				
				let move
				if(this.touchType == 'moveYB'||this.touchType == 'moveYT'){
					move = 0
				}else if(this.touchType == 'moveXL'){
					move = -1
				}else if(this.touchType == 'moveXR'){
					move = 1
				}
				
				//console.log(move)
				
				//关闭启动判断
				this.touchType = 'stop'
				
				let touch_origin0 = `y+${this.distance}<=0 && ${move}==0 && ${this.distanceX}==0 && 
					y+${this.distance}-${this.sysheight}>=${-this.sysheight*this.videoList.length}? 
					y+${this.distance} : ${this.distance}`
				let touch_origin_1 = `y+${this.distance_1}<=0 && ${move}==0 && ${this.distanceX}<0 &&
					y+${this.distance_1}-${this.sysheight}>=${-this.sysheight*this.videoList_1.length}? 
					y+${this.distance_1} : ${this.distance_1}`
				let touch_origin1 = `y+${this.distance1}<=0 && ${move}==0 && ${this.distanceX}>0 &&
					y+${this.distance1}-${this.sysheight}>=${-this.sysheight*this.videoList1.length}? 
					y+${this.distance1} : ${this.distance1}`
				// 找到元素 
				let swiperRef = this.getEl(this.$refs.swiper)
				let leftRef = this.getEl(this.$refs.left)
				let rightRef = this.getEl(this.$refs.right)
				
				let anchor = this.getEl(this.$refs.touch)
				
				
				let gesTokenObj = BindingX.bind({
					anchor:anchor,
					eventType:'pan',
					props: [
						{element:leftRef, property:'transform.translateY',expression: touch_origin1},
						{element:rightRef, property:'transform.translateY',expression: touch_origin_1},
						{element:swiperRef, property:'transform.translateY',expression: touch_origin0},
						{element:swiperRef, property:'transform.translateX',expression: `${move}!=0 && ${move}*x>0 ?x+${this.distanceX} : ${this.distanceX}`},
						{element:leftRef, property:'transform.translateX',expression: `${move}!=0&& ${move*this.distanceX}<=0&&x+${this.distanceX}<393?x+${this.distanceX} : ${this.distanceX}`},
						{element:rightRef, property:'transform.translateX',expression: `${move}!=0&& ${move*this.distanceX}<=0&&x+${this.distanceX}>-393?x+${this.distanceX} : ${this.distanceX}`}
					]
				}, (e) => {
					if(e.state === 'end') {
						this.touchType = null
						
						//上下
						if(move==0&& Math.abs(e.deltaY)>this.startDistance){
							let newTime = new Date()
							let quickMove = newTime.getTime() - this.oldTime.getTime() <= this.minTime ? true:false
							
							
							// 记录当前坐标
							/* let distance
							if(this.distanceX==0){
								distance = this.distance + e.deltaY
							}else if(this.distanceX>0){
								distance = this.distance1 + e.deltaY
							}else{
								distance = this.distance_1 + e.deltaY
							}
							if(distance>0 || distance-this.sysheight<-this.sysheight*this.videoList.length) return */
							// 记录当前坐标
							let distance
							if(this.distanceX==0){
								distance = this.distance + e.deltaY
								if(distance>0 || distance-this.sysheight<-this.sysheight*this.videoList.length) return
							}else if(this.distanceX>0){
								distance = this.distance1 + e.deltaY
								if(distance>0 || distance-this.sysheight<-this.sysheight*this.videoList1.length) return
							}else{
								distance = this.distance_1 + e.deltaY
								if(distance>0 || distance-this.sysheight<-this.sysheight*this.videoList_1.length) return
							}
							
							this.bindTiming(distance,e.deltaY,quickMove)
						}
						if(move!=0&& move*this.distanceX<=0&& e.deltaX*this.distanceX<=0&& Math.abs(e.deltaX)>this.startDistance){
							const distance = this.distanceX + e.deltaX
							
							this.bindTimingX(distance,e.deltaX)
							
							console.log("=============="+this.distanceX)
							this.pushVideoList();
						}
					}
				})
				// 记录下取消的token 多次 ontouchstart 时要带着 token 把上次的解绑
				this.gesToken = gesTokenObj.token
			}
			
		},
		bindTiming(distance,Y,quickMove){
			console.log(Math.abs(Y))
			// 开始执行动画
			this.scroll = true
			let swiperRef
			
			if(this.distanceX<0){
				swiperRef =  this.getEl(this.$refs.right)
			}else if(this.distanceX>0){
				swiperRef = this.getEl(this.$refs.left)
			}else{
				swiperRef = this.getEl(this.$refs.swiper)
			}
			console.log(swiperRef)
			let sysheight = this.sysheight
			
			let changed_Y, final_Y, translate_Y_origin
			let d
			if(this.distanceX==0){
				d = this.distance
			}else if(this.distanceX>0){
				d = this.distance1 
			}else{
				d = this.distance_1
			}
			// 生成表达式逻辑
			if( Math.abs(Y)<=this.backDistance&&!quickMove) {
				// 往上下拖动20以内时
				final_Y = d	// 回到原点
				changed_Y = final_Y - d    // 计算出需要位置的值
				translate_Y_origin = `easeOutExpo(t,${d},${changed_Y},300)` // 运动曲线为easeOutElastic
			} else{
				// 往上下拖动超过一半时
				final_Y = d + (Y>0?1:-1) *this.sysheight
				changed_Y= final_Y - d// 计算出需要位置的值
				translate_Y_origin = `easeOutExpo(t,${d},${changed_Y},300)` // 运动曲线为easeOutExpo
			}
			let result = BindingX.bind({
				eventType:'timing',       // 结束的时候是没有任何监听的 用 timing 来做定时的动画
				exitExpression:"t>300",  // 当时间超过 300ms 结束动画
				props: [
					{element:this.getEl(this.$refs.right), property:'transform.translateX',expression:`easeOutExpo(t,${this.distanceX},${0},0)`},
					{element:this.getEl(this.$refs.left), property:'transform.translateX',expression:`easeOutExpo(t,${this.distanceX},${0},0)`},
					{element:this.getEl(this.$refs.swiper), property:'transform.translateX',expression:`easeOutExpo(t,${this.distanceX},${0},0)`},
					{element:swiperRef, property:'transform.translateY',expression:translate_Y_origin},
					]
				},async (e) => {
					if(e.state === 'end' || e.state === 'exit') {
						if(this.distanceX==0){
							this.distance = final_Y
						}else if(this.distanceX>0){
							this.distance1 = final_Y
						}else{
							this.distance_1 = final_Y
						}

						this.scroll = false
						if( Math.abs(Y)>this.backDistance||quickMove) {
							this.videoPlay()
							//加载视频
							if(this.videoList.length - this.index - 1 <= this.playCount){
								//await this.pushVideoList()
							}
						}else if(Math.abs(Y)<=this.backDistance&&!quickMove){
							if(this.distanceX==0){
								let index = -d/this.sysheight
								
								this.videoList[index].flag = true
							}else if(this.distanceX>0){
								let index = -d/this.sysheight
								
								this.videoList1[index].flag = true
							}else{
								let index = -d/this.sysheight
								
								this.videoList_1[index].flag = true
							}
						}
						
						
					}
			})
		},
		click1(e){
			e.stopPropagation();
			if(this.distanceX > 0){//同城
				return;
			}
			this.bindTimingX(this.distanceX,393-this.distanceX)
		},
		click0(e){
			e.stopPropagation();
			if(this.distanceX == 0){//推荐
				return;
			}
			this.bindTimingX(this.distanceX,0-this.distanceX)
		},
		click_1(e){
			e.stopPropagation();
			if(this.distanceX < 0){//关注
				return;
			}
			this.bindTimingX(this.distanceX,-393-this.distanceX)
		},
		bindTimingX(distance,X,time=300){
			// 开始执行动画
			this.scroll = true
			let swiperRef = this.getEl(this.$refs.swiper)
			let leftRef = this.getEl(this.$refs.left)
			let rightRef = this.getEl(this.$refs.right)
			let width = parseInt(this.width) 
			
			let changed_X, final_X, origin
			
			// 生成表达式逻辑
			if( Math.abs(X)<=10) {
				final_X = this.distanceX	// 回到原点
				changed_X = final_X - distance    // 计算出需要位置的值
				origin = `easeOutExpo(t,${distance},${changed_X},300)` // 运动曲线为easeOutElastic
			} else{
				final_X = this.distanceX + (X>0?1:-1) *width
				changed_X= final_X - distance// 计算出需要位置的值
				origin = `easeOutExpo(t,${distance},${changed_X},300)` // 运动曲线为easeOutExpo
			}
			let result = BindingX.bind({
				eventType:'timing',       // 结束的时候是没有任何监听的 用 timing 来做定时的动画
				exitExpression:`t>${time}`,  // 当时间超过 300ms 结束动画
				props: [
					{element:swiperRef, property:'transform.translateX',expression:origin},
					{element:swiperRef, property:'transform.translateY',expression:`easeOutExpo(t,${this.distance},0,200)`},
					{element:leftRef, property:'transform.translateX',expression:origin},
					{element:rightRef, property:'transform.translateX',expression:origin}
					]
				},async (e) => {
					if(e.state === 'end' || e.state === 'exit') {
						this.distanceX = final_X
						this.scroll = false
						this.videoPlay()
						if(Math.abs(X)>393) this.bindTimingX(this.distanceX,Math.abs(X)/X*100)
					}
			})
		},
		bindCurrentX(current,time=300) {
			if(this.distanceX!=0) return
			this.scroll = true
			let swiperRef = this.getEl(this.$refs.swiper)
			let changed_Y, final_Y, origin
			
			final_Y = this.distance + (this.index-current) *this.sysheight
			changed_Y= final_Y - this.distance // 计算出需要位置的值
			time = time * Math.abs(this.index-current)
			origin = `easeOutExpo(t,${this.distance},${changed_Y},${time})` // 运动曲线为easeOutExpo
		
			
			
			let result = BindingX.bind({
				eventType:'timing', // 结束的时候是没有任何监听的 用 timing 来做定时的动画
				exitExpression:`t>${time}`, // 当时间超过 300ms 结束动画
				props: [
					{element:swiperRef, property:'transform.translateY',expression:origin},
				]
				},async (e) => {
					if(e.state === 'end' || e.state === 'exit') {
						this.distance = final_Y
						this.scroll = false
						
						for (let item of this.videoList) {
							item.flag = false
						}
						this.index = -this.distance/this.sysheight
						setTimeout(()=>{
							this.videoList[this.index].flag = true
						},200)
						
						//加载视频
						if(this.videoList.length - this.index - 1 <= this.playCount){
							//await this.pushVideoList()
						}
						
						
					}
				
			})
		},
		// pauseVideo(val){
		// 	if(typeof this.videoList[this.oldIndex].initialTime !='undefined') this.videoList[this.oldIndex].initialTime = val
		// },
		clickVideo(){
			let flag = false
			this.videoList_1.forEach((item)=>{
				if(item.flag){
					item.flag = false
					flag = true
				} 
			})
			this.videoList1.forEach((item)=>{
				if(item.flag){
					item.flag = false
					flag = true
				} 
			})
			this.videoList.forEach((item)=>{
				if(item.flag){
					item.flag = false
					flag = true
				} 
			})
			if(!flag) this.videoPlay()
		},
		videoPlay(){
			let promise = new Promise((resolve,reject)=>{
				resolve()
			})
			promise.then(res=>{
				this.videoList_1.forEach((item)=>item.flag=false)
				this.videoList1.forEach((item)=>item.flag=false)
				this.videoList.forEach((item)=>item.flag=false)
				
				let videoOneData = {};
				let videoOneDataLength = 0;
				if(this.distanceX==0){
					let index = -this.distance/this.sysheight
					this.videoList[index].flag = true
					
					this.videoNowIndex = index;
					//判断用户是否点赞/是否关注
					videoOneData = this.videoList[index];
					videoOneDataLength = this.videoList.length;
				}else if(this.distanceX>0){
					let index = -this.distance1/this.sysheight
					this.videoList1[index].flag = true
					
					this.videoNowIndex = index;
					//判断用户是否点赞/是否关注
					videoOneData = this.videoList1[index];
					videoOneDataLength = this.videoList1.length;
				}else{
					let index = -this.distance_1/this.sysheight
					this.videoList_1[index].flag = true
					
					this.videoNowIndex = index;
					//判断用户是否点赞/是否关注
					videoOneData = this.videoList_1[index];
					videoOneDataLength = this.videoList_1.length;
				}
				
				//请求后台是否关注和点赞
				this.getByVideoIdMyMsgFlag(this.distanceX,this.videoNowIndex,videoOneData.userId,videoOneData.id);
				//判断是否需要加载视频
				if(videoOneDataLength - this.videoNowIndex - 1 <= this.playCount){
					this.pushVideoList()
				}
				
				return;
			})
		},
	},
	watch:{
		index(newVal,oldVal){
			this.oldIndex = oldVal
		}
	}
}