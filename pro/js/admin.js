var featureNum = 0;
var domain = 'http://localhost';
var userInfoArr = ['id', '账号', '昵称', '创号时间', '头像', '经验值', '地址', '年龄', '学校', '签到状态', '今日经验', '发帖数', '状态', '操作'];
var sortBarArr = ['id', '分类名', '状态'];
var replyToReplyArr = ['id', 'postBelongId', 'position', 'replyTime', 'replyerId', 'replyerNickname', 'replyerHeadImg', 'content', 'status'];
var postsArr = ['id', '标题', '所属吧', '楼主id', '发帖时间', '置顶', '加精', '精华区', '状态', '内容', '点赞数', '楼主昵称', '吧主', '操作'];
var postReply = ['id', '所属帖子id', '楼层数', '发布时间', '内容', '发布者id', '状态', '昵称', '操作'];
var barsArr = ['id', '吧名', '吧主id', '创吧时间', '所属主题', '关注数', '吧描述', '吧头像', '创吧者id', '状态', '帖子数', '操作'];
var barAttentionArr = ['id', 'userId', 'barId', 'barName', 'attentionTime', 'status'];
var applyBuildBarArr = ['id', '吧名', '所属主题', '申请者id', '申请时间', '操作'];
var reportArr = ['id', '帖子id', '楼层数', '举报内容', '举报者id', '被举报者id', '举报时间', '状态', '所属吧', '处理人', '操作'];
var userApply = ['id', '申请者id', '内容', '时间', '状态', '操作'];

(function () {
    if (sessionStorage.getItem('admin') == null) {
        window.location.href = "http://localhost/pro/index.html";
    }
    init();
})();
function init() {
    $('.feature_item').each(function (index) {
        $(this).click(function () {
            featureNum = index;
            changeFeature(index);
        });
    });
    $('#rightContainer').append(createUserMsgItem());
}
//用户管理区域
function createUserMsgItem() {
    var container = $('<div></div>');
    var idInput = $('<input />');
    idInput.attr('placeholder', '用户id');
    idInput.attr('id', 'inputUserId');
    idInput.attr('maxlength', 11);
    var nicknameInput = $('<input />');
    nicknameInput.attr('placeholder', '用户昵称');
    nicknameInput.attr('id', 'inputUserNickname');
    nicknameInput.attr('maxlength', 8);
    var nicknameLabel = $('<label />');
    nicknameLabel.attr('for', 'inputUserNickname');
    nicknameLabel.html('用户昵称:');
    var userIdLabel = $('<label />');
    userIdLabel.attr('for', 'inputUserId');
    userIdLabel.html('用户id:');
    var search = $('<button></button>');
    search.html('搜索');
    search.attr('id', 'search');
    search.click(searchUserMsg);
    container.append(userIdLabel);
    container.append(idInput);
    container.append(nicknameLabel);
    container.append(nicknameInput);
    container.append(search);
    return container;
}

function searchUserMsg() {
    var userId = $('#inputUserId').val();
    var userNickname = $('#inputUserNickname').val();
    var fileName;
    var requsetData = {};
    if (userId.trim() == '' && userNickname.trim() == '') {
        alert('不能为空');
        return;
    } else if (userId.trim() != '' && userNickname.trim() != '') {
        fileName = 'getUserMsgByIdAndNickname';
        requsetData.username = userId;
        requsetData.nickname = userNickname;
    } else if (userId.trim() != '' && userNickname.trim() == '') {
        fileName = 'getUserMsg';
        requsetData.username = userId;
    } else {
        fileName = 'getUserMsgByNickname';
        requsetData.nickname = userNickname;
    }
    $.ajax({
        type: 'get',
        url: domain + '/pro/php/' + fileName + '.php',
        async: true,
        data: requsetData,
        success: function (result) {
            try {
                var data = JSON.parse(result);
            } catch (e) {
                console.log(e);
            }
            if (data.result == 'none') {
                alert('没有该用户');
            } else {
                $('#rightContainer table').remove();
                var table = createUserMsgTable(userInfoArr, data.data);
                $('#rightContainer').append(table);
            }
        }
    });
}

