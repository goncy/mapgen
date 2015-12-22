var userIP = "0.0.0.0";

var camaras = new Array();
var podas = new Array();
var iluminacion = new Array();
var inseguridad = new Array();
var bacheo = new Array();
var otro = new Array();

var solucionados = new Array();

var itemSeleccionado = "camaras";

var infowindow = new google.maps.InfoWindow();

var mapa;
var recorrido;
var partido_quilmes;

var cant_markers = 0;
var cant_solucionados = 0;

var guardado = true;

var tutorial = {
    mostrar: false,
    pregunta: false,
    uno: false,
    dos: false,
    tres: false,
    cuatro: false
}

function setStage() {

    toastr.options = {
      "iconClass": "hidden",
      "closeButton": true,
      "debug": false,
      "newestOnTop": true,
      "progressBar": false,
      "positionClass": "toast-top-left",
      "preventDuplicates": false,
      "showDuration": "300",
      "hideDuration": "200",
      "timeOut": "0",
      "extendedTimeOut": "0",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "slideDown",
      "hideMethod": "slideUp"
    }

    toastr.info("<br><a role='button' onclick='respTutorial(\"si\")' class='btn btn-info btn-sm btn-block'>Si</a><a role='button' onclick='respTutorial(\"no\")' class='btn btn-info btn-sm btn-block'>No</a>", "¿Deséa mostrar ayuda de como utilizar el mapa?");

    mapa = new google.maps.Map(
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

    var quilmes_path = google.maps.geometry.encoding.decodePath("jctrEnzubJlwBpsC`QdIb{@~~@p~@``AnxBhdChk@eb@fbDssBdEtIxa@ub@zo@_`@fvAoaAkVcPum@s@}FaGm`@uAc{AohDl]iYqlFcbMdA~MuLr@cc@t^oBpG}JNgHfIrArO_JeIw^hZqg@paAcMiC`FhKkRpd@}FvIwW}LvW`VaJ?gSyQhKt^");
    partido_quilmes = new google.maps.Polygon({
        strokeColor: "#7790D9",
        fillColor: "#A3BFD9",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 0.25,
        map: mapa,
        paths: quilmes_path
    });

    $.post('php/dataHandler.php', {
        action: 'get_markers'
    }, function(data) {
        for (var i = data.length - 1; i >= 0; i--) {
            var markerLatlng = new google.maps.LatLng(data[i].lat, data[i].lng);
            placeMarker(markerLatlng, 'img/icons/' + data[i].tipo + '.png', data[i]);
        };
    }, "json");

    //Eventos de marker
    google.maps.event.addListener(partido_quilmes, 'dblclick', function(event) {
        infowindow.close();
        placeMarker(event.latLng);
        tutorialHandler("tres");
    });

    google.maps.event.addListener(mapa, 'click', function(event) {
        infowindow.close();
    });

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

    // GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            mapa.setCenter(pos);
            mapa.setZoom(16);
        });
    }
};

function placeMarker(location, loaded, loaded_marker) {
    if (!loaded && cant_markers >= 5) {
        alert("¡No podes agregar tantos puntos!, por favor, guardá para seguir cargando puntos");
        return;
    }

    var icono;
    var drag;
    var id;
    var texto;

    if (loaded) {
        icono = loaded;
        drag = false;
        id = loaded_marker.id;
        texto = loaded_marker.texto;
        fecha = loaded_marker.ts;
        tipo = loaded_marker.tipo;
    } else {
        icono = getIcon(itemSeleccionado);
        drag = true;
        id = 0;
        texto = "";
        fecha = "nuevo";
        tipo = itemSeleccionado;
    }

    var marker = new google.maps.Marker({
        position: location,
        map: mapa,
        draggable: drag,
        icon: icono,
        solucionado: false,
        iconBu: icono,
        id: id,
        texto: texto,
        fecha: fecha,
        tipo: tipo
    });

    if (loaded) {
        google.maps.event.addListener(marker, 'rightclick', function() {
            if (cant_solucionados >= 2) {
                alert("¡No podes borrar tantos puntos!");
                return;
            }
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
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.close();
            if (marker.texto) infowindow.setContent('<h4><small>ID: ' + marker.id + ' - Agregado: ' + marker.fecha + '</small><br>' + marker.texto + '</h4>');
            else infowindow.setContent('<h4><small>ID: ' + marker.id + ' - Agregado: ' + marker.fecha + '</small></h4>');
            infowindow.open(mapa, marker);
        });
    } else {
        google.maps.event.addListener(marker, 'rightclick', function(event) {
            infowindow.close();
            removeMarker(marker);
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.close();
            google.maps.event.clearListeners(infowindow, 'domready');
            if (marker.texto) infowindow.setContent('<h4>' + marker.texto + '</h4>');
            else {
                infowindow.setContent('<h4><textarea rows="4" cols="30" id="obtener_texto" placeholder="Descripcion del motivo" maxlength="255"></textarea><br><button type="button" class="btn btn-default" id="guardar_texto">Guardar</button></h4>');
                google.maps.event.addListener(infowindow, 'domready', function() {
                    $('#guardar_texto').on('click', function() {
                        marker.texto = $('#obtener_texto').val();
                        tutorialHandler("cuatro");
                        infowindow.close();
                    });
                });
            }
            infowindow.open(mapa, marker);
        });
        google.maps.event.addListener(marker, 'dragend', function(event) {
            var inBounds = google.maps.geometry.poly.containsLocation(event.latLng, partido_quilmes);
            if (!inBounds) {
                alert("¡El punto debe ser marcado dentro del area de Quilmes!");
                removeMarker(marker);
            }
        });
    }

    if (!loaded) google.maps.event.trigger(marker, 'click');
    if (!loaded) pushMarker(marker);

    //Des seleccionar lo que quedo marcado
    document.getSelection().removeAllRanges();
}

