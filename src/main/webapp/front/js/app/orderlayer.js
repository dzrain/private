//订购列表显示
var playerOrderList = {
	cacheFun:null,
	backKey:8,
	//取消订购回调方法
	backCancelFun:null,
	//订购后回调方法
	backFun:null,
	productInfo:null,
	orderLayer:null,
	show:function(backFun, backCancelFun) {
		
		playerOrderList.backFun = backFun;
		playerOrderList.backCancelFun = backCancelFun;
		playerOrderList.cacheFun =  epgkey.keyMethod[playerOrderList.backKey];
		playerOrderList.showLayer();
		epgkey.setKey(playerOrderList.backKey, function() {
			playerOrderList.cancelOrder();
		});
	},
	
	showLayer:function() {
		var container = epgKeyManage.KeyE["#btnGroup"];
		epgKeyManage.KeyE["#btnGroup"].setNoAction(0, 0);
		cacheContainer.setContainer(container);
		$("#popOrder").show();
	},
	//取消订购
	cancelOrder:function() {
		playerOrderList.orderLayer && playerOrderList.orderLayer.hide();
		//恢复返回键盘
		playerOrderList.cacheFun && epgkey.setKey(playerOrderList.backKey, playerOrderList.cacheFun);
		playerOrderList.hide();
		playerOrderList.backCancelFun();
	},
	
	selectProduct:function(e) {
		var ptype = parseInt(e.attr("ptype"));
		playerOrderList.productInfo = playerOrderList.getProductInfo(e);
		playerOrderList.orderLayer = ptype == 0 || (ptype == 100) ?  playerSingleOrder : playerBagOrder;
		playerOrderList.hide();
		sendAuth.winOpenUserCheck(function(url) {
			var urlInfo = tool.urlParam(url, "result");
			if (urlInfo == "0" || urlInfo == "1") {
				playerOrderList.sendOrderBag(1);//帕科的包都是自动续订的
			} else {
				playerOrderList.showLayer();
			}
		},playerOrderList.productInfo.productId);
	},
	
	getProductInfo:function(e) {
		var param = {fee:"", productId:"", usefullife:"", serviceId:"", note:"", costfee:"", alias:"", name:""};
		for(var i in param) {
			param[i] = e.attr(i);
		}
		return param;
	},
	//ContinueType 是否续订
	sendOrderBag:function(ContinueType) {
            var info = playerOrderList.productInfo, mInfo = movieInfo;
            playerOrderList.orderLayer && playerOrderList.orderLayer.hide();
            playerOrderList.tip("订购中请稍候...", $.noop, 0);
            sendAuth.order(info.productId, info.serviceId, mInfo.InnerId, ContinueType ? ContinueType : 0, 
            function(code) {
                    playerOrderList.sendBack(code);
            });
	},

    tip:function(msg, fun, delay) {
        var s = $("#purchase_sID"), h = $("#productName"), idsecond = $("#idsecond");
        s.show();
        h.html(msg);
        if (delay) {
            idsecond.html("（"+(delay/1000)+"秒后自动消失）");
            setTimeout(function() {
                s.hide();
				fun();
            }, delay);
        } else {
            idsecond.html("");

        }
    },

    //
	//订购成功返回
	orderSuccess:function() {
		var info = playerOrderList.productInfo,
			pName = playerOrderList.orderLayer.isSingle ? movieInfo.m_name : info.alias,
			msg ='您已经成功订购：【<em style="display:inline">'+pName+'</em>】业务，祝您观影愉快！观影过程中如遇任何问题，请拨打10000号，感谢您对本产品的支持！';
		//统计订购成功的
		track.OrderSuccess(info.productId, 0, info.usefullife);
		playerOrderList.tip(msg, playerOrderList.goBackHide, 5000);
		
		//如果订购成功，则加个标识
		window.ORDER_SUCCESS_FLAY = 1;
	},
	//订购失败返回
	orderFailure:function() {
//		var info = playerOrderList.productInfo;
//		track.OrderSuccess(info.productId, 1, info.usefullife);
		playerOrderList.tip("对不起,订购失败", playerOrderList.cancelOrder, 2000);
	},
	
	sendBack:function(code) {
		var Result = tool.urlParam(code, "Result");
		if (Result == HWSTATUS.ORDERSUCCESS) {
			playerOrderList.orderSuccess();
		} else {
			playerOrderList.orderFailure();
		}
	},
	//订购成功后
	goBackHide:function() {
		//恢复返回键盘
		playerOrderList.cacheFun && epgkey.setKey(playerOrderList.backKey, playerOrderList.cacheFun);
		playerOrderList.hide();
		playerOrderList.backFun();
		
	},
	
	hide:function() {
		$("#popOrder").hide();
		var container = epgKeyManage.KeyE["#btnGroup"];
		cacheContainer.closeContainer(container);
	}
},
//单点订购层
 playerSingleOrder = {
	productInfo:null,
	backfun:null,
	isSingle:true,
	showSingle:function(productInfo) {
		playerSingleOrder.productInfo = productInfo;
		$("#singleOrder").show();
		var container = epgKeyManage.KeyE["#singleOrderbtnGroup"];
		container.setNoAction(1, 0);
		
		cacheContainer.setContainer(container);
		
	},
	
	hide:function() {
		var container = epgKeyManage.KeyE["#singleOrderbtnGroup"];
		cacheContainer.closeContainer(container);
		$("#singleOrder").hide();
	}
},
//大包订购层
 playerBagOrder = {
	isSingle:false,
	productInfo:null,
	backfun:null,
	showSingle:function(productInfo) {
       // sctelPlay.setLog("订购:进入" );

	    var info = productInfo, d = new Date(),
		year = d.getFullYear(), Month = d.getMonth(), day = d.getDay(), hours = d.getHours(),
		loadDate = new Date(),
		noteArray = info.note.split(",");
      //  sctelPlay.setLog("订购:fffffffff" );
		loadDate.setHours(hours + parseInt(productInfo.usefullife));
		$("#bagOrder").show();
      //  sctelPlay.setLog("订购:ffrreeffffff" );
		$("#year_money").html("<span>"+info.alias+"<br>￥"+(info.fee/100).toFixed(2)+"元/月</span>");//价格				
		$("#yearDelTxt").html("￥"+(info.costfee/100).toFixed(2));//价格
		$("#yearTimeline").html(noteArray[3]+"<br>有效期："+d.Format("yyyy.MM.dd")+" 至 "+loadDate.Format("yyyy.MM.dd"));//价格
		$("#btone").html("<span>确定<br>"+noteArray[1]+"</span>");
		$("#bttwo").html("<span>确定<br>"+noteArray[2]+"</span>");
		var container = epgKeyManage.KeyE["#yearBottom_btn"];
		container.setNoAction(2, 0);
		cacheContainer.setContainer(container);
	},
	
	hide:function() {
		var container = epgKeyManage.KeyE["#yearBottom_btn"];
		cacheContainer.closeContainer(container);
		$("#bagOrder").hide();
	}
};
var cacheContainer = {
	cache:{},
	setContainer:function(container) {
		container != epgkey.currentContainer && (cacheContainer.cache[container.id] = epgkey.currentContainer);
		epgkey.setCurrentContainer(container);
	},
	closeContainer:function(container) {
		container == epgkey.currentContainer && 
		cacheContainer.cache[container.id] && epgkey.setCurrentContainer(cacheContainer.cache[container.id]);
		
	}
};