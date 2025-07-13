let stops = [];

async function loadStops() {
  const response = await fetch('data/stops.json');
  stops = await response.json();
  populateDropdowns();
  detectLocationAndSelectNearestStop();
}

function populateDropdowns() {
  const fromSelect = document.getElementById('fromStop');
  const toSelect = document.getElementById('toStop');

  stops.forEach(stop => {
    const option1 = new Option(stop.stop_name, stop.stop_id);
    const option2 = new Option(stop.stop_name, stop.stop_id);
    fromSelect.add(option1);
    toSelect.add(option2);
  });
}

function findRoute() {
  const fromId = document.getElementById('fromStop').value;
  const toId = document.getElementById('toStop').value;

  if (!fromId || !toId) {
    alert("Please select both stops.");
    return;
  }

  const matchingTrips = stopTimesData.reduce((acc, entry) => {
    acc[entry.trip_id] = acc[entry.trip_id] || [];
    acc[entry.trip_id].push(entry.stop_id);
    return acc;
  }, {});

  const possibleTrips = Object.entries(matchingTrips).filter(([tripId, stops]) => {
    return stops.includes(fromId) && stops.includes(toId) && stops.indexOf(fromId) < stops.indexOf(toId);
  });

  const resultsDiv = document.getElementById('routeResults');
  resultsDiv.innerHTML = "";

  if (possibleTrips.length === 0) {
    resultsDiv.innerHTML = "No direct route found.";
  } else {
    resultsDiv.innerHTML = `<strong>Found ${possibleTrips.length} matching route(s).</strong>`;
  }
}

function detectLocationAndSelectNearestStop() {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    let nearestStop = null;
    let minDistance = Infinity;

    stops.forEach(stop => {
      const dist = getDistance(userLat, userLon, parseFloat(stop.stop_lat), parseFloat(stop.stop_lon));
      if (dist < minDistance) {
        minDistance = dist;
        nearestStop = stop;
      }
    });

    if (nearestStop) {
      document.getElementById('fromStop').value = nearestStop.stop_id;
      console.log(`📍 Nearest stop auto-selected: ${nearestStop.stop_name}`);
    }
  }, err => {
    console.warn("Location access denied or unavailable.");
  });
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c;
  return d;
}

window.addEventListener("DOMContentLoaded", () => {
  loadStops();

  const searchBtn = document.getElementById("findRouteBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", findRoute);
  }
});
