var loadplayer = {
	time:0,
	mInfo:null,
	s:null,
	goPlayer:function(mInfo, s) {
		Epg.loading.show();
		loadplayer.mInfo = mInfo;
		loadplayer.s = s;
		loadplayer.time = 0;
//		debug(s);

        loadplayer.readMovieTime(function(time, fun) {
            loadplayer.time = time;
            Epg.loading.hide();
//            debug("time ====>>> " + time);
            
            if (time > 0) {
                dialog.show(
                	"您上次已观看到 "+loadplayer.formatDate(time),
                	[{icon:"继续播放",type:"1"},{icon:"重新播放",type:"2"},{icon:"取消播放",type:"0"}],
                	function(type) {
                		switch (type) {
	                		case "0":
	                			fun && fun.call(this);
	                			break;
	                		case "1":
	                			loadplayer.shoot();
	                			break;
	                		case "2":
	                			loadplayer.replay();
	                			break;
                		}
                	}
                );
            } else {
                loadplayer.play();
            }
        });
	},
	//重新播放
	replay:function() {
		ekey.isMonitor = false;
		loadplayer.time = 0;
		loadplayer.play();
	},
	//续播
	shoot:function() {
		ekey.isMonitor = false;
		loadplayer.play();
	},
	
	play:function() {
		Epg.loading.show();
		var sid = loadplayer.s, time = loadplayer.time, m = loadplayer.mInfo;
		var urlParam = {
			mid : m.mid,
			sid : sid,
			pagesize : m.contentCount || sid,
			starttime : time,
			//如果是4k的就免费
			isfree : stbInfo.act == '4k' ? 1 : 0,
			//用于获取播放源
			psource : window.track && track.getKind(document.referrer) || "detail"
		};
		var url = tool.json2url(urlParam, "../jump/player.action");
		window.location.href = url;
	},
	
	formatDate:function(time) {
		return (new Date(0, 0, 0, 0, 0, time)).toTimeString().split(" ")[0];
	},
	canGoPlayer:function() {
		if (typeof Authentication !="undefined" && Authentication.CTCGetConfig) {
			//软件版本号
			var stbVersion = Authentication.CTCGetConfig("STBVersion");
			//硬件版本号
			var stbType  = Authentication.CTCGetConfig("STBType");
			//$("#kkk").html("软件版本号:" + stbVersion+" 硬件版本号："+ stbType);
			return loadplayer.inHUAWEI(stbType, stbVersion) || loadplayer.inOrther(stbType, stbVersion);
		}
		return false;
	},
	//读取播放时间
	readMovieTime:function(fun) {
		var m = loadplayer.mInfo;
		//使用绝对地址
		var prefixUrl = tool.project_domain() + '/filmInfo/resume.action';
		var param = {
			mid : m.mid,
			fid : m.fid,
			title : encodeURIComponent(encodeURIComponent(m.m_name)),
			datetime : +(new Date()),
			ctype : 2,
			sid : loadplayer.s,
			totalsid : m.contentCount || 1,
			version : '3.0'
		};
		var url = tool.json2url(param, prefixUrl);
//		debug('read: ' + url);
		$.ajax({
			type: 'get',
			url: url,
			dataType : 'json',
			async: true,
			context: this,
			success: function(e) {
				var data = eval('('+e+')'), pt = 0;
				if (data.result == 0) {
					if (typeof data.retry == 'undefined') {
						pt = parseInt(data.error);
					}
					fun(pt);
				}  else {
					fun(pt);
				}
			},
			error: function() {
				fun(0);
			}
		});
	},
	
	inHUAWEI:function(stbType, stbVersion) {
		
		//判断是否满足华为软件版本号的正则表达式
		var hwSTBVersionParttern    = /^(9587|9372|4384|4769|6201|5105|7095|7179|7192|8172|8667)\.[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}$/ig;
		//华为硬件版本号
		var hwSTBVersion = ['2106V1H_pub', 'EC2106V1H_pub', 'EC2108V3H_dj','EC2108V3H_pub','EC2108V3H_hotel','EC2108H_dj','EC2108H_pub','EC2108H_hotel','EC2108G_dj','EC2108G_hotel','EC2108G_pub','EC5108','EC5108_dj','EC5108_hotel','EC2106V1B_pub','Z118_pub','Z118_dj','Z118_hotel','Z113_pub','Z113_dj','Z113_hotel'];
		if (loadplayer.isInArray(stbType, hwSTBVersion)) {
			return hwSTBVersionParttern.test(stbVersion);
		}
		return false;
		
	},
	
	inOrther:function(stbType, stbVersion) {
		//白名单中其他厂商软件版本号
		var STBVersion = ['HSV140315P0002','FHV140104P0303','KTV100001P0001','KTV200001P0001','HSV140315P0002','V70433085','CWV000100P0001','V72760105','SC-CTC-1.0.0','V72811135', 'RP0103-1401070830', 'RP0102-1309051630','V70433076','V70433071','V71733070','86501009','KSC.I03.06H','KSC.I13.12H','CHI619007','CHI628001A','CHI628002_1A','DL0001','MP606H-B(57T1)_001','86148107','V100R003C03LSCDa1T','V100R003C10LSCDu1', 'ITV618HD'];
		return loadplayer.isInArray(stbVersion, STBVersion);
	},
	//
	isInArray:function(str, array) {
		for(var i in array) {
			if (array[i] == str) {
				return true;
			}
		}
		return false;
	}
};