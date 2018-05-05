<?php
require "connect.php";
$dayMaxExp = 30;
$userId = $_POST['userId'];
$expNum = $_POST['expNum'];
$sql = "select * from usermsg where username = '$userId'";
$result = mysql_query($sql);
$row = mysql_fetch_assoc($result);
$todayExp = $row['todayExp'];
if($todayExp > $dayMaxExp){
    echo 'isOver';
}else{
    $currExp = $row['exp'];
    $nextExp = $currExp + $expNum;
    $nextTodayExp = $todayExp + $expNum;
    $sql2 = "UPDATE usermsg SET exp = '$nextExp',todayExp = '$nextTodayExp' WHERE username = '$userId'";
    $result2 = mysql_query($sql2);
    $num = mysql_affected_rows();
    if($num==1){
        echo 'success';
    }else{
        echo 'fail';
    }
}

mysql_close($con);
?>