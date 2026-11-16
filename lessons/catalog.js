// catalog.js — the table of contents: every module and lesson, in order.
// To add a lesson: create its file, then put its path in "file" below.
// "file: null" means "coming soon" (shown with a 🔒).

CodeLab.catalog = [
  {
    id: "sql-1",
    icon: "🗄️",
    title: "SQL Module 1 · First Queries",
    description: "Ask a database questions: pick columns, filter rows, sort results. (Same topics as SQLBolt lessons 1–4.)",
    lessons: [
      { id: "sql-01-select", title: "SELECT: pick your columns", file: "lessons/sql/01-select.js" },
      { id: "sql-02-where-numbers", title: "WHERE: filter with numbers", file: null },
      { id: "sql-03-where-text", title: "WHERE: filter with text", file: null },
      { id: "sql-04-order-limit", title: "ORDER BY & LIMIT: sort and trim", file: null },
    ],
  },
  {
    id: "py-1",
    icon: "🐍",
    title: "Python Module 1 · Hello, Python",
    description: "Your very first Python: `print`, variables, and `if` / `else`.",
    lessons: [
      { id: "py-01-print", title: "print: make Python talk", file: null },
      { id: "py-02-variables", title: "Variables: boxes with labels", file: null },
      { id: "py-03-if-else", title: "if / else: making decisions", file: null },
    ],
  },
];

// Where each sample database lives.
CodeLab.databaseFiles = {
  starport: "lessons/sql/data/starport.js",
};
