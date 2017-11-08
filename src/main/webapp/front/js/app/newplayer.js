var HBSTAT = {
	PAUSE:1,
	PLAERED:2,
	FORWARD:3,
	REWIND:4,
	STOPED:5,
	LOADING:6,
	BEGINING:7,
	EVENT_REMINDER:8,
	SELECTTIME:9,//选时状态,
	ORDERING:10, //订购状态
	UPCODE:11,
	DOWNCODE:12,
	EMPTY:13,
	EXCEPTIONSTOP:14 //异常退出
};
var sctelPlay = new (function() {
	//初始化播放器
	var mp = new MediaPlayer(); //创建播放对象
	var instanceId = mp.getNativePlayerInstanceID(); //读取本地的媒体播放实例的标识 
	var playListFlag = 0; //Media Player 的播放模式。 0：单媒体的播放模式 (默认值)，1: 播放列表的播放模式
	var videoDisplayMode = 1; //MediaPlayer 对象对应的视频窗口的显示模式. 1: 全屏显示2: 按宽度显示，3: 按高度显示
	var height = 0;
	var width = 0;
	var left = 0;
	var top = 0;
	var muteFlag = 0; //0: 设置为有声 (默认值) 1: 设置为静音
	var subtitleFlag = 0; //字幕显示 
	var videoAlpha = 0; //视频的透明度
	var cycleFlag = 1;
	var randomFlag = 0;
	var autoDelFlag = 0;
	var useNativeUIFlag = 1;
	//初始话mediaplayer对象
	mp.initMediaPlayer(instanceId,
	playListFlag,
	videoDisplayMode,
	height, 
	width,
	left,
	top,
	muteFlag,
	useNativeUIFlag,
	subtitleFlag, 
	videoAlpha,
	cycleFlag,
	randomFlag,
	autoDelFlag);
	//mp.setSingleMedia(mediaStr); //设置媒体播放器播放媒体内容
	mp.setAllowTrickmodeFlag(0); //设置是否允许trick操作。 0:允许 1：不允许
	mp.setNativeUIFlag(1); //播放器是否显示缺省的Native UI，  0:允许 1：不允许
	mp.setAudioTrackUIFlag(0);//设置音轨的本地UI显示标志 0:不允许 1：允许
	mp.setMuteUIFlag(1); //设置静音的本地UI显示标志 0:不允许 1：允许
	mp.setAudioVolumeUIFlag(0);//设置音量调节本地UI的显示标志 0:不允许 1：允许
	mp.refreshVideoDisplay();
	
	/*mp.setAllowTrickmodeFlag(0); //设置是否允许trick操作。 0:允许 1：不允许
		mp.setNativeUIFlag(0); //播放器是否显示缺省的Native UI，  0:允许 1：不允许
		mp.setAudioTrackUIFlag(1);//设置音轨的本地UI显示标志 0:不允许 1：允许
		mp.setMuteUIFlag(1); //设置静音的本地UI显示标志 0:不允许 1：允许
		mp.setAudioVolumeUIFlag(1);//设置音量调节本地UI的显示标志 0:不允许 1：允许
		mp.refreshVideoDisplay();*/
	//开始播放
	this.PLAYSTAT = HBSTAT.STOPED;
	this.isDisable = false; //是否禁用 所有控制键
	this.EventList = {};
	//创建播放串
	function createPlayerUrl(playUrl, beginTime) {
		/***播放参数*/
		var mediaStr = '[{mediaUrl:"'+ playUrl +'",';
		mediaStr += 'mediaCode: "jsoncode1",';
		mediaStr += 'mediaType:2,';
		mediaStr += 'audioType:1,';
		mediaStr += 'videoType:1,';
		mediaStr += 'streamType:1,';
		mediaStr += 'drmType:1,';
		mediaStr += 'fingerPrint:0,';
		mediaStr += 'copyProtection:1,';
		mediaStr += 'allowTrickmode:1,';
		mediaStr += 'startTime:'+beginTime+',';
		mediaStr += 'endTime:20000,';
		mediaStr += 'entryID:"jsonentry1"}]';
		return mediaStr;
	};
	
	function getEventflag(status, fun) {
		if (!fun.Eventflag) {
			fun.Eventflag = status + "_" + (new Date()).getTime();
		}
		return fun.Eventflag;
	};
	
	this.detachEvent = function(status, fun) {
		delete this.EventList[status][getEventflag(status, fun)];
	};
	this.attachEvent = function(statusArray, fun) {
		if ($.isArray(statusArray)) {
			for(var i = 0, L = statusArray.length; i < L; i++) {
				this._attachEvent(statusArray[i], fun);
			}
		} else {
			this._attachEvent(status, fun);
		}
	};
	this._attachEvent = function(status, fun) {
		this.EventList[status] || (this.EventList[status] = {});
		this.EventList[status][getEventflag(status, fun)] = fun;
	};
	this.setPlayerStatus = function(status) {
		this.PLAYSTAT = status;
		this.exeStatusEvent(status);
	};
	
	this.exeStatusEvent = function(status) {
		if (this.EventList[status]) {
			for(var i in this.EventList[status]) {
				if (this.EventList[status].hasOwnProperty(i)) {
					this.EventList[status][i](this, status);
				}
			}
		}
	};
	this.beginTime = 0;
	//开始播放
	this.play = function(playUrl, startTime) {
		this.setPlayerStatus(HBSTAT.LOADING);
		this.beginTime = startTime;
		this.initPlayer();
		this.speed = 1;
		this.isStartPlay = false;
		mp.setSingleMedia(createPlayerUrl(playUrl, startTime));
		mp.playFromStart();
		//针对烽火进行续播功能
//		var appName = navigator.appName;
//		if (/Netscape/.test(appName) && navigator["indexOf"]) {
//			mp.playByTime(1, startTime, 1);
//		} else {
//			mp.playFromStart();
//		}
		
	};
	//恢复播放
	this.resume = function() {
		mp.resume(); 
		this.setPlayerStatus(HBSTAT.PLAERED);
	};
	this.truePause = function() {   
		mp.pause();    
	};
	//暂停或播放
	this.pause = function() {
		if (this.PLAYSTAT == HBSTAT.PLAERED) {
			mp.pause();
			this.setPlayerStatus(HBSTAT.PAUSE);
		} else {
			this.resume();
		}
	};
	//停止播放
	this.stop = function() {
		mp.setMuteFlag(0);
		mp.stop();
		mp.releaseMediaPlayer(instanceId);
		this.setPlayerStatus(HBSTAT.STOPED);
		this.progressEvent && window.clearInterval(this.progressEvent);
		this.unbind();
	};
	//获取当前的播放时间
	this.getCurrentPlayTime = function() {
		return mp.getCurrentPlayTime();
	};
	//获取影片的总共时长
	this.getMediaDuration   = function() {
		return mp.getMediaDuration();
	};
	
	this.getAttr = function(attr) {
		return typeof mp[attr] != "undefined" ? mp[attr]() : false;
	};
	//设置静音
	this.setMuteFlag = function() {
		var muteFlag = mp.getMuteFlag();
		muteFlag = muteFlag == 1 ? 0 : 1;
		mp.setMuteFlag(muteFlag);

	};
	//音量+
	this.volumeUp = function() {
		var muteFlag =  mp.getMuteFlag();
		if(muteFlag == 1){
			mp.setMuteFlag(0);
		}
		volume = mp.getVolume();
		if(volume >= 100){
			volume = 100;
		}else{
			volume += 5;
		}
		mp.setVolume(volume);
	};
	
	//音量减
	this.volumeDown = function() {
		var muteFlag = mp.getMuteFlag();
		if(muteFlag == 1){//如果是静音的模式，就打开声音
			mp.setMuteFlag(0); //
		}
		volume = mp.getVolume();
		if(volume <= 0){
			volume = 0;
		}else{
			volume -= 5;
		}
		mp.setVolume(volume);
	};
	
	//快进
	this.fastForward = function() {
		switch(this.PLAYSTAT) {
			case HBSTAT.REWIND:
			case HBSTAT.PLAERED:
				this.speed = 1;
			case HBSTAT.FORWARD:
				this.setPlayerStatus(HBSTAT.FORWARD);
				this.speed *= 2;
				this.speed = this.speed > 32 ? 2 : this.speed;
				mp.fastForward(this.speed);
				break;
		}
	};
	//执行跳帧
	this.seekFast = function(seconds) {
		mp.playByTime(1, seconds ,1);
		setTimeOutfun.timeOut(function() {
			sctelPlay.setPlayerStatus(HBSTAT.PLAERED);
		}, 1000);
		
	};
	//快退
	this.fastRewind = function() {
		switch(this.PLAYSTAT) {
			case HBSTAT.FORWARD:
			case HBSTAT.PLAERED:
				this.speed = -1;
			case HBSTAT.REWIND:
				this.setPlayerStatus(HBSTAT.REWIND);
				this.speed *= 2;
				this.speed = this.speed < -32 ? -2 : this.speed;
				mp.fastRewind(this.speed);
				break;	
		}
	};
	//一键跳到尾部
	this.goEnd = function() {
		mp.gotoEnd();
	};
	//一键条到头部
	this.goStart = function(){
		mp.gotoStart();
	};
	//声道设置
	this.changeAudio = function() {
		var audio = mp.getCurrentAudioChannel();
		if(audio=="0" || audio=="Left"){
			audio="Right";
		}
		else if(audio=="1" ||  audio=="Right"){
			audio="Stereo";	
		}
		else if(audio=="2" ||  audio=="Stereo"){
			audio="Left";	
		}
		mp.switchAudioChannel(audio);
		return;
	};
	
	this.updateToPlayed = function() {
		if (!this.isStartPlay) {
			this.isStartPlay = true;

			this.setPlayerStatus(HBSTAT.BEGINING);
			this.setPlayerStatus(HBSTAT.PLAERED);
			if (this.beginTime > parseInt(this.getCurrentPlayTime(), 0)) {
				mp.playByTime(1, this.beginTime ,1);
			}
			
		} 
	};
	
	this.setLog = function(str) {
		$("#setMsg").html(str);
	};
	this.keyEvent = false;
	this.initPlayer = function() {
		if (!this.keyEvent) {
			this.keyEvent = true;
			this.keypress = $.proxy(this.keypress, this);
		}
		this.bind();
	};
	

	this.keypress = $.proxy(function(e) {
		var code = e.which ? e.which : e.keyCode;
		switch(code)
		{
			case 768: //自然播放停止//播放起状态修改
				this.setUtility();
				break;
		}
		
	}, this);

	this.bind = function(){
		epgkey.andOuterEvent(this.keypress);
		//this.bindEvent("keypress", this.keypress);
		//this.bindEvent("keydown", this.keypress);
	};
	this.unbind = function() {
		//this.unEvent("keypress", this.keypress);
		//this.unEvent("keydown", this.keypress);
	};
	
	this.unEvent = function(type, events) {
		if ($.browser.msie) {
			document.detachEvent("on"+type, events);
		} else {
			document.removeEventListener(type, events, false);
		}
	};
	
	this.bindEvent = function(type, events) {
		if ($.browser.msie) {
			document.attachEvent("on"+type, events);
		} else {
			document.addEventListener(type, events, false);
		}
	};

	this.playEnd = function() {
		this.setPlayerStatus(HBSTAT.EXCEPTIONSTOP);
	};

	this.playModeChange = function(eventJson) {
		var type_new_play = eventJson.new_play_rate;
		var type_old_play = eventJson.old_play_rate;
		//iPanel.ioctlWrite('printf', type_new_play+'=======key playModeChange**========='+type_old_play+'\n');
		if ((1 == type_new_play && -2 <= type_old_play)) {
			this.updateToPlayed();
		}
	};
	this.setUtility = function () {
		var self = sctelPlay;
		eval("eventJson = " + Utility.getEvent());
		var typeStr = eventJson.type;
		switch(typeStr) {
			case "EVENT_MEDIA_END":
				self.playEnd();
				break;
			case  "EVENT_PLAYMODE_CHANGE":
				self.playModeChange(eventJson);
				break;
			case "EVENT_MEDIA_BEGINING":
				self.updateToPlayed();
				break;
			case "":
				var fun = arguments.callee;
				setTimeOutfun.timeOut(function() {
					fun.call(this);
				}, 100);
				break;
		}
					
	};
})();

