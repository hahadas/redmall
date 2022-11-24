//表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
var onlineEmoji = {
	"100.gif": "AbNQgA.gif",
	"101.gif": "AbN3ut.gif",
	"102.gif": "AbNM3d.gif",
	"103.gif": "AbN8DP.gif",
	"104.gif": "AbNljI.gif",
	"105.gif": "AbNtUS.gif",
	"106.gif": "AbNGHf.gif",
	"107.gif": "AbNYE8.gif",
	"108.gif": "AbNaCQ.gif",
	"109.gif": "AbNN4g.gif",
	"110.gif": "AbN0vn.gif",
	"111.gif": "AbNd3j.gif",
	"112.gif": "AbNsbV.gif",
	"113.gif": "AbNwgs.gif",
	"114.gif": "AbNrD0.gif",
	"115.gif": "AbNDuq.gif",
	"116.gif": "AbNg5F.gif",
	"117.gif": "AbN6ET.gif",
	"118.gif": "AbNcUU.gif",
	"119.gif": "AbNRC4.gif",
	"120.gif": "AbNhvR.gif",
	"121.gif": "AbNf29.gif",
	"122.gif": "AbNW8J.gif",
	"123.gif": "AbNob6.gif",
	"124.gif": "AbN5K1.gif",
	"125.gif": "AbNHUO.gif",
	"126.gif": "AbNIDx.gif",
	"127.gif": "AbN7VK.gif",
	"128.gif": "AbNb5D.gif",
	"129.gif": "AbNX2d.gif",
	"130.gif": "AbNLPe.gif",
	"131.gif": "AbNjxA.gif",
	"132.gif": "AbNO8H.gif",
	"133.gif": "AbNxKI.gif",
	"134.gif": "AbNzrt.gif",
	"135.gif": "AbU9Vf.gif",
	"136.gif": "AbUSqP.gif",
	"137.gif": "AbUCa8.gif",
	"138.gif": "AbUkGQ.gif",
	"139.gif": "AbUFPg.gif",
	"140.gif": "AbUPIS.gif",
	"141.gif": "AbUZMn.gif",
	"142.gif": "AbUExs.gif",
	"143.gif": "AbUA2j.gif",
	"144.gif": "AbUMIU.gif",
	"145.gif": "AbUerq.gif",
	"146.gif": "AbUKaT.gif",
	"147.gif": "AbUmq0.gif",
	"148.gif": "AbUuZV.gif",
	"149.gif": "AbUliF.gif",
	"150.gif": "AbU1G4.gif",
	"151.gif": "AbU8z9.gif",
	"152.gif": "AbU3RJ.gif",
	"153.gif": "AbUYs1.gif",
	"154.gif": "AbUJMR.gif",
	"155.gif": "AbUadK.gif",
	"156.gif": "AbUtqx.gif",
	"157.gif": "AbUUZ6.gif",
	"158.gif": "AbUBJe.gif",
	"159.gif": "AbUdIO.gif",
	"160.gif": "AbU0iD.gif",
	"161.gif": "AbUrzd.gif",
	"162.gif": "AbUDRH.gif",
	"163.gif": "AbUyQA.gif",
	"164.gif": "AbUWo8.gif",
	"165.gif": "AbU6sI.gif",
	"166.gif": "AbU2eP.gif",
	"167.gif": "AbUcLt.gif",
	"168.gif": "AbU4Jg.gif",
	"169.gif": "AbURdf.gif",
	"170.gif": "AbUhFS.gif",
	"171.gif": "AbU5WQ.gif",
	"172.gif": "AbULwV.gif",
	"173.gif": "AbUIzj.gif",
	"174.gif": "AbUTQs.gif",
	"175.gif": "AbU7yn.gif",
	"176.gif": "AbUqe0.gif",
	"177.gif": "AbUHLq.gif",
	"178.gif": "AbUOoT.gif",
	"179.gif": "AbUvYF.gif",
	"180.gif": "AbUjFU.gif",
	"181.gif": "AbaSSJ.gif",
	"182.gif": "AbUxW4.gif",
	"183.gif": "AbaCO1.gif",
	"184.gif": "Abapl9.gif",
	"185.gif": "Aba9yR.gif",
	"186.gif": "AbaFw6.gif",
	"187.gif": "Abaiex.gif",
	"188.gif": "AbakTK.gif",
	"189.gif": "AbaZfe.png",
	"190.gif": "AbaEFO.gif",
	"191.gif": "AbaVYD.gif",
	"192.gif": "AbamSH.gif",
	"193.gif": "AbaKOI.gif",
	"194.gif": "Abanld.gif",
	"195.gif": "Abau6A.gif",
	"196.gif": "AbaQmt.gif",
	"197.gif": "Abal0P.gif",
	"198.gif": "AbatpQ.gif",
	"199.gif": "Aba1Tf.gif",
	"200.png": "Aba8k8.png",
	"201.png": "AbaGtS.png",
	"202.png": "AbaJfg.png",
	"203.png": "AbaNlj.png",
	"204.png": "Abawmq.png",
	"205.png": "AbaU6s.png",
	"206.png": "AbaaXn.png",
	"207.png": "Aba000.png",
	"208.png": "AbarkT.png",
	"209.png": "AbastU.png",
	"210.png": "AbaB7V.png",
	"211.png": "Abafn1.png",
	"212.png": "Abacp4.png",
	"213.png": "AbayhF.png",
	"214.png": "Abag1J.png",
	"215.png": "Aba2c9.png",
	"216.png": "AbaRXR.png",
	"217.png": "Aba476.png",
	"218.png": "Abah0x.png",
	"219.png": "Abdg58.png"
};

