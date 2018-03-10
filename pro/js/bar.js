var domain = 'http://localhost';
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
	initSendAreaBtnsPressEvent();
}());

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
			$('#barName').html(data[0].barName + '吧');
			$('#concernNum').html('人数:'+data[0].concernNum);
			$('#barIntroduce').html(data[0].barDescript);
		}
	});
}

function getPostsMsg(){
		
}

function initSendAreaBtnsPressEvent(){
	$('.face').click(function(){
		var $img = $(this).clone();
		$img.removeAttr('class');
		$('#editorArea').append($img);
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
}



