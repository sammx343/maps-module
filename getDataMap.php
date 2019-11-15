<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require('include/parametros_conexion.php');
$conexion = mysqli_connect($db_host,$db_user,$db_password,$db_schema);
$conexion -> set_charset("utf8");

$selectCategories = mysqli_prepare($conexion,"SELECT category_id, name, icon_url FROM category");
$selectPlaces = mysqli_prepare($conexion,"SELECT place_id, name, description, latitude, longitud, entry_lat, entry_long FROM places WHERE category_id = ?");
//Lista de iconos
/*$iconsTags = array(
    "HISTORIAS" => "historias_mapa.png",
    "PARQUEADEROS" => "parqueaderos_mapa.png",
    "RESTAURANTES" => "restaurantes_mapa.png",
    "SALAS_DE_COMPUTO" => "salas_computo_mapa.png",
    "SALONES_DE_EVENTOS" => "salones_eventos_mapa.png",
    "TIENDAS_Y_ALMACENES" => "tiendas_almacenes_mapa.png",
    "UNINORTE_VERDE" => "uninorte_verde_mapa.png",
    "ZONAS_DE_ESTUDIO" => "zonas_estudio_mapa.png"
);*/

//$option=array('trace'=>1,'encoding' => 'UTF-8');

//$client=new SoapClient('http://172.16.31.146:8080/GoogleMapsService/GoogleMapsService?wsdl',$option);


/*class requestDTO {
    function requestDTO($tipology, $boolean)
    {
        $this->categoria = $tipology;
        $this->incluirLugares = $boolean;
    }
}*/

function strClean($string){
    return str_replace('"', "'", $string);
}
/*$request = new requestDTO("",false);
$params = array(
  "request" => $request,
);*/

//$response = $client->__soapCall("consultarLugaresPorCategoria", array($params));
$categories = array();
$matrixMarkers = array();
$counter = 0;
?>
<script>
    var matrixMarkers = new Array();
    var markersList = new Array();
    var categories = new Array();
    <?php
    $numPlaces = 0;
    //$fp1 =  fopen("categories.txt","a");
    //fwrite($fp1,"id@Category_ID@Name@Description@Latitude@Longitude@Entry_lat@Entry_long\n");
    mysqli_stmt_execute($selectCategories);
    mysqli_stmt_store_result($selectCategories);
    mysqli_stmt_bind_result($selectCategories, $category_id, $category_name, $icon_url);
    while (mysqli_stmt_fetch($selectCategories)) {
    //foreach ($response->return->categorias as $line) {
        if(strClean($category_name) != "En el Mundo" && strClean($category_name) != "Fuera del Campus" && strClean($category_name) != "Entorno Caribe"){
            $categories[$category_id][0] = $category_id;
            $categories[$category_id][1] = $category_name;
            $categories[$category_id][2] = $icon_url;
            $categories[$category_id][3] = $icon_url;
            //fwrite($fp1,strClean($line->id)."@".strClean($line->categoria)."@".$categories[$counter][3]."\n");
            ?>
                var counter = <?php echo $category_id;?>;
                categories[counter] = new Array(2);
                categories[counter][0] = <?php echo $categories[$category_id][0];?>;
                categories[counter][1] = "<?php echo $categories[$category_id][1];?>";
                categories[counter][2] = "<?php echo $categories[$category_id][2];?>";
                categories[counter][3] = "<?php echo $categories[$category_id][3];?>";

            <?php
            //$request = new requestDTO($categories[$counter][2],true);
            //$responsePlaces = $client->__soapCall("consultarLugaresPorCategoria", array(array("request" => $request)));
            mysqli_stmt_bind_param($selectPlaces,'s',$category_id);
            mysqli_stmt_execute($selectPlaces);
            mysqli_stmt_bind_result($selectPlaces, $place_id, $place_name, $place_desc, $latitude, $longitud, $entry_lat, $entry_long);
            while (mysqli_stmt_fetch($selectPlaces)) {
            //foreach ($responsePlaces->return->categorias->lugares as $place) {
                if(trim(strClean($place_desc)) != ""){
                    ?>
                        var row = <?php echo ($numPlaces);?>;
                        matrixMarkers[row] = new Array(2);
                        matrixMarkers[row][7] = "<?php echo strClean($place_id);?>";
                        matrixMarkers[row][0] = "<?php echo strClean($place_name);?>";
                        matrixMarkers[row][1] = "<?php echo strClean($latitude);?>";
                        matrixMarkers[row][2] = "<?php echo strClean($longitud);?>";
                        matrixMarkers[row][3] = "<?php echo strClean($category_id);?>";
                        matrixMarkers[row][4] = "<?php echo strClean($place_desc);?>";
                        matrixMarkers[row][5] = "<?php echo strClean($entry_lat);?>";
                        matrixMarkers[row][6] = "<?php echo strClean($entry_long);?>";
                        markersList[row] = matrixMarkers[row][0];
                    <?php
                    $numPlaces++;

                    //fwrite($fp1,strClean($place->id).";".strClean($place->nombre).",".strClean($place->latitud).",".strClean($place->longitud).",\n");
                }
            }
        }
        $counter++;
    }
    //fclose($fp);
    ?>
</script>
