<?php
require "connect.php";
$id = $_POST['id'];
$optioner = $_POST['optioner'];

$sql = "UPDATE report SET status='0', optioner='$optioner' WHERE id = '$id'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>