<template>
	<view>
	</view>
</template>

<script>
	var webview;
	export default{
		onLoad(opt) {
			webview = plus.webview.create(opt.url, "webView",   
				{                 
					"plusrequire":"none",
					'uni-app': 'none',
					"titleNView":{ 
						"autoBackButton": true,
						'style':'transparent',  
						'backgroundColor':'#FFFFFF',  
						'titleText':""
					}  
				});
			var currentWebview = this.$scope.$getAppWebview();
			currentWebview.append(webview);
		}
	}
</script>

<style>
</style>
