document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const categories = [
        "Bone",
        "Muscle",
        "Organ",
        "Body System",
        "Joint Type",
        "Blood Vessel",
        "Nerve",
        "Region of the Body"
        // Add more categories as needed
    ];
    const alphabet = "ABCDEFGHIJKLMNOPRSTUVW"; // Excluded X, Y, Z, Q for simplicity
    const roundTimeSeconds = 90; // 1.5 minutes per round

    // --- DOM Elements ---
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const gameArea = document.getElementById('gameArea');
    const letterDisplay = document.getElementById('letter-display');
    const timerDisplay = document.getElementById('timer-display');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const gameForm = document.getElementById('gameForm');
    const resultsArea = document.getElementById('resultsArea');
    const submittedAnswersList = document.getElementById('submittedAnswers');

    // --- Game State ---
    let currentLetter = '';
    let timerInterval = null;
    let timeLeft = 0;

    // --- Functions ---
    function getRandomLetter() {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        return alphabet[randomIndex];
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
    }

    function startTimer() {
        timeLeft = roundTimeSeconds;
        updateTimerDisplay(); // Initial display

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                endRound();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function displayCategories() {
        categoriesContainer.innerHTML = ''; // Clear previous categories
        categories.forEach((category, index) => {
            const div = document.createElement('div');
            div.classList.add('row', 'mb-2', 'align-items-center', 'category-item');

            const labelCol = document.createElement('div');
            labelCol.classList.add('col-sm-4');
            const label = document.createElement('label');
            label.htmlFor = `category-${index}`;
            label.classList.add('form-label');
            label.textContent = category + ":";
            labelCol.appendChild(label);

            const inputCol = document.createElement('div');
            inputCol.classList.add('col-sm-8');
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `category-${index}`;
            input.name = `category-${index}`;
            input.classList.add('form-control');
            input.dataset.categoryName = category; // Store category name for later
            inputCol.appendChild(input);

            div.appendChild(labelCol);
            div.appendChild(inputCol);
            categoriesContainer.appendChild(div);
        });
    }

    function startRound() {
        console.log("Starting round...");
        // Reset UI
        gameArea.classList.remove('d-none'); // Show game area
        resultsArea.classList.add('d-none'); // Hide results
        submittedAnswersList.innerHTML = ''; // Clear previous results
        startButton.disabled = true; // Disable start button during round
        stopButton.disabled = false; // Enable stop button

        // Generate letter
        currentLetter = getRandomLetter();
        letterDisplay.textContent = currentLetter;

        // Setup categories and inputs
        displayCategories();
        enableInputs();

        // Start timer
        startTimer();
    }

    function endRound() {
        console.log("Ending round...");
        stopTimer();
        disableInputs();
        displayResults();
        startButton.disabled = false; // Re-enable start button
        stopButton.disabled = true; // Disable stop button
        timerDisplay.textContent = "0:00";
    }

    function disableInputs() {
        const inputs = categoriesContainer.querySelectorAll('input');
        inputs.forEach(input => input.disabled = true);
    }

    function enableInputs() {
         const inputs = categoriesContainer.querySelectorAll('input');
        inputs.forEach(input => input.disabled = false);
    }

    function displayResults() {
        submittedAnswersList.innerHTML = ''; // Clear previous list
        const inputs = categoriesContainer.querySelectorAll('input');
        let hasAnswers = false;

        inputs.forEach(input => {
            const categoryName = input.dataset.categoryName;
            const answer = input.value.trim();
            if (answer) {
                 hasAnswers = true;
                 const listItem = document.createElement('li');
                 // Basic check if it starts with the letter (case-insensitive)
                 const startsWithCorrectLetter = answer.toUpperCase().startsWith(currentLetter);
                 listItem.textContent = `${categoryName}: ${answer}`;
                 listItem.style.color = startsWithCorrectLetter ? 'green' : 'red'; // Simple visual feedback
                 if (!startsWithCorrectLetter) {
                    listItem.textContent += ` (Doesn't start with ${currentLetter})`;
                 }
                 submittedAnswersList.appendChild(listItem);
            } else {
                 const listItem = document.createElement('li');
                 listItem.textContent = `${categoryName}: - (No answer)`;
                 listItem.style.fontStyle = 'italic';
                 listItem.style.color = 'grey';
                 submittedAnswersList.appendChild(listItem);
            }
        });

        if (hasAnswers || inputs.length > 0) { // Show results even if empty, just to indicate end
            resultsArea.classList.remove('d-none');
        }
    }


    // --- Event Listeners ---
    startButton.addEventListener('click', startRound);
    stopButton.addEventListener('click', endRound); // Allow manual submission/end

    // Optional: Prevent form submission from reloading page if you hit Enter
    gameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log("Form submit intercepted");
        endRound(); // Treat Enter key in last field like clicking Stop
    });

}); // End DOMContentLoaded
