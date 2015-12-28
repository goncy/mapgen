//Cargamos las categorias desde nunjucks
var categorias = [{% for categoria in categorias -%} '{{ categoria }}' {{"" if loop.last else ","}} {%- endfor %}];
var markerContainer = {};

{% if extras.editable %}
  var itemSeleccionado = categorias[0];
  var cant_markers = 0;
{% endif %}

{% if extras.editable %}
  var avisoBorrado = false;
{% endif %}

{% if extras.solucionable %}
  var solucionados = [];
  var cant_solucionados = 0;
{% endif %}
