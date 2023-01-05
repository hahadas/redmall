<template>
	<view>
		
	</view>
</template>

<script>
	import JSEncrypt from './jsencrypt.min.js';
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		getRealLen:function(str) {
		    return str.replace(/[^\x00-\xff]/g, '__').length;
			
		},
		setEncryptList:function(publicKey,str,max) {
			var arr=[]
		    
		    var s=str,reg=/.{40}/g,ppstr=s.match(reg);
		    ppstr.push(s.substring(ppstr.join('').length));
			
		    for (var nux=0;nux<ppstr.length;nux++) {
		    	var Nax=this.getRealLen(ppstr[nux]);
				if(Nax>116){
					var list=this.setEncryptList(publicKey,ppstr[nux],Nax)
					 for (var nu=0;nu<list.length;nu++) {
						 arr.push(list[nu]);
					 }
				}else{
				
					arr.push(this.setEncrypt(publicKey,ppstr[nux]));
				}
		    
		    }
			return arr;
		},		
		setEncrypt:function(publicKey,data){
				const encrypt =new JSEncrypt();
				encrypt.setPublicKey(publicKey);
		
				return encrypt.encrypt(data);
		},
		setLongEncrypt:function(publicKey,data){
			var s=data,reg=/.{116}/g,rs=s.match(reg);
			rs.push(s.substring(rs.join('').length));
			var arr=[];
			for (var n=0;n<rs.length;n++) {
				var max=this.getRealLen(rs[n]);
				
				if(max>116){
				
					var list=this.setEncryptList(publicKey,rs[n],max)
					 for (var nu=0;nu<list.length;nu++) {
						 arr.push(list[nu]);
					 }
				}else{
					
					arr.push(this.setEncrypt(publicKey,rs[n]));
				}
				
			}
			return arr;
		},
		setDecryptArray:function(PrivateKey,ArrayData){
			var Decrypt="";
			for (var n=0;n<ArrayData.length;n++) {
				Decrypt=Decrypt+this.setDecrypt(PrivateKey,ArrayData[n]);	
			}
			return Decrypt;
		},
		setDecrypt:function(PrivateKey,data){
				const encrypt =new JSEncrypt();
				encrypt.setPrivateKey(PrivateKey);
				
				return encrypt.decrypt(data);
		}
	}
</script>

<style>

</style>
