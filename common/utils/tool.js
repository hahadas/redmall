export default {
	install: function(Vue, opt) {
		// 复制
		Vue.prototype.$onCopy = function(msg, toast) {
			let _this = this
			uni.setClipboardData({
			    data: msg+'',
			    success() {
			        _this.$msg(toast || "复制成功～")
			    },
				fail() {
					_this.$msg(toast || "复制失败～")
				}
			});
		},
		// toast消息提示
		Vue.prototype.$msg = function(title, duration = 1500, mask = false, icon = 'none') {
			if (Boolean(title) === false) {
				return;
			}
			uni.showToast({
				title,
				duration,
				mask,
				icon
			});
		},
		// 消息提示框
		Vue.prototype.$showModal = function(content, title, callback) {
			uni.showModal({
				title: title || "提示",
				content: content,
				confirmColor: "#381895",
				cancelColor: "#bab9bb",
				success(res) {
					callback(res)
				}
			})
		},
		// 页面回退
		Vue.prototype.$navigateBack = function(delta = 1, duration = 300) {
			setTimeout(()=> {
				uni.navigateBack({
					delta: delta
				})
			}, duration)
			
		},
		// 页面跳转
		Vue.prototype.$navigateTo = function(path, animationType='pop-in', duration = 0) {
			setTimeout(()=> {
				uni.navigateTo({
					url: path,
					animationType: animationType
				})
			}, duration)
		},
		// 获取页面元素大小和位置
		Vue.prototype.$getRect = function(selector) {
			return new Promise((resolve) => {
				let view = uni.createSelectorQuery().select(selector);
				view.fields({
					size: true,
					rect: true,
					scrollOffset:true
				}, (res) => {
					resolve(res);
				}).exec();
			})
		}
	}
}