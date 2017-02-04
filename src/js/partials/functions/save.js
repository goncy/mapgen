{% if caracteristicas.usuario.registros.agregar.permitir %}
  //Funcion de guardar
  function guardar() {
    var arrayMarkers = getArrayMarkers();

    if (arrayMarkers.length > 0) {
      $.post('php/dataHandler.php', {
        action: 'push_markers',
        markers: arrayMarkers
      }, function(data) {
        if (data == true) alert("{{texto.guardado}}");
        if (data == false) alert("Hubo un error, pruebe nuevamente mas tarde, gracias!");
        vaciarArrays();
        location.reload();
      }, "json");
    }

    {% if caracteristicas.usuario.registros.borrar.permitir %}
      var arraySolucionados = getArraySolucionados();

      if (arraySolucionados.length > 0) {
          $.post('php/dataHandler.php', {
              action: 'solucionar_markers',
              solucionados: arraySolucionados
          }, function(data) {
              if (data == true) alert("{{texto.eliminado}}");
              if (data == false) alert("Hubo un error, pruebe nuevamente mas tarde, gracias!");
              vaciarArrays();
              location.reload();
          }, "json");
      }
    {% endif %}
  }
{% endif %}
