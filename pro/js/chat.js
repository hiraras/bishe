var domain = 'http://localhost';
(function(){
    var userId = localStorage.getItem('user');
    if(userId == null){
        window.location.href = "http://localhost/pro/index.html";
        return ;
    }
    init();
})();

function init(){
    $('.feature_item').each(function (index) {
		$(this).click(function () {
			switchContent(index);
			$('.feature_item').each(function (i) {
				if (i == index) {
                    $(this).css({
                        'background': '#00a0cd',
                        'color': '#ffffff',
                    });
				} else {
                    $(this).css({
                        'background': '#ffffff',
                        'color': '#000000',
                    });
				}
			});
		});
	});
	switchContent(0);
}

function switchContent(num) {
	var item;
	$('#right').children().remove();
	$('#right').attr('type', num);
	$('#right').attr('index', 0);
	$('#right').attr('totalPageNum', 0);
	switch (num) {
		case 0:
			item = getPageItem();
			break;
		case 1:
			item = getPageItem();
			break;
		case 2:
			item = getPageItem();
			break;
		default:
			break;
	}
	$('#right').append(item);
	initIndexBtnPressEvent();
}

function getPageItem() {
	var container = $('<div></div>');
	var indexComponent = createIndex();
	container.append(indexComponent);
	getData(0);
	return container;
}

function getData(currIndex) {
	var type = $('#right').attr('type');
	type = Number(type);
	var fileName;
    var requsetData = {};
    var userId = localStorage.getItem('user');
	requsetData.indexNum = currIndex;
	switch (type) {
		case 0:
			//全部私信
			fileName = 'getChatMsgPage';
            requsetData.userId = userId;
            requsetData.type = 0;
			break;
		case 1:
			//未读私信
			fileName = 'getChatMsgPage';
            requsetData.userId = userId;
            requsetData.type = 1;
			break;
		case 2:
			//已读私信
			fileName = 'getChatMsgPage';
            requsetData.userId = userId;
            requsetData.type = 2;
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

function freshContent(data, currIndex) {
	var item;
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true : false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if (pageNum == 0) {
		pageNum = 1;
	}
	$('#right .index').siblings().remove();
	$('#right').attr('index', currIndex);
	$('#right').attr('totalpagenum', --pageNum);
	var type = $('#right').attr('type');
	type = Number(type);
	switch (type) {
		case 0:
			//全部私信
			var item = createChatItems(data);
			break;
		case 1:
			//未读私信
			var item = createChatItems(data);
			break;
		case 2:
			//已读私信
			var item = createChatItems(data);
			break;
	}
	$('#right').find('.index').before(item);
	initIndex();
}

function createChatItems(data){
	var container = $('<div></div>');
	container.addClass('my_chat');
	for (var k = 0; k < data.value.length; k++) {
		var item = createChatItem(data.value[k]);
		container.append(item);
	}
	return container;
}

function createChatItem(data){
	console.log(data);
	var container = $('<div></div>');
	container.addClass('chat_item');
	var nicknameP = $('<p></p>');
	nicknameP.addClass('send_nickname');
	nicknameP.html(data.chatNickname);
	nicknameP.click(function(){
		window.location.href = "http://localhost/pro/page/personal_space.html?userId="+data.chatId;
	});
	var imgReg=/<img\b[^>]*>/ig;
	var chatContent = data.content;
	if(imgReg.test(chatContent)){
		chatContent = chatContent.replace(imgReg, '');
	}
	var titleP = $('<p></p>');
	titleP.addClass('send_content');
	titleP.html(chatContent);
	if (isToday(data.chatTime)) {
		var chatTime = data.chatTime.substr(11);
	} else {
		var chatTime = data.chatTime.substr(0, 10);
	}
	var timeP = $('<p></p>');
	timeP.addClass('send_time');
	timeP.html(chatTime);
	if(data.status == 1){
		nicknameP.addClass('is_read');
		titleP.addClass('is_read');
	}
	container.append(nicknameP);
	container.append(titleP);
	container.append(timeP);
	return container;
}

function initIndex() {
	var maxShowIndex = 10;
	var currIndex = Number($('#right').attr('index'));
	var totalNum = Number($('#right').attr('totalpagenum'));
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

function prevPage() {
	var currIndex = Number($('#right').attr('index'));
	if (currIndex > 0) {
		getData(--currIndex);
	}
}

function nextPage() {
	var currIndex = Number($('#right').attr('index'));
	var totalNum = Number($('#right').attr('totalPageNum'));
	if (currIndex < totalNum) {
		getData(++currIndex);
	}
}

function firstPage() {
	var currIndex = Number($('#right').attr('index'));
	if (currIndex != 0) {
		getData(0);
	}
}

function lastPage() {
	var currIndex = Number($('#right').attr('index'));
	var totalNum = Number($('#right').attr('totalPageNum'));
	if (currIndex != totalNum) {
		getData(totalNum);
	}
}





















