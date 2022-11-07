let sessionList = "conversation" // 会话表名
let chatList = "chatList" // 聊天表

function getUserId(){
	let userInfo = uni.getStorageSync("userInfo")
	return userInfo.id
}

function getSessionName(){
	return sessionList + "_" + getUserId()
}

function getChatName(){
	return chatList + "_" + getUserId()
}

// 判断是否有用户表,没有则创建,有则返回数据
function tableIshas(){
	let sessionDB = uni.getStorageSync(getSessionName());
	if (!sessionDB) {
		uni.setStorageSync(getSessionName(), [])
	}
	let chatDB = uni.getStorageSync(getChatName());
	if (!chatDB) {
		uni.setStorageSync(getChatName(), [])
	}
}

 // 获取未读消息数量
 function getUnReadTotal(){
	let list = uni.getStorageSync(getSessionName())
	let unReadTotal = 0
	list.map(v =>{
		unReadTotal += Number(v.localUnreadNumber || 0)
	})
	return unReadTotal
 }

 /**
  * 聊天表插入数据
  * @param {Object}  data	插入的数据
  * */
/**
 * 创建聊天表
 * 数据结构：
 * {"froms":"100",
 * 	"to":"7a7ff181297f4fbf9be3c25860486c23",
 * 	"conversationId":"7a7ff181297f4fbf9be3c25860486c23", 会话id
 * 	"createTime":"1606212063382",
 * 	"msgType":"0",
 *  "uid": "xxxxxxxxxxxxxxxxxx", 消息id
 *  "status": 1, (默认)1-发送成功 2-发送失败
 * 	"content":"内容"}
 * */
 function addDataToChatTable(data){
 	if (!data || data.toString() === "{}") return
	let list = uni.getStorageSync(getChatName()) || []
	list.push(data)
	uni.setStorageSync(getChatName(), list)
 }


/**
 * 会话表插入数据
 * @param {Object}  data	插入的数据
 * */
/**
 * 创建会话表
 * 数据结构：
 * {
 * 	id	 				会话id
 * 	type	 			会话类型，1-用户 2-配送员 3-店铺
 * 	toType	 			会话类型，1-用户 2-配送员 3-店铺 4-配送员用户 5-店铺客户
 *  userId	 			我的id
 *  toUserId	 		对方用户id
 *  imAccount			我的im账号
	toImAccount			对方im账号
	nickname			对方昵称
	headPortrait		对方头像
	storeLogoImage		对方店铺Id
	storeId				对方店铺头像
	storeName			对方店铺名称
	isStore				对方是否是商家
	isDistributor		对方是否是配送员
	unreadNumber		服务器剩余未读消息
	localUnreadNumber	本地未读消息（前端用）
 * }
 * */
function addDataToSessionTable(data){
	if (!data || data.toString() === "{}") return
	let list = uni.getStorageSync(getSessionName()) || []
	console.log(list)
	list.push(data)
	uni.setStorageSync(getSessionName(), list)
}

/**
 * 查询获取数据库里的数据
 * @param {String}  db	表名，默认会话信息表
 * @param {String}  aa,bb分别为列名和列的值， cc,dd同前面
 * 传的参数按1,3,5来传，传一个，传三个，传五个参数，不能只传两个或者四个
 * */
 function selectInformationType(db, aa, bb, cc, dd){
	if (!db) db = sessionList
	db = db+"_"+getUserId()
	let list = uni.getStorageSync(db) || []
	let result = []
	if (!aa) {
		result = list
	} else if (aa && cc) {
		result = list.filter(item => item[aa] === bb && item[cc] === dd)
	} else if (aa && !cc) {
		result = list.filter(item => item[aa] === bb)
	}
	return result
 }
 
 /**
  * 删除数据库里的数据
  * @param {String}  db	表名
  * @param {String}  sol 列名
  * @param {String}  qq 列值
  * */
 function deleteInformationType(db,sol,qq){
	if (!sol) return
	if (!db) db = chatList
	db = db+"_"+getUserId()
	let list = uni.getStorageSync(db) || []
	for(let i = list.length - 1; i >= 0; i--) {
		if (list[i][sol] === qq) {
			list.splice(i, 1)
		}
	}
	uni.setStorageSync(db, list)
 }
 
 /**
  * 删除表所有数据
  * @param {String}  db 表名
  * */
  function delAllDataBySQL(db){
	if (!db) db = sessionList
	db = db+"_"+getUserId()
	uni.removeStorageSync(db)
  }

/**
 * 修改数据表里的数据
 * @param {String}  db 表名 默认为会话表
 * @param {String}  cell 为要修改的列名
 * @param {String}  cont 为要修改为什么值
 * @param {String}  use 搜索列名
 * @param {String}  sel 搜索列值
 * */
 function updateInformation(db, cell, cont, use, sel){
	if (!db) db = sessionList
	db = db + "_" + getUserId()
	let list = uni.getStorageSync(db) || []
	list.forEach((v, i) =>{
	 	if (v[use] === sel) {
	 		v[cell] = cont
	 		return
	 	}
	})
	uni.setStorageSync(db, list)
 }
 
 /**
  * 修改会话表数据
  * @param {String}  data 参数
  * @param {String}  use 列名
  * @param {String}  sel 列值
  * */
  function updateSessionInformation(data, use, sel){
	let list = uni.getStorageSync(getSessionName()) || []
	if (!list.length) return
	let oldData = {};
	let index = 0
	list.forEach((v, i) =>{
	 	if (v[use] === sel) {
	 		oldData = v
			index = i
	 		return
	 	}
	})
	list[index] = Object.assign({}, oldData, data)
	uni.setStorageSync(getSessionName(), list)
  }
 
 /**
  * 一次获取指定数据条数
  * @param {String} db 表名
  * @param {String} aa 列名
  * @param {String} bb 列值
  * @param {Number} num 开始索引
  * @param {Number} size 条数，默认20
  * @param {String} sort 排序 desc倒序 asc顺序（默认）
  * */
 function pullSQL(db, aa, bb, num=0, size = 20, sort="asc"){
	 return new Promise((resolve,reject) =>{
		if (!db) db = chatList
		db = db+"_"+getUserId()
		let list = uni.getStorageSync(db) || []
		if (!list.length) {
			resolve(list)
		} else {
			let sortList = [...list]
			if (sort === "desc") {
				let data = []
				for(let i = list.length - 1; i >= 0; i--) {
					data.push(list[i])
				}
				sortList = [...data]
			}
			let newList = []
			for(let i = num; i < sortList.length; i++) {
				let obj = sortList[i];
				if (newList.length < size && obj[aa] === bb) {
					newList.push(obj)
				} else {
					obj = null;
					return
				}
			}
			resolve(newList)
		}
	})
 }

export {
	tableIshas,
	getUnReadTotal,
	addDataToChatTable,
	addDataToSessionTable,
	selectInformationType,
	deleteInformationType,
	updateInformation,
	updateSessionInformation,
	pullSQL
}