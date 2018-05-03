var randomNum = -getRandom(100000,999999);
// var randomNum = 1111;
//验证码有效时间(倒计时时间)
var timeNum = 60;
var domain = "http://localhost";
var phoneMsgSendNum = 0;
var sendPhoneMsg = function(){
	var username = $("#username").val();
	randomNum = getRandom(1000,9999);
	$.ajax({
		type: "post",
		data: {
			username: username,
			checkCode: randomNum
		},
		async: true,
		dataType: "text",
		url:  domain + "/pro/php/phpApiDemo/apiDemo/industrySMS.php",
		success: function(result){
			$("#checkCode").off("click");
			var timer = setInterval(function(){
				timeNum --;
				if(timeNum <= 0){
					randomNum = -getRandom(100000,999999);
					timeNum = 60;
					clearInterval(timer);
					$("#checkCode").on("click",sendPhoneMsg);
					$("#checkCode").css("background","#0377f9");
					$("#checkCode").css("color","#FFFFFF");
					$("#checkCode").html("发送验证码");
				}else{
					$("#checkCode").css("background","#afafaf");
					$("#checkCode").css("color","#000000");
					$("#checkCode").html("剩余("+timeNum+"s)");
				}
			},1000);
		},
		error: function(e){
			var start = e.responseText.indexOf("respDesc");
			var str = e.responseText.substr(start);
			console.log(str);
		}
	});
}

$("#checkCode").on("click",sendPhoneMsg);

var testRegister = function(){
	var username = $("#username").val();
	var psw = $("#psw").val();
	var checkPsw = $("#checkPsw").val();
	var phoneMsg = $("#phoneMsg").val();
	if(username != "" && psw != "" && checkPsw != ""){
		//检验用户名格式正则
		var checkUsernameReg = /^1[3|4|5|7|8]\d{9}$/;
		//检验密码格式正则
		var checkPswReg = /^\w{6,16}$/;
		if(checkUsernameReg.test(username)){
			if(checkPswReg.test(psw)){
				if(checkPsw == psw){
                    if(phoneMsg == randomNum){
                        $.ajax({
                            type:"post",
                            url: domain + "/pro/php/findPassWord.php",
                            async:true,
                            data:{
                                username: username,
                                psw: psw
                            },
                            success: function(result){
                                if(result == 'success'){
                                    $('#remind').html('修改成功');
                                    // localStorage.removeItem("user");
                                    // localStorage.removeItem("userLevel");
                                    // localStorage.removeItem("userNickName");
                                    // localStorage.removeItem("headImg");
                                    setTimeout(function(){
                                        window.location.href = 'http://localhost/pro/index.html';
                                    },300);
                                }else if(result == 'repeat'){
									$('#remind').html('修改成功');
									// localStorage.removeItem("user");
                                    // localStorage.removeItem("userLevel");
                                    // localStorage.removeItem("userNickName");
                                    // localStorage.removeItem("headImg");
                                    setTimeout(function(){
                                        window.location.href = 'http://localhost/pro/index.html';
                                    },300);
                                }else{
									console.log(result);
									alert('未知错误');
								}
                            },
                            error: function(result){
                                console.log(result);
                            }
                        });
                    }else{
                        $("#remind").html("验证码错误");
                        $("#phoneMsg").val("");
                    }
				}else{
					$("#remind").html("两次密码不一样");
				}
			}else{
				$("#remind").html("密码格式错误");
			}
		}else{
			$("#remind").html("手机格式错误");
		}
	}else{
		$("#remind").html("您有未填写的信息");
	}
}
$("#submitBtn").on("click",testRegister);
//绑定回车键提交
$(".container input").on("keydown",function(e){
	e = e || event;
	var keyCode = e.keyCode || e.which || e.charCode;
	if(keyCode == 13){
		testRegister();
	}
});


