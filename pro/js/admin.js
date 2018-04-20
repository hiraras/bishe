var featureNum = 0;
var domain = 'http://localhost';
var userInfoArr = ['id','账号','昵称','创号时间','头像','经验值','地址','年龄','学校','发帖数','状态','操作'];
var sortBarArr = ['id','分类名','状态'];
var replyToReplyArr = ['id','postBelongId','position','replyTime','replyerId','replyerNickname','replyerHeadImg','content','status'];
var postsArr = ['id','标题','所属吧','楼主id','发帖时间','置顶','加精','状态','内容','楼主昵称','吧主','操作'];
var postReply = ['id','所属帖子id','楼层数','发布时间','内容','发布者id','状态','昵称','操作'];
var barsArr = ['id','barName','master','createTime','themeBelong','concernNum','barDescript','barImg','creatorId','status'];
var barAttentionArr = ['id','userId','barId','barName','attentionTime','status'];
var applyBuildBarArr = ['id','吧名','所属主题','申请者id','申请时间','操作'];
var reportArr = ['id','帖子id','楼层数','举报内容','举报者id','被举报者id','举报时间','状态','操作'];
var userApply = ['id','申请者id','内容','时间','状态','操作'];

(function(){
    if(sessionStorage.getItem('admin') == null){
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
        var reason = data.status == 1 ? '请输入您的禁言理由' : '请输入您的解除禁言的理由';
        var msg = prompt(reason);
        if(msg == null || msg == ''){
            return ;
        }
        changeUserStatus(data.username, data.status, msg);
    });
    tdOption.append(aOption);
    tr.append(tdOption);
    table.append(tr);
    return table;
}

//禁言接口
function changeUserStatus(id, currStatus, msg){
    var nextStatus;
    currStatus = Number(currStatus);
    if(currStatus == 1){
        nextStatus = 0;
    }else{
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
        success: function(result){
            console.log(result);
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

//主题分类区域
function createBarSortItem(){
    var container = $('<div></div>');
    var nameInput = $('<input />');
    nameInput.attr('placeholder','主题名');
    nameInput.attr('id','inputSortName');
    nameInput.attr('maxlength',25);
    var label = $('<label />');
    label.attr('for','inputSortName');
    label.html('主题名:');
    var search = $('<button></button>');
    search.html('添加');
    search.attr('id','search');
    search.click(addBarSort);
    container.append(label);
    container.append(nameInput);
    container.append(search);
    var indexComponent = createIndex();
    container.append(indexComponent);
    getData(0);
    return container;
}
//添加主题分类接口
function addBarSort(){
    var sortName = $('#inputSortName').val();
    if(sortName.trim() == ''){
        alert('不能为空');
        return ;
    }
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/addBarSort.php',
        async: true,
        data: {
            sortName: sortName
        },
        success: function(result){
            if(result == 'isExist'){
                alert('该主题分类已存在');
            }else if(result == 'success'){
                alert('创建成功');
                window.location.reload();
            }else{
                console.log(result);
                alert('创建失败');
            }
        }
    });
}

//申请建吧区域
function createApplyBarItem(){
    var container = $('<div></div>');
    var indexComponent = createIndex();
    container.append(indexComponent);
    getData(0);
    return container;
}

function agreeApply(){
    var id = $(this).parent().siblings().first().html();
    id = Number(id);
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/agreeBuildBar.php',
        async: true,
        data: {
            id: id
        },
        success: function(result){
            if(result == 'success'){
                alert('创建成功');
                window.location.reload();
            }else{
                alert('创建失败');
                window.location.reload();
            }
        }
    });
}

function refuseApply(msg){
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
        success: function(result){
            if(result == 'success'){
                alert('拒绝成功');
                window.location.reload();
            }else{
                console.log(result);
                alert('未知错误');
                window.location.reload();
            }
        }
    });
}

//举报区域
function createReportItem(){
    var container = $('<div></div>');
    var indexComponent = createIndex();
    container.append(indexComponent);
    getData(0);
    return container;
}

function changeReportStatus(){
    var id = $(this).parent().siblings().first().html();
    id = Number(id);
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changeReportStatus.php',
        async: true,
        data: {
            id: id
        },
        success: function(result){
            if(result == 'success'){
                alert('完成');
                window.location.reload();
            }else{
                console.log(result);
                alert('未知错误');
                window.location.reload();
            }
        }
    });
}

