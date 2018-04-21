<?php
require "connect.php";
$postId = $_POST['postId'];
$position = $_POST['position'];
$status = $_POST['status'];
$msg = $_POST['msg'];
$sql = "UPDATE post_reply SET status='$status' WHERE postBelongId = '$postId' and position='$position'";
$result = mysql_query($sql);
$num = mysql_affected_rows();

if($num==1){
    $sql2 = "select * from post_reply where postBelongId = '$postId' and position='$position'";
    $result2 = mysql_query($sql2);
    $row2 = mysql_fetch_assoc($result2);
    $master = $row2['creatorId'];
    if($status == 1){
        $informContent = '您的评论:'.$row2['content'].'已被恢复';
    }else{
        $informContent = '您的评论:'.$row2['content'].',因'.$msg.'已被删除';
    }
    
    $now = date("Y-m-d H:i:s");
    $informSql = "insert into inform (informer, informederId, informTime, informContent) values (0, '$master' , '$now', '$informContent')";
    $result3 = mysql_query($informSql);
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>