<?php
$file = $_POST['fileData'];
$file = substr(strstr($file,','),1);
$file = base64_decode($file);
$newFile = '../img/replyImg/'.time().rand(100,999).'.jpg';
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