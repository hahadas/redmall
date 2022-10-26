import http from './index'

// 发送请求
export const sendRequest = (method, url, data) => {
	return http.request({
		url: url,
		method: method || "GET",
		data,
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
};

// 发送请求, application/json
export const sendRequestJson = (method, url, data) => {
	return http.request({
		url: url,
		method: method || "GET",
		data,
		header: {
			"Content-Type": "application/json;charset=UTF-8"
		}
	});
};