
var LatLngList = [];
var myVar;

  function initialize() {
    //Revisa si el usuario tiene habilitada la opción de geolocalización.
    var promise = createMap();

  }

  function createMap(){
    //Genera el mapa.
    var deferred = $.Deferred();
    map = new google.maps.Map(
    document.getElementById('map'), {
      center: new google.maps.LatLng(11.019304, -74.850773),
      zoom: 16,
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

    bound2 = new google.maps.LatLng(11.016413, -74.853002);
    bound3 = new google.maps.LatLng(11.022114, -74.844934);
    var limites_imagen2 = new google.maps.LatLngBounds(bound2, bound3);
    var imagen = new google.maps.GroundOverlay("img/mapa2.png", limites_imagen2,{opacity:1});
    //Se superpone la imagen en el mapa.
    imagen.setMap(map);

    setCenterMap(0,map,new google.maps.LatLng(11.019304, -74.850773));
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


  function setCenterMap(flagMarker,map,center){
    //Funcion que centra el mapa por defecto
    map.setCenter(center);
    map.setZoom(18);
    if(flagMarker === 0){
      createMarkers(map);
    }
  }

  //Avisa al usuario que debe habilitar la opción de geolocalización en su dispositvo para poder acceder a la característica.
  function geoError(){
    console.log("ok")
    //alert('Tu dispositivo y/o navegador tiene(n) deshabilitada la opción de geolocalización. Favor ir a Ajustes->Acceso a la ubicación y habilitar esta opción');
    //$('nav').css("display","none");
    //clearInterval(my)
  }

  function createMarkers(){

    for (var j = 0; j < matrixMarkers.length;  j++) {
      //Revisa si la categoría a la cual pertenece el marker, se encuentra seleccionada.
      if(matrixMarkers[j][7] == idMark){
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(matrixMarkers[j][1],matrixMarkers[j][2]),
          icon: 'img/tipologies_over/red-dot.png',
          map: map,
        });

        //Extrae la información respectiva del sitio.
        var content = $("<div class='markerInfoWin'> " +
                          "<div class='markerTitle'>"+matrixMarkers[j][0]+"</div> " +
                          "<div class='markerInfo'>" +
                            "<div class='markerDescription'>"+matrixMarkers[j][4]+"</div>" +
                          "</div>" +
                        "</div></br>");
        infoWindow = new google.maps.InfoWindow({
          content: '',
          maxWidth: 200
        });
        //Funcion que agrega la información al marker descrito.
        bindInfoWindow(marker, map, content[0]);
        markers.push(marker);
        LatLngList.push(new google.maps.LatLng(matrixMarkers[j][1],matrixMarkers[j][2]));
        adjustZoom(map);
      }
    };
  }


  function adjustZoom(map){
    //Adjusta el zoom de acuerdo a los marcadores visibles


    if(LatLngList.length > 1){
      var bounds = new google.maps.LatLngBounds();
      LatLngList.forEach(function(n){
        bounds.extend(n);
      });
      map.fitBounds(bounds);
    }else{
      setCenterMap(1,map,LatLngList[0]);
    }
    LatLngList.splice(LatLngList.length-1);

  }

  function bindInfoWindow(marker, map, html) {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.close();
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
  }


  google.maps.event.addDomListener(window, 'load', initialize);
