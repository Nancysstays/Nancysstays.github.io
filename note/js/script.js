const noteText = document.getElementById('note-text');
const noteLinks = document.getElementById('note-links');
const noteSummary = document.getElementById('note-summary');
const noteReferences = document.getElementById('note-references');
const noteMedia = document.getElementById('note-media');
const preview = document.getElementById('preview');
const saveButton = document.getElementById('saveButton');
const updateButton = document.getElementById('updateButton');
const notesList = document.getElementById('notesList');

// Gemini API Key (REPLACE WITH YOUR ACTUAL KEY)
const geminiApiKey = 'YOUR_GEMINI_API_KEY';

let editingIndex = -1;

noteMedia.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const previewContent = `
            <p class="section-label">Media Preview:</p>
            ${file.type.startsWith('image/') ? `<img src="${event.target.result}" alt="Preview" class="img-fluid">` : ''}
            ${file.type.startsWith('video/') ? `<video src="${event.target.result}" controls width="100%"></video>` : ''}
            ${file.type.startsWith('audio/') ? `<audio src="${event.target.result}" controls></audio>` : ''}
        `;
        preview.innerHTML = previewContent;
    }

    reader.readAsDataURL(file);
});

saveButton.addEventListener('click', saveNote);
updateButton.addEventListener('click', updateNote);

function saveNote() {
    const note = createNoteObject();

    // Store in localStorage
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));

    // Placeholder for cache handling
    // ... cache.put('/notes', new Response(JSON.stringify(notes))) ...

    // Placeholder for Gemini API call
    // ... fetch('https://api.gemini.com/v1/notes', { ... }) ...

    displayNotes();
    clearForm();
}

function updateNote() {
    const updatedNote = createNoteObject();

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes[editingIndex] = updatedNote;
    localStorage.setItem('notes', JSON.stringify(notes));

    // Placeholder for cache and Gemini API update
    // ...

    displayNotes();
    clearForm();
    saveButton.style.display = "block";
    updateButton.style.display = "none";
    editingIndex = -1;
}

function createNoteObject() {
    return {
        text: noteText.value,
        links: noteLinks.value.split('\n').filter(link => link.trim() !== ""),
        summary: noteSummary.value,
        references: noteReferences.value,
        media: noteMedia.files[0] ? {
            type: noteMedia.files[0].type,
            data: preview.querySelector('img, video, audio').src
        } : null,
        timestamp: new Date().toLocaleString()
    };
}


function displayNotes() {
    notesList.innerHTML = "";

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note-container');
        noteDiv.innerHTML = `
            <p class="section-label">Notes:</p>
            <p>${note.text}</p>
            ${note.links.length > 0 ? `<p class="section-label">Links:</p><ul>${note.links.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}</ul>` : ''}
            ${note.summary ? `<p class="section-label">Summary:</p><p>${note.summary}</p>` : ''}
            ${note.references ? `<p class="section-label">References:</p><p>${note.references}</p>` : ''}
            ${note.media ? `
                <p class="section-label">Media:</p>
                ${note.media.type.startsWith('image/') ? `<img src="${note.media.data}" alt="Note Media" class="img-fluid">` : ''}
                ${note.media.type.startsWith('video/') ? `<video src="${note.media.data}" controls width="100%"></video>` : ''}
                ${note.media.type.startsWith('audio/') ? `<audio src="${note.media.data}" controls></audio>` : ''}
            ` : ''}
            <p class="section-label">Timestamp:</p>
            <p>${note.timestamp}</p>
            <button class="btn btn-sm btn-danger deleteButton" data-index="${index}">Delete</button>
            <button class="btn btn-sm btn-warning editButton" data-index="${index}">Edit</button>
        `;
        notesList.appendChild(noteDiv);
    });

    addNoteEventListeners();
}

function addNoteEventListeners() {
  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index, 10); //use parseInt for safety
      deleteNote(index);
    });
  });

  const editButtons = document.querySelectorAll('.editButton');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index, 10); //use parseInt for safety
      editNote(index);
    });
  });
}

function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();

    // Placeholder for cache and Gemini API deletion
    // ...
}

function editNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes[index];

    noteText.value = note.text;
    noteLinks.value = note.links.join('\n');
    noteSummary.value = note.summary;
    noteReferences.value = note.references;

    // Handle media preview update (if needed)
    // ...

    editingIndex = index;
    saveButton.style.display = "none";
    updateButton.style.display = "block";
}

function clearForm() {
    noteText.value = "";
    noteLinks.value = "";
    noteSummary.value = "";
    noteReferences.value = "";
    noteMedia.value = "";
    preview.innerHTML = "";
}

// Display notes on page load
displayNotes();
