<?php
$postId = $_POST["postId"];
$creatorId = $_POST["creatorId"];
$nickName = $_POST["nickName"];
$replyContent = $_POST["replyContent"];
require "connect.php";
$now = date("Y-m-d H:i:s");
$sql = "select position from post_reply where postBelongId = '$postId' and status = 1 order by position DESC";
$result = mysql_query($sql);
$num = mysql_num_rows($result);
if($num == 0){
    //没有回复
    $replyPosition = 2;
}else{
    $positionData = mysql_fetch_assoc($result);
    $replyPosition = $positionData['position'] + 1;
}
$sql2 = "insert into post_reply (postBelongId,position,createTime,content,creatorNickName,creatorId) values ('$postId','$replyPosition','$now','$replyContent','$nickName','$creatorId')";
$result2 = mysql_query($sql2);
//获得上一次操作数据库时，影响的记录数，不需要参数
$num2 = mysql_affected_rows();
if($num2 == 1){
    $sql3 = "select * from posts where id = '$postId'";
    $result3 = mysql_query($sql3);
    $row3 = mysql_fetch_assoc($result3);
    $postCreatorId = $row3['creatorId'];
    $postTitle = $row3['postName'];
    $sql4 = "select * from usermsg where username = '$creatorId'";
    $result4 = mysql_query($sql4);
    $row4 = mysql_fetch_assoc($result4);
    $replyerNickname = $row4['nickname'];
    $informeder = $postCreatorId;
    $informContent = $replyerNickname."在".'$postTitle'."回复了你:".'?postTitle='.$postTitle.'&postId='.$postId.'&replyContent='.$replyContent;
    $informSql = "insert into inform (informer, informederId, informTime, informContent) values (0, '$informeder' , '$now', '$informContent')";
    $result3 = mysql_query($informSql);
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>