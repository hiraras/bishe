var domain = 'http://localhost';
(function(){
    init();
})();

function init(){
    var username = localStorage.getItem('user');
    if(username == null){
        window.location.href = 'http://localhost/pro/index.html';
        return ;
    }
    $('#findPassWord').click(function(){
        window.location.href = 'http://localhost/pro/page/findPassWord.html';
    });
}
function changePassWordBtnPressHandle(){
    var checkPswReg = /^\w{6,16}$/;
    var userId = localStorage.getItem('user');
    var oldPsw = $('#username').val();
    var newPsw = $('#psw').val();
    var repeatPsw = $('#repeatPsw').val();
    if(oldPsw.trim() == '' || newPsw.trim() == '' || repeatPsw.trim() == ''){
        $('#remind').html('您有未输入的内容');
    }else{
        if(newPsw != repeatPsw){
            $('#remind').html('两次密码不相等');
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
                            localStorage.removeItem("user");
                            localStorage.removeItem("userLevel");
                            localStorage.removeItem("userNickName");
                            localStorage.removeItem("headImg");
                            setTimeout(function(){
                                window.location.href = 'http://localhost/pro/page/login.html';
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
