function createUserMsgTable(headData, data) {
    var table = $('<table></table>');
    var headTr = $('<tr></tr>');
    for (var i = 0; i < headData.length; i++) {
        var headTd = $('<td></td>');
        headTd.html(headData[i]);
        headTr.append(headTd);
    }
    table.append(headTr);
    var tr = $('<tr></tr>');
    for (var item in data) {
        var td = $('<td></td>');
        td.html(data[item]);
        tr.append(td);
    }
    var tdOption = $('<td></td>');
    tdOption.css({
        'display': 'flex',
    });
    var aOption = $('<a></a>');
    if (data.status == 1) {
        aOption.html('禁言');
    } else {
        aOption.html('解除禁言');
    }
    aOption.click(function () {
        var reason = data.status == 1 ? '请输入您的禁言理由' : '请输入您的解除禁言的理由';
        var msg = prompt(reason);
        if (msg == null || msg == '') {
            return;
        }
        changeUserStatus(data.username, data.status, msg);
    });
    var aOption2  = $('<a></a>');
    aOption2.html('发送通知');
    aOption2.css('margin-left','10px');
    aOption2.click(function(){
        var msg = prompt('请输入通知的内容');
        if(msg == null || msg == ''){
            return ;
        }
        sendInform(data.username, msg);
    });
    tdOption.append(aOption);
    tdOption.append(aOption2);
    tr.append(tdOption);
    table.append(tr);
    return table;
}

//禁言接口
function changeUserStatus(id, currStatus, msg) {
    var nextStatus;
    currStatus = Number(currStatus);
    if (currStatus == 1) {
        nextStatus = 0;
    } else {
        nextStatus = 1;
    }
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changeUserStatus.php',
        async: true,
        data: {
            userId: id,
            status: nextStatus,
            msg: msg
        },
        success: function (result) {
            console.log(result);
            if (result == 'success') {
                alert('操作成功');
                window.location.reload();
            } else {
                alert('操作失败');
                window.location.reload();
            }
        }
    });
}

//发送通知接口
function sendInform(id, msg){
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/sendInform.php',
        async: true,
        data: {
            userId: id,
            msg: msg
        },
        success: function (result) {
            console.log(result);
            if (result == 'success') {
                alert('操作成功');
                window.location.reload();
            } else {
                alert('操作失败');
                window.location.reload();
            }
        }
    });
}

//帖子管理区域
function createPostItem() {
    var container = $('<div></div>');

    var barNameInput = $('<input />');
    barNameInput.attr('placeholder', '吧名');
    barNameInput.attr('id', 'inputBarName');
    barNameInput.attr('maxlength', 16);
    var BarNameLabel = $('<label />');
    BarNameLabel.attr('for', 'inputBarName');
    BarNameLabel.html('吧名:');
    var titleInput = $('<input />');
    titleInput.attr('placeholder', '帖子标题');
    titleInput.attr('id', 'inputPostTitle');
    titleInput.attr('maxlength', 80);
    var postTitleLabel = $('<label />');
    postTitleLabel.attr('for', 'inputPostTitle');
    postTitleLabel.html('帖子标题:');

    var idInput = $('<input />');
    idInput.attr('placeholder', '帖子id');
    idInput.attr('id', 'inputPostId');
    idInput.attr('maxlength', 10);
    var postIdLabel = $('<label />');
    postIdLabel.attr('for', 'inputPostId');
    postIdLabel.html('帖子id:');
    var search = $('<button></button>');
    search.html('搜索');
    search.attr('id', 'search');
    search.click(searchPostMsg);
    container.append(BarNameLabel);
    container.append(barNameInput);
    container.append(postTitleLabel);
    container.append(titleInput);
    container.append(postIdLabel);
    container.append(idInput);
    container.append(search);
    return container;
}

