/*
  JSL04 - Single file JS
  Using my JSL03 HTML + CSS as the visual base.
  Note: Status values are "todo", "doing", "done" like JSL03.
*/

/* =============================
   1) DATA (start simple)
   ============================= */
// I copied the idea from my JSL03 tasks: id, title, description, status
// Later I can replace this with the exact initialData from the brief if needed.
var tasks = [
  { id: 1, title: "Launch Epic Career", description: "Create a killer Resume", status: "todo" },
  { id: 2, title: "Master JavaScript", description: "Get comfortable with the fundamentals", status: "doing" },
  { id: 3, title: "Contribute to Open Source Projects", description: "Gain practical experience and collaborate with others", status: "done" }
];

/* =============================
   2) DOM REFERENCES
   ============================= */
var todoList = document.getElementById("todo-list");
var doingList = document.getElementById("doing-list");
var doneList = document.getElementById("done-list");

/* Modal refs (wired in next commit) */
var backdrop = document.getElementById("backdrop");
var modal = document.getElementById("taskModal");
var form = document.getElementById("taskForm");
var titleInput = document.getElementById("titleInput");
var descInput = document.getElementById("descInput");
var statusSelect = document.getElementById("statusSelect");
var closeBtn = document.getElementById("closeBtn");
var saveBtn = document.getElementById("saveBtn");

// Track which task is being edited (null if none)
var activeTaskId = null;

/* =============================
   3) RENDER HELPERS
   ============================= */
/**
 * makeTaskCard(task)
 * Creates a simple .task-div element for the board.
 * No fancy stuff: just a div with text (title) and a click handler.
 */
function makeTaskCard(task) {
  var card = document.createElement("div");
  card.className = "task-div"; // using same class from JSL03 CSS
  card.textContent = task.title; // keep it minimal on the board
  card.setAttribute("data-task-id", String(task.id));
  // Clicking the card will open the modal (wired in next commit)
  card.addEventListener("click", function () {
    openModal(task.id);
  });
  return card;
}

/**
 * clearColumns()
 * Empty the three column containers before re-rendering.
 */
function clearColumns() {
  todoList.innerHTML = "";
  doingList.innerHTML = "";
  doneList.innerHTML = "";
}

/**
 * renderBoard()
 * Loop through tasks and append to the correct column by status.
 */
function renderBoard() {
  clearColumns();
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    var card = makeTaskCard(t);
    if (t.status === "todo") {
      todoList.appendChild(card);
    } else if (t.status === "doing") {
      doingList.appendChild(card);
    } else if (t.status === "done") {
      doneList.appendChild(card);
    }
  }
}

/* =============================
   4) BOOT
   ============================= */
renderBoard();

/* =============================
   5) MODAL (open, fill, save, close)
   ============================= */
/**
 * openModal(taskId)
 * - finds the task
 * - fills the form inputs (title, description, status)
 * - shows the dialog + backdrop
 */
function openModal(taskId) {
  // find the task object by id
  var found = null;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      found = tasks[i];
      break;
    }
  }
  if (!found) return; // if not found, do nothing

  activeTaskId = taskId;

  // fill inputs with the task values
  titleInput.value = found.title;
  descInput.value = found.description;
  statusSelect.value = found.status; // "todo" | "doing" | "done"

  // show backdrop + dialog
  backdrop.hidden = false;
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

/**
 * closeModal()
 * - hides the dialog and the backdrop
 * - resets the activeTaskId
 */
function closeModal() {
  activeTaskId = null;
  backdrop.hidden = true;
  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
}

/**
 * onSave(e)
 * - prevent form submit default
 * - update the task fields (title, description, status)
 * - re-render the board
 * - close modal
 */
function onSave(e) {
  e.preventDefault();
  if (activeTaskId == null) return;

  // read values from form inputs
  var newTitle = titleInput.value.trim();
  var newDesc = descInput.value.trim();
  var newStatus = statusSelect.value;

  // simple validation (both fields required)
  if (!newTitle || !newDesc) {
    alert("Please fill in both title and description.");
    return;
  }

  // update the matching task
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === activeTaskId) {
      tasks[i].title = newTitle;
      tasks[i].description = newDesc;
      tasks[i].status = newStatus; // "todo" | "doing" | "done"
      break;
    }
  }

  // refresh UI and close modal
  renderBoard();
  closeModal();
}

/* Wire up modal events once */
form.addEventListener("submit", onSave);
closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);
// Optional: Esc key closes modal
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && activeTaskId != null) {
    closeModal();
  }
});