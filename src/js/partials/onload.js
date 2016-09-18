function setStage() {
  //Crear contenedor de markers y lista de categorias
  window.categorias.forEach(function(cat) {
    window.markerContainer[cat.value] = [];
    window.listaCategorias.push(cat.value);
    if(cat.estatica) window.categoriasFijas.push(cat.value);

    {% if extras.filtrable.mostrar %}
      $("#filtro-categorias")
        .append("<option value='"+cat.value+"'>"+cat.label+"</option>");
    {% endif %}

  });

  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-{{ 'left' if opciones.toast.posicion == 'izquierda' else 'right' }}",
    preventDuplicates: false,
    showDuration: "300",
    hideDuration: "200",
    timeOut: "7000",
    extendedTimeOut: "7000",
    showEasing: "linear",
    hideEasing: "linear",
    showMethod: "slideDown",
    hideMethod: "slideUp"
  };

  {% if opciones.bienvenida.mostrar %}
    toastr.info(
      '{{opciones.bienvenida.mensaje}}',
      'Bienvenid@',
      {timeOut: {{opciones.bienvenida.duracion}} })
  {% endif %}

  window.infowindow = new google.maps.InfoWindow();
  window.mapa = new google.maps.Map(
    document.getElementById('map'), {
      zoom: {{opciones.mapa.initzoom}},
      center: new google.maps.LatLng({{opciones.mapa.center.lat}}, {{opciones.mapa.center.lng}}),
      disableDefaultUI: {{opciones.mapa.disableDefaultUI}},
      disableDoubleClickZoom: true,
      mapTypeControl: {{opciones.mapa.mapTypeControl}},
      minZoom: {{opciones.mapa.minzoom}},
      zoomControl: {{opciones.mapa.zoomControl}},
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      scaleControl: {{opciones.mapa.scaleControl}},
      streetViewControl: {{opciones.mapa.streetViewControl}},
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      mapTypeControl: {{opciones.mapa.mapTypeControl}},
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER,
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.HYBRID
        ]
      },
      styles: [{
        featureType: "poi",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }],

      }]
    }
  );

  {% if extras.mostrarAlInicio %}
    //Get from db
    $.post('php/dataHandler.php', {
      action: 'get_markers'
    }, function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        var markerLatlng = new google.maps.LatLng(data[i].lat, data[i].lng);
        loadMarker(markerLatlng, data[i]);
      };
    }, "json");
  {% endif %}

  //Searchbox
  var input = (document.getElementById('pac-input'));
  window.mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox((input));

  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) return;

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      bounds.extend(place.geometry.location);
    }

    window.mapa.fitBounds(bounds);
  });

  google.maps.event.addListener(mapa, 'bounds_changed', function() {
    var bounds = mapa.getBounds();
    searchBox.setBounds(bounds);
  });

  //Extras
  {% if extras.zona.length %}
    //Zona
    {% include "./extras/zona.js" %}
  {% endif %}

  {% if extras.gps.mostrar %}
    // GPS
    {% include "./extras/gps.js" %}
  {% endif %}

  {% if extras.markers.agregable.state %}
    //Eventos de marker
    categorias.forEach(function (cat) {
      if (cat.estatica == false) {
        itemSeleccionado = cat.value;
        return;
      }
    });

    {% include "./extras/agregable.js" %}
  {% endif %}
}
