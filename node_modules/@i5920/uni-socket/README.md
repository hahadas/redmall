# uni-socket

#### 介绍
uni-app的socket完全封装

> 之所以写这个类，是因为之前用别人的插件总是出现莫名其妙死掉,比如黑屏截屏等操作后就挂了,现在封装的这个目前运行良好，请大家检测

特点:
1. 断线重连
2. 自定义心跳
3. 网络检测
4. 断线消息队列
5. debug
6. 支持typescript

#### 安装教程

`npm i @i5920/uni-socket -S`

#### 使用说明

```
import UniSocket from "@i5920/uni-socket";

export default {
  onLaunch() {
    this.globalData.socket = new UniSocket({
        url: "ws://127.0.0.1:8080",
        timeout: 1 * 60 * 1000,   // 心跳时间间隔
        isSendHeart: true,        // 是否发送心跳
        heartData: "ping",        // 心跳数据
        isReconnection:true,      // 是否断线重连
        reConnectTime: 3000,      // 断线重连检测时间间隔
        params: {                 // 发送消息时如果时json则自动加上组合里面参数
          // token: this.$store.state.user.TOKEN
        },
        debug: process.env.NODE_ENV === "development",  // debug
        onSocketOpen: header => {},
        onSocketMessage: data => {},
        onSocketError:res => {},
        onSocketClose:res => {}
    });
  },
  // on Show 在uniapp插件市场不显示？
  // 必须在这里调用initSocket方法
  on Show() {
    // 连接socket
    this.globalData.socket.initSocket();
    // 登录
    this.loginDemo();
  },
  methods:{
    // 发送socket消息
    loginDemo(){
      this.globalData.socket.sendSocketMessage({
        event:"login",
        data:{
          "username":"okcoder",
          "password":"666666"
        }
      });
    },
    // 主动关闭socket
    closeSocket(){
      this.globalData.socket.closeSocket();
    }
  }
}

// 其它页面
getApp().globalData.socket.sendSocketMessage({
  event:"login",
  data:{
    "username":"okcoder",
    "password":"666666"
  }
});

```

#### 赞助二维码

![](https://gitee.com/uploads/images/2018/0623/112959_9f84f1f7_696921.png "3.png")
![](https://gitee.com/uploads/images/2018/0623/113008_0014aa83_696921.jpeg "4.jpg")


#### 更新说明

- v2.0.1
  1. socket错误执行断线重连