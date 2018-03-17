<?php
require "connect.php";
$barName = $_GET['barName'];
$sql = "select bars.*,count(*) as postNum from bars,posts where bars.barName = '$barName' and posts.barBelong = '$barName'";
$result = mysql_query($sql);
$num = mysql_num_rows($result);
$arr = array();

class ResultData{
	var $code;
	var $data;
}
$data = new ResultData();
if($num == 0){
	//没有该吧，进行模糊查询
	$sql2 = "select * from bars where barName LIKE '%$barName%'";
	$result2 = mysql_query($sql2);
	$num2 = mysql_num_rows($result2);
	if($num2 == 0){
		//即便是模糊查询也没有
		$data->code = 2;
		$data->data = null;
	}else{
		$data->code = 1;
		$data->data = null;
	}
}else{
	$data->code = 0;
	$data->data = mysql_fetch_assoc($result);
}
echo json_encode($data);
mysql_close($con);
?>