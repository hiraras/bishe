<?php
$username = $_POST["username"];
$psw = $_POST["psw"];
require "connect.php";
$psw = md5($psw);
$sql = "UPDATE login SET psw='$psw' WHERE username = '$username'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>