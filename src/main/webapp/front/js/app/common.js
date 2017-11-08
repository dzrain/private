/**
 * 验证影片是否下线
 */
function verifyInfo(mid, mtype, stype) {
	$.ajax({
			url: "../filmInfo/midData.action?pagesize=1&page=1&mid=" + mid + "&ajax=ajax",
			dataType: "json", 
			success: function(data){
				if (data && data != "null") {
					//正常再进入详情页
					if (stype) {
						goInfoForZong(mid, mtype, stype);
					} else {
						goInfo(mid, mtype);
					}
				} else {
					alert("对不起，影片已经下线。");
				}
			},
			error : function(data) {
				alert("对不起，影片已经下线。");
			}
		});
}
function goInfo(mid,mtype){
	$("#loading").show();
	var suchType = "";
	if($("#keyword").attr("id") && $("#keyword").attr("id") == "keyword"){
		suchType += "'"+$("#keyword").attr("sType")+"':'"+encodeURIComponent($("#keyword").html())+"',";
	}
	var url = "../filmInfo/mid.action?page=1&mid="+mid+"&mtype="+(mtype==undefined?"0":mtype);
	 pvajax(suchType+"'lastkind':'"+pv.curKind+"','kind':'view','channelCD':'"+pv.channelCD+"','mid':'"+mid+"','type':'1'",url);
	addUrl(url);
}
function goInfoForZong(mid,mtype,stype){
	$("#loading").show();
	var suchType = "";
	if($("#keyword").attr("id") && $("#keyword").attr("id") == "keyword"){
		suchType += "'"+$("#keyword").attr("sType")+"':'"+encodeURIComponent($("#keyword").html())+"',";
	}
	var url = "../filmInfo/mid.action?page=1&mid="+mid+"&stype="+stype+"&mtype="+(mtype==undefined?"0":mtype);
	pvajax(suchType+"'lastkind':'"+pv.curKind+"','kind':'view','channelCD':'"+pv.channelCD+"','mid':'"+mid+"','type':'1'",url);
	addUrl(url);
}
function goInfoRem(mid,mtype){
	$("#loading").show();
	var url = "../filmInfo/mid.action?page=1&mid="+mid+"&rem=rem&mtype="+(mtype==undefined?"0":mtype);
	pvajax("'lastkind':'"+pv.curKind+"','kind':'view','channelCD':'"+pv.channelCD+"','mid':'"+mid+"','type':'1'",url);
	addUrl(url);
}

function goFilmList(ctype,mtype,column,pagesize,columnIndex,step){
	$("#loading").show();
	if(mtype==19){
		var url= "../filmlist/indexForZhuan.action?ctype="+ctype+"&mtype="+mtype+"&column="+column+"&page=1&pagesize="+pagesize+"&columnIndex="+columnIndex+"&step="+step;
		pvajax("'kind':'"+(step=='3'?"list":"zlist")+"','channelCD':'"+column+"','lastChannelCD':'"+pv.channelCD+"','page':'1','type':'1'",url);
		addUrl(url);
	}else{
		var url = "../filmlist/index.action?ctype="+ctype+"&mtype="+mtype+"&column="+column+"&page=1&pagesize="+pagesize+"&columnIndex="+columnIndex;
		pvajax("'kind':'list','channelCD':'"+column+"','lastChannelCD':'"+pv.channelCD+"','page':'1','type':'1'",url);
		addUrl(url);
	}
}



function goSys(){
	window.location.href = "../system/info.action";
}

function goIndex(){
	$("#loading").show();
	var url = "../index/index.action?page=1";
	pvajax("'kind':'index','type':'1'",url);
	location.href=url;
}
function goSearch(mtype,page,pagesize,currPage){
	$("#loading").show();
	var url = "../search/index.action?mtype="+mtype+"&page="+page+"&pagesize="+pagesize+"&keywords="+"&currPage="+currPage;
	addUrl(url);
}
function viewRecords(page,pagesize){
	$("#loading").show();
	var url = "../record/findRecord.action?page="+page+"&pagesize="+pagesize + "&orderby=1";
	location.href=url;
}
function viewCollect(page,pagesize){
	$("#loading").show();
	var url = "../collect/findCollectList.action?page="+page+"&pagesize="+pagesize + "&orderby=1";
	addUrl(url);
}
function viewMsg(page,pagesize){
	$("#loading").show();
	var url = "../message/findMsg.action?page="+page+"&pagesize="+pagesize + "&orderby=1";
	location.href = url;
}
function viewLock() {
	$("#loading").show();
	var url = "../childLock/index.action";
	location.href = url;
}
function goSourceUrl(sourceUrl,mtype){
	//当sourceurl为空时，不用继续访问，以免出现问题
	if(sourceUrl==''){
		return;
	}
	$("#loading").show();
	var mid = "";
	var channelCD= "";
	 var params = sourceUrl.split("?")[1];
		var arrData = params.split("&");
		var url = "../filmInfo/sourceUrl.action?page=1&mtype="+mtype;
		for(var i=0;i<arrData.length;i++){
			if(arrData[i].indexOf("spid")<0 &&  arrData[i].indexOf("epgid")<0 && arrData[i].indexOf("oemid")<0){
				url+="&"+arrData[i];
			};
			if(arrData[i].indexOf("filmmid")>=0){
				mid = arrData[i].split("=")[1];
			}
			if(arrData[i].indexOf("column")>=0){
				channelCD = arrData[i].split("=")[1];
			}
		}
		 pvajax("'lastkind':'"+pv.curKind+"','kind':'view','channelCD':'"+channelCD+"','mid':'"+mid+"','type':'1'",url);
		addUrl(url);
}
function goAllSearchUrl(mtype){
	$("#loading").show();
	var url = "../searching/index.action?mtype="+mtype;
 	location.href=url;
}

