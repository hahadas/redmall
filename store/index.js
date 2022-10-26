import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import url from "@/common/http/url.js"
import { sendRequest } from "@/common/http/api.js"

export default new Vuex.Store({
	state: {
		token: "",
		userInfo: uni.getStorageSync("userInfo") || {},
		imClient: null,
		isOtherOnline: true, // 默认在线
		unReadNum: 0, // 未读消息数量
		isHandNewMsg: false, // 是否有新消息
		receiveMessage: {}, // 接收新消息
		interactionOnlineStatus: {}, // 互动页面专用，用户是否在线
		reminderStatus: uni.getStorageSync("reminderStatus") || ['voice'] // 新消息提醒 voice-声音 shock-震动
	},
	getters:{
		imClient: state => state.imClient
	}, 
	mutations: {
		setToken(state, val){
			state.token = val
			uni.setStorageSync("token", val)
		},
		setUserInfo(state, val) {
			state.userInfo = val
			uni.setStorageSync("userInfo", val)
		},
		async logout(state) {
			try{
				// #ifdef APP-PLUS
				getApp().globalData.socket.sendSocketMessage({cmd: 14, userId: state.userInfo.imAccount})
				getApp().closeSocket()
				getApp().closeInterval()
				// #endif
				await sendRequest("POST", url.login.logout)
				state.userInfo = {}
				state.token = ""
				state.imClient = null
				uni.clearStorageSync()
				uni.setStorageSync("agreePrivacy", true) // 隐私协议不清除
			}catch(err){}
			uni.reLaunch({
				url: "/pages/login/index"
			})
		},
		setImClient(state, data){
			state.imClient = data
		},
		// 更新对方在线状态
		setOtherOnlineStatus(state, data) {
			state.isOtherOnline = data
		},
		setUnReadNum(state, data) {
			state.unReadNum = data
		},
		setHandNewMsg(state, data) {
			state.isHandNewMsg = data
		},
		// 赋值接收到的消息
		setReceiveMessage(state, data) {
			state.receiveMessage = data;
		},
		// 设置互动页面用户在线
		setInteractionOnlineStatus(state, data) {
			state.interactionOnlineStatus = data;
		},
		// 设置新消息提醒状态
		setReminderStatus(state, data) {
			state.reminderStatus = data;
			uni.setStorageSync("reminderStatus", data)
		}
	},
	actions: {
		setIMClient({ commit }, data) {
		    commit("setImClient", data)
		}
	}
	
})