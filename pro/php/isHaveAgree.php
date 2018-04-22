<?php
$userId = $_GET["userId"];
$postId = $_GET["postId"];
require "connect.php";
$sql = "select * from agree_post where agreeId='$userId' and postId = '$postId'";
$result = mysql_query($sql);
$num = mysql_num_rows($result);
if($num == 1){
    echo json_encode(true);
}else{
    echo json_encode(false);
}

mysql_close($con);
?>