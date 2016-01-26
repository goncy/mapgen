{% if extras.agregable %}
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

    {% if extras.solucionable %}
      var arraySolucionados = getArraySolucionados();

      if (arraySolucionados.length > 0) {
          $.post('php/dataHandler.php', {
              action: 'solucionar_markers',
              solucionados: arraySolucionados
          }, function(data) {
              if (data == true) alert("Corregido, gracias por su colaboracion");
              if (data == false) alert("Hubo un error, pruebe nuevamente mas tarde, gracias!");
              vaciarArrays();
              location.reload();
          }, "json");
      }
    {% endif %}
  }
{% endif %}
