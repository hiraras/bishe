<?php
$id = $_POST['id'];
require "connect.php";
$sql = "select * from applybuildbar where id='$id'";
$result = mysql_query($sql);
$applyMsg = mysql_fetch_assoc($result);
$barName = $applyMsg['barName'];
$themeBelong = $applyMsg['themeBelong'];
$applyerId = $applyMsg['applyerId'];
$now = date("Y-m-d H:i:s");
$sql2 = "insert into bars (barName,master,createTime,themeBelong,createorId) values ('$barName','$applyerId','$now','$themeBelong','$applyerId')";
$result2 = mysql_query($sql2);
$num = mysql_affected_rows();
if($num == 1){
    $informContent = '创建'.$barName.'吧成功';
    $sql4 = "insert into inform (informer,informederId,informTime,informContent) values('0','$applyerId','$now','$informContent')";
    $result4 = mysql_query($sql4);
    $sql3 = "delete from applybuildbar where id='$id'";
    $result3 = mysql_query($sql3);
    echo 'success';
}else{
    echo 'error';
}
mysql_close($con);
?>