function showTitle(e) {
	var fo = e.attr("fo");
	if (fo && $("#"+fo)[0]) {
		$("#"+fo).attr("class", "state1");
	}
	var tv = e.attr("tv");
	if (tv && $("#"+tv)[0]) {
		$("#"+tv).attr("class", "tv1");
	}
	var p = e.find("p");
	var pContent = p.text();
	if (pContent && pContent.replace(/[^\x00-\xff]/g, "xx").length >= 12) {
		p[0].innerHTML = "<marquee scrollamount='3' hspace='6' scrolldelay='3' behavior='scroll'>" + pContent + "</marquee>";
	}
}
function hidTitle(e) {
	var fo = e.attr("fo");
	if (fo && $("#"+fo)[0]) {
		$("#"+fo).attr("class", "state");
	}
	var tv = e.attr("tv");
	if (tv && $("#"+tv)[0]) {
		$("#"+tv).attr("class", "tv");
	}
	var p = e.find("p");
	var pContent = p[0].innerText || p.text();
	//只有文本内容与html内容不相同时，才重新赋值
	if (pContent != p[0].innerHTML) {
		p[0].innerHTML = pContent;
	}
}
function returnIndex(){
	history.go(-1);
};
var cookie = {
		//写cookies
		setCookie:function(name, value)
		{
			var Days = 30;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/";//path=/ 让cookie在整个域名下可用
		},
		
		//读取cookies
		getCookie:function(name)
		{
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg)) 
				return unescape(arr[2]);
			else 
				return null;
		},
		//删除cookies
		delCookie:function(name)
		{
			var exp = new Date();
			exp.setTime(exp.getTime() - 10000);
			var cval= cookie.getCookie(name);
			if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString() + ";path=/";
		},
};

//如果是早期的浏览器，则添加forEach方法 by guoxiangyun 2014.10.11
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fun) {
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this)
				fun.call(thisp, this[i], i, this);
		}
	};
}

var tool = {
	trim:$.trim,
	empty:function(str) {
		return $.trim(str) == "";
	},
	
	isEmptyorundefined:function(el) {
		return tool.isUndefined(el) || tool.empty(el);
	},
	
	isUndefined:function(el) {
		
		return typeof el == "undefined";
	},
	
	urlParam:function(url, name) {
		url = decodeURI(url).split("#")[0];
		var r = new RegExp("(?:\\b"+name+"\\b\\s*=\\s*)([^&]*)?", "ig");
		var parm = r.exec(url);
		return parm ?  parm[1] : null;
	},
	
	query:function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) return unescape(r[2]); return null;
	},

	/**
	 * 项目域名
	 * @param project_name 默认为: epg-web
	 * @returns string
	 */
	project_domain : function (project_name) {
		project_name = project_name || "epg-web-telecomshanxi";
		return location.protocol + "//" + location.host + (location.pathname.substring(1).split("/")[0] == project_name ? "/" + project_name : "");
	},
	
	/**
	 * 设置相对路径给Anchor（链接），不会发出任何请求,只会在加入DOM时产生请求，但是IE6也不支持
	 */
	getAbsoluteUrl : function(url) {
		var a = document.createElement("A");
		//设置相对路径给 Anchor
		a.href = url;
		//此时相对路径已经变成绝对路径
		url = a.href;
		return url;
	},
	
	/**
	 * 把url中的key=>value的内容以json对象返回
	 * @param url
	 * @returns Array
	 */
	url2json : function(url) {
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
	},

	/**
	 * 把json对象中的key=>value中的值以url形式返回
	 * @param json
	 * @param prefixUrl
	 * @returns string
	 */
	json2url : function(json, prefixUrl) {
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
	},
	
	/**
	 * 删除json中的数据，然后将数据合并为url
	 */
	url2json2delete2url:function(url,deletParams){
		var rallUrl = url.split("?")[0];
		 var json = this.url2json(url);
		 for(var i=0;i<deletParams.split("&").length;i++){
			 delete json[deletParams.split("&")[i]];
		 }
		 return this.json2url(json, rallUrl);
	}
};

