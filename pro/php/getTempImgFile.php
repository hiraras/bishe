<?php
$file = $_POST['fileData'];
$file = substr(strstr($file,','),1);
$file = base64_decode($file);
//图片都会被转成jpg格式
$newFile = '../img/postTempImg/'.time().rand(100,999).'.jpg';
file_put_contents($newFile, $file);
class Result{
    var $result;
    var $filePath;
}
$obj = new Result();
if(file_exists($newFile)){
    $obj->result = 'success';
    $obj->filePath = $newFile;
}else{
    $obj->result = 'fail';
    $obj->filePath = null;
}
echo json_encode($obj);
?>