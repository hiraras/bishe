<?php
$id = $_POST['id'];
$refuseMsg = $_POST['refuseMsg'];
require "connect.php";
$sql = "select * from applybuildbar where id='$id'";
$result = mysql_query($sql);
$applyMsg = mysql_fetch_assoc($result);
$barName = $applyMsg['barName'];
$themeBelong = $applyMsg['themeBelong'];
$applyerId = $applyMsg['applyerId'];
$now = date("Y-m-d H:i:s");
$informContent = '创建'.$barName.'吧失败.原因:'.$refuseMsg;
$sql2 = "insert into inform (informer,informederId,informTime,informContent) values('0','$applyerId','$now','$informContent')";
$result2 = mysql_query($sql2);
$num = mysql_affected_rows();
if($num == 1){
    $sql3 = "delete from applybuildbar where id='$id'";
    $result3 = mysql_query($sql3);
    echo 'success';
}else{
    echo 'fail';
}

mysql_close($con);
?>