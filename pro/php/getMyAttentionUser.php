<?php
$userId = $_GET['userId'];
require "connect.php";
$sql = "select * from user_attention where status=1 and attentionId='$userId'";
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
    $username = $row['attentionedId'];
    $sql2 = "select * from usermsg where username='$username'";
    $result2 = mysql_query($sql2);
    $row2 = mysql_fetch_assoc($result2);
    $row['nickname'] = $row2['nickname'];
    array_push($arr, $row);
}
$data->data = $arr;
$data->num = $num;
$data->result = true;
echo json_encode($data);
mysql_close($con);
?>