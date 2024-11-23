const url = "https://www.expedia.com/Chico-Hotels-DoubleTree-By-Hilton-Chico.h19963.Hotel-Information?chkin=2024-11-29&chkout=2024-11-30&flexibility=7_DAY&srpStartDate=2024-12-01&srpEndDate=2024-12-02&x_pwa=1&rfrr=HSR&pwa_ts=1732402394970&referrerUrl=aHR0cHM6Ly93d3cuZXhwZWRpYS5jb20vSG90ZWwtU2VhcmNo&useRewards=false&rm1=a2&regionId=6055356&destination=Chico%2C+California%2C+United+States+of+America&destType=MARKET&latLong=39.728493%2C-121.837479&trackingData=AAAAAQAAAAEAAAAQhi0S2hqL-bDX1-nUURSCYttJpxywUItq-mY6oYe-_ZShe3fcDjleKKQ2Shfeh7wOJHd28nqtdTGZudK3wrnIqZQw9iD2zF1ysyf9Kgwc-AquKwnLKuhM5MVlQRfJ6KKrfhxFxgvFQLCIdv-OlYHbPCYNOY1ALPAF5LytxxZQIixmARSyhLrMXHmPffZi9pLHm_0ecAmPnVcq1Bw4xTT9MQoJz5B3ApD0Lac78Whv_3v5RHbM2SoUIJSxIWBXgJCeJ4ZKW-2NIL6qO7bvDAz-U5EJP06Jdp_kNNfs0y1UKTpw_rQ3qQYAvECyYi_sMy0d9Byd3Ss-LeM7oxa-f9-ADHgELdryxqiUS3BuhS9_f_nuUK6iGEAKvyXs7T_Kw7tkvMcLEF7QKzrKh06uMyvDXhyjijIoq-0qrW1NCh6sQUakSX2t7FiO-F-E1_jYfDOkfjGuOUqFRkQgfkDRn6YeUteON4V7-YW2mRAOLz0FF6JXO0f78CZHBFBy8qnl8ZysIIIkj66CzuPZ2LHEmQK-kO3D3u4lIF9mTO8eWQgOv8lqk8FZQIwtWc7zXgOuNo4sOpIssTZbyf0bjedtCvXUVnriR0kjP2th6xOkfHZBIYBzvqwRxHu90cB9vJwF4T3coU7v_JpBG8ku2umbqpSzF6Sdt17DCQNPmUwAT5S4TqMxL0rIPeHcs8uDP1TCpz7J4mPJQlw6r_1SGzU13XKi13K1gRY9tUu9Ci2ehbNne9tkj764lheuhNWiLxQd4hjJYJb3_lk1uMu-obu77k8t6TXOiRAfySkiHMct1e-S4ftPrVWdN9Od00niag526CeV1xfOe3cp0C3nsxGhozkp1EKkfUOo8xV7aP5xO1vyHYb1fg3HQiPbI2F0IgnCOMQn2JjnKpo9CWtpJ4JrI39l6giOcqn6ubXOXd_N4hiKoCbNOeP8hSU1Ok3Gn2w9JGirRK0CmNux8NeVqd4MsD36j164FlwXGw7r2NSA-qK7c6oslFE24KVGpapgyJGyOzKgVV9AJcGvvh_9ghZrEmR78F43kEolYUw6MMG98Am-JYwSlo8Prnn7lEEcFfbA9TxEouq-RyKMh5MB1oo6Xg5szUXyOcqtPj_HkjKrbi3uwnCVzS0qQpD4qlg3Tc6qDQwyWKY9r8LXwI8tQa1ewfOdUMZOwz8qUm6rQhjvEKVRzmFKKhck7tRL4Ob47ZbmKBnU2NCCtzczaM7V7T51yjrq-DPXT7-SWmq_gKrMA3qhwM5Xx7aO9u34JkdsSoiTiZZQAJlh4uPPAlQejuGZjvpfi6nSL_2gPdaAW2CyFedFQWQgiQUzfpyDBGpLKgc0rvxTpk-2fbDlTI_HkD7mmEbBtQ%3D%3D&rank=2&testVersionOverride=Buttercup%2C39483.0.0%2C50028.0.0%2C50813.0.0%2C51642.169494.0%2C51690.201908.0%2C52131.187852.1%2C54709.194717.1%2C59134.0.0%2C50988.158353.0%2C54072.200650.1%2C57292.191889.0&slots=&position=2&beaconIssued=&sort=RECOMMENDED&top_dp=116&top_cur=USD&userIntent=&selectedRoomType=212112692&selectedRatePlan=397802018&searchId=a6e95f87-149d-4e17-a77a-ae1596afe144";

fetch(url)
  .then(response => response.text())
  .then(html => {
    // 1. Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 2. Extract hotel information (example)
    const hotelName = doc.querySelector('h1.uitk-heading-3').textContent; 
    const hotelAddress = doc.querySelector('.uitk-type-start-t').textContent; // Assuming this is the address selector

    // 3. Extract image URLs (example)
    const imageUrls = Array.from(doc.querySelectorAll('.uitk-image-media img'))
        .map(img => img.src);

    // 4. Display the information on your page
    const hotelInfoDiv = document.getElementById('hotelInfo');
    hotelInfoDiv.innerHTML = `
        <h2>${hotelName}</h2>
        <p>${hotelAddress}</p>
    `;

    // 5. Display images
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('img-container'); 
    imageUrls.forEach(imageUrl => {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = "Hotel Image";
        imageContainer.appendChild(imgElement);
    });
    hotelInfoDiv.appendChild(imageContainer);  
  })
  .catch(error => {
    console.error("Error fetching hotel information:", error);
  });
