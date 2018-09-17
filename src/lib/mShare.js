/**
 * @author lichao11
 *
 微信好友分享组件
 (1)对于JdApp内嵌页直接调用JdApp的分享协议
 分享协议的文档地址,Since JdApp Version 4.4
 http://192.168.144.123/wiki/index.php?title=M%E9%A1%B5%E5%86%85%E5%88%86%E4%BA%AB%E8%B0%83%E7%94%A8
 (2)当使用UC浏览器和QQ浏览时,采用浏览器自带的分享组件进行分享
 (3)当Safari浏览器或者其它浏览器时,跳转M版的分享页,目前M分享页正在制作中,敬请期待
 1.引入分享组件
 <script type="text/javascript" src="/js/.../weixinShare.src.js?v="></script>
 2.初始化分享组件
 var config = {
            url:'http://m.jd.com', //分享的url
            title:'标题',
            content:'描述',
            img:'http://img01.b2bkk.com/upload/201507/03/16-57-03-54-73905.png.middle.png', //分享框中左边的图片的url
            channel:'weixin'		//此次固定为weixin,指分享到微信好友	
        };
 var share_obj = new weixinShare(config);

 3.在需要调用的时候调用 share_obj.callShare();
 //shareToFriends 是分享的按钮
 var shareButton = document.getElementById("shareToFriends");
 shareButton.onclick = function() {
    	//其它操作，比如埋点等	
    	
		share_obj.callShare(); //调用分享功能		
	};
 *
 * */
