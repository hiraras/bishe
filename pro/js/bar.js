var domain = 'http://localhost';
var fileDataArr = [];
(function(){
	var pageUrl = window.location.href;
	var barName = '';
	var urlParams = pageUrl.substr(pageUrl.indexOf('?')+1).split('&');
	for(var i=0;i<urlParams.length;i++){
		if(urlParams[i].indexOf('barName') !== -1){
			barName = urlParams[i].substr(urlParams[i].indexOf('=')+1);
			//把乱码的中文字符串转成中文
			barName = decodeURI(barName);
		}
	}
	$('#search').attr('maxlength',80);
	$('#search').val(barName);
	getBarMsg(barName);
	getPostsMsg(barName);
	init();
}());

function init(){
	//设置帖子中图片点击放大
	$('.post_img').click(resizeImg);
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
	}else{
		$('#editorArea').attr('contenteditable','false');
		$('#notLoginTip').css('display', 'block');
		$('#submit').attr('disabled',true);
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
	if($(this).css('height') == '100px'){
		$(this).css('height','400px');
		$(this).css('max-width','900px');
	}else{
		$(this).css('height','100px');
		$(this).css('max-width','134px');
	}
}

function getBarMsg(barName){
	$.ajax({
		url: domain + "/pro/php/barGetBarMsg.php",
		type: 'get',
		async: true,
		data: {
			barName: barName
		},
		success: function(result){
			var data = JSON.parse(result);
			console.log(data);
			var barDescript = data[0].barDescript;
			if(data.length === 0){
				window.location.href = domain + '/pro/page/notExistBar.html?'+'barName='+$('#search').val();
				return ;
			}
			$('#barName').html(data[0].barName + '吧');
			$('#barName').attr('barname',data[0].barName);
			$('#concernNum').html('人数:'+data[0].concernNum);
			$('#barIntroduce').html(barDescript);
		}
	});
}

function getPostsMsg(barName){
	$.ajax({
		type: 'get',
		url: domain + '/pro/php/barGetPostsMsg.php',
		async: true,
		data: {
			barName: barName
		},
		success: function(e){

		}
	});
}

function initSendAreaBtnsPressEvent(){
	$('.face').click(function(){
		var $img = $(this).clone();
		$img.removeAttr('class');
		insertHTML($img,$('#editorArea'));
		$('#faceContainer').css('display','none');
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

function createPost(data){

}
/*
<div class="post">
	<div class="post_content">
		<div class="post_title_container">
			<p class="is_top">置顶</p>
			<p class="is_great">精</p>
			<p class="post_title_text">
				一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十
			</p>
		</div>
		<div class="post_img_container">
			<img src="../img/1.jpg" alt="" class="post_img" id="img1" />
			<img src="../img/1.jpg" alt="" class="post_img" />
			<img src="../img/1.jpg" alt="" class="post_img" />
			<img src="../img/6.jpeg" alt="" class="post_img" />
			<img src="../img/1.jpg" alt="" class="post_img" />
			<img src="../img/1.jpg" alt="" class="post_img" />
			<img src="../img/6.jpeg" alt="" class="post_img" />
			<img src="../img/1.jpg" alt="" class="post_img" />	
		</div>
	</div>
	<div class="post_msg">
		<div class="master_msg">
			<img src="../img/proImg/people.png" alt="" class="post_msg_people_img" />
			<p class="master_name">hirara</p>
		</div>
		<div class="reply_num_msg">
			<img src="../img/proImg/msg.png" alt="" class="post_msg_reply_img" />
			<p class="reply_num">15616515156</p>
		</div>
		<div class="post_time">
			2018-12-21
		</div>
	</div>
</div>
*/