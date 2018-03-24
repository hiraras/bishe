<?php
$username = $_GET["user"];
require "connect.php";
$sql = "select headImg from usermsg where username='$username'";
$result = mysql_query($sql);
$arr = mysql_fetch_assoc($result);
echo json_encode($arr);
mysql_close($con);
?>