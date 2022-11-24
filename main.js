import Vue from 'vue'
import App from './App'
import store from './store'
import tool from "./common/utils/tool.js"
import { sendRequest } from "./common/http/api.js"
import { staticUrl } from "./common/http/index.js"

Vue.use(tool)

Vue.config.productionTip = false
Vue.prototype.$http = sendRequest

// 注意:在nvue模式下无法使用vue.prototype定义的全局变量,则在app.vue中定义
Vue.prototype.$staticUrl = staticUrl

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
