<?php
require "connect.php";
$hotStandrad = 1;
$barNum = 21;
$num = 0;
$sql = "select * from bars where status = 1 ORDER BY concernNum DESC";
$result = mysql_query($sql);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引

$arr = array();
while($row = mysql_fetch_assoc($result)){
	$barName = $row['barName'];
	$sql3 = "select * from posts where barBelong='$barName' and status = 1";
	$result3 = mysql_query($sql3);
	$postNum = mysql_num_rows($result3);
	if($postNum < $hotStandrad){
		continue;
	}
	$row['postNum'] = $postNum;
	$sql4 = "select * from bar_attention where barName='$barName' and status = 1";
	$result4 = mysql_query($sql4);
	$attentionNum = mysql_num_rows($result4);
	$row['attentionNum'] = $attentionNum;
	array_push($arr,$row);
	$num ++;
	if($num >= $barNum){
		break;
	}
}
echo json_encode($arr);
mysql_close($con);
?>