<?php
require "connect.php";
$id = $_POST['id'];
$newMasterId = $_POST['newMasterId'];
$informMsg = $_POST['informMsg'];
$informedId = $_POST['informedId'];
$now = date("Y-m-d H:i:s");
$informSql = "insert into inform (informer, informederId, informTime, informContent) values (0, '$informedId' , '$now', '$informMsg')";
if($newMasterId != '0'){
    $sql = "select * from usermsg where username = '$newMasterId'";
    $result = mysql_query($sql);
    $num = mysql_num_rows($result);
    if($num == 0){
        echo 'notExist';
    }else{
        $sql2 = "UPDATE bars SET master='$newMasterId' WHERE id = '$id'";
        $result2 = mysql_query($sql2);
        $num2 = mysql_affected_rows();
        if($num2 == 1){
            mysql_query($informSql);
            echo 'success';
        }else{
            echo 'error';
        }
    }
}else{
    $sql2 = "UPDATE bars SET master='$newMasterId' WHERE id = '$id'";
    $result2 = mysql_query($sql2);
    $num2 = mysql_affected_rows();
    if($num2 == 1){
        mysql_query($informSql);
        echo 'success';
    }else{
        echo 'error';
    }
}
mysql_close($con);
?>