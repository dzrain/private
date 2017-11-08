HWSTATUS = {
    ORDERSUCCESS:"0",
    UNKNOWN:"100925460", //未知错误 0x06040014
    USERTOKENEXPIRED:"96636271", //userToken过期
    ORDERAUTHFAILURE:"169130027", //鉴权失败
    ORERAUTHERROR:"500" //处理失败
};

//发送对象
var backSend = {
        iframe:null,
        win:null,
        backParam:"sendbackfun",
        backEvent:{},
        isetIframe:false,
        //打开一个窗口
        sendWin:function(url) {
            if (!backSend.win) {
                //tabindex很重要，不然如果有其它元素带tabindex会影响iframe的前后次序
                backSend.win = jq("<iframe>").attr({"id":"sendFrame","tabindex":"1","width":"1280","height":"720","style":"display:block; z-index:9999;position:absolute; left:0px; top:0px;"}).appendTo("body");
            }
            backSend.win.show();
            backSend.win.attr("src", url);
        },
        //创建一个iframe
        sendframe:function(url) {
            if (!backSend.iframe) {
                backSend.iframe = jq("<iframe>").attr({"width":"1","height":"1", "style":"position:absolute; left:0px; top:0px;",
                    "id":"dkkd"}).appendTo("body");
            }
            backSend.iframe.attr("src", url);
        },
        //发送一个ajax请求
        ajax:function(url, param, backFun, type, errFun) {
            jq.ajax({
                type:type ? type : "GET",
                url:url,
                dataType:"text",
                data:param,
                success:function(v) {
                    backFun(v);
                },
                error:function() {
                	errFun && errFun();
                }
            });
        },

        isetOnkeypress:false,

        closeWin:function(url) {
           // document.keypress = null;

            //var backfun =  tool.urlParam(url, backSend.backParam);
            /*if (!backSend.isetOnkeypress) {
                jq(document).keypress(function(e) {
                    var code = e.which
                    if (code == 13) {
                        epgkey.bindKeypress(e);
                    }
                })
                backSend.isetOnkeypress = true;
            }
            */
            backSend.win.hide();
            window.focus();
            backSend.exeFunBack(url);

        },

        log:function(str) {
            jq("#msg").html(str);
        },
        //去除最后
        getbackfun:function(str) {
           str = str.split("?")[0];
           str =  str.substr(-1, 1) == "/" ? str.substr(0, str.length - 1) : str;
           return str.substr(str.lastIndexOf("/")+1);
        },
        exeFunBack:function(url) {
            //var backfun = backSend.getbackfun(url);
        	var param = tool.url2json(url);
            var backfun = param["backFun"] || param["amp;backFun"];
            //backfun = tool.urlParam(url, "backFun");
            //debug("=======" + backfun);
            //debug(backSend.backEvent[backfun].toString());
            //sctelPlay.setLog("URLWWWWWWWWWW:"+backfun);
            backSend.backEvent[backfun] && backSend.backEvent[backfun](url);

            delete backSend.backEvent[backfun];
        },

        //创建返回执行函数
        createBack:function(obj, url, fun) {
            /*var urlArray = url.split("?"), backParam = (new Date()).getTime(),
                prefix = urlArray[0],
                param = urlArray.length > 1 ? "?"+urlArray[1] : "",
                urlPrefix = prefix.substr(-1, 1) == "?" ? prefix : prefix + "?";*/
            var urlArray = url.split("?");
            var prefix = urlArray[0];
            var param = tool.url2json(url);
            var backFun = (new Date()).getTime();
            param["backFun"] = backFun;
            backSend.backEvent[backFun] = fun;
            return tool.json2url(param, prefix);
        }
    },
//接收认证对象
    reqAuth = {
        reqFun:{},
        //接收认证回来的用户信息
        reqUserAuth:function() {
            reqAuth.back();
        },
        back:function(url) {
            backSend.exeFunBack(url);
        },
        //订购返回接受函数
        reqAuthOrder:function() {
            reqAuth.back();
        },

        closeWin:function(url) {
            backSend.closeWin(url);
            //window.close();
            //window.opener.backSend.exeFunBack(url);

        }
    },
