import url from "../http/url.js"
import { inviteUrl } from "@/common/http/index.js"
import { sendRequest } from "@/common/http/api.js" 
import JSEncrypt from "@/js_sdk/jsencrypt-Rsa/jsencrypt/jsencrypt.min.js"
import sysAddress from "@/common/utils/sysAddress.js"
var QQMapWX = require('@/libs/qqmap-wx-jssdk.min.js')
var qqmapsdk = new QQMapWX({
	key: 'BJVBZ-UWBR6-DCZSL-E6DJE-AXQGZ-O5BMI'
})
let publics = {
	shareFriend(id, nickname, icon) {
		//分享到微信朋友
		uni.share({
			provider: "weixin",
			scene: "WXSceneSession",
			type: 0,
			href: inviteUrl + id, //这地址太长了，就省略了
			title: "喝酒么",
			summary: nickname + " 邀请您加入喝酒么,各种福利等您来拿~~~",
			imageUrl: icon,
			success: function(res) {
			},
			fail: function(err) {
			}
		});
	},
	//分享到微信朋友圈
	shareFriendcricle(id, nickname, icon) {
		uni.share({
			provider: "weixin",
			scene: "WXSenceTimeline",
			type: 0,
			href: inviteUrl + id, //这地址太长了，就省略了
			title: "喝酒么",
			summary: nickname + " 邀请您加入喝酒么,各种福利等您来拿~~~",
			imageUrl: icon,
			success: function(res) {
			},
			fail: function(err) {
			}
		});
	},
	setMyaddressLngLat(res) {
		uni.setStorageSync("MyAddressDataLngLat", res);
	},
	getMyaddressLngLat() {
		return uni.getStorageSync("MyAddressDataLngLat");
	},
	// 把当前用户会话的未读消息数量存本地缓存一份，因为websocket是多线程，存在消息处理时多次同时进行修改，导致数据只改变了一次（应该为多次）
	setConversationUnReadNum(id, num){
		let conversationUnReadData = publics.getConversationUnReadNum()
		conversationUnReadData["c_"+id] = num
		uni.setStorageSync("conversationUnReadData", conversationUnReadData)
	},
	getConversationUnReadNum(id){
		let conversationUnReadData = uni.getStorageSync("conversationUnReadData") || {}
		if (id) {
			return conversationUnReadData["c_"+id] || 0
		} else {
			return conversationUnReadData
		}
	},
	getCUnReadTotal(){
		let conversationUnReadData = uni.getStorageSync("conversationUnReadData")
		let total = 0
		if (conversationUnReadData) {
			for(let i in conversationUnReadData) {
				total = total + conversationUnReadData[i]
			}
		}
		return total
	},
	setUnsendMsg(id, txt){
		let unSendMsgData = publics.getUnsendMsg()
		unSendMsgData["c_"+id] = txt
		uni.setStorageSync("unSendMsgData", unSendMsgData)
	},
	// 获取会话草稿消息
	getUnsendMsg(id){
		let unSendMsgData = uni.getStorageSync("unSendMsgData") || {}
		let value = ""
		if (id){
			value = unSendMsgData["c_"+id] || ""
		} else {
			value = unSendMsgData
		}
		return value
	},
	/**
	 * 保存接单地址
	 * @param {Object} res
	 */
	setOrderAddress(res){
		uni.setStorageSync("OrdedrAddress",JSON.stringify(res));
	},
	/**
	 *获取接单地址
	 * @param {Object} callback
	 */
	getOrderAddress(){
		let ordedrAddress = uni.getStorageSync("OrdedrAddress");
		if(ordedrAddress){
			return JSON.parse(ordedrAddress);
		}
	},
	/**
	 * 保存已接单信息
	 * @param {Object} res
	 */
	setReceivedOrdersData(res){
		uni.setStorageSync("ReceivedOrdersData",JSON.stringify(res));
	},
	/**
	 * 获取已接单信息
	 * @param {Object} callback
	 */
	getReceivedOrdersData(){
		let ordedrAddress = uni.getStorageSync("ReceivedOrdersData");
		if(ordedrAddress){
			return JSON.parse(ordedrAddress);
		}
	},
	async findByOrderIdPayStatus(orderId) {
		let resAli = await this.$http('post', url.order.tradeQuery, {
			orderId: orderId
		});
		if (resAli) {
			return true;
		}
		let resWechat = await this.$http('post', url.order.tradeQueryWechat, {
			orderId: orderId
		});
		if (resWechat) {
			return true;
		}
	
		this.$msg("订单未支付");
		return false;
	},
	/**
	 * 数据 按照 拼音首字母 排序 并分组
	 * 
	 * @param {Json} data ; 需要 排序的 数据
	 * @param {String} field ；必须；排序所依据的 字段 名
	 * 
	 * @return {Json} ; 例如：{A:[{},{}],B:[{},{}],C:[{}],#:[]}
	 */
	data_letter_sort(data, field) {
		var letter_reg = /^[A-Z]$/;
		var list = new Array();
		var letter;
		for (var i = 0; i < data.length; i++) {
			// 添加 # 分组，用来 存放 首字母不能 转为 大写英文的 数据
			list['#'] = new Array();
			//获取字符串第一个
			var oneReg = (data[i][field]).substr(0, 1);
			// 首字母 转 大写英文
			letter = oneReg.toUpperCase();
			// 是否 大写 英文 字母
			if (!letter_reg.test(letter)) {
				//判断是否为中文
				if (escape(oneReg).indexOf( "%u" ) < 0){
					letter = '#';
				} else {
					letter = pinyin.getCamelChars(oneReg);
				}
			}
			// 创建 字母 分组
			if (!(letter in list)) {
				list[letter] = new Array();
			}
			data[i]['name'] = letter;
			// 字母 分组 添加 数据
			list[letter].push(data[i]);
		}
		// 转换 格式 进行 排序；
		var resault = new Array();
		for (var key in list) {
			resault.push({
				letter: key,
				list: list[key]
			});
		}
		resault.sort(function(x, y) {
			return x.letter.charCodeAt(0) - y.letter.charCodeAt(0);
		});
		// # 号分组 放最后
		var last_arr = resault[0];
		resault.splice(0, 1);
		resault.push(last_arr);
	
		// 转换 数据 格式
		var json_sort = {}
		for (var i = 0; i < resault.length; i++) {
			json_sort[resault[i].letter] = resault[i].list;
		}
	
		return json_sort;
	},
	/**	视频关注操作
	 * @param {Object} id
	 * @param {Object} flag true=关注,false=取消关注
	 */
	setGuanZhuDatasJiLu(id, flag) {
		return;
		let strId = ',' + id + ',';
		let data = uni.getStorageSync("GuanZhuVideoDataS") || '';
		data = data.replace(strId, '');
		if (flag == 0) { //添加
			data = data + strId;
		}
		uni.setStorageSync("GuanZhuVideoDataS", data);
	},
	/**	视频点赞操作
	 * @param {Object} id
	 * @param {Object} flag true=点赞,false=取消点赞
	 */
	setDianZanTrueDatasJiLu(id, flag) {
		return;
		let strId = ',' + id + ',';
		let data = uni.getStorageSync("DianZanVideoDataS") || '';
		data = data.replace(strId, '');
		if (flag == 0) { //添加
			data = data + strId;
		}
		uni.setStorageSync("DianZanVideoDataS", data);
	},
	myGetByTokenData(data) {
		let token = uni.getStorageSync('token') || '';
		data.authorization = token;
		return data;
	},
	/**
	 * 酒音视频编辑压缩和裁剪封面
	 */
	jiuYinVideoCrop(data,callback) {
		const crop = uni.requireNativePlugin("Html5app-VideoCrop");
		uni.showModal({
		    title: '视频裁剪模式',
		    content: '如果视频是手机竖屏拍摄模式，请选择竖屏裁剪。如果是横屏拍摄模式，请选择横屏裁剪。',
			confirmText:'竖屏裁剪',
			cancelText:'横屏裁剪',
		    success: function (res) {
				let ratio = "9/16";
		        if (res.confirm) {//竖屏
		            ratio = "9/16";
		        } else {//横屏
					if (parseInt(data.width) > parseInt(data.height)) { // 如果上传了一个横屏的视频，留空则为原视频大小（针对华为）
						ratio = ""
					} else { // 如果上传了一个竖屏的视频则为16/9（需注意华为手机这时候会为3/4）
						ratio = "16/9";
					}
		        }
				crop.openCrop({
					"url": data.tempFilePath,
					"resolution":"720p", //分辨率
					"mode":"scale", //视频模式，填充、裁剪
					"quality":"sd", // 视频质量
					"ratio":ratio, //视频比例
					"mintime":2000, //限制最小裁剪时间
					"codecs":2,//编码方式
					"gop":"10", // 关键帧
					"fps":"25" // 帧率
				}, ret=>{
					callback(ret);
				});
			}
		});
	},
	/**
	 * 上传酒音视频
	 */
	uploadJiuYinVideo(sizeConfig,type,callback){
		uni.chooseVideo({
			sourceType:[type],
			maxDuration:60,
			count: 1,
			camera: 'front',
			success: (res) => {
				if(!res.tempFilePath || res.tempFilePath.trim() == ''){
					uni.showToast({
						title: "获取视频文件失败,请您重新选择视频"
					})
					return;
				}
				
				let viedoSize = (res.size/1024)/1024;//单位M
				if(viedoSize > parseInt(sizeConfig)){
					uni.showToast({
						title: "视频解析失败,视频最大为 "+sizeConfig+"M"
					})
					return;
				}
				
				if(type === 'camera'){//相机拍摄的文件的路径需要做处理
					res.tempFilePath = plus.io.convertLocalFileSystemURL(res.tempFilePath);
				}
				publics.jiuYinVideoCrop(res,resCrop => {
					if(resCrop.code == 0){
						callback(resCrop);	
					}else{
						uni.showToast({
							title: "视频裁剪失败"
						})
						return;
					}
				});
			}
		});
		
	},
	// 打开百度地图
	openBMap(lon, lat, title, address) {
		var url = null,
			id = null,
			f = null;
		address = address == '' ? title : address;
		switch (plus.os.name) {
			case "Android":
				// 规范参考官方网站：http://developer.baidu.com/map/index.php?title=uri/api/android
				url = "baidumap://map/marker?location=" + lat + "," + lon + "&title=" + title + "&content=" + address + "&src=wz";
				f = "androidMarket";
				id = "com.baidu.BaiduMap";
				break;
			case "iOS":
				// 规范参考官方网站：http://developer.baidu.com/map/index.php?title=uri/api/ios
				url = "baidumap://map/marker?location=" + lat.toFixed(6) + "," + lon.toFixed(6) + "&title=" + title + "&content=" +
					address + "&src=wz";
				// url = "baidumap://map/marker?location=39.968789,116.347247&title=DCloud&content=%e6%89%93%e9%80%a0HTML5%e6%9c%80%e5%a5%bd%e7%9a%84%e7%a7%bb%e5%8a%a8%e5%bc%80%e5%8f%91%e5%b7%a5%e5%85%b7&src=HelloH5";
				f = "iosAppstore";
				id = "itunes.apple.com/cn/app/bai-du-de-tu-yu-yin-dao-hang/id452186370?mt=8";
				break;
			default:
				return;
				break;
		}
		url = encodeURI(url); //重点在这一句，如果不加，android没问题，但是ios打不开，每次提示未安装
		console.log(url);
		plus.runtime.openURL(url, function(e) {
			uni.showToast({
				title: "检查到您未安装百度地图，请先安装百度地图后再进行导航",
				icon: 'none'
			});
		});
	},
	// 根据经纬度获取当前位置信息
	getPositionToLngAndLat(lng, lat){
		return new Promise((resolve, reject)=>{
			qqmapsdk.reverseGeocoder({
				location: {
					latitude: lat,
					longitude: lng
				},
				success: function(e){
					resolve(e)
				},
				fail: function(err){
					reject(err)
				}
			})
		})
	},
	async passwordEncryption(rsaKey, password) {
		if (!rsaKey || !password) return
		let publicKey = rsaKey // 从后台获取公钥
		let encryptor = new JSEncrypt()  // 新建JSEncrypt对象
		encryptor.setPublicKey(publicKey)  // 设置公钥
		let passwordEncryp = encryptor.encrypt(password)  // 对密码进行加密
		return passwordEncryp
	},
	/**
	 * 根据code获取当前城市数据
	 * 数据格式：
	 * {"id":1,"adcode":110000,"name":"北京市","level":1,"centerLng":116.405285000000000,"centerLat":39.904989000000000,"padcode":0}
	 * */
	getLngAndLatByCode(code){
		if (!code) return
		if (typeof code === "string") {
			code = parseInt(code)
		}
		let arrRes = []
		let rev = (array, nodeCode) => {
			array.map(v =>{
				if (v.adcode === nodeCode) {
					arrRes.unshift(v)
					rev(array, v.padcode)
					return false
				}
			})
			return arrRes
		}
		arrRes = rev(sysAddress, code)
		return arrRes
	},
	// 根据三级地区code获取省市区
	getAddressByThreeCode(code){
		if (!code) return
		let addrObj = publics.getLngAndLatByCode(code)
		let addressName = ""
		if (addrObj) {
			addrObj.map(v =>{
				addressName = addressName+v.name
			})
		}
		return addressName
	},
	/**
	 * 解析资源路径
	 * @param {String} rspPath 资源路径
	 * */
	analysisResourcePath(rspPath){
		let path = rspPath
		// #ifdef APP-PLUS
		path=plus.io.convertLocalFileSystemURL(path);
		//去除后面时间戳
		if(path.indexOf("?t=") != -1){
			path = path.split("?t=")[0];
		}
		//判断第一个字符是否存在file://
		if(path.indexOf("file://") == -1){
			path = 'file://'+path;
		}
		let urls = path.split(".");
		let fileType = urls[urls.length-1];
		// #endif
		
		// #ifdef H5
		let fileType = "png"
		// #endif
		
		return {url: path, type: fileType}
	},
	/**
	 * 格式化oss链接
	 * @param {String} imgUrl 图片链接
	 * @param {Number} type 类型，1-互动，酒音头像，消息列表，个人主页，2-互动中动态的图片列表，3-商品, 4-动态列表图片单张, 5-评论列表图片
	 * */
	filterImgUrl(imgUrl, type){
		let ossResizeData = uni.getStorageSync("ossResizeData")
		if (!ossResizeData || !imgUrl) return imgUrl
		let keyValue = ""
		ossResizeData.forEach(v => {
			if (type === 1 && v.keyCode === "resize_user_head_portrait") {
				keyValue = v.keyValue
				return false
			}
			if (type === 2 && v.keyCode === "resize_dynamic_images") {
				keyValue = v.keyValue
				return false
			}
			if (type === 3 && v.keyCode === "resize_goods_main_image") {
				keyValue = v.keyValue
				return false
			}
			if (type === 4 && v.keyCode === "resize_dynamic_one_images") {
				keyValue = v.keyValue
				return false
			}
			if (type === 5 && v.keyCode === "resize_goods_comment_image") {
				keyValue = v.keyValue
				return false
			}
		})
		try{
			if (imgUrl.indexOf("?") > -1) {
				let splitImg = imgUrl.split("?")
				// console.log("//////////////有问好需切割/////////", splitImg[0] + keyValue)
				return splitImg[0] + keyValue
			} else {
				// console.log("//////////////无问好直接拼接/////////", imgUrl + keyValue)
				return imgUrl + keyValue
			}
		}catch(err){
			return imgUrl
		}
	},
	// 公告操作
	advertOption(code, value){
		switch(code){
			case "visit_external_website": // 访问外部网址
				uni.navigateTo({
					url: "/pages/home/webview?url="+value
				})
				return
			case "visit_product_home_page": // 访问商铺主页
				uni.navigateTo({
					url: "/pages/home/store?id="+value
				})
				return
			case "visit_product_details": //访问商品详情
				uni.navigateTo({
					url: "/pages/home/details?id="+value
				})
				return
			case "visit_user_home_page": //访问用户主页
				uni.navigateTo({
					url: "/pages/interaction/user?id="+value
				})
				return
			case "visit_alcohol_sound": //访问酒音视频
				uni.navigateTo({
					url: "/pages/video/indexByUser?id="+value
				})
				return
			case "visit_dynamic_details": //访问动态详情
				uni.navigateTo({
					url: "/pages/interaction/details?id="+value
				})
				return
			case "visit_notice_details": //访问公告详情
				uni.navigateTo({
					url: "/pages/notice/details?id="+value
				})
				return
			default:
				return
		}
	},
	// 根据缓存判断公告是否已经显示过了
	advertShowToStorage(id) {
		let advertList = uni.getStorageSync("advertList")
		if (!advertList) {
			let list = [id]
			uni.setStorageSync("advertList", list)
			return false
		} else {
			if (advertList.includes(id)){ // 判断ID是否存在缓存中
				return true
			} else {
				return false
			}
		}
	}
}

export default publics;