<?php
$host = "localhost";
$dataBaseUser = "root";
$dataBasePsw = "qilongzhu";
$con = mysql_connect($host,$dataBaseUser,$dataBasePsw)or die("fail to link the db"+mysql_error());
mysql_select_db("graduation");
mysql_query("set names utf8");
?>