function searchPostMsg() {
    var postId = $('#inputPostId').val();
    var barName = $('#inputBarName').val();
    var postTitle = $('#inputPostTitle').val();
    if (postId.trim() == '' && barName.trim() == '' && postTitle.trim() == '') {
        alert('不能为空');
        return;
    }else if(barName.trim() == '' && postTitle.trim() != ''){
        alert('请输入吧名');
        return ;
    }else if(barName.trim() != '' && postTitle.trim() == ''){
        alert('请输入帖子标题');
        return ;
    }
    $.ajax({
        type: 'get',
        url: domain + '/pro/php/getPostMsgIgnoreStatus.php',
        async: true,
        data: {
            postId: postId,
            barName: barName,
            postTitle: postTitle
        },
        success: function (result) {
            try {
                var data = JSON.parse(result);
            } catch (e) {
                console.log(result);
                console.log(e);
            }
            if (data.result == 'success') {
                $('#rightContainer table').remove();
                var table = createPostMsgTable(postsArr, data.data);
                $('#rightContainer').append(table);
            } else {
                alert('帖子不存在');
            }
        }
    });
}

function createPostMsgTable(headData, data) {
    console.log(data);
    var table = $('<table></table>');
    var headTr = $('<tr></tr>');
    for (var i = 0; i < headData.length; i++) {
        var headTd = $('<td></td>');
        headTd.html(headData[i]);
        headTr.append(headTd);
    }
    table.append(headTr);
    for(var j=0;j<data.length;j++){
        delete data[j].creatorHeadImg;
        delete data[j].creatorNickName;
        var tr = $('<tr></tr>');
        for (var item in data[j]) {
            var td = $('<td></td>');
            td.html(data[j][item]);
            tr.append(td);
        }
        var tdOption = $('<td></td>');
        var aOption = $('<a></a>');
        if (data[j].status == 1) {
            aOption.html('删除');
        } else {
            aOption.html('恢复');
        }
        (function(data2){
            aOption.click(function () {
                changePostStatus(data2.id, data2.status);
            });
        })(data[j]);
        var aOption2 = $('<a></a>');
        aOption2.css({
            'margin-left': '10px',
            'margin-right': '1px'
        });
        aOption2.html('进入');
        (function(postId){
            aOption2.click(function(){
                window.location.href = domain + '/pro/page/post.html?postId=' + postId;
            });
        })(data[j].id);
        tdOption.append(aOption);
        tdOption.append(aOption2);
        tr.append(tdOption);
        table.append(tr);
    }
    return table;
}

//删除/恢复帖子接口
function changePostStatus(id, currStatus) {
    var nextStatus, msg;
    currStatus = Number(currStatus);
    if(currStatus == 1){
        msg = prompt('请输入您的删帖理由');
        if(msg == null || msg == ''){
            return ;
        }
    }else{
        var checkSelect = confirm('确定恢复该帖子?');
        if(checkSelect){
            msg = '已被恢复';
        }else{
            return ;
        }
    }
    if (currStatus == 1) {
        nextStatus = 0;
    } else {
        nextStatus = 1;
    }
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changePostStatus.php',
        async: true,
        data: {
            postId: id,
            status: nextStatus,
            msg: msg
        },
        success: function (result) {
            if (result == 'success') {
                alert('操作成功');
                window.location.reload();
            } else {
                alert('操作失败');
                window.location.reload();
            }
        }
    });
}

//评论管理区域
function createPostReplyItem() {
    var container = $('<div></div>');
    var idInput = $('<input />');
    idInput.attr('placeholder', '帖子id');
    idInput.attr('id', 'inputPostId');
    idInput.attr('maxlength', 11);
    var positionInput = $('<input />');
    positionInput.attr('placeholder', '楼层数');
    positionInput.attr('id', 'inputPosition');
    positionInput.attr('maxlength', 11);
    var postIdLabel = $('<label />');
    postIdLabel.attr('for', 'inputPostId');
    postIdLabel.html('帖子id:');
    var positionLabel = $('<label />');
    positionLabel.attr('for', 'inputPosition');
    positionLabel.html('楼层数:');
    var search = $('<button></button>');
    search.html('搜索');
    search.attr('id', 'search');
    search.click(searchPostReplyMsg);
    container.append(postIdLabel);
    container.append(idInput);
    container.append(positionLabel);
    container.append(positionInput);
    container.append(search);
    return container;
}

