//自动延时函数
var setTimeOutfun = new (function() {
	this.clear = function(fun) {
		if (fun.timeId) {
			var timeId =  fun.timeId; 
			window.clearTimeout(timeId);
			delete fun.timeId;
		}
	};
	this.done = function(fun) {
		window.clearTimeout(fun.timeId);
		fun && fun();
		delete fun.timeId;
	};
	
	this.timeOut = function(fun, delay) {
		fun.timeId && window.clearTimeout(fun.timeId);
		this.setTimeOut(fun, delay);
	};
	
	this.setTimeOut = function(fun, delay) {
		var current = this;
		fun.timeId  = window.setTimeout(function() {
			current.done(fun);
		}, delay);
	};
})(),
playerController = new (function(scplayer){
	var player = scplayer, 
	current = this;
	this.sTime = 0; //开始时间
	this.cTime = 0;
	this.mInfo = null; //影片信息
	this.isFreePlay = false; //是否免费播放
	this.isOrder = false; //是否已经订购过
	this.isMustOrder = false; //是否需要打开订购层
	this.freeTime = 300;
	this.showOrder = $.noop;
	this.playerCanController = true; //播放器是否可以被控制
	this.isStartPlay = false; //是否开始播放了
	this.isSelectTime = false;// 是否正在选时
	this.canFast = true;
	this.formatDate = function(time) {
		return (new Date(0, 0, 0, 0, 0, time)).toTimeString().split(" ")[0];
	},
	
	this.setDisplayController = function(isShow) {
		var c = $("#playercontroller"), container = epgKeyManage.KeyE["#progress_show"];
		isShow ? c.show() : c.hide();
		isShow ? cacheContainer.setContainer(container) :  cacheContainer.closeContainer(container);
	},
	
	this.hideController = $.proxy(function(){
		//老版4.0遗留bug，快进、快退的时候显示即可
		//播放的时候连续输入两次时间跳转后，光标停留在不是确实按纽上播放菜单出不来的情况
			//隐藏的时候要恢复到正常状态
			playerController.isSelectTime = false;
			this.setDisplayController(false);
	}, this);
	
	this.showController = $.proxy(function(){
			this.setDisplayController(true);
	}, this);
	
	this.setPlayerWidget = $.proxy(function() {
		this.setTime(0);
		this.setProgress(this.sTime, this.cTime);
		this.setvolumeprogress();
		this.monitorFreeTime();
		//检查跳过片头片尾
		this.checkSkipMoveEnd();
		//心跳汇报
		track.playHeartbeat(parseInt(player.getCurrentPlayTime(), 10));
	}, this);
	//监听免费时段
	this.monitorFreeTime = $.proxy(function() {
		var time =  parseInt(player.getCurrentPlayTime(), 10);
		if (!this.isFreePlay && this.freeTime <= time) {
			setTimeOutfun.clear(this.hideOrderLayer, 5000);
			this.showOrder(); //显示订购层
			this.showOrder = $.noop;
		}
	}, this);

	this.setvolumeprogress = function() {
		var volume = player.getAttr("getVolume"), isMuteFlag = player.getAttr("getMuteFlag");
		$("#horn").get(0).setAttribute("class", isMuteFlag == 1 ? "horn2" : "horn");
		$("#sound_boxvalue").get(0).setAttribute("style",  "width:"+volume+"%");
	};

	this.setProgress = function(sTime, cTime) {
		$("#curve").get(0).setAttribute("style", "width:"+(sTime/cTime*100)+"%");
		$("#startTime").html(this.formatDate(sTime));
		$("#endTime").html(this.formatDate(cTime));
		
	};
	
	//设置快进时间 由于快进或快退的时候时间是预先计算出来的
	this.setTime= function(n) {
		var status = player.PLAYSTAT;
		if (status != HBSTAT.FORWARD && status != HBSTAT.REWIND) {
			this.sTime = parseInt(player.getCurrentPlayTime(), 10);
			this.cTime = parseInt(player.getMediaDuration(), 10);
		}
		var tmp = this.sTime;
		this.sTime += n * 60;
		if (this.sTime < 0 || (this.sTime> this.cTime)) {
			this.sTime = tmp;
			setTimeOutfun.clear(this.setSelectTime, 1000);
			this.setPlayerStatus(HBSTAT.PLAERED);
		}
	};
	//设置选时时间
	this.setSelectTime = $.proxy(function() {
		if (this.sTime > 0 && this.sTime < this.cTime) { 
			player.seekFast(this.sTime);
		}
		
	}, this);
	//设置播放器的状态
	this.setPlayerStatus = function(status) {
		player.setPlayerStatus(status);
		
	};
	//设置快进 /或者快退
	this.setFast = function(n) {
		if (!this.canFast) return ;

		this.setTime(n ? 1 : -1);
		
		this.setPlayerStatus(n ? HBSTAT.FORWARD : HBSTAT.REWIND);
		setTimeOutfun.timeOut(this.setSelectTime, 1000);
	};
	function getZTEPlayerUrl(callback, innerId, errorUrl, count) {
		var str = null;
		//如果加载100次还是没加载过来，则证明播放串一定是获取不了啦，这时候就可以跳转到第三方页面，以显示不能播放的原因
		/*if (count >= 100) {
			var iframe = document.getElementById("if_smallscreen1");
			//如果页面存在内容，就证明已经加载完成
			if (iframe && iframe.contentWindow.document.body.innerHTML) {
				var html = iframe.contentWindow.document.body.innerHTML;
				if (html.indexOf("mediaUrl") == -1) {
					//直接跳转到对方平台，提示错误信息
					window.location.href = errorUrl;
					return;
				}
			}
		}*/
		if (window.frames["if_smallscreen1"].getMediastr) {
			str = window.frames["if_smallscreen1"].getMediastr(innerId);
		}
		if (str) {
			str = eval(str);
			str = str[0]["mediaUrl"];
			window.frames["if_smallscreen1"].location.href = "about:blank";
			setTimeOutfun.timeOut(function() {
				callback && callback(str);
			}, 2000);
			
		} else {
			//如果超过100次，则允许跳转到对方页面
			count = ++count || 0;
			var fun = arguments.callee;
			setTimeOutfun.timeOut(function() {
				fun.call(this, callback, innerId, errorUrl, count);
			}, 100);
		}
		
//		var str = null;
//		if (window.frames["if_smallscreen1"].getMediastr) {
//			str = window.frames["if_smallscreen1"].getMediastr(innerId);
//		}
//		if (str) {
//			str = eval(str);
//			str = str[0]["mediaUrl"];
//			window.frames["if_smallscreen1"].location.href = "about:blank";
//			setTimeOutfun.timeOut(function() {
//				callback && callback(str);
//			}, 2000);
//		} else {
//			var fun = arguments.callee;
//			setTimeOutfun.timeOut(function() {
//				fun.call(this, callback, innerId, errorUrl);
//			}, 100);
//		}
	}

	function startGetzteUrl(fun) {
		var innerId = current.mInfo.zxUrl;
		var epgdomain = Authentication.CTCGetConfig("EPGDomain");
		var last = epgdomain.lastIndexOf("/");
		var host = epgdomain.substr(0, last);
		//小窗播放
		var url = host + "/MediaService/SmallScreen?ContentID=" + innerId + "&Left=0&Top=0&Width=0&Height=0&CycleFlag=0&GetCntFlag=1";
		window.frames["if_smallscreen1"].location.href = url;
		//如果出错的话，则需要用到这个接口，去提示错误，参提高用户体验
		var errorUrl = host + "/MediaService/FullScreen?ContentID="+ innerId + "&ReturnURL=" + encodeURIComponent(document.referrer);
		getZTEPlayerUrl(fun, innerId, errorUrl);
	}
	//获取华为播放地址
	function getHWURL(fun) {
		var innerId = current.mInfo.hwUrl;
		var epgdomain = Authentication.CTCGetConfig("EPGDomain");
		var last = epgdomain.indexOf("/EPG");
		var host = epgdomain.substr(0, last);
		var url = host + "/EPG/MediaService/FullScreen.jsp?ContentID="+ innerId + "&ReturnURL=" + encodeURIComponent(document.referrer);
		var appname = navigator.appName;
		//如果出错的话，则需要用到这个接口，去提示错误，参提高用户体验
		var json = {
			vas_action : "fullscreen",
			mediacode : innerId,
			mediatype : "VOD",
			vas_back_url : document.referrer
		};
		var vas_info = json2xml(json);
		var errorUrl = host + "/EPG/jsp/default/en/VasToMem.jsp?vas_info=" + encodeURIComponent(vas_info);
		if (/Ranger/.test(appname)) {
			$.ajax({
				type : "POST",
				url : url,
				dataType : "json",
				beforeSend : function(xhr) {
					xhr.setRequestHeader("X-Request-With", null);
				},
				success : function(result) {
					debug(result);
				},
				error : function(result) {
					//获取播放串进行播放
					var text = result.responseText;
					eval(text.match(/var playUrl = ".*";/)[0]);
					if (playUrl) {
						fun && fun(playUrl);
					} else {
						window.location.href = errorUrl;
					}
				}
			});
		} else {
			//其它方式播放
			url = host + "/EPG/MediaService/SmallScreen.jsp?ContentID=" + innerId + "&Left=0&Top=0&Width=0&Height=0&CycleFlag=0&GetCntFlag=1";
			window.frames["if_smallscreen1"].location.href = url;
			getZTEPlayerUrl(fun, innerId, errorUrl);
		
		
//			var innerId = current.mInfo.hwUrl;
//			//全屏是否第三方页面播放
//			var isThirdPage = false;
//			var json = {
//				vas_action : "fullscreen",
//				mediacode : innerId,
//				mediatype : "VOD",
//				vas_back_url : document.referrer
//			};
//			var vas_info = json2xml(json);
//			var epgdomain = Authentication.CTCGetConfig("EPGDomain");
//			var host = epgdomain.split("/")[2];
//			var url = "http://" + host + "/EPG/jsp/default/en/VasToMem.jsp?vas_info=" + encodeURIComponent(vas_info);
//			if (isThirdPage) {
//				window.location.href = url;
//			} else {
//				window.frames["if_smallscreen1"].location.href = url;
//				getHWPlayerUrl(fun);
//			}
		}
	}
	
	//json对象转化成xml
	function json2xml(obj) {
		var xml = "";
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				xml += "<" + key + ">" + obj[key] + "</" + key + ">";
			}
		}
		return xml;
	}

	function getHWPlayerUrl(callback) {
		var str = null;
		if (window.frames["if_smallscreen1"].playUrl) {
			str = window.frames["if_smallscreen1"].playUrl;
		}
		if (str) {
			window.frames["if_smallscreen1"].location.href = "about:blank";
			setTimeOutfun.timeOut(function() {
				callback && callback(str);
			}, 2000);

		} else {
			var fun = arguments.callee;
			setTimeOutfun.timeOut(function() {
				fun.call(this, callback);
			}, 100);
		}
	}
	
    this.startPlayer = $.proxy(function(str) {
        var startTime = this.startTime;
        startTime = parseInt(startTime) > 0 ? startTime : this.getCurrentPlayStartTime(this.mInfo.sid);
        player.play(str, startTime);
    }, current);

    this.play = function(isFreePlay, mInfo, startTime, type, jsonInfo) {
        this.mInfo = mInfo;
        this.jsonInfo = jsonInfo;
        this.isStartPlay = false;
        this.isFreePlay = isFreePlay;
        this.partnerType = type;
        this.startTime = startTime;
        if (type == "HUAWEI") {
            return getHWURL(this.startPlayer);
        } else if (type == "ZTE") {
            return startGetzteUrl(this.startPlayer);
        }
    };

    this.getCurrentPlayStartTime = function(sid) {
        for(var i = 0, L = this.jsonInfo.length; i < L; i++) {
            var tmpInfo = this.jsonInfo[i];
            if (tmpInfo.ContentIndex == sid) {
                return tool.empty(tmpInfo.PlayStartTime) ? 0 : tmpInfo.PlayStartTime;
            }
        }
        return 0;
    };
	this.showpauseAD = function(isShow) {
		var el = $("#pausead"), container = epgKeyManage.KeyE["#pauseBtnGrp"];
		isShow ? el.show() : el.hide();
		isShow ? cacheContainer.setContainer(container) :  cacheContainer.closeContainer(container);
		//this.playerCanController = !isShow;
		this.canFast = !isShow && !this.isMustOrder;
	};
	//实在loading是否显示
	this.setLoadingDisplay = function(isShow) {
		var c = $("#loading");
		isShow ? c.show() : c.hide();
	};
	//真正的暂停
	this.pause = function() {
		player.PLAYSTAT != HBSTAT.PAUSE &&  player.pause();
	};
	//手动打开订购层
	this.handOpenOrder = function() {
		this.delayOpenOrder();
	};
	
	this.delayOpenOrder = function() {
		setTimeOutfun.clear(this.hideOrderLayer, 5000);
		setTimeOutfun.clear(this.setSelectTime, 1000);
		setTimeOutfun.timeOut(this._openOrder, 500);
	};
	//播放器自动打开的订购
	//延时打开订购层
	this.openOrder  = function() {
		this.isMustOrder = true;
		this.delayOpenOrder();
	};
	
	//显示订购层
	this._openOrder = $.proxy(function () {
		if (scplayer.PLAYSTAT != HBSTAT.PAUSE) {
			scplayer.PLAYSTAT = HBSTAT.PAUSE;
			player.truePause();
		}
		this.showpauseAD(false);
		this.orderLayer(false);
		this.hideController();
		this.playerCanController = false;
		playerOrderList.show(this.orderBackSuccess, this.orderBackFailure);
	}, this);
	//是否显示订购的 提示
	this.orderLayer = function(isShow) {
		var el = $("#free_watch") , container = epgKeyManage.KeyE["#free_watch"];
		isShow ? el.show() : el.hide();
		isShow ? cacheContainer.setContainer(container) :  cacheContainer.closeContainer(container);
		this.playerCanController = !isShow;
	};
	this.hideOrderLayer = $.proxy(function() {
		this.orderLayer(false);
	}, this);
	
	this.showOrderLayer = $.proxy(function() {
		this.orderLayer(true);
	}, this);
	//显示影片信息
	this.isShowMovieInfoLayer = function(isShow) {
		var el = $("#movie_intro");
		isShow ? el.show() : el.hide();
	};
	this.showMovieInfo = function() {
		this.isShowMovieInfoLayer(true);
		setTimeOutfun.timeOut(function() {
			current.isShowMovieInfoLayer(false);
			current.startAuthMovie();
		}, 3000);
	};

	//订购成功返回
	this.orderBackSuccess = $.proxy(function() {
		sendAuth.setOrderAuthed(this.mInfo.InnerId, this.orderAuthBack);
	}, this);
	//订购失败
	this.orderBackFailure = $.proxy(function() {
		this.hideStopTip();
		if (this.isMustOrder) { //如果免费播放时段结束直接显示订购列表
			this.showOrderLayer();
		} else {
			player.resume();
		}
		this.playerCanController = true;
	}, this);
	//订购后鉴权返回
	this.orderAuthBack = $.proxy(function(v) {
		//处理鉴权结果
		window.isAuthResult = v;
		this.isOrder = v == HWSTATUS.ORDERSUCCESS;
		this.hideStopTip();
		setTimeOutfun.clear(this.hideOrderLayer, 5000);
		this.orderLayer(!this.isOrder);
		if (this.isOrder) { //如果订购成功释放播放器控制
			this.isMustOrder = false;
			this.playerCanController = true;
			this.showOrder = $.noop;
			player.resume();
		} else {
			if ( v != "8") {
				this.orderLayer(this.isOrder);
				this.isMustOrder = true;
				this.showOrder = $.noop;
				if (player.PLAYSTAT != HBSTAT.PAUSE) {
					player.truePause();
				}
				playerOrderList.tip("网络繁忙，请重试一次，按返回键返回到上一级菜单。", $.noop, 0);
			} else {
			if (!this.isMustOrder) {//如果还没到必须购买的时候用户已经选择订购了，但是没有订购上
				this.playerCanController = true;
				player.resume();
			}
				this.showOrder = this.openOrder;
			}
		}
	}, this);
	//第一次进来进行鉴权返回处理
	this.startAuthBack = $.proxy(function(v) {
		//处理鉴权结果
		window.isAuthResult = v;
		this.hideStopTip();
		this.isOrder = v == HWSTATUS.ORDERSUCCESS;
		this.orderLayer(!this.isOrder);
		if (!this.isOrder) { //如果还在免费播放时间段 就自动关闭订购提示
			if (v == "8") {
				this.playerCanController = true;
				setTimeOutfun.timeOut(this.hideOrderLayer, 5000);
				this.showOrder = this.openOrder;
				player.resume();
			} else {
				this.orderLayer(this.isOrder);
				this.isMustOrder = true;
				this.showOrder = $.noop;
				if (player.PLAYSTAT != HBSTAT.PAUSE) {
					player.truePause();
				}
				playerOrderList.tip("网络繁忙，请重试一次，按返回键返回到上一级菜单。", $.noop, 0);
			}
		}
	}, this);
    this.jsonInfo = [];
    this._canPlayerNext = $.proxy(function() {
        this.isNext = false;
        var tmpInfo = this.tmpInfo;
        this.mInfo.hwUrl = tmpInfo.hwUrl;
        this.mInfo.zxUrl = tmpInfo.zxUrl;
        this.mInfo.sid = tmpInfo.ContentIndex;
        this.mInfo.fid = tool.urlParam(tmpInfo.DownUrl, "fid");
        this.mInfo.contentName = tmpInfo.ContentName;
        this.mInfo.PlayStartTime = tool.empty(tmpInfo.PlayStartTime) ? 0 : tmpInfo.PlayStartTime;
        this.mInfo.PlayStopTime = tool.empty(tmpInfo.PlayStopTime) ? 0 : tmpInfo.PlayStopTime;
        this.readMovieTime();
        this.play(this.isFreePlay, this.mInfo, tool.empty(tmpInfo.PlayStartTime) ? 0 : tmpInfo.PlayStartTime, pageInfo.partner, this.jsonInfo);
    }, this);
    this.tmpInfo = null;
    this.isNext = false;
    this.canPlayerNext = function() {
        if (this.mInfo.type == 1) {
            if (!this.isNext) {
                var sid = parseInt(this.mInfo.sid, 10) + 1;
                for(var i = 0, L = this.jsonInfo.length; i < L; i++) {
                    var tmpInfo = this.jsonInfo[i];
                    if (tmpInfo.ContentIndex == sid) {
                        this.tmpInfo = tmpInfo;
                        this.isNext = true;
                        setTimeOutfun.timeOut(this._canPlayerNext, 2000);
                        break;
                    }
                }
            } else {
                setTimeOutfun.timeOut(this._canPlayerNext, 2000);
            }
            return this.isNext;
        }
        return false;
    };
	//鉴权是否可以播放
	this.startAuthMovie = function () {
		if (!this.isFreePlay) { //如果是免费的就不执行鉴权
			sendAuth.setOrderAuthed(this.mInfo.otherInnerId, this.startAuthBack);
		}
	};
	
	//是否可以进行播放起控制操作了
	this.isCanController = function(code) {
		//如果未开始过播放，或者禁止禁止了控制键盘返回为false
		if (!this.isStartPlay || this.isMustOrder || this.isSelectTime) {
			switch(code) {
				case 270:
				case 8:
					break;
				default:
					return false;
			}
		}
		return this.playerCanController;
	};
	
	this.showVolumeUI = function() {
		$("#sound_box").show();
	};
	this.hideVolumeUI = $.proxy(function() {
		$("#sound_box").hide();
	}, this);
	//设置音量 true加大否则减少
	this.setvolume = function(n) {
		n ? player.volumeUp() : player.volumeDown();
		this.showVolumeUI();
		setTimeOutfun.timeOut(this.hideVolumeUI, 5000);
	};
	
	//键盘
	this.keypress = $.proxy(function(e) {
		var code = e.which ? e.which : e.keyCode;
		if (this.isCanController(code)) {
			switch(code)
			{
				case 264://快进
				case 39://快进
					this.setFast(true);
					break;
				case 265://快退
				case 37://快退
					this.setFast(false);
					break;
				case 263:
				case 271://暂停播放
					player.pause();
					break;	
				case 259://音量加
					this.setvolume(true);
					break;
				case 260://音量减
					this.setvolume(false);
					break;
				case 261://静音
					player.setMuteFlag();
					return false;
				case 262://声道
					player.changeAudio();
					break;
				case 270:
				case 8:
					this.stopTip();
					break;
			}
		}
	}, this);
	this.setDisplayStopTip = function(isShow) {
		var el = $("#exit_hint"), container = epgKeyManage.KeyE["#exit_hint"];
		isShow ? el.show() : el.hide();
		isShow ? cacheContainer.setContainer(container) :  cacheContainer.closeContainer(container);
		this.playerCanController = !isShow;
	
	};
	this.showStopTip = $.proxy(function() {
		this.setDisplayStopTip(true);
	}, this);
	this.hideStopTip = $.proxy(function() {
		this.setDisplayStopTip(false);
	}, this);
	//显示退出框
	this.stopTip = function() {
		this.showStopTip();
	};
	this.stop = function() {
		//禁用键盘监听
		epgkey.onKeyMonitor = false;
		this.showpauseAD(false);
		this.orderLayer(false);
		this.hideController();
		this.playerCanController = false;
		this.savePlayTime();
	};
	this.bind = function() {
		epgkey.andOuterEvent(this.keypress);
	};
	//保存用户开始播放行为
	this.saveStartPlayTack = function() {
		var mInfo = this.mInfo;
		var usertype = mInfo.ispackage || 0; //0为未打包产品(免费影片)，1为打包产品（单点或者包时段）
		var price = usertype == 1 ? 500 : 0; //单点5元，单位为：分
		track.playPoint(mInfo, usertype, price, 0, 0, "");
	};
	//播放完成后保存用户行为记录
	this.saveStopPlayTack = function(playtime) {
		track.playPoint(false);
		/*var mInfo = this.mInfo;
		playtime = playtime || player.getCurrentPlayTime(); //获取影片时长
		track.playPoint(mInfo.sid, mInfo.mid, mInfo.fid, mInfo.starttime, function(sequence) {
			mInfo.sequence = sequence;
		}, mInfo.sequence, playtime);*/
	};
	//读取播放时间
	this.readMovieTime = function() {
		var m = this.mInfo;
		
		//电视剧自动播放下一集的时候需要改变集数
		if (m.contentCount && m.contentCount > 1) {
			var mName = m.m_name + m.contentName;
			$("#playName")[0].innerHTML = mName;
			$("#jiemuName")[0].innerHTML = mName;
		}

		var prefixUrl = tool.project_domain() + '/filmInfo/resume.action';
		var param = {
			mid : m.mid,
			fid : m.fid,
			title : encodeURIComponent(encodeURIComponent(m.m_name)),
			datetime : +(new Date()),
			ctype : 2,
			sid : m.sid,
			totalsid : m.contentCount || 1,
			version : '3.0'
		};
		var url = tool.json2url(param, prefixUrl);
        $.ajax({
            type:'get',
            url:url,
            dataType:'json',
            async:true,
            context:this,
            success: $.noop
        });
    },

    this.checkSkipMoveEnd = function() {
        if (this.mInfo.PlayStopTime && parseInt(this.mInfo.PlayStopTime) > 0) {
            var currentTime = player.getCurrentPlayTime();
            if (currentTime >= parseInt(this.mInfo.PlayStopTime)) {
                player.mp.stop();
                player.playEnd();
            }
        }

    };
	//保存更新
	this.savePlayTime = function() {
		if (this.isStartPlay) { 
			this.saveStopPlayTack(); //保存用户关闭播放器行为
			var m = this.mInfo;
			var prefixUrl = tool.project_domain() + '/filmInfo/resume.action';
			
			var param = {
				mid : m.mid,
				fid : m.fid,
				mtype : m.mtype,
				title : encodeURIComponent(encodeURIComponent(m.m_name)),
				datetime : +(new Date()),
				ctype : 2,
				sid : m.sid,
				totalsid : m.contentCount || 1,
				playtime : player.getCurrentPlayTime(),
				version : '3.0'
			};
			var url = tool.json2url(param, prefixUrl);
			$.ajax({
					type: 'get',
					url: url,
					dataType : 'json',
					beforeSend : function(xhr) {
						xhr.setRequestHeader("Accept", "application/json");
					},
					success: function(e) {
						player.stop();
					},
					error: function() {
						player.stop();
					}
				});
		} else {
			player.stop();
		}
	};
	//当播放器完整读到数据后进行绑定操作
	 function initPlayerControll() {

		//播放器监听事件, 当处于订购或者正常播放状态就5秒后关闭控制条
		player.attachEvent([HBSTAT.PLAERED], function(status) {
			
			$("#currentPlay").get(0).setAttribute("class", "cur_play");
			setTimeOutfun.timeOut(current.hideController, 5000);
			current.setLoadingDisplay(false);
			current.showpauseAD(false);
		});
		//播放器停止就退出播放器
		player.attachEvent([HBSTAT.STOPED], function(status) {
			var url = document.referrer;
			var json = tool.url2json(url);
			//删除多余参数，以免返回后还会弹窗，误伤
			delete json.pid;
			delete json.result;
			delete json.vnetloginname;
			delete json.token;
			delete json.verifycode;
			delete json.pmid;
			delete json.pmname;
			json.ajax = "ajax";
			url = tool.json2url(json, url.split("?")[0]);
			window.location.href = url;
		});
		//播放器监听事件, 当处于订购或者正常播放状态就5秒后关闭控制条
		player.attachEvent([HBSTAT.PAUSE], function(status) {
			
			$("#currentPlay").get(0).setAttribute("class", "cur_stop");
			//setTimeOutfun.timeOut(current.hideController, 8000);
			current.showController();
			//current.showpauseAD(true);
		});

		//自然播放结束
		player.attachEvent([HBSTAT.EXCEPTIONSTOP], function(status) {
			//针对ut盒子会调用两次
			if (!current.canPlayerNext() && !window.EXCEPTIONSTOP_FLAG) {
				window.EXCEPTIONSTOP_FLAG = true;
				$("#just_exit").show();
				//传入影片时长
				current.saveStopPlayTack(player.getMediaDuration());
				setTimeOutfun.timeOut(function() {
					player.stop();
				}, 800);
			}
		});
		//当 快进或者快退，选时状态 \ 暂停显示进度条
		player.attachEvent([HBSTAT.FORWARD, HBSTAT.REWIND], function(player, status) {
			setTimeOutfun.clear(current.hideController);
			current.showController();
		});
		//当 快进或者快退，选时状态 \ 暂停显示进度条
		player.attachEvent([HBSTAT.SELECTTIME], function(player, status) {
			setTimeOutfun.clear(current.hideController);
			$("#playercontroller").show();
		});
		//当加载的时候现在loading图标
		player.attachEvent([HBSTAT.LOADING], function(status) {
			current.setLoadingDisplay(true);
			//烽火、百视通盒子不能自然播放停止，需要手动执行一下
//			var appName = navigator.appName;
//			if (/Netscape/.test(appName) && navigator["indexOf"]) {
//				player.setPlayerStatus(HBSTAT.BEGINING);
//			}
		});
		//当播放器开始播放 关闭loading
		player.attachEvent([HBSTAT.BEGINING], function(status) {
			current.setLoadingDisplay(false);
			current.isStartPlay = true;
			current.showMovieInfo();
			window.setInterval(current.setPlayerWidget, 500);
			current.saveStartPlayTack();
		});
		//当加载中显示加载状态
		current.bind();
	}
	initPlayerControll();
})(sctelPlay);
var selectTimeController = {
	isShow:false,
	numberObj:null,
	cacheStatus:null,
	Focus:function() {
		setTimeOutfun.clear(playerController.setSelectTime, 1000);
		playerController.setPlayerStatus(HBSTAT.SELECTTIME);
		selectTimeController.clear();
		playerController.isSelectTime = true;
		epgkey.keyValueEvent = selectTimeController.setValue;
	},
	blur:function() {
		selectTimeController.setNull(null);
		selectTimeController.clear();
	},
	
	setValue:function(key, value) {
		if (selectTimeController.numberObj) {
			var s = selectTimeController.numberObj ,n = s.html(), v = value;
			if (n.length >= 2) {
				s.html(v);
			} else {
				s.html(n + v);
			}
			
		}
	},
	
	setTimes:function(e) {
		selectTimeController.numberObj = e;
	},
	
	setNull:function(e) {
		selectTimeController.numberObj = null;
	},
	
	hide:function() {
		selectTimeController.blur();
		setTimeOutfun.clear(playerController.hideController);
		playerController.hideController();
	},
	
	clear:function() {
		$("#selectS").html("");
		$("#selectE").html("");
	},
	
	selectTime:function() {
		var hours = parseInt($("#selectS").html() ? $("#selectS").html() : 0), 
		minute = parseInt($("#selectE").html()? $("#selectE").html() : 0),
		seconds  = hours * 3600 + minute*60;
		if (seconds > 0 && (seconds < playerController.cTime) && !playerController.isMustOrder) {
			sctelPlay.seekFast(seconds);
			selectTimeController.blur();
		}
	}
};
