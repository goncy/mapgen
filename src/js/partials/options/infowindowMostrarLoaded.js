google.maps.event.addListener(marker, 'click', function() {
  infowindow.close();
  //Nunjucks: opciones.infowindow
  if (marker.texto) infowindow.setContent('<h4><small>' + {% for opcion in opciones.infowindow.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.dato }} {{"" if loop.last else "+ ' - ' +"}} {%- endfor %} + '</small><br>' + marker.texto + '</h4>' + '{% if extras.comoLlegar %}' + '<a onclick="comoLlegar('+marker.position.lat()+','+marker.position.lng()+')" class="btn btn-block btn-primary"><span class="fa fa-map-marker fa-lg"></span> Como llegar</a>' + '{% endif %}');
  else infowindow.setContent('<h4><small>' + {% for opcion in opciones.infowindow.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.dato }} {{"" if loop.last else "+ ' - ' +"}} {%- endfor %} + '</small></h4>' + '{% if extras.comoLlegar %}' + '<a onclick="comoLlegar('+marker.position.lat()+','+marker.position.lng()+')" class="btn btn-block btn-primary"><span class="fa fa-map-marker fa-lg"></span> Como llegar</a>' + '{% endif %}');

  infowindow.open(mapa, marker);
});
