<?php
require "connect.php";
$username = $_POST['username'];
$file = $_POST['fileData'];
$file = substr(strstr($file,','),1);
$file = base64_decode($file);
//图片都会被转成jpg格式
$newFile = '../img/userHeadImg/'.time().rand(100,999).'.jpg';
file_put_contents($newFile, $file);
class Result{
    var $result;
    var $filePath;
}
$obj = new Result();
$sql = "UPDATE usermsg SET headImg = '$newFile' WHERE username = '$username'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if(file_exists($newFile) && $num==1){
    $obj->result = 'success';
    $obj->filePath = $newFile;
}else{
    $obj->result = 'fail';
    $obj->filePath = null;
}
echo json_encode($obj);
mysql_close($con);
?>