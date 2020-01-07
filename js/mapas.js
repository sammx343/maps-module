
var acc;
var currentLat;
var currentLatArray = [];
var currentLong;
var currentLongArray = [];
var dLat = [];
var dLong = [];
var currentPosition;
var markerHome;
var circle;
var infoWindow;
var LatLngList = [];
var route1 = [];
var route2 = [];
var route3 = [];
var route4 = [];
var routes_sec=[];
var ruta_temp = [];
var counterPolylines = 0;

let markersCurrentlyShowed = [];
let categoriesCurrentlyShowed = [];

var globalRoute = {};

<?php
  $array_1 = explode(";", file_get_contents("points_main_1.txt"));
  $array_2 = explode(";", file_get_contents("points_main_2.txt"));
  $array_3 = explode(";", file_get_contents("points_main_3.txt"));
  $array_4 = explode(";", file_get_contents("points_main_4.txt"));
  $array_sec = explode("___", file_get_contents("points_sec3.txt"));
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
var myVar;

  function initialize() {
    //Revisa si el usuario tiene habilitada la opción de geolocalización.
    var promise = createMap();
    promise.then(function(){
      myVar = setInterval(function(){myTimer()}, 2000);

      var direction = 1;
      var alpha = 0.4;
      setInterval(function() {
          if ((alpha > 0.5) || (alpha < 0.02)) {
              direction *= -1;
          }
          alpha += direction * 0.01;

          circle.setOptions({fillOpacity: alpha,strokeOpacity:alpha});
      }, 20);
    });
  }

  function myTimer() {
    var promise2 = getCoordinates();
    promise2.then(function(){
      if(acc <= 100){
        currentPosition = new google.maps.LatLng(currentLat,currentLong);
        markerHome.setPosition(currentPosition);
        circle.setRadius(acc);
        circle.bindTo('center', markerHome, 'position');
        $('#warning').css("display","none");
      }else{
        $('#warning').css("display","block");
      }
    });
  }

  var geoOptions = {
    maxWait: 10000, // Default 10 seconds
    desiredAccuracy: 20, // Default 20 meters
    timeout: 10000, // Default to maxWait
    maximumAge: 0, // Force current
    enableHighAccuracy: true,
  };

  function getCoordinates(){
    var deferred2 = $.Deferred();
    if (geoPosition.init()) {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError,geoOptions);
    }
    function geoSuccess(p) {
      //Extrae los valores de latitud y longitud de la ubicación del usuario.
      currentLat = p.coords.latitude;
      currentLong = p.coords.longitude;
       
      acc = p.coords.accuracy;

      //currentPosition = new google.maps.LatLng("11.0195582407767","-74.84744489192963");
      deferred2.resolve();
    }
    return deferred2.promise();
  }


  function createMap(){
    //Genera el mapa.
    var deferred = $.Deferred();
    map = new google.maps.Map(
    document.getElementById('map'), {
      center: new google.maps.LatLng(11.020673, -74.849271),
      zoom: 20,
      maxZoom: 19,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    bound2 = new google.maps.LatLng(11.01675, -74.853190); //Bottom left
    bound3 = new google.maps.LatLng(11.025130, -74.844680); //Top right

    var limites_imagen2 = new google.maps.LatLngBounds(bound2, bound3);
    var imagen = new google.maps.GroundOverlay("img/map_v2.png", limites_imagen2,{opacity:1});
    //Se superpone la imagen en el mapa.
    imagen.setMap(map);

    //marker posicion actual
    markerHome = new google.maps.Marker({
        icon: 'img/tipologies_over/male-2.png',
        map: map,

    });
    circle = new google.maps.Circle({
      map: map,
      strokeColor: '#FF0000',
      strokeOpacity: 0.35,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    });
    var content = "<div class='markerTitle'> Usted está aquí!</div>";
    bindInfoWindow(markerHome,map,content);

    setCenterMap(0,map);
    google.maps.event.addListener(map, "click", function(){
      infoWindow.close();
    });

    google.maps.event.addListener(imagen, "click", function(){
      infoWindow.close();
    });

    setTimeout(function() {
          deferred.resolve();
        }, 500);

    return deferred.promise();
  }

  function setCenterMap(flagMarker, map){
    //Funcion que centra el mapa por defecto
    var center = new google.maps.LatLng(11.019304, -74.850773);
    map.setCenter(center);
    map.setZoom(16);
    if(flagMarker === 0){
      createMarkers(map);
    }
  }

  //Avisa al usuario que debe habilitar la opción de geolocalización en su dispositvo para poder acceder a la característica.
  function geoError(err){
    //alert('Tu dispositivo y/o navegador tiene(n) deshabilitada la opción de geolocalización. Favor ir a Ajustes->Acceso a la ubicación y habilitar esta opción');
    //alert('ERROR(' + err.code + '): ' + err.message);//$('nav').css("display","none");
    //clearInterval(my)
  }

  function createMarkers(){
    if ( !createMarkers.markerList ){
      createMarkers.markerList = sublocations.map( (sublocation, index) => {
        let iconStr = "red-dot.png";
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(sublocation.latitud, sublocation.longitud),
          icon: 'img/tipologies_over/' + iconStr,
          title: sublocation.id + ''
        });
        
        //Añade tooltip de comentario
        var content = $("<div class='markerInfoWin'> " +
                          "<div class='markerTitle'>"+sublocation.sublocation+"</div> " +
                          "<div class='markerInfo'>" +
                            "<div class='markerDescription'>"+sublocation.location+"</div>" +
                          "</div>" +
                          "<div class='button-container'>"+
                            "<button onclick='routeDraw("+ index +")' >LLevame aquí!</button>" +
                            "<button class='button-delete' onclick='removeMarker("+ index +")' style='padding-left: 0'>Borrar Marcador</button>" +
                          "</div>" +
                        "</div></br>");
  
        infoWindow = new google.maps.InfoWindow({
          content: '',
          maxWidth: 200
        });

        //Bind de información del lugar
        bindInfoWindow(marker, map, content[0]);
        return marker;
      });
    }

    return createMarkers.markerList;
  }

  function showMarkers(map, category_id, shouldShowMarker){
    eraseRoutes();
    sublocations.forEach( (sublocation, index) => {
      if(sublocation.category_id === category_id){
        let marker = createMarkers.markerList[index];

        if(shouldShowMarker){
          marker.setMap(map);
          LatLngList.push(marker.getPosition());
        }else{
          marker.setMap(null);
          //Borra la longitud y latitud de la lista
          LatLngList.splice(LatLngList.indexOf(marker.getPosition()),1);
        }
      }
    });

    adjustZoom(map);
  }

  function removeMarker(sublocationIndex){
    let marker = createMarkers.markerList[sublocationIndex];

    if(marker.getMap()){
      marker.setMap(null);
      eraseRoutes();
      
      //Borra la longitud y latitud de la lista
      LatLngList.splice(LatLngList.indexOf(marker.getPosition()),1);
    }
  };

  function searchMarkers(map, sublocationId){
		clearMap();
    let sublocationIndex = sublocations.findIndex( sublocation => sublocation.id === sublocationId);
    let marker = createMarkers.markerList[sublocationIndex];

    if(marker.getMap() == null){
      marker.setMap(map);
      LatLngList.push(marker.getPosition());
      adjustZoom(map);
    }

    setTimeout(() => {
      $($(`div[title|='${sublocationId}']`)[0]).trigger( "click" );
    }, 200);
  }

  function adjustZoom(map){
    //Adjusta el zoom de acuerdo a los marcadores visibles
    if(currentPosition){
      LatLngList.push(currentPosition);
      infoWindow.close();
      if(LatLngList.length > 1){
        var bounds = new google.maps.LatLngBounds();
        LatLngList.forEach(function(n){
          bounds.extend(n);
        });
        map.fitBounds(bounds);
        if(map.getZoom()>19){
          map.setZoom(19);
        }
      }else{
        setCenterMap(1,map);
      }
      LatLngList.splice(LatLngList.length-1);
    }
  }

  function bindInfoWindow(marker, map, html) {
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.close();
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
  }

  function createPolylineObject(coordinates){
    globalRoute = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: '#820000',
      strokeOpacity: 0.8,
      strokeWeight: 6
    });

    return globalRoute;
  }

  function mapBoxCoordinates(destination){ 
    //Mapbox access token
    let access_token = 'pk.eyJ1Ijoic2FtbXgzNDMiLCJhIjoiY2s0b2NqZTdyMjFyNjNvcXMzbTlyeXcwcSJ9.joQTa1ilodClArdsyWeqog';

    $.ajax({
      url: `https://api.mapbox.com/directions/v5/mapbox/walking/;${destination.longitud},${destination.latitud}.json?`,
      type: "get",
      data: { 
        geometries: 'polyline', 
        alternatives: false, 
        steps: true,
        overview: 'full',
        access_token
      },
      success: function(response) {
        let coordinates = response.routes[0].legs[0].steps;

        coordinates = coordinates.map( coor => {
          let newCoord = coor.intersections[0].location;
          return { lat: newCoord[1], lng: newCoord[0]};
        });
      
        createPolylineObject(coordinates).setMap(map);
      },
      error: function(xhr) {
        //Do Something to handle error
      }
    });
  }

  function graphHopperCoordinates(currentPosition, destination){
    //GraphHopper access token
    let access_token = '7ee1850a-3ffa-4d42-b2ac-33a585f9125a';

    $.ajax({
      url: `https://graphhopper.com/api/1/route?point=${currentPosition[1]},${currentPosition[0]}&point=${destination.latitud},${destination.longitud}`,
      type: "get",
      data: { 
        type: 'json',
        locale: 'es-ES',
        vehicle: 'foot',
        key: access_token,
        turn_costs: false,
        points_encoded: false
      },
      success: function(response) {
        var coordinates = response.paths[0].points.coordinates;
      
        coordinates = coordinates.map( coord => {
          return { lat: coord[1], lng: coord[0]};
        });

        createPolylineObject(coordinates).setMap(map);
      },
      error: function(xhr) {
        //Do Something to handle error
      }
    });
  }

  function eraseRoutes(){
    if(Object.keys(globalRoute).length){
      globalRoute.setMap(null);
    }
  }

  function routeDraw(ini){
    //Closes pointer tooltip to show the route
    $($('button[title|=Cerrar')[0]).trigger( "click" );
    
    let destination = sublocations[ini];
    let currentPosition = [-74.85057,11.01995];

    eraseRoutes();
    
    //Draws route with the mapbox api
    //mapBoxCoordinates();
   
    //Draws route with the graphhopper api
    graphHopperCoordinates(currentPosition, destination);

    return;
  }

  function searchInRoute(route,location){
    min = 100;
    pos = 0;
    for (var i = 0; i < route.length; i++) {
      key = Math.sqrt( Math.pow(Math.abs(location.split(",")[1] - route[i].split(",")[1]),2) + Math.pow(Math.abs(location.split(",")[0] - route[i].split(",")[0]),2));
      if(key < min){
        min = key;
        pos = i;
      }
    };
    return pos;
  }

  function copyArray(original){
    var copy = [];
    for (var i = 0; i < original.length; i++) {
      copy[i] = original[i];
    };
    return copy;
  }
  function searchmin(path_array){
    min = 10000;
    pos = 0;
    for (var i = 0; i< path_array.length; i++){
      path = path_array[i];
      new_path = [];
      distance = 0;
      counter = 0;
      for (var j = 0;j < path.length; j++) {
        if(path[j].length> 10){
          new_path[counter] = path[j];
          if(counter!=0){
            distance += Math.sqrt( Math.pow(Math.abs(new_path[counter].split(",")[1] - new_path[counter - 1].split(",")[1]),2) + Math.pow(Math.abs(new_path[counter].split(",")[0] - new_path[counter - 1].split(",")[0]),2));;
          }
          counter++;
        }
      };
      if(distance < min){
        min = distance;
        pos = i;
      }
      path_array[i] = new_path;
    }
    return pos;
  }
  function adjustCurve(path,position){
    path[position] = (parseFloat(path[position - 1].split(",")[0]) + parseFloat(path[position + 1].split(",")[0]))/2 + "," + (parseFloat(path[position - 1].split(",")[1]) + parseFloat(path[position + 1].split(",")[1]))/2;
  }
  function validateConection(conection,all){
    for (var i = 0; i < all.length; i++) {
      if(all[i].split(",")[0] == conection){
        return false;
      }
    };
    return true;
  }


  google.maps.event.addDomListener(window, 'load', initialize);
