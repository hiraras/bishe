var featureNum = 0;
var domain = 'http://localhost';
var userInfoArr = ['id','账号','昵称','创号时间','头像','经验值','地址','年龄','学校','发帖数','状态','操作'];
var sortBarArr = ['id','sortName','status'];
var replyToReplyArr = ['id','postBelongId','position','replyTime','replyerId','replyerNickname','replyerHeadImg','content','status'];
var postsArr = ['id','标题','所属吧','楼主id','发帖时间','置顶','加精','状态','内容','楼主昵称','吧主','操作'];
var postReply = ['id','所属帖子id','楼层数','发布时间','内容','发布者id','状态','昵称','操作'];
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
//用户管理区域
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
//帖子管理区域
function createPostItem(){
    var container = $('<div></div>');
    var idInput = $('<input />');
    idInput.attr('placeholder','帖子id');
    idInput.attr('id','inputPostId');
    idInput.attr('maxlength',10);
    var postIdLabel = $('<label />');
    postIdLabel.attr('for','inputPostId');
    postIdLabel.html('帖子id:');
    var search = $('<button></button>');
    search.html('搜索');
    search.attr('id','search');
    search.click(searchPostMsg);
    container.append(postIdLabel);
    container.append(idInput);
    container.append(search);
    return container;
}

function searchPostMsg(){
    var postId = $('#inputPostId').val();
    if(postId.trim() == ''){
        alert('不能为空');
        return ;
    }
    $.ajax({
        type: 'get',
        url: domain + '/pro/php/getPostMsgIgnoreStatus.php',
        async: true,
        data: {
            postId: postId
        },
        success: function(result){
            try{
                var data = JSON.parse(result);
            }catch(e){
                console.log(e);
            }
            if(data.result == 'success'){
                $('#rightContainer table').remove();
                var table = createPostMsgTable(postsArr, data.data);
                $('#rightContainer').append(table);
            }else{
                alert('该帖子不存在');
            }
        }
    });
}

function createPostMsgTable(headData, data){
    console.log(data);
    delete data.creatorHeadImg;
    delete data.creatorNickName;
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
        aOption.html('删除');
    }else{
        aOption.html('恢复');
    }
    aOption.click(function(){
        changePostStatus(data.id, data.status);
    });
    tdOption.append(aOption);
    tr.append(tdOption);
    table.append(tr);
    return table;
}

//删除/恢复帖子接口
function changePostStatus(id, currStatus){
    var nextStatus;
    currStatus = Number(currStatus);
    if(currStatus == 1){
        nextStatus = 0
    }else{
        nextStatus = 1;
    }
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changePostStatus.php',
        async: true,
        data: {
            postId: id,
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

//评论管理区域
function createPostReplyItem(){
    var container = $('<div></div>');
    var idInput = $('<input />');
    idInput.attr('placeholder','帖子id');
    idInput.attr('id','inputPostId');
    idInput.attr('maxlength',11);
    var positionInput = $('<input />');
    positionInput.attr('placeholder','楼层数');
    positionInput.attr('id','inputPosition');
    positionInput.attr('maxlength',11);
    var postIdLabel = $('<label />');
    postIdLabel.attr('for','inputPostId');
    postIdLabel.html('帖子id:');
    var positionLabel = $('<label />');
    positionLabel.attr('for','inputPosition');
    positionLabel.html('楼层数:');
    var search = $('<button></button>');
    search.html('搜索');
    search.attr('id','search');
    search.click(searchPostReplyMsg);
    container.append(postIdLabel);
    container.append(idInput);
    container.append(positionLabel);
    container.append(positionInput);
    container.append(search);
    return container;
}

function searchPostReplyMsg(){
    var postId = $('#inputPostId').val();
    var position = $('#inputPosition').val();
    if(postId.trim() == '' || position.trim() == ''){
        alert('不能为空');
        return ;
    }
    $.ajax({
        type: 'get',
        url: domain + '/pro/php/searchReply.php',
        async: true,
        data: {
            postId: postId,
            position: position
        },
        success: function(result){
            try{
                var data = JSON.parse(result);
            }catch(e){
                console.log(e);
            }
            if(data.result == 'success'){
                $('#rightContainer table').remove();
                var table = createPostReplyMsgTable(postReply, data.value);
                $('#rightContainer').append(table);
            }else{
                alert('该评论不存在');
            }
        }
    });
}

function createPostReplyMsgTable(headData, data){
    delete data.headImg;
    delete data.creatorNickName;
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
        aOption.html('删除');
    }else{
        aOption.html('恢复');
    }
    aOption.click(function(){
        changePostReplyStatus(data.postBelongId, data.position, data.status);
    });
    tdOption.append(aOption);
    tr.append(tdOption);
    table.append(tr);
    return table;
}

//删除/恢复评论接口
function changePostReplyStatus(postId, position, currStatus){
    var nextStatus;
    currStatus = Number(currStatus);
    if(currStatus == 1){
        nextStatus = 0
    }else{
        nextStatus = 1;
    }
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changePostReplyStatus.php',
        async: true,
        data: {
            postId: postId,
            position: position,
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
            content = createPostItem();
            break;
        case 4:
            content = createPostReplyItem();
            break;
        default:
            break;
    }
    $('#rightContainer').append(content);
}












































































