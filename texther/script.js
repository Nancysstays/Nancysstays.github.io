const textInput = document.getElementById('textInput');
const saveButton = document.getElementById('saveButton');
const storedTextsList = document.getElementById('storedTexts');

// Load stored texts on page load
loadStoredTexts();

textInput.addEventListener('input', () => {
  const query = textInput.value.toLowerCase();
  const storedTexts = JSON.parse(localStorage.getItem('storedTexts')) || [];
  const filteredTexts = storedTexts.filter(text => text.toLowerCase().includes(query));

  // Update the suggestions in the list
  storedTextsList.innerHTML = '';
  filteredTexts.forEach((text, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = text;
    listItem.dataset.index = index; // Add index for deletion

    // Add a "Copy" link for each stored text
    const copyLink = document.createElement('a');
    copyLink.href = '#';
    copyLink.textContent = 'Copy';
    copyLink.addEventListener('click', (event) => {
      event.preventDefault();
      copyToClipboard(text);
    });
    listItem.appendChild(copyLink);

    // Add a "Delete" link for each stored text
    const deleteLink = document.createElement('a');
    deleteLink.href = '#';
    deleteLink.textContent = 'Delete';
    deleteLink.addEventListener('click', () => {
      deleteText(index);
    });
    listItem.appendChild(deleteLink);

    storedTextsList.appendChild(listItem);
  });
});

saveButton.addEventListener('click', () => {
  const text = textInput.value;
  saveText(text);
  textInput.value = ''; // Clear input field
});

function saveText(text) {
  let storedTexts = JSON.parse(localStorage.getItem('storedTexts')) || [];
  storedTexts.push(text);
  localStorage.setItem('storedTexts', JSON.stringify(storedTexts));
  loadStoredTexts();
}

function loadStoredTexts() {
  storedTextsList.innerHTML = ''; // Clear the list

  const storedTexts = JSON.parse(localStorage.getItem('storedTexts')) || [];
  storedTexts.forEach((text, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = text;
    listItem.dataset.index = index; // Add index for deletion

    // Add a "Copy" link for each stored text
    const copyLink = document.createElement('a');
    copyLink.href = '#';
    copyLink.textContent = 'Copy';
    copyLink.addEventListener('click', (event) => {
      event.preventDefault();
      copyToClipboard(text);
    });

    // Add a "Delete" link for each stored text
    const hr = document.createElement('b');
    deleteLink.innerHTML = "</ hr></ hr>";
    deleteLink.addEventListener('click', () => {
      deleteText(index);
    });
    listItem.appendChild(hr);
    listItem.appendChild(copyLink);
    listItem.appendChild(hr);

    // Add a "Delete" link for each stored text
    const deleteLink = document.createElement('a');
    deleteLink.href = '#';
    deleteLink.textContent = 'Delete';
    deleteLink.addEventListener('click', () => {
      deleteText(index);
    });
    listItem.appendChild(deleteLink);
    listItem.appendChild(hr);

    storedTextsList.appendChild(listItem);
  });
}

function deleteText(index) {
  let storedTexts = JSON.parse(localStorage.getItem('storedTexts')) || [];
  storedTexts.splice(index, 1);
  localStorage.setItem('storedTexts', JSON.stringify(storedTexts));
  loadStoredTexts();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.alert('Text copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
      console.error('Failed to copy text. Check console for errors.');
    });
}
