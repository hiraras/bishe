<?php
require "connect.php";
$themeName = $_GET['themeName'];
$indexNum = $_GET['indexNum'];
$everyPageItemNum = 2;
$dataIndex = $indexNum*$everyPageItemNum;
$sql = "select * from bars where themeBelong='$themeName' ORDER BY concernNum DESC limit $dataIndex,$everyPageItemNum";
$sql2 = "select * from bars where themeBelong='$themeName'";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$barTotalNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = array();
while($row = mysql_fetch_assoc($result)){
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