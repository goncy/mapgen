function loadMarker(location, loadedMarker) {
  if(listaCategorias.indexOf(loadedMarker.tipo) === -1) return;

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
  {% if extras.markers.agregable.state %}
    {% if extras.markers.solucionable.state %}
      google.maps.event.addListener(marker, 'rightclick', function() {

          {% if extras.markers.solucionable.max %}
            //Max markers remove
            if (marker.solucionado == false && cant_solucionados >= {{extras.markers.solucionable.max}}) {
              toastr.error("¡No podes borrar tantos puntos!");
              return;
            }
          {% endif %}

          {% if adminPass != true %}
            if(categoriasFijas.indexOf(marker.tipo) >= 0) return;
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
    {% endif %}
  {% endif %}

  //Nunjucks: opciones.infowindow
  {% if opciones.infowindow.mostrar %}
    //Mostrar infowindow
    {% include "./options/markerContentLoaded.js" %}
  {% endif %}

  markerContainer[marker.tipo].push(marker);

  document.getSelection()
    .removeAllRanges();
}

{% if extras.markers.agregable.state %}
  function addRegistro(location) {

    if (!itemSeleccionado) return;

    {% if extras.markers.agregable.max %}
      //Max markers add
      if (cant_markers >= {{extras.markers.agregable.max}}) {
        toastr.error("¡No podes agregar tantos puntos!, por favor, guardá para seguir cargando puntos");
        return;
      }
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

    {% if extras.markers.solucionable.state %}
      google.maps.event.addListener(marker, 'rightclick', function(event) {
          infowindow.close();
          removeMarker(marker);
      });
    {% endif %}

    {% if opciones.infowindow.mostrar %}
      //Mostrar infowindow
      {% include "./options/markerContentNew.js" %}
    {% endif %}

    google.maps.event.trigger(marker, 'click');

    markerContainer[marker.tipo].push(marker);
    cant_markers++;

    document.getSelection()
      .removeAllRanges();
  }

  {% if extras.markers.solucionable.state %}
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
        if(markerContainer[cat][i].fecha !== "nuevo") continue;
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

  {% if extras.markers.solucionable.state %}
    function getArraySolucionados(){
        var arraySolucionados = new Array();
        var removeHtml = /(<([^>]+)>)/ig;

        //Solucionados
        for (var i = solucionados.length - 1; i >= 0; i--) {
          var objeto = {
              id: solucionados[i].id
          };
          if (solucionados[i].solucionado == true) arraySolucionados.push(objeto);
        };

        return arraySolucionados;
    }
  {% endif %}
{% endif %}
