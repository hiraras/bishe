var domain = 'http://localhost';
var fileDataArr = [];
var fileDataArr2 = [];
(function(){
	var pageUrl = window.location.href;
	var postId = '';
	var urlParams = pageUrl.substr(pageUrl.indexOf('?')+1).split('&');
	if(pageUrl.indexOf('postId') == -1){
		window.location.href = domain + '/pro/index.html';
		return ;
	}
	for(var i=0;i<urlParams.length;i++){
		if(urlParams[i].indexOf('postId') !== -1){
			postId = urlParams[i].substr(urlParams[i].indexOf('=')+1);
		}
    }
    //因为没有输入标题栏所以要上面一些
    $('#faceContainer').css('top','94px');
    $('#notLoginTip').css('top','92px');
	$('#search').attr('maxlength',80);
	$('#search').val('');
	searchPostMsg(postId);
}());

function init(){
	//设置帖子中图片点击放大
	// $('.post_img').click(resizeImg);
	//初始化发表部分按钮点击事件
	initSendAreaBtnsPressEvent();

	$('#submit').click(function(){
		var userId = localStorage.getItem('user');
		$.ajax({
			type: 'get',
			url: domain + '/pro/php/isCantSpeak.php',
			async: true,
			data: {
				userId: userId
			},
			success: function(result){
				result = JSON.parse(result);
				if(result){
					alert('您已被禁言!');
				}else{
					onSubmitReplyMsg();
				}
			}
		});
	});

	$('#submit2').click(function(){
		var userId = localStorage.getItem('user');
		$.ajax({
			type: 'get',
			url: domain + '/pro/php/isCantSpeak.php',
			async: true,
			data: {
				userId: userId
			},
			success: function(result){
				result = JSON.parse(result);
				if(result){
					alert('您已被禁言!');
				}else{
					onSubmitReplyMsg2();
				}
			}
		});
	});
	//如果未登录不允许发帖
	if(!!localStorage.getItem('user')){
		$('#editorArea').attr('contenteditable','true');
		$('#notLoginTip').css('display', 'none');
        $('#submit').attr('disabled',false);
        $('#submit').css('background','#00a9cd');
	}else{
		$('#editorArea').attr('contenteditable','false');
		$('#notLoginTip').css('display', 'block');
        $('#submit').attr('disabled',true);
        $('#submit').css('background','gray');
	}
	//测试页面刷新或关闭，删除掉已经保存到本地的图片文件
	//结果直接关闭浏览器的话不会执行
	window.onbeforeunload = function(){
		for(var i=0;i<fileDataArr.length;i++){
			removeNotNeedImg(fileDataArr[i]);
		}
	}
	
	//测试页面刷新或关闭，删除掉已经保存到本地的图片文件
	//结果直接关闭浏览器的话不会执行
	window.onbeforeunload = function(){
		for(var i=0;i<fileDataArr2.length;i++){
			removeNotNeedImg(fileDataArr2[i]);
		}
    }
    
}

function getReplyedName(){
	var user = localStorage.getItem('user');
    if(!user){
        alert('登录后才能发表回复!');
    }else{
		var replyederNickName = $(this).parent().siblings('.reply_text').find('.replyer').html();
		replyederNickName = replyederNickName.substring(0,replyederNickName.length-1);
		$(this).closest('.reply_item').siblings('.reply_area').find('.reply_editor_area').html('回复 '+replyederNickName+':');
	}
}
//未登录状态回复则显示未登录提示
function replyToReplyNotLoginTip(){
    var user = localStorage.getItem('user');
    if(!user){
        alert('登录后才能发表回复!');
        $(this).blur();
    }
}

//发送评论的评论
function sendReplyToReply(){
    var content = $(this).siblings('.reply_editor_area').html().trim();
    var postId = $('#postTitle').attr('postId');
    var position = $(this).closest('.comment').attr('position');
    var replyerId = localStorage.getItem('user');
    var replyerNickName = localStorage.getItem('userNickName');
    var replyerHeadImg = localStorage.getItem('headImg');
    $that = $(this);
    if(isLogin()){
        if(content != ''){
            $.ajax({
                type: 'post',
                url: domain + '/pro/php/sendReplyToReply.php',
                async: true,
                data: {
                    postId: postId,
                    content: content,
                    position: position,
                    replyerId: replyerId,
                    replyerNickName: replyerNickName,
                    replyerHeadImg: replyerHeadImg
                },
                success: function(result){
                    if(result == 'success'){
						$that.siblings('.reply_to_reply_send_tip').html('发布成功');
                        $that.siblings('.reply_to_reply_send_tip').css('display','inline');
                        setTimeout(function(){
                            window.location.reload();
                        },300);
                    }else{
                        alert('未知原因,发布失败!');
                    }
                }
            });
        }else{
            //未输入内容
			   $(this).siblings('.reply_to_reply_send_tip').html('内容为空');
			   $(this).siblings('.reply_to_reply_send_tip').css('display','inline');
        }
    }else{
        alert('请先登录!');
    }
}

function getPostReplysMsg(postId, indexNum){
	$.ajax({
		type: 'get',
		url: domain + '/pro/php/getPostReplys.php',
		async: true,
		data: {
			postId: postId,
			indexNum: indexNum
		},
		success: function(result){
			try{
				var data = JSON.parse(result);
				console.log(data);
				freshPageReplyItems(data,indexNum);
			}catch(e){
				console.log(result);
				alert('未知错误');
			}

		}
	});
}

function getPostReplyToReplyMsg(postId, indexNum, position){
	console.log(postId, indexNum, position);
	var that = this;
	$.ajax({
		type: 'get',
		url: domain + '/pro/php/getReplyToReplyMsg.php',
		async: true,
		data: {
			postId: postId,
			indexNum: indexNum,
			position: position
		},
		success: function(result){
			try{
				var data = JSON.parse(result);
				// console.log(data);
			}catch(e){
				console.log(result);
				console.log(e);
			}
			freshPageReplyToReplyItems.call(that, data, indexNum);
		}
	});
}

