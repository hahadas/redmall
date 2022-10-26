export class IMClient {
  constructor(heartChecknterval) {
    // this.url = "ws://192.168.2.188:8888?imToken="+uni.getStorageSync('token')
    this.url = "ws://im-ws.hushuo.show?imToken="+uni.getStorageSync('token')
    this.heartChecknterval = heartChecknterval
    this.currentChannelId = ''
  }

  connect(callback) {
    this.connectCallback = callback
    // this.conn = new WebSocket(this.url)
	console.log("------开始连接websocket-------")
	this.conn = uni.connectSocket({
		url: this.url,
		success: ()=>{
			console.log("------连接websocket成功-------")
		}
	})
	this.conn.onOpen((res)=>{
		console.log("----------------websocket连接打开--------------")
		this.connected = true
		this.onOpen()
		
		this.conn.onMessage((data) => {
			this.onMessage(data.data)
		})
	})

    this.conn.onClose(() => {
		this.connected = false
		// this.onClose()
		this.heartCheckUtil.stop()
    })

    this.conn.onError((errMsg) => {
		// this.onError(errMsg)
		this.connected = false
		this.onClose()
    })

  }

  heartCheckUtil = {
    start: () => {
      this.heartCheckObj = setTimeout(() => {
        if (this.conn && this.conn.readyState === 1) {
          this.send({
			cmd: 13,
			hbyte: "a"
		  })
        }
      }, this.heartChecknterval)
    },

    reset: () => {
      clearTimeout(this.heartCheckObj)
      this.heartCheckUtil.start()
    },

    stop: () => {
      if (this.heartCheckObj) {
        clearTimeout(this.heartCheckObj)
      }
    }
  }

  reconnectUtil = {
    start: () => {
      this.reconnectObj = setTimeout(() => {
        // 已经关闭了与服务器的连接
        if (this.conn.readyState == 3) {
          this.reconnectStarting = true
          this.connect()
        }
      }, 5000)
    },

    stop: () => {
      this.reconnectStarting = false
      if (this.reconnectObj) {
        clearTimeout(this.reconnectObj)
        this.reconnectObj = null
      }
    }
  }

  onOpen() {
    if(this.connectCallback != null) {
      this.connectCallback(this)
    }
    const reconnectStarting = this.reconnectStarting
    this.reconnectUtil.stop()
    if (reconnectStarting && this.handleReconnectSuccessed) {
      this.handleReconnectSuccessed()
    }
    if(this.handleUserOnline) {
      this.handleUserOnline()
    }
    this.heartCheckUtil.start()
  }

  onClose() {
    this.heartCheckUtil.stop()
    this.reconnectUtil.start()
    if(this.handleConnectionClosed) {
      this.handleConnectionClosed()
    }
    if(this.handleUserOffline) {
      this.handleUserOffline()
    }
  }

  onError(error) {
    console.error(error)
	this.reconnectUtil.start()
  }

  onMessage(message) {
    if (message !== '') {
      this.handleMessage(JSON.parse(message))
    }
    this.heartCheckUtil.reset()
  }

  send(message) {
	if (!message) return
    if (this.connected) {
	  let data = JSON.stringify(message)
      this.conn.send({
		data: data
	  })
      this.heartCheckUtil.reset()
    }
  }

  handleMessage(message) {
	console.log("--------", message)
	let data = message.data
	switch(message.command) {
		case 11:
			if (this.handleNewMessage) {
			  this.handleNewMessage(data)
			}
			if (this.handleUnreadMessage) {
			  this.handleUnreadMessage(data)
			}
			break;
		case 12:
			if (this.handleUserOnline){
				this.handleUserOnline(message)
			}
			break;
	}
    // switch (message.action) {
    //   case "ONLINE_STATUS_CHANGED":
    //     if (this.handleOnlineStatusChanged) {
    //       this.handleOnlineStatusChanged(message)
    //     }
    //     if(this.handleUserOnlineStatusChanged) {
    //       this.handleUserOnlineStatusChanged(message)
    //     }
    //     break
    //   case "NICKNAME_CHANGED":
    //     if (this.handleNicknameChanged) {
    //       this.handleNicknameChanged(message)
    //     }
    //     break
    //   case "AVATAR_CHANGED":
    //     if (this.handleAvatarChanged) {
    //       this.handleAvatarChanged(message)
    //     }
    //     break
    //   case "NEW_MESSAGE":
    //     if (this.handleNewMessage) {
    //       this.handleNewMessage(message)
    //     }
    //     if (this.handleUnreadMessage) {
    //       this.handleUnreadMessage(message)
    //     }
    //     break
    //   case "READ_MESSAGE":
    //     if(this.handleReadMessage) {
    //       this.handleReadMessage(message)
    //     }
    //     break
    //   case "JOIN_CHANNEL":
    //     if(this.handleJoinChannel) {
    //       this.handleJoinChannel(message)
    //     }
    //     break
    //   case "MESSAGE_REMOVED":
    //     if(this.handleMessageRemoved) {
    //       this.handleMessageRemoved(message)
    //     }
    //     break
    //   case "CHANNEL_NAME_CHANGED":
    //     if(this.handleChannelNameChanged) {
    //       this.handleChannelNameChanged(message)
    //     }
    //     break
    //   case "MEMBERS_COUNT_CHANGED":
    //     if(this.handleMembersCountChanged) {
    //       this.handleMembersCountChanged(message)
    //     }
    //     break
    //   case "REMOVE_FROM_CHANNEL":
    //     if(this.handleRemoveFromChannel) {
    //       this.handleRemoveFromChannel(message)
    //     }
    //     break
    //   case "LEAVE_CHANNEL":
    //     if(this.handleLeaveChannel) {
    //       this.handleLeaveChannel(message)
    //     }
    //     break
    //   case "CHANNEL_REMOVED":
    //     if(this.handleChannelRemoved) {
    //       this.handleChannelRemoved(message)
    //     }
    //     break
    // }
  }

  bindOnlineStatusChanged(callback) {
    this.handleOnlineStatusChanged = callback
  }
  unbindOnlineStatusChanged() {
    this.handleOnlineStatusChanged = null
  }

  bindNicknameChanged(callback) {
    this.handleNicknameChanged = callback
  }
  unbindNicknameChanged() {
    this.handleNicknameChanged = null
  }

  bindAvatarChanged(callback) {
    this.handleAvatarChanged = callback
  }
  unbindAvatarChanged() {
    this.handleAvatarChanged = null
  }

  bindNewMessage(callback) {
    this.handleNewMessage = callback
  }
  unbindNewMesssage() {
    this.handleNewMessage = null
  }

  bindConnectionClosed(callback) {
    this.handleConnectionClosed = callback
  }
  unbindConnectionClosed() {
    this.handleConnectionClosed = null
  }

  bindReconnectSuccessed(callback) {
    this.handleReconnectSuccessed = callback
  }
  unbindReconnectSuccessed() {
    this.handleReconnectSuccessed = null
  }

  bindUnreadMessage(callback) {
    this.handleUnreadMessage = callback
  }
  unbindUnreadMessage() {
    this.handleUnreadMessage = null
  }

  bindReadMessage(callback) {
    this.handleReadMessage = callback
  }
  unbindReadMessage() {
    this.handleReadMessage = null
  }

  bindJoinChannel(callback) {
    this.handleJoinChannel = callback
  }
  unbindJoinChannel() {
    this.handleJoinChannel = null
  }

  bindUserOnlineStatusChanged(callback) {
    this.handleUserOnlineStatusChanged = callback
  }
  unbindUserOnlineStatusChanged() {
    this.handleUserOnlineStatusChanged = null
  }

  bindMessageRemoved(callback) {
    this.handleMessageRemoved = callback
  }
  unbindMessageRemoved() {
    this.handleMessageRemoved = null
  }

  bindChannelNameChanged(callback) {
    this.handleChannelNameChanged = callback
  }
  unbindChannelNameChanged() {
    this.handleChannelNameChanged = null
  }

  bindMembersCountChanged(callback) {
    this.handleMembersCountChanged = callback
  }
  unbindMembersCountChanged() {
    this.handleMembersCountChanged = null
  }

  bindRemoveFromChannel(callback) {
    this.handleRemoveFromChannel = callback
  }
  unbindRemoveFromChannel() {
    this.handleRemoveFromChannel = null
  }

  bindLeaveChannel(callback) {
    this.handleLeaveChannel = callback
  }
  unbindLeaveChannel() {
    this.handleLeaveChannel = null
  }

  bindChannelRemoved(callback) {
    this.handleChannelRemoved = callback
  }
  unbindChannelRemoved() {
    this.handleChannelRemoved = null
  }

  bindUserOnline(callback) {
    this.handleUserOnline = callback
  }
  unbindUserOnline() {
    this.handleUserOnline = null
  }

  bindUserOffline(callback) {
    this.handleUserOffline = callback
  }
  unbindUserOffline() {
    this.handleUserOffline = null
  }

}