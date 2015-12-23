function loadMarker(location, loadedMarker) {
  var marker = new google.maps.Marker({
    position: location,
    map: mapa,
    draggable: false,
    icon: getIcon(loadedMarker.tipo),
    iconBu: getIcon(loadedMarker.tipo),
    id: loadedMarker.id,
    texto: loadedMarker.texto,
    fecha: loadedMarker.ts,
    tipo: loadedMarker.tipo
  });

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

    {% if opciones.markers.maximosSesion %}
      //Max markers
      {% include "./options/maxMarkers.js" %}
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