function goBack(keycode, fun){
	var urlnew = window.location.href;
	var backurl = "";
	//如果已经是首页了，直接返回封套页
	if (urlnew.indexOf("index/index.action?page=1")> -1) {
		//获取电信EPG首页地址
		backurl = stbInfo["backUrl"] || Authentication.CTCGetConfig("EPGDomain");
		isIndex = true;
	} else {
		//搜索也同样回到首页
		var urlArr = BrowserStorage.api.get("urlGoStep").value.split("###");
		var length = urlArr.length;
		if (length > 1 && tool.urlParam(urlArr[0], "ajax") == 'ajax'){
			backurl = urlArr[1];
			urlArr = urlArr.slice(2);
			BrowserStorage.api.set({
				"key" : "urlGoStep",
				"value" : urlArr.join("###")
			});
		} else {
			backurl = length == 0 ? "" : (length > 1 ? urlArr[1] : "../index/index.action?page=1");
			urlArr = urlArr.slice(1);
			BrowserStorage.api.set({
				"key" : "urlGoStep",
				"value" : urlArr.join("###")
			});
		}
		if (!tool.empty(backurl)) {
			var jumpUrl = tool.urlParam(backurl, "jumpUrl");
			if (jumpUrl) {
				if (jumpUrl == "searching") {
					backurl = backurl.replace(/searching\/search.action/, 'searching/index.action');
				} else {
					//顺序倒置一下
					var urlArr = tool.url2json(backurl);
					backurl = base64.decode(jumpUrl) + "&back=back&jumpUrl=" + base64.encode(backurl.split('&jumpUrl')[0]+"&ids="+urlArr.ids+"&x="+urlArr.x+"&y="+urlArr.y+"&currId="+urlArr.currId) ;
				}
			}
		} else {
			//获取电信EPG首页地址
			backurl = stbInfo["backUrl"] || Authentication.CTCGetConfig("EPGDomain");
			isIndex = true;
		}
	}
	window.location.href = backurl;
}
function setkindForBack(url,keycode){
	if(/filmlist\/index.action|step=3/.test(url)){
		if(keycode && keycode.which==27){
			pvajax("'kind':'list','channelCD':'"+tool.urlParam(url, "column")+"','lastChannelCD':'"+pv.channelCD+"','type':'1','keycode':'27'",url);
		}else{
			pvajax("'kind':'list','type':'1','button':'return'",url);
		}
	}else if(/filmlist\/indexForZhuan.action?/.test(url)){
		if(keycode && keycode.which==27){
			pvajax("'kind':'zlist','type':'1','keycode':'27'",url);
		}else{
			pvajax("'kind':'zlist','type':'1','button':'return'",url);
		}
	}else if(/filmInfo\/sourceUrl.action|filmInfo\/mid.action/.test(url)){
		if(keycode && keycode.which==27){
			pvajax("'kind':'view','type':'1','keycode':'27'",url);
		}else{
			pvajax("'kind':'view','type':'1','button':'return'",url);
		}
	}else if(/index\/index.action/.test(url)){
		if(keycode && keycode.which==27){
			pvajax("'kind':'index','type':'1','keycode':'27'",url);
		}else{
			pvajax("'kind':'index','type':'1','button':'return'",url);
		}
	}
}
function goStep(url){
	url = tool.url2json2delete2url(url,"ids&x&y&currId");
	var urljson = tool.url2json(url);
	//如果是首页直接清空cookie
	if(url.indexOf("index/index.action")>-1){
		BrowserStorage.api.remove("urlGoStep");
		return;
	}
	//shimiao  只是统计不做返回
	if(url.indexOf("index/pvUrl.action?")>-1){
		return;
	}
	var ajax = tool.urlParam(url, "ajax");
	var urlGoStep = BrowserStorage.api.get("urlGoStep").value;
	//如果是频道（普通频道及专题）翻页则放行
	if(ajax == "ajax" && (!/filmlist\/goPage.action|filmlist\/zhuanPage.action|filmlist\/goPageForZhuan.action|hotWord\/channel.action|search\/search.action|searching\/search.action|searching\/indexValue.action|findRecordPage.action|findCollectPage.action|findOrderPage.action/.test(url))){
		return;
	} else if (tool.urlParam(url, "back") == "back") {
		var jumpUrl = tool.urlParam(url, "jumpUrl");
		if (jumpUrl && jumpUrl!="searching") {
			//全局对象定义base64在common.js文件底部
			jumpUrl = base64.decode(jumpUrl);
			if (jumpUrl.indexOf("hotWord/channel.action") > -1) {
				$("#contentListData").attr('url','../hotWord/channel.action?s=1a');
				$("#keyword").attr("sType","hotword");
			} else {
				$("#contentListData").attr('url','../search/search.action?');
				$("#keyword").attr("sType","keyword");
			}
			var keyword = decodeURIComponent(tool.urlParam(jumpUrl, "keyword"));
			var page = tool.urlParam(jumpUrl, "page") || tool.urlParam(jumpUrl, "pg");
			$("#keyword") && $("#keyword").html(keyword);
			$("#keyword") && $("#keyword").attr('jumpUrl',jumpUrl);
			$("#keyword") && $("#keyword").attr('field',tool.urlParam(jumpUrl, "field"));
			//回调完成后直接返回
			typeof goPage == "function" && goPage(page, true, "back");
		}
		return;
	}
	if(urlGoStep && urlGoStep.length > 0){
		var urlArr = urlGoStep.split("###");
		var url1 =  urlArr[0];
		var url2 =  urlArr[1];
		var rallUrl = tool.url2json2delete2url(url1,"ids&x&y&currId");
		//如果这一次跟上一次一样，则不用存了
		if (rallUrl == url) {
			if (url.indexOf("search/index.action") > -1) {
				$("#contentList").show();
			}
			return;
		}
		//如果是我的管理，那么只存最新访问的地址
		var pattern = /\/(collect|record|message|childLock|orderList)\//;
		if (pattern.test(url1) && pattern.test(url)) {
			urlArr = urlArr.slice(1);
			urlGoStep = urlArr.join("###");
		}
		
		if (url.indexOf("filmInfo/sourceUrl.action?") > -1) {
			//找到上次存储的结点直接把之前的全部删除
			urlArr = arrayByKeySlice(urlArr, /filmInfo\/sourceUrl.action/);
			urlGoStep = urlArr.join("###");
		} else if (url.indexOf("filmInfo/mid.action?") > -1) {
			//如果是排行榜及搜索、收藏、观看记录、系统消息
			var p = /\/(hotWord|channelHit|search|searching|collect|record|message)\//;
			var p1 = /direct=direct/;
			//mid详情页
			var m = /filmInfo\/mid.action/;
			//如果是排行榜、搜索进去的 或者 已经有两个mid了 就保持两个mid，否则就是从二级频道列表进去的
			var times = p.test(url2) || (m.test(url1) && m.test(url2)) || p1.test(url1) ? 2 : 1;
			//找到上次存储的结点直接把之前的全部删除
			urlArr = arrayByKeySlice(urlArr, m, times);
			urlGoStep = urlArr.join("###");
		}

		//普通频道（电影、电视剧、儿童、动漫等等，就是除了专题）
		if (url.indexOf("filmlist/index.action")  > -1 || url.indexOf('filmlist/goPage.action') > -1) {
			var u1 = urlArr[0];
			var u1Arr = tool.url2json(u1);
			var columnIndex1 = u1Arr.columnIndex;
			var columnIndex2 =urljson.columnIndex;
			var page1= u1Arr.page;
			var page2 = urljson.page;
			if(u1.indexOf("page=1")<0 || ( columnIndex1!=columnIndex2 && columnIndex1!=1) ||(columnIndex1==columnIndex2 && page1==page2) ){
				urlArr = urlArr.slice(1);
				urlGoStep = urlArr.join("###");
			}
			if(page2 == 1 && columnIndex2==1){
				var urlArrcp = urlArr;
				 for(var i=0;i<urlArrcp.length;i++){
					 if(urlArrcp[i].indexOf("filmlist/index.action")  > -1){
						 urlArr = urlArr.slice(1);
					 }else{
						 break;
					 }
				 }
				 urlGoStep = urlArr.join("###");
			}
		//专题频道
		} else if (url.indexOf("filmlist/indexForZhuan.action") > -1 || url.indexOf('filmlist/zhuanPage.action') > -1 || url.indexOf("filmlist/goPageForZhuan.action") > -1) {
			var u1 = urlArr[0];
			var u1Arr = tool.url2json(u1);
			var columnIndex1 = u1Arr.columnIndex;
			var columnIndex2 = urljson.columnIndex;
			var page1= u1Arr.page;
			var page2 = urljson.page;
			var step1= u1Arr.step, flag1 = step1==null || step1=='undefined' ?false:true;
			var step2= urljson.step,flag2 = step2==null || step2=='undefined' ?false:true;
			if((u1.indexOf("page=1")<0 && flag1==flag2) || ( columnIndex1!=columnIndex2 && columnIndex1!=1 && flag1==flag2) ||(columnIndex1==columnIndex2 && page1==page2 && flag1==flag2) ){
				urlArr = urlArr.slice(1);
				urlGoStep = urlArr.join("###");
			}
			if(page2 == 1){
				var urlArrcp = urlArr;
				if(url.indexOf("step=3")>-1){
					for(var i=0;i<urlArrcp.length;i++){
						 if(urlArrcp[i].indexOf("filmlist/indexForZhuan.action")  > -1  && urlArrcp[i].indexOf('step=3') > -1){
							 urlArr = urlArr.slice(1);
						 }else{
							 break;
						 }
					}
				}else{
					for(var i=0;i<urlArrcp.length;i++){
						 if(urlArrcp[i].indexOf("filmlist/indexForZhuan.action")  > -1  && urlArrcp[i].indexOf('step=3') < 0 ){
							 if(columnIndex2==1){
								 urlArr = urlArr.slice(1);
							 }else if(urlArrcp[i].indexOf('columnIndex=1')>-1){
								 break;
							 }
						 }else{
							 break;
						 }
					}
				}
				urlGoStep = urlArr.join("###");
			}
		//排行榜
		} else if (url.indexOf("channelHit/index.action") > -1) {
			//找到上次存储的结点直接把之前的全部删除
			urlArr = arrayByKeySlice(urlArr, /channelHit\/index.action/);
			urlGoStep = urlArr.join("###");
		//搜索页面
		} else if ( (url.indexOf("search/index.action") > -1 || url.indexOf("searching/index.action") > -1)
				&& !tool.urlParam(url, "jumpUrl")) {
			//找到上次存储的结点直接把之前的全部删除
			urlArr = arrayByKeySlice(urlArr, /search\/index.action|searching\/index.action/);
			urlGoStep = urlArr.join("###");
		//影片搜索ajax处理
		} else if(tool.urlParam(url, "direct")){
			urlArr = backSearchPage(urlArr,/direct=direct/);
			urlGoStep = urlArr.join("###");
			var jumpUrl = tool.urlParam(url, "jumpUrl");
			if (jumpUrl) {
				//全局对象定义base64在common.js文件底部
				jumpUrl = base64.decode(jumpUrl);
				if (jumpUrl.indexOf("hotWord/channel.action") > -1) {
					$("#contentListData").attr('url','../hotWord/channel.action?s=1a');
					$("#keyword").attr("sType","hotword");
				} else {
					$("#contentListData").attr('url','../search/search.action?');
					$("#keyword").attr("sType","keyword");
				}
				var keyword = decodeURIComponent(tool.urlParam(jumpUrl, "keyword"));
				var page = tool.urlParam(jumpUrl, "page") || tool.urlParam(jumpUrl, "pg");
				$("#keyword") && $("#keyword").html(keyword);
				$("#keyword") && $("#keyword").attr('jumpUrl',jumpUrl);
				$("#keyword") && $("#keyword").attr('field',tool.urlParam(jumpUrl, "field"));
				//回调完成后直接返回
				typeof goPage == "function" && goPage(page, true, "back");
				url = jumpUrl + "&jumpUrl=" + base64.encode(url.split("&jumpUrl=")[0]);
			}
		}else if (url.indexOf("hotWord/channel.action") > -1 || url.indexOf("search/search.action") > -1
				|| tool.urlParam(url, "jumpUrl")) {
			//找到上次存储的结点直接把之前的全部删除
			urlArr = arrayByKeySlice(urlArr, /(hotWord\/channel.action|search\/search.action)(?!.*direct=direct)/);
			urlArr = backSearchPage(urlArr,/direct=direct/);
			urlGoStep = urlArr.join("###");
			var jumpUrl = tool.urlParam(url, "jumpUrl");
			if (jumpUrl) {
				//全局对象定义base64在common.js文件底部
				jumpUrl = base64.decode(jumpUrl);
				if (jumpUrl.indexOf("hotWord/channel.action") > -1) {
					$("#contentListData").attr('url','../hotWord/channel.action?s=1a');
					$("#keyword").attr("sType","hotword");
				} else {
					$("#contentListData").attr('url','../search/search.action?');
					$("#keyword").attr("sType","keyword");
				}
				var keyword = decodeURIComponent(tool.urlParam(jumpUrl, "keyword"));
				var page = tool.urlParam(jumpUrl, "page") || tool.urlParam(jumpUrl, "pg");
				$("#keyword") && $("#keyword").html(keyword);
				$("#keyword") && $("#keyword").attr('jumpUrl',jumpUrl);
				//回调完成后直接返回
				typeof goPage == "function" && goPage(page, true, "back");
				return;
			} else {
				//直接追加
				url = url.replace(/\&ajax=ajax/, '');
				//全局对象定义base64在common.js文件底部
				if(tool.urlParam(urlArr[0], "direct")){
					url += "&jumpUrl=" + base64.encode(tool.project_domain()+"/search/index.action?mtype=0&page=1&pagesize=6&keywords=&currPage=film");
				}else{
					url += "&jumpUrl=" + base64.encode(urlArr[0]);
				}
			}
		//搜索检索
		} else if (url.indexOf("searching/indexValue.action") > -1 || url.indexOf("searching/search.action") > -1) {
			//把url进行替换成一样，这样能保持唯一性，利于下面的节点删除
			url = url.replace(/searching\/indexValue.action/, 'searching/search.action');
			//找到上次存储的结点直接把之前的全部删除
			urlArr = arrayByKeySlice(urlArr, /searching\/search.action/);
			urlGoStep = urlArr.join("###");
			//直接追加
			url = url.replace(/\&ajax=ajax/, '');
			//全局对象定义base64在common.js文件底部
			url += "&jumpUrl=searching&back=back";
		}
	}
	if (url.indexOf("search/index.action") > -1) {
		$("#contentList").show();
	}
	if (!!urlGoStep) {
		var urlArr = urlGoStep.split("###");
		if( tool.urlParam(urlArr[0], "ajax")=='ajax'){
			urlArr=urlArr.slice(1);
		}
		//普通频道、专题、检索页面
		var reg = /filmlist\/goPage.action|filmlist\/zhuanPage.action|filmlist\/goPageForZhuan.action|findRecordPage.action|findCollectPage.action|findOrderPage.action/;
		if (reg.test(url)) {
			//ajax请求转换成页面请求
			url = url.replace(/goPage.action/, 'index.action');
			url = url.replace(/zhuanPage.action/, 'indexForZhuan.action');
			url = url.replace(/goPageForZhuan.action/, 'indexForZhuan.action');
			url = url.replace(/findRecordPage.action/, 'findRecord.action');
			url = url.replace(/findCollectPage.action/, 'findCollectList.action');
			url = url.replace(/findOrderPage.action/, 'list.action');
			url = url.replace(/\&ajax=ajax/, '&back=back');
			//相对路径转换成绝对路径
			url = tool.getAbsoluteUrl(url);
		}
		var urlString = url + "###" + urlArr.join("###");
		BrowserStorage.api.set({
			"key" : "urlGoStep",
			"value" : urlString
		});
	} else {
		if(url.indexOf("index/index.action?page=1") > -1){
			BrowserStorage.api.set({
				"key" : "urlGoStep",
				"value" : url
			});
		}else{
			BrowserStorage.api.set({
				"key" : "urlGoStep",
				"value" : url + "###" + "../index/index.action?page=1"
			});
		}
	}

}

