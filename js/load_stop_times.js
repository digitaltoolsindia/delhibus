// Load and merge stop_times_part1.json to stop_times_part38.json
const stopTimesData = [];

async function loadAllStopTimes() {
  const totalParts = 38;
  for (let i = 1; i <= totalParts; i++) {
    const fileName = `data/stop_times_part${i}.json`;
    try {
      const response = await fetch(fileName);
      const partData = await response.json();
      stopTimesData.push(...partData);
      console.log(`Loaded ${fileName} with ${partData.length} entries`);
    } catch (error) {
      console.error(`Error loading ${fileName}:`, error);
    }
  }

  console.log(`✅ All stop_times parts loaded. Total records: ${stopTimesData.length}`);
}
