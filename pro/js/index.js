var domain = "http://localhost";
(function(){
	var user = localStorage.getItem("user");
	if(user == null || user == undefined || user == ""){
		//未登录
		$("#userMsg").css("display","none");
	}else{
		getUserMsg();
	}
	var bannerLeft = 0;
	var bannerImgNum = $('#bannerWrapper').children('img').length;
	var containerWidth = $('#bannerWrapper img').first().width();
	//banner当前位置
	var pointIndex = 0;
	//获得所有分类，并添加到网页
	getSort();
	//鼠标移到分类上显示一些推荐吧
	showThemeBar();
	//获得右边部分的人气高的吧
	getHotBar();
	//设置点击左边的主题分类跳转到theme页面
	toThemes();
	//去掉common.js内绑定的事件，因为index页面在page外面
	$("#headerLogin").off('click');
	$("#headerRegister").off('click');
	$("#toIndex").off('click');
	$("#myMsg").off('click');
	
	$("#myMsg").on("click",function(){
		window.location.href = "";
	});
	$("#headerLogin").on("click",function(){
		window.location.href = "./page/login.html";
	});
	$("#headerRegister").on("click",function(){
		window.location.href = "./page/register.html";
	});
	var bannerTimer = setInterval(function(){
		$('#bannerPoint li').each(function(index,ele){
			$(this).removeClass('to_blue');
		});
		if(pointIndex == (bannerImgNum - 1)){
			pointIndex = 0;
		}else{
			pointIndex ++;
		}
		$('#bannerPoint li').eq(pointIndex).addClass('to_blue');
		$('#bannerWrapper').animate({left: -containerWidth+'px'},1000,function(){
			$(this).css('left', '0px');
			$('#bannerWrapper img').first().insertAfter($('#bannerWrapper img').last());
		});
	},4000);
	$('#bannerPoint li').each(function(index){
		$(this).on('click',function(){
			$('#bannerPoint li').each(function(index,ele){
				$(this).removeClass('to_blue');
			});
			pointIndex = index;
			$('#bannerPoint li').eq(pointIndex).addClass('to_blue');
			$('#bannerWrapper').css('left',-pointIndex*containerWidth+'px');
		})
	});
	
}());

function getSort(){
	$.ajax({
		type:"get",
		url: domain + "/pro/php/indexGetSort.php",
		async: false,
		success: function(result){
			var data = JSON.parse(result);
			for(var i=0;i<data.length;i++){
				var $div = $('<div></div>');
				$div.addClass('theme');
				$div.html(data[i].sortName);
				$div.attr("theme_id",data[i].id);
				$('#themes').append($div);
			}
		}
	});
}

function showThemeBar(){
	var themeContentTop = 0;
	if(localStorage.getItem('user')){
		themeContentTop = 211;
	}
	$('#themeContainer').on('mouseleave',function(){
		$(this).css('display','none');
	}).on('mouseenter',function(){
		$(this).css('display','block');
	});
	$('#themes .theme').each(function(index,ele){
		$(this).on('mouseover',function(){
			$('#themeContainer').css({display:'block',top: (themeContentTop + index * 50)});
			$('#themeContainer .theme_content').remove();
			recommendBar($(this).html());
			$('#sortTitle').html($(this).html());
		}).on('mouseout',function(){
			$('#themeContainer').css({display:'none'});
		});
	});
}

function recommendBar(sortName){
	$.ajax({
		type:"get",
		url: domain + "/pro/php/getRecommendBar.php",
		async: true,
		data: {
			sortName: sortName
		},
		success: function(result){
			var data = JSON.parse(result);
			for(var i=0;i<data.length;i++){
				var $div = $('<div></div>');
				$div.addClass('theme_content');
				$div.attr('barId',data[i].id);
				$div.html(data[i].barName);
				$div.click(function(){
					window.location.href = 'http://localhost/pro/page/bar.html?'+'barName='+$(this).html();
				});
				$('#themeContainer').append($div);
			}
		}
	});
}

function getUserMsg(){
	var userId = localStorage.getItem('user');
	$.ajax({
		url: domain + "/pro/php/getUserMsg.php",
		type: 'get',
		async: true,
		data: {
			username: userId
		},
		success: function(result){
			try{
				var data = JSON.parse(result);
			}catch(e){
				console.log(e);
			}
			if(data.result == 'success'){
				var imgSrc = data.data.headImg.substr(1);
				$('#headImg').attr('src',imgSrc);
				$('#headerImg').attr('src',imgSrc);
				$('#userName').html(data.data.nickname);
			}else{
				alert('用户不存在');
			}
		}
	});
}

function getHotBar(){
	$.ajax({
		url: domain + "/pro/php/indexGetHotBar.php",
		type: 'get',
		async: true,
		success: function(result){
			var data = JSON.parse(result);
			console.log(data);
			for(var i=0;i<data.length;i++){
				if(i % 3 == 0){
					var $rowBarDiv = $('<div></div>');
					$rowBarDiv.addClass('row_bar');
					$('#rightContainer').append($rowBarDiv);
				}
				var $barDiv = $('<div></div>');
				$barDiv.addClass('bar');
				$barDiv.attr('barName',data[i].barName);
				$barDiv.attr('barId',data[i].id);
				var $barTitleDiv = $('<div></div>');
				$barTitleDiv.addClass('bar_title');
				var $barImg = $('<img />');
				var barImgSrc = data[i].barImg.substr(1);
				$barImg.attr('src',barImgSrc)
				var $p1 = $('<p></p>');
				$p1.html(data[i].barName+'吧');
				var $p2 = $('<p></p>');
				$p2.addClass('bar_hot');
				var $span1 = $('<span></span>');
				$span1.html('关注数:'+data[i].attentionNum);
				var $span2 = $('<span></span>');
				$span2.html('帖子数:'+data[i].postNum);
				var $br = $('<br />');
				var $clearFloatDiv = $('<div></div>');
				$clearFloatDiv.addClass('clear_float');
				var $barDescriptDiv = $('<div></div>');
				$barDescriptDiv.addClass('bar_descript');
				$barDescriptDiv.html(data[i].barDescript);
				$barDiv.append($barTitleDiv);
				$barTitleDiv.append($barImg);
				$barTitleDiv.append($p1);
				$barTitleDiv.append($p2);
				$p2.append($span1);
				$p2.append($br);
				$p2.append($span2);
				$barDiv.append($clearFloatDiv);
				$barDiv.append($barDescriptDiv);
				$rowBarDiv.append($barDiv);
			}
			//使left和right相同高度，加20是加上right最下面的padding-bottom的高度20px
			if($('#leftContainer').height() > $('#rightContainer').height()+20){
				$('#rightContainer').css('height',$('#leftContainer').height()-20);
			}else{
				$('#leftContainer').css('height',$('#rightContainer').height()+20);
			}
			
			//点击吧时跳转到对应吧
			addRightBarJump();
		}	
	});
}

function addRightBarJump(){
	$('.bar').click(function(){
		window.location.href = 'http://localhost/pro/page/bar.html?'+'barName='+$(this).attr('barName');
	});
}

function toThemes(){
	$('.theme').click(function(){
		var themeName = $(this).html();
		window.location.href = 'http://localhost/pro/page/themes.html?' + 'themeName=' + themeName;
	});
}