function getStrLen(c) {
    var a = 0;
    for (var b = 0; b < c.length; b++) {
        if (c.charCodeAt(b) > 255) {
            a += 2;
        } else {
            a++;
        }
    }
    return a;
}
function subStr(g, a) {
    var c = "";
    var e = getStrLen(g);
    if (a > e) {
        c = g;
    } else {
        var b = g.length;
        if (e == b) {
            c = g.substring(0, a);
        } else {
            if (e == b * 2) {
                c = g.substring(0, parseInt(a / 2));
            } else {
                g = g.substring(0, a);
                var f = g.split("");
                for (var d = 0; d < f.length, a > 0; d++) {
                    c += f[d];
                    if (g.charCodeAt(d) > 255) {
                        a -= 2;
                    } else {
                        a -= 1;
                    }
                }
            }
        }
    }
    return c;
}
//shimiao 翻页的时候焦点的在那个图片上
function changeFocus(id,count,data){
 	var x= $("#"+id).attr('currx');
   	var y=$("#"+id).attr('curry');
   	if(data.length<=count){
   	 	y=0;
   	 	if(x==0){
   	 		x=data.length<count?(data.length-1):(count-1);
   	 	}else{
   	 		x=0;
   	 	}
   	}else{
   		if(x==0 && y==1){
   			x=data.length%count==0?(count-1):(data.length%count-1);
   		}else if(x==0  && y==0){
   			x=data.length<count?(data.length-1):(count-1);
   		}else{
   			x=0;
   		}
   	}
   	ekey.currentContainer.set(x,y);
}
/**
 * 根据key截取数组，默认只保存一位
 * @param arr
 * @param pattern
 * @param times
 */
