google.maps.event.addListener(marker, 'click', function() {
  infowindow.close();
  google.maps.event.clearListeners(infowindow, 'domready');
  if (marker.texto) infowindow.setContent('<h4>' + marker.texto + '</h4>');
  else {
    infowindow.setContent('<h4><textarea rows="4" id="obtener_texto" placeholder="Descripcion del motivo" maxlength="255"></textarea><br><button type="button" class="btn btn-default" id="guardar_texto">Guardar</button></h4>');
    
    google.maps.event.addListener(infowindow, 'domready', function() {
      $('#guardar_texto')
        .on('click', function() {
          marker.texto = $('#obtener_texto')
            .val();
          infowindow.close();
        });
    });
  }
  infowindow.open(mapa, marker);
});
