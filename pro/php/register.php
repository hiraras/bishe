<?php
$username = $_POST["username"];
$psw = $_POST["psw"];
$nickname = $_POST["nickname"];
require "connect.php";
$psw = md5($psw);
$sql1 = "select * from login where username='$username'";
$result1 = mysql_query($sql1);
$num1 = mysql_num_rows($result1);
if($num1 >= 1){
	//用户已存在
	echo 100;
}else{
	$sql2 = "insert into login (username,psw,level,status) values ('$username','$psw','1','1')";
	$result2 = mysql_query($sql2);
	//获得上一次操作数据库时，影响的记录数，不需要参数
	$num2 = mysql_affected_rows();
	$now = date("Y-m-d H:i:s");
	$sql3 = "insert into userMsg (username,nickname,createDate) values ('$username','$nickname','$now')";
	$result3 = mysql_query($sql3);
	//获得上一次操作数据库时，影响的记录数，不需要参数
	$num3 = mysql_affected_rows();
	if($num2 == 1 && $num3 == 1){
		//成功
		echo 101;
	}else{
		//失败
		$sql4 = "delete from login where username='$username'";
		mysql_query($sql4);
		$sql5 = "delete from userMsg where username='$username'";
		mysql_query($sql5);
		echo 102;
	}
}
mysql_close($con);
?>