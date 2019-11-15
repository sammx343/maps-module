<?php
	if(isset($_POST["markers"])){

		$fp = fopen('points_sec.txt', 'a');
		fwrite($fp, $_POST["markers"]);
		fclose($fp);
	}
?>