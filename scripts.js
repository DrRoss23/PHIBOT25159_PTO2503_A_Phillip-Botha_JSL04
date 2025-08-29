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

// Official initial data from the brief (kept as a constant-like variable)
// Note: I’m using `var` to keep style consistent and beginner-friendly.
var initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
  },
  {
    id: 2,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
  },
  {
    id: 3,
    title: "Keep on Going 🏆",
    description: "You're almost there",
    status: "doing",
  },

  {
    id: 11,
    title: "Learn Data Structures and Algorithms 📚",
    description:
      "Study fundamental data structures and algorithms to solve coding problems efficiently",
    status: "todo",
  },
  {
    id: 12,
    title: "Contribute to Open Source Projects 🌐",
    description:
      "Gain practical experience and collaborate with others in the software development community",
    status: "done",
  },
  {
    id: 13,
    title: "Build Portfolio Projects 🛠️",
    description:
      "Create a portfolio showcasing your skills and projects to potential employers",
    status: "done",
  },
];

// Make a working copy I can safely edit during the session (so I don’t mutate the original list)
var tasks = [];
for (var i = 0; i < initialTasks.length; i++) {
  tasks.push(initialTasks[i]);
}

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

// Error message elements for simple validation feedback (HTML placeholders).
// These are <p> tags we added under each input in index.html.
var titleError = document.getElementById("titleError");
var descError = document.getElementById("descError");

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
 * clearColumns
 * ------------
 * Purpose: Empty all three column containers before re-rendering the board.
 * This ensures I don't accidentally duplicate cards when drawing the UI.
 *
 * @returns {void}
 */
function clearColumns() {
  todoList.innerHTML = "";  // remove everything in the TODO column
  doingList.innerHTML = ""; // remove everything in the DOING column
  doneList.innerHTML = "";  // remove everything in the DONE column
}

/**
 * normalizeStatus
 * ---------------
 * Purpose: Convert any status variants (like "in-progress" or "in progress")
 * into the value my UI uses ("doing"). Other statuses pass through unchanged.
 *
 * Why: Some briefs or seed data use different text. Normalizing here keeps the
 * board logic and <select> options consistent (todo/doing/done) without needing
 * to change the original data array.
 *
 * @param {string} raw - incoming status from initial data or edited task
 * @returns {string}   - one of "todo" | "doing" | "done" (defaults to "todo")
 */
function normalizeStatus(raw) {
  if (!raw) return "todo";
  var s = String(raw).toLowerCase().trim();
  if (s === "in-progress" || s === "in progress" || s === "inprogress") {
    return "doing";
  }
  if (s === "todo" || s === "doing" || s === "done") {
    return s;
  }
  // If something unexpected comes in, default it to "todo" so it shows up.
  return "todo";
}

/**
 * renderBoard
 * -----------
 * Purpose: Rebuild the entire board from the current `tasks` array.
 * Steps:
 * 1) Clear all columns.
 * 2) For each task, build a card and append it to the column that matches its status.
 *
 * @returns {void}
 */
function renderBoard() {
  clearColumns(); // start with a clean board every time I render

  // Loop over all tasks and add them to the right column
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];                 // get the current task object
    var card = makeTaskCard(t);       // build a small card for it

    // Decide which column to use based on a normalized status string
    var s = normalizeStatus(t.status);
    if (s === "todo") {
      todoList.appendChild(card);
    } else if (s === "doing") {
      doingList.appendChild(card);
    } else if (s === "done") {
      doneList.appendChild(card);
    }
  }
}

/* =============================
   4) BOOT (initial render)
   ============================= */
// When the script loads, draw the board one time so the user can
// see the tasks immediately without refreshing or clicking anything.
renderBoard();

/* =============================
   4.5) SIMPLE VALIDATION HELPERS
   ============================= */
