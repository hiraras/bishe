<?php
$userId = $_POST["userId"];
$postId = $_POST["postId"];
require "connect.php";
$now = date("Y-m-d H:i:s");
$sql = "insert into agree_post (agreeId,postId,agreeTime) values('$userId','$postId','$now')";
$result = mysql_query($sql);
$num = mysql_affected_rows();
if($num == 1){
    $sql2 = "select * from posts where id = '$postId'";
    $result2 = mysql_query($sql2);
    $row2 = mysql_fetch_assoc($result2);
    $agreeNum = $row2['agreeNum'];
    $agreeNum += 1;
    $sql3 = "UPDATE posts SET agreeNum = '$agreeNum' where id = '$postId'";
    $result3 = mysql_query($sql3);
    echo 'success';
}else{
    echo 'fail';
}

mysql_close($con);
?>