function searchPostReplyMsg() {
    var postId = $('#inputPostId').val();
    var position = $('#inputPosition').val();
    if (postId.trim() == '') {
        alert('有未填写的信息');
        return;
    }
    $.ajax({
        type: 'get',
        url: domain + '/pro/php/searchReply.php',
        async: true,
        data: {
            postId: postId,
            position: position
        },
        success: function (result) {
            try {
                var data = JSON.parse(result);
            } catch (e) {
                console.log(result);
                console.log(e);
            }
            if (data.result == 'success') {
                $('#rightContainer table').remove();
                var table = createPostReplyMsgTable(postReply, data.value);
                $('#rightContainer').append(table);
            } else {
                alert('该评论不存在');
            }
        }
    });
}

function createPostReplyMsgTable(headData, data) {
    console.log(data);
    var table = $('<table></table>');
    var headTr = $('<tr></tr>');
    for (var i = 0; i < headData.length; i++) {
        var headTd = $('<td></td>');
        headTd.html(headData[i]);
        headTr.append(headTd);
    }
    table.append(headTr);
    for(var k=0;k<data.length;k++){
        delete data[k].headImg;
        delete data[k].creatorNickName;
        var tr = $('<tr></tr>');
        for (var item in data[k]) {
            var td = $('<td></td>');
            td.html(data[k][item]);
            tr.append(td);
        }
        var tdOption = $('<td></td>');
        var aOption = $('<a></a>');
        if (data[k].status == 1) {
            aOption.html('删除');
        } else {
            aOption.html('恢复');
        }
        (function(dataItem){
            aOption.click(function () {
                changePostReplyStatus(dataItem.postBelongId, dataItem.position, dataItem.status);
            });
        })(data[k]);
        tdOption.append(aOption);
        tr.append(tdOption);
        table.append(tr);
    }
    return table;
}

//删除/恢复评论接口
function changePostReplyStatus(postId, position, currStatus) {
    var nextStatus, msg;
    currStatus = Number(currStatus);
    if(currStatus == 1){
        msg = prompt('请输入您的删除理由');
        if(msg == null || msg == ''){
            return ;
        }
    }else{
        var checkSelect = confirm('确定恢复该评论?');
        if(checkSelect){
            msg = '已被恢复';
        }else{
            return;
        }
    }
    if (currStatus == 1) {
        nextStatus = 0
    } else {
        nextStatus = 1;
    }
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changePostReplyStatus.php',
        async: true,
        data: {
            postId: postId,
            position: position,
            status: nextStatus,
            msg: msg
        },
        success: function (result) {
            if (result == 'success') {
                alert('操作成功');
                window.location.reload();
            } else {
                alert('操作失败');
                window.location.reload();
            }
        }
    });
}

//贴吧分类区域
function createBarSortItem() {
    var container = $('<div></div>');
    var nameInput = $('<input />');
    nameInput.attr('placeholder', '贴吧分类名');
    nameInput.attr('id', 'inputSortName');
    nameInput.attr('maxlength', 25);
    var label = $('<label />');
    label.attr('for', 'inputSortName');
    label.html('贴吧分类名:');
    var search = $('<button></button>');
    search.html('添加');
    search.attr('id', 'search');
    search.click(function(){
        var result = confirm('确定创建该贴吧分类?');
        if(!!result){
            addBarSort();
        }else{
            return ;
        }
    });
    container.append(label);
    container.append(nameInput);
    container.append(search);
    var indexComponent = createIndex();
    container.append(indexComponent);
    getData(0);
    return container;
}
//添加贴吧分类接口
function addBarSort() {
    var sortName = $('#inputSortName').val();
    if (sortName.trim() == '') {
        alert('不能为空');
        return;
    }
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/addBarSort.php',
        async: true,
        data: {
            sortName: sortName
        },
        success: function (result) {
            if (result == 'isExist') {
                alert('该贴吧分类已存在');
            } else if (result == 'success') {
                alert('创建成功');
                window.location.reload();
            } else {
                console.log(result);
                alert('创建失败');
            }
        }
    });
}

//申请建吧区域
function createApplyBarItem() {
    var container = $('<div></div>');
    var indexComponent = createIndex();
    container.append(indexComponent);
    getData(0);
    return container;
}

