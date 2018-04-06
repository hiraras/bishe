<?php
require "connect.php";
$postId = $_POST['postId'];
$status = $_POST['status'];
if($status == 0){
    $status = 1;
}else{
    $status = 0;
}
$sql = "UPDATE posts SET isGreat = '$status' WHERE id = '$postId'";
$result = mysql_query($sql);
$num = mysql_affected_rows();
if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>