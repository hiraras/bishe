<?php
require "connect.php";
$userId = $_POST['userId'];
$username = $_POST['username'];
$status = $_POST['status'];
$sql = "select * from user_attention WHERE attentionId = '$username' and attentionedId = '$userId'";
$result = mysql_query($sql);
$num = mysql_num_rows($result);
if($status == 0){
    $status = 1;
}else{
    $status = 0;
}
$now = date("Y-m-d H:i:s");
if($num == 1){
    $sql2 = "UPDATE user_attention SET status = '$status' WHERE attentionId = '$username' and attentionedId = '$userId'";
}else{
    $sql2 = "insert into user_attention (attentionId, attentionedId,attentionTime,status) values ('$username', '$userId', '$now',1)";
}

$result2 = mysql_query($sql2);
$num2 = mysql_affected_rows();
if($num2==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>