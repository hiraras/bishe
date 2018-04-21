<?php
require "connect.php";
$indexNum = $_GET['indexNum'];
$userId = $_GET['userId'];
$type = $_GET['type'];
$everyPageItemNum = 3;
$dataIndex = $indexNum*$everyPageItemNum;
if($type == 0){
    $sql = "select * from chat where chatedId = '$userId' and status != 0 ORDER BY status DESC limit $dataIndex,$everyPageItemNum";
    $sql2 = "select * from chat where chatedId = '$userId' and status != 0";
}else if($type == 1){
    $sql = "select * from chat where chatedId = '$userId' and status = 2 ORDER BY chatTime DESC limit $dataIndex,$everyPageItemNum";
    $sql2 = "select * from chat where chatedId = '$userId' and status = 2";
}else{
    $sql = "select * from chat where chatedId = '$userId' and status = 1 ORDER BY chatTime DESC limit $dataIndex,$everyPageItemNum";
    $sql2 = "select * from chat where chatedId = '$userId' and status = 1";
}

$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$totalNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = array();
while($row = mysql_fetch_assoc($result)){
    $chatId = $row['chatId'];
    $sql3 = "select * from usermsg where username = '$chatId'";
    $result3 = mysql_query($sql3);
    $row3 = mysql_fetch_assoc($result3);
    $row['chatNickname'] = $row3['nickname'];
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