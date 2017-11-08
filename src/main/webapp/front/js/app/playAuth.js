var playAuth = {

	/**
	 * 播放鉴权标识
	 */
	playAuthStatus : true,

	/**
	 * 当前选中产品信息
	 */
	curObj : null,
	
	/**
	 * 当前产品列表信息
	 */
	data : null,
	
	/**
	 * 思华认证用户名，需要追加@iptv
	 */
	hid : null,
	
	/**
	 * 影片Mid，扣费的时候需要
	 */
	mid : null,
	
	/**
	 * 影片名称，扣费的时候需要
	 */
	mname : null,
	
	/**
	 * 海报路径
	 */
	imgUrl : null,

	/**
	 * 首次做鉴权
	 */
	firstAuth : function(mInfo) {
		//鉴权关闭
		if (!this.playAuthStatus) {
			jq("#but li").eq(0).html("播放");
			jq("#but").show();
		} else {
			var self = this;
			//机顶盒信息
			var window_name = JSON.parse(cookie.getCookie("window_name") || window.name);
			var stbInfo = window_name["stbInfo"];
			var base64 = new Base64();
			var fid = mInfo.fid;
			var oemid = stbInfo.oemid;
			var hid = stbInfo.hid.replace(/@iptv/, "") + "@iptv";
			var uid = hid;
			var mid = mInfo.mid;
			var sid = 1;
			var data = {
					"oemid" : oemid,
					"hid" : hid,
					"uid" : uid,
					"mid" : mid,
					"sid" : sid,
					"fid" : fid
			};
			var url = tool.json2url(data, stbInfo.vasUrl);
			$.ajax({
				url : tool.project_domain() + "/proxy/accessUrl.action",
				data : {
					"proxyUrl" : base64.encode(url)
				},
				dataType : "json",
				beforeSend : function(xhr) {
					xhr.setRequestHeader("Accept", "application/json");
				},
				success : function(data) {
					var obj = JSON.parse(data);
					var status = obj.status;
					//如果鉴权失败，则还需要鉴权
					if (status == 101) {
						self.playAuthStatus = true;
						//jq("#but li").eq(0).html("订购");
					} else if (status == 0) {
						self.playAuthStatus = false;
						jq("#but li").eq(0).html("播放");
					} else {
						alert(obj.resultdesc);
						jq("#but li").eq(0).html("订购");
						self.playAuthStatus = true;
					}
					jq("#but").show();
				},
				error : function() {
					alert("首次影片鉴权失败！");
					//请求失败也得保证为订购状态
					jq("#but li").eq(0).html("订购");
					jq("#but").show();
					self.playAuthStatus = true;
				}
			});
		}
	},
	
	/**
	 * 播放权限查询
	 * 
	 * @param oemid
	 * @param hid
	 * @param uid
	 * @param mid
	 * @param sid
	 * @param fid
	 */
	playQuery : function(oemid, hid, uid, mid, sid, fid, mInfo) {
		this.hid = hid;
		this.mid = mid;
		this.mname = mInfo.m_name;
		this.imgUrl = mInfo.ImgUrl;
		//默认鉴权打开
		if (!this.playAuthStatus) {
			loadplayer.goPlayer(mInfo, sid);
		} else {
			var data = {
					"oemid" : oemid,
					"hid" : hid,
					"uid" : uid,
					"mid" : mid,
					"sid" : sid,
					"fid" : fid
			};
			var url = tool.json2url(data, stbInfo.vasUrl);
			$.ajax({
				url : tool.project_domain() + "/proxy/accessUrl.action",
				data : {
					"proxyUrl" : base64.encode(url)
				},
				dataType : "json",
				beforeSend : function(xhr) {
					xhr.setRequestHeader("Accept", "application/json");
				},
				success : function(data) {
					var obj = JSON.parse(data);
					var status = obj.status;
					if (status == 0) {
						//正常播放
						loadplayer.goPlayer(mInfo, sid);
					} else if (status == 101) {
						//弹出订购流程
						playAuth.verifyOrder(obj.resultList);
					} else {
						//其它错误
						alert(obj.resultdesc);
					}
				},
				error : function() {
					alert("查询播放鉴权失败！");
				}
			});
		}
	},

	/**
	 * 校验订购结果
	 */
	verifyOrder : function(data) {
		var self = this;
		//图片角标
		var domain = tool.project_domain();
		var imgArr = {
				"1018_s1004" : '<h6><img src="' + domain + '/style/images/CornerMarkrec.png" /></h6>',
				"1018_s1005" : '<h6><img src="' + domain + '/style/images/CornerMark6.png" /></h6>'
		};
		var html = "", x = 0;
		data.forEach(function(obj, index) {
			var djson = JSON.stringify(obj);
			djson = base64.encode(djson);
			var name = obj.name;
			//原价
			var costfee = obj.costfee;
			//促销价
			var price = obj.fee;
			//添加角标
			var scode = obj.alias;
			var imgHtml = imgArr[scode] || "";
			var emImgHtml = price != costfee ? '<em>原价：' + costfee + '元</em>' + imgHtml : imgHtml;
			html += '<li class="current" oc="playAuth.toOrder()" fe="" data-json=' + djson + '><span>' + name + '</span> <strong>' + price + '元</strong>' + emImgHtml + '</li>';
			//获取续包月橫向索引
			x = scode == "1018_s1004" ? index : x;
		});
		jq("#order_list ul").html(html);
		var ol = ekey.ckey.order_list;
		ol.ReRender();
		
		//添加动态提示
		ol.addEvent(ol.AFE, function(e) {
			var data = base64.decode(e.attr("data-json"));
			var obj = JSON.parse(data);
			var h4 = '<h7>' + obj.name + '：</h7>' + obj.note;
			jq("#h4").html(h4);
			self.curObj = obj;
		});
		
		ekey.alert("orderBasic", ekey.ckey.but || ekey.ckey.his_bot || ekey.ckey.order_choose);
		//周六、周末焦点不用在返回上面
		if (!/0|6/.test(new Date().getDay())) {
			ekey.ckey.order_but.cFocus();
			ol.setNoAction(x, 0);
		} else {
			ol.set(x, 0);
			ol.cFocus();
		}
		return;
		
		$("#loading").show();
		this.data = data;
		var url = tool.project_domain() + "/order.html?t=" + Math.random();
		var iframe = jq("<iframe>").attr({"id":"sendFrame","width":"1280","height":"720","style":"display:block; z-index:999;position:absolute; left:0px; top:0px; background-color:#000;"}).appendTo("body");
		iframe.show();
		iframe.attr("src", url);
	},

	/**
	 * 去第三方思华二次订购页面
	 * @param obj
	 * @returns
	 */
	toOrder : function(obj) {
		obj = obj || this.curObj;
		var hid = this.hid;
		var mid = this.mid;
		var mname = this.mname;
		var curUrl = window.location.href;
		//另起它名，以免误伤其它正常参数
		var returnURL = curUrl + "&pid=" + obj.pid + "&pmid=" + mid + "&pmname=" + encodeURIComponent(encodeURIComponent(mname));
		var cancelURL = curUrl;
		var json = {
			serviceCode : obj.alias,
			loginName : hid,
			transactionID : "",
			authUrl : base64.encode(stbInfo.authUrl),
			returnURL : base64.encode(returnURL),
			icpCode : stbInfo.icpCode,
			cancelURL : base64.encode(cancelURL)
		};
		var url = tool.json2url(json, tool.project_domain() + "/auth/authOnline.action");
		window.location.href = url;
	},
	
	/**
	 * 异步获取交易号
	 * @param url
	 * @param pid
	 * @param hid
	 * @param mid
	 * @param mname
	 */
	callbackOrder : function(url, pid, hid, mid, mname, callback) {
		var self = this;
		$.ajax({
			url : url,
			dataType : "json",
			success : function(data) {
				var obj = JSON.parse(data);
				obj.pid = pid;
				obj.hid = hid;
				obj.mid = mid;
				obj.mname = mname;
				//获取交易号，做扣费操作
				self.toBuy(obj, callback);
			},
			error : function() {
				alert("获取思华交易号失败！");
			}
		});
	},
	
	/**
	 * 扣费请求
	 * @param obj
	 */
	toBuy : function(obj, callback) {
		var pid = obj.pid;
		if (obj.ErrorCode == 0) {
			var json = {
				transactionID : obj.TransactionID,
				uid : obj.hid,
				mid : obj.mid,
				pid : pid,
				mname : obj.mname
			};
			var proxyUrl = tool.json2url(json, stbInfo.confirmUrl);
			//debug(proxyUrl);
			var param = {
				proxyUrl : base64.encode(proxyUrl)
			};
			var url = tool.project_domain() + "/proxy/accessUrl.action";
			$.ajax({
				type : "GET",
				url : url,
				dataType : "json",
				data : param,
				success : function(result) {
					var o = JSON.parse(result);
					if (o.status == 0) {
						//alert("订购成功！");
						//首次鉴权
						window.movieInfo && playAuth.firstAuth(movieInfo);
						//统计订购成功的汇报到统计平台
						window.track && track.OrderSuccess(pid, 0);
					} else {
						alert(o.resultdesc);
						//首次鉴权
						window.movieInfo && playAuth.firstAuth(movieInfo);
						//订购失败
						window.track && track.OrderSuccess(pid, 1);
					}
					callback && callback();
				},
				error : function(result) {
					alert("订购失败！");
					//首次鉴权
					window.movieInfo && playAuth.firstAuth(movieInfo);
				}
			});
		} else {
			alert(obj.Message);
		}
	},
	
	/**
	 * 关闭订购页面
	 */
	closeWin : function() {
		ekey.ckey.order_list[keyMap.backKey]();
		$("#orderBasic").hide();
		ekey.ckey.but.cFocus();
		return;
		
		jq("#sendFrame").remove();
		window.focus();
	}

};