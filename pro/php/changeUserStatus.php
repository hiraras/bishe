<?php
require "connect.php";
$userId = $_POST['userId'];
$status = $_POST['status'];
$msg = $_POST['msg'];
$sql = "UPDATE login SET status='$status' WHERE username = '$userId'";
$result = mysql_query($sql);
$num = mysql_affected_rows();
if($status == 1){
    $informContent = "因为:".$msg."您已解除禁言";
}else{
    $informContent = "因为:".$msg.",您已被禁言了";
}
$now = date("Y-m-d H:i:s");
$informSql = "insert into inform (informer, informederId, informTime, informContent) values (0, '$userId' , '$now', '$informContent')";
$informResult = mysql_query($informSql);
if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>