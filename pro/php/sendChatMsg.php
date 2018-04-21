<?php
$chatedId = $_POST["chatedId"];
$chatId = $_POST["chatId"];
$content = $_POST["content"];
require "connect.php";
$now = date("Y-m-d H:i:s");
$sql = "insert into chat (chatId,chatedId,content,chatTime) values ('$chatId','$chatedId','$content','$now')";
$result = mysql_query($sql);
//获得上一次操作数据库时，影响的记录数，不需要参数
$num = mysql_affected_rows();
if($num == 1){
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>