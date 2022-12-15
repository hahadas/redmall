let name = "im" // 库名
let path = "_doc/im.db" // 存放路径
let sessionList = "conversation" // 会话表名
let chatList = "chatList" // 聊天表

function getUserId(){
	let userInfo = uni.getStorageSync("userInfo")
	return userInfo.id
}

// 数据库是否打开
function isOpenDB(){
	let open = plus.sqlite.isOpenDatabase({
		name: name,
		path: path
	})
	return open
}

// 打开数据库
function openDB(callback){
	plus.sqlite.openDatabase({
		name: name,
		path: path,
		success(res){
			callback(true)
		},
		fail(err){
			callback(false)
		}
	})
}

 // 关闭数据库
 function closeSQL(){
	plus.sqlite.closeDatabase({
		name: name
	})
 }
 
 // 判断表是否存在
 function tableIshas(db, callback){
	plus.sqlite.selectSql({
		name: name,
		sql: `select count(*) from sqlite_master where type='table' and name = '${db}'`,
		success(res){
			console.log("tableIshas---success---", res)
			callback(res[0]["count(*)"])
		},
		fail(err){
			console.log("tableIshas---fail---", err)
			callback(false)
		}
	})
 }
 
 // 获取未读消息数量
 function getUnReadTotal(){
	let db = sessionList + "_" + getUserId()
	return new Promise((resolve,reject) =>{
		plus.sqlite.selectSql({
			name: name,
			sql: `select sum(localUnreadNumber) from '${db}'`,
			success(res){
				resolve(res[0]["sum(localUnreadNumber)"])
			},
			fail(err){
				console.log("........getUnReadTotal.....err......", err)
				reject(err)
			}
		})
	})
 }

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
function createChatListSQL(callback){
	let db = chatList + "_" + getUserId()
	plus.sqlite.executeSql({
		name: name,
		//表格创建或者打开，后面为表格结构
		sql:'create table if not exists '+db+'("_id" INTEGER PRIMARY KEY AUTOINCREMENT,"conversationId" TEXT,"uid" TEXT,"froms" TEXT,"tos" TEXT,"createTime" INTEGER,"msgType" INTEGER,"content",TEXT)', 
		success(e){
			console.log("createChatListSQL---success---", db)
			callback(e);
		},
		fail(e){
			console.log("createChatListSQL---fail---", db)
			callback(e);
		}
	})
}


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
	toConversationId	对方会话ID
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
function createSessionListSQL(callback){
	let db = sessionList + "_" + getUserId()
	let sql = "create table if not exists " + db + "(";
		sql += "'id' TEXT,"; 
		sql += "'type' INTEGER,"; 
		sql += "'toType' INTEGER,"; 
		sql += "'userId' TEXT,"; 
		sql += "'toUserId' TEXT,"; 
		sql += "'imAccount' TEXT,"; 
		sql += "'toImAccount' TEXT,"; 
		sql += "'toConversationId' TEXT,"; 
		sql += "'nickname' TEXT,"; 
		sql += "'headPortrait' TEXT,"; 
		sql += "'storeLogoImage' TEXT,"; 
		sql += "'storeId' TEXT,"; 
		sql += "'storeName' TEXT,"; 
		sql += "'isStore' INTEGER,"; 
		sql += "'isDistributor' INTEGER,"; 
		sql += "'unreadNumber' INTEGER,"; 
		sql += "'localUnreadNumber' INTEGER"; 
		sql += " )"; 
	plus.sqlite.executeSql({
		name: name,
		//表格创建或者打开，后面为表格结构
		sql: sql,
		success(e){
			console.log("createSessionListSQL---success---", db)
			callback(e);
		},
		fail(e){
			console.log("createSessionListSQL---fail---", db)
			callback(e);
		}
	})
}

/**
 * 聊天表插入数据
 * @param {String}  db	表名
 * @param {Object}  data	插入的数据
 * */
