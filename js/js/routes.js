const stops = [
  { name: "ISBT Kashmere Gate", lat: 28.6678, lon: 77.2274 },
  { name: "Lajpat Nagar", lat: 28.5692, lon: 77.2437 },
  { name: "AIIMS", lat: 28.5672, lon: 77.2100 },
  { name: "Rajouri Garden", lat: 28.6426, lon: 77.1221 },
  { name: "Saket", lat: 28.5245, lon: 77.2066 },
  { name: "Karol Bagh", lat: 28.6514, lon: 77.1902 },
  { name: "Dwarka", lat: 28.5921, lon: 77.0460 },
  { name: "Connaught Place", lat: 28.6315, lon: 77.2167 }
];

const routes = [
  { from: "ISBT Kashmere Gate", to: "Lajpat Nagar", buses: ["543", "425"] },
  { from: "AIIMS", to: "Saket", buses: ["604"] },
  { from: "Rajouri Garden", to: "Dwarka", buses: ["753", "990"] },
  { from: "Karol Bagh", to: "Connaught Place", buses: ["440"] },
  { from: "ISBT Kashmere Gate", to: "Connaught Place", buses: ["39", "405"] }
];
