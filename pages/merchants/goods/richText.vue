<template>
	<view>
		<jinEdit placeholder="请输入内容" :html="html" @editOk="editOk" uploadFileUrl="/#"></jinEdit> 
	</view>
</template>

<script>
	import jinEdit from '@/components/jin-edit/jin-edit.vue';

	export default {
		components: { jinEdit },
		data() {
			return {
				html: ""
			}
		},
		onLoad(opt) {
			this.html = opt.html
		},
		methods: {
			editOk(e){
				console.log(e)
				let pages = getCurrentPages(); //当前页面栈
				let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
				beforePage.$vm.form.detailsTextHtml = e.html
				this.$navigateBack(1, 500)
			}
		}
	}
</script>

<style>

</style>
