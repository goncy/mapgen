google.maps.event.addListener(marker, 'rightclick', function() {
  
    {% if opciones.markers.maximosRemove %}
      //Max markers remove
      {% include "../options/maxMarkersRemove.js" %}
    {% endif %}

    infowindow.close();
    if (marker.solucionado == false) {
        marker.setIcon('img/icons/tilde.png');
        marker.solucionado = true;
        solucionados.push(marker);
        cant_solucionados++;
    } else {
        marker.setIcon(marker.iconBu);
        marker.solucionado = false;
        cant_solucionados--;
    }
});
