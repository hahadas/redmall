// 根据生日的月份和日期，计算星座。
export const getAstro = (m, d) => {
	let result = "摩羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯".substr(m*2-(d<"102223444433".charAt(m-1)- -19)*2,2) + "座";
	let list = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
	return {name: result, id: list.indexOf(result)}
}

// 根据出生日期计算年龄 格式：YYYY-MM-dd
export const getAge = (strAge) => {
	var birArr = strAge.split("-");
	var birYear = birArr[0];
	var birMonth = birArr[1];
	var birDay = birArr[2];

	d = new Date();
	var nowYear = d.getFullYear();
	var nowMonth = d.getMonth() + 1; //记得加1
	var nowDay = d.getDate();
	var returnAge;

	if (birArr == null) {
		return false
	};
	var d = new Date(birYear, birMonth - 1, birDay);
	if (d.getFullYear() == birYear && (d.getMonth() + 1) == birMonth && d.getDate() == birDay) {
		if (nowYear == birYear) {
			returnAge = 0; // 
		} else {
			var ageDiff = nowYear - birYear; // 
			if (ageDiff > 0) {
				if (nowMonth == birMonth) {
					var dayDiff = nowDay - birDay; // 
					if (dayDiff < 0) {
						returnAge = ageDiff - 1;
					} else {
						returnAge = ageDiff;
					}
				} else {
					var monthDiff = nowMonth - birMonth; // 
					if (monthDiff < 0) {
						returnAge = ageDiff - 1;
					} else {
						returnAge = ageDiff;
					}
				}
			} else {
				return  "出生日期晚于今天，数据有误"; //返回-1 表示出生日期输入错误 晚于今天
			}
		}
		return returnAge;
	} else {
		return ("输入的日期格式错误！");
	}
}

/**
 * 根据时间戳转年月日 格式：YYYY-MM-dd HH:mm:ss
 * @param {Number}  = [timestamp] 时间戳，精确到毫秒
 * @param {Boolean}  = [show] 显示到哪个时间段,默认显示到秒，可选值d(天)，m(分)，s(秒)
 * */
export const timestampToTime = (timestamp, show = 's') => {
	//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let date = new Date(timestamp);
	let	Y = date.getFullYear();
	let M = (date.getMonth() + 1 < 10 ?'0' + (date.getMonth() +1) : date.getMonth() +1);
	let D = date.getDate();
	let h = (date.getHours() < 10 ?('0' + date.getHours()) : date.getHours()) +':';
	let m = (date.getMinutes() < 10 ?('0' + date.getMinutes()) : date.getMinutes());
	let s = (date.getSeconds() < 10 ?('0' + date.getSeconds()) : date.getSeconds())
	if (show === "s") {
		return Y + "-" + M + "-" + D + " " + h + m + ':' + s;
	} else if (show === "m") {
		return Y + "-" + M + "-" + D + " " + h + m;
	} else {
		return Y + "-" + M + "-" + D;
	}
}

/**
 * 根据时间戳转今天、昨天、前天
 * @param {Number}  = [timestamp] 时间戳，精确到毫秒
 * */
export const timestampFormat = (timestamp) => {
	function zeroize( num ) {
		return (String(num).length == 1 ? '0' : '') + num;
	}

	var curTimestamp = new Date().getTime(); //当前时间戳
	var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
	// console.log(curTimestamp, timestampDiff)
	
	var curDate = new Date( curTimestamp ); // 当前时间日期对象
	var tmDate = new Date( timestamp );  // 参数时间戳转换成的日期对象

	var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
	var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

	if ( timestampDiff < 3600 ) { // 一分钟以内
		return "刚刚";
	// } else if( timestampDiff < 3600 ) { // 一小时前之内
		// return Math.floor( timestampDiff / 60000 ) + "分钟前";
	} else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
		return '今天' + zeroize(H) + ':' + zeroize(i);
	} else {
		var newDate = new Date( (curTimestamp - 86400000) ); // 参数中的时间戳加一天转换成的日期对象
		
		if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
			return '昨天 ' + zeroize(H) + ':' + zeroize(i);
		} else if ( curDate.getFullYear() == Y ) {
			return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
		} else {
			return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
		}
	}
}

