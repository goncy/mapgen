google.maps.event.addListener({{ "path" if extras.zona.length else "mapa" }}, 'dblclick', function(event) {
  addRegistro(event.latLng);
});

google.maps.event.addListener({{ "path" if extras.zona.length else "mapa" }}, 'click', function(event) {
  infowindow.close();
});
