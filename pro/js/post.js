var domain = 'http://localhost';
var fileDataArr = [];
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
		onSubmitReplyMsg();
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
    //回复内容中的回复按钮被点击时回复框内保存被点击的用户的信息
    $('.reply_btn').click(getReplyedName);
    //点击回复按钮发布评论
    $('.submit_reply_btn').click(sendReplyToReply);

    $('.reply_editor_area').focus(replyToReplyNotLoginTip);
}

function getReplyedName(){
    var replyederNickName = $(this).parent().siblings('.reply_text').find('.replyer').html();
    replyederNickName = replyederNickName.substring(0,replyederNickName.length-1);
    $(this).parent().parent().parent().siblings('.reply_area').find('.reply_editor_area').html('回复 '+replyederNickName+':');
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
            console.log('内容为空');
        }
    }else{
        alert('请先登录!');
    }
}

function getPostReplysMsg(){
	
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
                console.log(data);
            }catch(e){
                console.log(e);
                return ;
            }
			if(data.result == 'success'){
                sessionStorage.setItem('barName',data.data.barBelong);
                $('#postTitle').html(data.data.postName);
                $('#creatorHeadImg').attr('src',data.data.creatorHeadImg);
                $('#creatorNickName').html(data.data.creatorNickName);
                $('#commentText').html(data.data.postContent);
                $('#creatorPostTime').html(isToday(data.data.createTime)?data.data.createTime.substr(11):data.data.createTime.substr(0,10));
                $('#postTitle').attr('postId',postId);
				$('.master_comment').attr('position',1);
            }else if(data.result == 'noReply'){
                //没有回复
                console.log(1);
			}
			getPostReplysMsg();
            initPagingIndexClick(postId);
            init();
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
//发送事件
function submitReplyMsg(){
	var postId = $('#postTitle').attr('postId');
	var creatorId = localStorage.getItem('user');
	var nickName = localStorage.getItem('userNickName');
	var replyContent = $('#editorArea').html().trim();
	var imgReg=/<img\b[^>]*>/ig;
	if(imgReg.test(replyContent)){
		var replaceReg = /postTempImg/g;
		replyContent = replyContent.replace(replaceReg, 'postImg');
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
            console.log(result);
            if(result == 'success'){
                $('#sendTip').css('display','inline').html('发布成功');
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

function getPostPageMsg(barName,indexNum){
	$.ajax({
		url: domain + "/pro/php/getPostMsgInBar.php",
		type: 'get',
		async: true,
		data: {
			barName: barName,
			indexNum: indexNum
		},
		success: function(result){
			var data = JSON.parse(result);
			if(data.totalNum == 0){
				console.log('当前还没有帖子');
			}else{
				freshBarItems(data,indexNum);
			}
		}
	});
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
		getPostPageMsg(barName,index);
	});
}

function initIndex(){
	var maxShowIndex = 10;
	var currIndex = Number($('#postsContainer').attr('index'));
	var totalNum = Number($('#postsContainer').attr('totalpagenum'));
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

function freshBarItems(data, indexNum){
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true: false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	$('#postsContainer').find('.post').remove();
	$('#postsContainer').attr('index', indexNum);
	$('#postsContainer').attr('totalpagenum', --pageNum);
	for(var i=0;i<data.value.length;i++){
		var $item = createPostItem(data.value[i]);
		$('#postsContainer').find('.index').before($item);
	}
	initIndex();
}

function prevPage(barName){
	var currIndex = Number($('#postsContainer').attr('index'));
	if(currIndex > 0){
		getPostPageMsg(barName, --currIndex);
	}
}

function nextPage(barName){
	var currIndex = Number($('#postsContainer').attr('index'));
	var totalNum = Number($('#postsContainer').attr('totalpagenum'));
	console.log(currIndex, totalNum);
	if(currIndex < totalNum){
		getPostPageMsg(barName, ++currIndex);
	}
}

function firstPage(barName){
	var currIndex = Number($('#postsContainer').attr('index'));
	if(currIndex != 0){
		getPostPageMsg(barName, 0);
	}
}

function lastPage(barName){
	var currIndex = Number($('#postsContainer').attr('index'));
	var totalNum = Number($('#postsContainer').attr('totalpagenum'));
	if(currIndex != totalNum){
		getPostPageMsg(barName, totalNum);
	}
}
//回复的回复组件
function createReplysItem(data){
	var $replysDiv = $('<div></div>');
	$replysDiv.addClass('replys');
	var $replyItemDiv = $('<div></div>');
	$replyItemDiv.addClass('reply_item');
	var $replyItemHeadImg = $('<img />');
	$replyItemHeadImg.attr('src','../img/3.jpg');
	var $replyContentDiv = $('<div></div>');
	$replyContentDiv.addClass('reply_content');
	var $replyTextP = $('<p></p>');
	$replyTextP.addClass('reply_text');
	var $replyContentUserNameSpan = $('<span></span>');
	$replyContentUserNameSpan.html('hirara:');
	$replyTextP.html($replyContentUserNameSpan+'这是回复内容这是回复内容这是回复内容这是回');
	var $replyTimeDiv = $('<div></div>');
	$replyTimeDiv.addClass('reply_time');
	var $timeSpan = $('<span></span>');
	$timeSpan.html('2018-2-9 10:46:00');
	var $replyBtn = $('<button></button>');
	$replyBtn.addClass('reply_btn');
	$replyBtn.html('回复');
	$replyTimeDiv.append($timeSpan);
	$replyTimeDiv.append($replyBtn);
	$replyContentDiv.append($replyTextP);
	$replyContentDiv.append($replyTimeDiv);
	var $clearFloatDiv = $('<div></div>');
	$clearFloatDiv.addClass('clear_float');
	$replyItemDiv.append($replyItemHeadImg);
	$replyItemDiv.append($replyContentDiv);
	$replyItemDiv.append($clearFloatDiv);

	var $replyAreaDiv = $('<div></div>');
	$replyAreaDiv.addClass('reply_area');
	var $replyEditorAreaDiv = $('<div></div>');
	$replyEditorAreaDiv.addClass('reply_editor_area');
	$replyEditorAreaDiv.attr('contenteditable','true');
	var $replyToReplySendTipSpan = $('<span></span>');
	$replyToReplySendTipSpan.html('发布成功');
	var $submitReplyBtn = $('<button></button>');
	$submitReplyBtn.addClass('submit_reply_btn');
	$submitReplyBtn.html('回复');
	$replyAreaDiv.append($replyEditorAreaDiv);
	$replyAreaDiv.append($replyToReplySendTipSpan);
	$replyAreaDiv.append($submitReplyBtn);

	var $indexUl = $('<ul></ul>');
	$indexUl.addClass('index');
	var $replyPagingFirstBtnLi = $('<li></li>');
	$replyPagingFirstBtnLi.addClass('reply_paging_btn');
	$replyPagingFirstBtnLi.html('首页');
	var $replyPagingPrevBtnLi = $('<li></li>');
	$replyPagingPrevBtnLi.addClass('reply_paging_btn');
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
	$replyPagingNextBtnLi.html('下一页');
	var $replyPagingLastBtnLi = $('<li></li>');
	$replyPagingLastBtnLi.addClass('reply_paging_btn');
	$replyPagingLastBtnLi.html('尾页');
	$indexUl.append($replyPagingNextBtnLi);
	$indexUl.append($replyPagingLastBtnLi);

	$replysDiv.append($replyItemDiv);
	$replysDiv.append($replyAreaDiv);
	$replysDiv.append($indexUl);
	return $replysDiv;
}