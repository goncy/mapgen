google.maps.event.addListener(marker, 'rightclick', function(event) {
    infowindow.close();
    removeMarker(marker);
});
