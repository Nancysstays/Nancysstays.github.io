const userInput = document.getElementById('user-input');
const generateBtn = document.getElementById('generate-btn');
const generatedText = document.getElementById('generated-text');

generateBtn.addEventListener('click', () => {
  const prompt = userInput.value;

  // Call the API (replace with your actual API call)
  fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer AIzaSyDQrSmRiGSdgD50wdDypG5z7MTWDRNVl1k'
    },
    body: JSON.stringify({
      prompt: prompt,
      // Add other parameters as needed (e.g., model, temperature)
    })
  })
  .then(response => response.json())
  .then(data => {
    generatedText.textContent = data.generated_text; // Update with the actual response field
  })
  .catch(error => {
    console.error('Error:', error);
    generatedText.textContent = 'An error occurred.';
  });
});