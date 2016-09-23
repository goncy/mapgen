{% if caracteristicas.usuario.exportar %}

  function exportar () {

    var confirmar = confirm("Esto exportara a PDF la informacion de todos los puntos visibles en el mapa, en caso de querer filtrar los resultados antes de exportar hagalo desde el boton 'Filtrar' y luego exportelos.\n\n¿Quiere exportar los puntos visibles en el mapa?");

    if (!confirmar) return;

    var cliente = {
      nombre: "{{texto.nombre}}",
      mail: "{{texto.mail}}",
      web: "{{texto.web}}",
      telefono: "{{texto.telefono}}"
    };

    var registrosImportados = 0;

    var doc = new jsPDF();
    doc.setFontSize(26);
    doc.text(20, 20, cliente.nombre);

    doc.setFontSize(12);
    doc.text(20, 25, cliente.mail);
    doc.text(20, 30, cliente.web);
    doc.text(20, 35, cliente.telefono);

    var xPos = 35;

    for (var catIndex in markerContainer) {
      var markersToExport = markerContainer[catIndex].filter(function(mk){
        return (mk.getMap() !== null) && (mk.texto.length > 0);
      });

      if(!markersToExport.length) continue;

      var catName = $.grep(categorias, function(obj){ return obj.value === catIndex; })[0].label;
      doc.setFontSize(20);
      xPos += 5;
      doc.setLineWidth(0.5);
      doc.line(20, xPos, 60, xPos);
      xPos += 10;
      doc.text(20, xPos, catName);
      for (var markerInCatIndex = markersToExport.length - 1; markerInCatIndex >= 0; markerInCatIndex--) {
        var marker = markersToExport[markerInCatIndex];

        registrosImportados++;

        doc.setFontSize(12);
        var textoAppend = doc.splitTextToSize(marker.texto, 170);
        if (textoAppend && textoAppend.length > 0) {
          xPos += 5;
          for (var i = textoAppend.length - 1; i >= 0; i--) {
            if (textoAppend[i]) {
              xPos += 5;
              doc.text(20, xPos, textoAppend[i]);
            };
          };
          xPos += 2;
          doc.setLineWidth(0.2);
          doc.line(20, xPos, 35, xPos);
        };
      };
    };

    if (registrosImportados > 0) {
      doc.save(cliente.nombre + '.pdf');
    };
  }

{% endif %}