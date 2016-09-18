window.gpsMarker = new google.maps.Marker({
  map: mapa,
  title: "Vos",
  icon: "./img/location.png"
});

if(navigator.geolocation) {
  {% if extras.gps.ubicar %}
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      mapa.setCenter(pos);
      mapa.setZoom(16);
    });
  {% endif %}

  setInterval(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      window.gpsMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    });
  }, 3000);
}
