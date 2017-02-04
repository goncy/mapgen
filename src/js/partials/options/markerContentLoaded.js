google.maps.event.addListener(marker, 'click', function() {
  infowindow.close();
  if (marker.texto) infowindow.setContent('<h4><small>' + {% for opcion in configuracion.descripcion.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.clave }} {{"" if loop.last else "+ ' - ' +" | safe}} {%- endfor %} + '</small><br>' + marker.texto + '</h4>' + '{% if opciones.como_llegar %}' + '<a onclick="comoLlegar('+marker.position.lat()+','+marker.position.lng()+')" class="btn btn-block btn-primary"><span class="fa fa-map-marker fa-lg"></span> Como llegar</a>' + '{% endif %}');
  else infowindow.setContent('<h4><small>' + {% for opcion in configuracion.descripcion.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.clave }} {{"" if loop.last else "+ ' - ' +" | safe}} {%- endfor %} + '</small></h4>' + '{% if opciones.como_llegar %}' + '<a onclick="comoLlegar('+marker.position.lat()+','+marker.position.lng()+')" class="btn btn-block btn-primary"><span class="fa fa-map-marker fa-lg"></span> Como llegar</a>' + '{% endif %}');

  infowindow.open(mapa, marker);
});

google.maps.event.addListener(marker, 'click', function() {
  infowindow.close();
  if (marker.texto) {
    infowindow.setContent('<h4><small>' + {% for opcion in configuracion.descripcion.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.clave }} {{"" if loop.last else "+ ' - ' +" | safe}} {%- endfor %} + '</small><br>' + marker.texto + '</h4>' + '{% if opciones.como_llegar %}' + '<a onclick="comoLlegar('+marker.position.lat()+','+marker.position.lng()+')" class="btn btn-block btn-primary"><span class="fa fa-map-marker fa-lg"></span> Como llegar</a>' + '{% endif %}');
  }

  else infowindow.setContent('<h4><small>' + {% for opcion in configuracion.descripcion.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.clave }} {{"" if loop.last else "+ ' - ' +" | safe}} {%- endfor %} + '</small></h4>' + '{% if opciones.como_llegar %}' + '<a onclick="comoLlegar('+marker.position.lat()+','+marker.position.lng()+')" class="btn btn-block btn-primary"><span class="fa fa-map-marker fa-lg"></span> Como llegar</a>' + '{% endif %}');

  infowindow.open(mapa, marker);
});
