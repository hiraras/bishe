<?php
/*从getPostMasterMsg.php中拷贝，修改了select的条件(去掉status=1)*/ 
$postId = $_GET["postId"];
$barName = $_GET["barName"];
$postTitle = $_GET["postTitle"];
require "connect.php";
if($postId == ''){
    $sql = "select * from posts where barBelong='$barName' and postName LIKE '%$postTitle%'";
}else{
    $sql = "select * from posts where id='$postId'";
}
$result = mysql_query($sql);
class Result{
    var $result;
    var $data;
}
$obj = new Result();
$num = mysql_num_rows($result);
$arr = array();
if($num != 0){
    while($row = mysql_fetch_assoc($result)){
        $creatorId = $row['creatorId'];
        $sql2 = "select headImg,nickname from usermsg where username='$creatorId'";
        $result2 = mysql_query($sql2);
        $row2 = mysql_fetch_assoc($result2);
        $row['creatorHeadImg'] = $row2['headImg'];
        $row['nickname'] = $row2['nickname'];
        $barBelong = $row['barBelong'];
        $sql3 = "select master from bars where barName='$barBelong'";
        $result3 = mysql_query($sql3);
        $row3 = mysql_fetch_assoc($result3);
        $row['master'] = $row3['master'];
        array_push($arr, $row);
    }
    $obj->result = 'success';
    $obj->data = $arr;
}else{
    $obj->result = 'notExist';
    $obj->data = array();
}

echo json_encode($obj);
mysql_close($con);
?>