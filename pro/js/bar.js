var domain = 'http://localhost';
var fileDataArr = [];
(function(){
	var pageUrl = window.location.href;
	var barName = '';
	var urlParams = pageUrl.substr(pageUrl.indexOf('?')+1).split('&');
	if(pageUrl.indexOf('barName') == -1){
		window.location.href = domain + '/pro/index.html';
		return ;
	}
	for(var i=0;i<urlParams.length;i++){
		if(urlParams[i].indexOf('barName') !== -1){
			barName = urlParams[i].substr(urlParams[i].indexOf('=')+1);
			//把乱码的中文字符串转成中文
			barName = decodeURI(barName);
		}
	}
	$('#search').attr('maxlength',80);
	$('#search').val(barName);
	searchBarMsg(barName);
}());

function init(){
	//设置帖子中图片点击放大
	// $('.post_img').click(resizeImg);
	//初始化发表部分按钮点击事件
	initSendAreaBtnsPressEvent();

	$('#submit').click(function(){
		onSubmitPostMsg();
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
}

function resizeImg(){
	$(this).siblings("img").each(function(){
		$(this).css('height','100px');
		$(this).css('max-width','134px');
	});
	if($(this).css('height') == '100px'){
		$(this).css('height','400px');
		$(this).css('max-width','900px');
	}else{
		$(this).css('height','100px');
		$(this).css('max-width','134px');
	}
}

function getBarMsg(data){
	$('#barName').html(data.barName + '吧');
	$('#barName').attr('barname',data.barName);
	$('#concernNum').html('人数:'+data.concernNum);
	$('#barIntroduce').html(data.barDescript);
	$('#postNum').html('帖子:'+data.postNum);
	$('#barImg').attr('src',data.barImg);
}

function searchBarMsg(barName){
	$.ajax({
		type: 'get',
		url: domain + '/pro/php/getBarState.php',
		async: true,
		data: {
			barName: barName
		},
		success: function(result){
			var data = JSON.parse(result);
			console.log(data);
			if(data.code == 0){
				if(data.data.postNum == 0){
					$('#noPostTip').css('display','block');
				}else{
					$('#noPostTip').css('display','none');
					getPostPageMsg(barName,0);
				}
				getBarMsg(data.data);
				initPagingIndexClick(barName);
				init();
			}else if(data.code == 1){
				window.location.href = domain + '/pro/page/blurBar.html?'+'barName='+$('#search').val();
			}else{
				window.location.href = domain + '/pro/page/notExistBar.html?'+'barName='+$('#search').val();
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
function onSubmitPostMsg(){
	var postTitle = $('#inputPostTitle').val();
	if(postTitle.trim() != ''){
		$('#sendTip').css('display','none');
		if(fileDataArr.length != 0){
			$.ajax({
				url: domain + "/pro/php/saveTempPostImg.php",
				type: 'post',
				async: true,
				data: {
					imgsData: fileDataArr
				},
				success: function(result){
					if(result == 'success'){
						submitPostMsg();
					}else{
						alert('未知错误,图片保存失败!');
					}
				},
				error: function(e){
					console.log(e);
				}
			});
		}else{
			submitPostMsg();
		}
	}else{
		$('#sendTip').css('display','inline');
	}
}
//发送事件
function submitPostMsg(){
	var postTitle = $('#inputPostTitle').val();
	var barBelong = $('#barName').attr('barName');
	var creatorId = localStorage.getItem('user');
	var nickName = localStorage.getItem('userNickName');
	var postContent = $('#editorArea').html().trim();
	var imgReg=/<img\b[^>]*>/ig;
	if(imgReg.test(postContent)){
		var replaceReg = /postTempImg/g;
		postContent = postContent.replace(replaceReg, 'postImg');
	}
	if(postTitle.trim() != ''){
		$('#sendTip').css('display','none');
		$.ajax({
			url: domain + "/pro/php/sendPostMsg.php",
			type: 'post',
			async: true,
			data: {
				postTitle: postTitle,
				barBelong: barBelong,
				creatorId: creatorId,
				nickName: nickName,
				postContent: postContent
			},
			success: function(result){
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
	}else{
		$('#sendTip').css('display','inline');
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

function createPostItem(data){
	// console.log(data);
	var maxShowImgNum = 4;
	var imgReg=/<img\b[^>]*postImg[^>]*>/ig;
	var $postDiv = $('<div></div>');
	$postDiv.addClass('post');
	var $postContentDiv = $('<div></div>');
	$postContentDiv.addClass('post_content');
	var $postTitleContainerDiv = $('<div></div>');
	$postTitleContainerDiv.addClass('post_title_container');

	var $isTopP = $('<p></p>');
	$isTopP.addClass('is_top');
	if(data.isTop == '0'){
		$isTopP.css('display','none');
	}
	var $isGreatP = $('<p></p>');
	$isGreatP.addClass('is_great');
	if(data.isGreat == '0'){
		$isGreatP.css('display','none');
	}
	var $postTitleTextP = $('<p></p>');
	$postTitleTextP.addClass('post_title_text');
	$postTitleTextP.html(data.postName);
	$postTitleTextP.click(function(){
		var postId = $(this).parents('.post').attr('postId');
		window.location.href = 'http://localhost/pro/page/post.html?'+'postId='+postId;
	});
	$postTitleContainerDiv.append($isTopP);
	$postTitleContainerDiv.append($isGreatP);
	$postTitleContainerDiv.append($postTitleTextP);

	var $postImgContainerDiv = $('<div></div>');
	$postImgContainerDiv.addClass('post_img_container');
	var $postContentIntroP = $('<p></p>');
	$postContentIntroP.addClass('post_content_intro');
	$postContentIntroP.html(data.postContent.replace(imgReg,''));
	$postImgContainerDiv.append($postContentIntroP);
	var imgArr = data.postContent.match(imgReg);
	if(imgArr){
		for(var j=0;j<imgArr.length && j<maxShowImgNum;j++){
			var $imgEle = $(imgArr[j]);
			$imgEle.addClass('post_img');
			$imgEle.click(resizeImg);
			$postImgContainerDiv.append($imgEle);
		}
	}
	
	$postContentDiv.append($postTitleContainerDiv);
	$postContentDiv.append($postImgContainerDiv);

	var $postMsgDiv = $('<div></div>');
	$postMsgDiv.addClass('post_msg');

	var $masterMsgDiv = $('<div></div>');
	$masterMsgDiv.addClass('master_msg');
	var $postMsgPeopleImg = $('<img />');
	$postMsgPeopleImg.addClass('post_msg_people_img');
	$postMsgPeopleImg.attr('src','../img/proImg/people.png');
	var $masterNameP = $('<p></p>');
	$masterNameP.addClass('master_name');
	$masterNameP.html(data.creatorNickName);
	$masterMsgDiv.append($postMsgPeopleImg);
	$masterMsgDiv.append($masterNameP);

	var $replyNumMsgDiv = $('<div></div>');
	$replyNumMsgDiv.addClass('reply_num_msg');
	var $postMsgReplyImg = $('<img />');
	$postMsgReplyImg.addClass('post_msg_reply_img');
	$postMsgReplyImg.attr('src','../img/proImg/msg.png');
	var $replyNumP = $('<p></p>');
	$replyNumP.addClass('reply_num');
	$replyNumP.html(data.replyNum);
	$replyNumMsgDiv.append($postMsgReplyImg);
	$replyNumMsgDiv.append($replyNumP);

	var $postTimeDiv = $('<div></div>');
	var showCreateTimeStr = '';
	$postTimeDiv.addClass('post_time');
	if(isToday(data.createTime)){
		showCreateTimeStr = data.createTime.substr(11);
	}else{
		showCreateTimeStr = data.createTime.substr(0,10);
	}
	$postTimeDiv.html(showCreateTimeStr);

	$postMsgDiv.append($masterMsgDiv);
	$postMsgDiv.append($replyNumMsgDiv);
	$postMsgDiv.append($postTimeDiv);

	$postDiv.append($postContentDiv);
	$postDiv.append($postMsgDiv);
	$postDiv.attr('postId',data.id);
	$postDiv.attr('postId',data.id);
	return $postDiv;
}
