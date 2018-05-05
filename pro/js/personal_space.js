var domain = 'http://localhost';
var userId = '';
var userData = {};
var fileDataArr = [];
$(function () {
	var pageUrl = window.location.href;
	var urlParams = pageUrl.substr(pageUrl.indexOf('?') + 1).split('&');
	if (pageUrl.indexOf('userId') == -1) {
		window.location.href = domain + '/pro/index.html';
		return;
	}
	for (var i = 0; i < urlParams.length; i++) {
		if (urlParams[i].indexOf('userId') !== -1) {
			userId = urlParams[i].substr(urlParams[i].indexOf('=') + 1);
		}
	}
	$.ajax({
		type: 'get',
		url: domain + '/pro/php/getUserMsg.php',
		async: true,
		data: {
			username: userId
		},
		success: function (result) {
			try {
				var data = JSON.parse(result);
			} catch (e) {
				console.log(e);
			}
			if (data.result == 'success') {
				userData = data.data;
				init();
			} else {
				alert('用户不存在');
				window.location.href = "http://localhost/pro/index.html";
			}
		}
	});
	//测试页面刷新或关闭，删除掉已经保存到本地的图片文件
	//结果直接关闭浏览器的话不会执行
	window.onbeforeunload = function () {
		for (var i = 0; i < fileDataArr.length; i++) {
			removeNotNeedImg(fileDataArr[i]);
		}
	}
});

function removeNotNeedImg(imgPath) {
	$.ajax({
		type: 'get',
		url: domain + "/pro/php/removeTempImg.php",
		async: true,
		data: {
			imgPath: imgPath
		},
		success: function (result) {
			console.log('remove ' + result);
		}
	});
}
function initCropper() {
	'use strict';
	var console = window.console || { log: function () { } };
	var URL = window.URL || window.webkitURL;
	var imgContainer = $('#imgContainer');
	// Import image
	var $inputImage = $('#inputImage');
	var $image = $('#image');
	$image.attr('src', userData.headImg);
	var $download = $('#download');
	var originalImageURL = $image.attr('src');
	var uploadedImageType = 'image/jpeg';
	var uploadedImageURL;
	var options = {
		aspectRatio: 1 / 1,
		preview: '.img-preview',
	};
	imgContainer.width($image.width());
	imgContainer.height($image.height());
	//初始化
	$image.cropper(options);
	if (URL) {
		$inputImage.change(function () {
			var imgContainer = $('#imgContainer');
			var files = this.files, file;
			if (!$image.data('cropper')) {
				return;
			}
			if (files && files.length) {
				file = files[0];
				if (/^image\/\w+$/.test(file.type)) {
					uploadedImageType = file.type;
					if (uploadedImageURL) {
						URL.revokeObjectURL(uploadedImageURL);
					}
					uploadedImageURL = URL.createObjectURL(file);
					imgContainer.height(400);
					imgContainer.width(400);
					var tempImg = $image.cropper('destroy').attr('src', uploadedImageURL).on('load', function () {
						imgContainer.width($(this).width());
						imgContainer.height($(this).height());
						tempImg.cropper(options);
					});
					$inputImage.val('');
				} else {
					window.alert('Please choose an image file.');
				}
			}
		});
	} else {
		$inputImage.prop('disabled', true).parent().addClass('disabled');
	}
	initBtnEvent();
}

