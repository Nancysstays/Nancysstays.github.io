const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const x1Input = document.getElementById('x1');
const y1Input = document.getElementById('y1');
const x2Input = document.getElementById('x2');
const y2Input = document.getElementById('y2');
const coordinateSystemRadio = document.getElementsByName('coordinateSystem');

const drawLineButton = document.getElementById('drawLineButton');
const clearCanvasButton = document.getElementById('clearCanvasButton');
const saveNameInput = document.getElementById('saveName');
const loadNameInput = document.getElementById('loadName');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const savedDesignsList = document.getElementById('savedDesignsList');

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
  const saveName = saveNameInput.value;
  const canvasData = canvas.toDataURL();
  localStorage.setItem(saveName, canvasData);
  loadSavedDesigns(); // Reload the list to display the new design
  newDesignNameInput.value = '';
}

function loadCanvas() {
  const loadName = loadNameInput.value;
  const canvasData = localStorage.getItem(loadName);
  if (canvasData) {
    const image = new Image();
    image.src = canvasData;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
  }
}

function loadSavedDesigns() {
  savedDesignsList.innerHTML = ''; // Clear the list
  const savedDesigns = Object.keys(localStorage);
  savedDesigns.forEach(designName => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.textContent = designName;

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      localStorage.removeItem(designName);
      loadSavedDesigns(); // Reload the list to update the display
    });
    listItem.appendChild(deleteButton);

    listItem.addEventListener('click', () => {
      const canvasData = localStorage.getItem(designName);
      const image = new Image();
      image.src = canvasData;
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
    });
    savedDesignsList.appendChild(listItem);
  });
}

drawLineButton.addEventListener('click', () => {
  const coordinateSystem = document.querySelector('input[name="coordinateSystem"]:checked').value;
  const x1 = parseInt(x1Input.value);
  const y1 = parseInt(y1Input.value);
  const x2 = parseInt(x2Input.value);
  const y2 = parseInt(y2Input.value);

  if (coordinateSystem === 'xy') {
    drawLine(x1, y1, x2, y2);
  } else if (coordinateSystem === 'dxdy') {
    drawLine(x1, y1, x1 + x2, y1 + y2);
  }
});

clearCanvasButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvas);
loadButton.addEventListener('click', loadCanvas);

loadSavedDesigns(); // Initial load of saved designs
