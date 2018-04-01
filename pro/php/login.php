<?php
$username = $_POST['user'];
$password = $_POST['psw'];
$password = md5($password);
require "connect.php";
$sql1 = "select * from login where username='$username'";
$result1 = mysql_query($sql1);
//$data = mysql_fetch_row($result1);
//将对象转化为json
//$jsonData = json_encode($data);
//获取select语句查询到的行的数量
$num = mysql_num_rows($result1);
$arr = array();
if($num >= 1){
	$sql2 = "select username,level from login where username='$username' and psw='$password'";
	$result2 = mysql_query($sql2);
	$num2 = mysql_num_rows($result2);
	//$data2 = mysql_fetch_field($result2);
	//echo json_encode($data2);
	if($num2 != 0){
		while($r = mysql_fetch_array($result2)){
			array_push($arr,$r);
		}
		echo json_encode($arr);
//		if($arr[0][1] == 1){
//			//普通用户，status为1
//			echo 11;
//		}else if($arr[0][1] == 2){
//			//管理员，status为2
//			echo 12;
//		}
	}else{
		//用户名或密码错误
		echo 0;
	}
}else{
	//用户不存在
	echo 2;
}

mysql_close($con);
?>