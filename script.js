// Login Logic
const loginContainer = document.getElementById("login-container");
const appContainer = document.getElementById("app");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "1234") {
    loginContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
  } else {
    loginError.textContent = "Invalid username or password!";
  }
});

// Notes Logic
const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteModal = document.getElementById("noteModal");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const searchInput = document.getElementById("searchInput");
const modalTitle = document.getElementById("modalTitle");

const allNotesBtn = document.getElementById("allNotesBtn");
const favoritesBtn = document.getElementById("favoritesBtn");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let showingFavorites = false;
let editMode = false;
let editNoteId = null;

// Open modal for Add
addNoteBtn.addEventListener("click", () => {
  modalTitle.textContent = "Add Note";
  saveNoteBtn.textContent = "Save";
  editMode = false;
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
  noteModal.classList.remove("hidden");
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  noteModal.classList.add("hidden");
});

// Save note
saveNoteBtn.addEventListener("click", () => {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();
  if (!title || !content) return;

  if (editMode) {
    notes = notes.map(note =>
      note.id === editNoteId ? { ...note, title, content } : note
    );
    editMode = false;
    editNoteId = null;
  } else {
    const newNote = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString(),
      favorite: false
    };
    notes.push(newNote);
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  noteModal.classList.add("hidden");
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
});

// Render notes
function renderNotes() {
  notesContainer.innerHTML = "";
  let filteredNotes = showingFavorites ? notes.filter(n => n.favorite) : notes;

  filteredNotes
    .filter(note => 
      note.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      note.content.toLowerCase().includes(searchInput.value.toLowerCase())
    )
    .forEach(note => {
      const noteEl = document.createElement("div");
      noteEl.classList.add("note-card");

      noteEl.innerHTML = `
        <div class="note-header">${note.title}</div>
        <div class="note-content">${note.content}</div>
        <div class="note-footer">
          <span class="note-date">${note.date}</span>
          <div class="actions">
            <span class="favorite ${note.favorite ? "active" : ""}" data-id="${note.id}">❤️</span>
            <span class="edit" data-id="${note.id}">✏️</span>
            <span class="delete" data-id="${note.id}">🗑️</span>
          </div>
        </div>
      `;

      notesContainer.appendChild(noteEl);
    });

  // Attach event listeners
  document.querySelectorAll(".favorite").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      toggleFavorite(id);
    });
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteNote(id);
    });
  });

  document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      startEdit(id);
    });
  });
}

// Toggle favorite
function toggleFavorite(id) {
  notes = notes.map(note =>
    note.id == id ? { ...note, favorite: !note.favorite } : note
  );
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

// Delete note
function deleteNote(id) {
  notes = notes.filter(note => note.id != id);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

// Start edit
function startEdit(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  editMode = true;
  editNoteId = id;
  modalTitle.textContent = "Edit Note";
  saveNoteBtn.textContent = "Update";
  document.getElementById("noteTitle").value = note.title;
  document.getElementById("noteContent").value = note.content;
  noteModal.classList.remove("hidden");
}

// Switch tabs
allNotesBtn.addEventListener("click", () => {
  showingFavorites = false;
  allNotesBtn.classList.add("active");
  favoritesBtn.classList.remove("active");
  renderNotes();
});

favoritesBtn.addEventListener("click", () => {
  showingFavorites = true;
  favoritesBtn.classList.add("active");
  allNotesBtn.classList.remove("active");
  renderNotes();
});

// Search notes
searchInput.addEventListener("input", renderNotes);

// Initial render
renderNotes();
