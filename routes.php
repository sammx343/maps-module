<!DOCTYPE html>
<html class="no-js">
<!--<![endif]-->
<head>
 	<meta charset="utf-8">
  	<meta name="viewport" content="width=device-width, user-scalable=no,initial-scale = 1.0">
  	<meta http-equiv="cache-control" content="max-age=0" />
	<meta http-equiv="cache-control" content="no-cache" />
	<meta http-equiv="expires" content="0" />
	<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
	<meta http-equiv="pragma" content="no-cache" />
  	<link rel="stylesheet" type="text/css" href="css/mapasStyle.css">
  	<title>Mapas</title>
  	<script src="https://maps.googleapis.com/maps/api/js?sensor=false" type="text/javascript"></script>
	<script src="//code.jquery.com/jquery-1.9.1.js"></script>
	<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
  
</head>
<body>
	<?php
		$array_1 = explode(";", file_get_contents("points_main_1.txt"));
  		$array_2 = explode(";", file_get_contents("points_main_2.txt"));
  		$array_3 = explode(";", file_get_contents("points_main_3.txt"));
  		$array_4 = explode(";", file_get_contents("points_main_4.txt"));
  		$array_sec = explode("___", file_get_contents("points_sec3.txt"));

	?>
	<div id="map_routes"></div>
	<div id="send2">send</div>
	<div id="selectRoutes">
		<div id="mainRoutes">
			<select>
			  <option class ="main" id="main0" value="0">Rutas principales</option>
			  <option class ="main" id="main1" value="1">Ruta 1</option>
			  <option class ="main" id="main2" value="2">Ruta 2</option>
			  <option class ="main" id="main3" value="3">Ruta 3</option>
			  <option class ="main" id="main4" value="4">Ruta 4</option>
			</select>
		</div>
		<div id="secRoutes">
			<select>
			  <option value="0">Rutas Secundarias</option>
			  <?php
			  	$i = 0;
			  	foreach ($array_sec as $ruta) {
			  		?>
			  			<option class ="sec" id="sec<?php echo $i;?>" value="<?php echo $i + 1;?>">Ruta <?php echo $i + 1;?></option>
			  		<?php
			  		$i++;
			  	}
			  ?>
			</select>
		</div>
	</div>
	<script>
		<?php
			
			include "js/mapas_routes.js";
		?>
	</script>

	</script>
</body>
</html>