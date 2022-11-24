import Request from './request.js'
import { throttle } from './throttle.js'

export const staticUrl = "https://hejiume-public.oss-cn-chengdu.aliyuncs.com/app/"
export const baseUrl = "http://redmall-app-api.hushuo.show/api/"
export const imUrl = "ws://redmall-im.hushuo.show?imToken="

export const inviteUrl = "https://redmall-register.hushuo.show/#/pages/public/reg?code="

const config = {
	baseUrl: baseUrl
}

const reqInterceptor = async (options) => {
	//TODO do your request interceptor, such as url/header config, token refresh...
	let token = uni.getStorageSync("token");
	options.header = Object.assign({}, options.header, {
		"Authorization": token
	}) 
	
	_requestLog(options, "成功通过")
	// return false will abort the request, and then reject a blank object {}
	return options
}

const resInterceptor = (response, conf = {}) => {
	// TODO do your response
	const statusCode = response.statusCode
	const errCode = response.data.code || response.data.status
	if (errCode.toString() === '401') {
		response.statusCode = 401
		_responseLog(response, conf, "response 401")
		return {
			// 根据当前字段来判断是否reject
			wakaryReqToReject: true,
			msg: "请登录",
			res: response
		}
	}
	if (errCode.toString() === '500') {
		response.statusCode = 500
		_responseLog(response, conf, "response 500")
		return {
			// 根据当前字段来判断是否reject
			wakaryReqToReject: true,
			msg: response.data.msg,
			res: response
		}
	}
	// response interceptor
	if (statusCode >= 200 && statusCode < 300) { //成功
		if (response.data.code !== 200) { // 233抛异常
			response.statusCode = response.data.code
			_responseLog(response, conf, "response 222")
			return {
				// 根据当前字段来判断是否reject
				wakaryReqToReject: true,
				// 下面可以配置您的其它返回信息，方便您更加统一的处理reject的内容。
				// 以下内容会被作为reject的返回，根据您的需要处理，比如返回您的具体错误信息
				msg: response.data.msg,
				res: response
			}
		}
		_responseLog(response, conf, "response 200-299")
		return response.data
	} else if (statusCode === 500) {
		_responseLog(response, conf, "response 500")
		// 为了对reject的内容更加可控，我们增加了一个控制字段 wakaryReqToReject
		return {
			// 根据当前字段来判断是否reject
			wakaryReqToReject: true,
			// 下面可以配置您的其它返回信息，方便您更加统一的处理reject的内容。
			// 以下内容会被作为reject的返回，根据您的需要处理，比如返回您的具体错误信息
			msg: "服务器错误",
			res: response
		}
	} else {
		_responseLog(response, conf, "response 300-499")
		// 为了对reject的内容更加可控，我们增加了一个控制字段 wakaryReqToReject
		
		return {
			// 根据当前字段来判断是否reject
			wakaryReqToReject: true,
			// 下面可以配置您的其它返回信息，方便您更加统一的处理reject的内容。
			// 以下内容会被作为reject的返回，根据您的需要处理，比如返回您的具体错误信息
			msg: "这里是提示信息",
			res: response
		}
	}
}

const req = new Request(config, reqInterceptor, resInterceptor)

// request log
function _requestLog(req, describe = null) {
	// if (process.env.NODE_ENV === 'development') {
	// 	console.log("地址：" + req.url)
	// 	if (describe) {
	// 		console.log("描述：" + describe)
	// 	}
	// 	console.log("详细：" + JSON.stringify(req))
	// }
	
	//TODO into log server
}

// response log
function _responseLog(res, conf = {}, describe = null) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		// console.log("地址: " + conf.url)
		// if (describe) {
		// 	console.log("描述：" + describe)
		// }
		// console.log("结果: " + JSON.stringify(res.data))
	}
	//TODO into log server
	if (_statusCode === 500) {
		let duration = 1500
		let msg = res.data.msg
		if (msg.length > 5 && msg.length <= 10) {
			duration = 3000
		} else if (msg.length > 10 && msg.length <=20) {
			duration = 5000
		} else if (msg.length > 20) {
			duration = 8000
		}
		uni.showToast({
			title: msg,
			duration: duration,
			icon: "none"
		})
	} else if (_statusCode === 401 || _statusCode === 100) {
		throttle.canDoFunction({
			key: "is401",
			time: 1000,
			success:()=>{
				uni.removeStorageSync("token")
				let routes = getCurrentPages()
				let curRoute = routes[routes.length - 1].route
				if (curRoute.indexOf("login/index") < 0) { // 如果不在登录页面
					uni.showToast({
						title: '请登录',
						icon: "none"
					})
					uni.reLaunch({
						url: "/pages/login/index"
					})
				}
			}
		})
	} else if(_statusCode === 404) {
		uni.showToast({
			title: res.data.msg,
			icon: "none"
		})
	} 
}

export default req
