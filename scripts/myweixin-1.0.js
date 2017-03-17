/*
 * 注意：
 * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
 * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
 * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 *
 * 如有问题请通过以下渠道反馈：
 * 邮箱地址：weixin-open@qq.com
 * 邮件主题：【微信JS-SDK反馈】具体问题
 * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
 **
 * 在需要调用JS接口的页面引入如下JS文件，
 * （支持https）：http://res.wx.qq.com/open/js/jweixin-1.0.0.js
 *  <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
 *
 * 2015-1-30 modify by wayne
 * 扩展微信 js
 */

var wxJs = {
    /**
     *weixinjs.setPrefix('${SYSURL}');
     */
    root: "",
    setPrefix: function (root) {
        this.root = root;
    },

    /**
     *获取url上面的参数值
     *name 参数名
     *return 参数值
     */
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    },

    /**
     * 通过公众号的id获取设置的Appid
     * generalid 公众号的id
     * return 公众号设置的APPID
     *  eg: 有数据是返回{appid:wxb37de2311affafd2}
     *      出错则：{errcode："01",msg:"msg"}
     */
    getAppid: function (shopid, redirect) {
        $.ajax({
            url: this.root + "/w/wxutil/getAppid",
            type: "POST",
            data: {shopid: shopid, ts: (new Date()).getTime()},
            dataType: "json",
            async: false,
            success: function (data) {
                var appid = data.appid;
                if (!appid) {
                    return data;
                }
                redirect(appid);
            },
            error: function (jqXHR, textStatus) {
                return {errcode: "01", errmsg: "获取公众号的appid失败!"}
            }
        })
    },

    /** 转向获取code页面 */
    toGetCode: function (shopid) {
        var redirect_uri = window.location.href;
        this.getAppid(shopid, function (appid) {
            //微信授权的固定url  scope=snsapi_userinfo|scope=snsapi_base
            var wx_oauth2_url = "https://open.weixin.qq.com/connect/oauth2/authorize";
            var param = "?appid=" + appid + "&redirect_uri=" + encodeURIComponent(redirect_uri) + "&response_type=code&scope=snsapi_userinfo&state=lxcy#wechat_redirect";
            var url = wx_oauth2_url + param;

            window.location.replace(url);
            //window.location.href=url;
        });
    },

    /** 获取用户openid */
    getOpenidByCode: function (shopid, callback) {
        var code = this.getUrlParam("code");
        $.ajax({
            url: this.root + "/w/wxutil/getOpenidByCode",
            type: "POST",
            data: {shopid: shopid, code: code, ts: (new Date()).getTime()},
            dataType: "json",
            success: function (data) {
                callback(data);
            },
            error: function () {
                return {errcode: "01", errmsg: "获取公众号的appid失败!"}
            }
        });
    },

    checkUser: function (generalid, memberid, openid, callback) {
        $.ajax({
            url: this.root + "/w/wxutil/checkUser",
            type: "POST",
            data: {generalid: generalid, memberid: memberid, openid: openid, ts: (new Date()).getTime()},
            dataType: "json",
            success: function (data) {
                callback(data);
            },
            error: function () {
                return {errcode: "03", errmsg: "校验用户失败!"}
            }
        });
    },


    /**
     *判断是否是微信浏览器
     * @author Bill
     * @version 1.0
     * @Since  2013-12-18
     */
    isWeixin: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },

    /**
     *判断是否是iPhone手机
     * @author Bill
     * @version 1.0
     * @Since  2013-12-18
     */
    isIphone: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/iPhone/i) == "iphone") {
            return true;
        } else {
            return false;
        }
    },

    /**
     *判断是否是Android手机
     * @author Bill
     * @version 1.0
     * @Since  2013-12-18
     */
    isAndroid: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/Android/i) == "android") {
            return true;
        } else {
            return false;
        }
    },

    /**
     *监测参数
     */
    checkMParam: function (value) {
        if (value != null && value != undefined && value != "" && value != "null" && value != "NULL" && value != "undefined" && value != "UNDEFINED") {
            return true;
        }
        return false;
    }
};

