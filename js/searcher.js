let sublocationsFormat = sublocations.map( sublocation => ({ label: sublocation.sublocation, value : sublocation.id}) );

//autocomplete para el cambo de busqueda
$('#search input').autocomplete({
	source: sublocationsFormat,
	select: function (e, ui) {
		const SUBLOCATION_ID = ui.item.value;
		searchMarkers(map, SUBLOCATION_ID);
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