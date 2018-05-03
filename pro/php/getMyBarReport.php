<?php
require "connect.php";
$currIndex = $_GET['indexNum'];
$barName = $_GET['barName'];
$everyPageItemNum = 3;
$dataIndex = $currIndex*$everyPageItemNum;
$sql = "select * from report where barBelong = '$barName' ORDER BY status DESC,reportTime DESC limit $dataIndex,$everyPageItemNum";
$sql2 = "select * from report where barBelong = '$barName'";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$totalNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引

$arr = array();
while($row = mysql_fetch_assoc($result)){
    $reporterId = $row['reporterId'];
    $reportederId = $row['reportederId'];
    $postId = $row['postId'];
    $sql3 = "select * from usermsg where username='$reporterId'";
    $result3 = mysql_query($sql3);
    $row3 = mysql_fetch_assoc($result3);
    $row['reporterNickname'] = $row3['nickname'];
    $sql4 = "select * from usermsg where username='$reportederId'";
    $result4 = mysql_query($sql4);
    $row4 = mysql_fetch_assoc($result4);
    $row['reportederNickname'] = $row4['nickname'];
    $sql5 = "select * from posts where id='$postId'";
    $result5 = mysql_query($sql5);
    $row5 = mysql_fetch_assoc($result5);
    $row['postTitle'] = $row5['postName'];
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