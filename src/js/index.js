require('../css/reset.scss');
require('../css/common.scss');

//start:polyfill
var Promise = require('promise-polyfill');
if (!window.Promise) {
	window.Promise = Promise;
}
require('whatwg-fetch');
//end:polyfill

require('./constant');
var load = require('./load');
var play = require('./play');

var Game = {};

Game.init = function () {
	load.init();
	play.start();
	require('./perform');
}

Game.init();
/**
 * 环境检查
 */
var checkEnv = function() {
	var ua = window.navigator.userAgent.toLowerCase();
	var wxApp = /MicroMessenger/i.test(ua);
	var jdApp = ua.indexOf('jdapp') != -1;
	var iphone = ua.indexOf('iphone') != -1;
	var android = ua.indexOf('android') != -1;
	var inQQ = ua.indexOf('MQQBrowser') != -1;
	var uaArr = ua.split(';');

	//判断运行环境
	if (jdApp) this.env = 'jdApp';
	else if (wxApp) this.env = 'wxApp';
	else this.env = 'browser';

	//判断操作系统
	if (iphone) this.OS = 'iphone';
	else this.OS = 'android';

	this.inQQ = inQQ;
	this.inIframe = window !== window.top;

	//判断app版本，fix android 5.2 bug
	var jdAppVersion = (function () {
		if (jdApp) {
			return uaArr[2] ? uaArr[2].replace(/\./g, '') : '';
		} else {
			return '';
		}
	})();

	//5.2版本
	this.jdApp520 = (function () {
		return jdApp && jdAppVersion >= 520;
	})();

	//5.5版本
	this.jdApp560 = (function () {
		return jdApp && jdAppVersion >= 560;
	})();

	//客户端版本
	this.jdAppClientVersion = (function () {
		return jdApp && jdAppVersion >= (window.CONF.clientVersion || 560)
	})();
}();
console.log(env)