function getIcon(categoria) {
    var devolucion = 'otro.png'
    if (categoria === 'camaras') devolucion = 'img/icons/camaras.png';
    if (categoria === 'podas') devolucion = 'img/icons/podas.png';
    if (categoria === 'iluminacion') devolucion = 'img/icons/iluminacion.png';
    if (categoria === 'inseguridad') devolucion = 'img/icons/inseguridad.png';
    if (categoria === 'bacheo') devolucion = 'img/icons/bacheo.png';
    if (categoria === 'otro') devolucion = 'img/icons/otro.png';

    return devolucion;
}

function pushMarker(marker) {
    cant_markers++;
    if (marker.tipo === 'camaras') camaras.push(marker);
    if (marker.tipo === 'podas') podas.push(marker);
    if (marker.tipo === 'iluminacion') iluminacion.push(marker);
    if (marker.tipo === 'inseguridad') inseguridad.push(marker);
    if (marker.tipo === 'bacheo') bacheo.push(marker);
    if (marker.tipo === 'otro') otro.push(marker);
}

function removeMarker(marker) {
    marker.setMap(null);
    cant_markers--;

    if (marker.tipo === 'camaras') camaras.splice(camaras.indexOf(marker), 1);
    if (marker.tipo === 'podas') podas.splice(podas.indexOf(marker), 1);
    if (marker.tipo === 'iluminacion') iluminacion.splice(iluminacion.indexOf(marker), 1);
    if (marker.tipo === 'inseguridad') inseguridad.splice(inseguridad.indexOf(marker), 1);
    if (marker.tipo === 'bacheo') bacheo.splice(bacheo.indexOf(marker), 1);
    if (marker.tipo === 'otro') otro.splice(otro.indexOf(marker), 1);
}

function textoReplace(texto) {
    var removeHtml = /(<([^>]+)>)/ig;
    var textoFinal = texto;

    if (textoFinal) textoFinal = textoFinal.replace(removeHtml, "");
    else textoFinal = "";

    return textoFinal;
}

function getArrayMarkers(){
    var arrayMarkers = new Array();
    var removeHtml = /(<([^>]+)>)/ig;

    //Nuevos
    for (var i = otro.length - 1; i >= 0; i--) {
        var objeto = {
            lat: otro[i].position.lat(),
            lng: otro[i].position.lng(),
            tipo: 'otro',
            texto: textoReplace(otro[i].texto)
        };
        if (otro[i].solucionado == false) arrayMarkers.push(objeto);
    };

    for (var i = bacheo.length - 1; i >= 0; i--) {
        var objeto = {
            lat: bacheo[i].position.lat(),
            lng: bacheo[i].position.lng(),
            tipo: 'bacheo',
            texto: textoReplace(bacheo[i].texto)
        };
        if (bacheo[i].solucionado == false) arrayMarkers.push(objeto);
    };

    for (var i = camaras.length - 1; i >= 0; i--) {
        var objeto = {
            lat: camaras[i].position.lat(),
            lng: camaras[i].position.lng(),
            tipo: 'camaras',
            texto: textoReplace(camaras[i].texto)
        };
        if (camaras[i].solucionado == false) arrayMarkers.push(objeto);
    };

    for (var i = podas.length - 1; i >= 0; i--) {
        var objeto = {
            lat: podas[i].position.lat(),
            lng: podas[i].position.lng(),
            tipo: 'podas',
            texto: textoReplace(podas[i].texto)
        };
        if (podas[i].solucionado == false) arrayMarkers.push(objeto);
    };

    for (var i = iluminacion.length - 1; i >= 0; i--) {
        var objeto = {
            lat: iluminacion[i].position.lat(),
            lng: iluminacion[i].position.lng(),
            tipo: 'iluminacion',
            texto: textoReplace(iluminacion[i].texto)
        };
        if (iluminacion[i].solucionado == false) arrayMarkers.push(objeto);
    };

    for (var i = inseguridad.length - 1; i >= 0; i--) {
        var objeto = {
            lat: inseguridad[i].position.lat(),
            lng: inseguridad[i].position.lng(),
            tipo: 'inseguridad',
            texto: textoReplace(inseguridad[i].texto)
        };
        if (inseguridad[i].solucionado == false) arrayMarkers.push(objeto);
    };

    return arrayMarkers;
}

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

