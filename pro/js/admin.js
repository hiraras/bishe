var featureNum = 0;
var domain = 'http://localhost';
var userInfoArr = ['id','username','nickname','createDate','headImg','exp','address','age','school'];
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
    $.ajax({
        type: 'get',
        url: domain + '/pro/php/getUserMsg.php',
        async: true,
        data: {
            username: '17888888888'
        },
        success: function(result){
            try{
                var data = JSON.parse(result);
            }catch(e){
                console.log(e);
            }
            console.log(data);
        }
    });
}

function createUserMsgItem(headData,data){
    var rowNum = 10;
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
    table.append(tr);
    return table;
}

function changeFeature(featureNum){
    var headArr = [];
    $('#rightContainer').children().remove();

    switch(featureNum){
        case 0:
            headArr = userInfoArr;
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
    var table = createUserMsgItem(headArr, data);
    $('#rightContainer').append(table);
}












































































