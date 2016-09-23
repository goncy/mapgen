function setStage() {
  //Crear contenedor de markers y lista de categorias
  window.categorias.forEach(function(cat) {
    window.markerContainer[cat.value] = [];
    window.listaCategorias.push(cat.value);
    if(cat.estatica) window.categoriasFijas.push(cat.value);

    {% if caracteristicas.usuario.filtrar.mostrar %}
      $("#filtro-categorias")
        .append("<option value='"+cat.value+"'>"+cat.label+"</option>");
    {% endif %}

  });

  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-{{ 'left' if configuracion.notificaciones.posicion == 'izquierda' else 'right' }}",
    preventDuplicates: false,
    showDuration: "300",
    hideDuration: "200",
    timeOut: "{{configuracion.notificaciones.duracion}}",
    extendedTimeOut: "{{configuracion.notificaciones.duracion}}",
    showEasing: "linear",
    hideEasing: "linear",
    showMethod: "slideDown",
    hideMethod: "slideUp"
  };

  {% if opciones.bienvenida %}
    toastr.info(
      '{{texto.bienvenida}}',
      'Bienvenid@',
      {timeOut: {{configuracion.notificaciones.duracion}} })
  {% endif %}

  window.infowindow = new google.maps.InfoWindow();
  window.mapa = new google.maps.Map(
    document.getElementById('map'), {
      zoom: {{configuracion.mapa.zoom_inicial}},
      center: new google.maps.LatLng({{configuracion.mapa.centro.lat}}, {{configuracion.mapa.centro.lng}}),
      disableDefaultUI: {{configuracion.mapa.deshabilitar_extras}},
      disableDoubleClickZoom: {{true if caracteristicas.usuario.registros.agregar.permitir else false}},
      mapTypeControl: {{configuracion.mapa.tipo_de_mapa}},
      minZoom: {{configuracion.mapa.zoom_minimo}},
      zoomControl: {{configuracion.mapa.control_zoom}},
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      scaleControl: {{configuracion.mapa.control_escala}},
      streetViewControl: {{configuracion.mapa.street_view}},
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
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

  {% if opciones.mostrar_registros %}
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
  {% if opciones.zonas.length %}
    //Zona
    {% include "./extras/zona.js" %}
  {% endif %}

  {% if caracteristicas.usuario.gps.mostrar %}
    // GPS
    {% include "./extras/gps.js" %}
  {% endif %}

  {% if caracteristicas.usuario.registros.agregar.permitir %}
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
