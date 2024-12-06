const form = document.getElementById('hotelSearchForm');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  const destination = document.getElementById('destination').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const adults = document.getElementById('adults').value;
  const rooms = document.getElementById('rooms').value;

  // Build the Expedia URL based on user input
  let url = 'https://www.expedia.com/Hotel-Search?';
  url += `destination=${destination}`;

  // You might need to handle latitude/longitude differently based on Expedia's API
  // This example includes placeholder values
  url += '&latLong=39.728493,-121.837479';
  url += '&flexibility=0_DAY';
  url += `&d1=${startDate}&startDate=${startDate}`;
  url += `&d2=${endDate}&endDate=${endDate}`;
  url += `&adults=${adults}`;
  url += `&rooms=${rooms}`;

  console.log('Generated Expedia URL:', url);

  // Optionally, redirect the user to the generated URL
  window.location.href = url;
});
