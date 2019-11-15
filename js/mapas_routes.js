var markers = [];
var route1 = [];
var route2 = [];
var route3 = [];
var route4 = [];
var routes_sec=[];
var map;
var routes_sec = [];
function initialize2() {
  //Revisa si el usuario tiene habilitada la opción de geolocalización.
  map = new google.maps.Map(
  document.getElementById('map_routes'), {
    center: new google.maps.LatLng(11.019304, -74.850773),
    zoom: 16,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  //Define los límites de la imagen a superponer sobre el layout de google maps.
  var x1 = new google.maps.LatLng(11.016813, -74.853152);
  var x2 = new google.maps.LatLng(11.021414, -74.844984);
 
  //var x1 = new google.maps.LatLng(11.016813, -74.853202);
  //var x2 = new google.maps.LatLng(11.021454, -74.844784);
  //var limites_imagen = new google.maps.LatLngBounds(x1, x2);
  //var imagen = new google.maps.GroundOverlay("img/Mapa_Uninorte_Uninorte.CO.png", limites_imagen);
  //Se superpone la imagen en el mapa.
  //imagen.setMap(map);
  bound2 = new google.maps.LatLng(11.016413, -74.853002);
    bound3 = new google.maps.LatLng(11.022114, -74.844934);
    var limites_imagen2 = new google.maps.LatLngBounds(bound2, bound3);
    var imagen = new google.maps.GroundOverlay("img/mapa2.png", limites_imagen2,{opacity:1});
    //Se superpone la imagen en el mapa.
    imagen.setMap(map);
<?php
  foreach($array_1 as $element){
    if($element != ""){
      ?>
        route1.push("<?php echo $element;?>");
      <?php
    }
  }
  foreach($array_2 as $element){
    if($element != ""){
      ?>
        route2.push("<?php echo $element;?>");
      <?php
    }
  }
  foreach($array_3 as $element){
    if($element != ""){
      ?>
        route3.push("<?php echo $element;?>");
      <?php
    }
  }
  foreach($array_4 as $element){
    if($element != ""){
      ?>
        route4.push("<?php echo $element;?>");
      <?php
    }
  }
  foreach($array_sec as $element){
    if($element != ""){
      ?>
        routes_sec.push("<?php echo $element;?>");
      <?php
    }
  }
?>
MatrixRoutes = new Array (4);
MatrixRoutes[0] = route1;
MatrixRoutes[1] = route2;
MatrixRoutes[2] = route3;
MatrixRoutes[3] = route4;
MatrixRoutes[4] = routes_sec;
   google.maps.event.addListener(imagen, "click", function(event){ 
    addMarker(event.latLng,0);
  });
}

function addMarker(location,flag) {
  var marker = new google.maps.Marker({
    position: location,
    title: location.lat() + " " +location.lng(),
    map: map
  });
  if(flag != 0){
      if(flag == 5){
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
      }else{
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');  
      }
           
  }
  google.maps.event.addListener(marker, "click", function(event){ 
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    markers.push(marker);
  });
}
$('#send2').click(function(){
  data ="";
  for (var i = 0; i < markers.length; i++) {
    data += markers[i].position.lat() + "," + markers[i].position.lng() + ";";
  };
  $.ajax({ 
    type: "POST", 
    url: "write2.php", 
    data:{markers: data},
    success: function(mensaje) {
      alert(mensaje);
      markers =[];
    } 
  });   
});

$('#mainRoutes select').change(function(){
  for (var i = markers.length - 1; i >= 0; i--) {
    markers[i].setMap(null);
  };
  markers = [];
  numberOfRoute = this.value;
  if(numberOfRoute != 0){
    for (var i =0; i < MatrixRoutes[numberOfRoute - 1].length; i++) {
      addMarker(new google.maps.LatLng(MatrixRoutes[numberOfRoute - 1][i].split(",")[0],MatrixRoutes[numberOfRoute - 1][i].split(",")[1]),numberOfRoute);
    };
  }

});

$('#secRoutes select').change(function(){
  for (var i = markers.length - 1; i >= 0; i--) {
    markers[i].setMap(null);
  };
  markers = [];
  numberOfRoute = this.value;
  ruta = MatrixRoutes[4][numberOfRoute - 1].split("[")[0].split(";");
  if(numberOfRoute != 0){
    for (var i =0; i < ruta.length; i++) {
      addMarker(new google.maps.LatLng(ruta[i].split(",")[0],ruta[i].split(",")[1]),5);
    };
  }

});
//Avisa al usuario que debe habilitar la opción de geolocalización en su dispositvo para poder acceder a la característica.
function geoError(){ 
  alert('Tu dispositivo y/o navegador tiene(n) deshabilitada la opción de geolocalización. Favor ir a Ajustes->Acceso a la ubicación y habilitar esta opción');
  $('nav').css("display","none");
} 


  /*

  var pathPolyline = [position1,position2];
  var polyline = new google.maps.Polyline({
    path: pathPolyline,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 5
  });

  polyline.setMap(map);*/ 
google.maps.event.addDomListener(window, 'load', initialize2);