function init() {
	var $image = $('#image');
	var username = localStorage.getItem('user');
	if (username == userId) {
		$('#userHeadImg').click(function () {
			$('#cropperMask').css('display', 'block');
			initCropper();
		});
		$('#editorUserMsgBtn').click(function () {
			$('#editorMask').css('display', 'block');
		});
		$('#selectImgBtn').click(function () {
			$('#inputImage').click();
		});
		$('#cancelSelectBtn').click(function () {
			$('#cropperMask').css('display', "none");
			$image.cropper('destroy');
		});
		$('#cancelEditorBtn').click(function () {
			$('#editorMask').css('display', "none");
			$image.cropper('destroy');
		});
		$('#myBar').css('display', 'block');
		$('#submitEditorBtn').click(function () {
			var school = $('#inputSchool').val();
			var age = $('#inputAge').val();
			var address = $('#inputAddress').val();
			if (!(school == '' && age == '' && address == '')) {
				if (school == '') {
					school = userData.school;
				}
				if (age == '') {
					age = userData.age;
				}
				if (address == '') {
					address = userData.address;
				}
				$.ajax({
					type: 'post',
					url: domain + '/pro/php/updateUserMsg.php',
					async: true,
					data: {
						username: userId,
						school: school,
						age: age,
						address: address
					},
					success: function (result) {
						console.log(result);
						if (result == 'success') {
							$('#editResultTip').html('提交成功');
							setTimeout(function () {
								window.location.reload();
							}, 300);
						} else {
							$('#editResultTip').html('未知错误');
						}
					}
				});
			} else {
				$('#editResultTip').html('内容为空');
			}
		});
		$('#applyBtn').css('display', 'inline-block').click(function () {
			var msg = prompt('请输入申请的内容');
			if (msg == null || msg == '') {
				return;
			}
			$.ajax({
				type: 'post',
				url: domain + '/pro/php/sendUserApply.php',
				async: true,
				data: {
					content: msg,
					applyerId: username
				},
				success: function (result) {
					if (result == 'success') {
						alert('已发送申请信息');
					} else {
						alert('未知错误');
					}
					window.location.reload();
				}
			});
		});
		$('#signBtn').css('display', 'inline-block').click(function () {
			addExpNoLimit(userId, 5, signResult);
		});
		if (userData.isSign == 1) {
			$('#signBtn').addClass('is_sign_btn');
			$('#signBtn').attr('disabled', true);
			$('#signBtn').html('已签到');
		} else {
			$('#signBtn').addClass('is_not_sign_btn');
			$('#signBtn').html('签到');
		}
		$('#chatBtn').css('display', 'none');
	} else {
		$('#btnInformtion').css('display', 'none');
		$('#editorUserMsgBtn').css('display', 'none');
		$('#myBar').css('display', 'none');
		$('#attentionBtn').css('display', 'inline-block');
		$('#chatBtn').css('display', 'inline-block').click(function () {
			$('#sendContainer').css('display', 'inline-block');
		});
		$('#cancelSubmit').click(function () {
			$('#sendContainer').css('display', 'none');
		});
		initSendAreaBtnsPressEvent();
		//头像框存在时，如果点击外面部分则消失
		$('html').click(function (e) {
			e = e || window.event;
			var target = e.target || window.srcElement;
			if (!($(target).hasClass('face_container') || $(target).attr('id') === 'selectFace')) {
				if ($('#faceContainer').css('display') === 'block') {
					$('#faceContainer').css('display', 'none');
				}
			}
		});
		$('#reportBtn').css('display', 'inline-block').click(function () {
			var msg = prompt('请输入举报内容');
			if (msg == null || msg == '') {
				return;
			}
			$.ajax({
				type: 'post',
				url: domain + '/pro/php/sendReport.php',
				async: true,
				data: {
					postId: 0,
					position: 0,
					content: msg,
					reporterId: username,
					reportederId: userId,
					barBelong: ''
				},
				success: function (result) {
					if (result == 'success') {
						alert('已发送举报信息');
					} else {
						console.log(result);
						alert('未知错误');
					}
					window.location.reload();
				}
			});
		});
		$.ajax({
			url: domain + "/pro/php/getAttentionStatus.php",
			type: 'get',
			async: true,
			data: {
				userId: userId,
				username: username
			},
			success: function (result) {
				var status = 0;
				try {
					var data = JSON.parse(result);
					if (data.result == 'none') {
						status = 0;
						$('#attentionBtn').html('关注');
					} else {
						if (data.data.status == 1) {
							status = 1;
							$('#attentionBtn').html('已关注');
						} else {
							status = 0;
							$('#attentionBtn').html('关注');
						}
					}
					$('#attentionBtn').click(function () {
						$.ajax({
							url: domain + "/pro/php/userAttention.php",
							type: 'post',
							async: true,
							data: {
								userId: userId,
								username: username,
								status: status
							},
							success: function (result) {
								if (result == 'success') {
									$('#attentionTip').css('display', 'inline-block').html('操作成功');
									window.location.reload();
								} else {
									$('#attentionTip').css('display', 'inline-block').html('操作失败');
									window.location.reload();
								}
							}
						});
					});
				} catch (e) {
					console.log(e);
					alert('未知错误');
				}
			}
		});
	}
	$('#userNickname').html(userData.nickname);
	$('#userHeadImg').attr('src', userData.headImg);
	$('#barAge').html('吧龄:' + barAge(userData.createDate) + '年');
	$('#myPostNum').html('发帖数:' + userData.postNum);
	var expData = getLv(userData.exp);
	$('#userLv').html('等级:' + expData.userLv+'('+expData.expNum+'/'+expData.needExpNum+')');
	$('#featureList li').each(function (index) {
		$(this).click(function () {
			switchContent(index);
			$('#featureList li').each(function (i) {
				if (i == index) {
					$(this).css('border-bottom', 'none');
				} else {
					$(this).css('border-bottom', '1px solid black');
				}
			});
		});
	});
	switchContent(0);
}

function initSendAreaBtnsPressEvent() {
	$('.face').click(function () {
		if (isEditorAreaBlur()) {
			var $img = $(this).clone();
			$img.removeAttr('class');
			insertHTML($img, $('#editorArea'));
			$('#faceContainer').css('display', 'none');
		}
	});
	//头像框存在时，如果点击外面部分则消失
	$('html').click(function (e) {
		e = e || window.event;
		var target = e.target || window.srcElement;
		if (!($(target).hasClass('face_container') || $(target).attr('id') === 'selectFace')) {
			if ($('#faceContainer').css('display') === 'block') {
				$('#faceContainer').css('display', 'none');
			}
		}
	});

	$('#selectFace').click(function () {
		if ($('#faceContainer').css('display') === 'block') {
			$('#faceContainer').css('display', 'none');
		} else {
			$('#faceContainer').css('display', 'block');
		}
	});
	$('#selectImg').click(function () {
		$('#inputSelectImg').click();
	});
	$('#submit').click(function () {
		onSubmitChatMsg();
	});
}

