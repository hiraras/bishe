<?php
$username = $_GET["username"];
require "connect.php";
$sql = "select * from userMsg where username='$username'";
$result = mysql_query($sql);
$arr = mysql_fetch_row($result);
echo json_encode($arr);

?>