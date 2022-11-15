<template>
	<view @click="hidePopup">
		
		<!-- 如果对方是精品代理，显示邀请对方配送 -->
		<view class="invite" v-if="chatUser.distributorIsOpen && orderList.length > 0">
			<view class="invite-item" v-for="(item, i) in orderList" :key="i">
				<text class="iconfont del" @click="onCloseOrder(i)">&#xe638;</text>
				<text class="font30" @click="takOrder(item, 1, true, i)">已购买精品商品[{{item.goodsName}}]x{{item.number}},邀请对方配送</text>
			</view>
		</view>

		<view class="content" @touchstart="hideDrawer">
			<view class="tips" v-if="warning">
				<icon type="cancel" color="#381895" size="20" style="margin-right: 10rpx;" @click="warning = ''" />
				<text>{{warning}}</text>
			</view>
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop"
			 :scroll-into-view="scrollToView" upper-threshold="50" :style="[{top:CustomBar+'px'}]">
				<!-- 占位 -->
				<view style="height: 100rpx;" v-if="warning"></view>
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="ifHaveMore==true" @click="loadHistory">
					<button class="mini-btn" type="default" size="mini" v-if="isHistoryLoading == false">查看更多</button>
					<view class="spinner" v-if="isHistoryLoading == true">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>

				<view class="row" v-else>
					<view class="system">
						<!-- 文字消息 -->
						<view class="text">暂无更多记录</view>
					</view>
				</view>

				<view class="row" v-for="(row,index) in msgList" :key="index" :id="'scroll_'+row.uid">
					<view class="system" v-if="row.messageType == 'event'">
						<!-- 行为消息 -->
						<view class="text">{{row.content.text}}</view>
					</view>
					
					<view class="system" v-if="row.msgType === 99">
						<!-- 消息撤回 -->
						<view class="text">{{row.from === userInfo.imAccount?'您':'对方'}}撤回了一条消息</view>
					</view>
					<block v-else>
						<view class="system" style="margin-bottom: 10px;" v-if="row.createAt">
							<!-- 时间 -->
							<view class="text">{{row.createAt}}</view>
						</view>
						<checkbox-group class="flex flex-center" @change="checkboxChange($event, index)">
							<checkbox value="checked" :checked="row.checked" v-if="row.isRadio" />
							<!-- 自己发出的消息 -->
							<view class="my" v-if="row.froms === userInfo.imAccount || row.from === userInfo.imAccount">
								<!-- 长按-复制-删除-多选 -->
								<view class="option" v-if="row.optionShow">
									<view class="option-wrap">
										<view class="conText">
											<text class="txt" v-if="row.msgType === 0" @tap.stop="onCopy(row.content.text)">复制</text>
											<text class="txt" v-if="row.msgType === 0 && row.telPhone" @tap.stop="callPhone(row.telPhone)">拨打</text>
											<text class="txt" @tap.stop="delMsg(true)">删除</text>
											<text class="txt" @tap.stop="selectAll">多选</text>
											<text class="txt" @tap.stop="onRecall(row.uid, index)">撤回</text>
										</view>
										<image src="/static/down.png" class="icon" mode=""></image>
									</view>
								</view>
								<!-- <view class="flex flex-align-end flex-space-end" style="margin-right: 10rpx;" @click="repeatSend(row, index)">
									<text class="color-red font38 iconfont">&#xe659;</text>
								</view> -->
								<!-- 左-消息 -->
								<view class="left" @longtap="longtap(row, index)">
									<!-- 文字消息 -->
									<view v-if="row.msgType === 0" class="bubble">
										<rich-text :nodes="row.content.contentTxt"></rich-text>
									</view>
									<!-- 图片消息 -->
									<view v-if="row.msgType === 1" class="bubble img" @tap="showPic(row.content.url)">
										<image :src="filterImg(row.content.url, 4)" mode="aspectFill" :style="{'width': row.ossWidth+'px','height': row.ossHeight+'px'}"></image>
									</view>
									<!-- 语音消息 -->
									<view v-if="row.msgType === 2" class="bubble voice" @tap="playVoice(index)" :class="playMsgid === row.uid?'play':''">
										<view class="length">{{row.content.length}}</view>
										<view class="icon my-voice"></view>
									</view>
									<!-- 发送位置 -->
									<view class="bubble location" v-if="row.msgType===3" @tap="viewLocation(row.content)">
										<view class="addr">
											<text class="desc line">{{row.content.name}}</text>
											<text class="city line">{{row.content.address}}</text>
										</view>
										<view class="map">
											<image src="/static/map.png" mode="" class="mapIcon"></image>
											<image src="/static/icon_position.png" mode="" class="markers"></image>
										</view>
									</view>
									<!-- 视频消息 -->
									<view v-if="row.msgType === 4" class="bubble img video" @click="playVideo(row)">
										<block v-if="row.content.ossTailoringUrl">
											<image :src="row.content.ossTailoringUrl" mode="aspectFill" :style="{'width': row.ossWidth+'px','height': row.ossHeight+'px'}"></image>
											<text class="iconfont playIcon">&#xe601;</text>
											<text class="time">{{row.content.length}}</text>
										</block>
										<view class="flex flex-center percent" v-if="row.percent > 0 && row.percent < 100">
											<cmd-progress type="circle" :stroke-width="2" stroke-color="#381895" :percent="row.percent"></cmd-progress>
										</view>
									</view>
									<!-- 视频语音通话 -->
									<view v-if="row.msgType === 5" class="bubble" @click="videoCall(row.content.callType)">
										<text>{{row.content.text}} {{row.content.time?row.content.time:''}}</text>
										<text class="iconfont color-w font44" style="margin-left: 10rpx;" v-if="row.content.callType === 'video'">&#xe811;</text>
										<text class="iconfont color-w font44" style="margin-left: 10rpx;" v-else>&#xe6fc;</text>
									</view>
									<!-- 邀请对方接单 -->
									<view v-if="row.msgType === 6" class="bubble goods color-w" @tap="jumpToOrder(row.content, 1)">
										<text class="font32 line line-2">{{row.content.goodsName}}</text>
										<view class="flex" style="width: 100%;">
											<view class="flex flex-column flex-grow font30" style="width: 100%;">
												<text class="sku line">{{row.content.skuName}}</text>
												<text class="sku">¥{{row.content.price}}</text>
											</view>
											<view><image :src="row.content.goodsImage" mode=""></image></view>
										</view>
										<text class="color-b6 font28" v-if="row.content.status === 3 && row.content.reason">取消配送原因：{{row.content.reason}}</text>
										<view class="flex flex-align-center flex-space-around" style="width: 100%;">
											<block v-if="row.content.identity === userInfo.imAccount">
												<!-- 配送员 -->
												<text class="btn" v-if="row.content.status === 1" @tap.stop="takOrder(row, 4)">确认接单</text>
												<text class="btn" v-if="row.content.status === 1" @tap.stop="takOrder(row, 3)">取消接单</text>
												<text class="btn" v-if="row.content.status === 2">已取消配送</text>
												<text class="btn" v-if="row.content.status === 3">已取消接单</text>
												<text class="btn" v-if="row.content.status === 4">已接单</text>
											</block>
											<block v-else>
												<!-- 用户 -->
												<text class="btn" v-if="row.content.status === 1" @tap.stop="takOrder(row, 2)">取消配送</text>
												<text class="btn" v-if="row.content.status === 2 || row.content.status === 3" @tap.stop="takOrder(row, 1)">邀请接单</text>
												<text class="btn" v-if="row.content.status === 4">已接单</text>
											</block>
										</view>
									</view>
									<!-- 商品退款 -->
									<view v-if="row.msgType === 7" class="bubble goods color-w" @click="jumpToOrder(row.content, 2)">
										<text class="font32 line line-2">{{row.content.goodsName}}</text>
										<view class="flex" style="width: 100%;">
											<view class="flex flex-column flex-grow font30" style="width: 100%;">
												<text class="sku line">{{row.content.skuName}}</text>
												<text class="sku">¥{{row.content.price}}</text>
											</view>
											<view><image :src="row.content.goodsImage" mode=""></image></view>
										</view>
										<text class="font28">{{row.content.userType === 1 ? '用户' : '商家'}}退款，原因：{{row.content.reason}}</text>
									</view>
									<!-- 用户下单 -->
									<view v-if="row.msgType === 8" class="bubble goods color-w" @click="jumpToOrder(row.content, 3)">
										<text class="font32 line line-2">{{row.content.goodsName}}</text>
										<view class="flex" style="width: 100%;">
											<view class="flex flex-column flex-grow font30" style="width: 100%;">
												<text class="sku line">{{row.content.skuName}}</text>
												<text class="sku">¥{{row.content.price}}x{{row.content.numer}}</text>
											</view>
											<view><image :src="row.content.goodsImage" mode=""></image></view>
										</view>
										<view class="flex flex-align-center flex-space-around" style="width: 100%;">
											<text class="btn">已下单</text>
										</view>
									</view>
								</view>
								<!-- 右-头像 -->
								<view class="right" @tap="goUser(userInfo.imAccount)">
									<image mode="aspectFill" :src="filterImg(headPortrait, 1) || '/static/user/avatar.png'"></image>
								</view>
							</view>
							<!-- 别人发出的消息 -->
							<view class="other" v-else>
								<!-- 长按-复制-删除-多选 -->
								<view class="option" v-if="row.optionShow">
									<view class="option-wrap">
										<view class="conText">
											<text class="txt" v-if="row.msgType === 0" @tap.stop="onCopy(row.content.text)">复制</text>
											<text class="txt" v-if="row.msgType === 0 && row.telPhone" @tap.stop="callPhone(row.telPhone)">拨打</text>
											<text class="txt" @tap.stop="delMsg(true)">删除</text>
											<text class="txt" @tap.stop="selectAll">多选</text>
										</view>
										<image src="/static/down.png" class="icon" mode=""></image>
									</view>
								</view>
								
								<!-- 左-头像 -->
								<view class="left" @click="otherGoUser">
									<image mode="aspectFill" :src="filterImg((type === 3 ? (chatUser.storeLogoImage || chatUser.headPortrait) : chatUser.headPortrait), 1) || '/static/user/avatar.png'"></image>
								</view>
								<!-- 右-用户名称-时间-消息 -->
								<view class="right" @longtap="longtap(row, index)">
									<!-- 文字消息 -->
									<view v-if="row.msgType === 0" class="bubble">
										<rich-text :nodes="row.content.contentTxt"></rich-text>
									</view>
									<!-- 图片消息 -->
									<view v-if="row.msgType===1" class="bubble img" @tap="showPic(row.content.url)">
										<image :src="filterImg(row.content.url, 4)" mode="aspectFill" :style="{'width': row.ossWidth+'px','height': row.ossHeight+'px'}"></image>
									</view>
									<!-- 语音消息 -->
									<view v-if="row.msgType===2" class="bubble voice" @tap="playVoice(index)" :class="playMsgid === row.uid?'play':''">
										<view class="icon other-voice"></view>
										<view class="length">{{row.content.length}}</view>
									</view>
									<!-- 发送位置 -->
									<view class="bubble location" v-if="row.msgType===3" @tap="viewLocation(row.content)">
										<view class="addr">
											<text class="desc line">{{row.content.name}}</text>
											<text class="city line">{{row.content.address}}</text>
										</view>
										<view class="map">
											<image src="/static/map.png" mode="" class="mapIcon"></image>
											<image src="/static/icon_position.png" mode="" class="markers"></image>
										</view>
									</view>
									<!-- 视频消息 -->
									<view v-if="row.msgType === 4" class="bubble img video" @click="playVideo(row)">
										<image :src="row.content.ossTailoringUrl" mode="aspectFill" :style="{'width': row.ossWidth+'px','height': row.ossHeight+'px'}"></image>
										<text class="iconfont playIcon">&#xe601;</text>
										<text class="time">{{row.content.length}}</text>
									</view>
									<!-- 视频语音通话 -->
									<view v-if="row.msgType === 5" class="bubble" @click="videoCall(row.content.callType)">
										<text class="iconfont font44" style="margin-right: 10rpx;" v-if="row.content.callType === 'video'">&#xe64e;</text>
										<text class="iconfont font44" style="margin-right: 10rpx;" v-else>&#xe6fc;</text>
										<text>{{row.content.text}} {{row.content.time?row.content.time:''}}</text>
									</view>
									<!-- 接单 -->
									<view v-if="row.msgType === 6" class="bubble goods color-w" @tap="jumpToOrder(row.content, 1)">
										<text class="font32 line line-2">{{row.content.goodsName}}</text>
										<view class="flex" style="width: 100%;">
											<view><image :src="row.content.goodsImage" mode=""></image></view>
											<view class="flex flex-column flex-grow font30">
												<text class="sku line">{{row.content.skuName}}</text>
												<text class="sku">¥{{row.content.price}}</text>
											</view>
										</view>
										<text class="color-b6 font28" v-if="row.content.status === 3 && row.content.reason">取消配送原因：{{row.content.reason}}</text>
										<view class="flex flex-align-center flex-space-around" style="width: 100%;">
											<block v-if="row.content.identity === userInfo.imAccount">
												<!-- 配送员 -->
												<text class="btn" v-if="row.content.status === 1" @tap.stop="takOrder(row, 4)">确认接单</text>
												<text class="btn" v-if="row.content.status === 1" @tap.stop="takOrder(row, 3)">取消接单</text>
												<text class="btn" v-if="row.content.status === 2">已取消配送</text>
												<text class="btn" v-if="row.content.status === 3">已取消接单</text>
												<text class="btn" v-if="row.content.status === 4">已接单</text>
											</block>
											<block v-else>
												<!-- 用户 -->
												<text class="btn" v-if="row.content.status === 1" @tap.stop="takOrder(row, 2)">取消配送</text>
												<text class="btn" v-if="row.content.status === 2 || row.content.status === 3" @tap.stop="takOrder(row, 1)">邀请接单</text>
												<text class="btn" v-if="row.content.status === 4">已接单</text>
											</block>
										</view>
									</view>
									<!-- 商品退款 -->
									<view v-if="row.msgType === 7" class="bubble goods color-w" @click="jumpToOrder(row.content, 2)">
										<text class="font32 line line-2">{{row.content.goodsName}}</text>
										<view class="flex" style="width: 100%;">
											<view><image :src="row.content.goodsImage" mode=""></image></view>
											<view class="flex flex-column flex-grow font30" style="width: 100%;">
												<text class="sku line">{{row.content.skuName}}</text>
												<text class="sku">¥{{row.content.price}}</text>
											</view>
										</view>
										<text class="font28">{{row.content.userType === 1 ? '用户' : '商家'}}退款，原因：{{row.content.reason}}</text>
									</view>
									<!-- 用户下单 -->
									<view v-if="row.msgType === 8" class="bubble goods color-w" @click="jumpToOrder(row.content, 3)">
										<text class="font32 line line-2">{{row.content.goodsName}}</text>
										<view class="flex" style="width: 100%;">
											<view><image :src="row.content.goodsImage" mode=""></image></view>
											<view class="flex flex-column flex-grow font30" style="width: 100%;">
												<text class="sku line">{{row.content.skuName}}</text>
												<text class="sku">¥{{row.content.price}}x{{row.content.numer}}</text>
											</view>
										</view>
										<view class="flex flex-align-center flex-space-around" style="width: 100%;">
											<text class="btn">已下单</text>
										</view>
									</view>
								</view>
							</view>
						</checkbox-group>
					</block>
				</view>
				<!-- 键盘占位 -->
				<view :style="{height: keyboardHeight + 'px'}"></view>
				<!-- 抽屉栏占位 -->
				<view :style="{height: popupLayerClass ? '42vw' : '0px'}"></view>
			</scroll-view>
		</view>
		
		<!-- 全选删除 -->
		<view class="input-box" style="width: 100%; z-index: 99;" @touchmove.stop.prevent="discard" v-if="isAllSelect">
			<view class="flex flex-align-center flex-space-around" style="width: 690upx;">
				<image src="/static/del.png" mode="" style="width: 56rpx; height: 56rpx;" @tap.stop="delMsg(false)"></image>
				<text class="font30 color-b6" @tap.stop="cancelAllSelect">取消</text>
			</view>
		</view>
		
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 -->
			<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
				<swiper-item v-for="(page,pid) in emojiList" :key="pid">
					<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
						<image mode="widthFix" :src="'/static/emojiNewTwo/'+em.url"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照 -->
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage">
						<view class="icon tupian2"></view>
					</view>
					<view class="box" @tap="camera">
						<view class="icon paizhao"></view>
					</view>
					<view class="box" @tap="chooseVideo">
						<view class="iconfont font60">&#xe604;</view>
					</view>
					<!-- #ifdef APP-PLUS -->
					<view class="box" @tap="openVideoPopup">
						<view class="iconfont font60">&#xe6db;</view>
					</view>
					<!-- #endif -->
					<view class="box" @tap="chooseLocation">
						<view class="iconfont location font60">&#xe646;</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :style="{bottom: keyboardHeight+'px'}" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice">
				<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="textbox">
				<!-- 使用前端录音模板 -->
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin"
				 @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
				<view class="text-mode" :class="isVoice?'hidden':''">
					<view class="box">
						<textarea
							auto-height="true" :focus="focus" 
							:maxlength="1000" :adjust-position="false" 
							cursor-spacing="10" v-model="textMsg"
							@input="textareaInput"/>
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="send" :class="isVoice?'hidden':''" @touchend.prevent="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
			<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
		
		<uni-popup ref="popup" type="bottom">
			<view class="popup">
				<view class="popup-item" @click="videoCall('video')">
					<text class="popup-item-name">视频通话</text>
				</view>
				<view class="popup-item" @click="videoCall('voice')">
					<text class="popup-item-name">语音通话</text>
				</view>
				<view class="popup-item popup-cancel" @click="closePopup()">
					<text class="popup-item-name">取消</text>
				</view>
			</view>
		</uni-popup>
		
		<video :id="videoObj.uid" :src="videoObj.url" @fullscreenchange="fullscreenchange" style="width: 0;height: 0;"></video>
		
	</view>