function searchPostMsg(postId){
	$.ajax({
		type: 'get',
		url: domain + '/pro/php/getPostMasterMsg.php',
		async: true,
		data: {
			postId: postId
		},
		success: function(result){
            try{
                var data = JSON.parse(result);
            }catch(e){
				console.log(e);
                return ;
            }
			if(data.result == 'success'){
				console.log(data);
				if(data.data.master == localStorage.getItem('user')){
					$('#postOptionBtnContainer').css('display','block');
					$('#toTopBtn').click(function(){
						toTopBtnPressHandle();
					});
					$('#toGreatBtn').click(function(){
						toGreatBtnPressHandle();
					});
					$('#deletePostBtn').click(function(){
						var msg = prompt('请输入你删除帖子的理由');
						if(msg == null || msg == ''){
							return ;
						}
						deletePostBtnPressHandle(msg);
					});
					$('#addToCompetitiveBtn').click(function(){
						toCompetitiveBtnPressHandle();
					});
					if(Number(data.data.isTop) == 0){
						$('#toTopBtn').html('置顶');
						$('#toTopBtn').attr('isTop','0');
					}else{
						$('#toTopBtn').html('取消置顶');
						$('#toTopBtn').attr('isTop','1');
					}
					if(Number(data.data.isGreat) == 0){
						$('#toGreatBtn').html('加精');
						$('#toGreatBtn').attr('isGreat','0');
					}else{
						$('#toGreatBtn').html('取消加精');
						$('#toGreatBtn').attr('isGreat','1');
					}
					if(Number(data.data.isBelongCompetitive) == 0){
						$('#addToCompetitiveBtn').html('加入精品区');
						$('#addToCompetitiveBtn').attr('isBelongCompetitive','0');
					}else{
						$('#addToCompetitiveBtn').html('从精品区删除');
						$('#addToCompetitiveBtn').attr('isBelongCompetitive','1');
					}
				}else{
					$('#postOptionBtnContainer').css('display','none');
				}
                // sessionStorage.setItem('barName',data.data.barBelong);
                $('#postTitle').html(data.data.postName);
				$('#creatorHeadImg').attr('src',data.data.creatorHeadImg);
				$('#creatorHeadImg').click(function(){
					window.location.href = "http://localhost/pro/page/personal_space.html?userId="+ data.data.creatorId;
				});
                $('#creatorNickName').html(data.data.nickname);
                $('#commentText').html(data.data.postContent);
                $('#creatorPostTime').html(isToday(data.data.createTime)?data.data.createTime.substr(11):data.data.createTime.substr(0,10));
				$('#postTitle').attr('postId',postId);
				$('#postTitle').attr('postCreatorId',data.data.creatorId);
				$('#postTitle').attr('barBelong',data.data.barBelong);
				$('#postTitle').attr('barMaster',data.data.master);
				$('.master_comment').attr('position',1);
				$('#userLevel').html('等级:' + getLv(data.data.exp));
				$('#cancelSubmit2').click(function(){
					$('#editMask').css('display','none');
				});
				$('#closeHistory').click(function(){
					$('#editMask').css('display','none');
				});
				getEditBtnStatus(data.data.creatorId, 1, $('#masterEditBtn'), 0);
				getPostReplysMsg(postId, 0);
				initPagingIndexClick(postId);
				init();
            }else if(data.result == 'notExist'){
				//帖子不存在
				$('#main').css('display','none');
				$('#postNotExistTip').css('display','block');
				setTimeout(function(){
					alert('帖子不存在');
				},300);
				return ;
			}
		}
	});
}

function getEditBtnStatus(creatorId, position, ele, type){
	var postId = $('#postTitle').attr('postId');
	var userId = localStorage.getItem('user');
	position = Number(position);
	$.ajax({
		type: 'get',
		url: domain + '/pro/php/getEditStatus.php',
		async: true,
		data: {
			postId: postId,
			position: position,
			type: type
		},
		success: function(result){
			try{
				var data = JSON.parse(result);
				if(creatorId == userId){
					ele.html('编辑');
					ele.click(function(){
						$('#editMask').css('display','block');
						$('#sendArea2').css('display','block');
						$('#editMask').attr('position', position);
						$('#editMask').attr('type', type);
						$('#onlyWatchArea').css('display','none');
						createHistoryEditContent(data);
					});
				}else{
					if(data.num == 0){
						ele.css('display','none');
					}else{
						ele.html('查看历史('+data.num+')');
						ele.click(function(){
							$('#editMask').css('display','block');
							$('#sendArea2').css('display','none');
							$('#onlyWatchArea').css('display','block');
							createHistoryEditContent(data);
						});
					}
				}
			}catch(e){
				console.log(result);
				alert('未知错误');
			}
		}
	});
}

function createHistoryEditContent(data){
	$('#historyContainer').children().remove();
	for(var i=0;data.num != 0 && i<data.data.length;i++){
		var item = createHistoryEditItem(data.data[i]);
		$('#historyContainer').append(item);
	}
	var positionItem = createHistoryEditItem(data.positionData);
	$('#historyContainer').append(positionItem);
}

function createHistoryEditItem(data){
	var div = $('<div></div>');
	div.addClass('history_item');
	var content = $('<p></p>');
	content.addClass('history_item_content');
	content.html(data.editContent);
	var time = $('<p></p>');
	time.addClass('history_item_time');
	var timeStr = '';
	if (isToday(data.editTime)) {
		timeStr = data.editTime.substr(11);
	} else {
		timeStr = data.editTime.substr(0, 10);
	}
	time.html(timeStr);
	div.append(content);
	div.append(time);
	return div;
}

