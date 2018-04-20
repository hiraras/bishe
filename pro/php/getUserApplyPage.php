<?php
require "connect.php";
$currIndex = $_GET['currIndex'];
$everyPageItemNum = 3;
$dataIndex = $currIndex*$everyPageItemNum;
$sql = "select * from user_apply ORDER BY status DESC limit $dataIndex,$everyPageItemNum";
$sql2 = "select * from user_apply";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$totalNum = mysql_num_rows($result2);
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
    var $result;
}
$data = new ResultData();
if($totalNum == 0){
    $data->value = null;
    $data->totalNum = $totalNum;
    $data->pageItemNum = $everyPageItemNum;
    $data->result = 'none';
}else{
    $data->value = $arr;
    $data->totalNum = $totalNum;
    $data->pageItemNum = $everyPageItemNum;
    $data->result = 'success';
}

echo json_encode($data);
mysql_close($con);
?>