var emojiList = [
	[{
		"url": "100.gif",
		alt: "[微笑]"
	}, {
		"url": "101.gif",
		alt: "[伤心]"
	}, {
		"url": "102.gif",
		alt: "[美女]"
	}, {
		"url": "103.gif",
		alt: "[发呆]"
	}, {
		"url": "104.gif",
		alt: "[墨镜]"
	}, {
		"url": "105.gif",
		alt: "[哭]"
	}, {
		"url": "106.gif",
		alt: "[羞]"
	}, {
		"url": "107.gif",
		alt: "[哑]"
	}, {
		"url": "108.gif",
		alt: "[睡]"
	}, {
		"url": "109.gif",
		alt: "[哭]"
	}, {
		"url": "110.gif",
		alt: "[囧]"
	}, {
		"url": "111.gif",
		alt: "[怒]"
	}, {
		"url": "112.gif",
		alt: "[调皮]"
	}, {
		"url": "113.gif",
		alt: "[笑]"
	}, {
		"url": "114.gif",
		alt: "[惊讶]"
	}, {
		"url": "115.gif",
		alt: "[难过]"
	}, {
		"url": "116.gif",
		alt: "[酷]"
	}, {
		"url": "117.gif",
		alt: "[汗]"
	}, {
		"url": "118.gif",
		alt: "[抓狂]"
	}, {
		"url": "119.gif",
		alt: "[吐]"
	}, {
		"url": "120.gif",
		alt: "[笑]"
	}, {
		"url": "121.gif",
		alt: "[快乐]"
	}, {
		"url": "122.gif",
		alt: "[奇]"
	}, {
		"url": "123.gif",
		alt: "[傲]"
	}],
	[{
		"url": "124.gif",
		alt: "[饿]"
	}, {
		"url": "125.gif",
		alt: "[累]"
	}, {
		"url": "126.gif",
		alt: "[吓]"
	}, {
		"url": "127.gif",
		alt: "[汗]"
	}, {
		"url": "128.gif",
		alt: "[高兴]"
	}, {
		"url": "129.gif",
		alt: "[闲]"
	}, {
		"url": "130.gif",
		alt: "[努力]"
	}, {
		"url": "131.gif",
		alt: "[骂]"
	}, {
		"url": "132.gif",
		alt: "[疑问]"
	}, {
		"url": "133.gif",
		alt: "[秘密]"
	}, {
		"url": "134.gif",
		alt: "[乱]"
	}, {
		"url": "135.gif",
		alt: "[疯]"
	}, {
		"url": "136.gif",
		alt: "[哀]"
	}, {
		"url": "137.gif",
		alt: "[鬼]"
	}, {
		"url": "138.gif",
		alt: "[打击]"
	}, {
		"url": "139.gif",
		alt: "[bye]"
	}, {
		"url": "140.gif",
		alt: "[汗]"
	}, {
		"url": "141.gif",
		alt: "[抠]"
	}, {
		"url": "142.gif",
		alt: "[鼓掌]"
	}, {
		"url": "143.gif",
		alt: "[糟糕]"
	}, {
		"url": "144.gif",
		alt: "[恶搞]"
	}, {
		"url": "145.gif",
		alt: "[什么]"
	}, {
		"url": "146.gif",
		alt: "[什么]"
	}, {
		"url": "147.gif",
		alt: "[累]"
	}],
	[{
		"url": "148.gif",
		alt: "[看]"
	}, {
		"url": "149.gif",
		alt: "[难过]"
	}, {
		"url": "150.gif",
		alt: "[难过]"
	}, {
		"url": "151.gif",
		alt: "[坏]"
	}, {
		"url": "152.gif",
		alt: "[亲]"
	}, {
		"url": "153.gif",
		alt: "[吓]"
	}, {
		"url": "154.gif",
		alt: "[可怜]"
	}, {
		"url": "155.gif",
		alt: "[刀]"
	}, {
		"url": "156.gif",
		alt: "[水果]"
	}, {
		"url": "157.gif",
		alt: "[酒]"
	}, {
		"url": "158.gif",
		alt: "[篮球]"
	}, {
		"url": "159.gif",
		alt: "[乒乓]"
	}, {
		"url": "160.gif",
		alt: "[咖啡]"
	}, {
		"url": "161.gif",
		alt: "[美食]"
	}, {
		"url": "162.gif",
		alt: "[动物]"
	}, {
		"url": "163.gif",
		alt: "[鲜花]"
	}, {
		"url": "164.gif",
		alt: "[枯]"
	}, {
		"url": "165.gif",
		alt: "[唇]"
	}, {
		"url": "166.gif",
		alt: "[爱]"
	}, {
		"url": "167.gif",
		alt: "[分手]"
	}, {
		"url": "168.gif",
		alt: "[生日]"
	}, {
		"url": "169.gif",
		alt: "[电]"
	}, {
		"url": "170.gif",
		alt: "[炸弹]"
	}, {
		"url": "171.gif",
		alt: "[刀子]"
	}],
	[{
		"url": "172.gif",
		alt: "[足球]"
	}, {
		"url": "173.gif",
		alt: "[瓢虫]"
	}, {
		"url": "174.gif",
		alt: "[翔]"
	}, {
		"url": "175.gif",
		alt: "[月亮]"
	}, {
		"url": "176.gif",
		alt: "[太阳]"
	}, {
		"url": "177.gif",
		alt: "[礼物]"
	}, {
		"url": "178.gif",
		alt: "[抱抱]"
	}, {
		"url": "179.gif",
		alt: "[拇指]"
	}, {
		"url": "180.gif",
		alt: "[贬低]"
	}, {
		"url": "181.gif",
		alt: "[握手]"
	}, {
		"url": "182.gif",
		alt: "[剪刀手]"
	}, {
		"url": "183.gif",
		alt: "[抱拳]"
	}, {
		"url": "184.gif",
		alt: "[勾引]"
	}, {
		"url": "185.gif",
		alt: "[拳头]"
	}, {
		"url": "186.gif",
		alt: "[小拇指]"
	}, {
		"url": "187.gif",
		alt: "[拇指八]"
	}, {
		"url": "188.gif",
		alt: "[食指]"
	}, {
		"url": "189.gif",
		alt: "[ok]"
	}, {
		"url": "190.gif",
		alt: "[情侣]"
	}, {
		"url": "191.gif",
		alt: "[爱心]"
	}, {
		"url": "192.gif",
		alt: "[蹦哒]"
	}, {
		"url": "193.gif",
		alt: "[颤抖]"
	}, {
		"url": "194.gif",
		alt: "[怄气]"
	}, {
		"url": "195.gif",
		alt: "[跳舞]"
	}],
	[{
		"url": "196.gif",
		alt: "[发呆]"
	}, {
		"url": "197.gif",
		alt: "[背着]"
	}, {
		"url": "198.gif",
		alt: "[伸手]"
	}, {
		"url": "199.gif",
		alt: "[耍帅]"
	}, {
		"url": "200.png",
		alt: "[微笑]"
	}, {
		"url": "201.png",
		alt: "[生病]"
	}, {
		"url": "202.png",
		alt: "[哭泣]"
	}, {
		"url": "203.png",
		alt: "[吐舌]"
	}, {
		"url": "204.png",
		alt: "[迷糊]"
	}, {
		"url": "205.png",
		alt: "[瞪眼]"
	}, {
		"url": "206.png",
		alt: "[恐怖]"
	}, {
		"url": "207.png",
		alt: "[忧愁]"
	}, {
		"url": "208.png",
		alt: "[眨眉]"
	}, {
		"url": "209.png",
		alt: "[闭眼]"
	}, {
		"url": "210.png",
		alt: "[鄙视]"
	}, {
		"url": "211.png",
		alt: "[阴暗]"
	}, {
		"url": "212.png",
		alt: "[小鬼]"
	}, {
		"url": "213.png",
		alt: "[礼物]"
	}, {
		"url": "214.png",
		alt: "[拜佛]"
	}, {
		"url": "215.png",
		alt: "[力量]"
	}, {
		"url": "216.png",
		alt: "[金钱]"
	}, {
		"url": "217.png",
		alt: "[蛋糕]"
	}, {
		"url": "218.png",
		alt: "[彩带]"
	}, {
		"url": "219.png",
		alt: "[礼物]"
	}, ]
];

