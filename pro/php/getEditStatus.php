<?php
require "connect.php";
$postId = $_GET['postId'];
$position = $_GET['position'];
$type = $_GET['type'];
$sql = "select * from content_edit where postId = '$postId' and position = '$position' and status = 1 order by editTime ASC";
$result = mysql_query($sql);
$num = mysql_num_rows($result);
$arr = array();
while($row = mysql_fetch_assoc($result)){
    array_push($arr, $row);
}
if($type == 0){
    $sql2 = "select postContent as editContent, createTime as editTime from posts where id = '$postId' and status = 1";
}else{
    $sql2 = "select content as editContent, createTime as editTime from post_reply where postBelongId = '$postId' and position = '$position' and status = 1";
}
$result2 = mysql_query($sql2);
$row2 = mysql_fetch_assoc($result2);
class ResultData{
	var $result;
    var $data;
    var $num;
    var $positionData;
}
$data = new ResultData();
if($num == 0){
    $data->result = 'notExist';
    $data->data = null;
    $data->num = 0;
    $data->positionData = $row2;
}else{
    $data->result = 'success';
    $data->data = $arr;
    $data->num = $num;
    $data->positionData = $row2;
}
echo json_encode($data);
mysql_close($con);
?>