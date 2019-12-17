
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

    //Define los límites de la imagen a superponer sobre el layout de google maps.
    // bound1 = new google.maps.LatLng(11.016813, -74.853152);
    // bound2 = new google.maps.LatLng(11.021414, -74.844984);
    // var x1 = new google.maps.LatLng(11.016813, -74.853202);
    // var x2 = new google.maps.LatLng(11.021454, -74.844784);
    // var limites_imagen = new google.maps.LatLngBounds(bound1, bound2);
    // var imagen = new google.maps.GroundOverlay("img/Mapa_Uninorte_Uninorte.CO.png", limites_imagen,{opacity:0.3});
    //Se superpone la imagen en el mapa.
    // //imagen.setMap(map);
    // bound2 = new google.maps.LatLng(11.016753, -74.853192);
    // bound3 = new google.maps.LatLng(11.021834, -74.844984);
    // var limites_imagen = new google.maps.LatLngBounds(bound2, bound3);
    // var imagen = new google.maps.GroundOverlay("img/mapa_uninorte.png", limites_imagen,{opacity:0.3});
    // //Se superpone la imagen en el mapa.
    // imagen.setMap(map);

    bound2 = new google.maps.LatLng(11.016700, -74.853140); //Bottom left
    bound3 = new google.maps.LatLng(11.025050, -74.844680); //Top right

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


  function setCenterMap(flagMarker,map){
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
        });
        
        //Añade tooltip de comentario
        var content = $("<div class='markerInfoWin'> " +
                          "<div class='markerTitle'>"+sublocation.sublocation+"</div> " +
                          "<div class='markerInfo'>" +
                            "<div class='markerDescription'>"+sublocation.location+"</div>" +
                          "</div>" +
                          "<div class='button-container'>"+
                            "<button onclick='routeDraw("+ index +")' >LLevame aquí!</button>" +
                            "<button class='button-delete' onclick='removeMarker("+ index +")' >Borrar</button>" +
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
      
      //Borra la longitud y latitud de la lista
      LatLngList.splice(LatLngList.indexOf(marker.getPosition()),1);
    }
  };

  function searchMarkers(map, sublocation_id){
    let sublocationIndex = sublocations.findIndex( sublocation => sublocation.id === sublocation_id);
    let marker = createMarkers.markerList[sublocationIndex];

    if(marker.getMap() == null){
      marker.setMap(map);
      LatLngList.push(marker.getPosition());
      adjustZoom(map);
    }
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

  function routeDraw(ini){
    for(var i = 0; i< polyline.length; i++){
      polyline[i].setMap(null);
    }

    if(currentLat > bound2.lat() && currentLat < bound3.lat() && currentLong > bound2.lng() && currentLong < bound3.lng()){
      var promise = showAlert();
      promise.then(function() {
        var promise2 = draw();
        promise2.then(function() {
          hide();
        });
      });
      function showAlert(){
        var deferred = $.Deferred();
        clearInterval(myVar);
        $('#loadingWrap').css("display","block");
        setTimeout(function() {
          deferred.resolve();
        }, 100);

        return deferred.promise();
      }
      function draw(){
        var deferred2 = $.Deferred();
        start = currentPosition;
        //end = markers[ini].position;
        end = new google.maps.LatLng(matrixMarkers[ini][5],matrixMarkers[ini][6]);
        out = -1;
        outIndex = -1;
        main_key = 0;
        ruta_temp = [];
        //end = new google.maps.LatLng("11.020553420266257","-74.85085934400558");
        for (var home = 0; home < 2; home++) {
          var pathPolyline = [];
          routeIni = [start.lat() + "," + start.lng()];
          pathPolyline = [];
          //pathPolyline = [start];
          //se encuentra el punto mas cercano entre rutas secundarias y principales
          min_start = 100;
          min_end = 100;
          pos_start = 0;
          pos_end = 0;
          for (var i = 0; i < route1.length; i++) {
            if(out != 1){
              key_start = Math.sqrt( Math.pow(Math.abs(start.lng() - route1[i].split(",")[1]),2) + Math.pow(Math.abs(start.lat() - route1[i].split(",")[0]),2));
              key_end = Math.sqrt( Math.pow(Math.abs(end.lng() - route1[i].split(",")[1]),2) + Math.pow(Math.abs(end.lat() - route1[i].split(",")[0]),2));
              if( key_start < min_start ){
                min_start = key_start;
                pos_start = i;
              }
              if( key_end < min_end ){
                min_end = key_end;
                pos_end = i;
              }
            }
          };
          min_start2 = 100;
          min_end2 = 100;
          pos_start2 = 0;
          pos_end2 = 0;
          for (var i = 0; i < route2.length; i++) {
            if(out != 2){
              key_start = Math.sqrt( Math.pow(Math.abs(start.lng() - route2[i].split(",")[1]),2) + Math.pow(Math.abs(start.lat() - route2[i].split(",")[0]),2));
              key_end = Math.sqrt( Math.pow(Math.abs(end.lng() - route2[i].split(",")[1]),2) + Math.pow(Math.abs(end.lat() - route2[i].split(",")[0]),2));
              if( key_start < min_start2 ){
                min_start2 = key_start;
                pos_start2 = i;
              }
              if( key_end < min_end2 ){
                min_end2 = key_end;
                pos_end2 = i;
              }
            }
          };
          min_start3 = 100;
          min_end3 = 100;
          pos_start3 = 0;
          pos_end3 = 0;
          for (var i = 0; i < route3.length; i++) {
            if(out != 3){
              key_start = Math.sqrt( Math.pow(Math.abs(start.lng() - route3[i].split(",")[1]),2) + Math.pow(Math.abs(start.lat() - route3[i].split(",")[0]),2));
              key_end = Math.sqrt( Math.pow(Math.abs(end.lng() - route3[i].split(",")[1]),2) + Math.pow(Math.abs(end.lat() - route3[i].split(",")[0]),2));
              if( key_start < min_start3 ){
                min_start3 = key_start;
                pos_start3 = i;
              }
              if( key_end < min_end3 ){
                min_end3 = key_end;
                pos_end3 = i;
              }
            }
          };
          min_start4 = 100;
          min_end4 = 100;
          pos_start4 = 0;
          pos_end4 = 0;
          for (var i = 0; i < route4.length; i++) {
            if(out != 4){
              key_start = Math.sqrt( Math.pow(Math.abs(start.lng() - route4[i].split(",")[1]),2) + Math.pow(Math.abs(start.lat() - route4[i].split(",")[0]),2));
              key_end = Math.sqrt( Math.pow(Math.abs(end.lng() - route4[i].split(",")[1]),2) + Math.pow(Math.abs(end.lat() - route4[i].split(",")[0]),2));
              if( key_start < min_start4 ){
                min_start4 = key_start;
                pos_start4 = i;
              }
              if( key_end < min_end4 ){
                min_end4 = key_end;
                pos_end4 = i;
              }
            }
          };
          min_start_sec = 100;
          min_end_sec = 100;
          pos_start_sec = 0;
          pos_start_sec_2 = 0;
          pos_end_sec = 0;
          pos_end_sec_2 = 0;
          for (var i = 0; i < routes_sec.length; i++) {
            if((out == 5 && outIndex != i) || (out != 5)){
              route = routes_sec[i].split(";");
              if(route!= ""){
                for (var j = 0; j < route.length; j++) {
                  key_start = Math.sqrt( Math.pow(Math.abs(start.lng() - route[j].split(",")[1]),2) + Math.pow(Math.abs(start.lat() - route[j].split(",")[0]),2));
                  key_end = Math.sqrt( Math.pow(Math.abs(end.lng() - route[j].split(",")[1]),2) + Math.pow(Math.abs(end.lat() - route[j].split(",")[0]),2));
                  if( key_start < min_start_sec ){
                    min_start_sec = key_start;
                    pos_start_sec = i;
                    pos_start_sec_2 = j;
                  }
                  if( key_end < min_end_sec ){
                    min_end_sec = key_end;
                    pos_end_sec = i;
                    pos_end_sec_2 = j;
                  }
                };
              }
            }
          };
          entrada_array = [min_start,min_start2,min_start3,min_start4,min_start_sec];
          entrada = entrada_array.indexOf(Math.min.apply(Math,entrada_array));
          salida_array = [min_end,min_end2,min_end3,min_end4,min_end_sec];
          salida = salida_array.indexOf(Math.min.apply(Math,salida_array));
          pos_start_array = [pos_start,pos_start2,pos_start3,pos_start4,pos_start_sec];
          pos_end_array = [pos_end,pos_end2,pos_end3,pos_end4,pos_end_sec];
          lat_start_array = [route1[pos_start].split(",")[0],route2[pos_start2].split(",")[0],route3[pos_start3].split(",")[0],route4[pos_start4].split(",")[0],routes_sec[pos_start_sec].split(";")[pos_start_sec_2].split(",")[0]];
          lng_start_array = [route1[pos_start].split(",")[1],route2[pos_start2].split(",")[1],route3[pos_start3].split(",")[1],route4[pos_start4].split(",")[1],routes_sec[pos_start_sec].split(";")[pos_start_sec_2].split(",")[1]];
          lat_end_array = [route1[pos_end].split(",")[0],route2[pos_end2].split(",")[0],route3[pos_end3].split(",")[0],route4[pos_end4].split(",")[0],routes_sec[pos_end_sec].split(";")[pos_end_sec_2].split(",")[0]];
          lng_end_array = [route1[pos_end].split(",")[1],route2[pos_end2].split(",")[1],route3[pos_end3].split(",")[1],route4[pos_end4].split(",")[1],routes_sec[pos_end_sec].split(";")[pos_end_sec_2].split(",")[1]];

          routeIni.push(lat_start_array[entrada] + "," + lng_start_array[entrada])
          //pathPolyline.push(new google.maps.LatLng(lat_start_array[entrada],lng_start_array[entrada]));
          out = entrada + 1;
          if(entrada != 4){
            pos_start_sec = - entrada - 1;
          }
          if(salida != 4){
            pos_end_sec = - salida - 1;
          }
          outIndex = pos_start_sec;
          if(pos_start_sec == pos_end_sec){
            main_key = 1;
            home = 3;
            if(pos_start_sec < 0){
              if( pos_start_array[entrada] > pos_end_array[salida]){
                for (var j = pos_start_array[entrada]; j >= pos_end_array[salida] ; j--) {
                  //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[entrada][j].split(",")[0],MatrixRoutes[entrada][j].split(",")[1]));
                  routeIni.push(MatrixRoutes[entrada][j].split(",")[0] + "," + MatrixRoutes[entrada][j].split(",")[1]);
                  //route.push(MatrixRoutes[4][pos_start_sec].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][pos_start_sec].split(";")[j].split(",")[1]);

                };
              }else{
                for (var j = pos_start_array[entrada]; j <= pos_end_array[salida] ; j++) {
                  //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[entrada][j].split(",")[0],MatrixRoutes[entrada][j].split(",")[1]));
                  routeIni.push(MatrixRoutes[entrada][j].split(",")[0] + "," + MatrixRoutes[entrada][j].split(",")[1]);
                  //route.push(MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[1]);

                };
              }
            }else{
              if( pos_start_sec_2 > pos_end_sec_2){
                for (var j = pos_start_sec_2; j >= pos_end_sec_2 ; j--) {
                  //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[4][pos_start_sec].split(";")[i].split(",")[0],MatrixRoutes[4][pos_start_sec].split(";")[i].split(",")[1]));
                  routeIni.push(MatrixRoutes[4][pos_start_sec].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][pos_start_sec].split(";")[j].split(",")[1]);
                  //route.push(MatrixRoutes[4][pos_start_sec].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][pos_start_sec].split(";")[j].split(",")[1]);

                };
              }else{
                for (var j = pos_start_sec_2; j <= pos_end_sec_2 ; j++) {
                  //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[4][pos_start_sec].split(";")[i].split(",")[0],MatrixRoutes[4][pos_start_sec].split(";")[i].split(",")[1]));
                  routeIni.push(MatrixRoutes[4][pos_start_sec].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][pos_start_sec].split(";")[j].split(",")[1]);
                  //route.push(MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[1]);

                };
              }
            }
            routeIni.push(end.lat() + "," + end.lng());
            for (var i = 0; i< routeIni.length;i++) {
              if(i != 0 && i != routeIni.length - 1){
                adjustCurve(routeIni,i);
              }
              pathPolyline.push(new google.maps.LatLng(routeIni[i].split(",")[0],routeIni[i].split(",")[1]));
            }
              pathPolyline.push(end);
              polyline[counterPolylines] = new google.maps.Polyline({
                path: pathPolyline,
                strokeColor: '#FF0000',
                strokeOpacity: 0.5,
                strokeWeight: 10,
                map: map
              });

          }else{
            //se busca con que rutas principales conecta la ruta secundaria
            //alert("entre");
            if(entrada == 4){
              connections_start = routes_sec[pos_start_sec].split("[")[1].split(";");
            }else{
              connections_start = [(entrada + 1) + "," + pos_start_array[entrada]];
            }
            if(salida == 4){
              connections_end = routes_sec[pos_end_sec].split("[")[1].split(";");
            }else{
              connections_end = [(salida + 1) + "," + pos_end_array[salida]];
            }
            new_conections2 = copyArray(connections_start);
            all_conections = [];
            old_route = [];
            array_of_routes = [];
            finished_routes = [];
            old_array_of_routes = [];
            position_conection = pos_start_sec_2;
            route_of_conection = pos_start_sec;
            new_conections3 = [];
            for (var i = 0;i < 3 ; i++) {
              //se repite el ciclo 3 veces para buscar diferentes combinaciones de rutas
              new_conections = copyArray(new_conections2);
              new_conections2 = [];
              //alert("length: " + new_conections.length);
              for (var counter_start = 0; counter_start < new_conections.length; counter_start++) {
                //ruta desde punto de conexion anterior (o inicial) hasta ruta principal de esa conexion
                conection = new_conections[counter_start];
                if(i != 0){
                  route = [];
                  route = copyArray(old_array_of_routes[counter_start]);
                  //alert(old_array_of_routes.length + "__" + old_array_of_routes[old_array_of_routes.length -1]);
                  //alert(route);
                  route_old_number = parseInt(route[route.length - 7]);
                  star_over_main_route = parseInt(route[route.length - 6]);
                  end_over_main_route = parseInt(route[route.length - 5]);
                  start_over_sec_route = parseInt(route[route.length - 4].split(";")[1]);
                  end_over_sec_route = parseInt(route[route.length - 3].split(";")[1]);
                  route_of_conection = parseInt(route[route.length - 3].split(";")[0]);
                  route_new_number = parseInt(route[route.length - 2]);

                  //alert("s: " + start_over_sec_route +", e: " + end_over_sec_route);
                  //ruta entre puntos de conexion sobre ruta principal
                  if( end_over_main_route > star_over_main_route){
                    for (var j = star_over_main_route; j <= end_over_main_route ; j++) {
                      //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[common[0]-1][i].split(",")[0],MatrixRoutes[common[0]-1][i].split(",")[1]));
                      route.push(MatrixRoutes[route_old_number - 1][j].split(",")[0] + "," + MatrixRoutes[route_old_number - 1][j].split(",")[1]);

                    };
                  }else{
                    //alert("old_number: " + route_old_number);
                    for (var j = star_over_main_route; j >= end_over_main_route ; j--) {
                      //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[common[0]-1][i].split(",")[0],MatrixRoutes[common[0]-1][i].split(",")[1]));
                      route.push(MatrixRoutes[route_old_number - 1][j].split(",")[0] + "," + MatrixRoutes[route_old_number - 1][j].split(",")[1]);

                    };
                  }

                  if( end_over_sec_route > start_over_sec_route){
                    for (var j = start_over_sec_route; j <= end_over_sec_route ; j++) {
                      //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[4][pos_start_sec].split(";")[i].split(",")[0],MatrixRoutes[4][pos_start_sec].split(";")[i].split(",")[1]));
                      route.push(MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[1]);

                    };
                  }else{
                    for (var j = start_over_sec_route; j >= end_over_sec_route ; j--) {
                      //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[4][route_of_conection].split(";")[i].split(",")[0],MatrixRoutes[4][route_of_conection].split(";")[i].split(",")[1]));
                      route.push(MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[1]);

                    };
                  }

                }else{
                  route = [];
                  route_new_number = connections_start[counter_start].split(",")[0];
                  distance = 0;
                  if(entrada == 4){
                    if( position_conection > conection.split(",")[1]){
                      for (var j = position_conection; j >= conection.split(",")[1] ; j--) {
                        //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[4][pos_start_sec].split(";")[i].split(",")[0],MatrixRoutes[4][pos_start_sec].split(";")[i].split(",")[1]));
                        route.push(MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[1]);

                      };
                    }else{
                      for (var j = position_conection; j <= conection.split(",")[1] ; j++) {
                        //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[4][route_of_conection].split(";")[i].split(",")[0],MatrixRoutes[4][route_of_conection].split(";")[i].split(",")[1]));
                        route.push(MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][route_of_conection].split(";")[j].split(",")[1]);

                      };
                    }
                  }
                }

                route.push(conection.split(",")[0]);
                if(entrada == 4 || i != 0){
                  point_in_route_start = searchInRoute(MatrixRoutes[ conection.split(",")[0] - 1],routes_sec[route_of_conection].split(";")[conection.split(",")[1]]);
                }else{
                  point_in_route_start = connections_start[counter_start].split(",")[1];
                }
                route.push(point_in_route_start);

                //nuevas conexiones
                if(i!=2){
                  for (var j = 0; j < MatrixRoutes[4].length; j++) {
                    //alert("ruta_sec: " + j + "ruta_main: " + route_old_number);
                    route_base = [];
                    route_base = copyArray(route);
                    sw = 0;

                    if(j != route_of_conection){
                      connections = routes_sec[j].split("[")[1].split(";");

                      for (var k = 0; k < connections.length; k++) {
                        if(connections[k].split(",")[0] == route_new_number && connections.length > 1){
                          //new_conections2.push(connections[k]);
                          //new_conections3.push(counter_start);
                          route_base.push(searchInRoute(MatrixRoutes[ conection.split(",")[0] - 1],routes_sec[j].split(";")[connections[k].split(",")[1]]));
                          route_base.push(j + ";" + connections[k].split(",")[1]);
                          sw = 1;
                          k = connections.length;
                        }
                      };

                      if(sw == 1){
                        for (var k = 0; k < connections.length; k++) {
                          route_mid = [];
                          route_mid = copyArray(route_base);

                            if(validateConection(connections[k].split(",")[0],all_conections) && connections[k].split(",")[0] != conection.split(",")[0]){
                              new_conections2.push(connections[k]);
                              new_conections3.push(counter_start);
                              route_mid.push(j + ";" + connections[k].split(",")[1]);
                              route_mid.push(connections[k].split(",")[0]);
                              route_mid.push(distance);
                              //alert(route_mid);
                              array_of_routes.push(route_mid);
                              //route.push(searchInRoute(MatrixRoutes[ conection.split(",")[0]],routes_sec[j].split(";")[connections[k].split(",")[1]]));
                            }

                        };
                      }
                    }
                  };
                }

                for (var counter_end = 0; counter_end < connections_end.length; counter_end++) {
                  route_continue = route.slice(0,-2);
                  if(new_conections[counter_start].split(",")[0] == connections_end[counter_end].split(",")[0]){
                    //ruta directa
                    //ruta entre puntos de conexion sobre ruta principal
                    if(salida == 4){
                      point_in_route_end = searchInRoute(MatrixRoutes[ conection.split(",")[0] - 1],routes_sec[pos_end_sec].split(";")[connections_end[counter_end].split(",")[1]]);
                    }else{
                      point_in_route_end = connections_end[counter_end].split(",")[1];
                    }
                    if( point_in_route_end > point_in_route_start){
                      for (var j = point_in_route_start; j <= point_in_route_end ; j++) {
                        //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[common[0]-1][i].split(",")[0],MatrixRoutes[common[0]-1][i].split(",")[1]));
                        route_continue.push(MatrixRoutes[conection.split(",")[0] - 1][j].split(",")[0] + "," + MatrixRoutes[conection.split(",")[0] - 1][j].split(",")[1])

                      };
                    }else{
                      for (var j = point_in_route_start; j >= point_in_route_end ; j--) {
                        //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[common[0]-1][i].split(",")[0],MatrixRoutes[common[0]-1][i].split(",")[1]));
                        route_continue.push(MatrixRoutes[conection.split(",")[0] - 1][j].split(",")[0] + "," + MatrixRoutes[conection.split(",")[0] - 1][j].split(",")[1])

                      };
                    }
                    //ruta entre punto de conexion en ruta principal hasta punto de salida
                    if(salida == 4){
                      if( pos_end_sec_2 > connections_end[counter_end].split(",")[1]){
                        for (var j = connections_end[counter_end].split(",")[1]; j <= pos_end_sec_2 ; j++) {
                          //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[4][pos_end_sec].split(";")[i].split(",")[0],MatrixRoutes[4][pos_end_sec].split(";")[i].split(",")[1]));
                          route_continue.push(MatrixRoutes[4][pos_end_sec].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][pos_end_sec].split(";")[j].split(",")[1]);

                        };
                      }else{
                        for (var j = connections_end[counter_end].split(",")[1]; j >= pos_end_sec_2 ; j--) {
                          //pathPolyline.push(new google.maps.LatLng(MatrixRoutes[4][pos_end_sec].split(";")[i].split(",")[0],MatrixRoutes[4][pos_end_sec].split(";")[i].split(",")[1]));
                          route_continue.push(MatrixRoutes[4][pos_end_sec].split(";")[j].split(",")[0] + "," + MatrixRoutes[4][pos_end_sec].split(";")[j].split(",")[1]);

                        };
                      }
                    }
                    finished_routes.push(route_continue);
                    counter_end = connections_end.length;

                  }

                };
                //alert("__5" + old_array_of_routes.length + "__" + old_array_of_routes[old_array_of_routes.length -1]);
                //Actualizar parametros
                //alert(new_conections2);
                route = [];
              };
              old_array_of_routes = copyArray(array_of_routes);
              //alert("longitud conexiones anteriores: " + old_array_of_routes.length);
              array_of_routes = [];
              //alert("new_conections3: " + new_conections3);
              old_conections3 = copyArray(new_conections3);
              new_conections3 = [];
              for (var k = 0; k < new_conections2.length; k++) {
                all_conections.push(new_conections2[k].split(",")[0]);
              };

            };
            ruta_temp.push(finished_routes[searchmin(finished_routes)]);
          }
        };
        // if(main_key == 0){
        //   ruta = searchmin(finished_routes);
        //   for (var i = 0; i< finished_routes[ruta].length;i++) {
        //     if(finished_routes[ruta][i].length> 10){
        //       pathPolyline.push(new google.maps.LatLng(finished_routes[ruta][i].split(",")[0],finished_routes[ruta][i].split(",")[1]));
        //     }
        //   }
        //     pathPolyline.push(end);
        //     polyline[counterPolylines] = new google.maps.Polyline({
        //       path: pathPolyline,
        //       strokeColor: '#000000',
        //       strokeOpacity: 0.5,
        //       strokeWeight: 10,
        //       map: map
        //     });
        // }

        pathPolyline = [start];
        if(main_key == 0){
          ruta = searchmin(ruta_temp);
          for (var i = 0; i< ruta_temp[ruta].length;i++) {
            if(i != 0 && i != ruta_temp[ruta].length - 1){
              // if(parseFloat(ruta_temp[ruta][i].split(",")[0]) > parseFloat(finished_routes[ruta][i - 1].split(",")[0]) && parseFloat(finished_routes[ruta][i].split(",")[0]) > parseFloat(finished_routes[ruta][i + 1].split(",")[0])){
              //   adjustCurve(finished_routes[ruta],i);
              // }else if (parseFloat(finished_routes[ruta][i].split(",")[0]) < parseFloat(finished_routes[ruta][i - 1].split(",")[0]) && parseFloat(finished_routes[ruta][i].split(",")[0]) < parseFloat(finished_routes[ruta][i + 1].split(",")[0])){
              //   adjustCurve(finished_routes[ruta],i);
              // }else if (parseFloat(finished_routes[ruta][i].split(",")[1]) > parseFloat(finished_routes[ruta][i - 1].split(",")[1]) && parseFloat(finished_routes[ruta][i].split(",")[1]) > parseFloat(finished_routes[ruta][i + 1].split(",")[1])){
              //   adjustCurve(finished_routes[ruta],i);
              // }else if (parseFloat(finished_routes[ruta][i].split(",")[1]) < parseFloat(finished_routes[ruta][i - 1].split(",")[1]) && parseFloat(finished_routes[ruta][i].split(",")[1]) < parseFloat(finished_routes[ruta][i + 1].split(",")[1])){

              // }
              adjustCurve(ruta_temp[ruta],i);
              //finished_routes[ruta].quadraticCurveTo(finished_routes[ruta][i].split(",")[0], finished_routes[ruta][i].split(",")[1], finished_routes[ruta][i + 1]split(",")[0], finished_routes[ruta][i + 1].split(",")[1]);
            }
            pathPolyline.push(new google.maps.LatLng(ruta_temp[ruta][i].split(",")[0],ruta_temp[ruta][i].split(",")[1]));
          }
            pathPolyline.push(end);
            polyline[counterPolylines] = new google.maps.Polyline({
              path: pathPolyline,
              strokeColor: '#FF0000',
              strokeOpacity: 0.5,
              strokeWeight: 10,
              map: map
            });
        }

        counterPolylines += 1;
        deferred2.resolve();
        return deferred2.promise();
      };
      function hide(){
        $('#loadingWrap').css({"display":"none"});
        myVar = setInterval(function(){myTimer()}, 2000);
      };
    }else{
      alert("Lo sentimos, este servicio solo esta disponible dentro de la Universidad");
    }


    //pos = searchmin(path_array);
        //pos = searchmin(path_array);

      // for (var i = 0; i< finished_routes[7].length;i++) {
      //   if(finished_routes[7][i].length> 10){
      //     pathPolyline.push(new google.maps.LatLng(finished_routes[7][i].split(",")[0],finished_routes[7][i].split(",")[1]));
      //   }
      // }
      // pathPolyline.push(end);
      // polyline = new google.maps.Polyline({
      //   path: pathPolyline,
      //   strokeColor: '#FF0000',
      //   strokeOpacity: 1.0,
      //   strokeWeight: 10
      // });

      // polyline.setMap(map);

      // pathPolyline2 = [];
      // for (var i = 0; i< finished_routes[8].length;i++) {
      //   if(finished_routes[8][i].length> 10){
      //     pathPolyline2.push(new google.maps.LatLng(finished_routes[8][i].split(",")[0],finished_routes[8][i].split(",")[1]));
      //   }
      // }
      // pathPolyline2.push(end);
      // polyline = new google.maps.Polyline({
      //   path: pathPolyline2,
      //   strokeColor: '#FFFF00',
      //   strokeOpacity: 1.0,
      //   strokeWeight: 10
      // });

      // polyline.setMap(map);
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
