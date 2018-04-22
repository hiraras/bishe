<?php
$postId = $_POST["postId"];
$creatorId = $_POST["creatorId"];
$nickName = $_POST["nickName"];
$replyContent = $_POST["replyContent"];
$position = $_POST["position"];
$type = $_POST["type"];
require "connect.php";
$now = date("Y-m-d H:i:s");
if($type == 0){
    $sql = "UPDATE posts SET postContent = '$replyContent',createTime = '$now' where id = '$postId'";
    $sql3 = "select postContent as currContent,createTime from posts where id = '$postId'";
}else{
    $sql = "UPDATE post_reply SET content = '$replyContent',createTime = '$now' where postBelongId = '$postId' and position = '$position'";
    $sql3 = "select content as currContent,createTime from post_reply where postBelongId = '$postId' and position = '$position'";
}
$result3 = mysql_query($sql3);
$row3 = mysql_fetch_assoc($result3);
$currContent = $row3['currContent'];
$createTime = $row3['createTime'];
$result = mysql_query($sql);
$num = mysql_affected_rows();
if($num == 1){
    $sql2 = "insert into content_edit (editor,editContent,editTime,postId,position) values ('$creatorId','$currContent','$createTime','$postId','$position')";
    $result2 = mysql_query($sql2);
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>