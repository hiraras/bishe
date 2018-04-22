var domain = 'http://localhost';
(function () {
	var pageUrl = window.location.href;
	var postTitle = '';
	var urlParams = pageUrl.substr(pageUrl.indexOf('?') + 1).split('&');
	if (pageUrl.indexOf('postTitle') == -1) {
		window.location.href = domain + '/pro/index.html';
		return;
	}
	for (var i = 0; i < urlParams.length; i++) {
		if (urlParams[i].indexOf('postTitle') !== -1) {
			postTitle = urlParams[i].substr(urlParams[i].indexOf('=') + 1);
			//把乱码的中文字符串转成中文
			postTitle = decodeURI(postTitle);
		}
	}
	$('#search').attr('maxlength', 80);
	$('#search').val(postTitle);
	getPostPageMsg(postTitle, 0);
	initPagingIndexClick(postTitle);
}());

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

function getPostPageMsg(postTitle, indexNum) {
	$.ajax({
		url: domain + "/pro/php/getSearchPosts.php",
		type: 'get',
		async: true,
		data: {
			postTitle: postTitle,
			indexNum: indexNum
		},
		success: function (result) {
			var data = JSON.parse(result);
			if (data.totalNum == 0) {
				$('#noPostTip').css('display', 'block');
			} else {
				$('#noPostTip').css('display', 'none');
				freshBarItems(data, indexNum);
			}
		}
	});
}

function initPagingIndexClick(postTitle) {
	$('#prevBtn').click(function () {
		prevPage(postTitle);
	});
	$('#nextBtn').click(function () {
		nextPage(postTitle);
	});
	$('#firstPageBtn').click(function () {
		firstPage(postTitle);
	});
	$('#lastPageBtn').click(function () {
		lastPage(postTitle);
	});
	$('.index_item').click(function () {
		var index = Number($(this).html()) - 1;
		getPostPageMsg(postTitle, index);
	});
}

function initIndex() {
	var maxShowIndex = 10;
	var currIndex = Number($('#postsContainer').attr('index'));
	var totalNum = Number($('#postsContainer').attr('totalpagenum'));
	var halfIndexNum = Math.floor(maxShowIndex / 2) + 1;
	if (currIndex == 0) {
		$('#prevBtn').css('display', 'none');
		$('#firstPageBtn').css('display', 'none');
	} else {
		$('#prevBtn').css('display', 'inline-block');
		$('#firstPageBtn').css('display', 'inline-block');
	}
	if (currIndex == totalNum) {
		$('#nextBtn').css('display', 'none');
		$('#lastPageBtn').css('display', 'none');
	} else {
		$('#nextBtn').css('display', 'inline-block');
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

function freshBarItems(data, indexNum) {
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true : false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if (pageNum == 0) {
		pageNum = 1;
	}
	$('#postsContainer').find('.post').remove();
	$('#postsContainer').attr('index', indexNum);
	$('#postsContainer').attr('totalpagenum', --pageNum);
	for (var i = 0; i < data.value.length; i++) {
		var $item = createPostItem(data.value[i]);
		$('#postsContainer').find('.index').before($item);
	}
	initIndex();
}

function prevPage(postTitle) {
	var currIndex = Number($('#postsContainer').attr('index'));
	if (currIndex > 0) {
		getPostPageMsg(postTitle, --currIndex);
	}
}

function nextPage(postTitle) {
	var currIndex = Number($('#postsContainer').attr('index'));
	var totalNum = Number($('#postsContainer').attr('totalpagenum'));
	console.log(currIndex, totalNum);
	if (currIndex < totalNum) {
		getPostPageMsg(postTitle, ++currIndex);
	}
}

function firstPage(postTitle) {
	var currIndex = Number($('#postsContainer').attr('index'));
	if (currIndex != 0) {
		getPostPageMsg(postTitle, 0);
	}
}

function lastPage(postTitle) {
	var currIndex = Number($('#postsContainer').attr('index'));
	var totalNum = Number($('#postsContainer').attr('totalpagenum'));
	if (currIndex != totalNum) {
		getPostPageMsg(postTitle, totalNum);
	}
}

function createPostItem(data) {
	// console.log(data);
	var maxShowImgNum = 4;
	var imgReg = /<img\b[^>]*postImg[^>]*>/ig;
	var $postDiv = $('<div></div>');
	$postDiv.addClass('post');
	var $postContentDiv = $('<div></div>');
	$postContentDiv.addClass('post_content');
	var $postTitleContainerDiv = $('<div></div>');
	$postTitleContainerDiv.addClass('post_title_container');

	var $isTopP = $('<p></p>');
	$isTopP.addClass('is_top');
	if (data.isTop == '0') {
		$isTopP.css('display', 'none');
	}
	var $isGreatP = $('<p></p>');
	$isGreatP.addClass('is_great');
	if (data.isGreat == '0') {
		$isGreatP.css('display', 'none');
	}
	var $postTitleTextP = $('<p></p>');
	$postTitleTextP.addClass('post_title_text');
	$postTitleTextP.html(data.postName);
	$postTitleTextP.click(function () {
		var postId = $(this).parents('.post').attr('postId');
		window.location.href = 'http://localhost/pro/page/post.html?' + 'postId=' + postId;
	});
	$postTitleContainerDiv.append($isTopP);
	$postTitleContainerDiv.append($isGreatP);
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
