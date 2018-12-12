function antiXss(str){
    str = str.replace(/[^a-z0-9Ã¡Ã©Ã­Ã³ÃºÃ±Ã¼ \.,_-]/gim,"");
    return str.trim();
}

var map;
var elementoAleatorioX1 = 0;
var markerMap = null;

$(function() {
	map = L.map('mapa').setView([19.43471, -99.20091], 16);

	var SurOeste = L.latLng(19.367644, -99.274350),
	    NorEste = L.latLng(19.509387, -99.113566),
	    bounds = L.latLngBounds(SurOeste, NorEste);

	var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: 14,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	map.doubleClickZoom.disable(); 

	var heatMap = L.heatLayer(puntosCriticos).addTo(map);

	map.on('click', function(ev) {
		var popup = L.popup();
		try {
			var lat = ev.latlng.lat,
				lng = ev.latlng.lng;
			if( markerMap !== null ) {
				map.removeLayer(markerMap);
			}
			markerMap = L.marker([lat, lng]).addTo(map)
			 .bindPopup('<button type="button" class="btn btn-danger btn-xs btn-popup-reporte" data-toggle="modal" data-target="#reportes" data-lat="' + lat +'" data-lng="' + lng +'">Añadir Reporte En Este Sitio!</button>')
			 .openPopup();
	    } catch (E) {
	    	console.log("Error!\n" + E);
	    }
	});

	$('#mapa').on('click', '.btn-popup-reporte', function(ev){
		$btn = $(this);
		$('#reporte-lat').val($btn.attr('data-lat'));
		$('#reporte-lng').val($btn.attr('data-lng'));
		$('.btn-group-ubicacion label').removeClass('active');
		$('.btn-reporte-selecciona-ubicacion').addClass('active');
		$('.btn-reporte-selecciona-ubicacion').addClass("disabled");
		$('.btn-reporte-selecciona-ubicacion').html('Ubicacion seleccionada en el mapa');
	});

	$('#evidencia-foto').on('change',function(){
		var nombreArchivo = antiXss($(this).val());
		if(nombreArchivo === null || nombreArchivo == "")
			nombreArchivo = "Seleccionar foto...";
		$('#label-evidencia-foto').html(nombreArchivo);
	});

	$('.btn-reporte-mi-ubicacion').click(function(){
		var nuevoElementoAleatorio = Math.floor(Math.random()*puntosCriticosAleatorios.length);
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function(){
				while(nuevoElementoAleatorio == elementoAleatorioX1) {
					nuevoElementoAleatorio = Math.floor(Math.random()*puntosCriticosAleatorios.length);
				}
				elementoAleatorioX1 = nuevoElementoAleatorio;
				$('#reporte-lat').val(puntosCriticosAleatorios[elementoAleatorioX1][0]);
				$('#reporte-lng').val(puntosCriticosAleatorios[elementoAleatorioX1][0]);
	        }, function(error) {
	        	var msg;
			    switch(error.code) {
			        case error.PERMISSION_DENIED:
			            msg = "Has denegado el acceso a tu ubicaciÃ³n. Revisa la configuraciÃ³n de tu navegador."
			            break;
			        case error.POSITION_UNAVAILABLE:
			            msg = "La informaciÃ³n de tu ubicaciÃ³n no es vÃ¡lida."
			            break;
			        case error.TIMEOUT:
			            msg = "El tiempo de espera ha sido superado."
			            break;
			        case error.UNKNOWN_ERROR:
			            msg = "Ha ocurrido un error inesperado."
			            break;
			    }
				$.notify({
					title: "Â¡Error!",
					message: msg,
				},{
					offset: 20,
					type: 'danger',
					z_index: 1052
				});
	        });
	    } else { 
			$.notify({
				title: "Â¡Error!",
				message: "Tienes desactivado el acceso a tu ubicaciÃ³n, seleccionala en el mapa.",
			},{
				offset: 20,
				type: 'danger',
				z_index: 1052
			});
	    }
	});

	$('.btn-reporte-selecciona-ubicacion').click(function(){
		if( $(this).hasClass('disabled') ) {
			return;
		}
		$('#reportes').modal('hide');
			$.notify({
				message: "Selecciona la ubicaciÃ³n en el mapa.",
			},{
				offset: 20,
				z_index: 1052
			});
	});

	$('#form-reporte').submit(function(e){
		e.preventDefault();
		$('.btn-group-ubicacion label').removeClass('active');
		$('.btn-group-ubicacion label').removeClass('disabled');
		$('.btn-reporte-selecciona-ubicacion').html('Seleccionar ubicaciÃ³n');
		if( $('#reporte-lat').val() === "" || $('#reporte-lng').val() === "" ) {
			$.notify({
				title: "Â¡Error!",
				message: "Selecciona la ubicaciÃ³n para el reporte.",
			},{
				offset: 20,
				type: 'danger',
				z_index: 1052
			});
			return;
		} else {
			heatMap.addLatLng([parseFloat($('#reporte-lat').val()), parseFloat($('#reporte-lng').val())])
		}

		$(this)[0].reset();
		$("#evidencia-foto").val(null);
		$('#label-evidencia-foto').html('Seleccionar foto...');

		$('#reportes').modal('hide');

			$.notify({
				title: "Â¡Gracias!",
				message: "El reporte se ha enviado correctamente.",
			},{
				offset: 20,
				type: 'success',
				z_index: 1052
			});


		$('#reporte-lat').val("");
		$('#reporte-lng').val("");

	});


	$('btn-reporte').click(function(e){

		$('#reporte-lat').val("");
		$('#reporte-lng').val("");
	});

});