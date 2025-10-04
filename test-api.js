// Test script for Gemini API
const testData = {
  asteroidName: "2023 BU",
  asteroidDiameter: 0.005, // 5 meters in km
  asteroidVelocity: 25,
  locationName: "New York City",
  lat: 40.7128,
  lng: -74.0060,
  impactAngle: 45,
  hazardous: true
};

fetch('http://localhost:3001/api/gemini-impact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});