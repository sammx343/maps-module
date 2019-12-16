var trigger = 0; 
var categoriesIndex = new Array(numCategories);
var map;
var markers = [];
var polyline = [];
var markersTemp = [];

//Se innicializa el vector de indíces de las categorías existentes.
for (var i = numCategories - 1; i >= 0; i--) {
	categoriesIndex[i] = 0;
};

//Abre o minimiza el menú desplegable con las caraterísticas disponinbles
function uiControl(){
	if(trigger == 0){
		trigger = 1;
		var top = 30*(1+numCategories);
		$('nav').css({"background-color":"#820000","height":"100%","left":"-150px","width":"150px"});
		$('nav>ul>li').css("background-color","rgba(59,46,46,1)");
		$('nav ul ul li').css({"display":"block"});
		$('#mapOverlay').css({"background-color":"rgba(0,0,0,0.6)","display":"block", "transition": ".5s all"});
		fadeIn();

	}else{
		trigger = 0;
		if($('header').width() == 200 ){
			$('nav').css({"width":"100%"});
		}else{
			$('nav').css({"width":"150px"});
		}
		$('nav').css({"background-color":"rgba(59,46,46,0.4)","height":"32px"});
		$('nav>ul>li').css("background-color","rgba(59,46,46,0.4)");
		$('nav ul ul li').css("display","none");
		$('#map').css("left","0px");
		$('#mapOverlay').css({"background-color":"rgba(0,0,0,0)","display":"none","left":"0px", "transition": ".5s all"});
		$('#map').css({"width":"100%"});
		$('#mapOverlay').css({"width":"100%"});
	}
}

function fadeIn(){
	var indent = -150;
	var fade = function() {
      	$('nav').css("left",indent+"px");
      	$('#map').css("left",(150+indent)+"px");
      	$('#mapOverlay').css("left",(150+indent)+"px");
      	if(indent >= 0){
      		clearInterval(fadeIntVal);
      		$('#map').css({"width":"calc(100% - 150px)"});
      		$('#mapOverlay').css({"width":"calc(100% - 150px)"});
      	}
      	indent += 25;
    }
	var fadeIntVal = setInterval(fade, 25);

}

$(window).resize(function() {
        setTimeout(function() {
              setCenterMap(1,map);
           }, 50)

});

$('nav>ul>li').click(function(){
	uiControl();
});

$('#mapOverlay').click(function(){
	uiControl();
});

//Rutina que controla el comportamiento del mapa al seleccionar o deseleccionar una categoría.
$('nav ul ul li').click(function(event){
	$(event.currentTarget).css("background-color","#820000");
	const CATEGORY_ID = $(event.currentTarget).data('category-id');
	
	console.log(CATEGORY_ID);
	showMarkers(map,CATEGORY_ID);

	return;
	//Sombrea la categoría seleccionada y actualiza el vector de índices.
	if(categoriesIndex[index] === 0){
		categoriesIndex[index] = 1;
		//Actualiza el mapa.
		showMarkers(map,index);
	//Quita la sección de la categoría.
	}else{
		$(this).css("background-color","#980000");
		categoriesIndex[index] = 0;
		showMarkers(map,index);
	}
	setTimeout(function() {
              uiControl();
           }, 100)
});

$('#clearMap').click(function(){
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	LatLngList = [];
	for (var i = numCategories - 1; i >= 0; i--) {
		categoriesIndex[i] = 0;
	};
	for(var i = 0; i< polyline.length; i++){
		 polyline[i].setMap(null);
	}

	$('nav ul ul li').css("background-color","#980000");
	adjustZoom(map);
});