var emojiNewList = [
	[{
		url: "e_01_smile.png",
		alt: "[高兴]"
	},{
		url: "e_02_joy.png",
		alt: "[笑哭]"
	},{
		url: "e_03_heart_eyes.png",
		alt: "[喜欢]"
	},{
		url: "e_04_sweat_smile.png",
		alt: "[汗颜]"
	},{
		url: "e_05_laughing.png",
		alt: "[大笑]"
	},{
		url: "e_06_wink.png",
		alt: "[眨眼]"
	},{
		url: "e_07_yum.png",
		alt: "[饥饿]"
	},{
		url: "e_08_relieved.png",
		alt: "[沉默]"
	},{
		url: "e_09_fearful.png",
		alt: "[惊讶]"
	},{
		url: "e_10_ohyeah.png",
		alt: "[调皮]"
	},{
		url: "e_11_cold_sweat.png",
		alt: "[紧张]"
	},{
		url: "e_12_scream.png",
		alt: "[害怕]"
	},{
		url: "e_13_kissing_heart.png",
		alt: "[亲亲]"
	},{
		url: "e_14_smirk.png",
		alt: "[哼哼]"
	},{
		url: "e_15_angry.png",
		alt: "[生气]"
	},{
		url: "e_16_sweat.png",
		alt: "[汗]"
	},{
		url: "e_17_stuck.png",
		alt: "[吐舌]"
	},{
		url: "e_18_rage.png",
		alt: "[发怒]"
	},{
		url: "e_19_etriumph.png",
		alt: "[憋气]"
	},{
		url: "e_20_mask.png",
		alt: "[生病]"
	},{
		url: "e_21_confounded.png",
		alt: "[颤抖]"
	},{
		url: "e_22_sunglasses.png",
		alt: "[得意]"
	},{
		url: "e_23_sob.png",
		alt: "[大哭]"
	},{
		url: "e_24_blush.png",
		alt: "[微笑]"
	}],
	[{
		url: "e_25_hushed.png",
		alt: "[发呆]"
	},{
		url: "e_26_doubt.png",
		alt: "[怀疑]"
	},{
		url: "e_27_flushed.png",
		alt: "[脸红]"
	},{
		url: "e_28_sleepy.png",
		alt: "[睡觉]"
	},{
		url: "e_29_sleeping.png",
		alt: "[睡眠]"
	},{
		url: "e_30_disappointed_relieved.png",
		alt: "[流汗]"
	},{
		url: "e_31_tire.png",
		alt: "[黑眼圈]"
	},{
		url: "e_32_astonished.png",
		alt: "[无奈]"
	},{
		url: "e_33_buttonnose.png",
		alt: "[抠鼻]"
	},{
		url: "e_34_frowning.png",
		alt: "[恍惚]"
	},{
		url: "e_35_shutup.png",
		alt: "[缝嘴]"
	},{
		url: "e_36_expressionless.png",
		alt: "[呆呆]"
	},{
		url: "e_37_confused.png",
		alt: "[翘嘴巴]"
	},{
		url: "e_38_tired_face.png",
		alt: "[皱眉]"
	},{
		url: "e_39_grin.png",
		alt: "[龇牙]"
	},{
		url: "e_40_unamused.png",
		alt: "[瞅一瞅]"
	},{
		url: "e_41_persevere.png",
		alt: "[悲伤]"
	},{
		url: "e_42_relaxed.png",
		alt: "[可爱]"
	},{
		url: "e_43_pensive.png",
		alt: "[叹气]"
	},{
		url: "e_44_no_mouth.png",
		alt: "[呆懵]"
	},{
		url: "e_45_worried.png",
		alt: "[无奈]"
	},{
		url: "e_46_cry.png",
		alt: "[眼泪]"
	},{
		url: "e_47_pill.png",
		alt: "[药]"
	},{
		url: "e_48_celebrate.png",
		alt: "[啤酒]"
	}],
	[{
		url: "e_49_gift.png",
		alt: "[礼物]"
	},{
		url: "e_50_birthday.png",
		alt: "[生日]"
	},{
		url: "e_51_pray.png",
		alt: "[祈祷]"
	},{
		url: "e_52_ok_hand.png",
		alt: "[ok]"
	},{
		url: "e_53_first.png",
		alt: "[握拳]"
	},{
		url: "e_54_v.png",
		alt: "[剪刀手]"
	},{
		url: "e_55_punch.png",
		alt: "[拳头]"
	},{
		url: "e_56_thumbsup.png",
		alt: "[厉害]"
	},{
		url: "e_57_thumbsdown.png",
		alt: "[鄙视]"
	},{
		url: "e_58_muscle.png",
		alt: "[肌肉]"
	},{
		url: "e_59_maleficeent.png",
		alt: "[鼓掌]"
	},{
		url: "e_60_broken_heart.png",
		alt: "[心碎]"
	},{
		url: "e_61_heart.png",
		alt: "[心]"
	},{
		url: "e_62_taxi.png",
		alt: "[出租车]"
	},{
		url: "e_63_eyes.png",
		alt: "[眼睛]"
	},{
		url: "e_64_rose.png",
		alt: "[玫瑰]"
	},{
		url: "e_65_ghost.png",
		alt: "[鬼魂]"
	},{
		url: "e_66_lip.png",
		alt: "[红唇]"
	},{
		url: "e_67_fireworks.png",
		alt: "[庆祝]"
	},{
		url: "e_68_balloon.png",
		alt: "[气球]"
	},{
		url: "e_69_clasphands.png",
		alt: "[握手]"
	},{
		url: "e_70_bye.png",
		alt: "[抱拳]"
	}]
]

