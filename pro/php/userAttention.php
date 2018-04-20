<?php
require "connect.php";
$userId = $_POST['userId'];
$username = $_POST['username'];
$status = $_POST['status'];
$sql = "select * from user_attention WHERE attentionId = '$username' and attentionedId = '$userId'";
$sql3 = "select * from usermsg WHERE username = '$username'";
$result3 = mysql_query($sql3);
$row3 = mysql_fetch_assoc($result3);
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
if($status == 1){
    $informContent = "您被".$row3['nickname']."关注了";
    $informSql = "insert into inform (informer, informederId, informTime, informContent) values (0, '$userId' , '$now', '$informContent')";
    $informResult = mysql_query($informSql);
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