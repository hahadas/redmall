import { baseUrl } from "./index.js"
import url from "./url.js"
import { sendRequest } from "./api.js"
import publics from "../utils/public.js"
let uploadImg = {
	showAvatarModal(that, selWidth, selHeight){
		that.$refs.avatar.fChooseImg(0,{
			selWidth: `${selWidth}upx`, selHeight: `${selWidth}upx`,
			inner: false,
			canRotate: false
		});
	},
	async getOssSignature(rspPath, type=0, fileNumber=1) {
		// #ifdef H5
		uni.showToast({
			duration: 2000,
			icon:"none",
			title: "当前环境不支持上传图片，请使用APP进行图片上传"
		})
		return false
		// #endif
		let fileObj = {}
		let fileArray = []
		if (typeof rspPath === "string") {
			fileObj = publics.analysisResourcePath(rspPath)
		} else if (Array.isArray(rspPath)) {
			rspPath.forEach(v=>{
				fileArray.push(publics.analysisResourcePath(v))
			})
		} else {
			return false
		}
		let res = await sendRequest("GET", url.common.getOssSignature, {
			fileType: fileObj.type ? fileObj.type : fileArray[0].type,
			applicationType: type,
			fileNumber: fileNumber
		})
		res.data.map((v, i) =>{
			v.filePath = fileObj.url ? fileObj.url : fileArray[i].url
		})
		return res.data
	},
	// 通过oss上传图片
	uploadImageOss(data, loading = true) {
		if (!data || data.length === 0) return
		if (loading) {
			uni.showLoading({
				mask: true
			});
		}
		let uploadList = []
		let uploadIndex = 0
		return new Promise((resolve, reject) => {
			data.map((v, i) =>{
				let config = v
				let formData = {
					'key': config.key || (config.policy.dir+'/'+config.fileName),
					'policy': typeof config.policy === 'string' ? config.policy : config.policy.policy,
					'OSSAccessKeyId': config.accessKeyId || config.policy.accessKeyId,
					'signature': config.signature || config.policy.signature,
					'success_action_status': '200'//让服务端返回200,不然，默认会返回204
				}
				console.log("formData....", formData, config)
				if (uploadIndex === i){
					uni.uploadFile({
						url: config.host || config.policy.host,
						filePath: config.filePath,
						name: 'file',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'multipart/form-data',
						},
						formData: formData,
						complete: (res) => {
							if (res.statusCode === 200) {
								v.status = true
							} else {
								v.status = false
								v.statusCode = res.statusCode
								v.errMsg = res.errMsg
							}
							uploadList.push(v)
							if (uploadIndex+1 === data.length) {
								uni.hideLoading();
								resolve(uploadList)
							} else{
								uploadIndex++
							}
						}
					});
				}
			})
		})
	},
	// 选择图片并上传
	uploadImage(num, callback) {
		uni.chooseImage({
			count: num,
			success: (res) => {
				uni.showLoading({
					title: '上传中...'
				});
				setTimeout(function() {
					//最多30秒
					uni.hideLoading();
				}, 1000*30);
				let tempFilePaths = res.tempFilePaths
				for (var i = 0; i < tempFilePaths.length; i++) {
					uni.uploadFile({
						url: baseUrl +'upload',
						filePath: tempFilePaths[i],
						fileType: 'image',
						name: 'file',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'multipart/form-data',
						},
						formData: {
							'method': 'images.upload',
							'upfile': tempFilePaths[i]
						},
						success: (uploadFileRes) => {
							callback(JSON.parse(uploadFileRes.data));
						},
						fail: (error) => {
							if (error && error.response) {
								showError(error.response);
							}
						},
						complete: () => {
							setTimeout(function() {
								uni.hideLoading();
							}, 250);
						},
					});
				}
			}
		});
	},
	// 动态酒音上传
	async oldOssUpload(path, callback){
		if(!path) return
		uni.showLoading({
			title: '上传中...'
		});
		setTimeout(function() {
			//最多10秒
			uni.hideLoading();
		}, 1000*10);
		let url1=plus.io.convertLocalFileSystemURL(path);
		//去除后面时间戳
		if(url1.indexOf("?t=") != -1){
			url1 = url1.split("?t=")[0];
		}
		//判断第一个字符是否存在file://
		if(url1.indexOf("file://") == -1){
			url1 = 'file://'+url1;
		}
		let urls = url1.split(".");
		let fileType = urls[urls.length-1];
		let res = await sendRequest("GET", "single/home/policy", {type: 0, fileType: fileType})
		let resData = res.data
		if (resData) {
			resData.filePath = url1
			let data = await uploadImg.uploadImageOss([resData])
			if (data) {
				uni.hideLoading();
				callback(resData)
			}
		}
	}
}
export default uploadImg;