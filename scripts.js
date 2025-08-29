/*
  JSL04 - Single file JS (beginner-friendly)
  -------------------------------------------------
  This project reuses my JSL03 HTML + CSS as the visual base
  so the board already looks close to the Figma.

  🔰 Style choices for learning:
  - I use simple `var` variables and classic `for` loops
    instead of newer syntax. This keeps the code readable
    for me while I’m learning and makes it easy to explain.
  - I keep everything in ONE file (scripts.js) so I can scroll
    and see the full flow from data → render → modal.
  - Status values are "todo", "doing", "done" just like in JSL03.
*/

/* =============================
   1) DATA (start simple)
   ============================= */
// I copied the idea from my JSL03 tasks: each task is an object
// with a unique id, a title, a description, and a status that
// controls which column it shows in (todo/doing/done).
// Note: I can later replace this with the exact initialData
// from the brief, but for now I’m keeping it small for testing.
var tasks = [
  { id: 1, title: "Launch Epic Career", description: "Create a killer Resume", status: "todo" },
  { id: 2, title: "Master JavaScript", description: "Get comfortable with the fundamentals", status: "doing" },
  { id: 3, title: "Contribute to Open Source Projects", description: "Gain practical experience and collaborate with others", status: "done" }
];

/* =============================
   2) DOM REFERENCES
   ============================= */
// Grab references to the three column containers. I will insert
// task cards into these using JavaScript.
var todoList = document.getElementById("todo-list");   // holds tasks with status === "todo"
var doingList = document.getElementById("doing-list"); // holds tasks with status === "doing"
var doneList = document.getElementById("done-list");   // holds tasks with status === "done"

// Modal elements. The modal is hidden by default and opens when
// the user clicks a task card. These references let me read/write
// the form values and control opening/closing.
var backdrop = document.getElementById("backdrop");
var modal = document.getElementById("taskModal");
var form = document.getElementById("taskForm");
var titleInput = document.getElementById("titleInput");
var descInput = document.getElementById("descInput");
var statusSelect = document.getElementById("statusSelect");
var closeBtn = document.getElementById("closeBtn");
var saveBtn = document.getElementById("saveBtn");

// This will remember which task I am editing right now. If it's null,
// no task is being edited and the modal should be closed.
var activeTaskId = null;

/* =============================
   3) RENDER HELPERS
   ============================= */
/**
 * makeTaskCard(task)
 * ------------------
 * Purpose: Create a simple visual card (a <div>) for one task.
 * The card shows just the task title on the board.
 * When the user clicks the card, I open the edit modal for that task.
 *
 * @param {Object} task - one task object from the tasks array
 * @returns {HTMLDivElement} - the card element ready to place in a column
 */
function makeTaskCard(task) {
  // Create the outer div that will represent the task on the board
  var card = document.createElement("div");

  // Reuse my JSL03 class so it picks up the existing styles
  card.className = "task-div";

  // Keep the board view minimal: just show the title text here
  card.textContent = task.title;

  // Store the id on the element (handy for debugging if needed)
  card.setAttribute("data-task-id", String(task.id));

  // When I click the card, I want to edit this exact task
  // so I call openModal with the task's id.
  card.addEventListener("click", function () {
    openModal(task.id);
  });

  return card; // I return the element so the caller can append it
}

/**
 * clearColumns()
 * --------------
 * Purpose: Before I re-render the board, I need the columns to be empty.
 * This function wipes the contents of all three column containers.
 */
function clearColumns() {
  todoList.innerHTML = "";  // remove everything in the TODO column
  doingList.innerHTML = ""; // remove everything in the DOING column
  doneList.innerHTML = "";  // remove everything in the DONE column
}

/**
 * renderBoard()
 * -------------
 * Purpose: Rebuild the entire board from the tasks array.
 * 1) Clear the columns.
 * 2) For each task, make a card and append it to the correct column
 *    based on the task.status value (todo/doing/done).
 */
function renderBoard() {
  clearColumns(); // start with a clean board every time I render

  // Loop over all tasks and add them to the right column
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];                 // get the current task object
    var card = makeTaskCard(t);       // build a small card for it

    // Decide which column to use based on the status string
    if (t.status === "todo") {
      todoList.appendChild(card);
    } else if (t.status === "doing") {
      doingList.appendChild(card);
    } else if (t.status === "done") {
      doneList.appendChild(card);
    }
    // If the status was something unexpected, I simply don't append it.
    // (Not required here, but good to know what happens.)
  }
}