var emojiNewTwoList = [
	[{
		url: "1.png",
		alt: "[傲慢]"
	},{
		url: "2.png",
		alt: "[白眼]"
	},{
		url: "3.png",
		alt: "[鄙视]"
	},{
		url: "4.png",
		alt: "[闭嘴]"
	},{
		url: "5.png",
		alt: "[擦汗]"
	},{
		url: "6.png",
		alt: "[吃瓜]"
	},{
		url: "7.png",
		alt: "[呲牙]"
	},{
		url: "8.png",
		alt: "[大哭]"
	},{
		url: "9.png",
		alt: "[调皮]"
	},{
		url: "10.png",
		alt: "[发呆]"
	},{
		url: "11.png",
		alt: "[发怒]"
	},{
		url: "12.png",
		alt: "[奋斗]"
	},{
		url: "13.png",
		alt: "[尴尬]"
	},{
		url: "14.png",
		alt: "[干杯]"
	},{
		url: "15.png",
		alt: "[鼓掌]"
	},{
		url: "16.png",
		alt: "[害羞]"
	},{
		url: "17.png",
		alt: "[憨笑]"
	},{
		url: "18.png",
		alt: "[汗]"
	},{
		url: "19.png",
		alt: "[嘿哈]"
	},{
		url: "20.png",
		alt: "[坏笑]"
	},{
		url: "21.png",
		alt: "[机智]"
	},{
		url: "22.png",
		alt: "[加油]"
	},{
		url: "23.png",
		alt: "[奸笑]"
	},{
		url: "24.png",
		alt: "[惊恐]"
	}],
	[{
		url: "25.png",
		alt: "[惊讶]"
	},{
		url: "26.png",
		alt: "[可怜]"
	},{
		url: "27.png",
		alt: "[恐惧]"
	},{
		url: "28.png",
		alt: "[抠鼻]"
	},{
		url: "29.png",
		alt: "[酷]"
	},{
		url: "30.png",
		alt: "[快哭了]"
	},{
		url: "31.png",
		alt: "[困]"
	},{
		url: "32.png",
		alt: "[脸红]"
	},{
		url: "33.png",
		alt: "[流泪]"
	},{
		url: "34.png",
		alt: "[难过]"
	},{
		url: "35.png",
		alt: "[撇嘴]"
	},{
		url: "36.png",
		alt: "[破涕为笑]"
	},{
		url: "37.png",
		alt: "[敲打]"
	},{
		url: "38.png",
		alt: "[亲亲]"
	},{
		url: "39.png",
		alt: "[色]"
	},{
		url: "40.png",
		alt: "[社会社会]"
	},{
		url: "41.png",
		alt: "[生病]"
	},{
		url: "42.png",
		alt: "[失望]"
	},{
		url: "43.png",
		alt: "[衰]"
	},{
		url: "44.png",
		alt: "[天啊]"
	},{
		url: "45.png",
		alt: "[偷笑]"
	},{
		url: "46.png",
		alt: "[吐]"
	},{
		url: "47.png",
		alt: "[微笑]"
	},{
		url: "48.png",
		alt: "[委屈]"
	}],
	[{
		url: "49.png",
		alt: "[无语]"
	},{
		url: "50.png",
		alt: "[捂脸]"
	},{
		url: "51.png",
		alt: "[笑脸]"
	},{
		url: "52.png",
		alt: "[嘘]"
	},{
		url: "53.png",
		alt: "[耶]"
	},{
		url: "54.png",
		alt: "[疑问]"
	},{
		url: "55.png",
		alt: "[阴险]"
	},{
		url: "56.png",
		alt: "[悠闲]"
	},{
		url: "57.png",
		alt: "[右哼哼]"
	},{
		url: "58.png",
		alt: "[左哼哼]"
	},{
		url: "59.png",
		alt: "[愉快]"
	},{
		url: "60.png",
		alt: "[晕]"
	},{
		url: "61.png",
		alt: "[再见]"
	},{
		url: "62.png",
		alt: "[咒骂]"
	},{
		url: "63.png",
		alt: "[皱眉]"
	},{
		url: "64.png",
		alt: "[抓狂]"
	},{
		url: "65.png",
		alt: "[Emm]"
	},{
		url: "66.png",
		alt: "[骷髅]"
	},{
		url: "67.png",
		alt: "[爱心]"
	},{
		url: "68.png",
		alt: "[碎心]"
	},{
		url: "69.png",
		alt: "[礼物]"
	},{
		url: "70.png",
		alt: "[啤酒]"
	}]
]

