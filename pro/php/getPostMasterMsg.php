<?php
$postId = $_GET["postId"];
require "connect.php";
$sql = "select * from posts where id='$postId' and status = 1";
$result = mysql_query($sql);
class Result{
    var $result;
    var $data;
}
$obj = new Result();
$num = mysql_num_rows($result);
if($num == 1){
    $arr = mysql_fetch_assoc($result);
    $creatorId = $arr['creatorId'];
    $sql2 = "select headImg,nickname from usermsg where username='$creatorId'";
    $result2 = mysql_query($sql2);
    $row = mysql_fetch_assoc($result2);
    $arr['creatorHeadImg'] = $row['headImg'];
    $arr['nickname'] = $row['nickname'];
    $barBelong = $arr['barBelong'];
    $sql3 = "select master from bars where barName='$barBelong'";
    $result3 = mysql_query($sql3);
    $row2 = mysql_fetch_assoc($result3);
    $arr['master'] = $row2['master'];
    $obj->result = 'success';
    $obj->data = $arr;
}else{
    $obj->result = 'notExist';
    $obj->data = array();
}

echo json_encode($obj);
mysql_close($con);
?>