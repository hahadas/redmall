export default{
	// 公共
	common: {
		getCaptcha: "captcha/get", // 获取滑动图片验证码
		checkCaptcha: "captcha/check", // 验证滑动图片验证码
		getSmsCode: "sms/send", // 获取短信验证码
		getOssSignature: "oss/uploadPolicy", // 获取oss签名
		delResources:"oss/delResources", // 删除资源
		videoCallKey: 'single/oms/video_call_key', //获取视频通话Key
		getAppVersion: 'sys/config/appVersion', //  app版本信息
		getOssImageResize: "sys/config/ossImageResize", // 获取各个类型图片缩略图比例信息
		customerService: "sys/config/customerService", // 平台客服信息
		privacyAgreement: "sys/config/privacyAgreement", // 平台隐私协议
		getAboutId: "sys/config/aboutUsId", // 获取关于我们
		getImChatWarning: "sys/config/imChatWarning", // 获取聊天框中大警示语
		threeProportion: "sys/config/thirdPartyServicesProportion", // 第三方服务比例
		distributorDepositConfig: "sys/config/distributorDepositConfig", // 配送员押金协议
	},
	// 聚合相关
	juhe:{
		getAllExpCom: "juhe/allExpCom", // 获取所有快递公司编号对照表
		rechargeParame: "juhe/rechargeParame", // 获取充值类参数
		rechargePhoneBill: "juhe/rechargePhoneBill", // 充值话费
		rechargeOilCard: "juhe/rechargeOilCard", // 充值油卡
		getOilCardRecord: "juhe/rechargeOilCardList", // 获取油卡充值记录
		getPhoneBillRecord: "juhe/rechargePhoneBillList", // 获取话费充值记录
	},
	// 公告相关
	cms:{
		getNoticeList: 'platform/noticeList', //  获取列表列表
		noticeCount: 'platform/noticeCount', //  获取公告数量 type-公告类型：1=平台公告，2=使用教程，3=招商入驻 read-阅读状态：默认-1=全部，1=已读，2=未读
		getNoticeDetailById: 'platform/noticeDetails', // 获取公告详情
		advertisingMap: "platform/advertisingMap", // 获取广告图信息
		clickAdvertisingMap: "platform/clickAdvertisingMap", // 点击广告图信息记录点击量
		redEnvelopesList: "platform/redEnvelopesList", // 获取红包福利列表
		receiveRedEnvelopes: "platform/receiveRedEnvelopes", // 领取红包
	},
	// 举报相关
	report: {
		platformComplaintType: "sys/config/platformComplaintType", // 获取平台举报类型参数列表
		addComplaint: "platform/addComplaint", // 提交举报信息
		myComplaintList: "platform/myComplaintList", // 获取自己的举报信息
	},
	// 登录注册相关
	login: {
		register: "user/register", // 注册
		login: "user/login", // 账号密码登录
		editPasswordByCode: "user/retrievePassword", // 通过短信验证码修改密码
		getPublicKey: "user/publicKey", // 获取加密公钥
		logout: "user/logOut" // 退出登录
	},
	// 用户相关
	user: {
		getUserInfoBasic: "user/info", // 获取用户信息
		getUserInfoById: "user/getUserInfoById", //根据用户id获取个人信息详情
		getImAccountById: "user/getImAccountByUserId", // 根据用户id获取imAccount
		editUserInfo: "user/updateInfo", // 修改个人信息
		editPassword: "user/updatePassword", // 修改密码，原密码+新密码
		updateMobile: "user/updateMobile", // 修改手机号
		updateAddress: "user/updateAddress", // 更新个人位置信息
		updateUniappClientInfo: "user/updateUniappClientInfo", // 更新设备信息
		getLabels: "user/labels", // 获取酒量、过往职业、兴趣爱好标签
		getWalletInfo: "user/userWallet", // 获取自身钱包信息
		cbfcAcount: "user/cbfcAcount", // 商品收藏、商品浏览、商家关注、未使用的优惠券 的数量
		getTeamList: 'user/myTeam', //团队列表
		getTeamCount: "user/myTeamCount", // 获取自身团队各个类型数量
		getCollectionsList: "user/collections/collections", // 获取收款信息列表
		addCollections: "user/collections/add", // 添加收款信息
		getCollectionsDetailById: "user/collections/details", // 获取收款信息详情
		delCollectionsById: "user/collections/del", // 删除收款信息
		getUserCards: "user/userCards", // 获取卡包列表信息
		walletFlowing: "user/walletFlowing", // 用户流水
		isBackUser: "user/isBackUser", // 判断自己是否已把对方拉黑
		addBackUser: "user/addBackUser", // 拉黑用户
		delBackUser: "user/delBackUser", // 移除黑名单
		myBackUserList: "user/myBackUserList", // 黑名单列表
		getRecommendInfo: "user/recommendInfo", // 获取自己推荐人信息
		returnCreditCardConfig: "user/returnCreditCardConfig", // 获取还信用卡配置信息
		addReturnCreditCard: "user/addReturnCreditCard", // 信用卡还款
		returnCreditCardRecord: "user/returnCreditCardRecord", // 信用卡还款记录
		// 优惠券
		receiveDiscount: "discount/receiveDiscount", // 领取优惠券
		getDiscountList: "discount/discountList", // 用户优惠券列表
		getDiscountNumber: "discount/discountAmountList", // 用户优惠券 未使用、已使用、已过期 的数量
		// 代理
		statisticalInfo: "agent/statisticalInfo", // 获取代理的统计数据
		updateSubsidyStatus: "agent/updateSubsidyStatus", // 区代理操作补贴开关
		accumulatedRevenue: "agent/accumulatedRevenue", // 获取代理累计收入金额
		agentOrderList: "agent/agentOrderList", // 获取代理订单列表
		agentRegionList: "agent/agentRegionList", // 市代理获取自己设定的区代理列表
		addAgentRegion: "agent/addAgentRegion", // 市代理添加区代理
		delAgentRegion: "agent/delAgentRegion", // 市代理删除区代理
		updateAgentRegion: "agent/updateAgentRegion", // 市代理修改区代理信息
		//扫码
		getCollectionInfo: "collection/collectionInfo", // 根据扫码信息获取支付信息
		scanBalancePay: "payBalance/scanPayment",  // 扫码余额支付
	},
	// 用户/配送员/商家提现相关
	withdrawal: {
		apply: "withdrawal/add", // 提交余额钱包提现申请
		getConfigInfo: "withdrawal/config", // 余额钱包提现参数
		withdrawalList: "withdrawal/list", // 获取提现记录
	},
	// 用户地址, type 1=用户收货地址,2=商家发货地址
	address: {
		getAddressList: 'address/list', // 获取所有收货地址
		addAddress: 'address/add', // 添加收货地址
		getAddressInfoByIdAndType: "address/info", // 根据id和类型获取收货地址
		updateAddress: 'address/update', // 修改收货地址
		deleteAddress: 'address/del', // 删除地址
	},
	// 商家相关
	store: {
		getApplyInfo: "userStore/applyInfo", // 获取用户商家入驻申请信息
		submitApply: "userStore/submitApply", // 提交商家入驻申请
		updateApply: "userStore/updateApply", // 修改商家入驻申请
		getStoreInfo: "userStore/info", // 获取店铺信息
		editStoreInfo: "userStore/updateInfo", // 修改商铺信息
		addCategory: "userStore/addCategory", // 商铺分类创建
		updateCategory: "userStore/updateCategory", // 商铺分类修改
		getCategoryList: "userStore/category", // 店铺的分类列表
		delCategory: "userStore/delCategory", // 删除商铺分类
		addGoods: "userStore/addGoods", // 商品上传
		getGoodsList: "userStore/goodsListByUserId", // 获取商家商品列表
		getGoodsDetailById: "userStore/goodsByGoodsId", // 根据商品id获取商家商品详情
		updateGoods: "userStore/updateGoods", // 修改商品
		updateGoodsStatus: "userStore/updateGoodsStatus", // 修改商品上架/下架状态
		updateCupboardIds: "userStore/updateCupboardIds", // 修改商铺橱柜展示信息
		updateRecommendStatus: "userStore/updateRecommendStatus", // 修改商品 店铺商品推荐状态
		updateGoodsBuyingStatus: "userStore/updateGoodsBuyingStatus", // 修改精品商品进货状态
		getNearbyStores: "store/nearbyStores", // 获取附近的店铺信息
		getStoreInfoById: "store/info", // 根据Id获取店铺信息
		getStoreCategoryById: "store/infoCategory", // 根据id获取店铺分类
		followStore: "store/followStore", // 关注/取消关注 店铺
		followStoreList: "store/followStoreList", // 关注的店铺列表
		// 自身店铺相关
		getDiscountList: "userStore/discountInfo", // 获取所有优惠券
		addDiscount: "userStore/addDiscount", // 添加优惠券
		updateDiscount: "userStore/updateDiscount", // 修改优惠券
		delDiscount: "userStore/delDiscount", // 删除优惠券
		getDiscountInfoById: "userStore/discountInfoById", // 根据id获取优惠券信息
		minBonusProfit: "userStore/minBonusProfit", // 普通商品最低比例
		getOrderList: "userStore/orderList", // 获取自家店铺订单信息
		getOrderDetailById: "userStore/orderDetails", // 获取自家店铺订单详情
		getOrderAmount: "userStore/orderCountList", // 获取自家店铺的订单各个类型总数信息
		deliverGoods: "userStore/deliverGoods", // 操作订单发货
		refundOrder: "userStore/refundOrder", // 商家操作退款
		confirmationService: "userStore/confirmationService", // 商家操作配送订单已送达
		cancelDeliveredOrder: "userStore/cancelDeliveredOrder", // 商家操作 普通商品-平台配送-已取货 的订单取消配送
		getWalletInfo: "userStore/userWallet", // 获取店铺钱包信息
		storeInitStatistics: "userStore/storeInitStatistics", // 商家主页数据统计
		collectionCode: "collection/store_collection_manual_data", // 商家生成收款二维码
		getTodayCollectionTotal: "collection/store_collection_statistics_today", // 商家获取今日收款数据的统计
		getCollectionRecordList: "collection/store_collection_order_record", // 商家获取收款记录
	},
	// 配送员相关
	distributor: {
		getApplyInfo: "distributor/applyInfo", // 获取用户配送员入驻申请信息
		submitApply: "distributor/submitApply", // 提交配送员入驻申请
		updateApply: "distributor/updateApply", // 修改配送员入驻申请
		choiceDistributorList: "distributor/choiceDistributorList", // 精品订单获取配送员列表
		choiceDistributor: "distributor/choiceDistributor", // 选择配送员为我配送
		cancelDistributor:"distributor/cancelDistributor", // 取消配送员为我配送
		updateWorkStatus: "distributor/updateWorkStatus", // 配送员操作自己的工作状态
		distributorWorkOrder: "distributor/distributorWorkOrder", // 工作中时的订单列表
		confirmReceiptOrder: "distributor/confirmReceiptOrder", // 配送员确认接单
		cancelReceiptOrder: "distributor/cancelReceiptOrder", // 配送员取消接单
		confirmService: "distributor/confirmService", // 配送员确认送达
		getOrderDetailsById: "distributor/distributorOrderDetails", // 配送员获取 精品/普通 订单详情
		generalOrderList: "distributor/generalOrderList", // 获取普通大厅订单列表
		confirmPickUp: "distributor/confirmPickUp", // 配送员确认已取货
		historyOrderList: "distributor/historyOrderList", // 配送员获取配送过的历史订单列表
		historyOrderDetails: "distributor/historyOrderDetails", // 配送员获取配送过的历史订单详情
		distributorDeposit: "distributor/distributorDeposit", // 配送员获取交纳押金状态
	},
	// 商品相关
	goods: {
		getGoodsClass: 'goods/category/allList', // 查询分类
		getGoodsList: "goods/goods", // 获取新品商品列表
		goodsDetail: 'goods/info', // 查询商品详情信息
		collectionGoods: 'goods/collectionGoods', // 添加/商品收藏
		collectionGoodsList: 'goods/collectionGoodsList', // 商品收藏/足迹 记录
		getEvaluateList: "goods/goodsEvaluate", // 获取商品评论列表
		getGroupById: "goods/groupOrderByGoodsId", // 获取拼团商品正在拼团的用户列表
		goodsByType: "home/goods/goodsByType", // 1-新人大礼、2-限时秒杀、3-今日特价、4-拼团
	},
	// 用户订单相关
	order: {
		getOrderInfo: "order/goodsOrderInfo", // 获取订单信息
		commitOrder: "order/commitGoodsOrderInfo", // 提交订单
		getPayOrderInfo: "order/payOrderInfo", // 支付页面获取待付款订单支付信息
		orderList: 'order/orderList', // 订单列表
		getOrderAmount: "order/orderStatusAmountInfo", // 获取订单状态数量
		getOrderInfoById: "order/orderInfo", // 根据id获取订单信息
		refundOrder: "order/refundOrder", // 退款
		confirmReceipt: "order/confirmReceipt", // 确认收货
		evaluate: "order/evaluate", // 评论
		orderBoutiqueList: "order/orderBoutiqueList", // 获取待选择配送员配送的订单列表信息
		orderUpdateRecAddress: "order/orderUpdateRecAddress", // 订单修改收货地址
		delUserOrder: "order/delUserOrder", // 删除订单
	},
	// 支付相关
	pay: {
		balancePay: "payBalance/payOrder", //余额支付
		aliPay: "payAli/appPayOrder", // 支付宝支付
		wechatPay: "payWeChat/appPayOrder", // 微信支付
		checkPay: "payCheck/order", // 校验支付宝/微信是否支付成功
		cardPay: "payCards/payOrder", // 消费卡支付
		aliPayOther: "payAli/appPayOther", // 支付宝支付-非商品类型
		wechatPayOther: "payWeChat/appPayOther", // 微信支付-非商品类型
		payCheckOther: "payOtherCheck/other", // 校验非商品类型订单微信/支付宝是否已支付成功
		checkStoreCollection: "payCollectionCheck/checkStoreCollection", // 商家检查用户是否扫码支付成功
		scanWechat: "payWeChat/scanPayment", // 用户扫码微信支付
		scanAli: "payAli/scanPayment", // 用户扫码支付宝支付
		scanPayCheck: "payCollectionCheck/checkUserPayment", // 用户扫码支付校验
	},
	// 互动相关
	interaction: {
		dynamicAllList: "single/comment/indexComments", // 所有动态信息
		storeUmsList: "dynamic/peopleNearby", // 附近的人列表
		getAngelNearbyList: "dynamic/angelNearby", // 附近的配送员列表
		dkUsersHuDong: 'single/store/store/dk_users', // 互动界面精品代理信息
		getDynamicUser: "single/comment/userCommentInit", // 获取动态用户信息
		getUserDynamickList: "single/comment/userComments", // 获取用户所有动态列表
		getDynamicDetailById: "single/comment/commentsDetails", //获取动态详情
		likeByComment: "single/comment/likeByComment", // 点赞、取消点赞，动态
		getDynamicComment: "single/comment/commentById", // 获取动态评论信息
		delCommentById: "single/comment/commentByDel", // 删除评论
		likeByCommentComment: "single/comment/likeByCommentComment", // 点赞/取消点赞评论
		delDynamic: "single/comment/delComment", // 删除动态
		commentOrReplyDynamic: "single/comment/commentByVideo", // 评论/回复动态
		addDynamic: "single/comment/add_comment", // 发布动态
		// 视频
		inintIndexVideo: 'single/home/inintIndexVideoData', //视频：附近、推荐、关注数据初始化
		indexVideoDates: 'single/home/indexVideoDates', //视频：附近、推荐、关注
		userVideoType: 'single/home/userVideoType', //用户主页作品、关注、喜欢数据
		getVideoDetailById: "single/home/findByJiuYinId", // 根据id获取视频
		followByUserId: 'single/home/followByUserId', //关注、取关
		likeByVideo: 'single/home/likeByVideo', //点赞、取消点赞视频
		comments: 'single/home/comments', //获取评论、回复
		commentByVideo: 'single/home/commentByVideo', //评论、回复视频
		commentByDel: 'single/home/commentByDel', //删除评论
		likeByCommentByJiuYin: 'single/home/likeByComment', //评论点赞
		updateJiuYinAvatar: 'single/user/updateJiuYinAvatar', //修改主页背景
		userVideoInit: 'single/home/userVideoInit', //用户主页数据初始化
		getByVideoIdMyMsg: 'single/home/getByVideoIdMyMsg', //获取点赞、关注信息
		getVideoByCommentId: 'single/home/getVideoByCommentId', //获取我的评论的视频信息
		commentsByMe: 'single/home/commentsByMe', //获取评论回复信息
		getMyCommentList: 'single/comment/commentsByMe', //获取动态评论回复信息
		videoConfig: 'single/home/video_config', //获取配置信息
		saveOrUpdateVideo: 'single/home/saveOrUpdateVideo', //发布/修改视频
		delVideo: 'single/home/delVideo', //删除视频
	},
	// 配送员库存相关
	agent: {
		getStockList: "userStock/stockList", // 获取库存商品列表
	},
	// 聊天相关
	im: {
		getVideoKey: "im/video_call_key", // 获取视频通话密钥
		unreadConversationMsg: "im/unreadConversationMsg", // 同步存在未读消息的会话信息
		unreadSuccessCallback: "im/unreadSuccessCallback", // 同步未读消息和会话信息成功后回调，必须回调
		unreadOneMsgByConversationId: "im/unreadOneMsgByConversationId", // 同步单个会话的未读消息，加载会话更多消息时执行
		unreadOneMsgSuccessCallback: "im/unreadOneMsgSuccessCallback", // 同步单个会话的未读消息成功后回调
		createConversation: "im/createConversation", // 根据对方用户ID获取会话信息(主动发消息方)
		getConversationItExist: "im/getConversationItExist", // 根据对方用户ID获取会话信息(被动接消息方)
		submitMsg: "im/submitMsg" ,// 发送消息后提交消息到服务器
		textScan: "im/textScan", // 文本反垃圾
	}
}