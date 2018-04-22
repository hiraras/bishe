<?php
require "connect.php";
$userId = $_GET['userId'];
$indexNum = $_GET['indexNum'];
$everyPageItemNum = 3;
$dataIndex = $indexNum*$everyPageItemNum;
$sql = "select * from inform where informederId='$userId' ORDER BY status DESC,informTime DESC limit $dataIndex,$everyPageItemNum";
$sql2 = "select * from inform where informederId='$userId'";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$informTotalNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = array();
while($row = mysql_fetch_assoc($result)){
    $informer = $row['informer'];
    if($informer == '0'){
        $row['informNickname'] = '管理员';
	    array_push($arr,$row);
    }else{
        $sql3 = "select * from usermsg where username='$informer'";
        $result3 = mysql_query($sql3);
        $informData = mysql_fetch_assoc($result3);
        $row['informNickname'] = $informData['nickname'];
        array_push($arr,$row);
    }
}
class ResultData{
	var $value;
	var $totalNum;
	var $pageItemNum;
	var $result;
}
$data = new ResultData();
if($informTotalNum == 0){
    $data->value = null;
    $data->totalNum = $informTotalNum;
    $data->pageItemNum = $everyPageItemNum;
    $data->result = 'none';
}else{
    $data->value = $arr;
    $data->totalNum = $informTotalNum;
    $data->pageItemNum = $everyPageItemNum;
    $data->result = 'success';
}
echo json_encode($data);
mysql_close($con);
?>