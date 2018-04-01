var domain = "http://localhost";
(function(){
    init();
})();

function init(){
    $.ajax({
        type: "get",
        url: domain + "/pro/php/getThemes.php",
        async: true,
        success: function(result){
            try{
                var data = JSON.parse(result);
            }catch(e){
                console.log(e);
            }
            for(var i=0;i<data.length;i++){
                var $item = createOption(data[i]);
                $('#themeBelongSelect').append($item);
            }
        }
    });
    $('#btnSubmit').click(function(){
        var themeBelong = $('#themeBelongSelect').val();
        var barName = $('#inputBarName').val();
        var userId = localStorage.getItem('user');
        if(userId == null){
            $('#tip').html('请先登录才能创建吧');
        }else{
            if(themeBelong == '' || barName.trim() == ''){
                $('#tip').html('请输入吧名和选择吧类型');
            }else{
                $.ajax({
                    type: "get",
                    url: domain + "/pro/php/applyBuildBar.php",
                    async: true,
                    data: {
                        barName: barName,
                        themeBelong: themeBelong,
                        userId: userId
                    },
                    success: function(result){
                        if(result == 'success'){
                            $('#tip').html('创建成功');
                            setTimeout(function(){
                                window.location.href = "http://localhost/pro/index.html";
                            },300);
                        }else if(result == 'exist'){
                            $('#tip').html('该吧名已存在');
                        }else{
                            alert('未知错误');
                        }
                    }
                });
            }
        }
    });
}

function createOption(data){
    var $option = $('<option></option>');
    $option.html(data.sortName);
    $option.attr('value', data.sortName);
    return $option;
}




