//点击发送按钮事件
function onSubmitChatMsg() {
	var content = $('#editorArea').html();
	if (content.trim() != '') {
		$('#sendTip').css('display', 'none');
		if (fileDataArr.length != 0) {
			$.ajax({
				url: domain + "/pro/php/saveTempChatImg.php",
				type: 'post',
				async: true,
				data: {
					imgsData: fileDataArr
				},
				success: function (result) {
					if (result == 'success') {
						submitChatMsg();
					} else {
						console.log(result);
						alert('未知错误,图片保存失败!');
					}
				},
				error: function (e) {
					console.log(e);
				}
			});
		} else {
			submitChatMsg();
		}
	} else {
		$('#sendTip').css('display', 'inline');
	}
}

//发送事件
function submitChatMsg() {
	var chatId = localStorage.getItem('user');
	var chatContent = $('#editorArea').html().trim();
	var imgReg = /<img\b[^>]*>/ig;
	if (imgReg.test(chatContent)) {
		var replaceReg = /postTempImg/g;
		chatContent = chatContent.replace(replaceReg, 'chatImg');
	}
	$('#sendTip').css('display', 'none');
	$.ajax({
		url: domain + "/pro/php/sendChatMsg.php",
		type: 'post',
		async: true,
		data: {
			chatedId: userId,
			chatId: chatId,
			content: chatContent
		},
		success: function (result) {
			if (result == 'success') {
				$('#sendTip').css('display', 'inline').html('发布成功');
				setTimeout(function () {
					window.location.reload();
				}, 300);
			} else {
				alert('未知错误,发布失败!');
			}
		},
		error: function (e) {
			console.log(e);
		}
	});
}

function isEditorAreaBlur() {
	var sel, range, checkNode;
	if (window.getSelection) {
		// IE9 and non-IE  
		sel = window.getSelection();
		if (sel.anchorNode) {
			//如果是文本节点
			if (sel.anchorNode.nodeType == 3) {
				checkNode = sel.anchorNode.parentNode;
			} else {
				checkNode = sel.anchorNode;
			}
			//当失去焦点的位置为editorArea或其子元素时，返回true
			if ($(checkNode).closest('#editorArea').length == 1 && $(checkNode).closest('#editorArea').attr('id') == 'editorArea') {
				return true;
			} else {
				//焦点位置不在editorArea，插入失败
				return false;
			}
		} else {
			console.log('sel.anchorNode为null');
		}
	}
	return true;
}

//在可编辑div中光标处插入对象(图片)
function insertHTML(eleContent, eleContainer) {
	var sel, range;
	if (window.getSelection) {
		// IE9 and non-IE  
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();
			var el = document.createElement('div');
			var $el = $(el);
			$el.append(eleContent);
			var frag = document.createDocumentFragment(), node, lastNode;
			while ((node = el.firstChild)) {
				lastNode = frag.appendChild(node);
			}
			range.insertNode(frag);
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	} else if (document.selection && document.selection.type != 'Control') {
		eleContainer.focus(); //在非标准浏览器中 要先让你需要插入html的div 获得焦点  
		ierange = document.selection.createRange();//获取光标位置  
		ierange.pasteHTML(eleContent);    //在光标位置插入html 如果只是插入text 则就是fus.text="..."  
		eleContainer.focus();
	}
}

function imgChange(e) {
	if (isEditorAreaBlur()) {
		var fileType = e.target.files[0].type;
		if (fileType.indexOf('image') != -1) {
			var reader = new FileReader();
			var file = document.getElementById('inputSelectImg').files[0];
			reader.readAsDataURL(file);
			reader.onload = function (e) {
				var fileData = e.target.result;
				$.ajax({
					url: domain + "/pro/php/getTempImgFile.php",
					type: 'post',
					async: true,
					data: {
						fileData: fileData
					},
					success: function (result) {
						var data = JSON.parse(result);
						if (data.result == 'success') {
							var $img = $('<img />');
							fileDataArr.push(data.filePath);
							$img.attr('src', data.filePath);
							insertHTML($img, $('#editorArea'));
							$('#editorArea').focus();
							$img.bind('DOMNodeRemoved', function () {
								removeNotNeedImg(data.filePath);
							});
						} else {
							alert('选择图片失败');
						}
					},
					error: function (e) {
						console.log(e);
					}
				});
			}
		} else {
			alert('只能上传图片');
		}
	} else {
		console.log('焦点不是editorarea');
	}
}

//签到回调函数
function signResult(result) {
	if (result) {
		changeSignStatus();
	} else {
		alert('未知错误');
	}
}
function changeSignStatus() {
	$.ajax({
		url: domain + "/pro/php/changeSignStatus.php",
		type: 'post',
		async: true,
		data: {
			userId: userId
		},
		success: function (result) {
			if (result == 'success') {
				alert('签到成功');
				window.location.reload();
			} else {
				alert('未知错误');
				window.location.reload();
			}
		}
	});
}