function agreeApply() {
    var id = $(this).parent().siblings().first().html();
    id = Number(id);
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/agreeBuildBar.php',
        async: true,
        data: {
            id: id
        },
        success: function (result) {
            if (result == 'success') {
                alert('创建成功');
                window.location.reload();
            } else {
                alert('创建失败');
                window.location.reload();
            }
        }
    });
}

function refuseApply(msg) {
    var id = $(this).parent().siblings().first().html();
    id = Number(id);
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/refuseBuildBar.php',
        async: true,
        data: {
            id: id,
            refuseMsg: msg
        },
        success: function (result) {
            if (result == 'success') {
                alert('拒绝成功');
                window.location.reload();
            } else {
                console.log(result);
                alert('未知错误');
                window.location.reload();
            }
        }
    });
}

//举报区域
function createReportItem() {
    var container = $('<div></div>');
    var indexComponent = createIndex();
    container.append(indexComponent);
    getData(0);
    return container;
}

function changeReportStatus() {
    var id = $(this).parent().siblings().first().html();
    id = Number(id);
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changeReportStatus.php',
        async: true,
        data: {
            id: id,
            optioner: 0
        },
        success: function (result) {
            if (result == 'success') {
                alert('完成');
                window.location.reload();
            } else {
                console.log(result);
                alert('未知错误');
                window.location.reload();
            }
        }
    });
}

//用户申请区域
function createUserApplyItem() {
    var container = $('<div></div>');
    var indexComponent = createIndex();
    container.append(indexComponent);
    getData(0);
    return container;
}

function changeUserApplyStatus() {
    var id = $(this).parent().siblings().first().html();
    id = Number(id);
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changeUserApplyStatus.php',
        async: true,
        data: {
            id: id
        },
        success: function (result) {
            if (result == 'success') {
                alert('完成');
                window.location.reload();
            } else {
                console.log(result);
                alert('未知错误');
                window.location.reload();
            }
        }
    });
}

//贴吧管理模块
function createBarManageItem() {
    var container = $('<div></div>');
    var idInput = $('<input />');
    idInput.attr('placeholder', '贴吧id');
    idInput.attr('id', 'inputBarId');
    idInput.attr('maxlength', 11);
    var barNameInput = $('<input />');
    barNameInput.attr('placeholder', '贴吧名');
    barNameInput.attr('id', 'inputBarName');
    barNameInput.attr('maxlength', 16);
    var barNameLabel = $('<label />');
    barNameLabel.attr('for', 'inputBarName');
    barNameLabel.html('贴吧名:');
    var barIdLabel = $('<label />');
    barIdLabel.attr('for', 'inputBarId');
    barIdLabel.html('贴吧id:');
    var search = $('<button></button>');
    search.html('搜索');
    search.attr('id', 'search');
    search.click(searchBarMsg);
    container.append(barIdLabel);
    container.append(idInput);
    container.append(barNameLabel);
    container.append(barNameInput);
    container.append(search);
    return container;
}

function searchBarMsg() {
    var barId = $('#inputBarId').val();
    var barName = $('#inputBarName').val();
    var fileName;
    var requsetData = {};
    if (barId.trim() == '' && barName.trim() == '') {
        alert('不能为空');
        return;
    } else {
        fileName = 'getBarMsgByIdAndBarName';
        requsetData.barId = barId;
        requsetData.barName = barName;
    }
    $.ajax({
        type: 'get',
        url: domain + '/pro/php/' + fileName + '.php',
        async: true,
        data: requsetData,
        success: function (result) {
            try {
                var data = JSON.parse(result);
            } catch (e) {
                console.log(e);
            }
            if (data.result == 'none') {
                alert('没有该吧');
                // window.location.reload();
            } else {
                $('#rightContainer table').remove();
                var table = createBarMsgTable(barsArr, data.data);
                $('#rightContainer').append(table);
            }
        }
    });
}

