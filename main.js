import Vue from 'vue'
import App from './App'
import store from './store'
import tool from "./common/utils/tool.js"
import { sendRequest } from "./common/http/api.js"

Vue.use(tool)

Vue.config.productionTip = false
Vue.prototype.$http = sendRequest

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
