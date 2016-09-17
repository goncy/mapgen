if("{{extras.zona}}".length){
  var path = new google.maps.Polygon({
    strokeColor: "#7790D9",
    fillColor: "#A3BFD9",
    strokeOpacity: 1,
    strokeWeight: 1,
    fillOpacity: 0.25,
    map: mapa,
    paths: [
      {% for zona in extras.zona -%}
        {% if paths[zona] %}google.maps.geometry.encoding.decodePath("{{paths[zona]}}"){% endif %}{{"" if loop.last else ","}}
      {%- endfor %}
    ]
  });
}
