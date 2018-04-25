var checkCodeStr = "";
window.onload = function(){
	checkCodeStr = createCheckCode();
}
function init(){
	if(localStorage.getItem('user') != null){
		window.location.href = 'http://localhost/pro/index.html';
	}
}
init();
function testLogin(){
	var username = $("#username").val();
	var psw = $("#psw").val();
	var phoneReg = /(^1[3|4|5|7|8]\d{9}$)/;
	var domain = "http://localhost";
	var checkCode = $("#checkCode").val();
	if(username.trim() != "" && psw.trim() != "" && checkCode.trim() != ""){
		if(phoneReg.test(username) || username == 'admin'){
			if(checkCodeStr == checkCode){
				$.ajax({
					type:"post",
					url:domain+"/pro/php/login.php",
					async:true,
					data:{"user":username,"psw": psw},
					dataType: "text",
					success: function(result){
						try{
							result = JSON.parse(result);
						}catch(e){
							$("#remind").html("发生未知错误，请稍后再试!");
							console.log(result);
							$('#checkCode').val('');
							$('#psw').val('');
							$('#username').val('');
						}
						if(result.value == 2){
							$("#remind").html("用户名不存在");
							checkCodeStr = createCheckCode();
							$('#checkCode').val('');
							$('#psw').val('');
							$('#username').val('');
						}else if(result.value == 0){
							$("#remind").html("用户名或密码不正确");
							checkCodeStr = createCheckCode();
							$('#checkCode').val('');
							$('#psw').val('');
						}else{
							if(result.value == 'admin'){
								sessionStorage.setItem("admin",result.data.username);
								window.location.href = "http://localhost/pro/page/admin.html";
							}else{
								getUserMsg(result.data.username);
								localStorage.setItem("user",result.data.username);
								localStorage.setItem("userLevel",result.data.level);
								window.history.back();
							}
						}
					},
					error: function(e){
						console.log(e.response);
					}
				});
			}else{
				$("#remind").html("验证码错误");
				$("#checkCode").val("");
				checkCodeStr = createCheckCode();
				$('#psw').val('');
			}
		}else{
			$("#remind").html("用户名格式不正确");
			checkCodeStr = createCheckCode();
			$('#checkCode').val('');
			$('#psw').val('');
		}
	}else{
		$("#remind").html("您有未填写的信息");
		checkCodeStr = createCheckCode();
		$('#checkCode').val('');
		$('#psw').val('');
	}
}
$("#username").on("keydown",function(e){
	e = e || event;
	var keyCode = e.keyCode || e.which || e.charCode;
	if(keyCode == 13){
		testLogin();
	}
});
$("#psw").on("keydown",function(e){
	e = e || event;
	var keyCode = e.keyCode || e.which || e.charCode;
	if(keyCode == 13){
		testLogin();
	}
});
$("#checkCode").on("keydown",function(e){
	e = e || event;
	var keyCode = e.keyCode || e.which || e.charCode;
	if(keyCode == 13){
		testLogin();
	}
});

$("#checkCodeImg").on("click",function(){
	checkCodeStr = createCheckCode();
})

$("#username").on("blur",function(){
	var phoneReg = /(^1[3|4|5|7|8]\d{9}$)/;
	var username = $(this).val();
	if(!phoneReg.test(username) && username != 'admin'){
		$("#remind").html("请输入正确的账号");
	}
});
$('#findPassWord').click(function(){
	window.location.href = 'http://localhost/pro/page/findPassWord.html';
});

function getUserMsg(userName){
	var domain = "http://localhost";
	$.ajax({
		url: domain + "/pro/php/getUserMsg.php",
		type: 'get',
		async: true,
		data: {
			username: userName
		},
		success: function(result){
			try{
				var data = JSON.parse(result);
			}catch(e){
				console.log(e);
			}
			if(data.result == 'success'){
				localStorage.setItem('userNickName',data.data.nickname);
			}else{
				alert('用户不存在');
			}
		}
	});
}