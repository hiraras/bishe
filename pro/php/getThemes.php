<?php
require "connect.php";
$sql = "select * from sort_bar";
$result = mysql_query($sql);
$arr = array();
while($row = mysql_fetch_assoc($result)){
    array_push($arr,$row);
}
echo json_encode($arr);
mysql_close($con);
?>