// checker.js — decides if your answer is correct.
// Important idea: we NEVER compare your code text with the solution text,
// because different code can be correct. Instead we run BOTH and compare the RESULTS.

(function () {
  // Turn one cell into a comparable "key". 5 and 5.0 count as the same number.
  function cellKey(value) {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "number") return "n:" + Math.round(value * 1e6) / 1e6;
    return "s:" + String(value);
  }
  function rowKey(row) { return row.map(cellKey).join("¦"); }
  // Same cells but sorted, to notice "right data, columns in a different order".
  function sortedRowKey(row) { return row.map(cellKey).sort().join("¦"); }

  function sameList(a, b) { return a.length === b.length && a.every((x, i) => x === b[i]); }

  const OK = { ok: true, message: "Correct!" };
  const notYet = (message) => ({ ok: false, message });

  CodeLab.check = {
    // Compare two SQL results. Column NAMES don't matter, only the values.
    // Row order only matters when orderMatters is true (lessons about ORDER BY).
    sql(actual, expected, orderMatters) {
      if (expected.error) return notYet("Oops, this exercise's own solution has an error. Please tell the site builder!");
      if (actual.error) return notYet("Your query has an error. Read the red message above, fix it, and run again.");
      if (!actual.columns.length) return notYet("Your code didn't give back a table. A question to the database starts with SELECT.");

      const yourCols = actual.columns.length, needCols = expected.columns.length;
      if (yourCols !== needCols) {
        return notYet(`You returned ${yourCols} column${yourCols === 1 ? "" : "s"}, but the answer needs ${needCols}. Check which columns the task asks for.`);
      }
      const yourRows = actual.rows.length, needRows = expected.rows.length;
      if (yourRows !== needRows) {
        return notYet(`You returned ${yourRows} row${yourRows === 1 ? "" : "s"}, but the answer has ${needRows}.`);
      }

      const a = actual.rows.map(rowKey), e = expected.rows.map(rowKey);
      if (sameList(a, e)) return OK;
      if (sameList([...a].sort(), [...e].sort())) {
        return orderMatters ? notYet("You have the right rows, but in the wrong order. Check your ORDER BY.") : OK;
      }
      const a2 = actual.rows.map(sortedRowKey).sort(), e2 = expected.rows.map(sortedRowKey).sort();
      if (sameList(a2, e2)) return notYet("Right data, but your columns are in a different order than the task asks for.");
      return notYet("Right size, but some values are different. Compare your columns (and filters) with what the task asks for.");
    },

    // Turn scary error messages into friendly advice.
    explainError(message) {
      const m = message.toLowerCase();
      if (m.includes("no such column")) return "The table has no column with that name. Check the spelling in the 📋 Tables box.";
      if (m.includes("no such table")) return "There is no table with that name. Check the spelling in the 📋 Tables box.";
      if (m.includes("incomplete input")) return "Your query looks unfinished. Did you forget the FROM part?";
      if (m.includes("syntax error")) return "SQL couldn't understand part of your query. Look near the word in quotes: a typo, a missing comma, or a missing keyword?";
      return "Read the message carefully: it usually names the word where SQL got confused.";
    },
  };
})();