function vaciarArrays(){
    otro = [];
    bacheo = [];
    camaras = [];
    podas = [];
    iluminacion = [];
    inseguridad = [];
    solucionados = [];
}

function guardar() {
    var arrayMarkers = getArrayMarkers();
    var arraySolucionados = getArraySolucionados();

    if (arraySolucionados.length > 0) {
        $.post('php/dataHandler.php', {
            action: 'solucionar_markers',
            solucionados: arraySolucionados,
            ip: userIP
        }, function(data) {
            if (data == true) alert("Corregido, gracias por su colaboracion");
            if (data == false) alert("Hubo un error, pruebe nuevamente mas tarde, gracias!");
            vaciarArrays();
            location.reload();
        }, "json");
    }

    if (arrayMarkers.length > 0) {
        $.post('php/dataHandler.php', {
            action: 'push_markers',
            markers: arrayMarkers,
            ip: userIP
        }, function(data) {
            if (data == true) alert("Agregado correctamente, gracias por su colaboracion");
            if (data == false) alert("Hubo un error, pruebe nuevamente mas tarde, gracias!");
            vaciarArrays();
            location.reload();
        }, "json");
    }
}

function tutorialHandler(item){
    if(!tutorial.mostrar) return;
    toastr.clear();
    switch(item){
        case "uno":
            if(tutorial.uno) return;
            toastr.info("Presione 'Agregar item' en la barra superior y elija la categoría del punto que desea agregar", "Paso 1");
            tutorial.uno = true;
        break;
        case "dos":
            if(tutorial.dos) return;
            toastr.info("Puede ingresar la dirección que desea buscar en 'Buscar dirección', en la esquina superior izquierda del mapa", "TIP");
            toastr.info("Busque en el mapa el lugar donde desea agregar el punto y haga doble click sobre el mismo, ayudese con los botones de + y - que se encuentran en la esquina superior derecha para acercar y alejar el mapa", "Paso 2");
            tutorial.dos = true;
        break;
        case "tres":
            if(tutorial.tres) return;
            toastr.info("Puede ver el mapa en modo satelite tocando el boton 'Hibrido' en el centro inferior del mapa", "TIP");
            toastr.info("Puede borrar el punto creado haciendole click derecho, o arrastrarlo para cambiar su ubicación", "TIP");
            toastr.info("Una ventana aparecerá. Cargue una descripcion anonima y presione guardar", "Paso 3");
            tutorial.tres = true;
        break;
        case "cuatro":
            if(tutorial.cuatro) return;
            toastr.info("Puede ver los puntos en tiempo real arrastrando el hombre naranja que se encuentra en la esquina superior derecha del mapa y soltarlo en la calle que desee ver", "TIP");
            toastr.success("Presione 'Guardar datos' en la esquina superior derecha para guardar los puntos permanentemente en el mapa, o siga marcando puntos y luego presione 'Guardar datos'", "¡Muy bien!");
            tutorial.cuatro = true;
        break;
    }
}

function respTutorial(res){
    if(res === "si"){
        tutorial.mostrar = true;
        tutorialHandler("uno");
    }
}

window.onbeforeunload = function() {
    var hook = getArrayMarkers().length ? true : false;
    if (hook) {
      return "¡No guardaste los puntos permamentemente en el mapa!, por favor, cerrá esta ventana y presioná 'Guardar datos' en la esquina superior derecha"
    }
}