function createBarMsgTable(headData, data) {
    var table = $('<table></table>');
    var headTr = $('<tr></tr>');
    for (var i = 0; i < headData.length; i++) {
        var headTd = $('<td></td>');
        headTd.html(headData[i]);
        headTr.append(headTd);
    }
    table.append(headTr);
    var tr = $('<tr></tr>');
    for (var item in data) {
        var td = $('<td></td>');
        td.html(data[item]);
        tr.append(td);
    }
    var tdOption = $('<td></td>');
    var aOption = $('<a></a>');
    if (data.master == '0') {
        aOption.html('设立吧主');
    } else {
        aOption.html('解除吧主');
    }
    aOption.click(function () {
        var title = data.master == '0' ? '请输入新的吧主id' : '请输入解除吧主原因';
        var msg = prompt(title);
        var newMasterId = '';
        var informMsg = '';
        var informedId = '';
        if (msg == null || msg == '') {
            return;
        }
        if (data.master == '0') {
            var phoneReg = /(^1[3|4|5|7|8]\d{9}$)/;
            if (phoneReg.test(msg)) {
                newMasterId = msg;
                informMsg = '您已被设为' + data.barName + '吧的吧主';
                informedId = newMasterId;
            } else {
                alert('id格式错误');
                return;
            }
        } else {
            newMasterId = '0';
            informMsg = '因为:' + msg + ',您已被解除' + data.barName + '吧的吧主职务';
            informedId = data.master;
        }
        changeBarMaster(data.id, newMasterId, informMsg, informedId);
    });
    tdOption.append(aOption);
    tr.append(tdOption);
    table.append(tr);
    return table;
}

//改变吧主接口
function changeBarMaster(id, newMasterId, informMsg, informedId) {
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changeBarMaster.php',
        async: true,
        data: {
            id: id,
            newMasterId: newMasterId,
            informMsg: informMsg,
            informedId: informedId
        },
        success: function (result) {
            if(result == 'notExist'){
                alert('该用户id不存在');
            }else if(result == 'success'){
                alert('操作成功');
                window.location.reload();
            }else{
                console.log(result);
                alert('未知错误');
                window.location.reload();
            }
        }
    });
}


//分页区域
function getData(currIndex) {
    var type = $('#rightContainer').attr('type');
    type = Number(type);
    var fileName;
    var requsetData = {};
    requsetData.currIndex = currIndex;
    //这个变量保存操作的那个单元格，如果没有就不动，以undefind保存，下面进行判断
    var optionEle;
    switch (type) {
        case 5:
            //贴吧分类
            fileName = 'getBarSortPage';
            break;
        case 2:
            //创吧申请
            fileName = 'getApplyBarPage';
            optionEle = $('<td></td>');
            optionEle.css({
                'display': 'flex',
                'flex-wrap': 'no-wrap',
                'justify-content': 'space-around'
            });
            var agreeOption = $('<a></a>');
            agreeOption.html('同意');
            agreeOption.css('margin-right', '8px');
            agreeOption.addClass('agree_option');
            var refuseOption = $('<a></a>');
            refuseOption.html('拒绝');
            refuseOption.addClass('refuse_option');
            optionEle.append(agreeOption);
            optionEle.append(refuseOption);
            break;
        case 1:
            //举报信息
            fileName = 'getReportMsgPage';
            optionEle = $('<td></td>');
            optionEle.css({
                'display': 'flex',
                'flex-wrap': 'no-wrap',
                'justify-content': 'space-around'
            });
            var confirmOption = $('<a></a>');
            confirmOption.html('确认');
            confirmOption.addClass('report_confirm');
            optionEle.append(confirmOption);
            break;
        case 7:
            //申请信息
            fileName = 'getUserApplyPage';
            optionEle = $('<td></td>');
            optionEle.css({
                'display': 'flex',
                'flex-wrap': 'no-wrap',
                'justify-content': 'space-around'
            });
            var confirmOption = $('<a></a>');
            confirmOption.html('确认');
            confirmOption.addClass('user_apply_confirm');
            optionEle.append(confirmOption);
        default:
            break;
    }
    $.ajax({
        type: 'get',
        url: domain + '/pro/php/' + fileName + '.php',
        async: true,
        data: requsetData,
        success: function (result) {
            try {
                var data = JSON.parse(result);
            } catch (e) {
                console.log(e);
            }
            if (data.result == 'none') {
                alert('没有记录');
            } else {
                freshTable(data, currIndex, optionEle);
            }
        }
    });
}

