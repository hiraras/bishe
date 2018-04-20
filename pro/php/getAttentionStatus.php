<?php
require "connect.php";
$userId = $_GET['userId'];
$username = $_GET['username'];
$sql = "select * from user_attention WHERE attentionId = '$username' and attentionedId = '$userId'";
$result = mysql_query($sql);
$num = mysql_num_rows($result );
$row = mysql_fetch_assoc($result);
class ResultData{
	var $data;
	var $result;
}
$data = new ResultData();
if($num==1){
    $data->result = 'success';
    $data->data = $row;
    
}else{
    $data->result = 'none';
    $data->data = null;
}
echo json_encode($data);
mysql_close($con);
?>