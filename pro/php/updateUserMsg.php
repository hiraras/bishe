<?php
require "connect.php";
$username = $_POST['username'];
$age = $_POST['age'];
$address = $_POST['address'];
$school = $_POST['school'];
$sql = "UPDATE usermsg SET address='$address',age='$age',school='$school' WHERE username = '$username'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>