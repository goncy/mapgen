google.maps.event.addListener({{ "path" if extras.zona else "mapa" }}, 'dblclick', function(event) {
  addRegistro(event.latLng);
});

google.maps.event.addListener({{ "path" if extras.zona else "mapa" }}, 'click', function(event) {
  infowindow.close();
});
