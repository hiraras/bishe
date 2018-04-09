<?php
require "connect.php";
$postId = $_POST['postId'];
$sql = "UPDATE posts SET status=2 WHERE id = '$postId'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>