<?php
$postTitle = $_POST["postTitle"];
$barBelong = $_POST["barBelong"];
$creatorId = $_POST["creatorId"];
$nickName = $_POST["nickName"];
$postContent = $_POST["postContent"];
require "connect.php";
$now = date("Y-m-d H:i:s");
$sql = "insert into posts (postName,barBelong,creatorId,createTime,creatorNickName,postContent) values ('$postTitle','$barBelong','$creatorId','$now','$nickName','$postContent')";
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