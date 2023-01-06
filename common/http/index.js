import Request from './request.js'
import { throttle } from './throttle.js'

export const staticUrl = "https://redmall-public.oss-cn-shenzhen.aliyuncs.com/static_resources/"
export const baseUrl = "https://redmall-app-api.nnwqkj.com/api/"
// export const baseUrl = "http://192.168.1.188:6001/api/"
// export const baseUrl = "http://47.109.18.227:6001/api/"
export const imUrl = "ws://redmall-im.nnwqkj.com?imToken="
// export const imUrl = "ws://47.109.18.227:6000?imToken="

export const inviteUrl = "https://redmall-register.nnwqkj.com/#/pages/public/reg?code="

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
		console.log(res)
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
				//排除的路径
				let excludeRoutes = "pages/login/index,pages/login/login,pages/login/register,pages/public/reg,pages/login/forget";
				if (excludeRoutes.indexOf(curRoute) < 0) { // 如果不在登录页面，账号密码登录页面、注册页面、忘记密码页面
					uni.showModal({
						content: '该功能需要登录后才能访问哟~',
						confirmText: '马上登录',
						success: function (res) {
							if (res.confirm) {
								uni.reLaunch({
									url: "/pages/login/index"
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					/* uni.showToast({
						title: '请登录',
						icon: "none"
					})
					uni.reLaunch({
						url: "/pages/login/index"
					}) */
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
