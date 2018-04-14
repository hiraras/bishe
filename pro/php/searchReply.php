<?php
require "connect.php";
$postId = $_GET['postId'];
$position = $_GET['position'];
$sql = "select * from post_reply where postBelongId='$postId' and position = '$position'";
$result = mysql_query($sql);
class ResultData{
    var $value;
    var $result;
}
$resultData = new ResultData();
$replyNum = mysql_num_rows($result);
if($replyNum == 0){
    $resultData->value = null;
    $resultData->result = 'notExist';
}else{
    $replyData = mysql_fetch_assoc($result);
    $userId = $replyData['creatorId'];
    //获得头像
    $sql2 = "select headImg,nickname from usermsg where username='$userId'";
    $result2 = mysql_query($sql2);
    $row2 = mysql_fetch_assoc($result2);
    $replyData['headImg'] = $row2['headImg'];
    $replyData['nickname'] = $row2['nickname'];
    $resultData->value = $replyData;
    $resultData->result = 'success';
}

echo json_encode($resultData);
mysql_close($con);
?>