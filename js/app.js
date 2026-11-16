// app.js — the "brain" of Code Lab.
// It creates ONE shared object called CodeLab. Every other file adds its own
// pieces to it (CodeLab.sql, CodeLab.progress, ...). That way the files can
// talk to each other without needing a framework.

window.CodeLab = {
  lessons: {},    // lessons that have been loaded, found by their id
  databases: {},  // sample databases (written as SQL text), found by name

  // Lesson files call this to "register" themselves.
  addLesson(lesson) { this.lessons[lesson.id] = lesson; },
  // Database files call this.
  addDatabase(name, sqlText) { this.databases[name] = sqlText; },
};

// ---------- Small helpers used everywhere ----------

// Make text safe to put inside HTML, so "<b>" typed in code shows as text, not bold.
CodeLab.esc = function (text) {
  return String(text).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
};

// Tiny formatter for lesson text: `code` becomes code style, **bold** becomes bold.
CodeLab.fmt = function (text) {
  // Split on backticks: pieces 1, 3, 5... were inside `...`, so they are code.
  return String(text).split("`").map((part, i) =>
    i % 2 === 1
      ? "<code>" + CodeLab.esc(part) + "</code>"
      : CodeLab.esc(part).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  ).join("");
};

// Load a JavaScript file only once (lessons, databases, libraries).
// It returns a Promise: a "I'll tell you when it's done" ticket.
CodeLab._loaded = {};
CodeLab.loadScript = function (src) {
  if (!CodeLab._loaded[src]) {
    CodeLab._loaded[src] = new Promise((resolve, reject) => {
      const tag = document.createElement("script");
      tag.src = src;
      tag.onload = resolve;
      tag.onerror = () => {
        delete CodeLab._loaded[src];   // forget it, so we can try again later
        reject(new Error("Could not load " + src));
      };
      document.head.appendChild(tag);
    });
  }
  return CodeLab._loaded[src];
};

// Show a little pop-up message for a few seconds.
CodeLab.toast = function (message) {
  const box = document.createElement("div");
  box.className = "toast";
  box.innerHTML = CodeLab.fmt(message);
  document.getElementById("toasts").appendChild(box);
  setTimeout(() => box.remove(), 4000);
};

// ---------- Routing: which screen to show ----------
// The part of the address after "#" tells us where we are, for example:
//   #/                          → home
//   #/lesson/sql-01-select/3    → lesson "sql-01-select", part 3

CodeLab.go = function (hash) {
  if (location.hash === hash) CodeLab.route();  // same address: just redraw
  else location.hash = hash;                    // new address: "hashchange" redraws
};

CodeLab.routeId = 0; // goes up on every screen change (helps slow screens know they're outdated)

CodeLab.route = function () {
  CodeLab.routeId++;
  const app = document.getElementById("app");
  const parts = location.hash.replace(/^#\/?/, "").split("/");
  CodeLab.screens.topBar();
  window.scrollTo(0, 0);

  if (!CodeLab.progress.current()) return CodeLab.screens.picker(app);
  if (parts[0] === "lesson" && parts[1]) {
    return CodeLab.screens.lesson(app, parts[1], Number(parts[2]) || 1);
  }
  CodeLab.screens.home(app);
};

// Called once, at the bottom of index.html.
CodeLab.start = function () {
  CodeLab.progress.init();
  window.addEventListener("hashchange", CodeLab.route);
  CodeLab.route();
};
