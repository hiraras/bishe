<?php
require "connect.php";
$content = $_POST['content'];
$barId = $_POST['barId'];
$sql = "UPDATE bars SET barDescript='$content' WHERE id = '$barId'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>