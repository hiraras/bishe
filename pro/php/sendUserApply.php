<?php
$applyerId = $_POST["applyerId"];
$content = $_POST["content"];
require "connect.php";
$now = date("Y-m-d H:i:s");
$sql = "insert into user_apply (applyerId, applyContent, applyTime) values ('$applyerId','$content','$now')";
$result = mysql_query($sql);
$num = mysql_affected_rows();
if($num == 1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>