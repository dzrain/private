// 注册光标移动事件
ekey.ready(".epgcontainer", function(){
	 var c = ekey.ckey["contentListData"];
 	 
     ekey.ckey["contentListData"].addEvent(c.BCRE, function() {
     	if($("#contentListData").find("ul").attr("page") == $("#contentListData").find("ul").attr("pageCount") 
     		&& $("#contentListData").find("ul").attr("page") !=1 ){
     		$("#keyword").attr('jumpUrl','test');
     		pvajax("'kind':'"+pv.curKind+"','page':'1','type':'1'");
     		goPage(1,true);
     	}else if($("#contentListData").find("ul").attr("pageCount")!=1){
	        var page = parseInt($("#contentListData").find("ul").attr("page"))+1;
	        $("#keyword").attr('jumpUrl','test');
	        pvajax("'kind':'"+pv.curKind+"','page':'"+page+"','type':'1'");
	        goPage(page,true);
        }
     });
     ekey.ckey["contentListData"].addEvent(c.BCLE, function() {
    	 
    	 if($("#contentListData").find("ul").attr("page") != $("#contentListData").find("ul").attr("pageCount") 
    	 	&& $("#contentListData").find("ul").attr("page") == 1){
     		var page = parseInt($("#contentListData").find("ul").attr("pageCount"));
     		$("#keyword").attr('jumpUrl','test');
     		pvajax("'kind':'"+pv.curKind+"','page':'"+page+"','type':'1'");
     		goPage(page,true);
     	}else if($("#contentListData").find("ul").attr("page") !=1){
	        var page = parseInt($("#contentListData").find("ul").attr("page"))-1;
	        $("#keyword").attr('jumpUrl','test');
	        pvajax("'kind':'"+pv.curKind+"','page':'"+page+"','type':'1'");
	        goPage(page,true);
        }
     });
     ekey.ckey["box_nav"].addEvent(c.BCDE, function() {
     	var isNoData =document.getElementById("noData").style.display != "none"?true:false;
     	if(isNoData){
     		ekey.ckey["contentListTwo"].cFocus();
     	}else{
        	showContainer();
        }
    });
    ekey.ckey["contentListTwo"].addEvent(c.BCUPE, function() {
        var isNoData =document.getElementById("noData").style.display != "none"?true:false;
        if(isNoData){
        	ekey.ckey["box_nav"].cFocus();
        }else{
	        showContainer();
        }
        
    });
    setXYForDocument();
    //shimiao 添加pv
    pv.curKind='search';
    pv.channelCD='';
    pvajax("'kind':'search','type':'1'");
});
function showContainer(){
	var isfilmList =document.getElementById("contentList").style.display != "none"?true:false;
	if(isfilmList){
	 	$("#contentListData").hide();
	 	$("#noData").hide();
        $("#contentList").show();
        ekey.ckey["contentList"].cFocus();
	}else{
		$("#contentList").hide();
        $("#contentListData").show();
        $("#noData").hide();
        ekey.ckey["contentListData"].cFocus();
	}
}
 
