{% if extras.filtrable %}
  function filtrar() {
      infowindow.close();

      var desde = $('#filtro-desde').val();
      var hasta = $('#filtro-hasta').val();
      var categorias = $('#filtro-categorias').val();

      if (!desde || !hasta || !categorias) {
          alert('Marque fecha de inicio, final y categorias');
          return;
      }

      for (var cat in markerContainer) {
        for (var mk in markerContainer[cat]) {
          var estaEnFecha = markerContainer[cat][mk].fecha <= hasta && markerContainer[cat][mk].fecha >= desde ? true : false;
          var estaEnCategoria = categorias.indexOf(markerContainer[cat][mk].tipo) >= 0 ? true : false;
          if (!estaEnFecha || !estaEnCategoria){
              markerContainer[cat][mk].setMap(null);
          }
          else markerContainer[cat][mk].setMap(mapa);
        }
      };

      $('#modal-filtros').modal('hide');
  }

  function reiniciarFiltros() {
    for (var cat in markerContainer) {
      for (var mk in markerContainer[cat]) {
        markerContainer[cat][mk].setMap(mapa);
      }
    };

    $('#filtro-desde').val('');
    $('#filtro-hasta').val('');
    $('#filtro-categorias').val('');

    $('#modal-filtros').modal('hide');
  }
{% endif %}
