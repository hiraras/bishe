<?php
require "connect.php";
$hotStandrad = 50000;
$barNum = 21;
$sql = "select * from bars where concernNum>'$hotStandrad' ORDER BY concernNum DESC limit $barNum";
$result = mysql_query($sql);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = array();
while($row = mysql_fetch_assoc($result)){
	array_push($arr,$row);
}
echo json_encode($arr);
mysql_close($con);
?>