</template>
<script>
	import { mapState, mapMutations } from 'vuex'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import cmdProgress from "@/components/cmd-progress/cmd-progress.vue"

	// #ifdef APP-PLUS
	import permision from "@/common/im/permission.js"
	import {
		addDataToChatTable, 
		addDataToSessionTable, 
		updateSessionInformation, 
		updateInformation,
		selectInformationType, 
		deleteInformationType,
		pullSQL
	} from "@/common/im/db.js"
	// #endif
	
	// #ifndef APP-PLUS
		import {
			addDataToChatTable, 
			addDataToSessionTable, 
			updateSessionInformation, 
			updateInformation,
			selectInformationType, 
			deleteInformationType,
			pullSQL
		} from "@/common/im/db-h5.js"
	// #endif
	
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import imUtils from "@/common/im/imTools.js"
	import upload from "@/common/http/upload.js"
	import { getUUID, secondFormat } from "@/common/utils/index.js"
	
	var _self;
	export default {
		components: {
			uniPopup, cmdProgress
		},
		computed: {
			...mapState(['userInfo', 'receiveMessage', 'isOtherOnline', 'interactionOnlineStatus']),
			emojiList: {
				get: function() {
					return imUtils.emojiNewTwoList
				},
				set: function() {}
			}
		},
		data() {
			return {
				headPortrait: "",
				conversationId: "", // 会话id
				conversationInfo: {}, // 当前会话信息
				unreadNumber: 0, // 服务器未读数量
				CustomBar: 0,
				//文字消息
				textMsg: '',
				//消息列表
				isHistoryLoading: false,
				scrollAnimation: false,
				scrollTop: 0,
				scrollToView: '',
				keyboardHeight: 0,
				msgList: [],
				msgImgList: [],
				loadHistoryLimit: 20, // 每次加载历史记录条数
				getMsgListLimit: 20, // 初始化记录的条数
				channelId: "", // 聊天对象的imAccount
				chatUser: {}, // 聊天对象的相关信息
				offset: 0, // 从第几条开始，每获取过一条，+1
				ifHaveMore: true, // 是否还有更多
				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER: uni.getRecorderManager(),
				// #endif
				isVoice: false,
				voiceTis: '按住 说话',
				recordTis: "手指上滑 取消发送",
				recording: false,
				willStop: false,
				initPoint: {
					identifier: 0,
					Y: 0
				},
				recordTimer: null,
				recordLength: 0,
				videoPermission: 0, // 是否开启录音权限

				//播放语音相关参数
				AUDIO: uni.createInnerAudioContext(),
				playMsgid: null,
				VoiceTimer: null,
				// 抽屉参数
				popupLayerClass: '',
				// more参数
				hideMore: true,
				//表情定义
				hideEmoji: true,
				isAllSelect: false,
				deleteIds: [],
				oneClickFlag: true,
				recallIndex: null,
				videoObj: {},
				createVideoContext: null,
				videoKeyObj: {},
				isOnline: true, // 对方是否在线，默认在线
				type: 1, // 会话类型 1-用户 2-配送员 3-店铺
				pages: "", // 从哪个页面进入，点击导航栏按钮的时候进入对方个人主页，默认从user.nvue进入聊天，点击则返回，如果是从会话列表进入聊天，点击进入对方个人主页并隐藏下方按钮
				msgLock: false,
				orderList: [],
				warning: "", // 警示语
				isCustomer: false ,// 是否是客服
				listIndex: 0,
				isSend: false ,// 是否发送消息了
				focus: false
			};
		},
		async onLoad(option) {
			this.pages = option.pages || ""
			if (option.type) this.type = parseInt(option.type)
			if (option.isCustomer === "true") {
				this.isCustomer = true
			}
			if (option.listIndex) this.listIndex = parseInt(option.listIndex)
			this.setHandNewMsg(false)
			_self = this;
			
			this.headPortrait = this.userInfo.headPortrait
			if (!this.headPortrait){
				let userResources = this.userInfo.userResources
				if (userResources) {
					userResources.forEach(v =>{
						if (v.type === 0) {
							this.headPortrait = v.ossUrl
							return
						}
					})
				}
			}
			
			// 获取警示语
			this.$http("GET", url.common.getImChatWarning).then(res => {
				this.warning = res.data
			})
			
			let toUserInfo = await this.$http("GET", url.user.getUserInfoById, {toImAccount: option.id})
			this.chatUser = toUserInfo.data
			if (this.chatUser.distributorIsOpen && !this.isCustomer) {
				this.getOrderList()
			}
			this.channelId = toUserInfo.data.imAccount
			this.getVideoKey()
			// 获取（创建）会话信息
			let conversationInfo = await this.$http("GET", url.im.createConversation, {toImAccount: option.id, type: this.type})
			this.conversationInfo = conversationInfo.data
			this.conversationId = conversationInfo.data.id
			if (this.type === 3) {
				this.title = this.conversationInfo.storeName || this.chatUser.nickname
				this.chatUser.storeLogoImage = this.conversationInfo.storeLogoImage
			} else {
				this.title = this.chatUser.nickname
			}
			uni.setNavigationBarTitle({
				title: this.title
			});
			
			// 发送一条消息，判断对方是否在线
			let sendParams = {
				from: this.userInfo.imAccount,
				to: this.channelId,
				cmd:11,
				chatType: 2,
				msgType: 88,
				content: JSON.stringify({type: "imChat"})
			}
			uni.setStorageSync("imChatSendMsg", sendParams)
			getApp().globalData.socket.sendSocketMessage(sendParams)
			
			this.unreadNumber = this.conversationInfo.unreadNumber
			// 会话表是否存在该会话，没有插入数据，有则更新数据
			let selectRes = await selectInformationType(null, 'id', this.conversationId)
			let data = conversationInfo.data
			data.nickname = this.chatUser.nickname
			if (selectRes.length === 0) {
				data.localUnreadNumber = data.unreadNumber
				await addDataToSessionTable(data)
			} else {
				data.localUnreadNumber = 0
				publics.setConversationUnReadNum(data.id, 0)
				await updateSessionInformation(data, 'id', data.id)
			}
			
			this.getMsgList();
			if (option.sendVideo) {
				this.videoCall(option.callType)
			}
			
			//语音自然播放结束
			this.AUDIO.onEnded((res) => {
				console.log("语音播放结束。。。", res)
				this.playMsgid = null;
				this.$forceUpdate()
			});

			// #ifndef H5
			//录音开始事件
			this.RECORDER.onStart((e) => {
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e) => {
				this.recordEnd(e);
			})
			// #endif
			
			// 监听键盘高度
			uni.onKeyboardHeightChange(res => {
				if (!res.height || res.height <= 0){
					this.focus = false
					this.keyboardHeight = 0
				} else {
					this.focus = true
					this.hideDrawer();
					if (uni.getSystemInfoSync().platform === "ios"){
						this.keyboardHeight = res.height - 35
					} else {
						this.keyboardHeight = res.height
					}
					if (this.msgList.length > 0){
						let uid = this.msgList[this.msgList.length - 1].uid
						this.$nextTick(function() {
							// 滚动到底
							this.scrollToView = 'scroll_'+uid
						});
					}
					this.$forceUpdate()
				}
			})
		},
		onShow() {
			this.scrollTop = 9999999;
			this.keyboardHeight = 0
		},
		onBackPress() {
			if (this.pages === "message") {
				let pages = getCurrentPages(); //当前页面栈
				let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
				if (this.isSend) {
					beforePage.$vm.isChatBack = true;
					beforePage.$vm.isCustomer = this.isCustomer;
					beforePage.$vm.listIndex = this.listIndex;
					beforePage.$vm.lastMsg = this.msgList[this.msgList.length - 1];
				}
				let name = "lists"
				if (this.isCustomer) {
					name = "customerList"
				}
				beforePage.$vm[name][this.listIndex].localUnreadNumber = 0
				beforePage.$vm[name][this.listIndex].headPortrait = this.chatUser.headPortrait
				beforePage.$vm[name][this.listIndex].nickname = this.chatUser.nickname
				if (this.type === 3) {
					beforePage.$vm[name][this.listIndex].storeLogoImage = this.chatUser.storeLogoImage
					beforePage.$vm[name][this.listIndex].storeName = this.conversationInfo.storeName
				}
			}
			return false
		},
		onNavigationBarButtonTap() {
			this.otherGoUser()
		},
		onHide() {
			let unReadTotal = publics.getCUnReadTotal()
			plus.runtime.setBadgeNumber(unReadTotal)
			getApp().localUnReadNum = unReadTotal
		},
		watch: {
			interactionOnlineStatus(val){
				console.log("interactionOnlineStatus.....", val)
				let content = JSON.parse(val.content)
				if (content.type === "imChat"){
					this.isOnline = val.isOnline
				}
			},
			isOtherOnline(val){
				console.log("isOnline......", val)
				this.isOnline = val
			},
			receiveMessage(message){
				console.log("im-chat收到的消息--->>>", message)
				if (message.conversationId === this.conversationId) {
					updateInformation(null, 'localUnreadNumber', 0, 'id', this.conversationId)
					publics.setConversationUnReadNum(this.conversationId, 0)
					let content = JSON.parse(message.content)
					if (message.msgType === 99) {
						deleteInformationType(null, 'uid', content.id)
						this.msgList.map((v, i)=>{
							if (v.uid === content.id) {
								this.msgList.splice(i, 1)
							}
						})
					}
					if(message.msgType === 5 && content.text === "已挂断"){
						this.$msg("对方已挂断")
					}
					
					if (message.msgType === 6) {
						this.updateDBData(content)
					}
					
					this.msgList.push(message)
					this.$nextTick(function() {
						// 滚动到底
						this.scrollToView = 'scroll_'+message.uid
					});
				}
			},
			msgList(val){
				if (!val || val.length === 0) return
				let newList = JSON.parse(JSON.stringify(val))
				this.msgList = this.formatMsgList(val)
				console.log(".........msgList........", this.msgList)
			}
		},
		methods: {
			...mapMutations(['setHandNewMsg']),
			filterImg(img, type){
				return publics.filterImgUrl(img, type)
			},
			getOrderList(){
				this.$http("GET", url.order.orderBoutiqueList).then(res => {
					this.orderList = res.data
				})
			},
			getVideoKey(){
				this.$http("GET", url.im.getVideoKey, {toImAccount: this.channelId}).then(res =>{
					this.videoKeyObj = res.data
				})
			},
			// 进入自己的主页
			goUser(imAccount){
				this.$navigateTo('user?userId='+imAccount)
			},
			// 进入对方主页
			otherGoUser(){
				if (this.pages) {
					this.$navigateTo("user?fromImChat=true&&userId="+this.chatUser.imAccount)
				} else {
					this.$navigateBack()
				}
			},
			hidePopup(){
				this.msgList.map(v=>{
					v.optionShow = false
				})
				this.$forceUpdate()
			},
			longtap(row, index){
				if (this.isAllSelect) return;
				this.msgList.map(v => {
					v.optionShow = false
				})
				this.msgList[index].optionShow = !this.msgList[index].optionShow
				let telPhone = this.selectPhoneNumber(this.msgList[index].content.text)
				this.msgList[index].telPhone = telPhone
				this.deleteIds = []
				this.deleteIds.push({id: row.uid, index: index})
				this.$forceUpdate()
			},
			// 多选
			selectAll(){
				this.isAllSelect = true;
				this.msgList.map(v => {
					v.isRadio = true
					v.checked = false
					v.optionShow = false
				})
			},
			// 取消多选
			cancelAllSelect(){
				this.isAllSelect = false
				this.msgList.map(v => {
					v.isRadio = false
					v.checked = false
				})
			},
			// 多选框选择
			checkboxChange(e, index){
				this.msgList[index].checked = !this.msgList[index].checked
			},
			// 消息删除
			delMsg(isSingleDel){
				if (this.deleteIds.length === 0) return;
				let self = this;
				if (isSingleDel) {
					uni.showActionSheet({
					    itemList: ['是否删除该条消息', '确定', '取消'],
					    success: function (res) {
							if (res.tapIndex === 1) {
								deleteInformationType(null, 'uid', self.deleteIds[0].id)
								self.msgList.splice(self.deleteIds[0].index, 1)
							}
					    }
					});
				} else {
					this.msgList.map((v, i) => {
						if (v.checked) {
							deleteInformationType(null, 'uid', v.uid)
							this.msgList.splice(i, 1)
						}
					})
					this.cancelAllSelect()
				}
			},
			formatMsgList(array){
				let linTime = array[0].createTime
				array[0].createAt = imUtils.formatDateTime(linTime, "str");
				array.forEach((v,i) => {
					if (typeof v.content === "string"){
						v.content = JSON.parse(v.content)
					}
					if (v.msgType === 0) {
						v.content.contentTxt = imUtils.replaceEmoji(v.content.text)
					}
					if (i !== 0) {
						v.createAt = ""
						if (v.createTime - linTime <= 5*60*1000) {
							v.createAt = ""
						} else {
							linTime = v.createTime
							let isToday = imUtils.timeStampToIsToday(v.createTime);
							if(isToday) {
								v.createAt = imUtils.formatDateTime(v.createTime, "H:i:s");
							} else {
								v.createAt = imUtils.formatDateTime(v.createTime, "str");
							}
						}
					}
				})
				return array
			},
			// 撤回
			onRecall(uid, index){
				this.hidePopup()
				this.recallIndex = index
				let content = {
					id: uid
				}
				this.sendMsg(content, 'recall')
			},
			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e) {
				if (this.isHistoryLoading) return
				if (!this.ifHaveMore) return
				this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false; //关闭滑动动画
				// 从服务器获取未读消息
				if (this.unreadNumber > 0) {
					this.$http("GET", url.im.unreadOneMsgByConversationId, {conversationId: this.conversationId}).then(res =>{
						this.unreadNumber = this.unreadNumber - res.data.length
						// updateInformation(null, 'unreadNumber', this.unreadNumber, 'id', this.conversationId)
						// 如果长度等于服务器未读数量，就表示没有下一页了
						if (res.data.length === this.unreadNumber) {
							this.ifHaveMore = false;
						}
						let list = res.data
						// 添加到数据库
						list.map(v =>{
							addDataToChatTable(v)
						})
						this.msgList = [...list, ...this.msgList]
						let Viewid = 'scroll_'+res[0].uid;
						this.$nextTick(function() {
							this.scrollToView = Viewid; //跳转上次的第一行信息位置
							this.$nextTick(function() {
								this.scrollAnimation = true; //恢复滚动动画
							});
						});
						this.isHistoryLoading = false;
						// 回调
						this.$http("POST", url.im.unreadOneMsgSuccessCallback, {conversationId: this.conversationId})
					})
				} else {
					pullSQL(null, 'conversationId', this.conversationId, this.msgList.length, this.getMsgListLimit, 'desc').then(res =>{
						if (res.length > 0) {
							// 格式化数据
							res = res.reverse()
							let list = res
							this.msgList = [...list, ...this.msgList]
							let Viewid = 'scroll_'+res[0].id;
							this.$nextTick(function() {
								this.scrollToView = Viewid; //跳转上次的第一行信息位置
								this.$nextTick(function() {
									this.scrollAnimation = true; //恢复滚动动画
								});
							});
							this.isHistoryLoading = false;
						} else {
							this.ifHaveMore = false;
							this.isHistoryLoading = false;
						}
					})
				}
			},
			// 加载初始页面消息
			getMsgList() {
				// 消息列表
				pullSQL(null, 'conversationId', this.conversationId, 0, this.getMsgListLimit, 'desc').then(res=>{
					if (res.length < 1) {
						// 没有历史记录
						this.ifHaveMore = false;
						return false;
					}
					res = res.reverse()
					let list = res
					this.msgList = list
					// 滚动到底部
					this.$nextTick(function() {
						//进入页面滚动到底部
						this.scrollTop = 9999;
						this.$nextTick(function() {
							this.scrollAnimation = true;
						});
					});
					// 如果长度不足20条，就表示没有下一页了
					if (res.length < this.getMsgListLimit) {
						this.ifHaveMore = false;
					}
				}).catch(err=>{
					this.ifHaveMore = false;
				})
			},
			setList(items){
				items.forEach(v=>{
					v.content = JSON.parse(v.content)
					if (v.msgType === 0) {
						v.content.contentTxt = imUtils.replaceEmoji(v.content.text)
					}
				})
				return items
			},
			selectPhoneNumber(str) {
			    let regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
				let phoneNums = str.match(regx);
				return phoneNums
			},
			onCopy(msg){
				this.$onCopy(msg)
				this.hidePopup()
			},
			callPhone(temp){
				this.hidePopup()
				if (temp.length === 1) {
					uni.makePhoneCall({
					    phoneNumber: temp[0]
					});
				} else {
					uni.showActionSheet({
					    itemList: temp,
					    success: function (res) {
							uni.makePhoneCall({
							    phoneNumber: temp[res.tapIndex]
							});
					    }
					});
				}
			},
			onCloseOrder(i){
				this.orderList.splice(i, 1)
			},
			// 接单操作, type 1=用户邀请接单，2=用户取消配送，3=配送员取消接单, 4=配送员接单，
			takOrder(row, type, status, index){
				let _this = this
				let path = null
				let params = {
					orderId: status ? row.id : row.content.orderId
				}
				if (type === 1) {
					path = url.distributor.choiceDistributor
					params.distributorUserId = this.chatUser.id
				} else if (type === 2) {
					path = url.distributor.cancelDistributor
				} else if (type === 3) {
					path = url.distributor.cancelReceiptOrder
				} else if (type === 4) {
					path = url.distributor.confirmReceiptOrder
				}
				if (!path) return
				this.$http("POST", path, params).then((res)=>{
					_this.$msg(res.data)
					let content = null
					if (status) {
						content = {
							orderId: row.id,
							goodsId: row.goodsId, // 商品id
							goodsImage: row.skuImage || row.goodsImage, // 商品图片
							goodsName: row.goodsName,
							skuName: row.skuName,
							price: row.totalPrice,
							status: 1 , // 1-邀请对方接单，用户和配送员都可操作取消 2-用户取消配送 3-配送员取消接单 4-配送员接单
							identity: this.chatUser.imAccount, // 配送员的imAccount
						}
						this.onCloseOrder(index)
					} else {
						content = row.content
						content.status = type
					}
					this.updateDBData(content)
					this.sendMsg(content, "goods")
				})
			},
			updateDBData(data){
				this.msgList.map(v => {
					if (v.msgType === 6 && parseInt(v.content.orderId) === parseInt(data.orderId)) {
						v.content.status = data.status
						updateInformation("chatList", "content", JSON.stringify(v.content), "uid", v.uid)
					}
				})
			},
			// 跳转到订单 1-接单，跳转到商品 2-退款 3-用户下单
			jumpToOrder(row, type){
				if (type === 1) {
					this.$navigateTo("/pages/home/details?id="+row.goodsId)
				} else {
					if (row.identity === this.userInfo.imAccount) { // 如果是商家
						this.$navigateTo("/pages/merchants/order/details?id="+row.orderId)
					} else {
						this.$navigateTo("/pages/order/details?id="+row.orderId)
					}
				}
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content) {
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
				let maxH = uni.upx2px(350); //350是定义消息图片最大高度
				if (content.w > maxW || content.h > maxH) {
					let scale = content.w / content.h;
					content.w = (scale > 1 ? maxW : maxH * scale).toString();
					content.h = (scale > 1 ? maxW / scale : maxH).toString();
				}
				return content;
			},
			//更多功能(点击+弹出) 
			showMore() {
				this.isVoice = false;
				this.hideEmoji = true;
				// 打开面板
				if (this.hideMore) {
					this.hideMore = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer() {
				this.popupLayerClass = 'showLayer';
				if (this.msgList.length > 0){
					let uid = this.msgList[this.msgList.length - 1].uid
					this.$nextTick(function() {
						// 滚动到底
						this.scrollToView = 'scroll_'+uid
					});
				}
			},
			// 隐藏抽屉
			hideDrawer() {
				this.popupLayerClass = '';
				setTimeout(() => {
					this.hideMore = true;
					this.hideEmoji = true;
				}, 150);
			},
			openVideoPopup(){
				this.$refs.popup.open()
			},
			closePopup(){
				this.$refs.popup.close()
			},
			// 视频语音通话
			async videoCall(callType){
				this.hideDrawer();
				this.closePopup()
				// 发送一条消息，判断对方是否在线
				let sendParams = {
					from: this.userInfo.imAccount,
					to: this.channelId,
					cmd:11,
					chatType: 2,
					msgType: 88,
					content: JSON.stringify({type: "imChat"})
				}
				uni.setStorageSync("imChatSendMsg", sendParams)
				getApp().globalData.socket.sendSocketMessage(sendParams)
				let that = this;
				setTimeout(()=>{
					if (!this.isOnline) {
						return this.$msg("对方暂时不在线，请留言", 2000)
					}
					if(!this.oneClickFlag){
						return;
					}
					that.oneClickFlag = false;
					setTimeout(function() {
						that.oneClickFlag = true;
					}, 1000*3);
					let message = {
						from: this.userInfo.imAccount,
						to: this.channelId,
						content: {
							roomId: this.videoKeyObj.roomId,
							callType: callType
						}
					}
					getApp().callVideo(message, ret =>{
						let msg = ""
						if (ret.code === 4) {
							let name = callType === "voice" ? "语音通话" : "视频通话"
							msg = {text: name};
							getApp().msgOrderPromptTone(2, true)
							setTimeout(function(){
								getApp().musicStop();//定时23秒关闭停止铃声
							},1000*23);
						} else if (ret.code === 1) {
							//自己取消通话的消息
							if ((ret.time && ret.time === "00:00") || !ret.time){
								msg = {text:'已挂断'}
							}
							if (ret.time && ret.time !== "00:00"){
								msg = {
									text:'通话时长',
									time: ret.time
								}
							}
						} else if (ret.code === 5) {
							console.log("............对方接听，关闭声音。。。。。。。")
							getApp().musicStop()
						}
						if (msg) {
							msg.callType = callType
							that.sendMsg(msg,'videoCall');
						}
					})
				}, 500)
			},
			// 查看位置
			viewLocation(res){
				uni.openLocation({
					latitude: res.latitude,
					longitude: res.longitude,
					name: res.name,
					address: res.address
				});
			},
			// 发送地理位置数据模拟，需要自行添加地图组件
			chooseLocation(){
				this.hideDrawer();
				let _this = this
				uni.chooseLocation({
				    success: function (res) {
						let msg = {
							latitude: res.latitude,// 纬度信息
							longitude: res.longitude, // 经度信息
							name: res.name,
							address: res.address
						}
						_this.sendMsg(msg, 'location')
				    }
				});
				
			},
			// 选择图片发送
			chooseImage() {
				this.getImage('album');
			},
			//拍照发送
			camera() {
				this.getImage('camera');
			},
			//选照片 or 拍照
			getImage(type) {
				let _this = this
				this.hideDrawer();
				uni.chooseImage({
					sourceType: [type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						uni.showLoading({
							mask: true,
							title: "图片发送中..."
						})
						let num = 0
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							setTimeout(()=>{
								num++
								uni.getImageInfo({
									src: res.tempFilePaths[i],
									success: async function(image) {
										let msg = {
											path: res.tempFilePaths[i],
											ossWidth: image.width,
											ossHeight: image.height,
											size: res.tempFiles[i].size
										};
										let data = await upload.getOssSignature(msg.path, 6, 1)
										let list = await upload.uploadImageOss(data, false)
										if (list) {
											msg.resourceTemporaryUUID = list[0].resourceTemporaryUUID
											msg.url = list[0].url
											_this.sendMsg(msg, 'image');
										}
									}
								});
							}, 1000)
						}
						if (num === res.tempFilePaths.length) {
							setTimeout(()=> {
								uni.hideLoading()
							}, 2000)
						}
					}
				});
			},
			chooseVideo(){
				let _this = this
				this.hideDrawer();
				uni.chooseVideo({
					success(res){
						let path = res.tempFilePath
						upload.getOssSignature(path, 8, 1).then(data=>{
							let id = getUUID()+_this.userInfo.recommendCode
							let params = {
								conversationId: _this.conversationId,
								id: id,
								uid: id,
								from: _this.userInfo.imAccount,
								to: _this.channelId,
								cmd:11,
								createTime: new Date().getTime(),
								chatType: 2,
								msgType: 4,
								content: {
									type: _this.type,
									ossWidth: res.width,
									ossHeight: res.height,
									ossTime: res.duration,
									size: res.size,
									length: secondFormat(res.duration)
								}
							}
							_this.msgList.push(params)
							let newList = JSON.parse(JSON.stringify(_this.msgList))
							_this.msgList = _this.formatMsgList(newList)
							_this.$nextTick(function() {
								// 滚动到底
								_this.scrollToView = 'scroll_'+params.uid
							});
							_this.uploadVideo(data[0], params)
						})
					}
				})
			},
			uploadVideo(config, data){
				let _this = this
				let msgListIndex = 0
				this.msgList.forEach((v, i) => {
					if (v.id === data.id) {
						msgListIndex = i
						return false
					}
				})
				let formData = {
					'key': config.key || (config.policy.dir+'/'+config.fileName),
					'policy': typeof config.policy === 'string' ? config.policy : config.policy.policy,
					'OSSAccessKeyId': config.accessKeyId || config.policy.accessKeyId,
					'signature': config.signature || config.policy.signature,
					'success_action_status': '200'//让服务端返回200,不然，默认会返回204
				}
				let uploadTask = uni.uploadFile({
					url: config.host || config.policy.host,
					filePath: config.filePath,
					name: 'file',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'multipart/form-data',
					},
					formData: formData,
					success: (res) => {
						console.log("上传成功")
						_this.msgList[msgListIndex].content.url = config.url
						_this.msgList[msgListIndex].content.ossTailoringUrl = config.ossTailoringUrl
						let msg = {
							url: config.url,
							w: data.content.width,
							h: data.content.height,
							size: data.content.size,
							duration: data.content.duration,
							length: data.content.length,
							ossTailoringUrl: config.ossTailoringUrl,
							resourceTemporaryUUID: config.resourceTemporaryUUID
						};
						_this.sendMsg(msg, 'video');
						_this.$forceUpdate()
					}
				});
				uploadTask.onProgressUpdate(res => {
					_this.msgList[msgListIndex].percent = res.progress
					_this.$forceUpdate()
				})
			},
			// 选择表情
			chooseEmoji() {
				this.hideMore = true;
				if (this.hideEmoji) {
					this.hideEmoji = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em) {
				this.textMsg += em.alt;
			},
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(e) {
				// if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
				// 	this.hideDrawer();
				// }
				this.hideDrawer();
				if (uni.getSystemInfoSync().platform === "ios"){
					this.keyboardHeight = e.detail.height - 35
				} else {
					this.keyboardHeight = e.detail.height
				}
				if (this.msgList.length > 0){
					let uid = this.msgList[this.msgList.length - 1].uid
					this.$nextTick(function() {
						// 滚动到底
						this.scrollToView = 'scroll_'+uid
					});
				}
				this.$forceUpdate()
			},
			textareaInput(e){
				publics.setUnsendMsg(this.conversationId, e.detail.value)
			},
			// 发送文字消息
			sendText() {
				this.hideDrawer(); //隐藏抽屉
				if (!this.textMsg) {
					return;
				}
				let content = {
					text: this.textMsg
				}
				this.sendMsg(content, 'text');
			},
			// 发送消息
			async sendMsg(content, type) {
				let _this = this
				if (this.msgLock) return
				this.msgLock = true
				let params = {
					conversationId: this.conversationId,
					id: (content.resourceTemporaryUUID || getUUID())+this.userInfo.recommendCode,
					from: this.userInfo.imAccount,
					to: this.channelId,
					cmd:11,
					createTime: new Date().getTime(),
					chatType: 2,
					content: {
						type: this.type
					}
				};
				params.uid = params.id
				let testing = true
				switch (type) {
					case "text":
						params.msgType = 0
						params.content = JSON.stringify({...params.content, ...content})
						let res = await this.$http("POST", url.im.textScan, {content: content.text})
						testing = res.data
						if (!testing) {
							this.msgLock = false
							return this.$msg("存在敏感内容，请删除后再发送")
						} else {
							this.textMsg = ''; //清空输入框
						}
						break;
					case "image":
						let imgContent = {
							url: content.url,
							ossWidth: content.ossWidth,
							ossHeight: content.ossHeight,
							size: content.size
						}
						params.msgType = 1
						params.content = JSON.stringify({...params.content, ...imgContent})
						break;
					case "voice":
						// 语音消息
						let voiceContent = {
							url: content.url,
							ossTime: content.duration,
							length: content.length
						}
						params.msgType = 2
						params.content = JSON.stringify({...params.content, ...voiceContent})
						break;
					case "location":
						// 地址消息
						params.msgType = 3
						params.content = JSON.stringify({...params.content, ...content})
						break;
					case "video":
						// 视频消息
						let videoContent = {
							url: content.url,
							ossTailoringUrl: content.ossTailoringUrl,
							ossWidth: content.w,
							ossHeight: content.h,
							ossTime: content.duration,
							size: content.size,
							length: content.length
						}
						params.msgType = 4
						params.content = JSON.stringify({...params.content, ...videoContent})
						break;
					case "videoCall":
						// 视频语音通话
						params.msgType = 5
						let callContent = {
							roomId: this.videoKeyObj.roomId,
							...content
						}
						params.content = JSON.stringify({...params.content, ...callContent})
						break;
					case "goods":
						// 商品信息
						params.msgType = 6
						params.content = JSON.stringify({...params.content, ...content})
						break;
					case "recall":
						// 撤回消息
						params.msgType = 99
						params.content = JSON.stringify({...params.content, ...content})
						break;
					default:
						break;
				}
				console.log("......发送的消息.....", params)
				if (!testing) return
				getApp().globalData.socket.sendSocketMessage(params)
				this.isSend = true
				// 延迟500毫秒，为了避免发送消息给对方时获取对方是否在线状态不及时
				let submitContent = params.content
				setTimeout(()=>{
					if (!testing) return
					let submitParams = {
						conversationId: this.conversationId,
						uid: params.uid,
						chatType: params.msgType,
						content: submitContent,
						toImAccount: this.channelId,
						unread: this.isOnline ? 1 : 2,
						type: this.type
					}
					this.$http("POST", url.im.submitMsg, submitParams)
				}, 500)
				addDataToChatTable(params)
				if (params.msgType === 99){
					let content = JSON.parse(params.content)
					deleteInformationType(null, 'uid', content.id)
					this.msgList.splice(this.recallIndex, 1)
				}
				if (type !== "video") {
					this.msgList.push(params)
					let newList = JSON.parse(JSON.stringify(this.msgList))
					this.msgList = this.formatMsgList(newList)
					this.$nextTick(function() {
						// 滚动到底
						this.scrollToView = 'scroll_'+params.uid
					});
				}
				this.msgLock = false
			},
			// 预览图片
			showPic(url) {
				let urls = []
				this.msgList.map(v =>{
					if (v.msgType === 1){
						urls.push(v.content.url)
					}
				})
				uni.previewImage({
					indicator: "number",
					current: url,
					urls: urls
				});
			},
			// 播放语音
			playVoice(index) {
				let msg = this.msgList[index];
				this.playMsgid = msg.uid;
				this.AUDIO.src = msg.content.url;
				this.$nextTick(function() {
					this.AUDIO.play();
				});
			},
			// 播放视频
			playVideo(row){
				if (!row.content.url) return
				this.videoObj = {
					uid: row.uid,
					url: row.content.url
				}
				this.createVideoContext = uni.createVideoContext(row.uid)
				this.createVideoContext.requestFullScreen(0)
				this.createVideoContext.play()
			},
			// 退出全屏
			fullscreenchange(e){
				if (!e.detail.fullScreen){
					this.createVideoContext.pause()
				}
			},
			// 录音开始
			async voiceBegin(e) {
				if (e.touches.length > 1) {
					return;
				}
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				this.videoPermission = status
				if (status !== 1) {
				    return;
				}
				// #endif
				
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({
					format: "mp3",
				}); //录音开始,
			},
			//录音开始UI效果
			async recordBegin(e) {
				if (this.videoPermission !== 1) {
				    return;
				}
				this.recording = true;
				this.voiceTis = '松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(() => {
					this.recordLength++;
				}, 1000)
			},
			// 录音被打断
			voiceCancel() {
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true; //不发送录音
				this.RECORDER.stop(); //录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e) {
				if (!this.recording) {
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				} else {
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e) {
				if (!this.recording) {
					return;
				}
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop(); //录音结束
			},
			//录音结束(回调文件)
			recordEnd(e) {
				clearInterval(this.recordTimer);
				if (!this.recordLength)return
				if (!this.willStop) {
					let msg = {
						length: 0,
						path: e.tempFilePath,
						duration: this.recordLength, // 【**必传】，语音内容的持续时长. 单位是秒
					}
					msg.length = secondFormat(this.recordLength);
					console.log("录音结束事件回调", msg)
					upload.getOssSignature(msg.path, 7, 1).then(data=>{
						upload.uploadImageOss(data).then(list=>{
							msg.resourceTemporaryUUID = list[0].resourceTemporaryUUID
							msg.url = list[0].url
							this.sendMsg(msg, 'voice');
						})
					})
				} else {
					// console.log('取消发送录音');
				}
				this.willStop = false;
			},
			// 切换语音/文字输入
			switchVoice() {
				this.hideDrawer();
				this.isVoice = this.isVoice ? false : true;
			},
			discard() {
				return;
			}
			// #ifdef APP-PLUS
			,
			async checkPermission() {
			    let status = permision.isIOS ? await permision.requestIOS('record') :
			        await permision.requestAndroid('android.permission.RECORD_AUDIO');
			
			    if (status === null || status === 1) {
			        status = 1;
			    } else if (status === 2) {
			        uni.showModal({
			            content: "系统麦克风已关闭",
			            confirmText: "确定",
			            showCancel: false,
			            success: function(res) {
			            }
			        })
			    } else {
			        uni.showModal({
			            content: "需要麦克风权限",
			            confirmText: "设置",
			            success: function(res) {
			                if (res.confirm) {
			                    permision.gotoAppSetting();
			                }
			            }
			        })
			    }
			    return status;
			}
			// #endif
		}
	}
