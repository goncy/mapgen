function loadMarker(location, loadedMarker) {
  var marker = new google.maps.Marker({
    position: location,
    solucionado: false,
    map: mapa,
    draggable: false,
    icon: getIcon(loadedMarker.tipo),
    iconBu: getIcon(loadedMarker.tipo),
    id: loadedMarker.id,
    texto: loadedMarker.texto,
    fecha: loadedMarker.ts,
    tipo: loadedMarker.tipo
  });

  //Nunjucks: opciones.markerSolucionable
  {% if extras.solucionable %}
    {% include "./extras/loadedMarkerSolucionable.js" %}
  {% endif %}

  //Nunjucks: opciones.infowindow
  {% if opciones.infowindow.mostrar %}
    //Mostrar infowindow
    {% include "./options/infowindow.mostrar.loaded.js" %}
  {% endif %}

  document.getSelection()
    .removeAllRanges();
}

{% if extras.editable %}
  function addMarker(location) {

    {% if opciones.markers.maximosAdd %}
      //Max markers add
      {% include "./options/maxMarkersAdd.js" %}
    {% endif %}

    var marker = new google.maps.Marker({
      position: location,
      map: mapa,
      draggable: true,
      icon: getIcon(itemSeleccionado),
      iconBu: getIcon(itemSeleccionado),
      id: 0,
      texto: "",
      fecha: "nuevo",
      tipo: itemSeleccionado
    });

    {% if extras.solucionable %}
      {% include "./extras/newMarkerSolucionable.js" %}
    {% endif %}

    {% if opciones.infowindow.mostrar %}
      //Mostrar infowindow
      {% include "./options/infowindow.mostrar.new.js" %}
    {% endif %}

    google.maps.event.trigger(marker, 'click');
    pushMarker(marker);

    document.getSelection()
      .removeAllRanges();
  }

  function pushMarker(marker) {
    cant_markers++;
    markerContainer[marker.tipo].push(marker);
  }

  {% if extras.solucionable %}
    function removeMarker(marker) {
        marker.setMap(null);
        cant_markers--;

        markerContainer[marker.tipo].splice(markerContainer[marker.tipo].indexOf(marker), 1);
    }
  {% endif %}

function getArrayMarkers() {
  var arrayMarkers = new Array();
  var removeHtml = /(<([^>]+)>)/ig;

  for (var cat in markerContainer) {
    for (var i = markerContainer[cat].length - 1; i >= 0; i--) {
      var objeto = {
        lat: markerContainer[cat][i].position.lat(),
        lng: markerContainer[cat][i].position.lng(),
        tipo: cat,
        texto: textoReplace(markerContainer[cat][i].texto)
      };
      arrayMarkers.push(objeto);
    }
  }
  return arrayMarkers;
}
{% endif %}
