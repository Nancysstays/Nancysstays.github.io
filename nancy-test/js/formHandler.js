const form = document.getElementById('hotelSearchForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const destination = document.getElementById('destination').value;
  const checkInDate = document.getElementById('checkInDate').value;
  const checkOutDate = document.getElementById('checkOutDate').value;
  const guests = document.getElementById('guests').value;

  let expediaUrl = 'https://www.expedia.com/Hotel-Search?';
  expediaUrl += `destination=${encodeURIComponent(destination)}`;
  expediaUrl += `&d1=${checkInDate}`;
  expediaUrl += `&d2=${checkOutDate}`;
  expediaUrl += `&adults=${guests}`;
  expediaUrl += `&rooms=1`;
  expediaUrl += '&siteid=1';
  expediaUrl += '&langid=1033';
  expediaUrl += '&clickref=YOUR_CLICKREF'; //YOUR ACTUAL VALUES
  expediaUrl += '&affcid=YOUR_AFFCID';
  expediaUrl += '&ref_id=YOUR_REF_ID';
  expediaUrl += '&my_ad=YOUR_MY_AD';
  expediaUrl += '&afflid=YOUR_AFFLID';
  expediaUrl += '&affdtl=YOUR_AFFDTL';

  window.location.href = expediaUrl;
});

