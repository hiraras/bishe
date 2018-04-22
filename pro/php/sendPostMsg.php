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
    $sql4 = "select * from usermsg where username = '$creatorId'";
    $result4 = mysql_query($sql4);
    $row4 = mysql_fetch_assoc($result4);
    $informerNickname = $row4['nickname'];
    $sql2 = "select * from user_attention where attentionedId = '$creatorId'";
    $result2 = mysql_query($sql2);
    $sql5 = "select * from posts where createTime = '$now' and creatorId = '$creatorId'";
    $result5 = mysql_query($sql5);
    $row5 = mysql_fetch_assoc($result5);
    $postId = $row5['id'];
    while($row2 = mysql_fetch_assoc($result2)){
        $informeder = $row2['attentionId'];
        $informContent = "您关注的".$informerNickname."发表了新的帖子:".'?postTitle='.$postTitle.'&postId='.$postId;
        $informSql = "insert into inform (informer, informederId, informTime, informContent) values (0, '$informeder' , '$now', '$informContent')";
        $result3 = mysql_query($informSql);
    }
    echo 'success';
}else{
    echo 'fail';
}
mysql_close($con);
?>