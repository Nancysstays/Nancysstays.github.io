document.addEventListener('DOMContentLoaded', function() {
    // --- Configuration ---
    const segments = [
        {'fillStyle' : '#eae56f', 'text' : 'Prize 1'},
        {'fillStyle' : '#89f26e', 'text' : 'Prize 2'},
        {'fillStyle' : '#7de6ef', 'text' : 'Prize 3'},
        {'fillStyle' : '#e7706f', 'text' : 'Prize 4 (Lose)'},
        {'fillStyle' : '#eae56f', 'text' : 'Prize 5'},
        {'fillStyle' : '#89f26e', 'text' : 'Prize 6'},
        {'fillStyle' : '#7de6ef', 'text' : 'Prize 7'},
        {'fillStyle' : '#e7706f', 'text' : 'Prize 8 (Try Again)'}
    ];

    let theWheel = null; // To store the Winwheel object
    let spinButton = null;
    let resultDisplay = null;
    let wheelSpinning = false; // Flag to prevent multiple spins

    // --- Library Loading Check ---
    // Since scripts are loaded async, we need to wait until both are ready.
    function checkLibrariesAndInit() {
        if (typeof Winwheel !== 'undefined' && typeof TweenMax !== 'undefined') {
            console.log("Libraries loaded, initializing wheel...");
            initWheel();
        } else {
            console.log("Waiting for libraries...");
            setTimeout(checkLibrariesAndInit, 100); // Check again shortly
        }
    }

    // --- Wheel Initialization ---
    function initWheel() {
        spinButton = document.getElementById('spinButton');
        resultDisplay = document.getElementById('result');
        const canvas = document.getElementById('prizeWheelCanvas');

        if (!spinButton || !resultDisplay || !canvas) {
            console.error("Error: Required HTML elements not found!");
            return;
        }
        if (!canvas.getContext) {
            console.error("Canvas not supported by this browser.");
            resultDisplay.textContent = "Error: Canvas not supported.";
            return;
        }

        theWheel = new Winwheel({
            'canvasId': 'prizeWheelCanvas',
            'numSegments': segments.length,
            'segments': segments,
            'outerRadius': 180, // Control size relative to canvas
            'innerRadius': 30,  // Make it a donut if > 0
            'textFontSize': 16,
            'textFontFamily': 'Arial',
            'textFillStyle': '#333', // Text color
            'lineWidth': 2,      // Line between segments
            'strokeStyle': '#666', // Segment border color
            'pointerAngle': 0,   // Start position (0 = top)
            'animation': {
                'type': 'spinToStop', // Type of animation
                'duration': 5,        // Spin duration in seconds
                'spins': 8,           // Number of full rotations
                'easing': 'Power3.easeOut', // Easing function from TweenMax
                'callbackFinished': spinComplete, // Function to call when spin ends
                'callbackAfter': () => { console.log('Spin effect ended'); } // Optional: called after visual effects stop
            }
        });

        // Attach click listener to the spin button
        spinButton.addEventListener('click', startSpin);
        spinButton.disabled = false; // Ensure button is enabled initially
        resultDisplay.textContent = "Result: Ready to spin!"; // Initial message
    }

    // --- Start Spin ---
    function startSpin() {
        if (wheelSpinning) {
            return; // Don't allow spin if already spinning
        }

        wheelSpinning = true;
        spinButton.disabled = true; // Disable button during spin
        resultDisplay.textContent = "Result: Spinning...";

        // Reset the wheel animation before starting - important for re-spins
        theWheel.stopAnimation(false); // false: doesn't call callback function.
        theWheel.rotationAngle = theWheel.rotationAngle % 360; // Normalize angle

        // Start the spin animation - Winwheel calculates the random stop angle
        theWheel.startAnimation();
    }

    // --- Spin Complete Callback ---
    function spinComplete(indicatedSegment) {
        // 'indicatedSegment' is automatically passed by Winwheel
        if (indicatedSegment && indicatedSegment.text) {
             resultDisplay.textContent = `Result: You won ${indicatedSegment.text}!`;
            // Optional: Show alert
            // alert("You won: " + indicatedSegment.text);
        } else {
             resultDisplay.textContent = "Result: Spin finished.";
             console.warn("Indicated segment was undefined after spin.");
        }

        wheelSpinning = false; // Allow spinning again
        spinButton.disabled = false; // Re-enable the button
    }

    // --- Start the Process ---
    checkLibrariesAndInit();

}); // End DOMContentLoaded