</script>
<style lang="scss">
	@import "@/common/im/style.scss"; 
</style>
<style lang="scss" scoped>
	.invite{
		position: relative;
		top: 80rpx;
		left: 9vw;
		max-width: 90vw;
		z-index: 9999;
		&-item{
			padding: 4rpx 20rpx;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			color: #FFFFFF;
			margin-bottom: 20rpx;
			background-color: #007bef;
			.del{
				margin-right: 10rpx;
				font-size: 36rpx;
			}
		}
		
	}
	.my, .other{
		position: relative;
	}
	.option{
		position: absolute;
		top: -80upx;
		right: 50upx;
		&-wrap{
			// display: flex;
			// flex-direction: column;
			position: relative;
			.conText{
				// width: 100%;
				background-color: #060606;
				border-radius: 16upx;
				display: inline-block;
				height: 60upx;
				line-height: 60upx;
				color: #FFFFFF;
				.txt:first-child{
					border: none;
				}
				.txt{
					// width: 100upx;
					text-align: center;
					padding: 0 26rpx;
					border-left: 1upx solid #6a6a6a;
					font-size: 32rpx;
				}
			}
			.icon{
				position: absolute;
				bottom: -36upx;
				right: 50upx;
				color: #060606;
				width: 50rpx;
				height: 50rpx;
			}
		}
	}
	.other .option{
		right: 0;
		left: 50upx;
		.icon{
			right: 0;
			left: 50upx;
		}
	}
	.popup{
		background-color: white;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	.popup-item{
		height: 110rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		border-bottom: 2rpx solid #EEEEEE;
	}
	.popup-item-name{
		font-size: 30rpx;
	}
	.popup-item-desc{
		color: #999999;
		font-size: 24rpx;
	}
	.popup-cancel{
		border-top: 10rpx solid #EEEEEE;
	}
</style>
