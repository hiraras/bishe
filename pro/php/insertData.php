<?php
$data1 = $_POST["data1"];
$data2 = $_POST["data2"];
$data3 = $_POST["data3"];
$data4 = $_POST["data4"];
$data5 = $_POST["data5"];
$data6 = $_POST["data6"];
$host = "localhost";
$dataBaseUser = "root";
$dataBasePsw = "qilongzhu";
$con = mysql_connect($host,$dataBaseUser,$dataBasePsw)or die("fail to link the db"+mysql_error());
mysql_select_db("graduation");
mysql_query("set names utf8");
$now = date("Y-m-d H:i:s");
$sql = "insert into bars (barName,master,createTime,themeBelong,createorId) values ('$data1','$data2','$now','$data4','$data6')";
$result = mysql_query($sql);
$num = mysql_affected_rows();
echo $num;
mysql_close($con);
?>