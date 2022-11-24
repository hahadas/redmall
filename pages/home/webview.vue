<template>
	<!-- <view></view> -->
	<web-view :src="src"></web-view>
</template>

<script>
	// var webview;
	export default{
		data(){
			return {
				src: ''
			}
		},
		onLoad(opt) {
			this.src = opt.url
			// // #ifdef APP-PLUS
			// webview = plus.webview.create(opt.url, "webView",   
			// 	{                 
			// 		"plusrequire":"none",
			// 		'uni-app': 'none',
			// 		"titleNView":{ 
			// 			"autoBackButton": true,
			// 			'style':'transparent',  
			// 			'backgroundColor':'#FFFFFF',  
			// 			'titleText':""
			// 		}  
			// 	});
			// var currentWebview = this.$scope.$getAppWebview();
			// currentWebview.append(webview);
			// // #endif
		}
	}
</script>

<style>
</style>
