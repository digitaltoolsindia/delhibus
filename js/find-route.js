async function loadData(file) {
  const response = await fetch(file);
  return await response.json();
}

async function getAvailableRoutes(fromStop, toStop) {
  const [trips, routes] = await Promise.all([
    loadData("data/trips.json"),
    loadData("data/routes.json")
  ]);

  const allStopTimes = [];

  for (let i = 1; i <= 38; i++) {
    const chunk = await loadData(`data/stop_times_${i}.json`);
    allStopTimes.push(...chunk);
  }

  const stopTimeMap = {};
  allStopTimes.forEach((entry, index) => {
    if (!stopTimeMap[entry.trip_id]) stopTimeMap[entry.trip_id] = [];
    stopTimeMap[entry.trip_id].push({ stop_id: entry.stop_id, index });
  });

  const validRouteIds = new Set();

  for (const trip_id in stopTimeMap) {
    const stops = stopTimeMap[trip_id].map(e => e.stop_id);
    const fromIndex = stops.indexOf(fromStop);
    const toIndex = stops.indexOf(toStop);

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
      const trip = trips.find(t => t.trip_id === trip_id);
      if (trip) validRouteIds.add(trip.route_id);
    }
  }

  const matchedRoutes = routes.filter(r => validRouteIds.has(r.route_id));
  return matchedRoutes.map(r => r.route_short_name || r.route_id);
}

function populateStops() {
  fetch("data/stops.json")
    .then(response => response.json())
    .then(data => {
      const fromSelect = document.getElementById("fromStop");
      const toSelect = document.getElementById("toStop");

      data.forEach(stop => {
        const option1 = new Option(stop.stop_name, stop.stop_id);
        const option2 = new Option(stop.stop_name, stop.stop_id);
        fromSelect.add(option1);
        toSelect.add(option2);
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          let nearestStop = data[0];
          let minDist = Infinity;

          data.forEach(stop => {
            const dist = Math.sqrt(
              Math.pow(stop.stop_lat - userLat, 2) + Math.pow(stop.stop_lon - userLon, 2)
            );
            if (dist < minDist) {
              minDist = dist;
              nearestStop = stop;
            }
          });

          fromSelect.value = nearestStop.stop_id;
        });
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  populateStops();

  document.getElementById("findRouteBtn").addEventListener("click", async () => {
    const fromStop = document.getElementById("fromStop").value;
    const toStop = document.getElementById("toStop").value;

    if (!fromStop || !toStop) {
      alert("Please select both From and To stops.");
      return;
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "⏳ Finding routes...";

    const routes = await getAvailableRoutes(fromStop, toStop);

    if (routes.length === 0) {
      resultDiv.innerHTML = "❌ No direct bus route found from A to B.";
    } else {
      resultDiv.innerHTML = `<b>🚌 Available Routes:</b><br>${routes.join("<br>")}`;
    }
  });
});
