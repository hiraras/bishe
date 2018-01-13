var randomNum = -11111111;
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
					randomNum = -11111111;
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
	var nickname = $("#nickname").val();
	if(username != "" && psw != "" && checkPsw != "" && nickname != ""){
		//检验用户名格式正则
		var checkUsernameReg = /^1[3|4|5|7|8]\d{9}$/;
		//检验密码格式正则
		var checkPswReg = /^\w{6,16}$/;
		if(checkUsernameReg.test(username)){
			if(checkPswReg.test(psw)){
				if(checkPsw == psw){
					if(nickname.length >= 4 && nickname.length <= 8){
						$.ajax({
							type: "get",
							url: domain + "/pro/php/testNickName.php",
							data: {nickname: nickname},
							async: true,
							success: function(result){
								result = Number(result);
								if(result == 100){
									$("#remind").html("昵称已存在");
								}else if(result == 101){
									if(phoneMsg == randomNum){
										$.ajax({
											type:"post",
											url: domain + "/pro/php/register.php",
											async:true,
											data:{
												username: username,
												psw: psw,
												nickname: nickname
											},
											success: function(result){
//												console.log(result);
												var num = +result;
												if(num == 100){
													$("#remind").html("用户已存在");
												}else if(num == 101){
													$("#remind").html("注册成功");
													sessionStorage.setItem("user",username);
													sessionStorage.setItem("userLevel",1);
													window.location.href = "index.html";
												}else if(num == 102){
													$("#remind").html("注册失败");
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
									$("#remind").html("发生未知错误");
								}
							}
						});
					}else{
						$("#remind").html("昵称格式错误");
					}
				}else{
					$("#remind").html("两次密码不一样");
				}
			}else{
				$("#remind").html("密码格式错误");
			}
		}else{
			$("#remind").html("用户名格式错误");
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

$("#username").on("blur",function(e){
	var checkUsernameReg = /^1[3|4|5|7|8]\d{9}$/;
	var username = $(this).val();
	if(checkUsernameReg.test(username)){
		$("#remind").html("&nbsp;");
	}else{
		$("#remind").html("用户名格式错误");
	}
});

$("#psw").on("blur",function(e){
	var checkPswReg = /^\w{6,16}$/;
	var psw = $(this).val();
	if(checkPswReg.test(psw)){
		$("#remind").html("&nbsp;");
	}else{
		$("#remind").html("密码格式错误");
	}
});
$("#checkPsw").on("blur",function(e){
	var checkPsw = $(this).val();
	var psw = $("#psw").val();
	if(checkPsw == psw){
		$("#remind").html("&nbsp;");
	}else{
		$("#remind").html("两次密码不一样");
	}
});
$("#nickname").on("blur",function(e){
	var nickname = $(this).val();
	var len = nickname.length;
	if(nickname != ""){
		if(len >= 4 && len <= 8){
			$.ajax({
				type: "get",
				url: domain + "/pro/php/testNickName.php",
				data: {nickname: nickname},
				async: true,
				success: function(result){
					result = Number(result);
					if(result == 100){
						$("#remind").html("昵称已存在");
					}else if(result == 101){
						$("#remind").html("&nbsp;");
					}else{
						$("#remind").html("发生未知错误");
					}
				}
			});
		}else{
			$("#remind").html("昵称格式错误");
		}
	}
});
