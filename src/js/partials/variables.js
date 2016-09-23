//Cargamos las categorias desde nunjucks
var categorias = [{% for categoria in categorias -%}{ label: '{{categoria.label}}', value: '{{categoria.value}}', estatica: {{categoria.estatica}}} {{"" if loop.last else ","}} {%- endfor %}];

var listaCategorias = [];
var categoriasFijas = [];
var markerContainer = {};

{% if caracteristicas.usuario.registros.agregar.permitir %}
  var itemSeleccionado;
  var cant_markers = 0;

  {% if caracteristicas.usuario.registros.borrar.permitir %}
    var solucionados = [];
    var cant_solucionados = 0;
  {% endif %}
{% endif %}

{% if opciones.como_llegar %}
  var avisoBorrado = false;
{% endif %}