function freshTable(data, currIndex, optionEle) {
    var pageNum = data.totalNum / data.pageItemNum;
    //是否有页面的内容是只有一部分的
    var isComplete = data.totalNum % data.pageItemNum == 0 ? true : false;
    pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
    if (pageNum == 0) {
        pageNum = 1;
    }
    $('#rightContainer table').remove();
    $('#rightContainer').attr('index', currIndex);
    $('#rightContainer').attr('totalpagenum', --pageNum);
    var table = createTable(data, optionEle);
    $('#rightContainer').find('.index').before(table);
    initOtherClickEvent();
    initIndex();
}

function createTable(data, optionEle) {
    var headData = [];
    var type = $('#rightContainer').attr('type');
    type = Number(type);
    switch (type) {
        case 5:
            //贴吧分类
            headData = sortBarArr;
            break;
        case 2:
            //创吧申请
            headData = applyBuildBarArr;
            break;
        case 1:
            //举报
            headData = reportArr;
            break;
        case 7:
            //用户申请
            headData = userApply;
            break;
        default:
            break;
    }
    var table = $('<table></table>');
    var headTr = $('<tr></tr>');
    for (var i = 0; i < headData.length; i++) {
        var headTd = $('<td></td>');
        headTd.html(headData[i]);
        headTr.append(headTd);
    }
    table.append(headTr);

    for (var j = 0; j < data.value.length; j++) {
        var tr = $('<tr></tr>');
        for (var item in data.value[j]) {
            var td = $('<td></td>');
            td.html(data.value[j][item]);
            tr.append(td);
        }
        if (optionEle != undefined) {
            var optionEleClone = optionEle.clone();
            tr.append(optionEleClone);
        }

        table.append(tr);
    }
    return table;
}

function initIndex() {
    var maxShowIndex = 10;
    var currIndex = Number($('#rightContainer').attr('index'));
    var totalNum = Number($('#rightContainer').attr('totalpagenum'));
    var halfIndexNum = Math.floor(maxShowIndex / 2) + 1;
    if (currIndex == 0) {
        $('#prevPageBtn').css('display', 'none');
        $('#firstPageBtn').css('display', 'none');
    } else {
        $('#prevPageBtn').css('display', 'inline-block');
        $('#firstPageBtn').css('display', 'inline-block');
    }
    if (currIndex == totalNum) {
        $('#nextPageBtn').css('display', 'none');
        $('#lastPageBtn').css('display', 'none');
    } else {
        $('#nextPageBtn').css('display', 'inline-block');
        $('#lastPageBtn').css('display', 'inline-block');
    }
    $('.index_item').removeClass('currIndex');

    if (totalNum < maxShowIndex) {
        $('.index_item').each(function (index) {
            if (index > totalNum) {
                $(this).css('display', 'none');
            }
            if (index == currIndex) {
                $(this).addClass('currIndex');
            }
        });
    } else {
        if (currIndex < halfIndexNum) {
            $('.index_item').each(function (index) {
                $(this).html(index + 1);
            });
        } else if (currIndex > totalNum - halfIndexNum) {
            $('.index_item').each(function (index) {
                $(this).html(totalNum + 1 - (maxShowIndex - 1 - index));
            });
        } else {
            $('.index_item').each(function (index) {
                $(this).html(currIndex + 1 - (halfIndexNum - index - 1));
            });
        }
        $('.index_item').each(function (index) {
            if ($(this).html() == currIndex + 1) {
                $(this).addClass('currIndex');
            }
        });
    }
}
//创建分页按钮组件
function createIndex() {
    var $indexUl = $('<ul></ul>');
    $indexUl.addClass('index');
    var $replyPagingFirstBtnLi = $('<li></li>');
    $replyPagingFirstBtnLi.addClass('paging_btn');
    $replyPagingFirstBtnLi.addClass('first_btn');
    $replyPagingFirstBtnLi.html('首页');
    $replyPagingFirstBtnLi.attr('id', 'firstPageBtn');
    var $replyPagingPrevBtnLi = $('<li></li>');
    $replyPagingPrevBtnLi.addClass('paging_btn');
    $replyPagingPrevBtnLi.addClass('prev_btn');
    $replyPagingPrevBtnLi.html('上一页');
    $replyPagingPrevBtnLi.attr('id', 'prevPageBtn');
    $indexUl.append($replyPagingFirstBtnLi);
    $indexUl.append($replyPagingPrevBtnLi);
    for (var i = 0; i < 10; i++) {
        var $replyPagingIndexBtnLi = $('<li></li>');
        $replyPagingIndexBtnLi.addClass('index_item');
        $replyPagingIndexBtnLi.html(i + 1);
        $indexUl.append($replyPagingIndexBtnLi);
    }
    var $replyPagingNextBtnLi = $('<li></li>');
    $replyPagingNextBtnLi.addClass('paging_btn');
    $replyPagingNextBtnLi.addClass('next_btn');
    $replyPagingNextBtnLi.html('下一页');
    $replyPagingNextBtnLi.attr('id', 'nextPageBtn');
    var $replyPagingLastBtnLi = $('<li></li>');
    $replyPagingLastBtnLi.addClass('paging_btn');
    $replyPagingLastBtnLi.addClass('last_btn');
    $replyPagingLastBtnLi.html('尾页');
    $replyPagingLastBtnLi.attr('id', 'lastPageBtn');
    $indexUl.append($replyPagingNextBtnLi);
    $indexUl.append($replyPagingLastBtnLi);
    return $indexUl;
}