function addDataToChatTable(data, callback){
	if (!data || data.toString() === "{}") return
	let sqlInsert = "insert into "+(chatList+"_"+getUserId())+"(conversationId,uid,froms,tos,createTime,msgType,content) values('";  
		sqlInsert += data.conversationId + "','";  
		sqlInsert += data.uid + "','";  
		sqlInsert += data["from"] + "','";  
		sqlInsert += data["to"] + "','";  
		sqlInsert += data.createTime + "','";  
		sqlInsert += data.msgType + "','";  
		// sqlInsert += (data.status || 1) + "','";  
		sqlInsert += data.content + "')";  
	plus.sqlite.executeSql({
		name: name,
		sql: sqlInsert,
		success: function(e){
			console.log("========聊天表插入数据成功========", e)
			callback(true)
		},
		fail: function(e){
			console.log("========聊天表插入数据失败========", e)
			callback(false)
		}
	})
}

/**
 * 会话表插入数据
 * @param {String}  db	表名
 * @param {Object}  data	插入的数据
 * */
function addDataToSessionTable(data, callback){
	if (!data || data.toString() === "{}") return
	let sqlInsert = "insert into "+(sessionList+"_"+getUserId())+" values('";  
		sqlInsert += data.id + "','";  
		sqlInsert += data.type + "','";  
		sqlInsert += data.toType + "','";  
		sqlInsert += data.userId + "','";  
		sqlInsert += data.toUserId + "','";  
		sqlInsert += data.imAccount + "','";  
		sqlInsert += data.toImAccount + "','";  
		sqlInsert += data.toConversationId + "','";
		sqlInsert += data.nickname + "','";  
		sqlInsert += data.headPortrait + "','";  
		sqlInsert += data.storeLogoImage + "','";  
		sqlInsert += data.storeId + "','";  
		sqlInsert += data.storeName + "','";  
		sqlInsert += data.isStore + "','";  
		sqlInsert += data.isDistributor + "','";  
		sqlInsert += data.unreadNumber + "','";  
		sqlInsert += data.localUnreadNumber + "')";  
		// sqlInsert += "xxx" + "')";  
	plus.sqlite.executeSql({
		name: name,
		sql: sqlInsert,
		success: function(e){
			console.log("========会话表插入数据成功========", e)
			callback(true)
		},
		fail: function(e){
			console.log("========会话表插入数据失败========", e)
			callback(false)
		}
	})
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
	console.log('....///////////.......................................', db)
	if(db !== undefined){
		//第一个是表单名称，后两个参数是列表名，用来检索
		let sql = ""
		if(aa !== undefined && cc !== undefined){
			//两个检索条件
			sql = `select * from ${db} where ${aa}='${bb}' and ${cc}='${dd}'`
		}
		if(aa !== undefined && cc == undefined){
			//一个检索条件
			sql = `select * from ${db} where ${aa}='${bb}'`
		}
		if(aa !== undefined && bb == undefined){
			//固定条件类型查询
			if(aa == "user"){//查询toType为：1=用户，2=配送员，3=商家
				sql = `select * from ${db} where toType in(1,2,3)`
			}else if(aa == "distributor"){//查询toType为：4=配送员客户
				sql = `select * from ${db} where toType=4`
			}else if(aa == "store"){//查询toType为：5=店铺客户
				sql = `select * from ${db} where toType=5`
			}
		}
		if(aa == undefined){
			sql = `select * from ${db}`
		}
		return new Promise((resolve,reject) =>{
			plus.sqlite.selectSql({
				name: name,
				sql: sql,
				success(e){
					resolve(e);
				},
				fail(e){
					reject(e);
				}
			})
		})
	}else{
		return new Promise((resolve,reject) =>{reject("错误查询")});
	}
 }
 
 /**
  * 删除数据库里的数据
  * @param {String}  db	表名
  * @param {String}  sol,qq分别为列名和列的值， ww,ee同前面
  * 传的参数按1,3,5来传，传一个，传三个，传五个参数，不能只传两个或者四个
  * */
 function deleteInformationType(db,sol,qq,ww,ee){
 	if(db !== undefined && sol !== undefined){
 		//listId为表名,后面两个是列表名，检索用的
		if (!db) db = chatList
		db = db+"_"+getUserId()
		let sql = ""
 		if(ww !== undefined){
 			//两个检索条件
 			sql = `delete from ${db} where ${sol}='${qq}' and ${ww}='${ee}'`
 		}else{
 			//一个检索条件
 			sql = `delete from ${db} where ${sol}='${qq}'`;
 		}
 		return new Promise((resolve,reject) =>{
 			plus.sqlite.executeSql({
 				name: name,
 				sql: sql,
 				success(e){
					console.log("----删除成功----", e)
 					resolve(e);
 				},
 				fail(e){
					console.log("----删除失败----", e)
 					reject(e);
 				}
 			})
 		})
 	}else{
 		return new Promise((resolve,reject) =>{reject("错误删除")});
 	}
 }
 
 /**
  * 删除表所有数据
  * @param {String}  db 表名
  * */
  function delAllDataBySQL(db, callback){
	if (!db) db = sessionList
	db = db+"_"+getUserId()
	plus.sqlite.executeSql({
		name: name,
		sql: "delete from " + db,
		success(e){
			callback(true)
		},
		fail(e){
			callback(false)
		}
	})
  }

