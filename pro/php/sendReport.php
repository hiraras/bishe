<?php
$postId = $_POST["postId"];
$content = $_POST["content"];
$position = $_POST["position"];
$reporterId = $_POST["reporterId"];
$reportederId = $_POST["reportederId"];
require "connect.php";
$now = date("Y-m-d H:i:s");
$sql = "insert into report (postId,position,content,reporterId,reportederId,reportTime) values ('$postId','$position','$content','$reporterId','$reportederId','$now')";
$result = mysql_query($sql);
$num = mysql_affected_rows();
if($num == 1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>