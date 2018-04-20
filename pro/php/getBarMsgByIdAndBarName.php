<?php
$barId = $_GET["barId"];
$barName = $_GET["barName"];
require "connect.php";
if($barName == ''){
    $sql = "select * from bars where id='$barId'";
}else if($barId == ''){
    $sql = "select * from bars where barName='$barName'";
}else{
    $sql = "select * from bars where id='$barId' and barName='$barName'";
}
$result = mysql_query($sql);
$row = mysql_fetch_assoc($result);
if($barName == ''){
    $barName = $row['barName'];
}
$sql2 = "select * from posts where barBelong='$barName' and status = 1";
$result2 = mysql_query($sql2);
$num2 = mysql_num_rows($result2);

class Result{
    var $result;
    var $data;
}
$obj = new Result();
$num = mysql_num_rows($result);
if($num == 0){
    $obj->result = 'none';
    $obj->data = null;
}else{
    $row['postNum'] = $num2;
    $obj->result = 'success';
    $obj->data = $row;
}

echo json_encode($obj);
mysql_close($con);
?>