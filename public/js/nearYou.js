document.addEventListener(
  "DOMContentLoaded",
  () => {
    navigator.geolocation.getCurrentPosition((position) => {
      loadTheMap(
        L.map("nearYou"),
        position.coords.latitude,
        position.coords.longitude,
        position.coords.accuracy,
        allEvents
      );
    });
  },
  false
);
