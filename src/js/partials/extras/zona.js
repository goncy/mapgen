if("{{paths[extras.zona]}}".length){
  var path = new google.maps.Polygon({
    strokeColor: "#7790D9",
    fillColor: "#A3BFD9",
    strokeOpacity: 1,
    strokeWeight: 1,
    fillOpacity: 0.25,
    map: mapa,
    paths: google.maps.geometry.encoding.decodePath("{{paths[extras.zona]}}")
  });
}
