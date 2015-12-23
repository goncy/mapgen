{% if extras.editable %}
  //Funcion de guardar
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
{% endif %}
