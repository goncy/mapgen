if("{{opciones.zonas}}".length){
  window.path = new google.maps.Polygon({
    strokeColor: "#7790D9",
    fillColor: "#A3BFD9",
    strokeOpacity: 1,
    strokeWeight: 1,
    fillOpacity: 0.25,
    map: mapa,
    paths: [
      {% for zona in opciones.zonas -%}
        {% if zonas[zona] %}google.maps.geometry.encoding.decodePath("{{zonas[zona]}}"){% endif %}{{"" if loop.last else ","}}
      {%- endfor %}
    ]
  });
}
