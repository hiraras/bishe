var domain = 'http://localhost';
(function(){
    init();
})();

function init(){
    var username = localStorage.getItem('user');
    var admin = sessionStorage.getItem('admin');
    if(username == null && admin == null){
        window.location.href = 'http://localhost/pro/index.html';
        return ;
    }
    if(admin != null){
        $('.header').css('display','none');
        $('#findPassWord').css('display', 'none');
    }
    $('#findPassWord').click(function(){
        window.location.href = 'http://localhost/pro/page/findPassWord.html';
    });
}
function changePassWordBtnPressHandle(){
    var checkPswReg = /^\w{6,16}$/;
    //如果有管理员说明管理员一定有登录
    if(sessionStorage.getItem('admin') != null){
        var userId = 'admin';
    }else{
        var userId = localStorage.getItem('user');
    }
    var oldPsw = $('#username').val();
    var newPsw = $('#psw').val();
    var repeatPsw = $('#repeatPsw').val();
    if(oldPsw.trim() == '' || newPsw.trim() == '' || repeatPsw.trim() == ''){
        $('#remind').html('您有未输入的内容');
    }else{
        if(oldPsw == newPsw){
            $('#remind').html('旧密码和新密码相同');
        }else{
            if(newPsw != repeatPsw){
                $('#remind').html('两次密码不相同');
            }else{
                if(!checkPswReg.test(newPsw)){
                    $('#remind').html('新密码格式错误');
                }else{
                    $.ajax({
                        type: 'post',
                        async: true,
                        url: domain + '/pro/php/checkChangePsw.php',
                        data: {
                            userId: userId,
                            oldPsw: oldPsw,
                            newPsw: newPsw
                        },
                        success: function(result){
                            if(result == 'success'){
                                $('#remind').html('修改成功');
                                // localStorage.removeItem("user");
                                // localStorage.removeItem("userLevel");
                                // localStorage.removeItem("userNickName");
                                // localStorage.removeItem("headImg");
                                setTimeout(function(){
                                    window.history.back();
                                },300);
                            }else if(result == 'fail'){
                                $('#remind').html('原密码错误');
                            }else{
                                alert('未知错误');
                            }
                        }
                    });
                }
            }
        }
    }
}

//绑定回车键提交
$(".container input").on("keydown",function(e){
	e = e || event;
	var keyCode = e.keyCode || e.which || e.charCode;
	if(keyCode == 13){
		changePassWordBtnPressHandle();
	}
});






