function arrayByKeySlice(arr, pattern, times) {
	if (arr.length <= 0) return;
	var counter = 0;
	times = times || 1;
	var length = arr.length;
	for (var i = length - 1; i >= 0; i--) {
		if (pattern.test(arr[i])) {
			counter++;
			if (times == 1) {
				return arr.slice(i+1);
			} else if (times > 1 && counter == times) {
				return arr.slice(i+1);
			}
		}
	}
	return arr;
}

/**
 * shimiao 20150106 添加url参数，容器id，xy坐标，最后的焦点位置
 * @param url
 */
function addUrl(url){
	if(BrowserStorage.api.get("urlGoStep").value!=null){
		var url1 = "";
		var objs = $(".epgcontainer");
		var ids =[];
		var xs =[];
		var ys=[];
		for(var i=0;i<objs.length;i++){ 
			ids.push(objs[i].id);
			xs.push(ekey.ckey[objs[i].id].getx());
			ys.push(ekey.ckey[objs[i].id].gety());
		}
		url1 += "&ids="+ids.join("|")+"&x="+xs.join("|")+"&y="+ys.join("|")+"&currId="+ekey.currentContainer.attr.id;
		var urls = BrowserStorage.api.get("urlGoStep").value.split("###");
		urls[0] = tool.url2json2delete2url(urls[0], "ids&x&y&currId")+url1;
		BrowserStorage.api.set({
			"key" : "urlGoStep",
			"value" : urls.join("###")
		});
	}else{
		//shimiao 20150122 只有首页面
		var url1 = "";
		var objs = $(".epgcontainer");
		var objs1 = $(".epgcontainerdelay");
		var ids =[];
		var xs =[];
		var ys=[];
		for(var i=0;i<objs.length;i++){ 
			ids.push(objs[i].id);
			xs.push(ekey.ckey[objs[i].id].getx());
			ys.push(ekey.ckey[objs[i].id].gety());
		}
		//首页面特殊的class类
		for(var i=0;i<objs1.length;i++){
			if(ekey.ckey[objs1[i].id]!=null && ekey.ckey[objs1[i].id] != undefined){
				ids.push(objs1[i].id);
				xs.push(ekey.ckey[objs1[i].id].getx());
				ys.push(ekey.ckey[objs1[i].id].gety());
			}
		}
		var currId ="";
		if(ekey.currentContainer.attr && ekey.currentContainer.attr != ""){
			currId = ekey.currentContainer.attr.id;
		}
		var firstShow =document.getElementById("oneDesktop").style.display != "none"?true:false;
		url1 += "&ids="+ids.join("|")+"&x="+xs.join("|")+"&y="+ys.join("|")+"&currId="+currId+"&downContent="+(RollContainer.downContent+"|"+$("#bottom_menu").attr("downcontent"))+'&firstShow='+firstShow;
		BrowserStorage.api.set({
			"key" : "indexParams",
			"value" : url1
		});
	}
	location.href=url;
}
/**
 * shimiao 20150106 id对应的坐标设置
 * @param url
 */
