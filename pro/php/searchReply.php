<?php
require "connect.php";
$postId = $_GET['postId'];
$position = $_GET['position'];
if($position == ''){
    $sql = "select * from post_reply where postBelongId='$postId' ORDER BY position ASC";
}else{
    $sql = "select * from post_reply where postBelongId='$postId' and position = '$position'";
}
$result = mysql_query($sql);
class ResultData{
    var $value;
    var $result;
}
$resultData = new ResultData();
$replyNum = mysql_num_rows($result);
$replyData = array();
if($replyNum == 0){
    $resultData->value = null;
    $resultData->result = 'notExist';
}else{
    while($row = mysql_fetch_assoc($result)){
        $userId = $row['creatorId'];
        //获得头像
        $sql2 = "select headImg,nickname from usermsg where username='$userId'";
        $result2 = mysql_query($sql2);
        $row2 = mysql_fetch_assoc($result2);
        $row['headImg'] = $row2['headImg'];
        $row['nickname'] = $row2['nickname'];
        array_push($replyData, $row);
    }
    $resultData->value = $replyData;
    $resultData->result = 'success';
}

echo json_encode($resultData);
mysql_close($con);
?>