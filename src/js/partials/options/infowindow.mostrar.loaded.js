google.maps.event.addListener(marker, 'click', function() {
  infowindow.close();
  //Nunjucks: opciones.infowindow
  if (marker.texto) infowindow.setContent('<h4><small>' + {% for opcion in opciones.infowindow.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.dato }} {{"" if loop.last else "+ ' - ' +"}} {%- endfor %} + '</small><br>' + marker.texto + '</h4>');
  else infowindow.setContent('<h4><small>' + {% for opcion in opciones.infowindow.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.dato }} {{"" if loop.last else "+ ' - ' +"}} {%- endfor %} + '</small></h4>');

  infowindow.open(mapa, marker);
});
