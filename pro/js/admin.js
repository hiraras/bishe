var featureNum = 0;
var domain = 'http://localhost';
var userInfoArr = ['id','username','nickname','createDate','headImg','exp','address','age','school','postNum','status','操作'];
var sortBarArr = ['id','sortName','status'];
var replyToReplyArr = ['id','postBelongId','position','replyTime','replyerId','replyerNickname','replyerHeadImg','content','status'];
var postsArr = ['id','postName','barBelong','creatorId','createTime','isTop','isGreat','status','creatorNickname','postContent'];
var postReply = ['id','postBelongId','position','createTime','content','creatorNickname','creatorId','status'];
var barsArr = ['id','barName','master','createTime','themeBelong','concernNum','barDescript','barImg','creatorId','status'];
var barAttentionArr = ['id','userId','barId','barName','attentionTime','status'];
var applyBuildBarArr = ['id','barName','themeBelong','applyerId','applyTime'];
(function(){
    if(localStorage.getItem('user') != '17826877713'){
        window.location.href = "http://localhost/pro/index.html";
    }
    init();
})();
function init(){
    $('.feature_item').each(function(index){
        $(this).click(function(){
            featureNum = index;
            changeFeature(index);
        });
    });
    $('#rightContainer').append(createUserMsgItem());
}

function createUserMsgItem(){
    var container = $('<div></div>');
    var idInput = $('<input />');
    idInput.attr('placeholder','用户id');
    idInput.attr('id','inputUserId');
    idInput.attr('maxlength',11);
    var nicknameInput = $('<input />');
    nicknameInput.attr('placeholder','用户昵称');
    nicknameInput.attr('id','inputUserNickname');
    nicknameInput.attr('maxlength',8);
    var nicknameLabel = $('<label />');
    nicknameLabel.attr('for','inputUserNickname');
    nicknameLabel.html('用户昵称:');
    var userIdLabel = $('<label />');
    userIdLabel.attr('for','inputUserId');
    userIdLabel.html('用户id:');
    var search = $('<button></button>');
    search.html('搜索');
    search.attr('id','search');
    search.click(searchUserMsg);
    container.append(userIdLabel);
    container.append(idInput);
    container.append(nicknameLabel);
    container.append(nicknameInput);
    container.append(search);
    return container;
}

function searchUserMsg(){
    var userId = $('#inputUserId').val();
    var userNickname = $('#inputUserNickname').val();
    var fileName;
    var requsetData = {};
    if(userId.trim() == '' && userNickname.trim() == ''){
        alert('不能为空');
        return ;
    }else if(userId.trim() != '' && userNickname.trim() != ''){
        fileName = 'getUserMsgByIdAndNickname';
        requsetData.username = userId;
        requsetData.nickname = userNickname;
    }else if(userId.trim() != '' && userNickname.trim() == ''){
        fileName = 'getUserMsg';
        requsetData.username = userId;
    }else{
        fileName = 'getUserMsgByNickname';
        requsetData.nickname = userNickname;
    }

    $.ajax({
        type: 'get',
        url: domain + '/pro/php/'+fileName+'.php',
        async: true,
        data: requsetData,
        success: function(result){
            console.log(result);
            try{
                var data = JSON.parse(result);
            }catch(e){
                console.log(e);
            }
            if(data.result == 'none'){
                alert('没有该用户');
            }else{
                $('#rightContainer table').remove();
                var table = createUserMsgTable(userInfoArr, data.data);
                $('#rightContainer').append(table);
            }
        }
    });
}
function createUserMsgTable(headData, data){
    var table = $('<table></table>');
    var headTr = $('<tr></tr>');
    for(var i = 0;i<headData.length;i++){
        var headTd = $('<td></td>');
        headTd.html(headData[i]);
        headTr.append(headTd);
    }
    table.append(headTr);
    var tr = $('<tr></tr>');
    for(var item in data){
        var td = $('<td></td>');
        td.html(data[item]);
        tr.append(td);
    }
    var tdOption = $('<td></td>');
    var aOption = $('<a></a>');
    if(data.status == 1){
        aOption.html('禁言');
    }else{
        aOption.html('解除禁言');
    }
    aOption.click(function(){
        changeUserStatus(data.username, data.status);
    });
    tdOption.append(aOption);
    tr.append(tdOption);
    table.append(tr);
    return table;
}

//禁言接口
function changeUserStatus(id, currStatus){
    var nextStatus;
    currStatus = Number(currStatus);
    if(currStatus == 1){
        nextStatus = 2
    }else{
        nextStatus = 1;
    }
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changeUserStatus.php',
        async: true,
        data: {
            userId: id,
            status: nextStatus
        },
        success: function(result){
            if(result == 'success'){
                alert('操作成功');
                window.location.reload();
            }else{
                alert('操作失败');
                window.location.reload();
            }
        }
    });
}

function changeFeature(featureNum){
    var headArr = [];
    var content;
    $('#rightContainer').children().remove();

    switch(featureNum){
        case 0:
            content = createUserMsgItem();
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        default:
            break;
    }
    $('#rightContainer').append(content);
}












































































