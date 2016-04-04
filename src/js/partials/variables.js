//Cargamos las categorias desde nunjucks
var categorias = [{% for categoria in categorias -%}{ label: '{{categoria.label}}', value: '{{categoria.value}}', estatica: {{categoria.estatica}}} {{"" if loop.last else ","}} {%- endfor %}];

var listaCategorias = [];
var categoriasFijas = [];
var markerContainer = {};

{% if extras.markers.agregable.state %}
  var itemSeleccionado;
  var cant_markers = 0;

  categorias.forEach(function (cat) {
    if (cat.estatica == false) {
      itemSeleccionado = cat.value;
      return;
    }
  });

  {% if extras.markers.solucionable.state %}
    var solucionados = [];
    var cant_solucionados = 0;
  {% endif %}
{% endif %}

{% if extras.comoLlegar %}
  var avisoBorrado = false;
{% endif %}
