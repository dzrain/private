 	 
 	 //shimiao 20141009 设置下一页
     ekey.ready(".epgcontainer", function(){
 	 var c = ekey.ckey["contentList"];
     ekey.ckey["contentList"].addEvent(c.BCRE, function() {
     	if($("#contentList").find("ul").attr("page") == $("#contentList").find("ul").attr("PageCount") && $("#contentList").find("ul").attr("page")!=1){
	        goPage(1);
     	}else if($("#contentList").find("ul").attr("PageCount")!=1){
	        var page = parseInt($("#contentList").find("ul").attr("page"))+1;
	        goPage(page);
        }
     });
     ekey.ckey["contentList"].addEvent(c.BCLE, function() {
    	 if($("#contentList").find("ul").attr("page") != $("#contentList").find("ul").attr("PageCount") && $("#contentList").find("ul").attr("page")==1){
     		 var page = parseInt($("#contentList").find("ul").attr("PageCount"));
     		goPage(page);
     	}else if($("#contentList").find("ul").attr("page")!=1){
	        var page = parseInt($("#contentList").find("ul").attr("page"))-1;
	        goPage(page);
        }
    	 
     });
      ekey.ckey["cate"].addEvent(c.BCUPE, function() {
     	var isNoData =document.getElementById("noData").style.display != "none"?true:false;
     	if(isNoData){
     		ekey.ckey["box_nav"].cFocus();
     	}else{
     		ekey.ckey["contentList"].cFocus();
        }
    });
    ekey.ckey["box_nav"].addEvent(c.BCDE, function() {
        var isNoData =document.getElementById("noData").style.display != "none"?true:false;
        if(isNoData){
        	ekey.ckey["cate"].cFocus();
        }else{
        	ekey.ckey["contentList"].cFocus();
        }
    });
    //initMeun(ekey.ckey["cate"], "cate_roll");
    //initMeun(ekey.ckey["RollContainer"], "RollContainer_roll");
    //initMeun(ekey.ckey["date"], "date_roll");
    //initMeun(ekey.ckey["type"], "type_roll");
    setXYForDocument();
  //shimiao 添加pv
    pv.curKind='retrieve';
    pv.channelCD='';
    pvajax("'kind':'retrieve','type':'1'");
});
     
	 function showStartPage(e){
		var params = combinUrl(e.attr("parentId"));
		params += "&"+e.attr("type")+"=";
		 $("#"+e.attr("parentId")).find("dd").attr("class","current").attr("hasClass","");
		 e.attr("class","currents");
		 isStart = true;
		 $("#loading").show();
		 var mtype= $("#cate_roll").attr('mtype');
		 $("#contentList").attr("url","../searching/search.action?typekey=5&column="+column+params+"&mtype="+mtype);
		 var url = "../searching/search.action?page=1&typekey=5&column="+column+params+"&mtype="+mtype;
		  $.ajax({
				url:url,
				dataType:"json", 
				success: function(data){
					data =$.parseJSON(data);
		        	combinHtml(data,false);
		        	$("#loading").hide();
		        	
		        	//pv汇报
					track.pv(url);
		        },
		        error:function(){
		        	combinHtml(null,true);
		        }
		    });
	        e.attr('class','currenta');
	        e.attr('hasClass','currents');
	 }
	 function setkeystr(e){
		var id= e.attr("parentId");
	 	$("#"+id).find("dd").attr("class","current").attr("hasClass","");
	 	var parems = combinUrl(id);
	 	var type=e.attr("type");
	 	var name=e.attr("acName");
	 	parems += "&" +type +"="+ name;
	 	$("#loading").show();
	 	var mtype= $("#cate_roll").attr('mtype');
	 	$("#contentList").attr("url","../searching/search.action?typekey=5"+parems+"&mtype="+mtype);
	 	var url = "../searching/search.action?page=1&typekey=5&column="+column+parems+"&mtype="+mtype;
	 	$.ajax({
			url:url,
			dataType:"json", 
			success: function(data){
				data =$.parseJSON(data);
			    combinHtml(data,false);
			    isStart = false;
			    $("#loading").hide();
			    
			    //pv汇报
				track.pv(url);
			},
	        error:function(){
	        	combinHtml(null,true);
	        }
		});
		e.attr('class','currenta');
		e.attr('hasClass','currents');
	 }
	 
	 
	 function goPage(page){
		 pvajax("'kind':'"+pv.curKind+"','page':'"+page+"','type':'1'");
		 var isno = document.getElementById("noData").style.display != "none"?true:false;
		 if(isno){
			 return;
		 }
		 var mtype= $("#cate_roll").attr('mtype');
		 var url = $("#contentList").attr("url");
		 if(url == ""){
			 url ="../searching/search.action?page="+page+"&typename="+name+"&typekey="+type+"&column="+column+"&mtype="+mtype;
		 }else{
			 url+= "&page="+page+"&column="+column+"&mtype="+mtype;
		 }
		 $("#loading").show();
	    	if(isStart){
	    		var obj = $(".main .currents");
	    		var style=obj.eq(2).find('strong').text() == "全部" ? "" : obj.eq(2).find('strong').text();
	    		var zone=obj.eq(1).find('strong').text() == "全部" ? "" : obj.eq(1).find('strong').text();
	    		var time=obj.eq(3).find('strong').text() == "全部" ? "" : obj.eq(3).find('strong').text();
	    		url = "../searching/search.action?typekey=5&column="+column+"&style="+style+"&zone="+zone+"&time="+time+"&page="+page+"&pagesize=6&mtype="+mtype;
		        $.ajax({
				url:url,
				dataType:"json", 
				success: function(data){
		        	if(data){
		        		data =$.parseJSON(data);
		        	}
		        	combinHtml(data,true);
		        	$("#loading").hide();
		        	
		        	//pv汇报
					track.pv(url);
		        },
		        error:function(){
		        	combinHtml(null,true);
		        }
		        });
	      }else{
		 	  $.ajax({
				url:url,
				dataType:"json", 
				success: function(data){
				   data =$.parseJSON(data);
				   combinHtml(data,true);
				   $("#loading").hide();
				   
					//pv汇报
					track.pv(url);
				},
		 	 error:function(){
		 		combinHtml(null,true);
		        }
			});
	      }  
	 }
	 //shimiao 移除鼠标时，标记存在
	 function showClass(e){
	 	var hasClass = e.attr("hasClass");
	 	if(hasClass !=null && hasClass!=""){
	 		e.attr("class",hasClass);
	 	}
	 }
	 function goInfo(mid,icoId, mtype){
		$('#loading').show();
		pvajax("'lastkind':'"+pv.curKind+"','kind':'view','channelCD':'"+pv.channelCD+"','mid':'"+mid+"','type':'1'");
		var url="../filmInfo/mid.action?page=1&mid="+mid+"&icoId="+icoId + "&mtype=" + mtype;
		addUrl(url);
	}
	
	function goSearchUrl(e){
	  var mtype=e.attr("mtype");
	  $("#contentList").attr("url","");
	  isStart = true;
 	 $("#loading").show();
 	 	var url = "../searching/indexValue.action?mtype="+mtype;
		$.ajax({
			url:url,
			dataType:"json", 
			success: function(data){
		 	   $(".main_roll").find("dd").attr("class","current").attr("hasClass","");
	        	var dataAll =$.parseJSON(data);
	        	column = dataAll.column;
	        	cate = dataAll.cate;
	        	icoId = dataAll.icoId;
	        	data = dataAll.filmClass;
	        	$("#cate_roll").attr('mtype',mtype);
			    combinHtml(data,false);
			    e.attr('class','currenta');
				e.attr('hasClass','currents');
				//shimiao 20141009 地区
				$("#RollContainer").find("dd").remove();
				var htmlLab1='<dd class="current"  ac="setkeystr"  be="showClass" pCount="7" type="zone" parentId="RollContainer" acName="" parentClass="RollContainer_main_roll" fe="changePosition"><strong>全部</strong></dd>';
				var lableClass2 = dataAll.lableClass2;
				for(var i=0;i<lableClass2.label.length;i++){
					if(i<1){
						for(var j=0;j<lableClass2.label[i].labelName.length;j++){
							var labelName = lableClass2.label[i].labelName[j];
							htmlLab1 +='<dd class="current" be="showClass" ac="setkeystr" type="zone" acName="'+labelName+'" pCount="7" parentId="RollContainer" parentClass="RollContainer_main_roll" fe="changePosition"><strong>'+labelName+'</strong></dd>';
						}
					}
				}
				//alert(htmlLab1);
				$("#RollContainer").find("div").append(htmlLab1);
				 ekey.ckey["RollContainer"].ReRender();
//				 document.getElementById("RollContainer_roll").scrollLeft = "0";、
				 document.getElementById("RollContainer_main_roll").style.marginLeft = "0px";
				 //shimiao 20141009  类型
				$("#type").find("dd").remove();
				var htmlLab2='<dd class="current" ac="setkeystr" be="showClass" type="style" parentId="type" acName="" parentClass="type_main_roll" fe="changePosition"><strong>全部</strong></dd>';
				var lableClass = dataAll.lableClass;
				for(var i=0;i<lableClass.label.length;i++){
					if(i<1){
						for(var j=0;j<lableClass.label[i].labelName.length;j++){
							var labelName = lableClass.label[i].labelName[j];
							htmlLab2 +='<dd class="current" be="showClass" ac="setkeystr" type="style" acName="'+labelName+'" pCount="7" parentId="type" parentClass="type_main_roll" fe="changePosition"><strong>'+labelName+'</strong></dd>';
						}
					}
				}
				$("#type").find("div").append(htmlLab2);
				 ekey.ckey["type"].ReRender();
				 document.getElementById("type_main_roll").style.marginLeft = "0px";
				 
				  //shimiao 20141009  年份
				$("#date").find("dd").remove();
				var htmlLab1='<dd class="current" ac="setkeystr" be="showClass" type="time" parentId="date" acName="" parentClass="date_main_roll" fe="changePosition"><strong>全部</strong></dd>';
				var lableClass2 = dataAll.lableClass2;
				for(var i=0;i<lableClass2.label.length;i++){
					if(i==1){
						for(var j=0;j<lableClass2.label[i].labelName.length;j++){
							var labelName = lableClass2.label[i].labelName[j];
							htmlLab1 +='<dd class="current" be="showClass" ac="setkeystr" type="time" acName="'+labelName+'" pCount="7" parentId="date" parentClass="date_main_roll" fe="changePosition"><strong>'+labelName+'</strong></dd>';
						}
					}
				}
				$("#date").find("div").append(htmlLab1);
				ekey.ckey["date"].ReRender();
//				document.getElementById("date_roll").scrollLeft = "0";
				document.getElementById("date_main_roll").style.marginLeft = "0px";
				$("#loading").hide();
				$('.main_roll dd[acName=""]').attr('class','currents');
				
				//pv汇报
				track.pv(url);
	        },
	        error:function(){
	        	
	        }
	        });
	}
	 function combinHtml(data,isFocus){
		$("#loading").hide();
	 	if(data!=null && data.filmCount !=null && data.filmCount >0){
	 		$("#noData").hide();
	 		$("#contentList").show();
		    $("#contentList").find("ul").remove();
		    var htmls = '<ul page="'+data.pageIndex+'" PageCount="'+data.pageCount+'"><span class="arrows_left"></span>';
		    for(var i=0;i<data.film.length;i++){
		    	 htmls += '<li class="current" oc="goInfo(\''+data.film[i].mid+'\',\'\',\''+data.film[i].mtype+'\')"  fe="showTitle" id="'+data.film[i].mid+'" be="hidTitle"><strong><img mid="' + data.film[i].mid + '" original="'+data.film[i].imgUrl+'"  src="../style/images_html/loging350-520.jpg"  /></strong><p htmlp="'+data.film[i].filmName+'" >'+subStr(data.film[i].filmName,12)+'</p></li>';
		    }
		    htmls +='<span class="arrows_right"></span></ul>';
		    $("#contentList").append(htmls);
		    $("#contentList").attr('pageIndex',data.pageIndex);
		    $("#contentList").attr('pageCount',data.pageCount);
		    ekey.ckey["contentList"].ReRender();
		    if(isFocus){
		    	ekey.ckey["contentList"].cFocus();
		    }
	 	}else{
	 		$("#noData").show();
	 		$("#contentList").hide();
	 		$("#contentList").find("ul").remove();
	 	}
	 }
	 function combinUrl(parentId){
	 	var params = "";
	 	if(parentId == "date"){
	 		var zone = $("#RollContainer dd[class='currents']").attr("acName");
	 		var style = $("#type dd[class='currents']").attr("acName");
	 		params += "&style=";
	 		params += style==undefined||style==null?"":style;
	 		params += "&zone=" ;
	 		params += zone==undefined||zone==null?"":zone;
	 	}else if(parentId == "type"){
		 	var time = $("#date dd[class='currents']").attr("acName");
		 	var zone = $("#RollContainer dd[class='currents']").attr("acName");
		 	params += "&time=";
	 		params += time==undefined||time==null?"":time;
	 		params += "&zone=";
	 		params +=  zone==undefined||zone==null?"":zone;
	 	}else if(parentId == "RollContainer"){
		 	var time = $("#date dd[class='currents']").attr("acName");
		 	var style = $("#type dd[class='currents']").attr("acName");
		 	params += "&time=" ;
	 		params +=  time==undefined||time==null?"":time;
	 		params += "&style=";
	 		params += style==undefined||style==null?"":style;
	 	}
	 return params;
	 }
	 function changePosition(e){
			var elm = e.get(0);
			var oh = elm.offsetHeight;
			var ow = elm.offsetWidth;
			var ot = elm.offsetTop;
			var ol = elm.offsetLeft;
			var parentClass= e.attr("parentClass");
			var obj = document.getElementById(parentClass);
			var left = parseInt(obj.style.marginLeft==null || obj.style.marginLeft =="" ? 0:obj.style.marginLeft);
			if((ol+ow-left)>(980)){
				if((ol+ow)>(980)){
					obj.style.marginLeft =  (left - ow)+"px" ;
				}else{
					obj.style.marginLeft =  (left + ow)+"px" ;
				}
			}else{
				obj.style.marginLeft = "0px";
			}
		}