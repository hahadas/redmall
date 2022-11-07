import { mapState } from "vuex"
import url from "@/common/http/url.js"
// #ifdef APP-PLUS
import { selectInformationType, addDataToSessionTable, updateSessionInformation, updateInformation, addDataToChatTable } from "@/common/im/db.js"
import { getUUID } from "@/common/utils/index.js"
// #endif
export default{
	data(){
		return{
			conversationId: "", // 会话id
			onlineType: "",
			isOnline: false
		}
	},
	computed: {
		...mapState(["userInfo", "interactionOnlineStatus"])
	},
	watch: {
		interactionOnlineStatus(val){
			console.log("interactionOnlineStatus.....", val)
			let content = JSON.parse(val.content)
			if (content.type === this.onlineType){
				this.isOnline = val.isOnline
			}
		}
	},
	methods: {
		// 对方是否在线
		isOtherOnline(toImAccount, type){
			// #ifdef APP-PLUS
			this.onlineType = type
			// 发送一条消息，判断对方是否在线
			let sendParams = {
				from: this.userInfo.imAccount,
				to: toImAccount,
				cmd:11,
				chatType: 2,
				msgType: 88, 
				content: JSON.stringify({type: type})
			}
			let name = type + "SendMsg"
			uni.setStorageSync(name, sendParams)
			getApp().globalData.socket.sendSocketMessage(sendParams)
			// #endif
		},
		// 获取会话消息
		sessionOperation(toImAccount, type, callBack){
			// #ifdef APP-PLUS
			this.$http("GET", url.im.createConversation, {toImAccount: toImAccount, type: type}).then(doc =>{
				this.conversationId = doc.data.id
				selectInformationType(null, 'id', this.conversationId).then(selectRes=>{
					let data = doc.data
					if (selectRes.length === 0) {
						console.log("本地数据库无数据")
						data.localUnreadNumber = data.unreadNumber || 0
						addDataToSessionTable(data)
					} else {
						console.log("本地数据库有数据")
						data.localUnreadNumber = (data.localUnreadNumber || 0) + (data.unreadNumber || 0)
						updateSessionInformation(data, 'id', data.id)
					}
				})
				if (callBack) callBack()
			})
			// #endif
		},
		// 发送消息
		sendMsgToOther(toImAccount, goodsInfo, msgType, type, callBack){
			if (!toImAccount || !msgType || !type) return
			let _this = this
			let uid = getUUID() + this.userInfo.recommendCode
			let params = {
				conversationId: this.conversationId,
				id: uid,
				uid: uid,
				from: this.userInfo.imAccount,
				to: toImAccount,
				cmd:11,
				createTime: new Date().getTime(),
				chatType: 2,
				msgType: msgType,
				content: JSON.stringify({
					type: type,
					...goodsInfo
				})
			};
			getApp().globalData.socket.sendSocketMessage(params)
			
			setTimeout(()=>{
				let submitParams = {
					conversationId: _this.conversationId,
					uid: params.uid,
					chatType: params.msgType,
					content: params.content,
					toImAccount: toImAccount,
					unread: _this.isOnline ? 1 : 2,
					type: type
				}
				_this.$http("POST", url.im.submitMsg, submitParams).then(res =>{
					addDataToChatTable(params)
					if (callBack){
						callBack()
					}
				})
			}, 300)
		},
		// 邀请/取消配送时，修改数据库对应数据
		editDBData(orderId, status){
			// 查询
			selectInformationType("chatList", "conversationId", this.conversationId, "msgType", 6).then(res => {
				if (res.length > 0) {
					res.map(v => {
						// 修改
						let content = JSON.parse(content)
						if (parseInt(content.orderId) === parseInt(orderId)) {
							content.status = status
							updateInformation("chatList", "content", JSON.stringify(content), "uid", v.uid)
						}
					})
				}
			})
		}
	}
}