// 判断是否在微信浏览器 true是
export const isWeiXinBrowser = () => {
  // #ifdef H5
  // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  let ua = window.navigator.userAgent.toLowerCase()
  // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
  // #endif
  return false
}

/*
*	获取android手机mac地址
*/
export const getMacAddress = () =>{
	let mac = "xxx-xxx-xxx"
	if(uni.getSystemInfoSync().osName === "android"){
		var Context = plus.android.importClass("android.content.Context");
		var WifiManager = plus.android.importClass("android.net.wifi.WifiManager");
		var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
		var WifiInfo = plus.android.importClass("android.net.wifi.WifiInfo");
		var wifiInfo = wifiManager.getConnectionInfo();
		mac = wifiInfo.getBSSID()
	} else if (uni.getSystemInfoSync().osName === "ios") {
		mac = plus.device.uuid // ios 获取不到，所以获取设备id
	}
	return mac
}

// 生成UUID
export const getUUID = () => {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    // s[8] = s[13] = s[18] = s[23] = "-"; 不要横杆
    s[8] = s[13] = s[18] = s[23];
    var uuid = s.join("");
    return uuid;
}

// 秒转00:00
export const secondFormat = (duration) =>{
	let min = parseInt(duration / 60);
	let sec = duration % 60;
	min = min < 10 ? '0' + min : min;
	sec = sec < 10 ? '0' + sec : sec;
	return min + ':' + sec;
}

// 数字转换为万 千万 百万
export const numberConversion = (value) =>{
	const newValue = ['', '', '']
	let fr = 1000
	let num = 3
	let txt = ''
	let fm = 1
	while (value / fr >= 1) {
		fr *= 10
		num += 1
	}
	if (num <= 4) { // 千
		newValue[0] = parseInt(value) + ''
		newValue[1] = ''
	} else if (num <= 8) { // 万
		txt = parseInt(num - 4) / 3 > 1 ? '千万' : '万'
		fm = txt === '万' ? 10000 : 10000000
		if (value % fm === 0) {
			newValue[0] = parseInt(value / fm) + ''
		} else {
			newValue[0] = parseFloat(value / fm).toFixed(1) + ''
		}
		newValue[1] = txt
	} else if (num <= 16) { // 亿
		txt = (num - 8) / 3 > 1 ? '千亿' : '亿'
		txt = (num - 8) / 4 > 1 ? '万亿' : txt
		txt = (num - 8) / 7 > 1 ? '千万亿' : txt
		fm = 1
		if (txt === '亿') {
			fm = 100000000
		} else if (txt === '千亿') {
			fm = 100000000000
		} else if (txt === '万亿') {
			fm = 1000000000000
		} else if (txt === '千万亿') {
			fm = 1000000000000000
		}
		if (value % fm === 0) {
			newValue[0] = parseInt(value / fm) + ''
		} else {
			newValue[0] = parseFloat(value / fm).toFixed(1) + ''
		}
		newValue[1] = txt
	}
	if (value < 1000) {
		newValue[0] = value + ''
		newValue[1] = ''
	}
	return newValue.join('')
}

/*
* 米转公里、公里转米
* @param {string} dis 米/公里
* @param {string} type km(默认-米转公里) m(公里转米)
* return 距离
*/
export const distanceTransform = (dis, type="km") => {
	if (type === "km") {
		if (dis < 1000){
			return parseInt(dis)+"m";
		} else {
			return (Math.round(dis/100)/10).toFixed(1) + "Km"
		}
	} else {
		if(parseFloat(dis) >= 1){
			return (Math.round(dis * 10) / 10)+"Km";
		}else{
			return parseInt(dis*1000)+"m";	
		}
	}
}