function toTopBtnPressHandle(){
	var postId = $('#postTitle').attr('postId');
	var status = Number($('#toTopBtn').attr('isTop'));
	$.ajax({
		type: 'post',
		url: domain + '/pro/php/setPostIsTopStatus.php',
		async: true,
		data: {
			postId: postId,
			status: status
		},
		success: function(result){
			if(result == 'success'){
				alert('操作成功');
				if(status == 0){
					$('#toTopBtn').html('取消置顶');
					$('#toTopBtn').attr('isTop','1');
				}else{
					$('#toTopBtn').html('置顶');
					$('#toTopBtn').attr('isTop','0');
				}
			}else{
				console.log(result);
				alert('发生未知错误');
			}
		}
	});
}

function toGreatBtnPressHandle(){
	var postId = $('#postTitle').attr('postId');
	var status = Number($('#toGreatBtn').attr('isGreat'));
	$.ajax({
		type: 'post',
		url: domain + '/pro/php/setPostIsGreatStatus.php',
		async: true,
		data: {
			postId: postId,
			status: status
		},
		success: function(result){
			if(result == 'success'){
				alert('操作成功');
				if(status == 0){
					$('#toGreatBtn').html('取消加精');
					$('#toGreatBtn').attr('isGreat','1');
				}else{
					$('#toGreatBtn').html('加精');
					$('#toGreatBtn').attr('isGreat','0');
				}
			}else{
				console.log(result);
				alert('发生未知错误');
			}
		}
	});
}

function toCompetitiveBtnPressHandle(){
	var postId = $('#postTitle').attr('postId');
	var status = Number($('#addToCompetitiveBtn').attr('isBelongCompetitive'));
	$.ajax({
		type: 'post',
		url: domain + '/pro/php/setPostIsCompetitiveStatus.php',
		async: true,
		data: {
			postId: postId,
			status: status
		},
		success: function(result){
			if(result == 'success'){
				alert('操作成功');
				if(status == 0){
					$('#addToCompetitiveBtn').html('从精品区删除');
					$('#addToCompetitiveBtn').attr('isBelongCompetitive','1');
				}else{
					$('#addToCompetitiveBtn').html('加入精品区');
					$('#addToCompetitiveBtn').attr('isBelongCompetitive','0');
				}
			}else{
				console.log(result);
				alert('发生未知错误');
			}
		}
	});
}

function deletePostBtnPressHandle(msg){
	var postId = $('#postTitle').attr('postId');
	var postCreatorId = $('#postTitle').attr('postCreatorId');
	$.ajax({
		type: 'post',
		url: domain + '/pro/php/deletePost.php',
		async: true,
		data: {
			postId: postId,
			msg: msg
		},
		success: function(result){
			if(result == 'success'){
				window.history.back();
			}else{
				alert('发生未知错误');
			}
		}
	});
}

function initSendAreaBtnsPressEvent(){
	$('.face').click(function(){
		if(isEditorAreaBlur()){
			var $img = $(this).clone();
			$img.removeAttr('class');
			insertHTML($img,$('#editorArea'));
			$('#faceContainer').css('display','none');
		}
	});
	$('#sendArea2 .face').click(function(){
		if(isEditorAreaBlur2()){
			var $img = $(this).clone();
			$img.removeAttr('class');
			insertHTML($img,$('#editorArea2'));
			$('#faceContainer2').css('display','none');
		}
	});
	//头像框存在时，如果点击外面部分则消失
	$('html').click(function(e){
		e = e || window.event;
		var target = e.target || window.srcElement;
		if(!($(target).hasClass('face_container') || $(target).attr('id') === 'selectFace')){
			if($('#faceContainer').css('display') === 'block'){
				$('#faceContainer').css('display','none');
			}
		}
	});

	//头像框存在时，如果点击外面部分则消失
	$('html').click(function(e){
		e = e || window.event;
		var target = e.target || window.srcElement;
		if(!($(target).hasClass('face_container') || $(target).attr('id') === 'selectFace2')){
			if($('#faceContainer2').css('display') === 'block'){
				$('#faceContainer2').css('display','none');
			}
		}
	});

	$('#selectFace').click(function(){
		if($('#faceContainer').css('display') === 'block'){
			$('#faceContainer').css('display','none');
		}else{
			$('#faceContainer').css('display','block');
		}
	});
	$('#selectImg').click(function(){
		if(!!localStorage.getItem('user')){
			$('#inputSelectImg').click();
		}else{
			alert('请先登录');
		}
	});

	$('#selectFace2').click(function(){
		if($('#faceContainer2').css('display') === 'block'){
			$('#faceContainer2').css('display','none');
		}else{
			$('#faceContainer2').css('display','block');
		}
	});
	$('#selectImg2').click(function(){
		if(!!localStorage.getItem('user')){
			$('#inputSelectImg2').click();
		}else{
			alert('请先登录');
		}
	});
}
function imgChange(e){
	if(isEditorAreaBlur()){
		var fileType = e.target.files[0].type;
		if(fileType.indexOf('image') != -1){
			var reader = new FileReader();
			var file = document.getElementById('inputSelectImg').files[0];
			reader.readAsDataURL(file);
			reader.onload = function(e){
				var fileData = e.target.result;
				$.ajax({
					url: domain + "/pro/php/getTempImgFile.php",
					type: 'post',
					async: true,
					data: {
						fileData: fileData
					},
					success: function(result){
						var data = JSON.parse(result);
						if(data.result == 'success'){
							var $img = $('<img />');
							fileDataArr.push(data.filePath);
							$img.attr('src',data.filePath);
							insertHTML($img,$('#editorArea'));
							$('#editorArea').focus();
							$img.bind('DOMNodeRemoved',function(){
								removeNotNeedImg(data.filePath);
							});
						}else{
							alert('选择图片失败');
						}
					},
					error: function(e){
						console.log(e);
					}
				});
			}
		}else{
			alert('只能上传图片');
		}
	}else{
		console.log('焦点不是editorarea');
	}
}