function switchContent(num) {
	var item;
	$('#content').children().remove();
	$('#content').attr('type', num);
	$('#content').attr('index', 0);
	$('#content').attr('totalPageNum', 0);
	switch (num) {
		case 0:
			item = getContentUserMsg();
			break;
		case 1:
			item = getPageItem();
			break;
		case 2:
			item = getPageItem();
			break;
		case 3:
			item = getPageItem();
			break;
		case 4:
			item = getMyAttentionBar(userId);
			break;
		case 5:
			item = getMyAttentionUser();
			break;
		case 6:
			item = getMyBarItem();
			break;
		default:
			break;
	}
	$('#content').append(item);
	initIndexBtnPressEvent();
}

function getMyAttentionUser() {
	$.ajax({
		url: domain + "/pro/php/getMyAttentionUser.php",
		type: 'get',
		async: true,
		data: {
			userId: userId
		},
		success: function (result) {
			try {
				var data = JSON.parse(result);
			} catch (e) {
				console.log(e);
			}
			if (data.result) {
				// console.log(data);
				createMyAttentionUserItem(data.data);
			} else {
				console.log(result);
				alert('未知错误');
			}
		}
	});
}

function createMyAttentionUserItem(data) {
	console.log(data);
	var $container = $('<div></div>');
	if (data.length == 0) {
		var $tip = $('<p></p>');
		$tip.html('还没有关注任何人!');
		$tip.addClass('noAttentionBarTip');
		$container.append($tip);
	} else {
		for (var i = 0; i < data.length; i++) {
			var $div = $('<div></div>');
			$div.html(data[i].nickname);
			$div.attr('userId', data[i].attentionedId);
			$div.attr('userName', data[i].nickname);
			$div.addClass('my_attention_bar_item');
			$div.click(function () {
				window.location.href = "http://localhost/pro/page/personal_space.html?userId=" + $(this).attr('userId');
			});
			$container.append($div);
		}
	}
	$('#content').append($container);
}

function getMyAttentionBar(userId) {
	$.ajax({
		url: domain + "/pro/php/getMyAttentionBar.php",
		type: 'get',
		async: true,
		data: {
			userId: userId
		},
		success: function (result) {
			try {
				var data = JSON.parse(result);
			} catch (e) {
				console.log(e);
			}
			if (data.result) {
				createMyAttentionBar(data.data);
			} else {
				console.log(result);
				alert('未知错误');
			}
		}
	});
}

function createMyAttentionBar(data) {
	var $container = $('<div></div>');
	if (data.length == 0) {
		var $tip = $('<p></p>');
		$tip.html('还没有关注任何吧!');
		$tip.addClass('noAttentionBarTip');
		$container.append($tip);
	} else {
		for (var i = 0; i < data.length; i++) {
			var $div = $('<div></div>');
			$div.html(data[i].barName + '吧');
			$div.attr('barId', data[i].id);
			$div.attr('barName', data[i].barName);
			$div.addClass('my_attention_bar_item');
			$div.click(function () {
				window.location.href = "http://localhost/pro/page/bar.html?barName=" + $(this).attr('barName');
			});
			$container.append($div);
		}
	}
	$('#content').append($container);
}

function getMyBarItem() {
	$.ajax({
		url: domain + "/pro/php/getMyBar.php",
		type: 'get',
		async: true,
		data: {
			userId: userId
		},
		success: function (result) {
			try {
				var data = JSON.parse(result);
			} catch (e) {
				console.log(e);
			}
			if (data.result) {
				console.log(data);
				createMyBarItem(data.data);
			} else {
				console.log(result);
				alert('未知错误');
			}
		}
	});
}

function createMyBarItem(data) {
	var $container = $('<div></div>');
	if (data.length == 0) {
		var $tip = $('<p></p>');
		$tip.html('还没有关注任何吧!');
		$tip.addClass('noAttentionBarTip');
		$container.append($tip);
	} else {
		for (var i = 0; i < data.length; i++) {
			var $div = $('<div></div>');
			$div.html(data[i].barName + '吧');
			$div.attr('barId', data[i].id);
			$div.attr('barName', data[i].barName);
			$div.addClass('my_attention_bar_item');
			$div.click(function () {
				window.location.href = "http://localhost/pro/page/bar.html?barName=" + $(this).attr('barName');
			});
			$container.append($div);
		}
	}
	$('#content').append($container);
}

function getPageItem() {
	var container = $('<div></div>');
	var indexComponent = createIndex();
	container.append(indexComponent);
	getData(0);
	return container;
}