function toggleTypeClass(e){
	var hasClass = e.attr('class');
	if(hasClass == 'currentsa' || hasClass == 'currents'){
		e.attr('class','current');
	}else{
		e.attr('class','currentsa');
	}
} 
// 搜索页面相关JS
var sa = {
	fs_page:{x:0,y:0},
	_input:function(e){
		var isNoData =document.getElementById("noData").style.display != "none"?true:false;
		if(isNoData){
			return;
		}
		$("#contentListData").attr('url','../search/search.action?');
		$("#contentList").find("ul").attr("isKeyword",false);
		var keyword = $('#keyword').html();
		keyword = keyword + e.text();
		$('#keyword').html(keyword);
		changeCurrUrl();
		$("#keyword").attr('jumpUrl','test');
		$("#keyword").attr("sType","keyword");
		$("#keyword").attr("field",'');
		pvajax("'kind':'"+pv.curKind+"','page':'1','type':'1'");
		goPage(1,false);
	},
	_del:function(){
		var val = $('#keyword').html();
		var len = val.length;
		if(len > 0)
			val = val.slice(0,len-1);
		$('#keyword').html(val);		
	},	
	_clear:function(){
		changeCurrUrl();
		$("#contentListData").attr('url','../search/search.action?');
		$("#keyword").attr('jumpUrl','test');
		$("#keyword").attr("field",'');
		$('#keyword').html('');
		$("#contentListData").hide();
        $("#contentList").show();
        $("#noData").hide();
        $("#contentList").find("li").attr("class","current");
	},	
	_checked:function(e){
		$(".seek_cond li").toggleClass("currentsa");
	}
};
function hotWord(e){
		$("#contentList").find("ul").find("li").attr("class","current");
		var keyword= e.attr("keyword");
		$("#contentList").find("ul").attr("isKeyword",true);
		e.attr("class","currentsa");
		$('#keyword').html(keyword);
		$("#keyword").attr("sType","hotword");
		$("#loading").show();
		changeCurrUrl();
		pvajax("'kind':'"+pv.curKind+"','hotword':'"+encodeURIComponent(keyword)+"','type':'1'");
		var url = "../hotWord/channel.action?keyword="+encodeURI(encodeURI(keyword))+"&page=1&pagesize=6";
		$.ajax({
			url:url,
			dataType:"json", 
			success: function(data){
		    	combinHtml(data,true);
		    	data && ekey.ckey["contentListData"].cFocus();
		    	$("#contentListData").attr('url','../hotWord/channel.action?');
		    	$("#loading").hide();
		    	
		    	//pv汇报
				track.pv(url);
			},
			error:function(){
				combinHtml(null,false);
			}
		});
	}
	function combinHtml(data,isKeyWord){
			var isNoData =document.getElementById("noData").style.display != "none"?true:false;
			if(isNoData){
				return;
			}
			if(data){
				data = $.parseJSON(data);
			}
	    	$("#contentListData").find("ul").remove();
	    	$("#loading").hide();
		    if(data==null || data =="" || data.filmCount<1){
			    $("#noData").show();
			    $("#contentList").hide();
			    if(isKeyWord){
			    	ekey.ckey["contentListTwo"].cFocus();
			    }
		    }else{	
				$("#contentList").hide();
				$("#noData").hide();
				$("#contentListData").show();
		    	var htmls = combinUl(data,isKeyWord);
		   	 	$("#contentListData").append(htmls);
		   	 	$("#contentListData").attr('pageIndex',data.pageIndex);
			    $("#contentListData").attr('pageCount',data.pageCount);
			    ekey.ckey["contentListData"].ReRender();
		 }
	}
	
	function combinUl(data,isKeyWord){
		var htmls = "";
		if( data.filmCount){
			$("#contentListData").attr('pageIndex',data.pageIndex);
		    $("#contentListData").attr('pageCount',data.pageCount);
			htmls = '<ul page="'+data.pageIndex+'" pageCount="'+data.pageCount+'">';
			htmls += '<span class="arrows_left"></span>';
			for(var i= 0;i<data.filmCount && i<6;i++){
				htmls += "<li class=\"current\" oc=\"javascript:verifyInfo('"+data.film[i].mid+"','"+data.film[i].mtype+"','"+data.film[i].stype+"')\""+
				" id=\"filmList_" + data.film[i].mid + "\" fe=\"showTitle\" be=\"hidTitle\">"+
				"<strong><img mid='"+ data.film[i].mid +"' original=" + data.film[i].imgUrlB + " src=\"../style/images_html/loging301-144.jpg\" /></strong>"+
				"<p htmlp='"+data.film[i].filmName+"' >" + subStr(data.film[i].filmName,12) + "</p></li>";
			}
			htmls += '<span class="arrows_right"></span>';
			htmls +='</ul>';
		}else{
			var pagesize = Math.ceil(data.count/6);
			$("#contentListData").attr('pageIndex',data.page);
		    $("#contentListData").attr('pageCount',pagesize);
			htmls = '<ul page="'+data.page+'" pageCount="'+pagesize+'">';
			var j=0;
			if(!data.page && data.page==null){
				 $("#noData").show();
				    $("#contentList").hide();
				    if(isKeyWord){
				    	ekey.ckey["contentListTwo"].cFocus();
				    }
			}
			if (data && data.movieinfo) {
				htmls += '<span class="arrows_left"></span>';
				data.movieinfo.forEach(function(o) {
					if(j<6){
						htmls += "<li class=\"current\" oc=\"javascript:verifyInfo('"+o.mid+"','"+o.mtype+"','"+o.stype+"')\""+
						" id=\"filmList_" + o.mid + "\" fe=\"showTitle\" be=\"hidTitle\">"+
						"<strong><img mid='"+ o.mid +"' original=" + o.smallposterurl + " src=\"../style/images_html/loging301-144.jpg\" /></strong>"+
						"<p htmlp='"+o.cnname+"' >" + subStr(o.cnname,12) + "</p></li>";
					}
					j++;
				});
				htmls += '<span class="arrows_right"></span>';
			}
			htmls +='</ul>';
		}
		return htmls;
	}
	function showAllTitle(e){
		var id = e.attr("id");
		var pContent = $("#"+id).find("strong").html();
		var len = pContent.replace(/[^\x00-\xff]/g,"xx").length;
		if(len <= 8){
			return;
		}else{
			$("#"+id).find("strong").remove();
			$("#"+id).append("<strong><MARQUEE SCROLLAMOUNT='3' HSPACE='6' SCROLLDELAY='3' behavior='scroll'>"+pContent+"</MARQUEE>&nbsp;<wbr></strong>");
		}
	}
	function hidAllTitle(e){
		var id = e.attr("id");
		if($("#"+id).find("MARQUEE").html()==null){
			return;
		}else{
			var pContent = $("#"+id).find("MARQUEE").html();
			$("#"+id).find("strong").remove();
			$("#"+id).append("<strong>"+pContent+"</strong>");
		};
	}
	function changeCurrUrl(){
		//修改bug,由于搜索导演和演员以后返回焦点位置有问题
		var urls = BrowserStorage.api.get("urlGoStep").value.split("###");
		if(urls[0].indexOf("&jumpUrl")>0 && urls[0].indexOf("&ids=")>0){
			return;
		}
		var url1 = "";
		var objs = $(".epgcontainer") || [];
		var ids =[];
		var xs =[];
		var ys=[];
		for(var i=0;i<objs.length;i++){ 
			ids.push(objs[i].id);
			xs.push(ekey.ckey[objs[i].id].getx());
			ys.push(ekey.ckey[objs[i].id].gety());
		}
		url1 += "&ids="+ids.join("|")+"&x="+xs.join("|")+"&y="+ys.join("|")+"&currId="+ekey.currentContainer.attr.id;
//		var urls = store.get("urlGoStep").split("###");
		urls[0] = tool.url2json2delete2url(urls[0],"ids&x&y&currId")+url1;
//		store.set("urlGoStep", urls.join("###"));
		BrowserStorage.api.set({
			"key" : "urlGoStep",
			"value" : urls.join("###")
		});
	}