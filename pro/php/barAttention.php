<?php
$barName = $_GET['barName'];
$userId = $_GET['userId'];
$barId = $_GET['barId'];
$attentionStatus = $_GET['attentionStatus'];
require "connect.php";
$sql = "select * from bar_attention where barName='$barName' and userId='$userId'";
$result = mysql_query($sql);
$sql4 = "select * from bars where id='$barId' and status = 1";
$result4 = mysql_query($sql4);
$row = mysql_fetch_assoc($result4);
$concernNum = $row['concernNum'];
$num = mysql_num_rows($result);
$now = date("Y-m-d H:i:s");
if($num == 0){
    $concernNum += 1;
    $sql2 = "insert into bar_attention (userId,barId,barName,attentionTime) values ('$userId','$barId','$barName','$now')";
    $result2 = mysql_query($sql2);
    $num2 = mysql_affected_rows();
    $sql5 = "UPDATE bars SET concernNum='$concernNum' WHERE id = '$barId'";
    $result5 = mysql_query($sql5);
    if($num2 == 1){
        echo 'success';
    }else{
        echo 'error';
    }
}else{
    if($attentionStatus == 1){
        $concernNum -= 1;
        $sql3 = "UPDATE bar_attention SET status=2 WHERE userId = '$userId' and barName='$barName'";
        $sql5 = "UPDATE bars SET concernNum='$concernNum' WHERE id = '$barId'";
        $result5 = mysql_query($sql5);
    }else{
        $concernNum += 1;
        $sql3 = "UPDATE bar_attention SET status=1 WHERE userId = '$userId' and barName='$barName'";
        $sql5 = "UPDATE bars SET concernNum='$concernNum' WHERE id = '$barId'";
        $result5 = mysql_query($sql5);
    }
    $result3 = mysql_query($sql3);
    $num3 = mysql_affected_rows();
    if($num3 == 1){
        echo 'success';
    }else{
        echo 'error';
    }
}
mysql_close($con);
?>