/** 2015-1-4 add by wayne
 * 获取openid
 * 优先获取本地的sessionStorage的key，value
 * */
function getOpenidForCorpid(_corpid, callback) {
    var code = wxJs.getUrlParam("code");
    if (code == null || code == undefined) {
        wxJs.toGetCode(_corpid);
        //return;
    } else {
        wxJs.getOpenidByCode(_corpid, function (data) {
            callback(data);
        });
    }
}

//设置微信参数
function setwx_config(appId, timestamp, nonceStr, signature) {
    /*
     * 注意：
     * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
     * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
     * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
     *
     * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
     * 邮箱地址：weixin-open@qq.com
     * 邮件主题：【微信JS-SDK反馈】具体问题
     * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
     */
    wx.config({
        debug: false,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId,// 必填，公众号的唯一标识
        timestamp: timestamp,// 必填，生成签名的时间戳
        nonceStr: nonceStr,// 必填，生成签名的随机串
        // 必填，签名，见附录1
        signature: signature,
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow'
        /**'scanQRCode',
         'chooseWXPay',
         'openProductSpecificView'
         'addCard',
         'chooseCard',
         'openCard'**/
        ]
    });
}


//异步获取微信jS-SDK 参数
function getJsApSign(reurl, wxappid, corpid, getJsUrl) {
    $.ajax({
        url: getJsUrl + "/w/wxutil/getJsApSign/" + corpid,
        type: "GET",
        data: {
            reurl: reurl,
            ts: (new Date()).getTime()
        },
        success: function (data) {
            //提交失败
            if (data.status == '0') {
                alert("获取企业微信配置失败！");
                return;
            }
            //提交成功
            else if (data.status == '1') {
                //设置微信参数
                setwx_config(wxappid, data.timestamp, data.nonceStr, data.signature);
            }
            //生成JS-SDK使用权限签名算法出错
            else if (data.status == '-1') {
                //alert("生成JS-SDK使用权限签名算法出错");
                alert("获取企业微信配置失败！");
                return;
            }
            else {
                alert("获取企业微信配置失败！");
                return;
                //alert("提交失败");
            }
        },
        error: function () {
            alert("获取企业微信配置失败！");
            return;
            //alert("提交失败");
        }
    });
}

//2异步获取微信jS-SDK 参数
function getJsApSign2(reurl,wxappid,corpid,getJsUrl){
    $.ajax({
        type: 'GET',
        url:getJsUrl+"/w/wxutil/getJsApSign2/"+corpid,
        dataType:'jsonp',
        data:{
            reurl:reurl,
            ts:(new Date()).getTime()
        },
        jsonp:'getJsApSign',
        error: function(XmlHttpRequest,textStatus,errorThrown){
            //alert("请求出错!");
            return;
        },
        success: function(data){
            //提交失败
            if(data.status=='0'){
                alert("获取企业微信配置失败！")
                return;
            }
            //提交成功
            else if(data.status=='1'){
                //设置微信参数
                var obj = new Function("return" + data.wxmaps)();//转换后的JSON对象
                setwx_config(wxappid,obj.timestamp,obj.nonceStr,obj.signature);
            }
            //生成JS-SDK使用权限签名算法出错
            else if(data.status=='-1'){
                //alert("生成JS-SDK使用权限签名算法出错");
                alert("获取企业微信配置失败！")
                return;
            }
            else{
                alert("获取企业微信配置失败！")
                return;
                //alert("提交失败");
            }
        }
    });
}

//微信分享
function wx_Share(reurl, shareData) {
    var getJsUrl = 'http://order.letsun.com.cn/';
    var corpid = '91';
    var wxappid = "wx02756e6ee0f837c1"; //订阅号
    wxJs.setPrefix(getJsUrl);

    //异步获取微信jS-SDK 参数
    getJsApSign2(reurl, wxappid, corpid, getJsUrl);

    //微信分享 jS
    wx.ready(function () {
        wx.showOptionMenu();

        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);

        music.play();
        jp.play();
        jp.pause();
        music2.play();
        music2.pause();
    });
}