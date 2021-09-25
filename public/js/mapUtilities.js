const addCurrentLocationMarker = (latitude, longitude, map) => {
  const myIcon = L.divIcon({ className: "pulsating-circle" });
  const marker = L.marker([latitude, longitude], { icon: myIcon }).addTo(map);
};

const addMarker = (latitude, longitude, map, event) => {
  const yourPos = L.marker([latitude, longitude]).addTo(map);
  yourPos.bindPopup(`${event.name} <a href="/events/${event._id}">More</a>`);
};

const accuracyCircle = (latitude, longitude, accuracy, map) => {
  var circle = L.circle([latitude, longitude], {
    color: "blue",
    fillColor: "#3bc0e8",
    fillOpacity: 0.25,
    radius: accuracy,
  }).addTo(map);
};

const loadTheMap = (mapObject, latitude, longitude, accuracy, events = [], latitudeOverride, longitudeOverride) => {
  mapObject.setView([latitudeOverride || latitude, longitudeOverride || longitude], 13);
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
  ).addTo(mapObject);

  // Here we add the users postion marker
  addCurrentLocationMarker(latitude, longitude, mapObject);
  accuracyCircle(latitude, longitude, accuracy, mapObject);

  // Creating markers for each event we've got
  events.forEach((event) => {
    addMarker(
      event.location.coordinates[0],
      event.location.coordinates[1],
      mapObject,
      event
    );
  });
};