/**
 * showError
 * ----------
 * Purpose: Display a small red error message under a specific input and
 *          add a red outline to the input to make the problem clear.
 *
 * @param {HTMLElement} inputEl - The input or textarea element to decorate with an error state.
 * @param {HTMLElement} errorEl - The <p> element where the error text is shown.
 * @param {string} message - The short, human-friendly error message to show.
 */
function showError(inputEl, errorEl, message) {
  if (errorEl) {
    errorEl.textContent = message;   // set the text to the provided message
    errorEl.hidden = false;          // reveal the small <p> under the field
  }
  if (inputEl) {
    inputEl.classList.add("input-error"); // add red border style
    inputEl.setAttribute("aria-invalid", "true"); // for accessibility
  }
}

/**
 * clearError
 * ----------
 * Purpose: Hide the error text and remove the red outline state from a field.
 *
 * @param {HTMLElement} inputEl - The input or textarea element currently marked with an error.
 * @param {HTMLElement} errorEl - The <p> element that shows the error text.
 */
function clearError(inputEl, errorEl) {
  if (errorEl) {
    errorEl.hidden = true; // hide the message
  }
  if (inputEl) {
    inputEl.classList.remove("input-error"); // remove red border
    inputEl.removeAttribute("aria-invalid"); // reset accessibility attribute
  }
}

/**
 * clearErrors
 * -----------
 * Purpose: Convenience helper that clears ALL known field errors in the modal
 *          (currently title and description). Useful before re-validating.
 */
function clearErrors() {
  clearError(titleInput, titleError);
  clearError(descInput, descError);
}

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
 * @returns {void}
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
  statusSelect.value = normalizeStatus(found.status); // ensure dropdown shows a UI-friendly value

  // Reset any previous error messages so the modal looks clean
  clearErrors();

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
 * closeModal
 * ----------
 * Purpose: Hide the modal and backdrop, and reset `activeTaskId` so
 * the app no longer thinks I'm editing anything.
 *
 * @returns {void}
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
 * 3) Validate that title and description are not empty (show inline errors).
 * 4) Find the matching task by id and update its fields.
 * 5) Re-render the board so the user sees the change.
 * 6) Close the modal.
 *
 * @param {SubmitEvent} e - the submit event from the form
 * @returns {void}
 */
function onSave(e) {
  e.preventDefault(); // stop the form from navigating/reloading the page
  if (activeTaskId == null) return; // safety: if no task is active, quit

  // 1) Read values from the form inputs. I also trim spaces off
  // the ends of the title/description so empty strings are caught.
  var newTitle = titleInput.value.trim();
  var newDesc = descInput.value.trim();
  var newStatus = statusSelect.value; // this will be "todo", "doing", or "done"

  // 2) Friendly validation: show inline messages + focus first invalid field
  clearErrors(); // reset any previous errors before checking again
  var hasError = false;
  if (!newTitle) {
    showError(titleInput, titleError, "Title is required.");
    if (!hasError) { titleInput.focus(); } // focus the first invalid input
    hasError = true;
  }
  if (!newDesc) {
    showError(descInput, descError, "Description is required.");
    if (!hasError) { descInput.focus(); }
    hasError = true;
  }
  if (hasError) {
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

/* =============================
   6) EVENT LISTENERS (wiring once)
   ============================= */
// When I submit the form (press the Save button or Enter), run onSave
form.addEventListener("submit", onSave);

// Clicking the X button should close the dialog without saving
closeBtn.addEventListener("click", closeModal);

// Clicking the dark backdrop also closes the modal
backdrop.addEventListener("click", closeModal);

// As I type, remove the red/error state so the form feels friendly
titleInput.addEventListener("input", function () {
  if (titleInput.value.trim()) {
    clearError(titleInput, titleError);
  }
});

descInput.addEventListener("input", function () {
  if (descInput.value.trim()) {
    clearError(descInput, descError);
  }
});

// Bonus: pressing Escape should close the modal if it’s open.
// (Only works when I'm currently editing a task.)
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && activeTaskId != null) {
    closeModal();
  }
});