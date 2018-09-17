/**
 * 工具类
 */

var webview = require('@jmfe/jm-webview');

var util = module.exports = {
	/**
	 * 跳登录
	 * @param  {[type]} jumbBackUrl [description]
	 * @return {[type]}             [description]
	 */
	goLogin: function(jumbBackUrl) {
		webview.toLogin(jumbBackUrl || location);
	},

	/**
	 * 延迟函数
	 * @param  {Function} fn    [description]
	 * @param  {[type]}   delay [description]
	 * @return {[type]}         [description]
	 */
	delay: function(fn, delay) {
		return setTimeout(function() {
			fn();
		}, (typeof delay === 'number' && delay) || 80);
	},

	/**
	 * 埋点上报
	 * @param  {[type]} event_id    [description]
	 * @param  {[type]} event_param [description]
	 * @param  {[type]} level       [description]
	 * @return {[type]}             [description]
	 */
	reportData: function(event_id, event_param, level) {
	    try {
	        var id = event_id || '';
	        var click = new MPing.inputs.Click(id);
	        if (event_param) {
	            click.event_param = event_param;
	        }
	        if (level) {
	            click.event_level = level;
	        }
	        click.updateEventSeries();
	        var mping = new MPing();
	        mping.send(click);
	    } catch (e) {
	    }
	},

	/**
	 * 地址添加参数
	 * @param {[type]} name  [description]
	 * @param {[type]} value [description]
	 */
	addParamToUrl: function(url, name, value) {
        var currentUrl = url.split('#')[0];//window.location.href.split('#')[0];
        if (/\?/g.test(currentUrl)) {
            if (/name=[-\w]{4,25}/g.test(currentUrl)) {
                currentUrl = currentUrl.replace(/name=[-\w]{4,25}/g, name + "=" + value);
            } else {
                currentUrl += "&" + name + "=" + value;
            }
        } else {
            currentUrl += "?" + name + "=" + value;
        }
        if (window.location.href.split('#')[1]) {
            return currentUrl + '#' + window.location.href.split('#')[1];
        } else {
            return currentUrl;
        }
    },

    /**
	 * 获取地址参数
	 * @param  {[type]} url [description]
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	queryString: function(key) {
		var result = new RegExp('[\\?&]' + key + '=([^&#]*)', 'i').exec(window.location.href);
		return result && decodeURIComponent(result[1]) || '';
	},

	/**
	 * 关闭XView
	 */
    closeXView: function() {
        webview.XViewClose();
    },

	/**
	 * 唤醒app
	 * @param appurl
	 * @param murl
	 */
	openJdApp: function(appurl, murl) {
	    var urlParam = {
			category: 'jump',
			action: 'to',
			des: 'm',
			url: window.location.href
		}
		if (navigator.userAgent.indexOf('jdapp') == -1) {
		  window.location.href = 'openApp.jdMobile://virtual?params=' + JSON.stringify(urlParam);
		} 
	},

    /**
     * 上报PV埋点
     * @return {[type]} [description]
     */
    reportPV: function() {
        try{
            new MPing().send(new MPing.inputs.PV());
        }catch(e){}
    }

}