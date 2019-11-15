<?php
	/*$db_host = "172.16.15.16";
	$db_user = "emobileusr";
	$db_password = "Tempo..123";
	$db_schema = "maps_db";*/

	$db_host = "172.16.15.16";
	$db_user = "emobileusr";
	$db_password = "Tempo..123";
	$db_schema = "maps_db";

	function escape_string($value)
	  {
	  	$search = array("\\",  "\x00", "\n",  "\r",  "'",  '"', "\x1a", "");
	  	$replace = array("\\\\","\\0","\\n", "\\r", "\'", '\"', "\\Z");

	  	return str_replace($search, $replace, $value);
	  }
?>