module.exports = {
	emojiNewTwoList,
	// 替换表情符号为图片
	replaceEmoji: function(str) {
		let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
			for (let i = 0; i < emojiNewTwoList.length; i++) {
				let row = emojiNewTwoList[i];
				for (let j = 0; j < row.length; j++) {
					let EM = row[j];
					if (EM.alt == item) {
						//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
						//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
						// let onlinePath = '/static/emoji/'
						let onlinePath = 'https://hejiume-public.oss-cn-chengdu.aliyuncs.com/app/emojiNewTwo/'
						let imgstr = '<img style="width:24px;height:24px;margin-bottom:-5px" src="' + onlinePath + EM.url + '">';
						// console.log("imgstr: " + imgstr);
						return imgstr;
					}
				}
			}
		});
		// return '<div style="display: flex;align-items: center;word-wrap:break-word;">' + replacedStr + '</div>';
		return '<div style="word-wrap:break-word;">' + replacedStr + '</div>';
		// return replacedStr;
	},

	//按指定字段升序
	compareAscSort: function(propertyName) {
		return function(object1, object2) {
			var value1 = object1[propertyName];
			var value2 = object2[propertyName];
			if (value2 < value1) {
				return 1;
			} else if (value2 > value1) {
				return -1;
			} else {
				return 0;
			}
		}
	},
	//按指定字段降序	  
	compareDescSort: function(propertyName) {
		return function(object1, object2) {
			var value1 = object1[propertyName];
			var value2 = object2[propertyName];
			if (value2 > value1) {
				return 1;
			} else if (value2 < value1) {
				return -1;
			} else {
				return 0;
			}
		}
	},
	// 根据性别的string值获取性别文本
	getGender: function(txt) {
		var gender = "未知"; // 未知
		switch (txt) {
			case "unknown":
				gender = "保密"
				break;
			case "male":
				gender = "男"; // 男
				break;
			case "female":
				gender = "女"; // 女
				break;
			default:
				break;
		}
		return gender;
	},
	// 根据性别的string值获取性别的id
	getGenderIndex: function(txt) {
		var gender = 0; // 未知
		switch (txt) {
			case "unknown":
				gender = 0
				break;
			case "male":
				gender = 1; // 男
				break;
			case "female":
				gender = 2; // 女
				break;
			default:
				break;
		}
		return gender;
	},
	// 数组去除重复，item为重复判定项
	combineObjectInList: function(arr, item) {
		var obj = {};
		var a = [];
		for (var i in arr) {
			if (!obj[arr[i][item]]) {
				obj[arr[i][item]] = arr[i]; //数组克隆
			}
		}
		for (var k in obj) {
			a.push(obj[k]);
		}
		return a;
	},
	// 获取当前时间，支持类型str、H:i:s、Y-m-d，默认为毫秒级时间戳
	currentTime: function(returnType, addVal) {
		var dateObj = new Date();
		var cTime = dateObj.getTime();
		if (addVal) {
			cTime += addVal;
		}
		if (!returnType) {
			return cTime;
		}
		return this.formatDateTime(cTime, returnType);
	},
	// 时间戳(带毫秒,多000)转日期
	// returnType:"str" => YY-mm-dd HH:ii:ss
	// returnType:"H:i:s" => HH:ii:ss
	// returnType:"Y-m-d" => YY-mm-dd
	formatDateTime: function(timeStamp, returnType) {
		// console.log(timeStamp);
		var date = new Date();
		// date.setTime(timeStamp * 1000);
		date.setTime(timeStamp);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		if (returnType == 'str') {
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		}
		if (returnType == 'H:i:s') {
			return h + ':' + minute + ':' + second;
		}
		if (returnType == 'Y-m-d') {
			return y + '-' + m + '-' + d;
		}
		return [y, m, d, h, minute, second];
	},
	// 日期转时间戳
	dateToTimeStamp: function(timeStamp) {
		console.log(timeStamp);
		var reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
		var res = timeStamp.match(reg);
		if (res == null) {
			var reg2 = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
			var res2 = timeStamp.match(reg2);
			if (res2 == null) {
				console.log('时间格式错误 E001');
				return false;
			} else {
				var year = parseInt(res2[3]);
				var month = parseInt(res2[1]);
				var day = parseInt(res2[2]);
			}
		} else {
			var year = parseInt(res[1]);
			var month = parseInt(res[2]);
			var day = parseInt(res[3]);
		}
		if (year < 1000) {
			console.log('时间格式错误');
			return false;
		}
		return Date.parse(new Date(year, month - 1, day)) / 1000;
	},
	// 日期转时间戳
	dateTimeToTimeStamp: function(timeStamp) {
		var reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
		var res = timeStamp.match(reg);
		if (res == null) {
			var reg2 = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
			var res2 = timeStamp.match(reg2);
			if (res2 == null) {
				console.log('时间格式错误 E001');
				return false;
			} else {
				var year = parseInt(res2[3]);
				var month = parseInt(res2[1]);
				var day = parseInt(res2[2]);
				var h = parseInt(res2[4]);
				var i = parseInt(res2[5]);
				var s = parseInt(res2[6]);
			}
		} else {
			var year = parseInt(res[1]);
			var month = parseInt(res[2]);
			var day = parseInt(res[3]);
			var h = parseInt(res[4]);
			var i = parseInt(res[5]);
			var s = parseInt(res[6]);
		}
		if (year < 1000) {
			console.log('时间格式错误');
			return false;
		}
		if (h < 0 || h > 24) {
			console.log('时间格式错误');
			return false;
		}
		if (i < 0 || i > 60) {
			console.log('时间格式错误');
			return false;
		}
		if (s < 0 || s > 60) {
			console.log('时间格式错误');
			return false;
		}
		return Date.parse(new Date(year, month - 1, day, h, i, s)) / 1000;
	},
	// 过去时间计算，传参毫秒级时间戳
	fromTimer : function (time){
	    var timer =  (new Date()).getTime() - time;
		timer = parseInt(timer / 1000);
	    if(timer < 180){
	        return '刚刚';
	    }else if(timer >= 180 && timer < 3600){
	        return parseInt(timer / 60) + '分钟前';
	    }else if(timer >= 3600 && timer < 86400){
	        return parseInt(timer / 3600) + '小时前';
	    }else if(timer >= 86400 && timer < 2592000){
	        return parseInt(timer / 86400) + '天前';
	    }else{
	        return this.formatDateTime(time, 'str');
	    }
	},
	// 指定时间，与当前时间对比，是否在指定分钟内
	// timeStamp传带毫秒的时间戳
	withinMinute:function(timeStamp,min){
		var currentTime = this.currentTime();
		let diff = (currentTime - timeStamp) / 1000;
		// console.log("当前时间：" + currentTime);
		// console.log("发送时间：" + timeStamp);
		// console.log(diff);
		if(diff <= (min * 60)){
			return true;
		}else{
			return false;
		}
	},
	/**
	 * 数据 按照 拼音首字母 排序 并分组
	 * 
	 * @param {Json} data ; 需要 排序的 数据
	 * @param {String} field ；必须；排序所依据的 字段 名
	 * 
	 * @return {Json} ; 例如：{A:[{},{}],B:[{},{}],C:[{}],#:[]}
	 */
	data_letter_sort: function(data, field) {
		var letter_reg = /^[A-Z]$/;
		var list = new Array();
		var letter;
		for (var i = 0; i < data.length; i++) {
			// 添加 # 分组，用来 存放 首字母不能 转为 大写英文的 数据
			list['#'] = new Array();
			// 首字母 转 大写英文
			letter = (data[i][field]).substr(0, 1).toUpperCase();
			// 是否 大写 英文 字母
			if (!letter_reg.test(letter)) {
				letter = '#';
			}
			// 创建 字母 分组
			if (!(letter in list)) {
				list[letter] = new Array();
			}
			data[i]['name'] = letter;
			// 字母 分组 添加 数据
			list[letter].push(data[i]);
		}
		// 转换 格式 进行 排序；
		var resault = new Array();
		for (var key in list) {
			resault.push({
				letter: key,
				list: list[key]
			});
		}
		resault.sort(function(x, y) {
			return x.letter.charCodeAt(0) - y.letter.charCodeAt(0);
		});
		// # 号分组 放最后
		var last_arr = resault[0];
		resault.splice(0, 1);
		resault.push(last_arr);

		// 转换 数据 格式
		var json_sort = {}
		for (var i = 0; i < resault.length; i++) {
			json_sort[resault[i].letter] = resault[i].list;
		}

		return json_sort;
	},
	/**
	 * 判断指定时间戳是否是今天
	 * @param {Object} obj
	 * timeStamp
	 */
	timeStampToIsToday:function (timeStamp) {
		var currentTime = this.currentTime("Y-m-d");
		var date = this.formatDateTime(timeStamp,"Y-m-d")
		// console.log(timeStamp.toString().substr(0, 15));
	  return currentTime === date;
	}
	
}
