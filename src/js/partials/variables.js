//Cargamos las categorias desde nunjucks
var categorias = [{% for categoria in categorias -%}{ label: '{{categoria.label}}', value: '{{categoria.value}}', estatica: {{categoria.estatica}}} {{"" if loop.last else ","}} {%- endfor %}];

var listaCategorias = [];
var categoriasFijas = [];
var markerContainer = {};

{% if extras.agregable %}
  var itemSeleccionado = categorias[0].value;
  var cant_markers = 0;

  {% if extras.solucionable %}
    var solucionados = [];
    var cant_solucionados = 0;
  {% endif %}
{% endif %}

{% if extras.comoLlegar %}
  var avisoBorrado = false;
{% endif %}