//function MediaPlayer() {
//	this.getNativePlayerInstanceID = function() {};
//	this.initMediaPlayer = function(instanceId,
//			playListFlag,
//			videoDisplayMode,
//			height, 
//			width,
//			left,
//			top,
//			muteFlag,
//			useNativeUIFlag,
//			subtitleFlag, 
//			videoAlpha,
//			cycleFlag,
//			randomFlag,
//			autoDelFlag){};
//	
//			//mp.setSingleMedia(mediaStr); //设置媒体播放器播放媒体内容
//			this.setAllowTrickmodeFlag = function(i){}; //设置是否允许trick操作。 0:允许 1：不允许
//			this.setNativeUIFlag = function(i){}; //播放器是否显示缺省的Native UI，  0:允许 1：不允许
//			this.setAudioTrackUIFlag = function(i){};//设置音轨的本地UI显示标志 0:不允许 1：允许
//			this.setMuteUIFlag = function(i){}; //设置静音的本地UI显示标志 0:不允许 1：允许
//			this.setAudioVolumeUIFlag = function(i){};//设置音量调节本地UI的显示标志 0:不允许 1：允许
//			this.refreshVideoDisplay = function(){};
//			this.pause = function(){};
//			this.resume = function(){};
//			this.getCurrentPlayTime = function(){return 600;};
//			this.getMediaDuration = function() {return 5000;};
//	
//}
//if (!window.Authentication) {
//	Authentication = {};
//}
//Authentication.CTCGetConfig = function() {
//	return 'http://172.1.14.34:8080/iptvepg/function/aaaaaaa';
//};
