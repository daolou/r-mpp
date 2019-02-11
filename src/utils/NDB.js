/*
JSBridge功能参数
函数名  | 参数 | 函数描述
------------- | -------------| -------------
openProfile  | userId | 打开用户详情页
openTagDetail  | tagId，tagTitle| 打开tag详情页
openFeed  | feedId| 打开feed
openComment  | feedId| 打开feed评论页
showBanner  | slide 多张防止跟随滑动 | 显示banner (alaska无)
hideBanner  | | 隐藏banner (alaska无)
sendEvent  | JSONObject params| 发送事件
shareApk  | apkName| 分享apk
shareText  | shareText| 分享文字
shareMediaText  | shareText,imgUrl| 分享文字和图片
shareFile  | shareText, filePath(本地文件路径，不需要加file://) | 分享文件
mediaToLocal  | imageUrl,videoUrl| 图片/视频 网络地址转本地地址
base64ToLocal  | base64Url| 图片Base64转本地地址
takeScreenShot  | 同newsDog| 截图 （发送屏幕坐标和宽高，返回图片本地地址）
getUserInfo  | avatar, userName | 用户名，头像
getGroupId  | userId| 用户ID（ObjectId，seq_id） (alaska无)
getUserGroup  | group | 用户Group (alaska无)
getUserLang  | lang| 语言
openWebView  | url| 打开一个新的全屏WebView
closeWebView  | | 关闭当前WebView
backPressed  | feedId| 客户端主动发送后退事件
clickPostBtn  | | 点击发布按钮,togo专有
clickPostText  | | 点击发布文字按钮,togo专有
clickPostImage  | | 点击发布图片按钮,togo专有
clickPostPhoto  | | 点击发布拍照按钮,togo专有

/====alaska 专有====/
clickPostStatusMaker | | 点击发布制作影集
clickPostVideo | | 点击发布视频
openTopic | topicId | 打开主题活动页面

/====newsdog====/
openFeed  | feedId,type,lang | 跳转到某个aritcle
openCategory | cate_key,video | 跳转到某个分类
openTopic | feedId,lang | 跳转到某个topic
openDeepLink |{link:'newsdog://detail?id=5a16594712313a00a34109d1&lang=en&type=article'}|跳转到某个DEEPLINK
openHttpLink |{link: 'http://xxx'}|使用NewsDog打开某个支持的HTTP链接

*/

class AndroidBackEvent {
  constructor() {
    this.list = [];
  }
  addEventListener(audience) {
    this.list.push(audience);
  }
  removeEventListener(audience) {
    this.list = this.list.filter(fn => fn != audience);
  }
  broadcast() {
    this.list.forEach(fn => {
      fn && fn();
    });
    return !!this.list.length;
  }
}

class NdogJsBridge {
  constructor(alice) {
    this.ALICE = alice;
    this.PROTOCOL = 'NDB';
    this.pool = {};
    this.sequenceId = 0;
    this.report = function() {
      // if (process.env.NODE_ENV == 'production') {
      if (!window.gtag) return;
      window.gtag.apply(null, arguments);
      console.log('=======report=======');
      const galog = [];
      const len = arguments.length;
      for (let i = 0; i < len; i++) {
        galog.push(arguments[i]);
      }
      console.log(JSON.stringify(galog));
      console.log('=======report=======');
      // }
    };
    this.sleep = ms => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
      });
    };
  }
  /**
   * app进入后台
   */
  onAndroidStop = () => {
    console.log(`webview onAndroidStop: app 进入后台`);
  };
  /**
   * app重新进入前台
   */
  onAndroidResume = () => {
    console.log(`webview resume: app 回到前台`);
  };
  /**
   * 刷新webview
   */
  onAndroidReload = () => {
    console.log(`webview onAndroidReload`);
  };
  /*
      响应android回退事件
      1. 如当前页面有弹窗, 先关弹窗
      2. 如 history.length > 1, 则回退到上一页
      3. 如果退无可退, 就直接关闭webview

      每次响应需要给客户端通知, 如果500ms内不回调客户端, 客户端会认为网页出现异常或者打开了第三方网页, 客户端会关闭当前webview
  */
  onAndroidGoBack = () => {
    console.log('onAndroidGoBack work');
    this.run('backEnsure');
    console.log('androidBackEvent.broadcast: ', !androidBackEvent.broadcast());
    if (!androidBackEvent.broadcast()) {
      if (document.referrer) {
        console.log('history.back()');
        // eslint-disable-next-line
        history.back();
      } else {
        this.run('closeWebView');
      }
    }
  };
  /**
   * 生成android解析协议
   */
  generateRequestObj = (method, params = {}) => {
    const port = this.sequenceId++;
    return {
      uri: `${this.PROTOCOL}://${this.ALICE}:${port}/${method}?${JSON.stringify(params)}`,
      port,
    };
  };
  /**
   * 通过window.prompt将参数传递给客户端,并等待回调
   * @nativeMethodName {String} 客户端响应的函数名(提前人工约定)
   * @params {Object} 需要传递的参数
   */
  run = (nativeMethodName, params) => {
    const { uri, port } = this.generateRequestObj(nativeMethodName, params);
    console.log('%c >> request:' + port, 'color:blue', uri);
    return new Promise(resolve => {
      this.pool[port] = resolve;
      window.prompt(uri, '');
    }).catch(e => {
      console.error(e);
      console.error(`jsbridge method fail: ${JSON.stringify({ uri, port })}`);
    });
  };
  /**
   * 供客户端回调
   * @port {Number} 当前回调池中的key, 对应一个回调函数
   * @res {Object} 客户端的处理结果, 一般是json格式
   */
  onFinish = (port, res) => {
    console.log('%c << response:' + port, 'color:green', res);
    const resolve = this.pool[port];
    resolve && resolve(res);
    delete this.pool[port];
  };
  /**
   * 发送网络请求
   * @method {String} get,post,put,del
   * @url {String} 请求url
   * @params {Object} 发送参数
   */
  request = async (method, url, params) => {
    const result = await this.run(method, { url, params });
    if (result.err_code && result.msg) {
      console.log(result);
      this.toast({ msg: result.msg });
    }
    return result;
  };
  /**
   * 弹出原生toast
   */
  toast = (opt = {}) => {
    const defaultOpt = {
      msg: '弹出Toast',
      long: true,
    };
    return this.run('toast', Object.assign(defaultOpt, opt));
  };
}

export default (() => {
  // eslint-disable-next-line
  try {
    // eslint-disable-next-line
    const webview = new NdogJsBridge(AndroidJsConnector.getInjectName());
    window.NDB = webview;
    window.webview = true;
    console.log('now is in webview');
    return webview;
  } catch (e) {
    console.log(e);
    const webview = new NdogJsBridge('android');
    window.NDB = webview;
    window.webview = false;
    console.log('now is not in webview');
    return webview;
  }
})();

export const androidBackEvent = new AndroidBackEvent();
