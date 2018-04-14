<?php
require "connect.php";
$postId = $_POST['postId'];
$status = $_POST['status'];
$sql = "UPDATE posts SET status='$status' WHERE id = '$postId'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>