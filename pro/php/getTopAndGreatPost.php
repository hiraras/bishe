<?php
require "connect.php";
$barName = $_GET['barName'];
$sql = "select * from posts where barBelong='$barName' and (isTop=1 or isGreat=1) and status = 1 ORDER BY isTop DESC";
$result = mysql_query($sql);
$arr = array();
while($row = mysql_fetch_assoc($result)){
	$postId = $row['id'];
	$sql3 = "select * from post_reply where postBelongId='$postId' and status = 1";
	$result3 = mysql_query($sql3);
	$replyNum = mysql_num_rows($result3);
	$row['replyNum'] = $replyNum;
	$username = $row['creatorId'];
	$sql4 = "select headImg,nickname from usermsg where username='$username'";
	$result4 = mysql_query($sql4);
	$row2 = mysql_fetch_assoc($result4);
	$row['nickname'] = $row2['nickname'];
	array_push($arr,$row);
}
class ResultData{
    var $value;
    var $result;
}
$data = new ResultData();
$data->value = $arr;
$data->result = true;
echo json_encode($data);
mysql_close($con);
?>