<?php
$username = $_POST['user'];
$password = $_POST['psw'];
$password = md5($password);
require "connect.php";
$sql1 = "select * from login where username='$username'";
$result1 = mysql_query($sql1);
class ResultData{
	var $value;
	var $data;
}
$data = new ResultData();
$data->data = null;
//$data = mysql_fetch_row($result1);
//将对象转化为json
//$jsonData = json_encode($data);
//获取select语句查询到的行的数量
$num = mysql_num_rows($result1);
if($num >= 1){
	$sql2 = "select username,level,status from login where username='$username' and psw='$password'";
	$result2 = mysql_query($sql2);
	$num2 = mysql_num_rows($result2);
	//$data2 = mysql_fetch_field($result2);
	//echo json_encode($data2);
	if($num2 != 0){
		$data->data = mysql_fetch_assoc($result2);
		if($data->data['level'] == 1){
			//普通用户，status为1
			$data->value = 'normal';
		}else if($data->data['level'] == 2){
			//管理员，status为2
			$data->value = 'admin';
		}
	}else{
		//用户名或密码错误
		$data->value = 0;
	}
}else{
	//用户不存在
	$data->value = 2;
}
echo json_encode($data);
mysql_close($con);
?>