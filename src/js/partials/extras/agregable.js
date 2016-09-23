google.maps.event.addListener({{ "window.path" if opciones.zonas.length else "mapa" }}, 'dblclick', function(event) {
  addRegistro(event.latLng);
});

google.maps.event.addListener({{ "window.path" if opciones.zonas.length else "mapa" }}, 'click', function(event) {
  infowindow.close();
});
