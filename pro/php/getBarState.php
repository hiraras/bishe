<?php
require "connect.php";
$barName = $_GET['barName'];
$userId = $_GET['userId'];
$sql = "select * from bars where barName = '$barName' and status = 1";
//$sql = "select bars.*,count(*) as postNum from bars,posts where bars.barName = '$barName' and posts.barBelong = '$barName' and posts.status = 1";
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
	$sql2 = "select * from bars where barName LIKE '%$barName%' and status = 1";
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
	$row = mysql_fetch_assoc($result);
	$sql3 = "select * from posts where barBelong='$barName' and status = 1";
	$result3 = mysql_query($sql3);
	$postNum = mysql_num_rows($result3);
	$row['postNum'] = $postNum;
	$sql4 = "select * from bar_attention where barName='$barName' and status = 1";
	$result4 = mysql_query($sql4);
	$attentionNum = mysql_num_rows($result4);
	$row['attentionNum'] = $attentionNum;
	$sql5 = "select * from bar_attention where barName='$barName' and userId='$userId' and status = 1";
	$result5 = mysql_query($sql5);
	$num2 = mysql_num_rows($result5);
	if($num2 == 1){
		$row['isAttention'] = true;
	}else{
		$row['isAttention'] = false;
	}
	$data->data = $row;
}
echo json_encode($data);
mysql_close($con);
?>