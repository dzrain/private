conf = {
	//******************测试**************/
//	//鉴权接口
//	vasUrl : "http://192.168.1.110:8080/sxdx_interface/b2b/portal/auth.htm",
//	//扣费接口
//	confirmUrl : "http://192.168.1.110:8080/sxdx_interface/b2b/portal/confirm.htm",
//	//思华订购页面
//	authUrl : "http://218.30.85.109:5151/aaa/v20/authorize.jsp",
//	//SP CODE，在IPTV增值平台上申请的(必填)
//	icpCode : "1003",
	
	//******************商用**************/
	//鉴权接口
	vasUrl : "http://sxtelauth.voole.com/b2b/portal/auth.htm",
	//扣费接口
	confirmUrl : "http://sxtelauth.voole.com/b2b/portal/confirm.htm",
	//思华订购页面
	authUrl : "http://113.136.207.144:5151/aaa/v20/authorize.jsp",
	//SP CODE，在IPTV增值平台上申请的(必填)
	icpCode : "1018",
	//华为
	HUAWEI : {
		SPID : "20150425",
		OEMID : "300135",
		PortalID : "100973",
		partner : "HUAWEI"
	},
	//中兴
	ZTE : {
		SPID : "20150425",
		OEMID : "300135",
		PortalID : "100973",
		partner : "ZTE"
	},
	//统计汇报总开关（包括：PV\点播\订购等）
	pvSwitch : true,
	//陕西电信EPG测试域名
	testEpgUrl : "http://sxteliptvtestepg.voole.com/",
	
	//************* 抽奖活动 ***********************/
	//活动编号
	lotteryId : 1,
	
	//魔兽活动编号
	wowLotteryid : 2,
	
	
	//魔兽投票信息接口
	wowLotteryInfoUrl : "http://sxtellottery.voole.com/b2b/poll/info.htm",
	
	//魔兽统计接口
	wowLotteryStat : "http://sxtellottery.voole.com/b2b/click/ctr.htm",
	
	//魔兽活动提交按钮接口
	wowLotteryUrl : "http://sxtellottery.voole.com/b2b/poll/vote.htm",
	//抽奖接口:
	lotteryUrl : "http://10.5.5.3:80/xjdx-lottery/b2b/portal/lottery.htm",
	//抽奖接口:
	goUrl : "http://10.5.5.3/xjdx-lottery/b2b/lottery/lotteryGenerate.htm",
	//提交手机号接口
	commitUrl : "http://sxtellottery.voole.com/b2b/portal/msgCommit.htm",
	//二合一接口，剩余次数及中奖列表
	portalUrl : "http://10.5.5.3:80/xjdx-lottery/b2b/lottery/lotteryRemain.htm",
	//查询是否是订购用户
	orderStatus : "http://113.136.206.7:8084/b2b/playAward/orderType.htm"
};

/**
 * 合并两个Json对象，如果有重复的键值，后面覆盖前面的
 * 只支持一维的对象
 * @param src
 * @param dest
 * @returns {___anonymous895_896}
 */
function concatJson(src, dest) {
	var result = {};
	for (var key in src) {
		if (src.hasOwnProperty(key)) {
			result[key] = src[key];
		}
	}
	for (var key in dest) {
		if (dest.hasOwnProperty(key)) {
			result[key] = dest[key];
		}
	}
	return result;
}

if (!window.tool) {
	window.tool = {};
}
/**
 * 项目域名
 * @param project_name 默认为: epg-web-chongqing
 * @returns string
 */
tool.project_domain = function (project_name) {
	project_name = project_name || "epg-web-telecomshanxi";
	//ut盒子发现一bug，window.location.protocol获取后的结果为：http，竟然不带冒号（:）
	return location.protocol.replace(/:/g, '') + "://" + location.host + (location.pathname.substring(1).split("/")[0] == project_name ? "/" + project_name : "");
};

/**
 * 设置相对路径给Anchor（链接），不会发出任何请求,只会在加入DOM时产生请求，但是IE6也不支持
 */
tool.getAbsoluteUrl = function(url) {
	var a = document.createElement("A");
	//设置相对路径给 Anchor
	a.href = url;
	//此时相对路径已经变成绝对路径
	url = a.href;
	return url;
};

