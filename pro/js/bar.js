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
	$('#search').val(barName+'吧');
	getBarMsg(barName);
	getPostsMsg(barName);
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





