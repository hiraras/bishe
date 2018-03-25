<?php
$postId = $_POST["postId"];
$creatorId = $_POST["creatorId"];
$nickName = $_POST["nickName"];
$replyContent = $_POST["replyContent"];
require "connect.php";
$now = date("Y-m-d H:i:s");
$sql = "select position from post_reply where postBelongId = '$postId' and status = 1 order by position DESC";
$result = mysql_query($sql);
$num = mysql_num_rows($result);
if($num == 0){
    //没有回复
    $replyPosition = 1;
}else{
    $positionData = mysql_fetch_assoc($result);
    $replyPosition = $positionData['position'] + 1;
}
$sql2 = "insert into post_reply (postBelongId,position,createTime,content,creatorNickName,creatorId) values ('$postId','$replyPosition','$now','$replyContent','$nickName','$creatorId')";
$result2 = mysql_query($sql2);
//获得上一次操作数据库时，影响的记录数，不需要参数
$num2 = mysql_affected_rows();
if($num2 == 1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>