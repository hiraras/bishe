
(function(){
	var user = sessionStorage.getItem("user");
	var themeContentTop = 0;
	if(user == null || user == undefined || user == ""){
		//未登录
		$("#userMsg").css("display","none");
		themeContentTop = 0;
	}else{
		themeContentTop = 210;
	}
	var bannerLeft = 0;
	var bannerImgNum = 3;
	var containerWidth = 1100;
	//banner当前位置
	var pointIndex = 0;
	//去掉common.js内绑定的事件，因为index页面在page外面
	$("#headerLogin").off('click');
	$("#headerRegister").off('click');
	$("#toIndex").off('click');
	$("#myMsg").off('click');
	$("#myRoom").off('click');
	
	$("#myMsg").on("click",function(){
		window.location.href = "";
	});
	$("#myRoom").on("click",function(){
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
		$('#bannerWrapper').css('left',-pointIndex*containerWidth+'px');
	},4000)
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
	$('#themeContainer').on('mouseleave',function(){
		$(this).css('display','none');
	}).on('mouseenter',function(){
		$(this).css('display','block');
	});
	$('#themes .theme').each(function(index,ele){
		$(this).on('mouseover',function(){
			$('#themeContainer').css({display:'block',top: (themeContentTop + index * 50)});
		}).on('mouseout',function(){
			$('#themeContainer').css({display:'none'});
		});
	});
}());


















