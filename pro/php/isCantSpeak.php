<?php
$userId = $_GET["userId"];
require "connect.php";
$sql = "select * from login where username='$userId'";
$result = mysql_query($sql);
$arr = mysql_fetch_assoc($result);
if($arr['status'] == 1){
    echo json_encode(false);
}else{
    echo json_encode(true);
}

mysql_close($con);
?>