//Cargamos las categorias desde nunjucks
var categorias = [{% for categoria in categorias -%} '{{ categoria }}' {{"" if loop.last else ","}} {%- endfor %}];
var itemSeleccionado = categorias[0];
var markerContainer = {};

var cant_markers = 0;
var emptyTextArea = '<h4><textarea rows="4" id="obtener_texto" placeholder="Descripcion del motivo" maxlength="255"></textarea><br><button type="button" class="btn btn-default" id="guardar_texto">Guardar</button></h4>';

function setStage() {
  //Crear contenedor de markers y lista de categorias
  categorias.forEach(function(cat) {
    markerContainer[cat] = [];
    $("#catList")
      .append("<li><a style='text-transform:capitalize' role='button' onclick='itemSeleccionado = \"" + cat + "\"'>" + cat + "</a></li>");
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
    if("{{paths[extras.zona]}}".length){
      var path = new google.maps.Polygon({
        strokeColor: "#7790D9",
        fillColor: "#A3BFD9",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 0.25,
        map: mapa,
        paths: google.maps.geometry.encoding.decodePath("{{paths[extras.zona]}}")
      });
    }
  {% endif %}

  {% if extras.gps %}
    // GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            mapa.setCenter(pos);
            mapa.setZoom(16);
        });
    }
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
    google.maps.event.addListener({{ "path" if extras.zona else "mapa" }}, 'dblclick', function(event) {
      addMarker(event.latLng);
    });

    google.maps.event.addListener({{ "path" if extras.zona else "mapa" }}, 'click', function(event) {
      infowindow.close();
    });
  {% endif %}
}

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
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.close();
      //Nunjucks: opciones.infowindow
      if (marker.texto) infowindow.setContent('<h4><small>' + {% for opcion in opciones.infowindow.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.dato }} {{"" if loop.last else "+ ' - ' +"}} {%- endfor %} + '</small><br>' + marker.texto + '</h4>');
      else infowindow.setContent('<h4><small>' + {% for opcion in opciones.infowindow.datos -%} '{{ opcion.nombre }}: '+marker.{{ opcion.dato }} {{"" if loop.last else "+ ' - ' +"}} {%- endfor %} + '</small></h4>');

      infowindow.open(mapa, marker);
    });
  {% endif %}

  document.getSelection()
    .removeAllRanges();
}

function addMarker(location) {
  if (cant_markers >= 3) {
    alert("¡No podes agregar tantos puntos!, por favor, guardá para seguir cargando puntos");
    return;
  }

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
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.close();
      google.maps.event.clearListeners(infowindow, 'domready');
      if (marker.texto) infowindow.setContent('<h4>' + marker.texto + '</h4>');
      else {
        infowindow.setContent(emptyTextArea);
        google.maps.event.addListener(infowindow, 'domready', function() {
          $('#guardar_texto')
            .on('click', function() {
              marker.texto = $('#obtener_texto')
                .val();
              infowindow.close();
            });
        });
      }
      infowindow.open(mapa, marker);
    });
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

function vaciarArrays() {
  for (var cat in markerContainer) {
    markerContainer[cat] = [];
  }
}

function guardar() {
  var arrayMarkers = getArrayMarkers();

  if (arrayMarkers.length > 0) {
    $.post('php/dataHandler.php', {
      action: 'push_markers',
      markers: arrayMarkers
    }, function(data) {
      if (data == true) alert("Agregado correctamente, gracias por su colaboracion");
      if (data == false) alert("Hubo un error, pruebe nuevamente mas tarde, gracias!");
      vaciarArrays();
      location.reload();
    }, "json");
  }
}

//Helpers
function getIcon(categoria) {
  return categoria ? 'img/icons/' + categoria + '.png' : 'img/icons/otro.png';
}

function textoReplace(texto) {
  var removeHtml = /(<([^>]+)>)/ig;
  return texto ? texto.replace(removeHtml, "") : "";
}

window.onbeforeunload = function() {
  var hook = getArrayMarkers()
    .length ? true : false;
  if (hook) {
    return "¡No guardaste los puntos permamentemente en el mapa!, por favor, cerrá esta ventana y presioná 'Guardar datos' en la esquina superior derecha"
  }
}
