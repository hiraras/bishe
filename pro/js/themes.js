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
	initPagingIndexClick();
	getRecommand(themeName);
	getBarMsg(themeName);
}());
function initPagingIndexClick(){
	$('#prevBtn').click(function(){
		prevPage();
	});
	$('#nextBtn').click(function(){
		nextPage();
	});
	$('.index_item').click(function(){
		dataPaging.index = Number($(this).html()) - 1;
		dataPaging.addChild($('#bars'));
		initIndex();
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

function getBarMsg(themeName){
	$.ajax({
		url: domain + "/pro/php/getThemeBar.php",
		type: 'get',
		async: true,
		data: {
			sortName: themeName
		},
		success: function(result){
			var data = JSON.parse(result);
			if(data.length != 0){
				dataPaging.data = data;
				//一页我想给他显示的数量
				dataPaging.msgNum = 14;
				dataPaging.createChild = function(data){
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
					$concernNumDiv.html('人数:'+data.concernNum);
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
				dataPaging.addChild($('#bars'));
				if(data.length <= dataPaging.msgNum){
					$('.index').css('display','none');
				}else{
					initIndex(data);
				}
				$('.left').css('height',$('.right').height()+20);
			}
		}
	});
}

function initIndex(data){
	//页码最多的数量
	var indexNum = 10;
	var halfIndexNum = Math.floor(indexNum / 2) + 1;
	if(dataPaging.index == 0){
		$('#prevBtn').css('display','none');
	}else{
		$('#prevBtn').css('display','inline-block');
	}
	if(dataPaging.index == dataPaging.totalPageNum){
		$('#nextBtn').css('display','none');
	}else{
		$('#nextBtn').css('display','inline-block');
	}
	$('.index_item').removeClass('currIndex');
	
	if(dataPaging.totalPageNum < indexNum){
		$('.index_item').each(function(index){
			if(index > dataPaging.totalPageNum){
				$(this).css('display','none');
			}
			if(index == dataPaging.index){
				$(this).addClass('currIndex');
			}
		});
	}else{
		if(dataPaging.index < halfIndexNum){
			$('.index_item').each(function(index){
				$(this).html(index + 1);
			});
		}else if(dataPaging.index > dataPaging.totalPageNum - halfIndexNum){
			$('.index_item').each(function(index){
				$(this).html(dataPaging.totalPageNum + 1 - (indexNum - 1 - index));
			});
		}else{
			$('.index_item').each(function(index){
				$(this).html(dataPaging.index + 1 - (halfIndexNum - index));
			});
		}
		$('.index_item').each(function(index){
			if($(this).html() == dataPaging.index + 1){
				$(this).addClass('currIndex');
			}
		});
	}
	$('.left').css('height',$('.right').height()+20);
}
//分页中点击上一页执行的函数
function prevPage(){
	if(dataPaging.index != 0){
		dataPaging.index --;
		dataPaging.addChild($('#bars'));
		initIndex();
	}
}
//分页中点击下一页执行的函数
function nextPage(){
	if(dataPaging.index != dataPaging.totalPageNum){
		dataPaging.index ++;
		dataPaging.addChild($('#bars'));
		initIndex();
	}
}
