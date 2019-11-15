//autocomplete para el cambo de busqueda
$('#search input').autocomplete({
	source: markersList,
	select: function (e, ui) {
		var name = new Array(); 
		name.push(ui.item.value);
		searchMarkers(map,name);
		clearInput();
		$('#hideKeyboard').focus();
    },

});

$('#search img').click(function(){
	var list = new Array();
	clearInput()
	$('#ui-id-1 li a').each(function(i,el){
		list.push($(this).text());
	});

	if(list.length > 0){
		searchMarkers(map,list);
	}else{
		alert("no hubo resultados en su búsqueda");
	}

});

function clearInput(){
	setTimeout(function() {
        $('input').val('');
		$('#ui-id-1 li').remove();
		$('#search span').remove();
    }, 50)    
	
}