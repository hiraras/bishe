<?php
require "connect.php";
$postId = $_POST['postId'];
$position = $_POST['position'];
$sql = "UPDATE post_reply SET status=0 WHERE postBelongId = '$postId' and position = '$position'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>