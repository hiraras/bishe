var domain = 'http://localhost';
(function(){
	var pageUrl = window.location.href;
	var themeName = '';
	var urlParams = pageUrl.substr(pageUrl.indexOf('?')+1).split('&');
	for(var i=0;i<urlParams.length;i++){
		if(urlParams[i].indexOf('themeName') !== -1){
			themeName = urlParams[i].substr(urlParams[i].indexOf('=')+1);
			//把乱码的中文字符串转成中文
			themeName = decodeURI(themeName);
		}
	}
	$('#themeTitle').html(themeName);
	initPagingIndexClick(themeName);
	getRecommand(themeName);
	getBarMsg(themeName,0);
}());
function initPagingIndexClick(themeName){
	$('#prevBtn').click(function(){
		prevPage(themeName);
	});
	$('#nextBtn').click(function(){
		nextPage(themeName);
	});
	$('#firstPageBtn').click(function(){
		firstPage(themeName);
	});
	$('#lastPageBtn').click(function(){
		lastPage(themeName);
	});
	$('.index_item').click(function(){
		var index = Number($(this).html()) - 1;
		getBarMsg(themeName,index);
	});
}
function getRecommand(themeName){
	$.ajax({
		url: domain + "/pro/php/getRecommendBar.php",
		type: 'get',
		async: true,
		data: {
			sortName: themeName
		},
		success: function(result){
			var data = JSON.parse(result);
			for(var i=0;i<data.length;i++){
				var $div = $('<div></div>');
				$div.addClass('bar');
				$div.attr('barId',data[i].id);
				$div.attr('barName',data[i].barName);
				$div.html(data[i].barName+'吧');
				$div.click(function(){
					window.location.href = 'http://localhost/pro/page/bar.html?'+'barName='+$(this).attr('barName');
				});
				$('#hotBar').append($div);
			}
		}
	});
}

function initIndex(){
	var maxShowIndex = 10;
	var currIndex = Number($('#bars').attr('index'));
	var totalNum = Number($('#bars').attr('totalpagenum'));
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

function getBarMsg(themeName,indexNum){
	$.ajax({
		url: domain + "/pro/php/getThemeBar.php",
		type: 'get',
		async: true,
		data: {
			themeName: themeName,
			indexNum: indexNum
		},
		success: function(result){
			var data = JSON.parse(result);
			console.log(data);
			if(data.value.length != 0){
				freshBarItems(data, indexNum);
			}else{
				//没有获得数据
				$('#notHaveBarTip').css('display','block');
				$('.index').css('display','none');
			}
		}
	});
}

function freshBarItems(data, indexNum){
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true: false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if(pageNum == 0){
		pageNum = 1;
	}
	$('#bars').find('.bar_intro').remove();
	$('#bars').attr('index', indexNum);
	$('#bars').attr('totalpagenum', --pageNum);
	for(var i=0;i<data.value.length;i++){
		var $item = createBarItem(data.value[i]);
		$('#bars').find('.index').before($item);
	}
	initIndex();
	//使左边部分和右边部分高度一样
	$('.left').css('height',$('.right').height()+20);
}

function prevPage(themeName){
	var currIndex = Number($('#bars').attr('index'));
	if(currIndex > 0){
		getBarMsg(themeName, --currIndex);
	}
}

function nextPage(themeName){
	var currIndex = Number($('#bars').attr('index'));
	var totalNum = Number($('#bars').attr('totalpagenum'));
	console.log(currIndex, totalNum);
	if(currIndex < totalNum){
		console.log(currIndex);
		getBarMsg(themeName, ++currIndex);
	}
}

function firstPage(themeName){
	var currIndex = Number($('#bars').attr('index'));
	if(currIndex != 0){
		getBarMsg(themeName, 0);
	}
}

function lastPage(themeName){
	var currIndex = Number($('#bars').attr('index'));
	var totalNum = Number($('#bars').attr('totalpagenum'));
	if(currIndex != totalNum){
		getBarMsg(themeName, totalNum);
	}
}

//创建bar元素(组件)
function createBarItem(data){
	var $barIntroDiv = $('<div></div>');
	$barIntroDiv.addClass('bar_intro');
	$barIntroDiv.attr('barId',data.id);
	$barIntroDiv.attr('barName',data.barName);
	var $barImg = $('<img />');
	$barImg.attr('src',data.barImg);
	var $barContentDiv = $('<div></div>');
	$barContentDiv.addClass('bar_content');
	var $barTitleDiv = $('<div></div>');
	$barTitleDiv.addClass('bar_title');
	$barTitleDiv.html(data.barName+'吧');
	var $lineDiv = $('<div></div>');
	$lineDiv.addClass('line');
	var $postStatusDiv = $('<div></div>');
	$postStatusDiv.addClass('post_status');
	var $concernNumDiv = $('<div></div>');
	$concernNumDiv.addClass('post_status_item');
	$concernNumDiv.html('人数:'+data.attentionNum);
	var $postNumDiv = $('<div></div>');
	$postNumDiv.addClass('post_status_item');
	$postNumDiv.html('帖子:'+data.postNum);
	var $introDiv = $('<div></div>');
	$introDiv.addClass('intro');
	$introDiv.html(data.barDescript);
	$barIntroDiv.append($barImg);
	$barIntroDiv.append($barContentDiv);
	$barContentDiv.append($barTitleDiv);
	$barContentDiv.append($lineDiv);
	$barContentDiv.append($postStatusDiv);
	$barContentDiv.append($introDiv);
	$postStatusDiv.append($concernNumDiv);
	$postStatusDiv.append($postNumDiv);
	$barIntroDiv.click(function(){
		window.location.href = 'http://localhost/pro/page/bar.html?'+'barName='+$(this).attr('barName');
	});
	return $barIntroDiv;
}


