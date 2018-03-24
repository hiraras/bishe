<?php
$postId = $_POST["postId"];
$content = $_POST["content"];
$position = $_POST["position"];
$replyerId = $_POST["replyerId"];
$replyerNickName = $_POST["replyerNickName"];
$replyerHeadImg = $_POST["replyerHeadImg"];
require "connect.php";
$now = date("Y-m-d H:i:s");
$sql = "insert into reply_to_reply (postBelongId,position,replyTime,replyerId,replyerNickName,replyerHeadImg,content) values ('$postId','$position','$now','$replyerId','$replyerNickName','$replyerHeadImg','$content')";
$result = mysql_query($sql);
$num = mysql_affected_rows();
if($num == 1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>