<?php
require "connect.php";
$userId = $_GET['userId'];
$indexNum = $_GET['indexNum'];
$everyPageItemNum = 3;
$dataIndex = $indexNum*$everyPageItemNum;
$sql = "select * from posts where creatorId='$userId' and status = 1 ORDER BY createTime DESC limit $dataIndex,$everyPageItemNum";
$sql2 = "select * from posts where creatorId='$userId' and status = 1";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$barTotalNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = array();
while($row = mysql_fetch_assoc($result)){
	$postId = $row['id'];
	$sql3 = "select * from post_reply where postBelongId='$postId' and status = 1";
	$result3 = mysql_query($sql3);
	$replyNum = mysql_num_rows($result3);
	$row['replyNum'] = $replyNum;
	array_push($arr,$row);
}
class ResultData{
	var $value;
	var $totalNum;
	var $pageItemNum;
	var $result;
}
$data = new ResultData();
if($barTotalNum == 0){
    $data->value = null;
    $data->totalNum = $barTotalNum;
    $data->pageItemNum = $everyPageItemNum;
    $data->result = 'none';
}else{
    $data->value = $arr;
    $data->totalNum = $barTotalNum;
    $data->pageItemNum = $everyPageItemNum;
    $data->result = 'success';
}
echo json_encode($data);
mysql_close($con);
?>