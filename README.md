# JSL04 – Kanban Task Board (Built on my JSL03 HTML/CSS)

A simple, beginner-friendly Kanban board that **dynamically renders tasks**, lets you **view/edit** task details in a **modal**, and places tasks into the correct columns based on their **status**. The UI reuses my **JSL03 HTML + CSS** as a visual base, and the JavaScript is kept deliberately straightforward (single file, `var` + classic `for` loops) to reflect a junior developer’s learning journey.

---

## 🎯 Project Goals (User Stories Mapped)

- **P2.31 – Dynamic Display**: Render tasks from `initialTasks` into the DOM (no hard-coded cards in HTML).
- **P2.32 – Correct Columns**: Tasks auto-placed into **To Do / Doing / Done** based on their `status`.
- **P2.33 – Open Modal**: Clicking a task opens a modal to view/edit details.
- **P2.34 – Editable Fields**: Modal shows **Title** and **Description** in editable inputs.
- **P2.35 – Status Select**: Modal shows a **select** with the current status and other options.
- **P2.36 – Correct Task Data**: Modal displays the details of the **exact task** clicked.
- **P2.37 – Close Button**: Modal has a clear close (✕) button that closes the dialog.
- **P2.38 – Modal Design + Backdrop**: Modal/backdrop styled to match the Figma intent. No inline CSS.
- **P2.39 – Responsive**: Modal and board work on mobile and desktop.
- **P2.40 – Functions**: Small, single-responsibility functions (rendering, modal open/close, validation).
- **P2.41 – Names**: Descriptive variable and function names for readability.
- **P2.42 – JSDoc**: Major functions documented with JSDoc-style comments.

---

## 🧩 Tech Stack

- **HTML/CSS**: Based on my **JSL03** layout & styles (no Tailwind, no frameworks).
- **JavaScript**: Single-file (`scripts.js`) with plain DOM APIs, `let` & `const`, and classic `for` loops.
- **Assets**: Local SVGs and Google Fonts (Plus Jakarta Sans).

---

## 📂 Project Structure

```
PHIBOT25159_PTO2503_A_Phillip-Botha_JSL04/
├─ index.html          # JSL03-based structure + a <dialog> for the modal
├─ styles.css          # JSL03 base styles + modal/backdrop + small tweaks
├─ scripts.js          # Single "master" JS file (data → render → modal)
└─ assets/             # Logos/icons (if required)
```

---

## 🧪 Data Model (What a Task Looks Like)

Tasks live in `initialTasks` (see `scripts.js`). Each task looks like this:

```js
{
  id: 2,
  title: "Master JavaScript 💛",
  description: "Get comfortable with the fundamentals",
  status: "todo" | "doing" | "done"
}
```

> There is a tiny helper that **normalizes** statuses so any variants like `"in-progress"` map to `"doing"`. This keeps the UI and select options consistent.

---

## 🚀 How to Run (Local)

1. **Clone** the repo or download the folder.
2. Open `index.html` in your browser.
3. You should see three columns (TODO / DOING / DONE) with tasks rendered from `initialTasks`.

_No build step. No dev server required._

---

## 🖱️ How to Use

1. **Click a task card** → the modal opens and shows the task’s Title, Description, and Status.
2. **Edit fields** (Title/Description/Status) → required fields show friendly inline validation.
3. **Save** → updates the task in memory, re-renders the board, and closes the modal.
4. **Close** → use the ✕ button, click the backdrop, or press **Esc**.

_Accessibility niceties:_
- Focus is sent to the Title field when the modal opens.
- Keyboard **Tab/Shift+Tab** is trapped inside the modal while open.
- Focus returns to the previously clicked element when the modal closes.
- The dialog is labeled for screen readers via `aria-labelledby`.

---

## 🧱 Code Walkthrough (High-Level)

- **Data**: `initialTasks` → copied into a mutable `tasks` array.
- **Rendering**: `renderBoard()` clears columns and appends a `div.task-div` for each task in the right column.
- **Cards**: `makeTaskCard(task)` builds a simple clickable card with the task title.
- **Modal**:
  - `openModal(id)` finds the task, fills inputs, shows dialog + backdrop, focuses Title, traps focus.
  - `onSave(e)` validates fields, updates the task object, re-renders the board, and closes the modal.
  - `closeModal()` closes dialog, hides backdrop, restores focus.
- **Validation**: Tiny helpers `showError`, `clearError`, `clearErrors` show inline messages and red outlines.
- **Docs**: Major functions have **JSDoc**; inline comments explain the “why”.

---

## ✅ Features Checklist

- [x] Dynamic rendering from `initialTasks`
- [x] Tasks appear under TODO / DOING / DONE
- [x] Click task → modal opens
- [x] Title/Description inputs; Status dropdown
- [x] Shows the correct task’s details
- [x] Clear Close (✕), Esc, and backdrop click all close the modal
- [x] Backdrop & dialog styles with no inline CSS
- [x] Responsive modal (mobile/desktop)
- [x] Modular, readable JS (beginner-friendly)
- [x] JSDoc comments on major functions

---

## 🧭 Interaction Notes / Known Limitations

- Data is in-memory only (no persistence). Refreshing the page resets to `initialTasks`.
- Minimal validation (required Title + Description). Easy to extend later.
- Drag-and-drop is **intentionally not included** 

---

## 🧹 Formatting & Quality

- **No console errors** on load or when editing.
- Consistent **2-space indentation** and spacing.
- Descriptive names for variables/functions.
- No unused files or dead code.
- No inline CSS; everything lives in `styles.css`.

---

## 📘 How to Review the Code

- Start in `scripts.js`: read the top comments to understand the flow.
- Skim `renderBoard()`, then click a card and follow `openModal()` → `onSave()`.
- Check `normalizeStatus()` to see how incoming data is made consistent.
- Look at the validation helpers for how inline messages are shown/cleared.

---

## 📝 Commit History Guidelines (for this repo)

- **Small, focused commits** (one idea per commit).
- **Present tense** messages (e.g., `add`, `update`, `fix`).
- Include **why** when it helps future me.

**Examples:**
```
chore: base jsl03 layout for jsl04, empty task slots, link scripts.js
feat: render tasks from initialTasks into todo/doing/done columns
feat: add modal open/edit/save with simple backdrop
docs: add detailed inline comments to scripts.js
style: move modal inline styles into styles.css; add modal classes
feat: add simple validation messages and red outlines on fields
fix: normalize status values to match UI (doing vs in-progress)
```

---

## 📄 License / Attribution

- Educational project for JSL04 assessment.
- UI structure & styles are adapted from my own **JSL03** work.
- Big thanks to GPT and Copilot