//分页区域
function getData(currIndex) {
	var type = $('#content').attr('type');
	type = Number(type);
	var fileName;
	var requsetData = {};
	requsetData.indexNum = currIndex;
	switch (type) {
		case 1:
			//我发布的帖子
			fileName = 'getMyPostData';
			requsetData.userId = userId;
			break;
		case 2:
			//回复过的帖子
			fileName = 'getMyReplyPostData';
			requsetData.userId = userId;
			break;
		case 3:
			//通知
			fileName = 'getMyInform';
			requsetData.userId = userId;
			break;
		default:
			break;
	}
	$.ajax({
		type: 'get',
		url: domain + '/pro/php/' + fileName + '.php',
		async: true,
		data: requsetData,
		success: function (result) {
			try {
				var data = JSON.parse(result);
			} catch (e) {
				console.log(result);
				console.log(e);
			}
			if (data.result == 'none') {
				alert('没有记录');
			} else {
				freshContent(data, currIndex);
			}
		}
	});
}

function haveAgree(postId, $ele) {
	var userId = localStorage.getItem('user');
	if (userId == null) {
		$ele.click(function () {
			alert('请先登录');
		}).html('点赞');
		return;
	} else {
		$.ajax({
			url: domain + '/pro/php/isHaveAgree.php',
			data: {
				userId: userId,
				postId: postId
			},
			async: true,
			type: 'get',
			success: function (result) {
				try {
					var data = JSON.parse(result);
					if (data) {
						$ele.attr('disabled', true);
						$ele.addClass('have_agree');
						$ele.html('已点赞');
					} else {
						$ele.click(function () {
							$.ajax({
								url: domain + '/pro/php/setAgree.php',
								data: {
									userId: userId,
									postId: postId
								},
								async: true,
								type: 'post',
								success: function (result2) {
									if (result2 == 'success') {
										alert('点赞成功');
										window.location.reload();
									} else {
										console.log(result);
										alert('未知错误,点赞失败');
										window.location.reload();
									}
								}
							});
						});
					}
				} catch (e) {
					console.log(result);
					console.log(e);
				}
			}
		});
	}
}

function freshContent(data, currIndex) {
	var item;
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true : false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if (pageNum == 0) {
		pageNum = 1;
	}
	$('#content .index').siblings().remove();
	$('#content').attr('index', currIndex);
	$('#content').attr('totalpagenum', --pageNum);
	var type = $('#content').attr('type');
	type = Number(type);
	switch (type) {
		case 1:
			//我发布的帖子
			var item = createMyPostItems(data);
			break;
		case 2:
			//我回复的帖子
			var item = createMyReplyItems(data);
			break;
		case 3:
			//通知
			var item = createMyInformItems(data);
			break;
	}
	$('#content').find('.index').before(item);
	initIndex();
}

function createMyPostItems(data) {
	var container = $('<div></div>');
	container.addClass('posts');
	for (var k = 0; k < data.value.length; k++) {
		var item = createPostItem(data.value[k]);
		container.append(item);
	}
	return container;
}

function createMyReplyItems(data) {
	var container = $('<div></div>');
	container.addClass('my_reply_posts');
	for (var k = 0; k < data.value.length; k++) {
		var item = createMyReplyPostItem(data.value[k]);
		container.append(item);
	}
	return container;
}

function createMyInformItems(data) {
	var container = $('<div></div>');
	container.addClass('my_informs');
	for (var k = 0; k < data.value.length; k++) {
		var item = createMyInformItem(data.value[k]);
		container.append(item);
	}
	return container;
}

function createMyInformItem(data) {
	var informTimeStr = '';
	var container = $('<div></div>');
	container.addClass('inform');
	container.attr('informId', data.id);
	var informer = $('<p></p>');
	informer.addClass('informer');
	informer.html(data.informNickname + ':');
	var informContent = $('<p></p>');
	informContent.addClass('inform_content');
	var isReplyInform = data.informContent.indexOf('?postTitle') != -1;
	var content = $('<span></span>');
	if (isReplyInform) {
		if (data.informContent.indexOf('$postTitle') == -1) {
			var paramsStr = data.informContent.substr(data.informContent.indexOf('?postTitle'));
			var params = getStrToParams(paramsStr);
			content.html(data.informContent.substring(0, data.informContent.indexOf('?postTitle')));
			var postTitleSpan = $('<span></span>');
			postTitleSpan.html(params.postTitle);
			postTitleSpan.addClass('inform_post_title');
			postTitleSpan.click(function () {
				window.location.href = "http://localhost/pro/page/post.html?postId=" + params.postId;
			});
			content.append(postTitleSpan);
		} else {
			var paramsStr = data.informContent.substr(data.informContent.indexOf('?postTitle'));
			var params = getStrToParams(paramsStr);
			var contentStr = data.informContent.substring(0, data.informContent.indexOf('?postTitle'));
			var str1 = contentStr.substring(0, contentStr.indexOf('$postTitle'));
			var str2 = contentStr.substr(contentStr.indexOf('$postTitle') + '$postTitle'.length);
			content.html(str1);
			var postTitleSpan = $('<span></span>');
			postTitleSpan.html(params.postTitle);
			postTitleSpan.addClass('inform_post_title');
			postTitleSpan.click(function () {
				window.location.href = "http://localhost/pro/page/post.html?postId=" + params.postId;
			});
			content.append(postTitleSpan);
			var lastContent = $('<span></span>');
			lastContent.html(str2 + params.replyContent);
			content.append(lastContent);
		}
	} else {
		content.html(data.informContent);
	}
	informContent.append(content);
	var informWrapper = $('<div></div>');
	informWrapper.addClass('inform_wrapper');
	var informTime = $('<span></span>');
	informTime.addClass('inform_time');
	if (isToday(data.informTime)) {
		informTimeStr = data.informTime.substr(11);
	} else {
		informTimeStr = data.informTime.substr(0, 10);
	}
	informTime.html(informTimeStr);
	informWrapper.append(informTime);
	if (data.status == 1) {
		var informBtn = $('<button></button>');
		informBtn.addClass('inform_btn');
		informBtn.html('确定');
		informBtn.click(function () {
			var optionResult = confirm('确认设置为已读？');
			if (optionResult) {
				changeInformStatus.call(this);
			}
		});
		informWrapper.append(informBtn);
	} else {
		var haveReadTip = $('<span></span>');
		haveReadTip.addClass('have_read_tip');
		haveReadTip.html('已读');
		informWrapper.append(haveReadTip);
	}

	container.append(informer);
	container.append(informContent);
	container.append(informWrapper);
	return container;
}