function imgChange2(e){
	if(isEditorAreaBlur2()){
		var fileType = e.target.files[0].type;
		if(fileType.indexOf('image') != -1){
			var reader = new FileReader();
			var file = document.getElementById('inputSelectImg2').files[0];
			reader.readAsDataURL(file);
			reader.onload = function(e){
				var fileData = e.target.result;
				$.ajax({
					url: domain + "/pro/php/getTempImgFile.php",
					type: 'post',
					async: true,
					data: {
						fileData: fileData
					},
					success: function(result){
						var data = JSON.parse(result);
						if(data.result == 'success'){
							var $img = $('<img />');
							fileDataArr2.push(data.filePath);
							$img.attr('src',data.filePath);
							insertHTML($img,$('#editorArea2'));
							$('#editorArea2').focus();
							$img.bind('DOMNodeRemoved',function(){
								removeNotNeedImg(data.filePath);
							});
						}else{
							alert('选择图片失败');
						}
					},
					error: function(e){
						console.log(e);
					}
				});
			}
		}else{
			alert('只能上传图片');
		}
	}else{
		console.log('焦点不是editorarea2');
	}
}

function removeNotNeedImg(imgPath){
	$.ajax({
		type: 'get',
		url: domain + "/pro/php/removeTempImg.php",
		async: true,
		data: {
			imgPath: imgPath
		},
		success: function(result){
			console.log('remove '+result);
		}
	});
}
//点击发送按钮事件
function onSubmitReplyMsg(){
    var replyContent = $('#editorArea').html();
	if(replyContent.trim() != ''){
		$('#sendTip').css('display','none');
		if(fileDataArr.length != 0){
			$.ajax({
				url: domain + "/pro/php/saveTempReplyImg.php",
				type: 'post',
				async: true,
				data: {
					imgsData: fileDataArr
				},
				success: function(result){
					if(result == 'success'){
						submitReplyMsg();
					}else{
						alert('未知错误,图片保存失败!');
					}
				},
				error: function(e){
					console.log(e);
				}
			});
		}else{
			submitReplyMsg();
		}
	}else{
		$('#sendTip').css('display','inline');
	}
}

function onSubmitReplyMsg2(){
    var replyContent = $('#editorArea2').html();
	if(replyContent.trim() != ''){
		$('#sendTip2').css('display','none');
		if(fileDataArr2.length != 0){
			$.ajax({
				url: domain + "/pro/php/saveTempReplyImg.php",
				type: 'post',
				async: true,
				data: {
					imgsData: fileDataArr2
				},
				success: function(result){
					if(result == 'success'){
						submitReplyMsg2();
					}else{
						alert('未知错误,图片保存失败!');
					}
				},
				error: function(e){
					console.log(e);
				}
			});
		}else{
			submitReplyMsg2();
		}
	}else{
		$('#sendTip2').css('display','inline');
	}
}
//发送事件
function submitReplyMsg(){
	var postId = $('#postTitle').attr('postId');
	var creatorId = localStorage.getItem('user');
	var nickName = localStorage.getItem('userNickName');
	var replyContent = $('#editorArea').html().trim();
	var imgReg=/<img\b[^>]*>/ig;
	if(imgReg.test(replyContent)){
		var replaceReg = /postTempImg/g;
		replyContent = replyContent.replace(replaceReg, 'replyImg');
	}
    $('#sendTip').css('display','none');
    $.ajax({
        url: domain + "/pro/php/sendPostReplyMsg.php",
        type: 'post',
        async: true,
        data: {
            postId: postId,
            creatorId: creatorId,
            nickName: nickName,
            replyContent: replyContent
        },
        success: function(result){
            if(result == 'success'){
				$('#sendTip').css('display','inline').html('发布成功');
				setTimeout(function(){
					window.location.reload();
				},300);
				var postCreatorId = $('#postTitle').attr('postCreatorId');
				addExp(creatorId, 4, replyAddExpResult);
				if(creatorId != postCreatorId){
					addExpNoLimit(postCreatorId, 2, replyAddExpNotlimitResult);
				}
            }else{
                alert('未知错误,发布失败!');
            }
        },
        error: function(e){
            console.log(e);
        }
    });
}

function submitReplyMsg2(){
	var postId = $('#postTitle').attr('postId');
	var creatorId = localStorage.getItem('user');
	var nickName = localStorage.getItem('userNickName');
	var replyContent = $('#editorArea2').html().trim();
	var position = $('#editMask').attr('position');
	var type = $('#editMask').attr('type');
	position = Number(position);
	type = Number(type);
	var imgReg=/<img\b[^>]*>/ig;
	if(imgReg.test(replyContent)){
		var replaceReg = /postTempImg/g;
		replyContent = replyContent.replace(replaceReg, 'replyImg');
	}
    $('#sendTip2').css('display','none');
    $.ajax({
        url: domain + "/pro/php/sendPostReplyMsg2.php",
        type: 'post',
        async: true,
        data: {
            postId: postId,
            creatorId: creatorId,
            nickName: nickName,
			replyContent: replyContent,
			position: position,
			type: type
        },
        success: function(result){
            if(result == 'success'){
				$('#sendTip2').css('display','inline').html('发布成功');
				setTimeout(function(){
					window.location.reload();
				},300);
            }else{
                alert('未知错误,发布失败!');
            }
        },
        error: function(e){
            console.log(e);
        }
    });
}
//回复获得经验回调
function replyAddExpResult(result){
	if(result == 'success'){
		console.log('获得经验成功');
	}else if(result == 'isOver'){
		console.log('已超过今日可获得经验上限');
	}else{
		console.log('未知错误,获得经验失败!');
	}
}
//被回复获得经验回调
function replyAddExpNotlimitResult(result){
	if(result){
		console.log('楼主获得经验成功');
	}else{
		console.log('未知错误,楼主获得经验失败!');
	}
}

