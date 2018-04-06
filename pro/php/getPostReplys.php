<?php
require "connect.php";
$postId = $_GET['postId'];
$indexNum = $_GET['indexNum'];
$everyPageItemNum = 2;
//需要和getReplyToReplyMsg.php中的$everyPageItemNum相等
$showReplyToReplyNum = 6;
$dataIndex = $indexNum*$everyPageItemNum;
//获得回复
$sql = "select * from post_reply where postBelongId='$postId' and status = 1 ORDER BY position ASC limit $dataIndex,$everyPageItemNum";
$sql2 = "select * from post_reply where postBelongId='$postId' and status = 1";
$result = mysql_query($sql);
$result2 = mysql_query($sql2);
$postReplyNum = mysql_num_rows($result2);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
class ResultData{
	var $value;
	var $totalNum;
	var $pageItemNum;
}
$replyArr = array();
while($row = mysql_fetch_assoc($result)){
	$replyToReplyData = new ResultData();
	$replyToReplyArr = array();
	$position = $row['position'];
	//获得回复的回复
	$sql3 = "select * from reply_to_reply where postBelongId='$postId' and position='$position' and status = 1 ORDER BY replyTime ASC limit 0,$showReplyToReplyNum";
	$sql4 = "select * from reply_to_reply where postBelongId='$postId' and position='$position' and status = 1";
	$result3 = mysql_query($sql3);
	$result4 = mysql_query($sql4);
	$userId = $row['creatorId'];
	//获得头像
	$sql5 = "select headImg,nickname from usermsg where username='$userId'";
	$result5 = mysql_query($sql5);
	$row3 = mysql_fetch_assoc($result5);
	$row['headImg'] = $row3['headImg'];
	$row['nickname'] = $row3['nickname'];
	$replyToReplyNum = mysql_num_rows($result4);
	while($row2 = mysql_fetch_assoc($result3)){
		$username = $row2['replyerId'];
		$sql6 = "select headImg,nickname from usermsg where username='$username'";
		$result6 = mysql_query($sql6);
		$row4 = mysql_fetch_assoc($result6);
		$row2['nickname'] = $row4['nickname'];
		$row2['headImg'] = $row4['headImg'];
		array_push($replyToReplyArr,$row2);
	}
	$replyToReplyData->value = $replyToReplyArr;
	$replyToReplyData->totalNum = $replyToReplyNum;
	$replyToReplyData->pageItemNum = $showReplyToReplyNum;
	$row['replyToReplyData'] = $replyToReplyData;
	array_push($replyArr,$row);
}
$replyData = new ResultData();
$replyData->value = $replyArr;
$replyData->totalNum = $postReplyNum;
$replyData->pageItemNum = $everyPageItemNum;
echo json_encode($replyData);
mysql_close($con);
?>