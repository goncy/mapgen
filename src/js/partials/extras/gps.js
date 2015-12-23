if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        mapa.setCenter(pos);
        mapa.setZoom(16);
    });
}
