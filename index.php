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
  	<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
  	<title>Mapas</title>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDRj_vnQ_sqHx6C29CxWoa_G5WjQJOAp18" type="text/javascript"></script>
	<!-- <script src="https://kit.fontawesome.com/edb82cf154.js" crossorigin="anonymous"></script> -->
	<script src="//code.jquery.com/jquery-1.9.1.js"></script>
	<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>

</head>
<body>
	<header></header>
	<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
		include "getDataMap.php";
	?>
	<script>
		var numCategories = <?php echo count($subLocations);?>
		
	</script>
	<?php
		if(isset($_GET['id'])){

		}else{
	?>
	<nav>
		<ul>
			<li id="categories-title">Categorías <span class="open-categories"><i class="fa fa-plus"></i></span></li>
				<ul id="categories-list">
				</ul>
		</ul>
	</nav>

	<input id="hideKeyboard" type="text" readonly="readonly" />
	<div id="search"><input type="text" placeholder="Buscar..."><img src="img/finder/search_btn.png" height="32px" width="32px"></div>
	<div id="loadingWrap"><div id="loading"><p>Calculando. . .</p><img src="img/loading.gif" width="50%"></div></div>
	<div id="warning">La señal no es confiable</div>
	<div id="clearMap"> <span> Limpiar Mapa <i class="fa fa-times"></i></span></div>
	<?php
	}
	?>
	<div id="mapOverlay"></div>
  <?php
    if(isset($_GET['id'])){
    ?>
	    <div id="map" style="height:100%"></div>
    <?php
    }else{
    ?>
      <div id="map"></div>
    <?php
    }
  ?>
		<script>
		<?php
			if(isset($_GET['id'])){
				?>
				var idMark = <?php echo $_GET['id'];?>;
				<?php
				include "js/mapas_parametros.js";
			}else{
				include "js/geoPosition.js";
				include "js/searcher.js";
				include "js/mapas.js";
			}
			include "js/mapRefresh.js";
		?>
		</script>
</body>
</html>
