<?php
$imgPath = $_GET['imgPath'];
if(file_exists($imgPath)){
    unlink($imgPath);
}
if(!file_exists($imgPath)){
    $result = 'success';
}else{
    $result = 'fail';
}
echo json_encode($result);
?>