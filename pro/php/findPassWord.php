<?php
$username = $_POST["username"];
$psw = $_POST["psw"];
require "connect.php";
$psw = md5($psw);
$sql2 = "select * from login where username = '$username'";
$result2 = mysql_query($sql2);
$row2 = mysql_fetch_assoc($result2);
$oldPsw = $row2['psw'];
if($oldPsw == $psw){
    echo 'repeat';
}else{
    $sql = "UPDATE login SET psw='$psw' WHERE username = '$username'";
    $result = mysql_query($sql);
    $num = mysql_affected_rows();

    if($num==1){
        echo 'success';
    }else{
        echo 'fail';
    }
}

mysql_close($con);
?>