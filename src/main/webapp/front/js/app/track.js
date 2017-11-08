/**
 * 统计汇报 
 * @version 3.4
 * @author zhouxuan
 * @time 2016-09-11
 */
var track = {
	//统计汇报url
	baseUrl:"http://113.136.206.7:8093/",
	//cpid
	cpid:10001000,
	//b2bspid
	b2bspid:20140425,
	//最后一次汇报的时间
    lastTime : 0,
	//当前是否可以执行心跳
    isStartHeartbeat:false,
	//是否是播放完或者开始播放
    playPointEnd:true,
    /**
	 * 页面访问汇报
	 * @param url 统计的url,不传则默认是取当前地址栏URL,拦截页传'Intercept',挽留页传'Stay'
	 * @param midlist 需要统计的midlist(格式:mid,mid,mid),如果不传则会自动抓取页面上元素带有的mid属性值,挽留页需要传此参数
     */
	pv:function(url,midlist) {
		var localUrl = url || window.location.href;
		var obj = tool.url2json(localUrl);
		var kind = $.urlParam(localUrl, "adpos")|| track.getKind(localUrl);
		var channel = obj["column"] || "";
		var page = $("#showPageIndex").html() || $("#var_play").attr('pageIndex') ||$("#contentListData").attr('pageIndex')||$("#contentList").attr('pageIndex')||obj["page"]|| obj["pg"] || 1;
		var mid = obj["filmmid"] || obj["mid"] || "";
		var aid ="";
		//延迟*秒发送，让界面多加载一会儿，解决精彩推荐的统计问题
		var time=0;
		if(localUrl.indexOf("filmInfo/sourceUrl.action")!=-1||localUrl.indexOf("filmInfo/mid.action")!=-1||localUrl.indexOf("search/hotSearch.action")!=-1){
			time=2000;
		}
		window.setTimeout(function(){
			if(!midlist){
				midlist  = track.getMIDList(kind);
			}
			var param = {type:1,kind: kind, channel: channel, page: page, mid: mid,aid:aid,midlist:midlist};
			track.sendData(param);
		},time); 
	},
	/**
	 * 点播鉴权汇报，加在鉴权之后，自动播放下一集后也需要进行统计
	 * 如果不方便拿到一些特定的参数（价格，播放类型等）可以选择存在cookie中，然后调用此方法时从cookie中取
	 * @param mInfo 如果是起播则是播放信息 如果是播放结束则是false
	 * @param usertype 0：免费播放 1：单点付费播放 2：包时段播放
	 * @param price 为单点价格（如果只有包月包年或免费则填0）
	 * @param isadplay 标志本次播放场景：0:正片播放;1:广告播放
	 * @param isad 正片播放时是否带广告 0：不带广告；1：带广告
	 * @param adext 当前广告系统一个adtext会话字段,广告接口返回的xml内容
	 */
	playPoint:function(mInfo,usertype,price,isadplay,isad,adext) {
		//防止多次汇报统计 zhouxuan 2016-7-26
		if(track.playPointEnd==false && mInfo){
			return;
		}
		if(mInfo){
			track.playPointEnd=false;
		}else{
			track.playPointEnd=true;
			track.isStartHeartbeat=false;
			return;
		}
		var sessionID=track.getCreateSessionID();
		var starttime=mInfo.starttime;
		if(window.sessionID!=null){
			starttime=parseInt(sctelPlay.getCurrentPlayTime(), 10);
		}
		window.sessionID=sessionID;
		/*var playsource=track.getKind(document.referrer);
		if(playsource.indexOf("detail") > -1){
			//上上个页面的url地址需要传到此页面，可修改loadplayer.js的play:function()方法来传参【psource : encodeURIComponent(document.referrer)】
			var psource = decodeURIComponent($.urlParam(window.location.href, "psource"));
			playsource = $.urlParam(document.referrer, "column")||track.getKind(psource);
		}*/
		//直接获取来源
		var playsource = tool.query("psource") || "detail";
		//封套首页入口（index.html）需要将adpos放入cookie
		var playsource3party=cookie.getCookie("adpos");
		var sourcetype="0";
		var midsource="0";
		var startpos=track.formatDate(starttime);
		var playready=0;
		var param = {type:2, sessionID:sessionID,playsource:playsource,playsource3party:playsource3party,sourcetype:sourcetype,Series:mInfo.sid,mid:mInfo.mid,aid:"",fid:mInfo.fid,cpid:track.cpid,midsource:midsource,mname:"",mtype:mInfo.mtype,startpos:startpos,usertype:usertype,price:price,playready:playready,isadplay:isadplay,isad:isad,adext:adext};
		track.sendData(param,function(){
			//立即统计下心跳
			track.lastTime=0;
			track.playHeartbeat(starttime);
			track.isStartHeartbeat=true;
		});
	},
	/**
	 * 心跳汇报
	 * @param playpos 播放到的时间点
	 */
	playHeartbeat:function(playpos){
		if(track.isStartHeartbeat&&window.sessionID){
			var t=new Date().getTime();
			if(t-track.lastTime>=1000*60){//大于等于需要等待的时间就进行汇报
				track.lastTime=t;
				var param = {type:3,sessionID:window.sessionID,playpos:track.formatDate(playpos)};
				track.sendData(param);
			}
		}
	},
	/**
	 * 订购行为日志汇报
	 * @param pid 产品包id
	 * @param isSuccess 是否订购成功
	 * @param mid 影片id
	 * @param price 产品包价格
	 * @param subscription 0不自动续订；1自动续订
	 */
	orderSuccess:function(pid, isSuccess, mid, price,subscription) {
		var param = {type:4,pid:pid,result:isSuccess,mid:mid,price:price,subscription:subscription};
		track.sendData(param);
	},
	/**
	 * 续订状态修改日志汇报
	 * @param pid 产品包id
	 * @param isSuccess 是否订购成功
	 * @param subscription 0不自动续订；1自动续订
	 */
	orderChange:function(pid, isSuccess,subscription) {
		var param = {type:5,pid:pid,result:isSuccess,subscription:subscription};
		track.sendData(param);
	},
	/**
	 * 格式时间
	 * @param time 时间
	 * @returns 时间
	 */
	formatDate:function(time) {
		return (new Date(0, 0, 0, 0, 0, time)).toTimeString().split(" ")[0];
	},
	/**
	 * 获得mid集合
	 * @returns mid集合
	 */
	getMIDList:function(kind) {
		if(kind=="Intercept"){//拦截页不汇报mid
			return "";
		}
	    var tmpmidlist = [];
	    $("*[mid]").each
		(
			function()
			{
				var values = $(this).attr("mid");
	            values && tmpmidlist.push(values);
			}
		);
	    return tmpmidlist.join(",");
	},
	/**
	 * 获得kind
	 * @param localUrl
	 * @returns kind
	 */
	getKind:function(localUrl){
		var kinds = {
			index : "index",//首页
			filmlist : "list",//列表页
			filmInfo : "detail",//详情页
			collect : "favorite",//收藏记录
			record : "WatchRecord",//观看记录
			message : "Message",//系统通知
			channelHit : "rank",//排行榜
			search : "search",//搜索页
			hotWord : "search",//搜索页
			searching : "Screening"//条件检索页
		};
		var kind = "";
		if (localUrl.indexOf("indexForZhuan.action") > -1 && localUrl.indexOf("step=3") == -1) {//专题列表页
			kind = "topic_list";
		}else if(localUrl.indexOf("indexForZhuan.action") > -1 && localUrl.indexOf("step=3") > -1){//专题详情页
			kind = "topic_detail";
		}else if((localUrl.indexOf("mtype=7") > -1 || localUrl.indexOf("mtype=9") > -1) && localUrl.indexOf("filmlist/index.action") > -1){//综艺生活类列表页
			kind = "variety_list";
		}else if((localUrl.indexOf("mtype=7") > -1 || localUrl.indexOf("mtype=9") > -1) && localUrl.indexOf("filmInfo/sourceUrl.action") > -1){//综艺生活类详情页
			kind = "variety_detail";
		}else if(localUrl.indexOf("Stay") > -1){//挽留页面
			kind = "Stay";
		}else if(localUrl.indexOf("Intercept") > -1){//拦截页
			kind = "Intercept";
		}else if(localUrl.indexOf("Launcher") > -1){//桌面入口
			kind = "Launcher";
		}else {
			var pattern = /\/(index|filmlist|filmInfo|collect|record|message|channelHit|search|hotWord|searching)\//;
			var mt=localUrl.match(pattern);
			if(mt){
				var key = mt[0].replace(/\//g, "");
				kind = kinds[key];
			}else{
				kind="other";
			}
		}
		return kind;
	},
	/**
	 * 获取sessionID
	 * @returns sessionID
	 */
	getCreateSessionID:function() {
        var s = new Date().getTime() +""+ Math.random()+""+ Math.random();
        if(s.length>32){
        	return s.substring(0, 32);
        }else{
        	return s;
        }
    },
    /**
     * jsonp请求
     * @param url 请求url
     * @param fn 回调函数
     */
    jsonp:function(url, fn) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn instanceof Function && fn.call();
                    script.parentNode.removeChild(script);
                }
            };
        }
        else {
            script.onload = function () {
                fn instanceof Function && fn.call();
                script.parentNode.removeChild(script);
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    /**
	 * 发送数据进行汇报
	 * @param param 参数值
	 * @param fun 回调方法
	 */
	sendData:function(param, fun) {
		var window_name = cookie.getCookie("window_name");
		var stbInfo = JSON.parse(window_name)["stbInfo"];
		//动态创建回调方法
		var callBackFunName="callBackFun"+Math.round(Math.random()*100000000);
		window[callBackFunName] = function(msg) {
			//console.log(msg);
		};
		var publicParam = {
			version:"3.4",
			hid : stbInfo["hid"],
			oemid : stbInfo["oemid"],
			uid : stbInfo["hid"],
			b2bspid : track.b2bspid,
			epgid : stbInfo["epgid"],
			debug : 1,
			apptype:3,
			callback:callBackFunName
		};
		
		param=concatJson(publicParam, param);
		var url=track.baseUrl;
		if(param.type==1){
			url+="pvlog-web-3.do?";
			delete param["type"];
		}else if(param.type==2){
			url+="vodlog-web-3.do?";
			delete param["type"];
		}else if(param.type==3){
			url+="vodalivelog-web-3.do?";
			delete param["type"];
		}else{
			url = tool.project_domain() + "/log/statLog.action?";
		}
		for (var key in param) {
			url+=key+"="+param[key]+"&";
        }
		url=url.substring(0, url.length-1);
		console.log(url);
        track.jsonp(url, fun);
	}
};
