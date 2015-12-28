function getIcon(categoria) {
  return categoria ? 'img/icons/' + categoria + '.png' : 'img/icons/otro.png';
}

{% if extras.editable %}
  function textoReplace(texto) {
    var removeHtml = /(<([^>]+)>)/ig;
    return texto ? texto.replace(removeHtml, "") : "";
  }

  function vaciarArrays() {
    for (var cat in markerContainer) {
      markerContainer[cat] = [];
    }
  }

  window.onbeforeunload = function() {
    var hook = getArrayMarkers()
      .length ? true : false;
    if (hook) {
      return "¡No guardaste los puntos permamentemente en el mapa!, por favor, cerrá esta ventana y presioná 'Guardar datos' en la esquina superior derecha"
    }
  }
{% endif %}