/**
 * 修改数据表里的数据
 * @param {String}  db 表名 默认为会话表
 * @param {String}  cell为要修改的列名，cont为要修改为什么值，use,sel为搜索条件，分别是列名和列值
 * 传的参数按1,3,5来传，传一个，传三个，传五个参数，不能只传两个或者四个
 * */
 function updateInformation(db, cell, cont, use, sel){
	if (!db) db = sessionList
	db = db+"_"+getUserId()
	var sql;
	if(use == undefined){
		sql = `update ${db} set ${cell}='${cont}'`
	}else{
		sql = `update ${db} set ${cell}='${cont}' where ${use}='${sel}'`
	}
	//where前面的是要修改的，后面的是条件，选择哪个
	return new Promise((resolve,reject) =>{
		plus.sqlite.executeSql({
			name: name,
			sql:sql,
			success(e){
				console.log("...../////......//////.....修改成功....../////...../////....")
				resolve(e);
			},
			fail(e){
				console.log("...../////......//////.....修改失败....../////...../////....")
				reject(e);
			}
		})
	})
 }
 
 /**
  * 修改会话表数据
  * @param {String}  data 参数
  * @param {String}  分别是列名和列值
  * 传的参数按1,3,5来传，传一个，传三个，传五个参数，不能只传两个或者四个
  * */
  function updateSessionInformation(data, use, sel, callback){
	let db = sessionList + "_" + getUserId()
	let sql = "update "+ db +" set ";
		sql += "nickname='"+data.nickname+"', ";
		sql += "headPortrait='"+data.headPortrait+"', ";
		sql += "isStore='"+data.isStore+"', ";
		sql += "isDistributor='"+data.isDistributor+"', ";
		sql += "unreadNumber='"+data.unreadNumber+"', ";
		sql += "localUnreadNumber='"+data.localUnreadNumber+"' ";
		sql += "where " + use + "=" + sel;
 	//where前面的是要修改的，后面的是条件，选择哪个
 	plus.sqlite.executeSql({
 		name: name,
 		sql:sql,
		success(e){
			callback(true)
		},
		fail(e){
			callback(false)
			console.log(".....updateSessionInformation-----fail。。。。", e)
		}
 	})
  }
 
 /**
  * 一次获取指定数据条数
  * @param {String} db 表名
  * @param {String} aa 列名
  * @param {String} bb 列值
  * @param {Number} num 页数
  * @param {Number} size 条数，默认20
  * @param {String} sort 排序 desc倒序 asc顺序（默认）
  * */
 function pullSQL(db, aa, bb, num=0, size = 20, sort="asc"){
 	return new Promise((resolve,reject) =>{
		if (!db) db = chatList
		db = db+"_"+getUserId()
		let sql = ""
		if (!aa) {
			sql = `select * from ${db} limit ${size} offset ${num}`
		} else {
			sql = `select * from ${db} where ${aa}='${bb}' order by _id ${sort} limit ${size} offset ${num}`
		}
 		plus.sqlite.selectSql({
 			name: name,
 			sql: sql,
 			success(data){
				console.log(".....pullSQL-----success。。。。", data)
 				resolve(data);
 			},
 			fail(e){
				console.log(".....pullSQL-----fail。。。。", e)
 				reject(e);
 			}
 		})
 	})
 }

export {
	isOpenDB,
	openDB,
	closeSQL,
	tableIshas,
	getUnReadTotal,
	createChatListSQL,
	createSessionListSQL,
	addDataToChatTable,
	addDataToSessionTable,
	selectInformationType,
	deleteInformationType,
	updateInformation,
	updateSessionInformation,
	pullSQL
}