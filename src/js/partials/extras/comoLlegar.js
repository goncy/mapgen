{ % if extras.comoLlegar % }

function comoLlegar(lat, lng) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {

      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;

      directionsDisplay.setMap(mapa);

      directionsService.route({
        origin: position.coords.latitude + ',' + position.coords.longitude,
        destination: lat + ',' + lng,
        travelMode: google.maps.TravelMode.DRIVING
      }, function(data, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            var recorrido = google.maps.geometry.encoding.decodePath(data.routes[0].overview_polyline);
            if (recorrido.length) {
              var ln = new google.maps.Polyline({
                path: recorrido,
                geodesic: true,
                strokeColor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                strokeOpacity: 1.0,
                strokeWeight: 8,
                zIndex: 9999,
                map: mapa
              });

              var mk = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                map: mapa,
                title: "Vos"
              });

              var latlngbounds = new google.maps.LatLngBounds();
              for (var i = 0; i < recorrido.length; i++) {
                latlngbounds.extend(recorrido[i]);
              }

              google.maps.event.addListener(ln, 'dblclick', function () {
                ln.setMap(null);
                mk.setMap(null);
                google.maps.event.clearInstanceListeners(ln);
              });

              mapa.fitBounds(latlngbounds);

              if (!avisoBorrado) {
                toastr.info("Para borrar/quitar un recorrido hacia un punto, presione dos veces sobre el.")
                avisoBorrado = true;
              }
            }
          } else {
            toastr.info("Hubo un error obteniendo el recorrido, por favor, intente nuevamente mas tarde");
          }
      });
    });
  } else {
    toastr.info("Esta opcion esta habilitada solamente con permisos GPS, por favor permitalo/habilitelo e intente nuevamente");
  }

  infowindow.close();
} { % endif % }
