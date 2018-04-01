<?php
$barName = $_GET['barName'];
$userId = $_GET['userId'];
$themeBelong = $_GET['themeBelong'];
require "connect.php";
$sql = "select * from bars where barName='$barName'";
$result = mysql_query($sql);
$num = mysql_num_rows($result);
$now = date("Y-m-d H:i:s");
if($num == 0){
    $sql2 = "insert into applyBuildBar (barName,themeBelong,applyerId,applyTime) values ('$barName','$themeBelong','$userId','$now')";
    $result2 = mysql_query($sql2);
    $num2 = mysql_affected_rows();
    if($num2 == 1){
        echo 'success';
    }else{
        echo 'error';
    }
}else{
    echo 'exist';
}
mysql_close($con);
?>