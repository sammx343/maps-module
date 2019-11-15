<?php
	if(isset($_POST["array_1"] && isset($_POST["array_2"] && isset($_POST["array_3"] && isset($_POST["array_4"] && isset($_POST["array_5"])){
		
		$array_1 = $_POST["array_1"];
		$array_2 = $_POST["array_2"];
		$array_3 = $_POST["array_3"];
		$array_4 = $_POST["array_4"];
		$array_5 = $_POST["array_5"];

		$text1 = "";
  		foreach ($array_1 as $key) {
  			$text1 .= $key . ";";
  		}
  		$text2 = "";
  		foreach ($array_2 as $key) {
  			$text2 .= $key . ";";
  		}
  		$text3 = "";
  		foreach ($array_3 as $key) {
  			$text3 .= $key . ";";
  		}
  		$text4 = "";
  		foreach ($array_4 as $key) {
  			$text4 .= $key . ";";
  		}
  		$text5 = "";
  		foreach ($array_sec as $key) {
  			$text5 .= $key . "___";
  		}
  		echo "text1: ".$text1;
  		$file = fopen("points_main_12.txt","w");
		fwrite($file,substr($text1,0,-1));
		fclose($file);
		$file = fopen("points_main_22.txt","w");
		fwrite($file,substr($text2,0,-1));
		fclose($file);
		$file = fopen("points_main_32.txt","w");
		fwrite($file,substr($text3,0,-1));
		fclose($file);
		$file = fopen("points_main_42.txt","w");
		fwrite($file,substr($text4,0,-1));
		fclose($file);
		$file = fopen("points_sec2.txt","w");
		fwrite($file,substr($text5,0,-3));
		fclose($file);
	}else{
		echo "error";
	}
?>