function initIndexBtnPressEvent() {
    $('#prevPageBtn').click(function () {
        prevPage();
    });
    $('#nextPageBtn').click(function () {
        nextPage();
    });
    $('#firstPageBtn').click(function () {
        firstPage();
    });
    $('#lastPageBtn').click(function () {
        lastPage();
    });
    $('.index_item').click(function () {
        var index = Number($(this).html()) - 1;
        getData(index);
    });
}

function prevPage() {
    var currIndex = Number($('#rightContainer').attr('index'));
    if (currIndex > 0) {
        getData(--currIndex);
    }
}

function nextPage() {
    var currIndex = Number($('#rightContainer').attr('index'));
    var totalNum = Number($('#rightContainer').attr('totalPageNum'));
    if (currIndex < totalNum) {
        getData(++currIndex);
    }
}

function firstPage() {
    var currIndex = Number($('#rightContainer').attr('index'));
    if (currIndex != 0) {
        getData(0);
    }
}

function lastPage() {
    var currIndex = Number($('#rightContainer').attr('index'));
    var totalNum = Number($('#rightContainer').attr('totalPageNum'));
    if (currIndex != totalNum) {
        getData(totalNum);
    }
}

function changeFeature(featureNum) {
    var headArr = [];
    var content;
    $('#rightContainer').children().remove();
    $('#rightContainer').attr('type', featureNum);
    $('#rightContainer').attr('index', 0);
    $('#rightContainer').attr('totalPageNum', 0);
    switch (featureNum) {
        case 0:
            content = createUserMsgItem();
            break;
        case 1:
            content = createReportItem();
            break;
        case 2:
            content = createApplyBarItem();
            break;
        case 3:
            content = createPostItem();
            break;
        case 4:
            content = createPostReplyItem();
            break;
        case 5:
            content = createBarSortItem();
            break;
        case 6:
            window.location.href = "http://localhost/pro/page/changePassWord.html";
            return;
            break;
        case 7:
            content = createUserApplyItem();
            break;
        case 8:
            content = createBarManageItem();
            break;
        default:
            break;
    }
    $('#rightContainer').append(content);
    initIndexBtnPressEvent();
}

function initOtherClickEvent() {
    $('.agree_option').click(function () {
        agreeApply.call(this);
    });
    $('.refuse_option').click(function () {
        var msg = prompt('请输入拒绝理由');
        if (msg == null) {
            return;
        }
        refuseApply.call(this, msg);
    });
    $('.report_confirm').click(function () {
        var option = confirm('确认审核完成？');
        if (!option) {
            return;
        }
        changeReportStatus.call(this);
    });
    $('.user_apply_confirm').click(function () {
        var option = confirm('确认审核完成？');
        if (!option) {
            return;
        }
        changeUserApplyStatus.call(this);
    });
}











































































