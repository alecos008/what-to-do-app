document.addEventListener(
  "DOMContentLoaded",
  () => {
    navigator.geolocation.getCurrentPosition((position) => {
      loadTheMap(
        L.map("eventMap"),
        position.coords.latitude,
        position.coords.longitude,
        position.coords.accuracy,
        allEvents,
        allEvents[0].location.coordinates[0],
        allEvents[0].location.coordinates[1]
      );
    });
  },
  false
);
