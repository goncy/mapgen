function comoLlegar(lat,lng){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $.get('https://maps.googleapis.com/maps/api/directions/json?origin='+position.coords.latitude+','+position.coords.longitude+'&destination='+lat+','+lng, function(data) {
        if(data.status === "OK"){
          var recorrido = google.maps.geometry.encoding.decodePath(data.routes[0].overview_polyline.points);
          if(recorrido.length){
            var ln = new google.maps.Polyline({
              path: recorrido,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 5,
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

            google.maps.event.addListener(ln, 'dblclick', function(){
                ln.setMap(null);
                mk.setMap(null);
                google.maps.event.clearInstanceListeners(ln);
            });

            mapa.fitBounds(latlngbounds);

            if(!avisoBorrado){
              toastr.info("Para borrar/quitar un recorrido hacia un punto, presione dos veces sobre el.")
              avisoBorrado = true;
            }
          }
        }else{
          toastr.info("Hubo un error obteniendo el recorrido, por favor, intente nuevamente mas tarde");
        }
      }, "json");
    })
  }else{
    toastr.info("Esta opcion esta habilitada solamente con permisos GPS, por favor permitalo/habilitelo e intente nuevamente");
  }

  infowindow.close();
}
