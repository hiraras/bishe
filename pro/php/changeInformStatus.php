<?php
require "connect.php";
$id = $_POST['id'];
$sql = "UPDATE inform SET status=0 WHERE id = '$id'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>