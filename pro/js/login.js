var checkCodeStr = "";
window.onload = function(){
	checkCodeStr = createCheckCode();
}
function testLogin(){
	var username = $("#username").val();
	var psw = $("#psw").val();
	var phoneReg = /(^1[3|4|5|7|8]\d{9}$)/;
	var domain = "http://localhost";
	var checkCode = $("#checkCode").val();
	if(username.trim() != "" && psw.trim() != "" && checkCode.trim() != ""){
		if(phoneReg.test(username)){
			if(checkCodeStr == checkCode){
				$.ajax({
					type:"post",
					url:domain+"/pro/php/login.php",
					async:true,
					data:{"user":username,"psw": psw},
					dataType: "text",
					success: function(result){
//						result = JSON.parse(result);
						if(result == 2){
							$("#remind").html("用户名不存在");
						}else if(result == 0){
							$("#remind").html("用户名或密码不正确");
						}else{
							try{
								result = JSON.parse(result)[0];
//								console.log(result);
								sessionStorage.setItem("user",result.username);
								sessionStorage.setItem("userLevel",result.level);
								window.location.href = "index.html";
							}catch(e){
								$("#remind").html("发生未知错误，请稍后再试!");
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
			}
		}else{
			$("#remind").html("用户名格式不正确");
		}
	}else{
		$("#remind").html("您有未填写的信息");
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
	if(!phoneReg.test(username)){
		$("#remind").html("请输入正确的账号");
	}
});
