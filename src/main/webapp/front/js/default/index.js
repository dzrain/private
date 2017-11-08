//桌面区域控制
function initDesktop(container) {
	function setFocus() {
		if (!ekey.ckey["onedelay"]) {
			ekey.renderContainer(".epgcontainerdelay");
			// 焦点设置到上一页上去
			function setprivepage() {
				$("#oneDesktop").show();
				$("#twoDesktop").hide();
				ekey.ckey["contentList"].cFocus();
				ekey.ckey["oneTwo"].setNoAction(0, 0);
			}
			ekey.ckey["onedelay"].addEvent(container.BCLE, setprivepage);
			ekey.ckey["oneTwodelay"].addEvent(container.BCRE, setprivepage);
			//为了记录焦点向下时，记录从那个容器向下的
			ekey.ckey['onedelay'].addEvent(ekey.ckey['onedelay'].BCDE,function(){
				$("#bottom_menu").attr("downContent","onedelay");
			});
			ekey.ckey['oneTwodelay'].addEvent(ekey.ckey['oneTwodelay'].BCDE,function(){
				$("#bottom_menu").attr("downContent","oneTwodelay");
			});
		}
		$("#oneDesktop").hide();
		$("#twoDesktop").show();

		ekey.ckey["onedelay"].cFocus();
		ekey.ckey["oneTwodelay"].setNoAction(0, 0);
	}
	container.addEvent(container.BCRE, setFocus);
	ekey.ckey["contentList"].addEvent(container.BCLE, setFocus);

}