//将通知状态变为已读接口
function changeInformStatus() {
	var id = $(this).closest('.inform').attr('informId');
	id = Number(id);
	$.ajax({
		type: 'post',
		url: domain + '/pro/php/changeInformStatus.php',
		async: true,
		data: {
			id: id
		},
		success: function (result) {
			if (result == 'success') {
				alert('设置成功');
				window.location.reload();
			} else {
				console.log(result);
				alert('未知错误');
			}
		}
	});
}

function createIndex() {
	var $indexUl = $('<ul></ul>');
	$indexUl.addClass('index');
	var $replyPagingFirstBtnLi = $('<li></li>');
	$replyPagingFirstBtnLi.addClass('paging_btn');
	$replyPagingFirstBtnLi.addClass('first_btn');
	$replyPagingFirstBtnLi.html('首页');
	$replyPagingFirstBtnLi.attr('id', 'firstPageBtn');
	var $replyPagingPrevBtnLi = $('<li></li>');
	$replyPagingPrevBtnLi.addClass('paging_btn');
	$replyPagingPrevBtnLi.addClass('prev_btn');
	$replyPagingPrevBtnLi.html('上一页');
	$replyPagingPrevBtnLi.attr('id', 'prevPageBtn');
	$indexUl.append($replyPagingFirstBtnLi);
	$indexUl.append($replyPagingPrevBtnLi);
	for (var i = 0; i < 10; i++) {
		var $replyPagingIndexBtnLi = $('<li></li>');
		$replyPagingIndexBtnLi.addClass('index_item');
		$replyPagingIndexBtnLi.html(i + 1);
		$indexUl.append($replyPagingIndexBtnLi);
	}
	var $replyPagingNextBtnLi = $('<li></li>');
	$replyPagingNextBtnLi.addClass('paging_btn');
	$replyPagingNextBtnLi.addClass('next_btn');
	$replyPagingNextBtnLi.html('下一页');
	$replyPagingNextBtnLi.attr('id', 'nextPageBtn');
	var $replyPagingLastBtnLi = $('<li></li>');
	$replyPagingLastBtnLi.addClass('paging_btn');
	$replyPagingLastBtnLi.addClass('last_btn');
	$replyPagingLastBtnLi.html('尾页');
	$replyPagingLastBtnLi.attr('id', 'lastPageBtn');
	$indexUl.append($replyPagingNextBtnLi);
	$indexUl.append($replyPagingLastBtnLi);
	return $indexUl;
}

function getContentUserMsg() {
	var $container = $('<div></div>');
	$container.addClass('contentUserMsgItemContainer');
	var $schoolItem = $('<p></p>');
	$schoolItem.addClass('contentUserMsgItem');
	var $ageItem = $('<p></p>');
	$ageItem.addClass('contentUserMsgItem');
	var $addressItem = $('<p></p>');
	$addressItem.addClass('contentUserMsgItem');
	$schoolItem.html('学校:' + userData.school);
	$ageItem.html('年龄:' + userData.age);
	$addressItem.html('地址:' + userData.address);
	$container.append($schoolItem);
	$container.append($ageItem);
	$container.append($addressItem);
	return $container;
}

function initIndexBtnPressEvent() {
	$('#prevPageBtn').click(function () {
		prevPage();
	});
	$('#nextPageBtn').click(function () {
		nextPage();
	});
	$('#firstPageBtn').click(function () {
		firstPage();
	});
	$('#lastPageBtn').click(function () {
		lastPage();
	});
	$('.index_item').click(function () {
		var index = Number($(this).html()) - 1;
		getData(index);
	});
}

