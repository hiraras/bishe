<?php
require "connect.php";
$themeName = $_GET['themeName'];
$indexNum = $_GET['indexNum'];
$everyPageItemNum = 14;
$dataIndex = $indexNum*$everyPageItemNum;
$sql = "select * from bars where themeBelong='$themeName' and status = 1 ORDER BY concernNum DESC limit $dataIndex,$everyPageItemNum";
$sql2 = "select * from bars where themeBelong='$themeName' and status = 1";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$barTotalNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = array();
$row;
while($row = mysql_fetch_assoc($result)){
	$barName = $row['barName'];
	$sql3 = "select * from posts where barBelong='$barName' and status = 1";
	$result3 = mysql_query($sql3);
	$postNum = mysql_num_rows($result3);
	$row['postNum'] = $postNum;
	$sql4 = "select * from bar_attention where barName='$barName' and status = 1";
	$result4 = mysql_query($sql4);
	$attentionNum = mysql_num_rows($result4);
	$row['attentionNum'] = $attentionNum;
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