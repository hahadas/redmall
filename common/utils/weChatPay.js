import url from '@/common/http/url.js';
import { sendRequest } from "@/common/http/api.js"
//#ifdef H5
import jWeixin from '@/components/jweixin-module/index.js'
//#endif

/**
 * 去除url中指定参数
 * @param {Object} paramKey
 * @param {Object} url
 */
function delUrlParam(paramKey,url) {
	var urlParam = window.location.search.substr(1);   //页面参数
	var beforeUrl = url.substr(0, url.indexOf("?"));   //页面主地址（参数之前地址）
	var nextUrl = "";

	var arr = new Array();
	if (urlParam != "") {
		var urlParamArr = urlParam.split("&"); //将参数按照&符分成数组
		for (var i = 0; i < urlParamArr.length; i++) {
			var paramArr = urlParamArr[i].split("="); //将参数键，值拆开
			//如果键雨要删除的不一致，则加入到参数中
			if (paramArr[0] != paramKey) {
				arr.push(urlParamArr[i]);
			}
		}
	}
	if (arr.length > 0) {
		nextUrl = "?" + arr.join("&");
	}
	url = beforeUrl + nextUrl;
	return url;
}
function msg(title, duration = 1500, mask = false, icon = 'none') {
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}


/**
 * 微信公众号授权登入
 */
export const officialAccountAuthorize = () => {
	//获取微信公众号ID
	sendRequest("GET", url.user.getOfficialAccountAppID, {}).then(res => {
		let appid = res.data;
		//去除url中的code，防止重复叠加
		let nowUrl = delUrlParam("code",window.location.href)
		//进行微信授权
		let href= encodeURIComponent(nowUrl)
		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+href +"&response_type=code&scope=snsapi_userinfo#wechat_redirect"
	}).catch((err) => {
		uni.hideLoading()
		msg("授权登入失败，请重新操作")
	})
}

/**
 * 根据微信公众号授权后的code 获取openid
 * @param code   微信公众号授权后的code
 */
export const setOfficialAccountOpenIdByCode = (code,callback) => {
	//根据微信公众号授权后的code 获取openid
	sendRequest("GET", url.user.setOfficialAccountOpenIdByCode, {
		code: code
	}).then(res => {
		callback(res.data)
	})
}

/**
 * 重置微信公众号openid
 */
export const reSetOfficialAccountOpenId = (callback) => {
	sendRequest("POST", url.user.reSetOfficialAccountOpenId, {}).then(res => {
		callback(res)
	})
}

/**
 * 微信公众号支付
 * @param verifyData   接口权限校验参数
 * @param payData      支付参数
 */
export const payWeChatH5OfficialAccount = (verifyData, payData,callback) => {
	jWeixin.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: verifyData.appId, // 必填，公众号的唯一标识
		timestamp: verifyData.timestamp, // 必填，生成签名的时间戳
		nonceStr: verifyData.nonceStr, // 必填，生成签名的随机串
		signature: verifyData.signature, // 必填，签名，见附录1
		jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	//校验是否有支付的权限
	jWeixin.ready(function() {
		jWeixin.checkJsApi({
			jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
			success: function(res) {
				/* alert('checkjsapi Success')
				alert(JSON.stringify(res)); */
				
				//开始支付
				jWeixin.chooseWXPay({
					timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
					package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType: payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: payData.paySign, // 支付签名
					success: function(resByChooseWXPay) {
						/* alert('success')
						// 支付成功后的回调函数
						alert(JSON.stringify(resByChooseWXPay)) */
						callback(resByChooseWXPay)
					},
					cancel: function(resByChooseWXPay) {
						/* alert('cancel')
						alert(JSON.stringify(resByChooseWXPay)) */
						//关闭loading
						uni.hideLoading();
						
						//下单账号与支付账号不一致
						uni.showModal({
							content: '是否“下单账号与支付账号不一致”？可以重新授权登入后支付！',
							cancelText: '取消',
							confirmText: '重新授权登入',
							success: function(res) {
								if (res.confirm) {
									//重置账号openId
									reSetOfficialAccountOpenId(reSetOfficialAccountOpenIdRes => {
										//重新授权登入
										officialAccountAuthorize()
									})
								}else{
									msg("已经取消支付");
								}
							}
						});
					},
					fail: function(resByChooseWXPay) {
						/* alert('payfail')
						alert(JSON.stringify(resByChooseWXPay)) */
						//关闭loading
						uni.hideLoading();
						msg("已经取消支付");
					}
				});
			},
			fail: function(res) {
				/* alert('checkjsapi fail')
				alert(JSON.stringify(res)); */
				//关闭loading
				uni.hideLoading();
				msg("支付失败，目前暂不支持公众号支付，可选择别的支付");
			}
		});
		
	})
	jWeixin.error(function(res) {
		/* alert('error')
		alert(JSON.stringify(res)) */
		//关闭loading
		uni.hideLoading();
		msg("支付失败了");
	});
}


/**
 * 设置并获取用户微信小程序openid，返回openid
 */
export const setMiniOpenIdByCode = () => {
	// 获取微信小程序用户信息
	uni.login({
	  provider: 'weixin',
	  success: function (infoRes) {
		  if(infoRes && infoRes.code){
			  //根据小程序授权后的code 获取openid
			  sendRequest("GET", url.user.setMiniOpenIdByCode, {
			  	code: infoRes.code
			  }).then(setMiniOpenIdByCodeRes => {
			  	
			  })
		  }else{
			  //关闭loading
			  uni.hideLoading();
			  msg(infoRes.errMsg)
		  }
	  },
	  fail: function (err) {
	    console.log('err：',err);
		//关闭loading
		uni.hideLoading();
		msg(err.errMsg)
	  },
	});
}