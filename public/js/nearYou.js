const loadTheMap = (latitude, longitude) => {
  console.log("loading the map in ", latitude, longitude);
  var mymap = L.map("nearYou").setView([latitude, longitude], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiYWxudGphbiIsImEiOiJja3Q0dnFyOG0wMm9tMnZwZGk3ajNxNW9xIn0.dAZr3O5vFdiAf-BWZx9etg",
    }
  ).addTo(mymap);
  var marker = L.marker([latitude, longitude]).addTo(mymap);
  marker.bindPopup("<a href='/bored-pokemon/154'>Pokemon</a>");
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    // console.log("nearYou map loaded correctly");

    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords);
      loadTheMap(position.coords.latitude, position.coords.longitude);
    });
  },
  false
);

console.log(navigator.geolocation.getCurrentPosition(position));
