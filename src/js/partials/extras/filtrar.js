{% if extras.filtrable.mostrar %}
  function filtrar() {
      infowindow.close();

      var desde = $('#filtro-desde').val() || "";
      var hasta = $('#filtro-hasta').val() || "";
      var catFiltradas = $('#filtro-categorias').val() || [];
      var debeFiltrarPorFecha = true;

      if ((desde && !hasta) || (!desde && hasta)) {
          alert('Marque ambas fechas de inicio y final para filtrar por fecha');
          return;
      } else if (!desde && !hasta) {
        debeFiltrarPorFecha = false;
      };

      for (var cat in markerContainer) {
        for (var mk in markerContainer[cat]) {
          var estaEnFecha = markerContainer[cat][mk].fecha <= hasta && markerContainer[cat][mk].fecha >= desde ? true : false;
          var estaEnCategoria = catFiltradas.indexOf(markerContainer[cat][mk].tipo) >= 0 ? true : false;
          if (debeFiltrarPorFecha) {
            if (!estaEnFecha || !estaEnCategoria){
                markerContainer[cat][mk].setMap(null);
            } else {
              markerContainer[cat][mk].setMap(mapa);
            }
          } else {
            if (!estaEnCategoria){
                markerContainer[cat][mk].setMap(null);
            } else {
              markerContainer[cat][mk].setMap(mapa);
            }
          };
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
