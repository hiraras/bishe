<?php
require "connect.php";
$userId = $_GET['userId'];
$indexNum = $_GET['indexNum'];
$everyPageItemNum = 6;
$dataIndex = $indexNum*$everyPageItemNum;
$sql = "select a.creatorNickName,a.content,a.createTime,a.postBelongId from post_reply as a where a.creatorId='$userId' and a.status=1 union select b.replyerNickName,b.content,b.replyTime,b.postBelongId from reply_to_reply as b where b.replyerId='$userId' and b.status=1 order by createTime DESC limit $dataIndex,$everyPageItemNum";
$sql2 = "select a.creatorNickName,a.content,a.createTime from post_reply as a where a.creatorId='$userId' and a.status=1 union select b.replyerNickName,b.content,b.replyTime from reply_to_reply as b where b.replyerId='$userId' and b.status=1";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$replyTotalNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = array();
while($row = mysql_fetch_assoc($result)){
    $postId = $row['postBelongId'];
	$sql3 = "select c.barBelong,c.creatorNickName,c.postName from posts as c where id='$postId' and status = 1";
	$result3 = mysql_query($sql3);
	$row2 = mysql_fetch_assoc($result3);
    $row['barBelong'] = $row2['barBelong'];
    $row['creatorNickName'] = $row2['creatorNickName'];
    $row['postName'] = $row2['postName'];
	array_push($arr,$row);
}
class ResultData{
	var $value;
	var $totalNum;
	var $pageItemNum;
}
$data = new ResultData();
$data->value = $arr;
$data->totalNum = $replyTotalNum;
$data->pageItemNum = $everyPageItemNum;
echo json_encode($data);
mysql_close($con);
?>