function resizeImg() {
	$(this).siblings("img").each(function () {
		$(this).css('height', '100px');
		$(this).css('max-width', '134px');
	});
	if ($(this).css('height') == '100px') {
		$(this).css('height', '400px');
		$(this).css('max-width', '900px');
	} else {
		$(this).css('height', '100px');
		$(this).css('max-width', '134px');
	}
}

function createPostItem(data) {
	// console.log(data);
	var maxShowImgNum = 4;
	var imgReg = /<img\b[^>]*(postImg|replyImg)[^>]*>/ig;
	var $postDiv = $('<div></div>');
	$postDiv.addClass('post');
	var $postContentDiv = $('<div></div>');
	$postContentDiv.addClass('post_content');
	var $postTitleContainerDiv = $('<div></div>');
	$postTitleContainerDiv.addClass('post_title_container');

	// var $isTopP = $('<p></p>');
	// $isTopP.addClass('is_top');
	// if (data.isTop == '0') {
	// 	$isTopP.css('display', 'none');
	// }
	// var $isGreatP = $('<p></p>');
	// $isGreatP.addClass('is_great');
	// if (data.isGreat == '0') {
	// 	$isGreatP.css('display', 'none');
	// }
	var $postTitleTextP = $('<p></p>');
	$postTitleTextP.addClass('post_title_text');
	$postTitleTextP.html(data.postName);
	$postTitleTextP.click(function () {
		var postId = $(this).parents('.post').attr('postId');
		window.location.href = 'http://localhost/pro/page/post.html?' + 'postId=' + postId;
	});
	// $postTitleContainerDiv.append($isTopP);
	// $postTitleContainerDiv.append($isGreatP);
	$postTitleContainerDiv.append($postTitleTextP);

	var $postImgContainerDiv = $('<div></div>');
	$postImgContainerDiv.addClass('post_img_container');
	var $postContentIntroP = $('<p></p>');
	$postContentIntroP.addClass('post_content_intro');
	$postContentIntroP.html(data.postContent.replace(imgReg, ''));
	$postImgContainerDiv.append($postContentIntroP);
	var imgArr = data.postContent.match(imgReg);
	if (imgArr) {
		for (var j = 0; j < imgArr.length && j < maxShowImgNum; j++) {
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
	$postMsgPeopleImg.attr('src', '../img/proImg/people.png');
	var $masterNameP = $('<p></p>');
	$masterNameP.addClass('master_name');
	$masterNameP.html(data.creatorNickName);
	$masterMsgDiv.append($postMsgPeopleImg);
	$masterMsgDiv.append($masterNameP);

	var $replyNumMsgDiv = $('<div></div>');
	$replyNumMsgDiv.addClass('reply_num_msg');
	var $postMsgReplyImg = $('<img />');
	$postMsgReplyImg.addClass('post_msg_reply_img');
	$postMsgReplyImg.attr('src', '../img/proImg/msg.png');
	var $replyNumP = $('<p></p>');
	$replyNumP.addClass('reply_num');
	$replyNumP.html(data.replyNum);
	$replyNumMsgDiv.append($postMsgReplyImg);
	$replyNumMsgDiv.append($replyNumP);

	var $postTimeDiv = $('<div></div>');
	var showCreateTimeStr = '';
	$postTimeDiv.addClass('post_time');
	if (isToday(data.createTime)) {
		showCreateTimeStr = data.createTime.substr(11);
	} else {
		showCreateTimeStr = data.createTime.substr(0, 10);
	}
	$postTimeDiv.html(showCreateTimeStr);
	var $agreeBtn = $('<button></button>');
	$agreeBtn.addClass('agree_btn');
	$agreeBtn.html('点赞');
	haveAgree(data.id, $agreeBtn);
	var $agreeNumP = $('<p></p>');
	// $agreeBtn.addClass('agree_btn');
	$agreeNumP.html('点赞数:' + data.agreeNum);

	$postMsgDiv.append($masterMsgDiv);
	$postMsgDiv.append($replyNumMsgDiv);
	$postMsgDiv.append($postTimeDiv);
	$postMsgDiv.append($agreeNumP);
	$postMsgDiv.append($agreeBtn);

	$postDiv.append($postContentDiv);
	$postDiv.append($postMsgDiv);
	$postDiv.attr('postId', data.id);
	$postDiv.attr('postId', data.id);
	return $postDiv;
}
function initIndex() {
	var maxShowIndex = 10;
	var currIndex = Number($('#content').attr('index'));
	var totalNum = Number($('#content').attr('totalpagenum'));
	var halfIndexNum = Math.floor(maxShowIndex / 2) + 1;
	if (currIndex == 0) {
		$('#prevPageBtn').css('display', 'none');
		$('#firstPageBtn').css('display', 'none');
	} else {
		$('#prevPageBtn').css('display', 'inline-block');
		$('#firstPageBtn').css('display', 'inline-block');
	}
	if (currIndex == totalNum) {
		$('#nextPageBtn').css('display', 'none');
		$('#lastPageBtn').css('display', 'none');
	} else {
		$('#nextPageBtn').css('display', 'inline-block');
		$('#lastPageBtn').css('display', 'inline-block');
	}
	$('.index_item').removeClass('currIndex');

	if (totalNum < maxShowIndex) {
		$('.index_item').each(function (index) {
			if (index > totalNum) {
				$(this).css('display', 'none');
			}
			if (index == currIndex) {
				$(this).addClass('currIndex');
			}
		});
	} else {
		if (currIndex < halfIndexNum) {
			$('.index_item').each(function (index) {
				$(this).html(index + 1);
			});
		} else if (currIndex > totalNum - halfIndexNum) {
			$('.index_item').each(function (index) {
				$(this).html(totalNum + 1 - (maxShowIndex - 1 - index));
			});
		} else {
			$('.index_item').each(function (index) {
				$(this).html(currIndex + 1 - (halfIndexNum - index - 1));
			});
		}
		$('.index_item').each(function (index) {
			if ($(this).html() == currIndex + 1) {
				$(this).addClass('currIndex');
			}
		});
	}
}

function prevPage() {
	var currIndex = Number($('#content').attr('index'));
	if (currIndex > 0) {
		getData(--currIndex);
	}
}

function nextPage() {
	var currIndex = Number($('#content').attr('index'));
	var totalNum = Number($('#content').attr('totalPageNum'));
	if (currIndex < totalNum) {
		getData(++currIndex);
	}
}

function firstPage() {
	var currIndex = Number($('#content').attr('index'));
	if (currIndex != 0) {
		getData(0);
	}
}

function lastPage() {
	var currIndex = Number($('#content').attr('index'));
	var totalNum = Number($('#content').attr('totalPageNum'));
	if (currIndex != totalNum) {
		getData(totalNum);
	}
}

function initBtnEvent() {
	$('#btnGetCropper').click(function () {
		var $download = $('#download');
		var uploadedImageType = 'image/jpeg';
		var $image = $('#image');
		var $this = $(this);
		var data = $this.data();
		var cropper = $image.data('cropper');
		var cropped;
		var result;
		if (cropper && data.method) {
			data = $.extend({}, data); // Clone a new one
			cropped = cropper.cropped;
			if (uploadedImageType === 'image/jpeg') {
				if (!data.option) {
					data.option = {};
				}
				data.option.fillColor = '#fff';
			}
			result = $image.cropper(data.method, data.option, data.secondOption);
			var imgURL = result.toDataURL();
			$.ajax({
				type: 'post',
				url: domain + '/pro/php/saveUserHeadImg.php',
				async: true,
				data: {
					fileData: imgURL,
					username: userId
				},
				success: function (result) {
					try {
						var data = JSON.parse(result);
					} catch (e) {
						console.log(e);
					}
					if (data.result == 'success') {
						window.location.reload();
					} else {
						alert('未知错误');
					}
				}
			});
			/*
			if(result){
					  //$('#resultImgContainer').html(result);
					  //点击下载(通过设置a标签href为文件url)
			  if(!$download.hasClass('disabled')){
				$download.attr('href', result.toDataURL(uploadedImageType));
			  }
			}
			*/
		}
	});
}

function createMyReplyPostItem(data) {
	// console.log(data);
	var imgReg = /<img\b[^>]*(postImg|replyImg)[^>]*>/ig;
	var $myReplyPostDiv = $('<div></div>');
	$myReplyPostDiv.addClass('my_reply_post');
	$myReplyPostDiv.attr('postId', data.postBelongId);
	var $replyPostFromContainerDiv = $('<div></div>');
	$replyPostFromContainerDiv.addClass('reply_post_from_container');
	var $replyPostNameSpan = $('<span></span>');
	$replyPostNameSpan.addClass('reply_post_name');
	$replyPostNameSpan.html(data.postName);
	$replyPostNameSpan.click(function () {
		var postId = $(this).closest('.my_reply_post').attr('postId');
		window.location.href = 'http://localhost/pro/page/post.html?' + 'postId=' + postId;
	});
	var $replyPostBarBelongSpan = $('<span></span>');
	$replyPostBarBelongSpan.addClass('reply_post_bar_belong');
	$replyPostBarBelongSpan.html('来自:' + data.barBelong + '吧');
	var $replyPostContentP = $('<p></p>');
	$replyPostContentP.addClass('reply_post_content');
	var content = data.content.replace(imgReg, '');
	$replyPostContentP.html('回复内容:' + content);
	var $replyPostTimeP = $('<p></p>');
	$replyPostTimeP.addClass('reply_post_time');
	var replyTime = data.createTime;
	if (isToday(replyTime)) {
		replyTime = replyTime.substr(11);
	} else {
		replyTime = replyTime.substr(0, 10);
	}
	$replyPostTimeP.html('回复时间:' + replyTime);

	$replyPostFromContainerDiv.append($replyPostNameSpan);
	$replyPostFromContainerDiv.append($replyPostBarBelongSpan);
	$myReplyPostDiv.append($replyPostFromContainerDiv);
	$myReplyPostDiv.append($replyPostContentP);
	$myReplyPostDiv.append($replyPostTimeP);
	return $myReplyPostDiv;
}
