// Lesson: SELECT, the very first SQL lesson (same topic as SQLBolt lesson 1).
// To make a new lesson: copy this file, change the text, and add it to lessons/catalog.js.
// Text tips: `backticks` = code style, **stars** = bold.

CodeLab.addLesson({
  id: "sql-01-select",
  title: "SELECT: pick your columns",
  language: "sql",
  database: "starport",   // sample data from lessons/sql/data/starport.js

  // ---------- 1. THEORY ----------
  // Plain text = paragraph. { analogy: "..." } = highlighted box. { code: "..." } = code snippet.
  theory: [
    "A **database** is a place where information is stored in an organized way. Inside it, information lives in **tables**. A table looks like a spreadsheet: **columns** go across the top (like `title` or `year`), and each **row** is one thing (like one movie, with all its details).",
    { analogy: "🎬 Picture a giant video-rental shop. Each **table** is a shelf (one shelf for movies, one for travel bookings). Each **row** is one box on that shelf. Each **column** is a label printed on every box: title, director, year. **SQL** is how you ask the shop assistant to bring you exactly what you want." },
    "**SQL** means Structured Query Language (say \"S-Q-L\" or \"sequel\"). A **query** is just a question you ask the database. The most basic question is: \"Show me these columns from that table.\"",
    "`SELECT` says **what** you want (which columns). `FROM` says **where** to look (which table). Separate several columns with commas. To get **every** column, use a star `*`, which means \"everything\".",
    { code: "SELECT column1, column2\nFROM table_name;" },
    "Small rules: SQL doesn't care about UPPER or lower case in keywords, but we write `SELECT` and `FROM` in capitals so they're easy to spot. The semicolon `;` ends the query, like a full stop ends a sentence. Lines starting with `--` are **comments**: notes for humans that the database ignores. And columns come back in the **same order** you wrote them.",
  ],

  // ---------- 2. EXAMPLES ----------
  examples: [
    {
      title: "Pick one column",
      code: "SELECT title\nFROM movies;",
      lines: [
        "`SELECT title` → \"I want the title column.\"",
        "`FROM movies;` → \"Look in the movies table.\" The `;` ends the query.",
      ],
      note: "You get one row per movie, but only the title of each.",
    },
    {
      title: "Pick several columns",
      code: "SELECT title, year, director\nFROM movies;",
      lines: [
        "`SELECT title, year, director` → three columns, separated by commas. They come back in exactly this order.",
        "`FROM movies;` → the same table as before.",
      ],
    },
    {
      title: "Grab everything with *",
      code: "SELECT *\nFROM bookings;",
      lines: [
        "`SELECT *` → the star means \"all the columns\".",
        "`FROM bookings;` → a different table this time: the Galaxy Travel Co. bookings.",
      ],
      note: "`*` is great for peeking at a table you don't know yet. In real work, naming the columns you need is clearer.",
    },
  ],

  // ---------- 3. PRACTICE (with 3 hint levels: hints[0], hints[1], then the solution) ----------
  // testWrong: wrong answers, used only to test that the checker rejects them.
  practice: [
    {
      task: "Find the **title** of every movie.",
      starter: "-- Write your query below\n",
      hints: ["You need one column, from the `movies` table.", "The shape is: `SELECT ___ FROM ___;`"],
      solution: "SELECT title FROM movies;",
      testWrong: ["SELECT director FROM movies;", "SELECT title, year FROM movies;"],
    },
    {
      task: "Find the **director** of every movie.",
      starter: "-- Write your query below\n",
      hints: ["Same as before, but a different column.", "`SELECT director FROM ___;`"],
      solution: "SELECT director FROM movies;",
      testWrong: ["SELECT title FROM movies;"],
    },
    {
      task: "Find the **title and director** of every movie (title first).",
      starter: "-- Write your query below\n",
      hints: ["Two columns this time. What goes between them?", "`SELECT title, ___ FROM movies;`"],
      solution: "SELECT title, director FROM movies;",
      testWrong: ["SELECT director, title FROM movies;", "SELECT title director FROM movies;"],
    },
    {
      task: "Find the **title and year** of every movie (title first).",
      starter: "-- Write your query below\n",
      hints: ["Look at the 📋 Tables box: which column holds the year?", "`SELECT title, year FROM ___;`"],
      solution: "SELECT title, year FROM movies;",
      testWrong: ["SELECT year, title FROM movies;", "SELECT title year FROM movies;"],
    },
    {
      task: "Find **all the information** (every column) about every movie.",
      starter: "-- Write your query below\n",
      hints: ["There's a shortcut that means \"every column\".", "It's one symbol, the one used for multiplying: `*`"],
      solution: "SELECT * FROM movies;",
      testWrong: ["SELECT title, director, year FROM movies;", "SELECT * FROM bookings;"],
    },
  ],

  // ---------- 4. BOSS CHALLENGE (no hints) ----------
  challenge: {
    task: "🛰️ Mission from the Galaxy Travel Co. desk: the manager wants a report of every booking showing the **traveler**, the **destination** and the **price_usd**, in exactly that column order.",
    starter: "-- Your report query\n",
    solution: "SELECT traveler, destination, price_usd FROM bookings;",
    testWrong: [
      "SELECT traveler, price_usd, destination FROM bookings;",
      "SELECT * FROM bookings;",
      "SELECT traveler, destination FROM bookings;",
    ],
  },

  // ---------- 5. READY CHECK (answer = number of the right option, counting from 0) ----------
  quiz: [
    {
      q: "What does `SELECT` tell the database?",
      options: ["Which table to look in", "Which columns you want", "How to sort the rows", "Which rows to delete"],
      answer: 1,
      why: "`SELECT` picks the **columns**. `FROM` picks the table.",
    },
    {
      q: "Which query shows every column of the `movies` table?",
      options: ["`SELECT all FROM movies;`", "`SELECT * FROM movies;`", "`GET * FROM movies;`", "`SELECT movies;`"],
      answer: 1,
      why: "The star `*` means \"all columns\".",
    },
    {
      q: "What's wrong with `SELECT title year FROM movies;`?",
      options: ["Nothing, it's perfect", "SELECT must be lowercase", "A comma is missing between `title` and `year`", "FROM must come before SELECT"],
      answer: 2,
      why: "Sneaky one! Without the comma, SQL thinks `year` is a **nickname** for the title column. You'd get ONE column called \"year\" full of titles.",
    },
    {
      q: "In a table, what is a **row**?",
      options: ["One category of information, like \"year\"", "One single thing, like one movie with all its details", "The name of the table", "A SQL keyword"],
      answer: 1,
      why: "A row is one item. Columns are the categories (title, year...).",
    },
    {
      q: "You run `SELECT year, title FROM movies;`. Which column comes first in the result?",
      options: ["`title`, because it's more important", "`year`, because columns come back in the order you write them", "It's random", "Whatever order the table uses"],
      answer: 1,
      why: "Columns always come back in the order you list them after `SELECT`.",
    },
  ],
});