//用户申请区域
function createUserApplyItem(){
    var container = $('<div></div>');
    var indexComponent = createIndex();
    container.append(indexComponent);
    getData(0);
    return container;
}

function changeUserApplyStatus(){
    var id = $(this).parent().siblings().first().html();
    id = Number(id);
    $.ajax({
        type: 'post',
        url: domain + '/pro/php/changeUserApplyStatus.php',
        async: true,
        data: {
            id: id
        },
        success: function(result){
            if(result == 'success'){
                alert('完成');
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
function getData(currIndex){
    var type = $('#rightContainer').attr('type');
    type = Number(type);
    var fileName;
    var requsetData = {};
    requsetData.currIndex = currIndex;
    //这个变量保存操作的那个单元格，如果没有就不动，以undefind保存，下面进行判断
    var optionEle;
    switch(type){
        case 5:
            //主题分类
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
            agreeOption.css('margin-right','8px');
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
                alert('没有记录');
            }else{
                freshTable(data, currIndex, optionEle);
            }
        }
    });
}

function freshTable(data, currIndex, optionEle){
	var pageNum = data.totalNum / data.pageItemNum;
	//是否有页面的内容是只有一部分的
	var isComplete = data.totalNum % data.pageItemNum == 0 ? true: false;
	pageNum = isComplete ? pageNum : Math.floor(pageNum) + 1;
	if(pageNum == 0){
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

function createTable(data, optionEle){
    var headData = [];
    var type = $('#rightContainer').attr('type');
    type = Number(type);
    switch(type){
        case 5:
            //主题分类
            headData = sortBarArr;
            break;
        case 2:
            //主题分类
            headData = applyBuildBarArr;
            break;
        case 1:
            //举报
            headData = reportArr;
            break;
        case 7:
            headData = userApply;
            break;
        default:
            break;
    }
    var table = $('<table></table>');
    var headTr = $('<tr></tr>');
    for(var i = 0;i<headData.length;i++){
        var headTd = $('<td></td>');
        headTd.html(headData[i]);
        headTr.append(headTd);
    }
    table.append(headTr);
    
    for(var j=0;j<data.value.length;j++){
        var tr = $('<tr></tr>');
        for(var item in data.value[j]){
            var td = $('<td></td>');
            td.html(data.value[j][item]);
            tr.append(td);
        }
        if(optionEle != undefined){
            var optionEleClone = optionEle.clone();
            tr.append(optionEleClone);
        }

        table.append(tr);
    }
    return table;
}

function initIndex(){
	var maxShowIndex = 10;
	var currIndex = Number($('#rightContainer').attr('index'));
	var totalNum = Number($('#rightContainer').attr('totalpagenum'));
	var halfIndexNum = Math.floor(maxShowIndex / 2) + 1;
	if(currIndex == 0){
		$('#prevPageBtn').css('display','none');
		$('#firstPageBtn').css('display','none');
	}else{
		$('#prevPageBtn').css('display','inline-block');
		$('#firstPageBtn').css('display','inline-block');
	}
	if(currIndex == totalNum){
		$('#nextPageBtn').css('display','none');
		$('#lastPageBtn').css('display','none');
	}else{
		$('#nextPageBtn').css('display','inline-block');
		$('#lastPageBtn').css('display','inline-block');
	}
	$('.index_item').removeClass('currIndex');
	
	if(totalNum < maxShowIndex){
		$('.index_item').each(function(index){
			if(index > totalNum){
				$(this).css('display','none');
			}
			if(index == currIndex){
				$(this).addClass('currIndex');
			}
		});
	}else{
		if(currIndex < halfIndexNum){
			$('.index_item').each(function(index){
				$(this).html(index + 1);
			});
		}else if(currIndex > totalNum - halfIndexNum){
			$('.index_item').each(function(index){
				$(this).html(totalNum + 1 - (maxShowIndex - 1 - index));
			});
		}else{
			$('.index_item').each(function(index){
				$(this).html(currIndex + 1 - (halfIndexNum - index - 1));
			});
		}
		$('.index_item').each(function(index){
			if($(this).html() == currIndex + 1){
				$(this).addClass('currIndex');
			}
		});
	}
}
//创建分页按钮组件
function createIndex(){
    var $indexUl = $('<ul></ul>');
	$indexUl.addClass('index');
	var $replyPagingFirstBtnLi = $('<li></li>');
	$replyPagingFirstBtnLi.addClass('paging_btn');
	$replyPagingFirstBtnLi.addClass('first_btn');
    $replyPagingFirstBtnLi.html('首页');
    $replyPagingFirstBtnLi.attr('id','firstPageBtn');
	var $replyPagingPrevBtnLi = $('<li></li>');
	$replyPagingPrevBtnLi.addClass('paging_btn');
	$replyPagingPrevBtnLi.addClass('prev_btn');
    $replyPagingPrevBtnLi.html('上一页');
    $replyPagingPrevBtnLi.attr('id','prevPageBtn');
	$indexUl.append($replyPagingFirstBtnLi);
	$indexUl.append($replyPagingPrevBtnLi);
	for(var i=0;i<10;i++){
		var $replyPagingIndexBtnLi = $('<li></li>');
		$replyPagingIndexBtnLi.addClass('index_item');
		$replyPagingIndexBtnLi.html(i+1);
		$indexUl.append($replyPagingIndexBtnLi);
	}
	var $replyPagingNextBtnLi = $('<li></li>');
	$replyPagingNextBtnLi.addClass('paging_btn');
	$replyPagingNextBtnLi.addClass('next_btn');
    $replyPagingNextBtnLi.html('下一页');
    $replyPagingNextBtnLi.attr('id','nextPageBtn');
	var $replyPagingLastBtnLi = $('<li></li>');
	$replyPagingLastBtnLi.addClass('paging_btn');
	$replyPagingLastBtnLi.addClass('last_btn');
    $replyPagingLastBtnLi.html('尾页');
    $replyPagingLastBtnLi.attr('id','lastPageBtn');
	$indexUl.append($replyPagingNextBtnLi);
    $indexUl.append($replyPagingLastBtnLi);
    return $indexUl;
}

function initIndexBtnPressEvent(){
    $('#prevPageBtn').click(function(){
		prevPage();
	});
	$('#nextPageBtn').click(function(){
		nextPage();
	});
	$('#firstPageBtn').click(function(){
		firstPage();
	});
	$('#lastPageBtn').click(function(){
		lastPage();
	});
	$('.index_item').click(function(){
		var index = Number($(this).html()) - 1;
		getData(index);
	});
}

function prevPage(){
	var currIndex = Number($('#rightContainer').attr('index'));
	if(currIndex > 0){
		getData(--currIndex);
	}
}

function nextPage(){
	var currIndex = Number($('#rightContainer').attr('index'));
	var totalNum = Number($('#rightContainer').attr('totalPageNum'));
	if(currIndex < totalNum){
		getData(++currIndex);
	}
}

function firstPage(){
	var currIndex = Number($('#rightContainer').attr('index'));
	if(currIndex != 0){
		getData(0);
	}
}

function lastPage(){
	var currIndex = Number($('#rightContainer').attr('index'));
	var totalNum = Number($('#rightContainer').attr('totalPageNum'));
	if(currIndex != totalNum){
		getData(totalNum);
	}
}

function changeFeature(featureNum){
    var headArr = [];
    var content;
    $('#rightContainer').children().remove();
    $('#rightContainer').attr('type', featureNum);
    $('#rightContainer').attr('index', 0);
    $('#rightContainer').attr('totalPageNum', 0);
    switch(featureNum){
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
            return ;
            break;
        case 7:
            content = createUserApplyItem();
            break;
        default:
            break;
    }
    $('#rightContainer').append(content);
    initIndexBtnPressEvent();
}

function initOtherClickEvent(){
    $('.agree_option').click(function(){
        agreeApply.call(this);
    });
    $('.refuse_option').click(function(){
        var msg = prompt('请输入拒绝理由');
        if(msg == null){
            return ;
        }
        refuseApply.call(this, msg);
    });
    $('.report_confirm').click(function(){
        var option = confirm('确认审核完成？');
        if(!option){
            return ;
        }
        changeReportStatus.call(this);
    });
    $('.user_apply_confirm').click(function(){
        var option = confirm('确认审核完成？');
        if(!option){
            return ;
        }
        changeUserApplyStatus.call(this);
    });
}











































