/* =============================
   4) BOOT (initial render)
   ============================= */
// When the script loads, draw the board one time so the user can
// see the tasks immediately without refreshing or clicking anything.
renderBoard();

/* =============================
   5) MODAL (open, fill, save, close)
   ============================= */
/**
 * openModal(taskId)
 * -----------------
 * Purpose: Find the task with the matching id, fill the form inputs
 * with that task's data, and then show the modal + backdrop so the
 * user can edit the details.
 *
 * @param {number} taskId - the id of the task that was clicked
 */
function openModal(taskId) {
  // 1) Find the matching task object by id using a basic loop
  var found = null; // will hold the task if I find it
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      found = tasks[i];
      break; // stop searching as soon as I find the task
    }
  }
  if (!found) return; // If I didn't find it, do nothing (extra safety)

  // 2) Remember which task I'm editing so onSave knows what to update
  activeTaskId = taskId;

  // 3) Copy the task's current values into the form fields so the
  // user can see and edit them. These map directly to the object.
  titleInput.value = found.title;          // text input for the title
  descInput.value = found.description;     // textarea for the description
  statusSelect.value = found.status;       // select dropdown value

  // 4) Finally, show the modal and turn on the semi-transparent
  // backdrop to focus the user's attention on the dialog.
  backdrop.hidden = false;                 // make the dark overlay visible

  // <dialog> has .showModal() in modern browsers. If not available,
  // I fall back to setting the "open" attribute so it still appears.
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

/**
 * closeModal()
 * ------------
 * Purpose: Hide the modal and backdrop, and reset the activeTaskId
 * so the app no longer thinks I'm editing anything.
 */
function closeModal() {
  activeTaskId = null;    // I am no longer editing a specific task
  backdrop.hidden = true; // hide the dark overlay again

  // Close the dialog using the native method if available,
  // otherwise remove the "open" attribute as a fallback.
  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
}

/**
 * onSave(e)
 * ---------
 * Purpose: Handle the form submit inside the modal.
 * Steps:
 * 1) Stop the browser reloading the page.
 * 2) Read the values from the inputs.
 * 3) Validate that title and description are not empty.
 * 4) Find the matching task by id and update its fields.
 * 5) Re-render the board so the user sees the change.
 * 6) Close the modal.
 *
 * @param {SubmitEvent} e - the submit event from the form
 */
function onSave(e) {
  e.preventDefault(); // stop the form from navigating/reloading the page
  if (activeTaskId == null) return; // safety: if no task is active, quit

  // 1) Read values from the form inputs. I also trim spaces off
  // the ends of the title/description so empty strings are caught.
  var newTitle = titleInput.value.trim();
  var newDesc = descInput.value.trim();
  var newStatus = statusSelect.value; // this will be "todo", "doing", or "done"

  // 2) Very basic validation for this project: both fields required.
  if (!newTitle || !newDesc) {
    alert("Please fill in both title and description.");
    return; // stop the save if validation fails
  }

  // 3) Find the task in the array and update its properties.
  // I use a classic for loop so it’s easy to read for beginners.
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === activeTaskId) {
      tasks[i].title = newTitle;         // replace the old title with the new one
      tasks[i].description = newDesc;    // replace the old description
      tasks[i].status = newStatus;       // move the task to the chosen column
      break; // I can stop looping once I update the right task
    }
  }

  // 4) Update the UI so my changes are visible immediately
  renderBoard();

  // 5) Close the modal to return to the board
  closeModal();
}

/* Wire up modal events once (these are global listeners) */
// When I submit the form (press the Save button or Enter), run onSave
form.addEventListener("submit", onSave);

// Clicking the X button should close the dialog without saving
closeBtn.addEventListener("click", closeModal);

// Clicking the dark backdrop also closes the modal
backdrop.addEventListener("click", closeModal);

// Bonus: pressing Escape should close the modal if it’s open
// (Only works when I'm currently editing a task.)
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && activeTaskId != null) {
    closeModal();
  }
});