// This file must be called only after stopTimesData is fully loaded

let stops = [];

async function loadStops() {
  const response = await fetch('data/stops.json');
  stops = await response.json();
  populateDropdowns();
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

// Trigger on page load
window.addEventListener("DOMContentLoaded", () => {
  loadStops();

  const searchBtn = document.getElementById("findRouteBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", findRoute);
  }
});
