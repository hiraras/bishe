<?php
require "connect.php";
$postId = $_GET['postId'];
$indexNum = $_GET['indexNum'];
$position = $_GET['position'];
//需要和getPostReplys.php中的$showReplyToReplyNum = 6;相等
$everyPageItemNum = 2;
$dataIndex = $indexNum*$everyPageItemNum;
$sql = "select * from reply_to_reply where postBelongId='$postId' and position = '$position' and status = 1 ORDER BY replyTime ASC limit $dataIndex,$everyPageItemNum";
$sql2 = "select * from reply_to_reply where postBelongId='$postId' and position = '$position' and status = 1";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$replyToReplyTotalNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = array();
while($row = mysql_fetch_assoc($result)){
	$username = $row['replyerId'];
	$sql3 = "select headImg,nickname from usermsg where username='$username'";
	$result3 = mysql_query($sql3);
	$row2 = mysql_fetch_assoc($result3);
	$row['nickname'] = $row2['nickname'];
	$row['headImg'] = $row2['headImg'];
	array_push($arr,$row);
}
class ResultData{
	var $value;
	var $totalNum;
	var $pageItemNum;
}
$data = new ResultData();
$data->value = $arr;
$data->totalNum = $replyToReplyTotalNum;
$data->pageItemNum = $everyPageItemNum;
echo json_encode($data);
mysql_close($con);
?>