function setXYForDocument(url){
	url =  url || window.location.href;
   	if(url.indexOf("currId=")>-1){
   		var ids = $.urlParam(url,"ids").split("|");
   		var x = $.urlParam(url,"x").split("|");
   		var y= $.urlParam(url,"y").split("|");
   		for(var i=0;i<ids.length;i++){
   			if(ids[i]&&ids[i]!=""&&ids[i] !=="undefined"){
   				ekey.ckey[ids[i]].set(x[i],y[i]);
   			}
   		}
	   	var currId =  $.urlParam(url,"currId");
	   	if(window.location.href.indexOf("index/index.action")<0){
	   		$(".currentsa").attr("class","currents");
	   		$(".currenta").attr("class","current");
	   		$(".detail_link_wra").attr("class","detail_link_wr");
	   	}else{
	   		$("#box_nav .currenta").attr("class","current");
	   		$("#contentList .currenta").attr("class","current");
	   		$("#oneTwo .currenta").attr("class","current");
	   		$("#bottom_menu .currenta").attr("class","current");
	   	}
		if(currId && currId!=undefined &&currId !=="undefined"){
			ekey.ckey[currId].cFocus();
		}
		//shimiao 进去列表页面时，导航也要记住焦点设置
	 }else{
		 var epgcontainers = $(".epgcontainer");
		 for(var i= 0; i<epgcontainers.length;i++){
			 if(epgcontainers[i].id=='box_nav'){
				 var x = $("#box_nav .currents").attr("x");
				 var y = $("#box_nav .currents").attr("y");
				 ekey.ckey['box_nav'].set(x,y);
				 $("#box_nav .currentsa").attr('class','currents');
				 $("#box_nav .currenta").attr('class','current');
				 return;
			 }
		 }
	 }
}
/**
 * shimiao 20150108 跳转到搜索页面
 */
