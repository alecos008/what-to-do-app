const marker = L.marker();
const onMapClick = (e) => {
  marker.setLatLng(e.latlng).addTo(e.sourceTarget);
  document.getElementById("latitude").setAttribute("value", e.latlng.lat);
  document.getElementById("longitude").setAttribute("value", e.latlng.lng);
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const mapObject = L.map("createEventMap");
      loadTheMap(
        mapObject,
        position.coords.latitude,
        position.coords.longitude,
        position.coords.accuracy
      );
      mapObject.on("click", onMapClick);
    });
  },
  false
);
