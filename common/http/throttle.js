// 防抖函数和节流函数
export const debounce = (func, wait = 1000) => {
	let timeout; // 定时器变量
	return function(event) {
		clearTimeout(timeout); // 每次触发时先清除上一次的定时器,然后重新计时
		timeout = setTimeout(() => {
			func.call(this, event)
		}, wait); // 指定 xx ms 后触发真正想进行的操作 handler
	};
}

export const throttle = {
	keyList: {},
	canDoFunction(options = {}) {
		if (!this.keyList[options.key]) {
			this.lockKey(options.key);
			options.success && options.success();
			if (options.time) {
				setTimeout(() => {
					this.releaseKey(options.key)
				}, options.time);
			}
		} else {
			options.fail && options.fail()
		}
	},
	releaseKey(key) {
		this.keyList[key] = false;
	},
	lockKey(key) {
		this.keyList[key] = true;
	}
}