//发送认证请求
    sendAuth = {
        userAuthUrl:"", //认证url;
        refreshTokenUrl:"", //usertoken刷新url
        orderProductUrl:"", //订购url
        userCheckUrl:"", //童锁url
        info:null,
        setUserInfo:function(info) {
            sendAuth.info = info;
        },
        //发送认证请求
        sendUserAuth:function(successfun) {
            var returnUrl =  sendAuth.setBackFun("requsertoken", jq.isFunction(successfun) ? successfun : jq.noop);
            var param = {"SPID":sendAuth.info["SPID"],
                    "UserID":sendAuth.info["UserID"],
                    "ReturnInfo":"",
                    "Action":"UserTokenRequest",
                    "UserToken":"",
                    "ExpiredTime":"",
                    "ReturnURL":returnUrl
                },
                url = sendAuth.userAuthUrl + jq.param(param);
            
            backSend.sendframe(url);

        },
        //发送更新UserToken请求
        refreshUserToken:function(successfun) {
            var returnUrl =  sendAuth.setBackFun("requsertoken", jq.isFunction(successfun) ? successfun : jq.noop);
            var param = {
                    "SPID":stbInfo["SPID"],
                    "UserID":stbInfo["hid"],
                    "ReturnURL":returnUrl,
                    "Action":"UserTokenExpired"
                },
                url = stbInfo.refreshTokenUrl + jq.param(param) + "&OldUserToken="+stbInfo["UserToken"];

          /*  jq.ajax({
                type:"GET",
                url:"./?act=orderAuth&ajax=1&type=save",
                dataType:"text",
                data:{"url":url},
                success: jq.noop});*/
            backSend.sendframe(url);
        },
        //订购
        order:function(productID, ServiceID, ContentID, ContinueType, successfun) {
            sendAuth.sendAuthOrder(productID, ServiceID, ContentID, ContinueType, successfun, 1);
        },
        //取消
        cancelOrder:function(productID, ServiceID, ContentID, successfun) {
            sendAuth.sendAuthOrder(productID, ServiceID, ContentID, 1, successfun, 0);
        },

        zteorder:function(param, successfun) {
            jq.ajax({
                type:"GET",
                url:"./?act=zteordeross",
                dataType:"text",
                data:param,
                success:function(v) {
                    //sctelPlay.setLog(v);
                    successfun(v);
                }});
        },
        //发送业务订购
        sendAuthOrder:function(productID, ServiceID, ContentID, ContinueType, successfun, Action) {

                var returnUrl =  sendAuth.setBackFun("reqorder", jq.isFunction(successfun) ? successfun : jq.noop),
                    param = {
                        "SPID":pageInfo["PRODUCTSPID"],
                        "ContentID":ContentID,
                        "UserID":sendAuth.info["UserID"],
                        "UserToken":sendAuth.info["UserToken"],
                        "ServiceID":ServiceID,
                        "ProductID":productID,
                        "Action":Action,
                        "OrderModel":"1",
                        "ContinueType": ContinueType,
                        "ReturnURL":returnUrl
                    },
                    url = sendAuth.orderProductUrl + jq.param(param);
//                debug(url);
           var frameUrl = tool.project_domain() + "/jump/iframe.action?url=" + new Base64().encode(url);
              //backSend.ajax("./?act=ajaxLog", {"url":url}, null,null);
            var browser=navigator.appName;
//            debug(browser);
            if (browser == "ztebw(Chrome)") {
                sendAuth.checkIfame();
            } else {
//            	debug(frameUrl);
                url = frameUrl;
            }
            backSend.sendWin(url);
        },
        checkIfame:function() {
            var frameElm = window.frames["sendFrame"];

            if (frameElm) {
            
                if (frameElm.cancelorder) {

                    frameElm.cancelorder = function() {
                    
                        var doc = frameElm.document,
                            url = doc.getElementById("ReturnURL").innerHTML;
                        frameElm.location.href = url;
                    };
                } else {
                    setTimeOutfun.timeOut(function() {
                        sendAuth.checkIfame();
                    }, 100);
                }
            } else {
                setTimeOutfun.timeOut(function() {
                    sendAuth.checkIfame();
                }, 100);
            }
        },
        //新建窗口打开
        winOpenUserCheck:function(fun, productId) {
            var backUrl= "requsercheck",
                url = sendAuth.setBackFun(backUrl, fun);
            url = sendAuth.createUserCheckUrl(url, productId);
            backSend.sendWin(url);
        },
        //跳转到童锁界面
        winLocationUrl:function(productId, serviceId, contentID) {
            var backParam = {
                "productId":productId,
                "serviceId":serviceId,
                "contentId":contentID
            };
            backParam[backSend.backParam] = tool.urlParam(window.location.href, backSend.backParam);
            var backUrl= window.location.href.replace(window.location.search, "")+"?act=orderInfo&" + jq.param(backParam),
                url = sendAuth.createUserCheckUrl(backUrl);
            window.location.href = url;
        },
        //检查铜锁
        createUserCheckUrl:function(backUrl, productId) {
            var param = {
                    "transactionID": (new Date()).getTime(),
                    "SPID":pageInfo["PRODUCTSPID"],
                    "userId":pageInfo.UserID,
                    "userToken":pageInfo.UserToken,
                    "checkFlag":"1",
                    //"Key":"",
                    "productId":productId,
                    "Backurl":backUrl
                },
                userCheckUrl = sendAuth.userCheckUrl + jq.param(param);

            return userCheckUrl;
        },

        getEPGPlatform:function(partner) {
            switch (partner) {
                case "HUAWEI":
                case "CDTV" :
                    return "2";
                case "ZTE":
                    return "1";
            }
            return "";
        },
        getPartnerSPID:function(partner) {
            switch (partner) {
                case "HUAWEI":
                case "CDTV" :
                    return "90000010";
                case "ZTE":
                    return "90000001";
            }
            return "";
        },
        //发送业务鉴权
        setOrderAuthed:function(mInfo, backFun, errFun) {
			//更新UserToken
			sendAuth.refreshUserToken(function(userToken) {
				var json = tool.url2json(userToken);
				//debug(json);
				//return;
				var result = json["Result"] || json["result"];
				if (result == "0") {
					var partner = stbInfo["partner"];
					var userToken = json["NewUserToken"];
					var time = +new Date();
					var contentID = mInfo.otherInnerId;
					var mtype = mInfo.mtype;
					var param = {
						"SPID" : stbInfo["SPID"],
						"UserID" : stbInfo["hid"],
						"UserToken" : userToken,
						"ProductID" : "",
						"ServiceID" : "",
						"ContentID": contentID,
						"TimeStamp" : time,
						"IP" : "",
						"MAC" : "",
						"TransactionID" : time,
						"mid" : mInfo.mid,
						"mtype" : mtype,
						"partner" : partner
					};
					var proxyUrl = tool.json2url(param, stbInfo["vasUrl"]);
					//debug(proxyUrl);
					param = {
						proxyUrl : base64.encode(proxyUrl)
					};
					//debug(param.proxyUrl);
					//return;
					track && track.orderAuth(contentID, userToken);
					var url = tool.project_domain() + "/proxy/accessUrl.action";
					backSend.ajax(url, param, backFun, null, jq.isFunction(errFun) ? errFun : jq.noop);
					//同时也更新UserToken
					stbInfo["UserToken"] = userToken;
				}
			});
        },
        //打开订购列表
        openOrderList:function(contentId, fun) {
            var url = "app/?act=orderlist&contentId="+contentId;
            url = sendAuth.setBackFun(url, fun);
            backSend.sendWin(url);
        },
        //获取用户已经订购的产品列表
        getUserOrderProductList:function(contentId) {
            var param = {
                "contentID":contentId,
                type:"userProductList",
                ajax:1
            };
            backSend.ajax("./?act=orderAuth", param, jq.noop, null);
        },
        //获取产品列表
        getProductList:function(contentId) {
            var param = {
                "contentID":contentId,
                type:"userProductList",
                ajax:1
            };
            backSend.ajax("./?act=orderAuth", param, jq.noop, null);
        },

        //创建xml
        createXML:function(param) {
            var tmp = "";
            for(var i in param) {
                tmp += "<"+i+">"+encodeURIComponent(param[i])+"</"+i+">";
            }
            return tmp;
        },

        //创建http返回url
        setBackFun:function(backUrl, bFun) {

            var returnUrl = tool.project_domain() + "/reqauth.html?authAction=" + backUrl;

            return backSend.createBack(backSend.backEvent, returnUrl, bFun);
        }

    };