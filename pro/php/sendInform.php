<?php
$userId = $_POST["userId"];
$msg = $_POST["msg"];
require "connect.php";
$now = date("Y-m-d H:i:s");
$informSql = "insert into inform (informer, informederId, informTime, informContent) values (0, '$userId' , '$now', '$msg')";
$result = mysql_query($informSql);
$num = mysql_affected_rows();
if($num == 1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>