<?php
require "connect.php";
$barName = $_GET['barName'];
$indexNum = $_GET['indexNum'];
$everyPageItemNum = 16;
$dataIndex = $indexNum*$everyPageItemNum;
$sql = "select * from bars where barName LIKE '%$barName%' ORDER BY concernNum DESC limit $dataIndex,$everyPageItemNum";
$sql2 = "select * from bars where barName LIKE '%$barName%'";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$barTotalNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = array();
while($row = mysql_fetch_assoc($result)){
	$itemBarName = $row['barName'];
	$sql3 = "select * from posts where barBelong='$itemBarName' and status = 1";
	$result3 = mysql_query($sql3);
	$postNum = mysql_num_rows($result3);
	$row['postNum'] = $postNum;
	array_push($arr,$row);
}
class ResultData{
	var $value;
	var $totalNum;
	var $pageItemNum;
}
$data = new ResultData();
$data->value = $arr;
$data->totalNum = $barTotalNum;
$data->pageItemNum = $everyPageItemNum;
echo json_encode($data);
mysql_close($con);
?>