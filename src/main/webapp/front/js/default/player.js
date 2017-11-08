var player = {
	/**
	 * 是否收藏
	 * @param mid
	 * @param filmName
	 * @param ImgUrl
	 * @param Mtype
	 * @param sid
	 */
	favo:function(mid, filmName, ImgUrl, Mtype, sid) {
		var collectMsg = $("#collect")[0].innerText || $("#collect").text();
		if (collectMsg == "取消收藏") {
			player.cancelCol(mid, sid, $.noop);
		} else {
			$("#loading").show();
			this.sendAjaxUrl("../collect/add.action?uid=0&mid="+mid+"&filmName="+encodeURIComponent(encodeURIComponent(filmName))
					+"&version=3.0&imgUrl="+encodeURIComponent(ImgUrl)+"&mtype="+Mtype,  function(data) {
				if (data == 1) { //提示收藏成功
					$("#collect")[0].innerHTML = "取消收藏";
					alert("收藏成功！");
				} else { //提示收藏失败
					alert("收藏失败！");
				}
				$("#loading").hide();
			});
		}
		
	},
	/**
	 * 详情页加载收藏状态
	 */
	onloadCollect:function(filmmid){
		 $.ajax({
				url:"../filmInfo/collectionStatus.action?filmmid="+filmmid,
				dataType:"json", 
				success: function(res){
					res = eval('('+res+')');
					var data = res.root;
					if (data.error == 1 && data.result == 1) {
						$("#collect")[0].innerHTML = '取消收藏';
					}
				},
				error:function(data){
					console.log("错误："+data.status);
				}
			});
	},
	
	/**
	 * 删除收藏记录
	 * */  
	delCol:function(mid, page) {
		dialog.show('确定要删除？ ',
			[{"icon":"确定", "type":"0"},{"icon":"取消", "type":"1"}],
			function(type) {
				if (type =="0") {
					var url = "../collect/del.action?mid="+mid+"&page="+page+"&pagesize=5";
					$("#loading").show();
					$.ajax({"url":url, complete: $.noop,
						success:function(data){
							//0代表删除成功
							if (data == "0") {
								//只有一条的记录下
								if ($("#his_bot>ul>div>ul>dd").length == 1) {
									//如果是第一页的话，，则直接跳转到无记录页面
									if (page == 1) {
										viewCollect(1, 5);
									} else {
										//请求上一页数据
										goPage(page - 1);
									}
								} else {
									//其它情况，则重新请求一下数据
									goPage(page);
								}
							} else {
								alert("删除失败！");
							}
							$("#loading").hide();
						}
					});
				}
			});
	},
	
	/**
	 * 删除全部收藏记录
	 */
	delAllCol : function() {
		dialog.show('确定要全部删除？ ',
				[{"icon":"确定", "type":"0"},{"icon":"取消", "type":"1"}],
				function(type) {
					if (type == "0") {
						var url = "../collect/delAll.action";
						$("#loading").show();
						$.ajax({"url":url, complete: $.noop,
							success:function(data){
								if (data == "0") {
									//跳转到无收藏记录页面
									viewCollect(1, 5);
								} else {
									alert("清空失败！");
								}
								$("#loading").hide();
							}
						});
					}
				});
	},
	
	/**
	 * 取消收藏记录
	 * */  
	cancelCol:function(mid, page) {
		dialog.show('确定要取消收藏记录？ ',
			[{"icon":"确定", "type":"0"},{"icon":"取消", "type":"1"}],
			function(type) {
				if (type == "0") {
					var url = "../collect/del.action?mid="+mid+"&page="+page+"&pagesize=5";
					$("#loading").show();
					$.ajax({"url":url, complete: $.noop,
						success:function(data){
							if(data == "0"){
								$("#collect")[0].innerHTML = "收藏";
							}else{
								alert("取消收藏失败！");
							}
							$("#loading").hide();
						}
					});
				}
			});
	},
	
	/**
	 * 删除观看记录
	 * */
	delRec:function(mid, sid, fid, page) {
		dialog.show('确定要删除？ ',
			[{"icon":"确定", "type":"0"},{"icon":"取消", "type":"1"}],
			function(type) {
				if (type == "0") {
					var url = "../record/del.action?mid="+mid+"&page="+page+"&pagesize=5"+"&sid="+sid+"&fid="+fid;
					$("#loading").show();
					$.ajax({"url":url, complete: $.noop,
						success:function(data){
							//返回0，说明删除成功
							if (data == "0") {
								//只有一条的记录下
								if ($("#his_bot>ul>div>ul>dd").length == 1) {
									//如果是第一页的话，，则直接跳转到无记录页面
									if (page == 1) {
										viewRecords(1, 5);
									} else {
										//请求上一页数据
										goPage(page - 1);
									}
								} else {
									//其它情况，则重新请求一下数据
									goPage(page);
								}
							} else {
								alert("删除失败！");
							}
							$("#loading").hide();
						}
					});
				}
			});
	},
	
	/**
	 * 删除全部观看记录
	 * */
	delAllRec:function(mid, page) {
		dialog.show('确定要全部删除？ ',
			[{"icon":"确定", "type":"0"},{"icon":"取消", "type":"1"}],
			function(type) {
				if (type == "0") {
					var url = "../record/delAll.action";
					$("#loading").show();
					$.ajax({"url":url, complete: $.noop,
						success:function(data){
							//返回0，删除成功，否则失败
							if (data == "0") {
								//跳转到无观看记录页面
								viewRecords(1, 5);
							} else {
								alert("清空失败！");
							}
							$("#loading").hide();
						}
					});
				}
			});
	},

	formatDate:function(time) {
		return (new Date(0, 0, 0, 0, 0, time)).toTimeString().split(" ")[0];
	},

	sendAjaxUrl:function(url, fun) {
		$.ajax({"url":url, complete: $.noop,
			success:fun, context:this
		});
	}
};

var dialog = {
	_callback:null,
	show:function(msg, conf, fun) {
		var str = "";
		$("#msg").html(msg);
		for(var i = 0, L = conf.length; i < L; i++) {
			var tmp = conf[i];
			str +='<li class="current" datatype="'+tmp.type+'" ac="dialog.execute">'+tmp.icon+'</li>';
		}
		$("#setbtn").html(str);
		ekey.ckey["ConnectionPlay"].ReRender();
		ekey.alert("ConnectionPlay");
		dialog._callback = fun;
		//hook [取消]按纽默认获取焦点
		var length = conf.length;
		if (length == 2) {
			for (var i = 0; i < length; i++) {
				var o = conf[i];
				var icon = o.icon;
				var type = o.type;
				if (icon == "取消" && parseInt(type) == 1) {
					ekey.currentContainer.set(1,0);
					break;
				}
			}
		}
	},

	//先消失弹出框，再回调用户的代码
	execute:function(e) {
		ekey.ckey["ConnectionPlay"][keyMap.backKey]();
		dialog._callback(e.attr("datatype"));
	}
};

//模拟alert弹窗
function alert(context, fun) {
	dialog.show(context,
			[{"icon":"确定", "type":"1"}],
			function(type) {
				if(type == "1"){
					fun && fun();
				}
			}
	);
}
	