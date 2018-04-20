//返回包括min和max的一个数
function getRandom(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}
//存储分页公共函数的对象(已废弃留作一种思路备份)
var dataPaging = {
	//数据、默认一页item数,页码数
	data: [],
	msgNum: 10,
	index: 0,
	totalPageNum: 0,
	//页码最多的数量
	indexNum: 10,
	//添加子元素,ele为需要添加子元素的父元素
	addChild: function(ele){
		var n;
		this.removeChild(ele);
		//是否有不完整的页面
		if(this.data.length % this.msgNum != 0){
			if(this.index == Math.floor(this.data.length / this.msgNum)){
				n = this.data.length % this.msgNum;
			}else{
				n = this.msgNum;
			}
			this.totalPageNum = Math.floor(this.data.length / this.msgNum);
		}else{
			n = this.msgNum;
			this.totalPageNum = this.data.length / this.msgNum;
		}
		for(var i=0;i<n;i++){
			var arrData = this.data.slice(this.index*this.msgNum+i,this.index*this.msgNum+i+1);
			$(ele).append(this.createChild(arrData[0]));
		}
	},
	//页码改变时刷新页面数据
	freshMsg: function(ele){
		//当前页面第一条数据的索引
		var n = msgNum * index;
		$(ele).children().each(function(index,ele){
			$(this).html(arr[n+index]);
		})
	},
	//页码改变时删除原有子元素
	removeChild: function(ele){
		$(ele).children().remove();
	},
	//创建子item，需要重新赋值，因为每个页面的item代码生成方式不同
	createChild: function(){
//		var $div = $("<div></div>");
//		$div.addClass("msg_child");
//		return $div;
	},
};
//判断是否登录
function isLogin(){
	var user = localStorage.getItem("user");
	if(user == null || user == undefined || user == ""){
		//未登录
		$("#haveLogin").css("display","none");
		$("#notLogin").css("display","block");
		return false;
	}else{
		//已登录
		$("#haveLogin").css("display","block");
		$("#notLogin").css("display","none");
		return true;
	}
};
function init(){
	var result = isLogin();
	if(result){
		getHeadImg();
	}
}
init();
//获得用户头像并保存和显示到header中，因为一次回复回复没读到nickname就在这里增加设置一个nickname，以防万一
function getHeadImg(){
	var user = localStorage.getItem("user");
	var domain = 'http://localhost';
	$.ajax({
		url: domain + "/pro/php/getHeadImg.php",
		type: 'get',
		async: true,
		data: {
			user: user
		},
		success: function(result){
			try{
				var data = JSON.parse(result);
				if(window.location.pathname.indexOf('index.html') == -1){
					$('#headerImg').attr('src',data.headImg);
				}
				localStorage.setItem('headImg',data.headImg);
				localStorage.setItem('userNickName',data.nickname);
			}catch(e){
				console.log(e)
			}
		},
		error: function(e){
			console.log(e);
		}
	});
}