// 动画效果函数
var Tween = {
	Quad : {
		easeIn : function(t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		easeOut : function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInOut : function(t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		}
	},
	listElement : [],
	t : 0,
	d : 5,
	move : function(id, c) {
		var node = id.get(0), b = parseInt(node.style.left), t = 0;
		// alert(parseInt(node.style.left))

		Tween.listElement.push({
			n : node,
			'c' : c,
			"b" : b
		});
	},

	start : function(endfun) {
		var t = Tween.t, d = Tween.d, nodelist = Tween.listElement, Quad = Tween.Quad;
		var run = (function() {
			return function() {
				if (t < d) {
					t++;
					for (var i = 0, L = nodelist.length; i < L; i++) {
						var elm = nodelist[i], n = elm.n, c = elm.c, b = elm.b, left = Quad
								.easeIn(t, b, c, d);
						n.style.left = left + "px";
					}
					setTimeout(arguments.callee, 10);
				} else {
					for (var i = 0, L = nodelist.length; i < L; i++) {
						var elm = nodelist[i], n = elm.n, c = elm.c, b = elm.b;
						n.style.left = (b + c) + "px";
					}
					Tween.listElement = [];
					endfun && endfun();
				}
			};
		})();
		run();
	}
};
// 定义滚动效果容器

var RollContainer = {
	downContent:"",//记录中间的容器向下 的id
	index : 1,
	isExeGlogbal : function() {
		return true;
	},
	initRoll : function(list) {
		if(list && list.length > 0){
			this.currentEle = list[this.index];
			this.list = list;
			this.one = $("#RollOne");
			this.two = $("#Rolltwo");
			this.three = $("#Rollthree");
			for (var i = 0; i < 3; i++) {
				this.createImg(this.list[i]);
			}
			if(this.list[0]){				
				this.replacChild(this.one, this.list[0].selm);
			}
			if(this.list[1]){
				this.replacChild(this.two,this.list[1].belm);
			}
			if(this.list[2]){
				this.replacChild(this.three, this.list[2].selm);
			}
			this.run();
		}
	},
	replacChild : function(Jelm, newNode) {
		var elm = Jelm.get(0), oldChild = elm.firstChild;// this.getlastChild(elm);//
		elm.replaceChild(newNode, oldChild);
	},
	getlastChild : function(elm) {
		var n = elm.firstChild;
		while (n.nodeType != 1) {
			n = n.nextSibling;
		}
		return n;
	},
	createImg : function(elm) {
		if(elm){
			var simg = document.createElement("img");
			var bimg = document.createElement("img");
			simg.src = elm.s;
			bimg.src = elm.b;
			elm.selm = simg;
			elm.belm = bimg;
		}
	},

	cacheContainer : null,
	cFocus : function() {
		ekey.currentContainer && ekey.currentContainer.cBlur();
		//将id放入
		var attr = ekey.currentContainer.attr;
		if(attr && attr.id != "box_nav" && attr.id != "suspend_but"&& attr.id != "suspend_back"){
			RollContainer.downContent = ekey.currentContainer.attr.id;
		}
		this.hasFocus = true;
		this.cacheContainer = ekey.currentContainer;
		ekey.currentContainer = this;
		$("#rollc").attr("class", "ban_ind01 currenta");
	},

	cBlur : function() {
		this.hasFocus = false;
		$("#rollc").attr("class", "ban_ind01");
	},

	UpCode : function(e) {
		ekey.ckey["box_nav"].cFocus();
	},

	DCode : function(e) {
		if(RollContainer.downContent !="" && ekey.ckey[RollContainer.downContent]!=null && ekey.ckey[RollContainer.downContent] !=undefined){
			//获取向上时的ID
			ekey.ckey[RollContainer.downContent].cFocus();
		}else{
			var n = document.getElementById("twoDesktop").style.display == "none", ct = n ? "contentList"
					: "onedelay";
			ekey.ckey[ct].cFocus();
		}
	},
	oneWidth : 341,
	twoWidth : 531,
	amendValue : function(n) {
		return n < 0 ? this.list.length - 1 : n >= this.list.length ? 0 : n;
	},
	getIndex : function(b) {

		this.index = this.amendValue(b ? ++this.index : --this.index);

		var middleIdex = this.index, leftIndex = this
				.amendValue(this.index - 1), rigthIndex = this
				.amendValue(this.index + 1);
		var cr = [ leftIndex, middleIdex, rigthIndex ];

		for (var i = 0, L = cr.length; i < L; i++) {
			if (!this.list[cr[i]].selm) {
				this.createImg(this.list[cr[i]]);
			}
		}
		return [ this.list[leftIndex].selm, this.list[middleIdex].belm,
				this.list[rigthIndex].selm ];
	},
	LCode : function(e) {
//		if (!this.isRun) {
			var s = this.getIndex(false);
			this.setElementLeft(this.one, -this.oneWidth, s[0]);
			this.setElementLeft(this.three, -this.oneWidth, s[2]);
			this.setElementLeft(this.two, -this.twoWidth, s[1]);
//			Tween.move(this.one, this.oneWidth);
//			Tween.move(this.two, this.twoWidth);
//			Tween.move(this.three, this.oneWidth);
//			Tween.start(function() {
//				RollContainer.isRun = false;
//				RollContainer.removeChild(RollContainer.one, true);
//				RollContainer.removeChild(RollContainer.two, true);
//				RollContainer.removeChild(RollContainer.three, true);
//			});
//			this.isRun = true;
//		}
	},

	removeChild : function(jelm, islast) {
		var elm = jelm.get(0), oldChild = islast ? elm.lastChild
				: elm.firstChild;
		elm.removeChild(oldChild);
	},

	setElementLeft : function(jelm, pos, appendElem) {
		//不要动画效果
		jelm.html(appendElem);
		return;
		var elm = jelm.get(0); // .firstChild;
		elm.insertBefore(appendElem, elm.firstChild);
		elm.style.left = pos + "px";
	},
	setElementRight : function(jelm, pos, appendElem) {
		//不要动画效果
		jelm.html(appendElem);
		return;
		var elm = jelm.get(0); // .firstChild;
		elm.appendChild(appendElem);
		elm.style.left = pos + "px";
	},
	setPos : function(s, pos) {
		var elm = s.get(0); // .firstChild;
		elm.style.left = pos + "px";
	},
	isRun : false,
	RCode : function(e) {
//		if (!this.isRun) {
			var s = this.getIndex(true);
			this.setElementRight(this.one, 0, s[0]);
			this.setElementRight(this.three, 0, s[2]);
			this.setElementRight(this.two, 0, s[1]);
//			Tween.move(this.one, -this.oneWidth);
//			Tween.move(this.two, -this.twoWidth);
//			Tween.move(this.three, -this.oneWidth);
//			Tween.start(function() {
//				RollContainer.isRun = false;
//				RollContainer.isRun = false;
//				RollContainer.removeChild(RollContainer.one, false);
//				RollContainer.removeChild(RollContainer.two, false);
//				RollContainer.removeChild(RollContainer.three, false);
//				RollContainer.setPos(RollContainer.one, 0);
//				RollContainer.setPos(RollContainer.three, 0);
//				RollContainer.setPos(RollContainer.two, 0);
//			});
//			this.isRun = true;
//		}

	},

	ECode : function(e) {
		var el = this.list[this.index];
        var sourceUrl = el["sourceUrl"];
        var mtype = el["mtype"];
        //shimiao 20141226 专题播放路径
        var epgTopicUrl = el["epgTopicUrl"];
        if(epgTopicUrl!="" ){
        	//filmlist/indexForZhuan.action?ctype=3&mtype=19&column=cate_jrzt_nxgej_1416462311&page=1&pagesize=6&columnIndex=1&step=3
        	var column = $.urlParam(epgTopicUrl,"column");
        	var url="../filmlist/indexForZhuan.action?ctype=3&mtype=19&column="+column+"&page=1&pagesize=6&columnIndex=1&step=3";
        	addUrl(url);
        }else{
        	goSourceUrl(sourceUrl,mtype);
        }
	},
	//shimiao 20150120 实现滚动的效果
	run : function(e){
		setInterval(function (){
	    	if(ekey.currentContainer.downContent==undefined){
	    		RollContainer.RCode();
	    		}
	    },3000);
	}
};
// 增加按键处理
$.each(keyMap.deafautkey, function(v, key) {
	RollContainer[v] && (RollContainer[key] = RollContainer[v]);
});
// 处理底部菜单
function checkmeun(c) {
	c.addEvent(
		c.BCUPE,function() {
			var n = document.getElementById("twoDesktop").style.display == "none", ct = n ? "contentList"
					: "onedelay";
			ekey.ckey[ct].cFocus();
	});
}

// 处理导航菜单
function navMeun(c) {
	c.addEvent(c.BCUPE, function() {
		ekey.ckey[c].cFocus();
	});
}
//底部上的谁向下的ID记录
function getDownContentId(){
	ekey.ckey['bottom_menu'].addEvent(ekey.ckey['bottom_menu'].BCUPE,function(){
		if($("#bottom_menu").attr("downContent") != "" &&$("#bottom_menu").attr("downContent") !=undefined &&  $("#bottom_menu").attr("downContent") !='undefined' ){
			ekey.ckey[$("#bottom_menu").attr("downContent")].cFocus();
		}
	});
	ekey.ckey['contentList'].addEvent(ekey.ckey['contentList'].BCDE,function(){
		$("#bottom_menu").attr("downContent","contentList");
	});
	ekey.ckey['oneTwo'].addEvent(ekey.ckey['oneTwo'].BCDE,function(){
		$("#bottom_menu").attr("downContent","oneTwo");
	});
	
}
ekey.ready(".epgcontainer", function() {
	ekey.addContainer("RollContainer", RollContainer);
	checkmeun(ekey.ckey["bottom_menu"]);
	initDesktop(ekey.ckey["oneTwo"]);
	initMeun(ekey.ckey["box_nav"], "scrollul");
	RollContainer.cFocus();
	
	ekey.globalContainer.setKeyValue = function(keyCode, keyvalue) {
        var value = $("#sys_code").val() == ""?'': $("#sys_code").val();
        value += keyvalue;
        $("#sys_code").val(value);
        if(value === "40080"){
        	$("#sys_code").val("");
        	window.timeIdpage = setTimeout(goSys, 100);
        } else if (value == "10086") {
        	//进入测试平台
        	loadHomePage('index', stbInfo['testEpgUrl']);
        }
    };
    //获取首页面的焦点
	getDownContentId();
	var indexParams = BrowserStorage.api.get("indexParams").value;
	if(indexParams && indexParams!=""){
		RollContainer.downContent = $.urlParam(indexParams,"downContent").split("|")[0];
		$("#bottom_menu").attr("downContent",$.urlParam(indexParams,"downContent").split("|")[1]);
		setXYForDocumentforindex(indexParams);
		BrowserStorage.api.remove("indexParams");
	}
	
});
/**
 * shimiao 20150121  专门针对首页面设置的
 * @param url
 */
function setXYForDocumentforindex(url){
	url =  url || window.location.href;
   	if(url.indexOf("currId=")>-1){
   		var ids = $.urlParam(url,"ids").split("|");
   		var x = $.urlParam(url,"x").split("|");
   		var y= $.urlParam(url,"y").split("|");
   		for(var i=0;i<ids.length;i++){
   			if(ids[i]&&ids[i]!=""&&ids[i] !=="undefined"){
   				if(ekey.ckey[ids[i]] == null && ekey.ckey[ids[i]] ==undefined){
   					//shimiao 如果当前显示的是第一页时，给出判断
   					if($.urlParam(url,"firstShow")==='false'){
   						$("#oneDesktop").hide();
   						$("#twoDesktop").show();
   					}
   					setFocusFornext(ekey.ckey["oneTwo"]);
   				}
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
	   		$("#oneTwodelay .currenta").attr("class","current");
	   		$("#onedelay .currenta").attr("class","current");
	   	}
		if(currId && currId!=undefined &&currId !=="undefined" && ekey.ckey[currId]!=null &&ekey.ckey[currId]!=undefined){
			ekey.ckey[currId].cFocus();
		}
	 }
}
/**
 * shimiao 20150121 对第二个容器从新加载
 * @param container
 */
function setFocusFornext(container) {
	if (!ekey.ckey["onedelay"]) {
		ekey.renderContainer(".epgcontainerdelay");
		// 焦点设置到上一页上去
		function setprivepage() {
			$("#oneDesktop").show();
			$("#twoDesktop").hide();
			ekey.ckey["contentList"].cFocus();
			ekey.ckey["oneTwo"].setNoAction(0, 0);
		}
		ekey.ckey["onedelay"].addEvent(container.BCLE, setprivepage);
		ekey.ckey["oneTwodelay"].addEvent(container.BCRE, setprivepage);
		//为了记录焦点向下时，记录从那个容器向下的
		ekey.ckey['onedelay'].addEvent(ekey.ckey['onedelay'].BCDE,function(){
			$("#bottom_menu").attr("downContent","onedelay");
		});
		ekey.ckey['oneTwodelay'].addEvent(ekey.ckey['oneTwodelay'].BCDE,function(){
			$("#bottom_menu").attr("downContent","oneTwodelay");
		});
	}
	ekey.ckey["oneTwodelay"].setNoAction(0, 0);
}
