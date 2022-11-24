<script>
	import { mapMutations, mapState } from "vuex"
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import UniSocket from "@i5920/uni-socket";
	import { imUrl, staticUrl } from "@/common/http/index.js"
	import { getUUID, versionCompare, getMacAddress } from "@/common/utils/index.js"
	// #ifdef APP-PLUS
	import { 
		isOpenDB, 
		openDB, 
		createSessionListSQL,
		createChatListSQL, 
		addDataToChatTable, 
		addDataToSessionTable, 
		selectInformationType,
		updateSessionInformation,
		updateInformation,
		getUnReadTotal
	} from "@/common/im/db.js"
	const call = uni.requireNativePlugin('Html5App-TencentCall');
	const music = uni.createInnerAudioContext(); //创建播放器对象
	const upDater=uni.requireNativePlugin("CL-UpDater"); // 版本升级
	let shockTimer = null
	let failNumber = 0
	// #endif
	
	// #ifndef APP-PLUS
	import {
		tableIshas,
		addDataToChatTable, 
		addDataToSessionTable, 
		selectInformationType,
		updateSessionInformation,
		updateInformation,
		getUnReadTotal
	} from "@/common/im/db-h5.js"
	// #endif
	
	// ---------------------------------------推送权限开启------------------------------------ //
	function permissions () {
		var btnArray = ["取消", "去设置"];
		// #ifdef APP-PLUS  
		if (plus.os.name == 'Android') {  // 判断是Android
			var main = plus.android.runtimeMainActivity();
			var pkName = main.getPackageName();
			var uid = main.getApplicationInfo().plusGetAttribute("uid");
			var NotificationManagerCompat = plus.android.importClass("android.support.v4.app.NotificationManagerCompat");
			var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
			// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置  
			if (!areNotificationsEnabled) {
				uni.showModal({
					title: "通知权限开启提醒",
					content: "您还没有开启通知权限，无法接受到消息通知，是否前往设置？",
					confirmText: "去设置",
					cancelText: "取消",
					success(e) {
						if (e.confirm) {
							var Intent = plus.android.importClass('android.content.Intent');
							var Build = plus.android.importClass("android.os.Build");
							//android 8.0引导  
							if (Build.VERSION.SDK_INT >= 26) {
								var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
								intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
							} else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  
								var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
								intent.putExtra("app_package", pkName);
								intent.putExtra("app_uid", uid);
							} else { //(<21)其他--跳转到该应用管理的详情页  
								intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
								var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
								intent.setData(uri);
							}
							// 跳转到该应用的系统通知设置页  
							main.startActivity(intent);
						}
					}
				})
			}
		} else if (plus.os.name == 'iOS') {   // 判断是ISO
			var isOn = undefined;
			var types = 0;
			var app = plus.ios.invoke('UIApplication', 'sharedApplication');
			var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
			if (settings) {
				types = settings.plusGetAttribute('types');
				plus.ios.deleteObject(settings);
			} else {
				types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
			}
			plus.ios.deleteObject(app);
			isOn = (0 != types);
			if (isOn == false) {
				uni.showToast({
					title: "未开启通知权限，无法及时收到消息通知",
					icon: "none"
				})
			}
		}
		// #endif  
	}
	
	export default {
		data(){
			return {
				setInterval: null,
				token: "",
				argsData: null,
				isSynchroSuccess: false,
				localUnReadNum: 0,
				globalData: {},
				staticUrl: staticUrl
			}
		},
		computed:{
			...mapState(["reminderStatus"]),
			statusBarHeight(){
				return uni.getSystemInfoSync().statusBarHeight
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			
			let _this = this
			// 获取缩略图比列
			this.$http("GET", url.common.getOssImageResize).then(res =>{
				uni.setStorageSync("ossResizeData", res.data)
			})
			
			// 判断用户信息时候完善
			let userInfo = uni.getStorageSync("userInfo")
			if (userInfo) {
				let examineAvatar = null
				if (userInfo.userResources && userInfo.userResources.length > 0) {
					userInfo.userResources.forEach(v=>{
						if (v.type === 0){
							examineAvatar = v.ossUrl
							return false
						}
					})
				}
				// 如果用户没上传头像/没有审核中的头像、性别、昵称、出生年月则去个人中心完善信息
				if ((!userInfo.headPortrait && !examineAvatar) || !userInfo.gender || !userInfo.birthDate || !userInfo.nickname){
					this.$msg("您的信息未完善，请先完善信息")
					this.$navigateTo("/pages/user/setting/personal")
				}
			}
			
			let token = uni.getStorageSync('token')
			this.token = token
			if (token) {
				// 初始化webSocket数据
				this.initIMClientText()
				// #ifdef APP-PLUS
				// 更新设备信息
				this.updateDeviceInfo()
				// 打开数据库,并创建表
				openDB(()=>{
					createSessionListSQL()
					createChatListSQL()
					getUnReadTotal().then(num=>{
						_this.localUnReadNum = num
					})
				})
				// #endif
				
				// #ifndef APP-PLUS
				tableIshas()
				_this.localUnReadNum = getUnReadTotal()
				// #endif
			}
			
			// #ifdef APP-PLUS
			// 中间按钮点击
			uni.onTabBarMidButtonTap(function(e) {
				let userInfo = uni.getStorageSync('userInfo');
				uni.navigateTo({
					url: '/pages/video/index?userId=' + userInfo.id
				})
			});
			
			// 如果用户是配送员并且有待接订单则提示声音
			this.agentShowMusic()
			
			// 检测推送权限
			permissions()
			
			// 获取位置
			this.openMap()
			// 判断升级
			this.versionApp()
			// #endif
			
		},
		onShow: function() {
			console.log('App Show')
			
			// #ifdef APP-PLUS
			// APP隐私用户协议
			let isAgree = uni.getStorageSync("agreePrivacy")
			if (!isAgree) {
				uni.navigateTo({
					url: "/pages/user/setting/privacy"
				})
			}
			
			if (this.token) {
				this.globalData.socket.initSocket();
			}
			
			/**
			* 通过（plus.runtime.arguments）获取到内容后，先判断是否存在数据，是否存在对应的key再进行对应的操作，否则报错了app会异常
			* 监听点击通知栏消息进入app后，获取对应的消息执行对应的跳转格式：
			* jumpMode=(1-4)跳转方式 1-navigateTo 2-switchTab 3-redirectTo(关闭当前页面，跳转到应用内的某个页面) 4-reLaunch(关闭所有页面，打开到应用内的某个页面)
			* route=跳转路径
			* */
			let _this = this
			setTimeout(function(){   
			    let args = plus.runtime.arguments;  
				plus.runtime.arguments = null;
				plus.runtime.arguments = "";
				_this.argsData = args
				_this.pushDataHandle()
			},50);
			// #endif
			
		},
		onHide: function() {
			console.log('App Hide')
			// #ifdef APP-PLUS
			if (isOpenDB()) {
				getUnReadTotal().then(number =>{
					plus.runtime.setBadgeNumber(number)
				})
			}
			// #endif
		},
		onUnload() {
			console.log('App Unload')
			this.closeInterval()
			this.closeSocket();
		},
		methods:{
			...mapMutations(["setHandNewMsg", "setUnReadNum", "setReceiveMessage", "setOtherOnlineStatus", "setInteractionOnlineStatus"]),
			// 推送消息处理
			pushDataHandle(){
				if(this.argsData && this.isSynchroSuccess){
					let args = JSON.parse(this.argsData)
					this.argsData = null
					let router = args.route
					if (router && router.indexOf("*") > -1) {
						let split = router.split("*")
						router = split.join("/")
					}
					console.log("router........", router)
					let currentPages = getCurrentPages();
					let curRoute = currentPages[currentPages.length - 1].route
					
					if (args.jumpMode === "1") {
						let newRouter = router
						if (newRouter.indexOf("?") > -1) {
							newRouter = router.split("?")[0]
						}
						console.log("...////.......", newRouter, curRoute, router)
						if (newRouter === ("/" + curRoute)) {
							uni.redirectTo({
								url: router
							})
						} else {
							uni.navigateTo({
								url: router
							})
						}
					} else if (args.jumpMode === "2") {
						uni.switchTab({
							url: router
						})
					} else if (args.jumpMode === "3") {
						uni.redirectTo({
							url: router
						})
					} else {
						uni.reLaunch({
							url: router
						})
					}
				}  
			},
			initIMClientText(){
				let _this = this
				this.globalData.socket = new UniSocket({
					url: imUrl+uni.getStorageSync('token'),
					timeout: 30 * 1000,   // 心跳时间间隔
					isSendHeart: true,        // 是否发送心跳
					heartData: {			// 心跳数据
						cmd: 13,
						hbyte: "a"
					},
					isReconnection:true,      // 是否断线重连
					reConnectTime: 3000,      // 断线重连检测时间间隔
					params: {},               // 发送消息时如果时json则自动加上组合里面参数
					// debug: process.env.NODE_ENV === "development",
					onSocketOpen: header => {
						console.log(">...............////////,,,,,,,,,,,,,,,,,,")
						_this.setUnReadNum(0)
						_this.unreadConversationMsg()
					},
					onSocketMessage: async (data) => {
						console.log(".......UniSocket...收到的消息。。。。。", data)
						let command = data.command 
						if (command === 11) { // 接收消息
							_this.onNewMessage(data.data)
						} else if (command === 12) {
							// 对方是否在线，true在线，false不在线
							let status = data.code === 10000 ? true : false
							_this.setOtherOnlineStatus(status)
							_this.onlineStatusSendMsg("userSendMsg", status)	// 用户个人中心
							_this.onlineStatusSendMsg("imChatSendMsg", status)	// 聊天
							_this.onlineStatusSendMsg("userOrderDetailSendMsg", status)	// 订单详情
							_this.onlineStatusSendMsg("selectAgentSendMsg", status) // 用户确认接单
							_this.onlineStatusSendMsg("userCancelSendMsg", status) // 用户取消接单
							_this.onlineStatusSendMsg("agentConfirmSendMsg", status) // 配送员确认接单
							_this.onlineStatusSendMsg("agentCancelSendMsg", status) // 配送员取消接单
							_this.onlineStatusSendMsg("refundSendMsg", status) // 用户/商家退款
							_this.onlineStatusSendMsg("placeOrderSendMsg", status) // 用户下单
						}
					}
				});
			},
			onlineStatusSendMsg(name, status){
				let data = uni.getStorageSync(name)
				if (data) {
					data.isOnline = status
					this.setInteractionOnlineStatus(data)
					uni.removeStorageSync(name)
				}
			},
			closeSocket(){
				this.globalData.socket.closeSocket();
			},
			// 同步未读消息
			async unreadConversationMsg(){
				let res = await this.$http("GET", url.im.unreadConversationMsg)
				console.log("同步未读消息...", res)
				let list = JSON.parse(JSON.stringify(res.data))
				list.reverse()
				for(let i = 0; i<list.length; i++){
					let obj = list[i]
					// 查找会话表中是否存在该会话
					let selectRes = await selectInformationType(null, 'id', obj.id)
					if (selectRes.length === 0) {
						obj.localUnreadNumber = obj.unreadNumber
						await addDataToSessionTable(obj)
					} else {
						obj.localUnreadNumber = selectRes[0].localUnreadNumber + obj.unreadNumber
						await updateSessionInformation(obj, 'id', obj.id)
					}
					obj.unreadMsgList.reverse()
					for(let j = 0; j < obj.unreadMsgList.length; j++){
						let unReadData = obj.unreadMsgList[j]
						// 查找聊天表中是否存在该信息
						let chatData = await selectInformationType("chatList", 'uid', unReadData.uid)
						console.log("存在该数据。。。。。。。。。。。",chatData)
						if (chatData.length === 0){
							unReadData.from = obj.toImAccount
							unReadData.to = obj.imAccount
							unReadData.msgType = parseInt(unReadData.chatType)
							await addDataToChatTable(unReadData)
						}
						if (parseInt(unReadData.chatType) === 6) {
							let JSONContent = JSON.parse(unReadData.content)
							let chatList = await selectInformationType("chatList", "conversationId", obj.id, "msgType", 6)
							for(let k = 0; k < chatList.length; k++){
								let chatData = chatList[k]
								let con = JSON.parse(chatData.content)
								if (parseInt(con.orderId) === parseInt(JSONContent.orderId)) { // 如果聊天消息中存在同一个商品，则修改该消息的商品状态
									con.status = JSONContent.status
									await updateInformation("chatList", "content", JSON.stringify(con), "uid", chatData.uid)
								}
							}
						}
					}
				}
				this.setSessionUnReadNumber()
				let total = await getUnReadTotal()
				console.log("...........同步消息获取未读消息数量。。。。", total)
				this.setUnReadNum(total)
				plus.runtime.setBadgeNumber(total)
				if (total > 0) {
					uni.setTabBarBadge({
						index: 2,
						text: total + ''
					})
				} else {
					uni.removeTabBarBadge({
						index: 2
					})
				}
				
				this.isSynchroSuccess = true
				this.pushDataHandle()
				
				// 回调
				this.$http("POST", url.im.unreadSuccessCallback)
			},
			// 设置会话未读消息条数
			async setSessionUnReadNumber(){
				// #ifdef APP-PLUS
				let res = await selectInformationType(null)
				if (res.length > 0) {
					res.forEach(v => {
						publics.setConversationUnReadNum(v.id, v.localUnreadNumber)
					})
				}
				// #endif
			},
			async onNewMessage(message) {
				console.log("新的消息。。。", message)
				let _this = this
				let content = JSON.parse(message.content)
				// msgType 0-文字信息 1-图片 2-语音 3-地址 4-视频 5-视频/语音通话 6-商品 7-用户/商家申请退款 8-用户下单 77-直推人奖励提示音 88-对方是否在线 99-撤回
				if (message.msgType === 77 && content.musicUrl) {
					music.loop = false; //循环播放
					music.src = content.musicUrl; // 提示音
					music.play()
					return false
				}
				if (message.msgType !== undefined && message.msgType !== 88) {
					let res = await this.$http("GET", url.im.getConversationItExist, {toImAccount: message.from, type: content.type})
					if (res.data) {
						if (message.msgType !== 5 && message.msgType !== 8 || (message.msgType === 6 && content.status !== 1)) {
							_this.msgOrderPromptTone(1)
						}
						if (message.msgType === 6 && content.status === 1) {
							_this.msgOrderPromptTone(3)
						}
						if (message.msgType === 8) {
							_this.msgOrderPromptTone(4)
						}
						let conversation = JSON.parse(JSON.stringify(res.data))
						message.conversationId = conversation.id
						message.uid = message.id
						// #ifdef APP-PLUS
						if (message.msgType === 5){
							let videoCallMyStatus = uni.getStorageSync("VideoCallMyStatus");
							if (content.text==="已挂断" || content.text==="忙线中"){
								this.closeCall()
								if (videoCallMyStatus === 0 && content.text==="已挂断"){
									uni.navigateBack()
								}
							}
							if (content.text==="视频通话" || content.text==="语音通话"){
								if(videoCallMyStatus === 1){//通话中，告诉对方忙线
									this.sendVideoMsg(message, {text: "忙线中"})
								} else { //空闲
									this.msgOrderPromptTone(2)
									setTimeout(function() {
										music.stop();//定时25秒关闭停止铃声
									}, 1000*25);
									let data = {
										nickname: content.type ? conversation.storeName : conversation.nickname,
										avatar: conversation.headPortrait,
										message: message
									}
									uni.setStorageSync("callVideoData", JSON.stringify(data))
									uni.navigateTo({
										url: "/pages/imPopup",
										animationType: "fade-in"
									})
								}
							}
						}
						// #endif
						if (message.msgType === 6) {
							let list = await selectInformationType("chatList", "conversationId", conversation.id, "msgType", 6)
							if (list.length > 0) {
								list.map(v => {
									// 修改
									let JSONContent = JSON.parse(v.content)
									if (parseInt(JSONContent.orderId) === parseInt(content.orderId)) {
										JSONContent.status = content.status
										updateInformation("chatList", "content", JSON.stringify(JSONContent), "uid", v.uid)
									}
								})
							}
						}
						
						// 添加数据到聊天表
						await addDataToChatTable(message)
						
						// 设置当前会话未读消息数量进缓存
						let cIdNum = publics.getConversationUnReadNum(conversation.id)
						cIdNum = cIdNum + 1
						publics.setConversationUnReadNum(conversation.id, cIdNum)
						
						// 会话表是否存在该会话，没有插入数据，有则更新数据
						let doc = await selectInformationType(null, 'id', conversation.id)
						if (doc.length === 0) {
							conversation.localUnreadNumber = conversation.unreadNumber + 1
							await addDataToSessionTable(conversation)
						} else {
							conversation.localUnreadNumber = doc[0].localUnreadNumber + 1
							await updateSessionInformation(conversation, 'id', conversation.id)
						}
						// 更新新消息
						_this.setReceiveMessage(message)
						// 是否有新的消息
						_this.setHandNewMsg(true)
						
						_this.localUnReadNum++
						let total = _this.localUnReadNum
						_this.setUnReadNum(total)
					}
		
				}

			},
			// 发送视频通话消息
			sendVideoMsg(message, content){
				let userInfo = uni.getStorageSync("userInfo")
				let con = message.content
				if (typeof con === "string") {
					con = JSON.parse(message.content)
				}
				let params = {
					conversationId: message.conversationId,
					id: getUUID()+userInfo.recommendCode,
					from: message.to,
					to: message.from,
					cmd:11,
					createTime: new Date().getTime(),
					chatType: 2,
					content: JSON.stringify({...content, type: con.type, callType: con.callType}),
					msgType: 5
				};
				params.uid = params.id
				this.setReceiveMessage(params)
				addDataToChatTable(params)
				this.globalData.socket.sendSocketMessage(params)
				this.$http("POST", url.im.submitMsg, {
					conversationId: params.conversationId,
					uid: params.uid,
					chatType: params.msgType,
					content: params.content,
					toImAccount: message.from,
					unread: 1,
					type: con.type
				})
			},
			async callVideo(message, callback) {
				let _this = this
				console.log("callvideo......", message)
				if (typeof message.content === "string"){
					message.content = JSON.parse(message.content)
				}
				let videoCallStatus = true;
				let res = await this.$http("GET", url.im.getVideoKey, {toImAccount: message.to})
				let data = res.data
				if (data) {
					call.openCall({
						"type": 1, //1 代表对一对一界面,0 代表默认界面  
						"callType": message.content.callType, // video 是视频，voice 是语音通话
						"roomid": message.content.roomId, //房间号, 数字
						"username": data.toInfo.nickname, //对方的用户昵称
						"useravatar": data.toInfo.headPortrait, //对方的头像
						"myname": data.myInfo.nickname, //我的昵称
						"myavatar": data.myInfo.headPortrait, //我的头像
						"userid": data.myInfo.tenCentUserId, // 我的腾讯云通话用户id
						"usersig": data.myInfo.tenCentUserSig //用户名加密串
					}, ret => {
						console.log("腾讯视频通话================================");
						console.log(JSON.stringify(ret));
						if (callback) callback(ret)
						if(ret.code == 4){//拨号成功\进入房间成功
							//更新本地我的通话状态-通话中
							uni.setStorageSync("VideoCallMyStatus",1);
						}else if(ret.code == 1){//发起方取消通话
							music.stop()
							videoCallStatus = false;
							//更新本地我的通话状态-无通话
							uni.setStorageSync("VideoCallMyStatus",0);
						}else if(ret.code == 6){//对方
							music.stop()
							//更新本地我的通话状态-无通话
							uni.setStorageSync("VideoCallMyStatus",0);
						}else if(ret.code == 5){//用户已进入房间
							music.stop()
							//取消延迟无人接听挂断
							videoCallStatus = false;
						}
					});
					
					//25秒无人接听则挂断电话
					setTimeout(function(){
						if(videoCallStatus){
							_this.closeCall()
							//更新本地我的通话状态-无通话
							uni.setStorageSync("VideoCallMyStatus",0);
						}
					},1000*25);
				}
			},
			closeCall(){
				call.close();
				this.musicStop()
			},
			closeInterval(){
				if (this.setInterval) {
					clearInterval(this.setInterval)
					this.setInterval = null
				}
			},
			// 更新设备信息
			updateDeviceInfo(){
				let clientInfo = plus.push.getClientInfo()
				let systemInfo = uni.getSystemInfoSync()
				let params = {
					appId: clientInfo.appid,
					appKey: clientInfo.appkey,
					clienetId: clientInfo.clientid,
					pushId: clientInfo.id,
					token: clientInfo.token,
					deviceChannel: systemInfo.platform,
					deviceName: systemInfo.brand,
					deviceVersion: systemInfo.model
				}
				this.$http("POST", url.user.updateUniappClientInfo, params).then(res => {
					if (!res.data && failNumber < 10) {
						failNumber++
						setTimeout(()=>{
							this.updateDeviceInfo()
						}, 2000)
					}
				})
			},
			openMap() {
				let _this = this
				_this.closeInterval()
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: async function(res) {
						//设置地址
						publics.setMyaddressLngLat(JSON.stringify(res));
						let e = await publics.getPositionToLngAndLat(res.longitude, res.latitude)
						let address = res.address
						console.log(res, "....")
						let token = uni.getStorageSync("token")
						if (token) {
							_this.$http("POST", url.user.updateAddress, {
								adcode: e.result['ad_info'].adcode,
								showLng: res.longitude,
								showLat: res.latitude,
								showAddress: address.province+address.city+address.district+address.street+address.streetNum,
								showAdname: address.poiName,
								deviceId: plus.device.uuid,	// 设备id
								deviceMac: getMacAddress(),	// 设备mac地址
								deviceChannel: uni.getSystemInfoSync().platform || "", // 客户端类型
								deviceName: uni.getSystemInfoSync().brand || "",		// 设备名称
								deviceVersion: uni.getSystemInfoSync().model || "",	// 设备型号
							}).then((r)=>{
								if (r.code === 200) {
									let num = Math.floor(Math.random()*160+20) // 最低20秒 最高3分钟
									_this.setInterval = setTimeout(()=>{
										_this.openMap()
									}, num*1000)
								}
							})
						}
					},
					fail: function(err) {
						// #ifdef APP-PLUS
						console.log("获取位置失败。。。。", err)
						// _this.$msg("获取位置失败,请检查定位服务是否开启，或持设备到相对开阔的露天场所再次尝试", 8000);
						// #endif
					}
				});
			},
			// type-类型 issue-是否是自己发出
			msgOrderPromptTone(type, issue) {
				let reminderStatus = uni.getStorageSync("reminderStatus") || this.reminderStatus
				console.log("........reminderStatus........", reminderStatus)
				if (reminderStatus.length === 0) return
				if (type == 1) {
					music.loop = false; //循环播放
					music.src = this.$staticUrl + "music/msg.mp3"; // 新消息提示
				} else if (type == 2) {
					music.loop = true; //循环播放
					music.src = this.$staticUrl + "music/video.mp3"; // 视频语音通话
				} else if (type === 3) {
					music.loop = false; //循环播放
					music.src = this.$staticUrl + "music/order.mp3"; // 订单提示
				} else if (type === 4) {
					music.loop = false; //循环播放
					music.src = this.$staticUrl + "music/store.mp3"; // 用户下单商家提示
				}
				if (reminderStatus.indexOf("voice") !== -1){ // 是否开启声音
					music.play(); //执行播放
				}
				
				if (reminderStatus.indexOf("shock") !== -1 && !issue){ // 是否开启震动, 自己发起不震动
					if (type === 1) {
						uni.vibrateLong()
					} else {
						shockTimer = setInterval(()=>{
							uni.vibrateLong()
						}, 600)
					}
				}
			},
			musicStop(){
				music.stop();
				clearInterval(shockTimer)
				shockTimer = null
			},
			agentShowMusic(){
				let userInfo = uni.getStorageSync("userInfo")
				if (userInfo && userInfo.distributorIsOpen) {
					this.$http("GET", url.distributor.distributorWorkOrder, {pageSize: 1, orderStatus: 1}).then(res => {
						if (res.data.total > 0) {
							this.msgOrderPromptTone(3)
						}
					})
				}
			},
			// #ifdef APP-PLUS
			async versionApp(showLoad){
				let res = await this.$http("GET", url.common.getAppVersion)
				let version = plus.runtime.version; // 当前版本
				let iosVersion = res.data["IOS"].keyValue // ios版本
				let androidVersion = res.data["Android"].keyValue // android版本
				console.log(uni.getSystemInfoSync().platform, version, iosVersion, androidVersion)
				if (uni.getSystemInfoSync().platform === "ios"){
					if (!versionCompare(version, iosVersion)) {
						let list = res.data["IOS"].children
						// 1-选择升级 2-强制升级 3-个人中心手动升级 4-忽略升级
						let type = this.getArrayValueByCode(list, "app_version_ios_upgrade")
						let con = this.getArrayValueByCode(list, "app_version_ios_detail")
						let downUrl = this.getArrayValueByCode(list, "app_version_ios_url")
						let options={
							title:"发现新版本",
							con:con,
							downUrl:downUrl,
							hidCancelbtn:false,//是否隐藏取消按钮;
							btnBgColor:"#381895",//设置按钮背景色颜色
							updateBtnText:"立即更新",//升级按钮文字,默认为立即升级
							hidBackBtn:false, //可选 默认为false（即会显示后台更新按钮）， 设置android 整包更新弹框是否显示后台更新按钮，这个只有android整包更新才有这个参数，热更新是是无法设置的。
							// verCode:"1.0.1",//最新apk版本号 可选  用于Android整包升级,避免用户取消安装apk时,重复下载问题,如果不传的话,apk将会重新下载
						}
						if (type === "1" || type === "2" || (showLoad && type === "3")) {
							upDater.startUpdate(options, ()=>{
								if (type === "2") {
									plus.runtime.restart()
								}
							});	
						}
					} 
					if (showLoad) {
						this.$msg("当前已是最新版～")
					}
				} else if (uni.getSystemInfoSync().platform === "android"){
					if (!versionCompare(version, androidVersion)){
						console.log("//////////////")
						let list = res.data["Android"].children
						// 1-选择升级 2-强制升级 3-浏览器升级(暂不用) 4-个人中心手动升级 5-忽略升级
						let type = this.getArrayValueByCode(list, "app_version_android_upgrade")
						let con = this.getArrayValueByCode(list, "app_version_android_detail")
						if (type === "1" || type === "2" || (showLoad && type === "4")) {
							let downUrl = this.getArrayValueByCode(list, "app_version_android_url")
							let options={
								title:"发现新版本",
								con:con,
								downUrl:downUrl,
								hidCancelbtn:false,//是否隐藏取消按钮;
								btnBgColor:"#381895",//设置按钮背景色颜色
								updateBtnText:"立即更新",//升级按钮文字,默认为立即升级
								hidBackBtn:false, //可选 默认为false（即会显示后台更新按钮）， 设置android 整包更新弹框是否显示后台更新按钮，这个只有android整包更新才有这个参数，热更新是是无法设置的。
								// verCode:"1.0.1",//最新apk版本号 可选  用于Android整包升级,避免用户取消安装apk时,重复下载问题,如果不传的话,apk将会重新下载
							}
							upDater.startUpdate(options, ()=>{
								if (type === "2") {
									plus.runtime.quit();
								}
							});	
						}
					}
					if (showLoad) {
						this.$msg("当前已是最新版～")
					}
				}
			},
			getArrayValueByCode(array, code){
				let value = ""
				array.forEach(v=>{
					if (v.keyCode === code){
						value = v.keyValue
						return false
					}
				})
				return value
			},
			// 版本检测更新
			async versionAppFunc(showMsg){
				let _this = this
				let res = await this.$http("GET", url.common.getAppVersion)
				if (res.code === 200) {
					let data = res.data
					let version = plus.runtime.version;
					let address = '';
					let newVersion = '';
					if (uni.getSystemInfoSync().platform === 'ios') {
						address = data.user.ios.address;
						newVersion = data.user.ios.version;
						if (version.trim() !== newVersion.trim()) {
							this.$msg("有新的版本发布,即将自动跳转前往升级");
							if (address.indexOf("itms-apps://") !== -1) {
								//appstore升级
								setTimeout(function() {
									plus.runtime.launchApplication({
										action: address
									}, function(e) {
										console.log('Open system default browser failed: ' + e.message);
									});
								}, 2000);
							} else {
								setTimeout(function() {
									plus.runtime.openURL(address);
								}, 2000);
							}
						}else{
							if (showMsg) this.$msg("当前已是最新版本~~~");
							
						}
					} else {
						address = data.user.android.address;
						newVersion = data.user.android.version;
						if (version.trim() !== newVersion.trim()) {
							if (address.indexOf("https://") !== -1 || address.indexOf("http://") !== -1) {
								//升级
								this.$msg("有新的版本发布,即将自动跳转前往升级");
								setTimeout(function() {
									plus.runtime.openURL(address);
								}, 2000);
							} else {
								//内部升级
								setTimeout(function() {
									_this.AndroidCheckUpdate(address);
								}, 2000);
							}
						}else{
							if (showMsg) this.$msg("当前已是最新版本~~~");
						}
					}
				}
			},
			/*
			* 安卓升级
			*/
			AndroidCheckUpdate(apkId) {
				let updateFlag = uni.getStorageSync("AndroidCheckUpdate") || '';
				if(updateFlag === "true"){
					return;//结束
				}
				let _this = this
				uni.setStorageSync("AndroidCheckUpdate", "true");
				uni.showModal({
					title: "版本更新",
					content: '有新的版本发布，是否立即进行新版本下载？',
					confirmText: '立即更新',
					cancelText: '稍后进行',
					success: function(res) {
						if (res.confirm) {
							uni.request({
								//公孙测的请求地址，设置为自己的服务器链接
								url: 'https://51gsc.com/openapi/downloadurl',
								method: 'POST',
								data: {
									"id": apkId,
									"password": "" //密码默认空
								},
								success: resMz => {
									console.log(resMz);
									if (resMz) {
										if (resMz.data.code == 0) {
											let apkDownLoadUrl = resMz.data.data.url;
											_this.checkVersionToLoadUpdate(apkDownLoadUrl);
										}else{
											_this.$msg("当前更新人数过多,请稍后再更新");
											uni.setStorageSync("AndroidCheckUpdate", "false");
										}
									}
								},
								fail: () => {},
								complete: () => {}
							});
						} else if (res.cancel) {
							console.log('稍后更新');
							uni.setStorageSync("AndroidCheckUpdate", "false");
						}
					}
				});
			},
			/**
			 * 进行版本型号的比对 以及下载更新请求
			 */
			checkVersionToLoadUpdate(apkDownLoadUrl) {
				uni.showToast({
					icon: "none",
					mask: true,
					position: 'top',
					title: '程序已启动自动更新,预计需要1-2分钟,期间不要退出当前APP,新版本下载完成后将自动弹出安装程序',
					duration: 10000
				});
				//设置 最新版本apk的下载链接
				var downloadApkUrl = apkDownLoadUrl;
				var dtask = plus.downloader.createDownload(downloadApkUrl, {}, function(d, status) {
					// 下载完成  
					if (status == 200) {
						plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function(error) {
							uni.setStorageSync("AndroidCheckUpdate", "false");
							uni.showToast({
								title: '安装失败',
								duration: 1500
							});
						})
					} else {
						uni.setStorageSync("AndroidCheckUpdate", "false");
						uni.showToast({
							title: '更新失败',
							duration: 1500
						});
					}
				});
				
				try {
					dtask.start(); // 开启下载的任务
					var prg = 0;
					var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
					dtask.addEventListener('statechanged', function(
						task,
						status
					) {
						// 给下载任务设置一个监听 并根据状态  做操作
						switch (task.state) {
							case 1:
								showLoading.setTitle("正在下载");
								break;
							case 2:
								showLoading.setTitle("已连接到服务器");
								break;
							case 3:
								prg = parseInt(
									(parseFloat(task.downloadedSize) /
										parseFloat(task.totalSize)) *
									100
								);
								showLoading.setTitle("  正在下载" + prg + "%  ");
								break;
							case 4:
								plus.nativeUI.closeWaiting();
								uni.setStorageSync("AndroidCheckUpdate", "false");
								//下载完成
								break;
						}
					});
				} catch (err) {
					plus.nativeUI.closeWaiting();
					uni.showToast({
						title: '更新失败',
						mask: false,
						duration: 1500
					});
					uni.setStorageSync("AndroidCheckUpdate", "false");
				}
			}
			// #endif
		}
	}


</script>


<style>
	@import url("/common/fonts/iconfont.css");
	@import "./common/animate.css";
</style>

<style lang="scss">
	/*每个页面公共css */
	@import url("@/common/base.scss");
	
	page{
		background-color: #F8F8F8;
	}
</style>

