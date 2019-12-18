var trigger = 0; 
var categoriesIndex = new Array(numCategories);
var map;
var markers = [];
var polyline = [];
var markersTemp = [];
var lastCategorySelected = {
	id : -1
};
var selectedCategory = false;
var hiddenCategoriesList = true;

//Se innicializa el vector de indíces de las categorías existentes.
for (var i = numCategories - 1; i >= 0; i--) {
	categoriesIndex[i] = 0;
};

setCategories();

//Abre o minimiza el menú desplegable con las caraterísticas disponinbles
function uiControl(){
	selectedCategory = false;
	if(trigger == 0){
		hiddenCategoriesList = false;
		trigger = 1;
		var top = 30*(1+numCategories);
		$('nav').css({"background-color":"#820000","height":"100%","left":"-150px","width":"60vw", "max-width" : "500px"});
		$('nav>ul>li').css({"background-color" : "rgba(59,46,46,1)", "position" : "relative"});
		$('nav ul ul li').css({"display":"block"});
		$('#mapOverlay').css({"background-color":"rgba(0,0,0,0.6)","display":"block", "transition": ".5s all"});

		$('nav').addClass('hidden-categories');
		fadeIn();

	}else{
		hiddenCategoriesList = true;
		trigger = 0;
		if($('header').width() == 200 ){
			$('nav').css({"width":"100%"});
		}else{
			$('nav').css({"width":"150px"});
		}
		$('nav').css({"background-color":"rgba(59,46,46,0.4)","height":"40px"});
		$('nav>ul>li').css({"background-color" : "rgba(59,46,46,0.4)", "position" : "static"});
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

function clearMap(){
	createMarkers.markerList.forEach( marker =>  marker.setMap(null));
	
	LatLngList = [];
	for(var i = 0; i< polyline.length; i++){
		 polyline[i].setMap(null);
	}

	$('nav ul ul li').css("background-color","#980000");
	adjustZoom(map);
}

function setSublocationsCategories(categorySublocations){
	let categoriesList = $('#categories-list');

	categoriesList.html('');
	categorySublocations.forEach( sublocation => {
		categoriesList.append(`<li class="fadeInLeft" onclick="triggerSublocationClick(${sublocation.id})"> ${sublocation.sublocation} </li> `);
		}
	);
}

function setCategoriesTitle(category){
	let categoriesTitle = $('#categories-title');

	categoriesTitle.html(`<span class="open-categories back-button" onclick="setCategories()"><i class="fa fa-arrow-left"></i></span><span>${category.category}</span>`);
	categoriesTitle.addClass('title-added');
}

//Activates when clicked back button
function setCategories(){

	selectedCategory = false;
	let categoriesList = $('#categories-list');
	let categoriesTitle = $('#categories-title');

	categoriesList.html('');
	categories.forEach( category => {
		if(category.id === lastCategorySelected.id){
			categoriesList.append(`<li class="category-item" data-category-id="${category.id}" style="background-color: #720000"> ${category.category} </li>`);
		}else{
			categoriesList.append(`<li class="category-item" data-category-id="${category.id}"> ${category.category} </li>`);
		}
	});

	categoriesTitle.html(`Categorías <span class="open-categories"><i class="fa fa-plus"></i></span>`);
}

function showCategoryListSublocations(CATEGORY_ID){
	let category = categories.find( category => category.id === CATEGORY_ID);
	clearMap();

	//Shows button back, sublocations list and title based on the selected category
	let categorySublocations = sublocations.filter( sublocation =>  sublocation.category_id ===  CATEGORY_ID);
	setSublocationsCategories(categorySublocations);
	setCategoriesTitle(category);
	selectedCategory = true;
	
	//Shows markers and saves last selected category
	lastCategorySelected = category;
	showMarkers(map, CATEGORY_ID, true);
}

function triggerSublocationClick(sublocationId){
	//If a category was searched, pointers are cleared. So this will always show 
	// showCategoryListSublocations(lastCategorySelected.id);
	searchMarkers(map, sublocationId);

	setTimeout(() => {
		$($(`div[title|='${sublocationId}']`)[0]).trigger( "click" );
	}, 200);
	
	uiControl();
}

$(window).resize(function() {
        setTimeout(function() {
              setCenterMap(1,map);
           }, 50)
});

$('#categories-title').click(function(){
	if( !selectedCategory && !hiddenCategoriesList) {
		return;
	}else if(selectedCategory && !hiddenCategoriesList){
		return;
	} else{
		uiControl();
	}
});

$('#mapOverlay').click(function(){
	uiControl();
});

//Rutina que controla el comportamiento del mapa al seleccionar o deseleccionar una categoría.
$('nav ul ul').on("click", "li.category-item", function(event){
	const CATEGORY_ID = $(event.currentTarget).data('category-id');

	showCategoryListSublocations(CATEGORY_ID);
});

$('#clearMap').click(function(){
	clearMap();
});
