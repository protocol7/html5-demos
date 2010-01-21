function drawMap(position, elm) {
  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(elm, myOptions);

  new google.maps.Marker({
      position: latlng, 
      map: map, 
      title:"We are here!"
  });
}

