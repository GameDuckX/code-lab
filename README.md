# Code Lab 🧑‍🚀👾

A free practice site for Bruno and Titi to learn SQL and Python, from beginner to advanced.

## How to open it
Double-click `index.html`. You need internet the first time a lesson opens, because the SQL engine downloads then.

## How a lesson works
1. 📖 Theory → 2. 🔍 Examples → 3. 🏋️ Practice (3 hint levels) → 4. 👾 Boss Challenge (no hints, "Copy for Claude") → 5. 🧠 Ready Check quiz (80% to pass)

## Folders
- `index.html`: the only page
- `css/style.css`: the look
- `js/`: the site's code (each file starts with a comment saying what it does)
- `lessons/catalog.js`: list of all modules and lessons
- `lessons/sql/`: SQL lessons, plus `data/` with the sample databases

## Add a new lesson
1. Copy `lessons/sql/01-select.js` and rename it.
2. Change the `id`, the text, the exercises and the quiz.
3. In `lessons/catalog.js`, put the file path in that lesson's `file:`.

## Tech
HTML + CSS + plain JavaScript. SQL runs in the browser with sql.js 1.15.2, and Python will use Pyodide 0.29.5 (Step 4). Progress is saved in the browser (localStorage), so it stays on this computer and this browser only.
