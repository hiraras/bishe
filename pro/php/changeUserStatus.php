<?php
require "connect.php";
$userId = $_POST['userId'];
$status = $_POST['status'];
$sql = "UPDATE login SET status='$status' WHERE username = '$userId'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>