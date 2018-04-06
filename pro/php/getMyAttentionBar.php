<?php
$userId = $_GET['userId'];
require "connect.php";
$sql = "select * from bar_attention where status=1 and userId='$userId'";
$result = mysql_query($sql);
$num = mysql_num_rows($result);
$arr = array();
class ResultData{
	var $result;
    var $data;
    var $num;
}
$data = new ResultData();
while($row = mysql_fetch_assoc($result)){
    array_push($arr, $row);
}
$data->data = $arr;
$data->num = $num;
$data->result = true;
echo json_encode($data);
mysql_close($con);
?>