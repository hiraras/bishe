<?php
$nickname = $_GET["nickname"];
require "connect.php";
$sql1 = "select * from usermsg where nickname='$nickname'";
$result1 = mysql_query($sql1);
$num1 = mysql_num_rows($result1);
if($num1 >= 1){
	//用户已存在
	echo 100;
}else{
	//用户名可用
	echo 101;
}
mysql_close($con);
?>