function bindEvent(){
	$("#login").on("click",function(){
		window.location.href = "login.html";
	});
	$("#regiser").on("click",function(){
		window.location.href = "register.html";
	});
}
//验证码创建
function createCheckCode(){
	var codeArr = ["1","2","3","4","5","6","7","8","9","0",
	"a","b","c","d","e","f","g","h","i","j","k","l","m","n",
	"o","p","q","r","s","t","u","v","w","x","y","z",
	"A","B","C","D","E","F","G","H","I","J","K","L","M","N",
	"O","P","Q","R","S","T","U","V","W","X","Y","Z"
	];
	//验证码字符串长度
	var len = 4;
	//验证码字符串
	var str = "";
	var myCanvas = document.getElementById("checkCodeImg");
//	myCanvas.style.background = getRandomColor();
	var ctx = myCanvas.getContext("2d");
	ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
	for(var i=0;i<len;i++){
		//获得随机字符
		var ch = codeArr[getRandom(0,codeArr.length - 1)];
		//字体大小
		var fontSize = getRandom(16,28);
		//字符间隔
		var charSpace = getRandom(15,18);
		//y轴距离
		var yDistance = getRandom(15,25);
		//倾斜角度
		var angle = getRandom(-30,30);
		var lineStartPoint = {
			x: getRandom(0,80),
			y: getRandom(0,35)
		};
		var lineEndPoint = {
			x: getRandom(0,80),
			y: getRandom(0,35)
		};
		str += ch;
		ctx.font="bold "+fontSize+"px Arial";
		ctx.fillStyle = getRandomColor();
		ctx.textAlign = "center";
//		ctx.fillText(ch,charSpace*i+15,yDistance);
		ctx.translate(charSpace*i+15,yDistance);
		ctx.rotate(Math.PI / 180 * angle);
		ctx.fillText(ch,0,0);
		ctx.rotate(-Math.PI / 180 * angle);
		ctx.translate(-charSpace*i-15,-yDistance);
		if((i+1)%3 == 0){//画干扰线
			//canvas会记录moveTo()和lineTo()的点，就算清除了画布内容，再次绘制也会画出所有曾经绘制过的线
			//使用beginPath()和closePath()可以防止
			ctx.beginPath();
			ctx.strokeStyle = getRandomColor();
			ctx.lineWidth = 1;
			ctx.moveTo(getRandom(0,80),getRandom(0,35));
			ctx.lineTo(getRandom(0,80),getRandom(0,35));
			ctx.stroke();
			ctx.closePath();
		}
	}
	return str.toLowerCase();
}

//获得随机颜色字符串
function getRandomColor(){
	var colorStr = "#";
	for(var i=0;i<3;i++){
		var n = getRandom(0,255);
		var ch = n < 16 ? "0"+n.toString(16):n.toString(16);
		colorStr += ch;
	}
	return colorStr;
}

$("#headerLogin").on("click",function(){
	window.location.href = "http://localhost/pro/page/login.html";
});
$("#headerRegister").on("click",function(){
	window.location.href = "http://localhost/pro/page/register.html";
});
$(".toIndex").on("click",function(){
	window.location.href = "http://localhost/pro/index.html";
});
$("#myMsg").css('display','none');

$('.btn_search').click(function(){
	var value = $('#search').val();
	if(value.trim() != ''){
		searchBar(value);
	}else{
		window.location.href = 'http://localhost/pro/index.html';
	}
});

function searchBar(value){
	var searchType = Number($('#searchMethodContainer').attr('searchType'));
	if(searchType == 0){
		window.location.href = 'http://localhost/pro/page/bar.html?'+'barName='+value;
	}else{
		window.location.href = 'http://localhost/pro/page/searchPost.html?'+'postTitle='+value;
	}
}

$("#searchMethodContainer").on("click",function(){
	$(this).children().removeClass('unselect_btn');
	if($(this).attr('searchType') == '0'){
		$('#searchMethodBar').addClass('unselect_btn');
		$(this).attr('searchType','1');
	}else{
		$('#searchMethodPost').addClass('unselect_btn');
		$(this).attr('searchType','0');
	}
});

$("#search").on("keydown",function(e){
	e = e || event;
	var keyCode = e.keyCode || e.which || e.charCode;
	if(keyCode == 13){
		var value = $('#search').val();
		if(value.trim() != ''){
			searchBar(value);
		}else{
			window.location.href = 'http://localhost/pro/index.html';
		}
	}
});
$('#headerImgArea').on('mouseenter',function(){
	$('#headerImgMenu').css('display','block');
}).on('mouseleave',function(){
	$('#headerImgMenu').css('display','none');
});
$('#exitLogin').click(function(){
	localStorage.removeItem("user");
	localStorage.removeItem("userLevel");
	localStorage.removeItem("userNickName");
	localStorage.removeItem("headImg");
	if(window.location.href.indexOf('personal_space') != -1){
		window.location.href = 'http://localhost/pro/index.html';
	}else{
		window.location.reload();
	}
});
$('#changePassWord').click(function(){
	window.location.href = 'http://localhost/pro/page/changePassWord.html';
});


