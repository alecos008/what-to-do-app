document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("what-to-do-app JS imported successfully!");
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords);
    });
  },
  false
);
