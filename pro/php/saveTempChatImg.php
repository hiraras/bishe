<?php
$file = $_POST['imgsData'];
$newFileArr = array();
for($i=0;$i<count($file);$i++){
    //获得字符串2在字符串1中最后出现的位置，大小写敏感
    $filenamePos = strripos($file[$i],'/');
    $filename = substr($file[$i],$filenamePos + 1);
    $newFile = '../img/chatImg/'.$filename;
    array_push($newFileArr,$newFile);
    copy($file[$i], $newFile);
    unlink($file[$i]);
}
$isSuccess = false;
$filenum = 0;
for($j=0;$j<count($newFileArr);$j++){
    if(file_exists($newFileArr[$j])){
        $filenum ++;
    }else{
        break;
    }
}
if($filenum==count($newFileArr)){
    echo 'success';
}else{
    echo 'fail';
}
?>