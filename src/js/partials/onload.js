function setStage() {
  //Crear contenedor de markers y lista de categorias
  categorias.forEach(function(cat) {
    markerContainer[cat] = [];
    {% if extras.editable %}
      $("#catList")
        .append("<li><a style='text-transform:capitalize' role='button' onclick='itemSeleccionado = \"" + cat + "\"'>" + cat + "</a></li>");
    {% endif %}
  });

  window.infowindow = new google.maps.InfoWindow();
  window.mapa = new google.maps.Map(
    document.getElementById('map'), {
      zoom: 13,
      center: new google.maps.LatLng(-34.737911, -58.292906),
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      mapTypeControl: true,
      minZoom: 13,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      mapTypeControl: true,
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

  $.post('php/dataHandler.php', {
    action: 'get_markers'
  }, function(data) {
    for (var i = data.length - 1; i >= 0; i--) {
      var markerLatlng = new google.maps.LatLng(data[i].lat, data[i].lng);
      loadMarker(markerLatlng, data[i]);
    };
  }, "json");

  //Extras
  {% if extras.zona %}
    //Zona
    {% include "./extras/zona.js" %}
  {% endif %}

  {% if extras.gps %}
    // GPS
    {% include "./extras/gps.js" %}
  {% endif %}

  //Searchbox
  var input = (document.getElementById('pac-input'));
  mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox((input));

  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) return;

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      bounds.extend(place.geometry.location);
    }

    mapa.fitBounds(bounds);
  });

  google.maps.event.addListener(mapa, 'bounds_changed', function() {
    var bounds = mapa.getBounds();
    searchBox.setBounds(bounds);
  });

  {% if extras.editable %}
    //Eventos de marker
    {% include "./extras/editable.js" %}
  {% endif %}
}