//判断所日期是否为今天
function isToday(time){
	var createDate = new Date(time);
	var createDateDayStart = new Date(createDate.getFullYear()+'-'+(createDate.getMonth()+1)+'-'+createDate.getDate());
	var today = new Date();
	var todayDayStart = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
	if(createDateDayStart.getTime() == todayDayStart.getTime()){
		return true;
	}else{
		return false;
	}
}

$('#headerImg').click(function(){
	var username = localStorage.getItem('user');
	window.location.href = 'http://localhost/pro/page/personal_space.html?userId='+username;
});
$('#myRoom').click(function(){
	var username = localStorage.getItem('user');
	window.location.href = 'http://localhost/pro/page/personal_space.html?userId='+username;
});
//将时间转化为具体年数，包括小数点
function barAge(timeStr){
	var createTime = new Date(timeStr);
	var now = new Date();
	var ageMills = now.getTime() - createTime.getTime();
	var age = new Date(ageMills);
	var monthArr = [31,29,31,30,31,30,31,31,30,31,30,31];
	var yearTotalDay = 365;
	var beforeMonthDay = 0;
	if(isLeapYear()){
	  monthArr[1] = 29;
	  yearTotalDay = 366;
	}else{
	  monthArr[1] = 28;
	}
	for(var i=0;i<age.getMonth();i++){
	  beforeMonthDay += monthArr[i];
	}
	beforeMonthDay += age.getDate();
	return ''+Math.floor((age.getFullYear() - 1970+beforeMonthDay/yearTotalDay)*100)/100;
  }
  
  function isLeapYear(){
	var date = new Date();
	var year = date.getFullYear;
	if(year % 100 == 0){
	  if(year % 400 == 0){
		return true;
	  }else{
		return false;
	  }
	}else{
	  if(year % 4 == 0){
		return true;
	  }else{
		return false;
	  }
	}
  }
//加经验接口,有限制每日获得数
function addExp(userId, expNum, callback){
	$.ajax({
		url: domain + "/pro/php/addExp.php",
		type: 'post',
		async: true,
		data: {
			userId: userId,
			expNum: expNum
		},
		success: function(result){
			if(result == 'success'){
				if(!!callback){
					callback('success');
				}
			}else if(result == 'isOver'){
				if(!!callback){
					callback('isOver');
				}
			}else{
				console.log(result);
				alert('未知错误');
			}
		}
	});
}
//加经验接口,不限制每日获得数
function addExpNoLimit(userId, expNum, callback){
	$.ajax({
		url: domain + "/pro/php/addExpNoLimit.php",
		type: 'post',
		async: true,
		data: {
			userId: userId,
			expNum: expNum
		},
		success: function(result){
			if(result == 'success'){
				if(!!callback){
					callback(true);
				}
			}else{
				if(!!callback){
					callback(false);
				}
				console.log(result);
				alert('未知错误');
			}
		}
	});
}
//将经验转化成等级
function getLv(expNum){
	var LvArr = getLvArr(15, 0.05, 20);
	var userLv = 1;
	expNum = Number(expNum);
	for(var i=0;i<LvArr.length;i++){
		if(expNum > LvArr[i]){
			userLv ++;
		}else{
			break;
		}
	}
	return userLv;
}
//生成等级所需经验数组,第一个参数为起始等级的经验,第二个为增长率,第三个为最高等级
function getLvArr(firstNum, speed, maxLv){
	var arr = [];
	var num = firstNum;
	arr.push(num);
	for(var i=1;i<maxLv;i++){
		num = Math.round(num*(2 - i * 0.03)) + Math.round(num*speed);
		arr.push(num);
	}
	return arr;
}