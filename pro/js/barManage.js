var domain = 'http://localhost';
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
    checkMaster(barName);
}());

function checkMaster(barName){
    $.ajax({
        type: 'get',
        url: domain + '/pro/php/getBarMsgByIdAndBarName.php',
        async: true,
        data: {
            barName: barName,
            barId: ''
        },
        success: function (result) {
            try {
                var data = JSON.parse(result);
            } catch (e) {
                console.log(e);
            }
            if (data.result == 'none') {
                alert('该吧不存在');
                window.location.href = 'http://localhost/pro/index.html';
            } else {
                if(data.data.master != localStorage.getItem('user')){
                    window.location.href = 'http://localhost/pro/index.html';
                    return ;
                }else{
                    init(data.data);
                }
            }
        }
    });
}
function init(data){
    console.log(data);
    var $image = $('#image');
    $('#barName').html(data.barName + '吧');
	$('#barName').attr('barname',data.barName);
    $('#barName').attr('barId',data.id);
    $('#barName').attr('master',data.master);
	$('#concernNum').html('人数:'+data.concernNum);
	$('#barIntroduce').html(data.barDescript);
	$('#postNum').html('帖子:'+data.postNum);
    $('#barImg').attr('src',data.barImg);
    
    $('#btnEditorBarMsg').click(function(){
        $('.mask_editor_bar_msg').css('display','inline-block');
    });
    $('#editorBarImg').attr('src',data.barImg).click(function(){
		$('#cropperMask').css('display','block');
		initCropper();
	});
	$('#cancelSelectBtn').click(function(){
		$('#cropperMask').css('display',"none");
		$image.cropper('destroy');
	});
	$('#selectImgBtn').click(function(){
		$('#inputImage').click();
	});
	$('#cancelEditorBtn').click(function(){
		$('.mask_editor_bar_msg').css('display','none');
	});
	$('#submitEditorBtn').click(function(){
		var barId = $('#barName').attr('barId');
		var content = $('#inputBarDescript').val();
		if(content.trim() != ''){
			$.ajax({
				type: 'post',
				url: domain + '/pro/php/changeBarDescript.php',
				async: true,
				data: {
					barId: barId,
					content: content
				},
				success: function(result){
					console.log(result);
					if(result == 'success'){
						$('.bar_editor_submit_tip').html('提交成功');
						setTimeout(function(){
							window.location.reload();
						},300);
					}else{
						alert('发生未知错误,数据提交失败');
						window.location.reload();
					}
				}
			});
		}
    });
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

function switchContent(num) {
	var item;
	$('#msgContent').children().remove();
	$('#msgContent').attr('type', num);
	$('#msgContent').attr('index', 0);
	$('#msgContent').attr('totalPageNum', 0);
	switch (num) {
		case 0:
			item = getPageItem();
			break;
		default:
			break;
	}
    $('#msgContent').append(item);
    initIndexBtnPressEvent();
}
//分页区域
function getPageItem() {
	var container = $('<div></div>');
	var indexComponent = createIndex();
	container.append(indexComponent);
	getData(0);
	return container;
}

function getData(currIndex) {
	var type = $('#msgContent').attr('type');
	type = Number(type);
	var fileName;
	var requsetData = {};
	requsetData.indexNum = currIndex;
	switch (type) {
		case 0:
			//举报信息
			fileName = 'getMyBarReport';
			requsetData.barName = $('#barName').attr('barName');
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
    console.log(data);
	var item;
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true : false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if (pageNum == 0) {
		pageNum = 1;
	}
	$('#msgContent .index').siblings().remove();
	$('#msgContent').attr('index', currIndex);
	$('#msgContent').attr('totalpagenum', --pageNum);
	var type = $('#msgContent').attr('type');
	type = Number(type);
	switch (type) {
		case 0:
			//举报
			var item = createReport(data);
			break;
        default:
            break;
	}
	$('#msgContent').find('.index').before(item);
	initIndex();
}

function initIndex() {
	var maxShowIndex = 10;
	var currIndex = Number($('#msgContent').attr('index'));
	var totalNum = Number($('#msgContent').attr('totalpagenum'));
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

function createReport(data){
    var container = $('<div></div>');
	container.addClass('my_reports');
	for (var k = 0; k < data.value.length; k++) {
		var item = createReportItem(data.value[k]);
		container.append(item);
	}
	return container;
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
	var currIndex = Number($('#msgContent').attr('index'));
	if (currIndex > 0) {
		getData(--currIndex);
	}
}

function nextPage() {
	var currIndex = Number($('#msgContent').attr('index'));
	var totalNum = Number($('#msgContent').attr('totalPageNum'));
	if (currIndex < totalNum) {
		getData(++currIndex);
	}
}

function firstPage() {
	var currIndex = Number($('#msgContent').attr('index'));
	if (currIndex != 0) {
		getData(0);
	}
}

function lastPage() {
	var currIndex = Number($('#msgContent').attr('index'));
	var totalNum = Number($('#msgContent').attr('totalPageNum'));
	if (currIndex != totalNum) {
		getData(totalNum);
	}
}

function createReportItem(data){
    var reportTimeStr = '';	
    var master = $('#barName').attr('master');
    var container = $('<div></div>');
	container.addClass('report');
	container.attr('reportId',data.id);
	var reporter = $('<p></p>');
	reporter.addClass('reporter');
	reporter.html(data.reporterNickname+'在帖子:'+data.postTitle+',楼层:'+data.position+',举报了'+data.reportederNickname+':');
	var reportContent = $('<p></p>');
	reportContent.addClass('report_content');
	reportContent.html(data.content);
	var reportWrapper = $('<div></div>');
	reportWrapper.addClass('report_wrapper');
	var reportTime = $('<span></span>');
	reportTime.addClass('report_time');
	if(isToday(data.reportTime)){
		reportTimeStr = data.reportTime.substr(11);
	}else{
		reportTimeStr = data.reportTime.substr(0,10);
	}
	reportTime.html(reportTimeStr);
	reportWrapper.append(reportTime);
	if(data.status == 1){
		var reportBtn = $('<button></button>');
		reportBtn.addClass('report_btn');
		reportBtn.html('确定');
		reportBtn.click(function(){
			var optionResult = confirm('确认设置为已读？');
			if(optionResult){
				changeReportStatus.call(this, data.id, master);
			}
		});
		reportWrapper.append(reportBtn);
	}else{
        var haveReadTip = $('<span></span>');
        haveReadTip.addClass('optioner');
        if(data.optioner == '0'){
            haveReadTip.html('管理员已处理');
        }else{
            haveReadTip.html('已读');
        }
		reportWrapper.append(haveReadTip);
	}

	container.append(reporter);
	container.append(reportContent);
	container.append(reportWrapper);
	return container;
}

function changeReportStatus(id, master) {
    id = Number(id);
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changeReportStatus.php',
        async: true,
        data: {
            id: id,
            optioner: master
        },
        success: function (result) {
            console.log(result);
            if (result == 'success') {
                alert('完成');
                window.location.reload();
            } else {
                console.log(result);
                alert('未知错误');
                window.location.reload();
            }
        }
    });
}

function initCropper(){
	'use strict';
	var console = window.console || { log: function () {} };
	var URL = window.URL || window.webkitURL;
	var imgContainer = $('#imgContainer');
	// Import image
	var $inputImage = $('#inputImage');
	var $image = $('#image');
	$image.attr('src',$('#barImg').attr('src'));
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
	  $inputImage.change(function (){
		var imgContainer = $('#imgContainer');
		var files = this.files, file;
		if(!$image.data('cropper')){
		  return;
		}
		if(files && files.length){
		  file = files[0];
		  if(/^image\/\w+$/.test(file.type)){
			uploadedImageType = file.type;
			if (uploadedImageURL){
			  URL.revokeObjectURL(uploadedImageURL);
			}
			uploadedImageURL = URL.createObjectURL(file);
			imgContainer.height(400);
			imgContainer.width(400);
			var tempImg = $image.cropper('destroy').attr('src', uploadedImageURL).on('load',function(){
				imgContainer.width($(this).width());
				imgContainer.height($(this).height());
				tempImg.cropper(options);
			});
			$inputImage.val('');
		  }else{
			window.alert('Please choose an image file.');
		  }
		}
	  });
	}else{
	  $inputImage.prop('disabled', true).parent().addClass('disabled');
	}
	initBtnEvent();
}
function initBtnEvent(){
	$('#btnGetCropper').click(function(){
		var barId = $('#barName').attr('barId');
		var $download = $('#download');
		var uploadedImageType = 'image/jpeg';
		var $image = $('#image');
		var $this = $(this);
		var data = $this.data();
		var cropper = $image.data('cropper');
		var cropped;
		var result;
		if(cropper && data.method){
		data = $.extend({}, data); // Clone a new one
		cropped = cropper.cropped;
		if(uploadedImageType === 'image/jpeg'){
			if (!data.option) {
			data.option = {};
			}
			data.option.fillColor = '#fff';
		}
		result = $image.cropper(data.method, data.option, data.secondOption);
		var imgURL = result.toDataURL();
		$.ajax({
			type: 'post',
			url: domain + '/pro/php/saveBarHeadImg.php',
			async: true,
			data: {
				fileData: imgURL,
				barId: barId
			},
			success: function(result){
				try{
					var data = JSON.parse(result);
				}catch(e){
					console.log(e);
				}
				if(data.result == 'success'){
					window.location.reload();
				}else{
					alert('未知错误');
				}
			}
		});
	}
  });
}









