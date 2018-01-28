<?php
$username = $_GET["username"];
require "connect.php";
$sql = "select * from userMsg where username='$username'";
$result = mysql_query($sql);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = mysql_fetch_assoc($result);
echo json_encode($arr);

?>