//Cargamos las categorias desde nunjucks
var categorias = [{% for categoria in categorias -%} '{{ categoria }}' {{"" if loop.last else ","}} {%- endfor %}];
var itemSeleccionado = categorias[0];
var markerContainer = {};

var cant_markers = 0;
var emptyTextArea = '<h4><textarea rows="4" id="obtener_texto" placeholder="Descripcion del motivo" maxlength="255"></textarea><br><button type="button" class="btn btn-default" id="guardar_texto">Guardar</button></h4>';
