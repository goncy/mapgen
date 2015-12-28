google.maps.event.addListener(marker, 'click', function() {
  infowindow.close();
  //Nunjucks: opciones.infowindow
  if (marker.texto) infowindow.setContent('<h4><small>' + {% for opcion in opciones.infowindow.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.dato }} {{"" if loop.last else "+ ' - ' +"}} {%- endfor %} + '</small><br>' + marker.texto + '</h4>' + '{% if extras.comoLlegar %}' + '<a id="comoLlegar" class="btn btn-block btn-primary"><span class="fa fa-map-marker fa-lg"></span> Como llegar</a>' + '{% endif %}');
  else infowindow.setContent('<h4><small>' + {% for opcion in opciones.infowindow.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.dato }} {{"" if loop.last else "+ ' - ' +"}} {%- endfor %} + '</small></h4>');

  {% if extras.comoLlegar %}
    google.maps.event.addListener(infowindow, 'domready', function() {
      $('#comoLlegar')
        .on('click', function() {

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              $.get('https://maps.googleapis.com/maps/api/directions/json?origin='+position.coords.latitude+','+position.coords.longitude+'&destination='+marker.position.lat()+','+marker.position.lng(), function(data) {
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
                      alert("Para borrar/quitar un recorrido hacia un punto, presione dos veces sobre el.")
                      avisoBorrado = true;
                    }
                  }
                }else{
                  alert("Hubo un error obteniendo el recorrido, por favor, intente nuevamente mas tarde");
                }
              }, "json");
            })
          }else{
            alert("Esta opcion esta habilitada solamente con permisos GPS, por favor permitalo/habilitelo e intente nuevamente");
          }
        });
    });
  {% endif %}

  infowindow.open(mapa, marker);
});