function jumpSearchPage(keyWord,field){
	var currUrl = tool.project_domain()+"/search/search.action?keyword="+keyWord+"&keywords="+keyWord+"&pg=1&limit=6&direct=direct&field="+field;
	var url = tool.project_domain()+"/search/index.action?mtype=0&page=1&pagesize=6&keywords=&currPage=film&direct=direct";
	backurl = url + "&jumpUrl=" + base64.encode(currUrl);
	pvajax("'kind':'"+pv.curKind+"','button':'keyword','keyword':'"+encodeURIComponent(keyWord)+"','type':'1'");
	addUrl(backurl);
}

function backSearchPage(arrUrl,p){
	var flag =false;
	for(var i=arrUrl.length-1;i>=0;i--){
		if(flag){
			return arrUrl.slice(i+1);
		}
		if(p.test(arrUrl[i])){
			flag = true;
		}
	}
	return arrUrl;
}
var pv = {
		curKind:'',
		channelCD:'',
};
//通过ajax 添加数据
function pvajax(suchType,currUrl){
	//暂时不使用
	return false;
	
	var hid = cookie.getCookie("hid");
	var oemid = cookie.getCookie("oemid");
	var ispid = cookie.getCookie("ispid");
	var epgid = cookie.getCookie("epgid");
	var ip = cookie.getCookie("ip");
	if(currUrl == undefined || currUrl == null || currUrl == ''){
		currUrl = window.location.href;
	}
	if(/..\//.test(currUrl)){
		var host = window.location.hostname ;
		var port = window.location.port; 
		currUrl = currUrl.replace("../","http://"+host+(port==''?'':(':'+port)));
	}
	var dataStr = "{\'updatetime\':\'"+(new Date()).getTime()+"\',\'hid\':\'"+hid+"\',\'oemid\':\'"+oemid+"\',\'uid\':\'0\',\'ispid\':\'"+ispid+"\',\'epgid\':\'"+epgid+"\',\'url\':\'"+encodeURIComponent(currUrl)+"\',"+suchType+",'usertype':'0'}";
	var base64  = new Base64();
	$.ajax({
		type:"GET",
		url:"../index/pvUrl.action?request="+base64.encode(dataStr)+"&userip="+ip,
	});
}

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

/**
 * 导演、主演关键字切割
 * @param directorInfo
 * @param actorInfo
 */
function keywordSplit(directorInfo, actorInfo) {
	directorInfo = directorInfo || '不详';
	actorInfo = actorInfo || '不详';
	//导演
	var pattern = /\||＼|\/|／|\s|\t|\、/g;
	var html_director_ul = '';
	var directorArr = directorInfo.split(pattern);  //按"|"切割字符串 
	for (var sub in directorArr) {
		if (directorArr.hasOwnProperty(sub)) {
			var dname = directorArr[sub];
			dname = dname.replace(/(^\s*)|(\s*$)/g, '');
			if (dname != '') {
				html_director_ul += "<li class='detail_name_li'><div class='detail_link_wr' oc='jumpSearchPage(\""+encodeURIComponent(dname)+"\",\"director\")'><a class='detail_name_in'>"+dname+"</a></div>|</li>";
			}
		}
	}
	document.getElementById("director_ul").innerHTML = html_director_ul.slice(0, -6) + "</li>";
	//主演
	var html_actors_ul = '<dt class="main_roll">';
	var actorArr = actorInfo.split(pattern);  //按"|"切割字符串 
	for (var sub in actorArr) {
		if (actorArr.hasOwnProperty(sub)) {
			var dname = actorArr[sub];
			dname = dname.replace(/(^\s*)|(\s*$)/g, '');
			if (dname != '') {
				html_actors_ul += "<li class='detail_name_li'><div class='detail_link_wr' oc='jumpSearchPage(\""+encodeURIComponent(dname)+"\",\"actor\")'><a class='detail_name_in'>"+dname+"</a></div>|</li>";
			}
		}
	}
	document.getElementById("actors_ul").innerHTML = html_actors_ul.slice(0, -6) + "</li></dt>";
}