/*
* 根据经纬度计算两点之间的距离
* @param {string} lat1 开始纬度
* @param {string} lng1 开始经度
* @param {string} lat2 结束纬度
* @param {string} lng2 结束经度
* return 距离
*/
export const computeLngLatDistance = (lat1, lng1, lat2, lng2) =>{
	let radLat1 = lat1 * Math.PI / 180.0;
	let radLat2 = lat2 * Math.PI / 180.0;
	let a = radLat1 - radLat2;
	let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * 6378.137;
	s = Math.round(s * 10000) / 10000; // 单位千米
	console.log("...........s.........", s)
	return distanceTransform(s, 'm')
}

/*
* 版本号比较
* @param {string} curV 当前版本号
* @param {string} reqV 比较版本号
* return 0-旧版 1-稳定版 2-新版
*/
export const versionCompare = (curV,reqV) =>{
	let arr1=curV.split('.');
	let arr2=reqV.split('.');
	//将两个版本号拆成数字 
	let minL= Math.min(arr1.length,arr2.length);  
	let pos=0;        //当前比较位
	let diff=0;        //当前为位比较是否相等
	
	//逐个比较如果当前位相等则继续比较下一位
	while(pos<minL){
	    diff=parseInt(arr1[pos])-parseInt(arr2[pos]);  
	    if(diff!=0){  
	      break;  
	    } 
	    pos++;                  
	}
	if (diff>0) {
		return 2
	    console.log('当前已是新版本')
	}else if (diff==0) {
		return 1
	    console.log('当前稳定版')
	}else{
		return 0
	    console.log('当前旧版本')
	}
}

/**
 * 检查是否打开GPS功能
 * */
 export const checkOpenGPSService = (callback) => {
	let system = uni.getSystemInfoSync();// 获取系统信息
	if (system.platform === 'android') { // 判断平台
	    var context = plus.android.importClass("android.content.Context");
	    var locationManager = plus.android.importClass("android.location.LocationManager");
	    var main = plus.android.runtimeMainActivity();
	    var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
	    if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
			callback(false)
			uni.showModal({
				title: '提示',
				content: '请打开定位服务功能',
				showCancel: false, // 不显示取消按钮
				success(res) {
					if (res.confirm) {
						var Intent = plus.android.importClass('android.content.Intent');
						var Settings = plus.android.importClass('android.provider.Settings');
						var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS); 
						main.startActivity(intent); // 打开系统设置GPS服务页面
					}
				}
			});
	    } else {
			console.log('android.....11111........GPS功能已开启');
			callback(true)
		}
	} else if (system.platform === 'ios') {
		var cllocationManger = plus.ios.importClass("CLLocationManager");
		var enable = cllocationManger.locationServicesEnabled();    
		var status = cllocationManger.authorizationStatus();    
		console.log("enable:" + enable);    
		console.log("status:" + status);    
		if (enable && status != 2) {    
			console.log("ios.......11111111......手机系统的定位已经打开");    
			callback(true)
		} else {   
			callback(false)
			console.log("手机系统的定位没有打开");  
			//  定位没有开启时  提示用户是否开启  
			// uni.showToast({
			// 	title: "目前未开启位置，该功能无法使用",
			// 	icon: "none"
			// })
			// plus.nativeUI.confirm("定位权限没有开启，是否去开启？", function(e) {    
			// 	if (e.index === 1) {    
			// 		var UIApplication = plus.ios.importClass("UIApplication");    
			// 		var application2 = UIApplication.sharedApplication();    
			// 		var NSURL2 = plus.ios.importClass("NSURL");                          
			// 		var setting2 = NSURL2.URLWithString("app-settings:"); // 打开应用权限  
			// 		// var setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION"); // 打开隐私中到定位权限  
			// 		application2.openURL(setting2);    
			// 		plus.ios.deleteObject(setting2);    
			// 		plus.ios.deleteObject(NSURL2);    
			// 		plus.ios.deleteObject(application2);   
			// 		console.log("ios.......2222222........手机系统的定位已经打开")
			// 		callback(true)
			// 	}    
			// }, {    
			// 	"buttons": ["不开启", "去设置"],    
			// 	"verticalAlign": "center"    
			// });    
		}    
		plus.ios.deleteObject(cllocationManger);  
	}
 }