/**
 * 把url中的key=>value的内容以json对象返回
 * @param url
 * @returns array
 */
tool.url2json = function(url) {
	if (url.indexOf('?') == -1) return '';
	var query = {};
	var array = [];
	var params = (url.split('?'))[1];
	array = params.split('&');
	var length = array.length;
	if (length > 0) {
		for (var i = 0; i < length; i++)
		{
			var index = array[i].indexOf('=');
			var key   = array[i].substring(0, index);
			var value = array[i].substring(index + 1);
			query[key] = value;
		}
	}
	//如果没有元素则返回空
	return JSON.stringify(query) == '{}' ? '' : query;
};

/**
 * 把json对象中的key=>value中的值以url形式返回
 * @param json
 * @param prefixUrl
 * @returns string
 */
tool.json2url = function(json, prefixUrl) {
	var arr = [];
	for (var key in json) {
		//烽火盒子一个bug，会把自身的indexOf输出
		if (json.hasOwnProperty(key)) arr.push(key + '=' + json[key]);
	}
	if (prefixUrl) {
		//如果后面带参数就直接追加
		if (prefixUrl.indexOf('?') > -1) {
			return (prefixUrl + (arr.length == 0 ? '' : '&' + arr.join('&')));
		}
		//如果不带参数需要判断一下
		return (prefixUrl + (arr.length == 0 ? '' : '?' + arr.join('&')));
	}
	return arr.join('&');
};

/**
 * 把当前浏览器url中对应key的值进行返回，相当于java servlet中的request.getParameter(key);
 * @param key  对应的key值
 * @returns string
 */
tool.query = function(key) {
	if (!key) return '';
	var params = this.url2json(window.location.href);
	return params[key];
};

tool.urlParam = function(url, name) {
	url = decodeURI(url).split("#")[0];
	var r = new RegExp("(?:\\b"+name+"\\b\\s*=\\s*)([^&]*)?", "ig");
	var parm = r.exec(url);
	return parm ?  parm[1] : null;
};

/**
 * debug函数
 */
function debug(msg) {
	msg = typeof msg == "object" ? JSON.stringify(msg) : msg;
	var $ = function(id) {
		return typeof id == "string" ? document.getElementById(id) : id;
	};
	var info = document.createElement("p");
	info.style.cssText = "border:1px solid red;margin:5px auto;";
	//防止特殊符号被转义，影响调试
	info.innerHTML = htmlspecialchars(msg);

	if (!$("debugdiv")) {
		var div = document.createElement("div");
		div.id = "debugdiv";
		div.style.cssText = "height:auto;width:400px;left:50px;top:20px;font-family:serif;font-size:12px;text-align:center;position:absolute;background-color:#fff;color:#000;border:2px solid red;word-wrap:break-word;padding:10px;z-index:1000;";
		div.appendChild(info);
		document.body.appendChild(div);
	} else {
		var nodes = $('debugdiv').childNodes;
		//默认显示15条调试信息
		if (nodes.length >= 15) {
			$('debugdiv').removeChild(nodes[0]);
		}
		$("debugdiv").appendChild(info);
	}
}

function htmlspecialchars(c, h, g, b) {
	var e = 0, d = 0, f = false;
	if (typeof h === "undefined" || h === null) {
		h = 2;
	}
	c = c.toString();
	if (b !== false) {
		c = c.replace(/&/g, "&amp;");
	}
	c = c.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	var a = {ENT_NOQUOTES: 0,ENT_HTML_QUOTE_SINGLE: 1,ENT_HTML_QUOTE_DOUBLE: 2,ENT_COMPAT: 2,ENT_QUOTES: 3,ENT_IGNORE: 4};
	if (h === 0) {
		f = true;
	}
	if (typeof h !== "number") {
		h = [].concat(h);
		for (d = 0; d < h.length; d++) {
			if (a[h[d]] === 0) {
				f = true;
			} else {
				if (a[h[d]]) {
					e = e | a[h[d]];
				}
			}
		}
		h = e;
	}
	if (h & a.ENT_HTML_QUOTE_SINGLE) {
		c = c.replace(/'/g, "&#039;");
	}
	if (!f) {
		c = c.replace(/"/g, "&quot;");
	}
	return c;
}