/**
 * 封套跳转
 */
function loadHomePage(act, domain) {
	act = act == 'other' ? tool.url2json(domain)['act'] : act;
	prefix = domain || tool.project_domain();
	var url = tool.json2url({
		epg_info : encodeURIComponent(stbInfo.epg_info),
		act : act || 'index'
	}, prefix);
	window.location.href = url;
}

//页面加载时执行
//document.onreadystatechange = function() {
//	if (document.readyState == "complete") {

//基本上没有什么地方用window.onload事件，不过为了保险起见，还是加上判断
if (typeof window.onload != 'function') {
	//页面加载都完成后再解锁，不然容易死
	window.onload = function() {
		//机顶盒信息
		var window_name = JSON.parse(cookie.getCookie("window_name") || window.name);
		window.stbInfo = window_name["stbInfo"];
		
		//定义一个全局引用，使用的时候必须是utf-8的文件编码
		window.base64 = new Base64();
		//获取url
		var urlnew = window.location.href;
		goStep(urlnew);
		
		//如果为我的管理页面则选中当前频道
		var pattern = /\/(collect|record|message|childLock)\//;
		if (pattern.test(urlnew)) {
			var id = urlnew.match(pattern)[0].replace(/\//g, "");
			$("#"+id).attr("class", "currents");
		}
		
		//pv日志
		track && track.pv();
		
		//linux backkey 8
		keyMap.backKey = 8;
		ekey.setKey(8,goBack);
		//pc broswer esc key
		if (navigator.platform == "Win32") {
			keyMap.backKey = 27;
			ekey.setKey(27,goBack);
		}
		//ekey释放键盘
		ekey.isMonitor = true;
		
		//思华异步请求回调，只有来源为思华的referrer才需要解析
		var referrer = document.referrer;
		if (window.stbInfo && (referrer == "" || referrer.indexOf(stbInfo.authUrl.split("/")[2]) > -1)) {
			var json = tool.url2json(urlnew);
			//同时存在pid及result参数，证明是思华异步回调的url
			var pid = json.pid;
			var result = json.result;
			if (pid && result) {
				var obj = {
						result : json.result,
						vnetloginname : json.vnetloginname,
						token : json.token,
						verifycode : json.verifycode
				};
				var url = tool.json2url(obj, tool.project_domain() + "/auth/authCallback.action");
				playAuth.callbackOrder(url, pid, json.vnetloginname, json.pmid, json.pmname);
			} else {
				//首次鉴权，只有movieInfo及playAuth对象
				window.playAuth && window.movieInfo && playAuth.firstAuth(movieInfo);
			}
		} else {
			//首次鉴权，只有movieInfo及playAuth对象
			window.playAuth && window.movieInfo && playAuth.firstAuth(movieInfo);
		}
	};
}

/**
调用认证计费播放查询接口
肖军伟 更新于2015年5月22日16:26:32
*/
function playQuery(mInfo, sid, downUrl, hwUrl, zxUrl){
	if (mInfo) {
		hwUrl = typeof hwUrl != "undefined" ? hwUrl : mInfo.hwUrl;
		zxUrl = typeof zxUrl != "undefined" ? zxUrl : mInfo.zxUrl;
		var partner = stbInfo["partner"];
		var pUrl = partner == "HUAWEI" ? hwUrl : zxUrl;
		if (!pUrl) {
			alert("该节目正在维护中，请稍后观看！");
		} else {
			var fid = downUrl ? tool.urlParam(downUrl, "fid") : mInfo.fid;
			var oemid = stbInfo.oemid;
			var hid = stbInfo.hid.replace(/@iptv/, "") + "@iptv";//"chuangweics@iptv";//
			var uid = hid;
			var mid = mInfo.mid;
			//保存fid，后面要续播记录要用到
			mInfo.fid = fid;
			playAuth.playQuery(oemid, hid, uid, mid, sid, fid, mInfo);
		}
	} else {
		alert("获取影片信息失败！");
	}
}

//跳转到抽奖页面
function goLottery() {
	var url = tool.json2url({
		userAccount : cookie.getCookie("hid"),
		backurl : encodeURIComponent(window.location.href)
		}, tool.project_domain() + "/lottery/summer/index.html");
	//跳转到抽奖页
	window.location.href = url;
}


/**
 * 去魔兽活动页面
 */
function goActivity(){
	//判断时间，如果活动已结束，跳转到胜利页面
	var day = new Date().getDate();
	var month = new Date().getMonth();
	var boolean = day > 8 && day < 17
//	if(month == 8 && day > 8 && day < 17){
	if(boolean){
		window.location.href = tool.project_domain() + "/lottery/wow/wow.html?backurl="+encodeURIComponent(window.location.href);
	}else{
		window.location.href = tool.project_domain() + "/lottery/wow/wowWin.html?backurl="+encodeURIComponent(window.location.href);
	}
}
/**
 * 跳转双十一活动页面
 */
function goBoth11Activity(){
	var url = tool.json2url({
	userAccount : cookie.getCookie("hid"),
	backurl : encodeURIComponent(window.location.href)
	}, tool.project_domain() + "/lottery/both11/both11.html");
	//跳转到抽奖页
	window.location.href = url;
	}