var weixinShare = function (shareCon, callback) {
    shareCon = shareCon || {};
    this.elementNode = shareCon.elementNode || ''; //
    this.url = shareCon.url || document.location.href || ''; //分享链接
    this.title = shareCon.title || document.title || '';  //分享标题
    this.desc = shareCon.content || document.title || ''; //分享内容
    this.img = shareCon.img || document.getElementsByTagName('img').length > 0 && document.getElementsByTagName('img')[0].src || ''; //分享图片
    this.img_title = shareCon.img_title || document.title || '';
    this.from = shareCon.from || window.location.host || '';
    this.channel = shareCon.channel || 'weixin'; //默认微信好友分享
    this.sid = shareCon.sid || '';

    if (this.elementNode != '') {
        if (!document.getElementById(this.elementNode)) {
            return false;
        }
    }

    var qApiSrc = {
        lower: "//3gimg.qq.com/html5/js/qb.js",
        higher: "//jsapi.qq.com/get?api=app.share"
    };
    var bLevel = {
        qq: {forbid: 0, lower: 1, higher: 2},
        uc: {forbid: 0, allow: 1}
    };
    var UA = navigator.appVersion;
    //判断是否为QQ浏览器,是否可以调用QQ浏览器的分享
    var isqqBrowser = (UA.split("MQQBrowser/").length > 1) ? bLevel.qq.higher : bLevel.qq.forbid;
    //判断是否为UC浏览器,是否可以调用UC浏览器的分享
    var isucBrowser = (UA.split("UCBrowser/").length > 1) ? bLevel.uc.allow : bLevel.uc.forbid;
    var version = {
        uc: "",
        qq: ""
    };
    var isWeixin = false;

    //新浪微博,微信好友,微信朋友圈,QQ,QQ空间
    this.ucAppList = {
        sinaWeibo: ['kSinaWeibo', 'SinaWeibo', 11, '\u65b0\u6d6a\u5fae\u535a'],
        weixin: ['kWeixin', 'WechatFriends', 1, '\u5fae\u4fe1\u597d\u53cb'],
        weixinFriend: ['kWeixinFriend', 'WechatTimeline', '8', '\u5fae\u4fe1\u670b\u53cb\u5708'],
        QQ: ['kQQ', 'QQ', '4', '\u0051\u0051\u597d\u53cb'],
        QZone: ['kQZone', 'QZone', '3', '\u0051\u0051\u7a7a\u95f4']
    };


    this.share = function (to_app) {
        var title = this.title, url = this.url, desc = this.desc, img = this.img, img_title = this.img_title, from = this.from;
        if (platform_os == 'undefined' || platform_os == '') {
            platform_os = this.getPlatform();
        }
        if (isucBrowser) {
            if (to_app == 'QZone') {
                //当分享到QZone时,创建iframe,进行分享,因目前是微信,暂时用不到
                B = "mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url="+img+"&title="+title+"&description="+desc+"&url="+url+"&app_name="+from;
                k = document.createElement("div"), k.style.visibility = "hidden", k.innerHTML = '<iframe src="' + B + '" scrolling="no" width="1" height="1"></iframe>', document.body.appendChild(k), setTimeout(function () {
                    k && k.parentNode && k.parentNode.removeChild(k);
                }, 5E3);
            }
            if (platform_os == "iPhone" && typeof(ucbrowser) != "undefined") {
                to_app = this.ucAppList[to_app][0];
                //iOS系统分享功能
                ucbrowser.web_share(title, desc, url, to_app, "", "", "");
            }else if (typeof(ucweb) != "undefined") {
                to_app = this.ucAppList[to_app][1];
                //Android系统分享功能
                ucweb.startRequest("shell.page_share", [title, desc, url, to_app, "", "", ""]);
            }else {
                //敬请期待m版分享页！
                // location.href = "sharepage.html?shareUrl="+encodeURIComponent(this.url)+"&shareContent="+encodeURIComponent(this.desc)+"&shareTitle="+encodeURIComponent(this.title)+"&sid=" + this.sid;
                callback && callback();
            }
        } else {
            if (isqqBrowser && !isWeixin) {
                to_app = to_app == '' ? '' : this.ucAppList[to_app][2];
                var ah = {
                    url: url,
                    title: title, //分享标题
                    description: desc, //分享描述
                    img_url: img, //分享的图片
                    img_title: img_title, //图片标题
                    to_app: to_app,//微信好友1
                    cus_txt: "\u8bf7\u8f93\u5165\u6b64\u65f6\u6b64\u523b\u60f3\u8981\u5206\u4eab\u7684\u5185\u5bb9" //请输入此时此刻想要分享的内容
                };
                ah = to_app == '' ? '' : ah;
                if (typeof(browser) != "undefined") {
                    if (typeof(browser.app) != "undefined" && isqqBrowser == bLevel.qq.higher) {
                        browser.app.share(ah);
                        // location.href = "sharepage.html?shareUrl="+encodeURIComponent(this.url)+"&shareContent="+encodeURIComponent(this.desc)+"&shareTitle="+encodeURIComponent(this.title)+"&sid=" + this.sid;
                        callback && callback();
                        return;
                    }
                } else {
                    if (typeof(window.qb) != "undefined" && isqqBrowser == bLevel.qq.lower) {
                        window.qb.share(ah);
                    } else {
                        //敬请期待m版分享页！
                        // location.href = "sharepage.html?shareUrl="+encodeURIComponent(this.url)+"&shareContent="+encodeURIComponent(this.desc)+"&shareTitle="+encodeURIComponent(this.title)+"&sid=" + this.sid;
                        callback && callback();
                    }
                }
            } else {
                //敬请期待m版分享页！
                // location.href = "sharepage.html?shareUrl="+encodeURIComponent(this.url)+"&shareContent="+encodeURIComponent(this.desc)+"&shareTitle="+encodeURIComponent(this.title)+"&sid=" + this.sid;
                callback && callback();
            }
        }
    };

    this.isloadqqApi = function () {
        if (isqqBrowser) {
            var b = (version.qq < 5.4) ? qApiSrc.lower : qApiSrc.higher;
            var d = document.createElement("script");
            var a = document.getElementsByTagName("body")[0];
            d.setAttribute("src", b);
            a.appendChild(d);
        }
    };

    //获得浏览器系统类型
    this.getPlatform = function () {
        ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1 || ua.indexOf("ios") > -1) {
            return "iPhone";
        }
        else if (ua.indexOf("android") > -1 || ua.indexOf("linux") > -1) {
            return "Android";
        }
        else {
            return "Unknown";
        }
    };

    //判断是否为微信浏览器
    this.is_weixin = function () {
        var ua = UA.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    };

    this.getVersion = function (c) {
        var a = c.split("."), b = parseFloat(a[0] + "." + a[1]);
        return b;
    };

    this.init = function () {
        platform_os = this.getPlatform();
        version.qq = isqqBrowser ? this.getVersion(UA.split("MQQBrowser/")[1]) : 0;
        version.uc = isucBrowser ? this.getVersion(UA.split("UCBrowser/")[1]) : 0;
        isWeixin = this.is_weixin();
        if ((isqqBrowser && version.qq < 5.4 && platform_os == "iPhone") || (isqqBrowser && version.qq < 5.3 && platform_os == "Android")) {
            isqqBrowser = bLevel.qq.forbid;
        } else {
            if (isqqBrowser && version.qq < 5.4 && platform_os == "Android") {
                isqqBrowser = bLevel.qq.lower;
            } else {
                if (isucBrowser && ((version.uc < 10.2 && platform_os == "iPhone") || (version.uc < 9.7 && platform_os == "Android"))) {
                    isucBrowser = bLevel.uc.forbid;
                }
            }
        }
        this.isloadqqApi();
        if (isqqBrowser || isucBrowser) {

        }

    };

    this.init();
    //调用分享功能(2)QQ|UC (3)普通浏览器,Safari,其它浏览器
    this.callShare = function() {
        platform_os = this.getPlatform();

        if (isqqBrowser) {
            var qqShare = this;
            setTimeout(function(){
                qqShare.share(qqShare.channel);
            },500);
        }
        else if(isucBrowser){
            this.share(this.channel);
        }
        else {
            //加载m普通的页面
            // location.href = "sharepage.html?shareUrl="+encodeURIComponent(this.url)+"&shareContent="+encodeURIComponent(this.desc)+"&shareTitle="+encodeURIComponent(this.title)+"&sid=" + this.sid;
            callback && callback();
        }
    };

    return this;
};


module.exports = weixinShare;
