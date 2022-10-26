<template>
	<list :pagingEnabled="true" :show-scrollbar="false" @scrollend="scroll" :scrollable="true">
		<slot />
	</list>
	
</template>

<script>
	export default {
		props: {
			num: {
				default: 0
			}
		},
		data() {
			return {
				currentIndex: 0,
				contentOffsetY: 0
			}
		},
		methods: {
			scroll: function(e) {
				let originalIndex = this.currentIndex;
				let isNext = false;
				if (e.contentOffset.y < this.contentOffsetY) {
					isNext = true;
				}
				this.contentOffsetY = e.contentOffset.y;
				this.currentIndex = Math.round(Math.abs(this.contentOffsetY) / (e.contentSize.height / this.num));
				this.$emit("change", this.currentIndex)
			}
		}
	}
</script>

<style>

</style>
