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
	var user = sessionStorage.getItem("user");
	if(user == null || user == undefined || user == ""){
		//未登录
		$("#haveLogin").css("display","none");
		$("#notLogin").css("display","block");
	}else{
		//已登录
		$("#haveLogin").css("display","block");
		$("#notLogin").css("display","none");
	}
};
function init(){
	isLogin();
}
init();

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
	window.location.href = "login.html";
});
$("#headerRegister").on("click",function(){
	window.location.href = "register.html";
});
$("#toIndex").on("click",function(){
	window.location.href = "../index.html";
});
$("#myMsg").on("click",function(){
	window.location.href = "";
});
$("#myRoom").on("click",function(){
	window.location.href = "";
});

$('.btn_search').click(function(){
	var value = $('#search').val();
	if(value != ''){
		searchBar(value);
	}else{
		window.location.href = 'http://localhost/pro/index.html';
	}
});

function searchBar(value){
	window.location.href = 'http://localhost/pro/page/bar.html?'+'barName='+value;
}