//在可编辑div中光标处插入对象(图片)
function insertHTML(eleContent,eleContainer){
	var sel, range;  
	if (window.getSelection){  
		// IE9 and non-IE  
		sel = window.getSelection();  
		if (sel.getRangeAt && sel.rangeCount){  
			range = sel.getRangeAt(0);  
			range.deleteContents();  
			var el = document.createElement('div');  
			var $el = $(el);
			$el.append(eleContent);
			var frag = document.createDocumentFragment(), node, lastNode;  
			while ((node = el.firstChild)){  
				lastNode = frag.appendChild(node);  
			}  
			range.insertNode(frag);
			if(lastNode){
				range = range.cloneRange();  
				range.setStartAfter(lastNode);  
				range.collapse(true);  
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}  
	}else if(document.selection && document.selection.type !='Control'){  
		eleContainer.focus(); //在非标准浏览器中 要先让你需要插入html的div 获得焦点  
		ierange= document.selection.createRange();//获取光标位置  
		ierange.pasteHTML(eleContent);    //在光标位置插入html 如果只是插入text 则就是fus.text="..."  
		eleContainer.focus();      
	}  
}  

function isEditorAreaBlur(){
	var sel, range, checkNode;  
	if (window.getSelection){  
		// IE9 and non-IE  
		sel = window.getSelection();
		if(sel.anchorNode){
			//如果是文本节点
			if(sel.anchorNode.nodeType == 3){
				checkNode = sel.anchorNode.parentNode;
			}else{
				checkNode = sel.anchorNode;
			}
			//当失去焦点的位置为editorArea或其子元素时，返回true
			if($(checkNode).closest('#editorArea').length == 1 && $(checkNode).closest('#editorArea').attr('id') == 'editorArea'){
				return true;
			}else{
				//焦点位置不在editorArea，插入失败
				return false;
			}
		}else{
			console.log('sel.anchorNode为null');
		}
	}
	return true;
}

function isEditorAreaBlur2(){
	var sel, range, checkNode;  
	if (window.getSelection){  
		// IE9 and non-IE  
		sel = window.getSelection();
		if(sel.anchorNode){
			//如果是文本节点
			if(sel.anchorNode.nodeType == 3){
				checkNode = sel.anchorNode.parentNode;
			}else{
				checkNode = sel.anchorNode;
			}
			//当失去焦点的位置为editorArea或其子元素时，返回true
			if($(checkNode).closest('#editorArea2').length == 1 && $(checkNode).closest('#editorArea2').attr('id') == 'editorArea2'){
				return true;
			}else{
				//焦点位置不在editorArea，插入失败
				return false;
			}
		}else{
			console.log('sel.anchorNode为null');
		}
	}
	return true;
}

function initPagingIndexClick(barName){
	$('#prevBtn').click(function(){
		prevPage(barName);
	});
	$('#nextBtn').click(function(){
		nextPage(barName);
	});
	$('#firstPageBtn').click(function(){
		firstPage(barName);
	});
	$('#lastPageBtn').click(function(){
		lastPage(barName);
	});
	$('.index_item').click(function(){
		var index = Number($(this).html()) - 1;
		getPostReplysMsg(barName,index);
	});
}

function initReplyToReplyPagingIndexClick(postId){
	$('.reply_first_btn').click(function(){
		var position = $(this).closest('.comment').attr('position');
		var index = $(this).closest('.replys').attr('index');
		replyToReplyFirstPage.call(this, postId, index, position);
	});
	$('.reply_prev_btn').click(function(){
		var position = $(this).closest('.comment').attr('position');
		var index = $(this).closest('.replys').attr('index');
		replyToReplyPrevPage.call(this, postId, index, position);
	});
	$('.reply_next_btn').click(function(){
		var position = $(this).closest('.comment').attr('position');
		var index = $(this).closest('.replys').attr('index');
		var totalNum = $(this).closest('.replys').attr('totalpagenum');
		replyToReplyNextPage.call(this, postId, index, position, totalNum);
	});
	$('.reply_last_btn').click(function(){
		var position = $(this).closest('.comment').attr('position');
		var index = $(this).closest('.replys').attr('index');
		var totalNum = $(this).closest('.replys').attr('totalpagenum');
		replyToReplyLastPage.call(this, postId, index, position, totalNum);
	});
	$('.reply_index_item').click(function(){
		var index = Number($(this).html()) - 1;
		var position = $(this).closest('.comment').attr('position');
		getPostReplyToReplyMsg.call(this, postId, index , position);
	});
}

function replyToReplyPrevPage(postId, index, position){
	var currIndex = Number(index);
	if(currIndex > 0){
		getPostReplyToReplyMsg.call(this, postId, --currIndex, position);
	}
}

function replyToReplyNextPage(postId, index, position, totalNum){
	var currIndex = Number(index);
	totalNum = Number(totalNum);
	if(currIndex < totalNum){
		getPostReplyToReplyMsg.call(this, postId, ++currIndex, position);
	}
}

function replyToReplyFirstPage(postId, index, position){
	var currIndex = Number(index);
	if(currIndex != 0){
		getPostReplyToReplyMsg.call(this, postId, 0, position);
	}
}

function replyToReplyLastPage(postId, index, position, totalNum){
	var currIndex = Number(index);
	totalNum = Number(totalNum);
	if(currIndex != totalNum){
		getPostReplyToReplyMsg.call(this, postId, totalNum, position);
	}
}

function initReplyToReplyIndex(){
	var maxShowIndex = 10;
	var currIndex = Number($(this).closest('.replys').attr('index'));
	var totalNum = Number($(this).closest('.replys').attr('totalpagenum'));
	var halfIndexNum = Math.floor(maxShowIndex / 2) + 1;
	if(currIndex == 0){
		$(this).parent().find('.reply_first_btn').css('display','none');
		$(this).parent().find('.reply_prev_btn').css('display','none');
	}else{
		$(this).parent().find('.reply_first_btn').css('display','inline-block');
		$(this).parent().find('.reply_prev_btn').css('display','inline-block');
	}
	if(currIndex == totalNum){
		$(this).parent().find('.reply_last_btn').css('display','none');
		$(this).parent().find('.reply_next_btn').css('display','none');
	}else{
		$(this).parent().find('.reply_last_btn').css('display','inline-block');
		$(this).parent().find('.reply_next_btn').css('display','inline-block');
	}
	$(this).parent().find('.reply_index_item').removeClass('currIndex');
	
	if(totalNum < maxShowIndex){
		$(this).parent().find('.reply_index_item').each(function(index){
			if(index > totalNum){
				$(this).css('display','none');
			}
			if(index == currIndex){
				$(this).addClass('currIndex');
			}
		});
	}else{
		if(currIndex < halfIndexNum){
			$(this).parent().find('.reply_index_item').each(function(index){
				$(this).html(index + 1);
			});
		}else if(currIndex > totalNum - halfIndexNum){
			$(this).parent().find('.reply_index_item').each(function(index){
				$(this).html(totalNum + 1 - (maxShowIndex - 1 - index));
			});
		}else{
			$(this).parent().find('.reply_index_item').each(function(index){
				$(this).html(currIndex + 1 - (halfIndexNum - index - 1));
			});
		}
		$(this).parent().find('.reply_index_item').each(function(index){
			if($(this).html() == currIndex + 1){
				$(this).addClass('currIndex');
			}
		});
	}
}

function initIndex(){
	var maxShowIndex = 10;
	var currIndex = Number($('#comments').attr('index'));
	var totalNum = Number($('#comments').attr('totalpagenum'));
	var halfIndexNum = Math.floor(maxShowIndex / 2) + 1;
	if(currIndex == 0){
		$('#prevBtn').css('display','none');
		$('#firstPageBtn').css('display','none');
	}else{
		$('#prevBtn').css('display','inline-block');
		$('#firstPageBtn').css('display','inline-block');
	}
	if(currIndex == totalNum){
		$('#nextBtn').css('display','none');
		$('#lastPageBtn').css('display','none');
	}else{
		$('#nextBtn').css('display','inline-block');
		$('#lastPageBtn').css('display','inline-block');
	}
	$('.index_item').removeClass('currIndex');
	
	if(totalNum < maxShowIndex){
		$('.index_item').each(function(index){
			if(index > totalNum){
				$(this).css('display','none');
			}
			if(index == currIndex){
				$(this).addClass('currIndex');
			}
		});
	}else{
		if(currIndex < halfIndexNum){
			$('.index_item').each(function(index){
				$(this).html(index + 1);
			});
		}else if(currIndex > totalNum - halfIndexNum){
			$('.index_item').each(function(index){
				$(this).html(totalNum + 1 - (maxShowIndex - 1 - index));
			});
		}else{
			$('.index_item').each(function(index){
				$(this).html(currIndex + 1 - (halfIndexNum - index - 1));
			});
		}
		$('.index_item').each(function(index){
			if($(this).html() == currIndex + 1){
				$(this).addClass('currIndex');
			}
		});
	}
}

function freshPageReplyItems(data, indexNum){
	var postId = $('#postTitle').attr('postId');
	if(indexNum != 0){
		$('#masterComment').css('display','none');
	}else{
		$('#masterComment').css('display','flex');
	}
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true: false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if(pageNum == 0){
		pageNum = 1;
	}
	$('#comments').find('.comment').remove();
	$('#comments').attr('index', indexNum);
	$('#comments').attr('totalpagenum', --pageNum);
	for(var i=0;i<data.value.length;i++){
		var $item = createCommentItem(data.value[i]);
		$('#comments').append($item);
	}
	initReplyToReplyPagingIndexClick(postId);
	$('.reply_first_btn').each(function(){
		initReplyToReplyIndex.call(this);
	});
	initIndex();
}

function freshPageReplyToReplyItems(data, indexNum){
	// console.log(data);
	var that = this;
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true: false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if(pageNum == 0){
		pageNum = 1;
	}
	$(this).closest('.replys').find('.reply_item').remove();
	$(this).closest('.replys').attr('index', indexNum);
	$(this).closest('.replys').attr('totalpagenum', --pageNum);
	createReplysItem(data).find('.reply_item').each(function(){
		$(that).parent().siblings('.reply_area').before($(this));
	});
	initReplyToReplyIndex.call(this);
}

function prevPage(barName){
	var currIndex = Number($('#comments').attr('index'));
	if(currIndex > 0){
		getPostReplysMsg(barName, --currIndex);
	}
}

function nextPage(barName){
	var currIndex = Number($('#comments').attr('index'));
	var totalNum = Number($('#comments').attr('totalpagenum'));
	console.log(currIndex, totalNum);
	if(currIndex < totalNum){
		getPostReplysMsg(barName, ++currIndex);
	}
}

function firstPage(barName){
	var currIndex = Number($('#comments').attr('index'));
	if(currIndex != 0){
		getPostReplysMsg(barName, 0);
	}
}

function lastPage(barName){
	var currIndex = Number($('#comments').attr('index'));
	var totalNum = Number($('#comments').attr('totalpagenum'));
	if(currIndex != totalNum){
		getPostReplysMsg(barName, totalNum);
	}
}
//回复的回复组件
function createReplysItem(data){
	console.log(data);
	var $replysDiv = $('<div></div>');
	$replysDiv.addClass('replys');
	$replysDiv.attr('index', 0);
	if(data.value.length == 0){
		var $replyAreaDiv = $('<div></div>');
		$replyAreaDiv.addClass('reply_area');
		var $replyEditorAreaDiv = $('<div></div>');
		$replyEditorAreaDiv.addClass('reply_editor_area');
		$replyEditorAreaDiv.attr('contenteditable','true');
		$replyEditorAreaDiv.focus(replyToReplyNotLoginTip);
		var $replyToReplySendTipSpan = $('<span></span>');
		$replyToReplySendTipSpan.html('发布成功');
		$replyToReplySendTipSpan.addClass('reply_to_reply_send_tip');
		var $submitReplyBtn = $('<button></button>');
		$submitReplyBtn.addClass('submit_reply_btn');
		$submitReplyBtn.html('回复');
		//点击回复按钮发布评论
		$submitReplyBtn.click(function(){
			var userId = localStorage.getItem('user');
			var that = this;
			$.ajax({
				type: 'get',
				url: domain + '/pro/php/isCantSpeak.php',
				async: true,
				data: {
					userId: userId
				},
				success: function(result){
					result = JSON.parse(result);
					if(result){
						alert('您已被禁言!');
					}else{
						sendReplyToReply.call(that);
					}
				}
			});
		});
		$replyAreaDiv.append($replyEditorAreaDiv);
		$replyAreaDiv.append($replyToReplySendTipSpan);
		$replyAreaDiv.append($submitReplyBtn);
		$replysDiv.append($replyAreaDiv);
		return $replysDiv;
	}
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true: false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if(pageNum == 0){
		pageNum = 1;
	}
	$replysDiv.attr('totalpagenum', --pageNum);

	for(var j=0;j<data.value.length;j++){
		var $replyItemDiv = $('<div></div>');
		$replyItemDiv.addClass('reply_item');
		var $replyItemHeadImg = $('<img />');
		$replyItemHeadImg.attr('src',data.value[j].headImg);
		(function(j){
			$replyItemHeadImg.click(function(){
				window.location.href = "http://localhost/pro/page/personal_space.html?userId="+data.value[j].replyerId;
			});
		})(j);
		var $replyContentDiv = $('<div></div>');
		$replyContentDiv.addClass('reply_content');
		var $replyTextP = $('<p></p>');
		$replyTextP.addClass('reply_text');
		var $replyContentUserNameSpan = $('<span></span>');
		$replyContentUserNameSpan.addClass('replyer');
		$replyContentUserNameSpan.html(data.value[j].nickname+':');
		$replyTextP.html($replyContentUserNameSpan);
		$replyTextP.html($replyTextP.html() + data.value[j].content);
		var $replyTimeDiv = $('<div></div>');
		$replyTimeDiv.addClass('reply_time');
		var $timeSpan = $('<span></span>');
		var replyToReplyTime = isToday(data.value[j].replyTime)?data.value[j].replyTime.substr(11):data.value[j].replyTime.substr(0,10);
		$timeSpan.html(replyToReplyTime);
		var $replyBtn = $('<button></button>');
		$replyBtn.addClass('reply_btn');
		$replyBtn.html('回复');
		//回复内容中的回复按钮被点击时回复框内保存被点击的用户的信息
		$replyBtn.click(getReplyedName);
		$replyTimeDiv.append($timeSpan);
		$replyTimeDiv.append($replyBtn);
		$replyContentDiv.append($replyTextP);
		$replyContentDiv.append($replyTimeDiv);
		var $clearFloatDiv = $('<div></div>');
		$clearFloatDiv.addClass('clear_float');
		$replyItemDiv.append($replyItemHeadImg);
		$replyItemDiv.append($replyContentDiv);
		$replyItemDiv.append($clearFloatDiv);
		$replysDiv.append($replyItemDiv);
	}

	var $replyAreaDiv = $('<div></div>');
	$replyAreaDiv.addClass('reply_area');
	var $replyEditorAreaDiv = $('<div></div>');
	$replyEditorAreaDiv.addClass('reply_editor_area');
	$replyEditorAreaDiv.attr('contenteditable','true');
	$replyEditorAreaDiv.focus(replyToReplyNotLoginTip);
	var $replyToReplySendTipSpan = $('<span></span>');
	$replyToReplySendTipSpan.html('发布成功');
	$replyToReplySendTipSpan.addClass('reply_to_reply_send_tip');
	var $submitReplyBtn = $('<button></button>');
	$submitReplyBtn.addClass('submit_reply_btn');
	$submitReplyBtn.html('回复');
	//点击回复按钮发布评论
    $submitReplyBtn.click(function(){
		var userId = localStorage.getItem('user');
		var that = this;
		$.ajax({
			type: 'get',
			url: domain + '/pro/php/isCantSpeak.php',
			async: true,
			data: {
				userId: userId
			},
			success: function(result){
				result = JSON.parse(result);
				if(result){
					alert('您已被禁言!');
				}else{
					sendReplyToReply.call(that);
				}
			}
		});
	});
	$replyAreaDiv.append($replyEditorAreaDiv);
	$replyAreaDiv.append($replyToReplySendTipSpan);
	$replyAreaDiv.append($submitReplyBtn);

	var $indexUl = $('<ul></ul>');
	$indexUl.addClass('reply_index');
	var $replyPagingFirstBtnLi = $('<li></li>');
	$replyPagingFirstBtnLi.addClass('reply_paging_btn');
	$replyPagingFirstBtnLi.addClass('reply_first_btn');
	$replyPagingFirstBtnLi.html('首页');
	var $replyPagingPrevBtnLi = $('<li></li>');
	$replyPagingPrevBtnLi.addClass('reply_paging_btn');
	$replyPagingPrevBtnLi.addClass('reply_prev_btn');
	$replyPagingPrevBtnLi.html('上一页');
	$indexUl.append($replyPagingFirstBtnLi);
	$indexUl.append($replyPagingPrevBtnLi);
	for(var i=0;i<10;i++){
		var $replyPagingIndexBtnLi = $('<li></li>');
		$replyPagingIndexBtnLi.addClass('reply_index_item');
		$replyPagingIndexBtnLi.html(i+1);
		$indexUl.append($replyPagingIndexBtnLi);
	}
	var $replyPagingNextBtnLi = $('<li></li>');
	$replyPagingNextBtnLi.addClass('reply_paging_btn');
	$replyPagingNextBtnLi.addClass('reply_next_btn');
	$replyPagingNextBtnLi.html('下一页');
	var $replyPagingLastBtnLi = $('<li></li>');
	$replyPagingLastBtnLi.addClass('reply_paging_btn');
	$replyPagingLastBtnLi.addClass('reply_last_btn');
	$replyPagingLastBtnLi.html('尾页');
	$indexUl.append($replyPagingNextBtnLi);
	$indexUl.append($replyPagingLastBtnLi);

	$replysDiv.append($replyAreaDiv);
	$replysDiv.append($indexUl);

	return $replysDiv;
}

//创建页面
function createCommentItem(data){
	console.log(data);
	var barMaster = $('#postTitle').attr('barMaster');
	var userId = localStorage.getItem('user');
	var $commentDiv = $('<div></div>');
	$commentDiv.addClass('comment');
	$commentDiv.attr('position',data.position);
	var $userMsgDiv = $('<div></div>');
	$userMsgDiv.addClass('user_msg');
	$userMsgDiv.attr('replyerId',data.creatorId);
	var $userMsgHeadImg = $('<img />');
	$userMsgHeadImg.attr('src',data.headImg);
	$userMsgHeadImg.click(function(){
		window.location.href = "http://localhost/pro/page/personal_space.html?userId="+data.creatorId;
	});
	var $userNameP = $('<p></p>');
	$userNameP.addClass('user_name');
	$userNameP.html(data.nickname);

	var $userLevelP = $('<p></p>');
	$userLevelP.addClass('user_level');
	$userLevelP.html('等级:' + getLv(data.exp));
	$userMsgDiv.append($userMsgHeadImg);
	$userMsgDiv.append($userNameP);
	$userMsgDiv.append($userLevelP);

	var $commentContentDiv = $('<div></div>');
	$commentContentDiv.addClass('comment_content');
	var $editBtn = $('<button></button>');
	$editBtn.addClass('edit_btn');
	$commentContentDiv.append($editBtn);
	getEditBtnStatus(data.creatorId, data.position, $editBtn, 1)
	var $commentTextDiv = $('<div></div>');
	$commentTextDiv.addClass('comment_text');
	$commentTextDiv.html(data.content);
	var $commentMsgDiv = $('<div></div>');
	$commentMsgDiv.addClass('comment_msg');
	var $reportBtn = $('<button></button>');
	$reportBtn.addClass('report_btn');
	if(userId == data.creatorId || userId == barMaster){
		$reportBtn.html('删除');
		$reportBtn.click(function(){
			var result = confirm('确定删除该回复?');
			if(!!result){
				var position = $(this).closest('.comment').attr('position');
				position = Number(position);
				deleteMyReply(position);
			}else{
				return ;
			}
		});
	}else{
		$reportBtn.html('举报');
		$reportBtn.click(function(){
			var position = $(this).closest('.comment').attr('position');
			position = Number(position);
			reportReply.call(this,position);
		});
	}
	
	var $positionSpan = $('<span></span>');
	$positionSpan.html(data.position+'楼');
	var $timeSpan = $('<span></span>');
	var replyTime = isToday(data.createTime)?data.createTime.substr(11):data.createTime.substr(0,10);
	$timeSpan.html(replyTime);
	var $watchReplyBtn = $('<button></button>');
	$watchReplyBtn.addClass('watch_reply_btn');
	if(data.replyToReplyData.value.length == 0){
		$watchReplyBtn.html('查看回复('+data.replyToReplyData.totalNum+')');
	}else{
		$watchReplyBtn.html('隐藏回复('+data.replyToReplyData.totalNum+')');
		$watchReplyBtn.click(function(){
			onPressWatchReplyBtnHandler.call($watchReplyBtn,data.replyToReplyData.totalNum);
		});
	}
	$commentMsgDiv.append($reportBtn);
	$commentMsgDiv.append($positionSpan);
	$commentMsgDiv.append($timeSpan);
	$commentMsgDiv.append($watchReplyBtn);
	var $replysDiv = createReplysItem(data.replyToReplyData);
	$commentContentDiv.append($commentTextDiv);
	$commentContentDiv.append($commentMsgDiv);
	$commentContentDiv.append($replysDiv);

	$commentDiv.append($userMsgDiv);
	$commentDiv.append($commentContentDiv);

	return $commentDiv;
}
//点击查看回复按钮
function onPressWatchReplyBtnHandler(num){
	var itemReplys = $(this).parent().siblings('.replys');
	if(itemReplys.css('display') == 'none'){
		var str = '隐藏回复('+num+')';
		$(this).html(str.toString());
	}else{
		var str = '查看回复('+num+')';
		$(this).html(str.toString());
	}
	itemReplys.toggle('normal');
}
//举报
function reportReply(position){
	var userId = localStorage.getItem('user');
	if(userId == null){
		alert('请先登录');
		return ;
	}
	var replyerId = $(this).closest('.comment_content').siblings('.user_msg').attr('replyerId');
	var msg = prompt('请输入举报理由:');
	var postId = $('#postTitle').attr('postId');
	var barBelong = $('#postTitle').attr('barBelong');
	if(msg == null){
		return ;
	}
	$.ajax({
		type: 'post',
		url: domain + '/pro/php/sendReport.php',
		async: true,
		data: {
			postId: postId,
			position: position,
			content: msg,
			reporterId: userId,
			reportederId: replyerId,
			barBelong: barBelong
		},
		success: function(result){
			if(result == 'success'){
				alert('已发送举报信息');
			}else{
				console.log(result);
				alert('未知错误');
			}
		}
	});
}
//删除自己的评论
function deleteMyReply(position){
	var postId = $('#postTitle').attr('postId');
	$.ajax({
		type: 'post',
		url: domain + '/pro/php/deleteMyReply.php',
		async: true,
		data: {
			postId: postId,
			position: position
		},
		success: function(result){
			console.log(result);
			if(result == 'success'){
				window.location.reload();
			}else{
				alert('发生未知错误');
			}
		}
	});
}

