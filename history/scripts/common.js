var common = {};

var timer = [];

(function ($) {
    var baseUrl = "http://order.letsun.com.cn/";
    common.cfg = {
        companyId: "84",
        placeId: "167",

        shareStat: baseUrl + "w/wxutil/addShareSumUrl/",                      //统计分享量
        totalStat: baseUrl + "w/wxutil/writePvuv/",                           //统计访问量
        getOpenId: baseUrl + "w/crossDomain/",                                //获取open id
        apply: baseUrl + "w/crossDomain/submitData/",                         //报名
        checkSubmit: baseUrl + "w/crossDomain/queryResume/",                  //查询是否提交过资料
        getScore: baseUrl + "w/crossDomain/queryFans/",                       //查询游戏分数和粉丝助力列表
        getRank: baseUrl + "w/crossDomain/queryRankinglist/",                 //获取排行榜
        submitScore: baseUrl + "w/crossDomain/submitGamescore/",              //提交分数
        submitHelp: baseUrl + "w/crossDomain/submitHelp/",                    //提交好友助力

        checkLottery: baseUrl + "w/crossDomain/querylottly/",                 //查询是否中奖
        lottery: baseUrl + "w/crossDomain/lottly/",                           //抽奖
        winnerMes: baseUrl + "w/crossDomain/submitBuyer/"                     //中奖人数据提交
    };

    /**
     * @func common.alert()
     * @desc 弹框组件
     * @param cfg
     * @param cfg.title {string} 弹框标题，默认为没有标题
     * @param cfg.content {string} 弹框内容
     * @param cfg.width {string} 弹框宽度
     * @param cfg.dialog {boolean} 是否是对话框，默认为否
     * @param cfg.ok {function} 点击确定的回调函数
     * @param cfg.okValue {string} 确定按钮的文字，默认为确定
     * @param cfg.cancel {function} 点击取消的回调函数
     * @param cfg.cancelValue {string} 取消按钮的文字，默认为取消
     * @param cfg.textAlign {string} 文字方向，默认为居中
     * @param cfg.mask {boolean} 是否有遮罩层，默认为没有
     */
    common.alert = function (cfg) {
        //设置默认值
        var ok = cfg.ok || function () {
            };
        var okValue = cfg.okValue || "确定";
        var cancel = cfg.cancel || function () {
            };
        var cancelValue = cfg.cancelValue || "取消";
        var dialog = cfg.dialog || false;
        var textAlign = cfg.textAlign || "center";
        var width = cfg.width || "60%";

        //生成随机ID
        var id = Math.ceil(Math.random() * 1000000);

        var con = '<div class="alert" style="position: fixed;width: 100%;height: 100%;top: 0;left: 0;';

        //判断是否添加遮罩层
        if (cfg.mask) {
            con += 'background-color: rgba(0, 0, 0, 0.5);';
        }

        con += '-webkit-transition: ease-out 0.5s; -moz-transition: ease-out 0.5s;-ms-transition: ease-out 0.5s; -o-transition: ease-out 0.5s;' +
            'transition: ease-out 0.5s;z-index:9999;opacity:0"><div style="position: absolute;top: 40%;left:50%;width: ' + width +
            ';background-color: #fff;border-radius: 10px;overflow: hidden;-webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);' +
            '-ms-transform: translate(-50%,-50%); -o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);box-shadow: 3px 3px 10px #666">';

        //判断是否有标题
        if (cfg.title) {
            con += '<div style="font-size: 24px;line-height: 60px;text-align: center;color: #60a0ff;">' + cfg.title + '</div>' +
                '<div style="font-size: 24px;color: #555;padding: 20px;line-height:30px;text-align:' + textAlign + ';border-bottom: 1px solid #ccc;' +
                'word-break:break-all;word-wrap:break-word;position:relative">' + cfg.content + '</div>';
        } else {
            con += '<div style="font-size: 24px;color: #555;padding: 40px 20px;line-height:30px;text-align:' + textAlign + ';border-bottom: 1px solid #ccc;' +
                'word-break:break-all;word-wrap:break-word;position:relative">' + cfg.content + '</div>';
        }

        //判断弹框类型，如果为对话框则显示确定和取消按钮
        if (dialog) {
            con += '<div><button style="width: 48%;height: 80px;border: none;background: none;font-size: 24px;padding: 0;outline: none" ' +
                'id="dCancel' + id + '">' + cancelValue + '</button><button style="width: 48%;height: 80px;border: none;background: none;' +
                'font-size: 24px;padding: 0;color: #60a0ff;outline: none;" id="dConfirm' + id + '">' + okValue + '</button></div></div>';
        } else {
            con += '<div><button style="width: 100%;height: 80px;border: none;background: none;font-size: 24px;' +
                'padding: 0;color: #60a0ff;outline: none;" id="dConfirm' + id + '">' + okValue + '</button></div></div></div>';
        }

        //向页面添加弹框
        $("body").append(con);

        //延时添加过渡效果
        setTimeout(function () {
            $(".alert").css("opacity", 1);
        }, 30);

        //取消按钮事件
        $("#dCancel" + id).on("click", function () {
            $(this).parents(".alert").remove();
            cancel();
        });

        //确定按钮事件
        $("#dConfirm" + id).on("click", function () {
            $(this).parents(".alert").remove();
            ok();
        });
    };

    /**
     * @desc 隐藏动画元素
     * @func common.hideEle()
     */
    common.hideEle = function () {
        $(".ani").hide();
    };

    /**
     * @desc 添加动画
     * @func common.animate()
     * @param ele {object} 需要添加动画的元素
     */
    common.animate = function (ele) {
        var num = 0;
        ele.each(function () {
            var self = $(this);
            timer[num] = setTimeout(function () {
                self.show();
                self.css({
                    "-webkit-animation": self.data("animate")
                });
            }, self.data("delay"));
            num++;
        });
    };

    /**
     * @desc 移除动画
     * @func common.removeAni()
     * @param ele {object} 需要移除动画的元素
     */
    common.removeAni = function (ele) {
        for (var i = 0; i < timer.length; i++) {
            clearTimeout(timer[i]);
        }
        ele.hide();
        ele.each(function () {
            var self = $(this);

            self.css({
                "-webkit-animation": "none"
            });
        });
    };

    /**
     * @desc 页面切换动画
     * @param p1 {object} 当前页
     * @param p2 {object} 下一页
     */
    common.turnPage = function (p1, p2) {
        p1.css("-webkit-animation", "fadeOut 1s");
        p2.show().css("-webkit-animation", "fadeIn 1s");

        setTimeout(function () {
            common.removeAni(p1.find(".ani"));
            p1.css("-webkit-animation", "none").hide();

            common.animate(p2.find(".ani"));
        }, 700);
    };

    /**
     * @desc 显示页面加载百分比
     * @param ele {Object} 显示百分比的元素
     */
    common.loading = function (ele) {
        var loadpicarray;
        var picloaded = 0;

        loadpicarray = document.getElementsByTagName("img");
        picloaded = 0;
        for (var i = 0; i < loadpicarray.length; i++) {
            var img = new Image();
            img.onload = function () {
                picloaded++;
                var lstr = Math.ceil(100 * picloaded / loadpicarray.length) + "%";
                $("#percent").html(lstr);
            };
            img.src = loadpicarray[i].src;
        }
    };

    /**
     * @desc 微信分享
     * @func common.wxShare()
     * @param cfg.title {String} 分享的标题
     * @param cfg.desc {String} 分享的描述
     * @param cfg.link {String} 分享的链接
     * @param cfg.imgUrl {String} 分享的图片链接
     * @param cfg.isStat {Boolean} 是否统计分享量
     */
    common.wxShare = function (cfg) {
        var reurl = window.location.href.split('#')[0];

        /**微信分享内容*/
        var shareData = {
            title: cfg.title,
            desc: cfg.desc,
            link: cfg.link,
            imgUrl: cfg.imgUrl,
            trigger: function (res) {
                //common.alert('用户点击发送给朋友');
            },
            success: function (res) {
                //分享成功
                if (cfg.isStat) {
                    addShareSumUrl(reurl);
                }
            },
            cancel: function (res) {
                //取消分享
            },
            fail: function (res) {
                //分享失败
            }
        };

        var isWxBrowser = wxJs.isWeixin();

        //微信浏览器登陆 先获取wxno  设置客户
        if (isWxBrowser) {
            //微信分享
            wx_Share(reurl, shareData);
        }
    };

    /**
     * @desc 分享量统计
     * @param url
     */
    function addShareSumUrl(url) {
        var shareUrl = common.cfg.shareStat + common.cfg.companyId;

        $.ajax({
            type: 'GET',
            url: shareUrl,
            dataType: 'jsonp',
            data: {
                url: url.split('?')[0],
                ts: (new Date()).getTime()
            },
            jsonp: 'addShareSumUrl',
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                //alert("请求出错!");
            },
            success: function (msg) {
                if (msg.status == "true") {
                    //alert("请求提交成功!");
                } else {
                    //alert("处理出错!");
                }
            }
        });
    }

    /**
     * @desc 访问量统计
     * @func common.stat()
     */
    common.stat = function () {
        var url = common.cfg.totalStat + common.cfg.companyId;
        var reurl = window.location.href.split('#')[0];

        $.get(url, {
            type: 1,
            orgid: null,
            url: reurl.split('?')[0]
        }, function (data) {
            //console.log("访问量统计：" + data);
        }, "json");
    };

    /**
     * @desc 获取用户信息
     * @func common.getUserMes()
     * @param getPhoto {Number} 是否获取头像 1：是 0：否
     */
    common.getUserMes = function (getPhoto) {
        var reurl = window.location.href.split('#')[0];
        var isWxBrowser = wxJs.isWeixin();

        var url;

        if (getPhoto == 1) {
            url = common.cfg.getOpenId + common.cfg.companyId + "?isAuthorize=1&wk_requestUrl=" + reurl;
        } else {
            url = common.cfg.getOpenId + common.cfg.companyId + "?wk_requestUrl=" + reurl;
        }

        if (isWxBrowser) {
            common.opid = wxJs.getUrlParam("wx");
            common.mytoken = wxJs.getUrlParam("mytoken");
            if (wxJs.checkMParam(common.opid) && wxJs.checkMParam(common.mytoken)) {

                var hash = hex_md5(common.opid + "wnzlxcy").toUpperCase();
                if (hash != common.mytoken) {
                    window.location.href = url;
                }
            } else {
                window.location.href = url;
            }
        }

        common.fansid = wxJs.getUrlParam("fansid");

        if (getPhoto == 1) {
            common.nickname = wxJs.getUrlParam("nickname");
            common.photo = wxJs.getUrlParam("photo");

            common.nickname = decodeURI(escape(common.nickname));

            $("body").html('<img src="' + common.photo + '" style="display: none">');
        }
    };

    /**
     * @desc 查询用户是否提交过资料
     * @func common.checkSubmit()
     * @param callback
     */
    common.checkSubmit = function (callback) {
        var url = common.cfg.checkSubmit + common.cfg.companyId + "/" + common.fansid;

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            data: {
                ts: (new Date()).getTime()
            },
            jsonp: 'queryResumeback',
            error: function () {
                console.log("查询是否提交过资料失败")
            },
            success: function (data) {
                callback(data);
            }
        });
    };

    /**
     * @desc 查询游戏分数和粉丝助力列表
     * @func common.getScore();
     */
    common.getScore = function (score, callback) {
        var url = common.cfg.getScore + common.cfg.companyId + "/" + common.fansid + "/" + score;

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            data: {
                ts: (new Date()).getTime()
            },
            jsonp: 'queryFansback',
            error: function () {
                console.log("获取分数失败");
            },
            success: function (data) {
                callback(data);
            }
        });
    };

    /**
     * @desc 查询排行榜
     * @func common.getRank()
     * @param callback
     */
    common.getRank = function (callback) {
        var url = common.cfg.getRank + common.cfg.companyId + "/" + common.fansid + "/" + common.cfg.cityId + "/" + 10;

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            data: {
                ts: (new Date()).getTime()
            },
            jsonp: 'queryRankinglist',
            error: function () {
                console.log("获取排行榜失败")
            },
            success: function (data) {
                callback(data);
            }
        });
    };

    /**
     * @desc 提交游戏分数
     * @func common.submitScore()
     */
    common.submitScore = function (score) {
        var url = common.cfg.submitScore + common.cfg.companyId + "/" + common.fansid + "/" + score;

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            data: {},
            jsonp: 'submitGamescore',
            error: function () {
                console.log("提交分数失败");
            },
            success: function (data) {
                if (data.status == "1") {
                    //alert("请求提交成功!");
                } else {
                    console.log(data);
                }

            }
        });
    };

    /**
     * @desc 提交好友助力
     * @func common.help()
     */
    common.help = function (friendId, score, callback) {
        var url = common.cfg.submitHelp + common.cfg.companyId + "/" + friendId + "/" + common.fansid + "/" + score + "/" + common.cfg.cityId;

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            data: {},
            jsonp: 'submitHelpback',
            error: function () {
                console.log("提交好友助力失败");
            },
            success: function (data) {
                callback(data);
            }
        });
    };

    /**
     * @desc 查询是否抽过奖
     */
    common.checkLottery = function (callback) {
        var url = common.cfg.checkLottery + common.cfg.companyId + "/" + common.opid + "/" + common.mytoken;

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            data: {},
            jsonp: 'querylottlyback',
            error: function () {
                console.log("提交好友助力失败");
            },
            success: function (data) {
                callback(data);
            }
        });
    };

    /**
     * @desc 抽奖
     */
    common.lottery = function (callback) {
        var url = common.cfg.lottery + common.cfg.companyId + "/" + common.opid + "/" + common.mytoken;

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            data: {},
            jsonp: 'lottlyDataback',
            error: function () {
                console.log("提交好友助力失败");
            },
            success: function (data) {
                callback(data);
            }
        });
    };
})(Zepto);