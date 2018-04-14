<?php
require "connect.php";
$sortName = $_POST['sortName'];
$sql = "select * from sort_bar where sortName='$sortName'";
$result = mysql_query($sql);
$num = mysql_num_rows($result);
if($num == 0){
    $sql2 = "insert into sort_bar (sortName) values ('$sortName')";
    $result2 = mysql_query($sql2);
    $num2 = mysql_affected_rows();
    if($num2 == 1){
        echo 'success';
    }else{
        echo 'fail';
    }
}else{
    echo 'isExist';
}

mysql_close($con);
?>