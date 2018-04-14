<?php
$username = $_GET["username"];
$nickname = $_GET["nickname"];
require "connect.php";
$sql = "select * from userMsg where username='$username' and nickname='$nickname'";
$result = mysql_query($sql);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$sql2 = "select * from posts where creatorId='$username' and status = 1";
$result2 = mysql_query($sql2);
$num2 = mysql_num_rows($result2);
$sql3 = "select status from login where username='$username'";
$result3 = mysql_query($sql3);
$loginData = mysql_fetch_assoc($result3);
$status = $loginData['status'];

class Result{
    var $result;
    var $data;
}
$obj = new Result();
$num = mysql_num_rows($result);
if($num == 0){
    $obj->result = 'none';
    $obj->data = null;
}else{
    $arr = mysql_fetch_assoc($result);
    $arr['postNum'] = $num2;
    $arr['status'] = $status;
    $obj->result = 'success';
    $obj->data = $arr;
}

echo json_encode($obj);
mysql_close($con);
?>