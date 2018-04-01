<?php
$userId = $_POST["userId"];
$oldPsw = $_POST["oldPsw"];
$newPsw = $_POST["newPsw"];
$oldPsw = md5($oldPsw);
$newPsw = md5($newPsw);
require "connect.php";
$sql = "select * from login where username='$userId'";
$result = mysql_query($sql);
//获得的结果数组只能用数字索引，不能用key值
//$arr = mysql_fetch_row($result);
//获得的结果数组只能用key值，不能用数字索引
$arr = mysql_fetch_assoc($result);
if($arr['psw'] == $oldPsw){
    $sql = "UPDATE login SET psw='$newPsw' WHERE username = '$userId'";
    $result = mysql_query($sql);
    $num = mysql_affected_rows();
    if($num == 1){
        echo 'success';
    }else{
        echo 'error';
    }
}else{
    echo 'fail';
}
mysql_close($con);
?>