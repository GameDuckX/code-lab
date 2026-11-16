// copy-for-claude.js — builds the "Copy for Claude" message.
// It packs the challenge + your code + the result into a prompt that asks
// Claude to REVIEW and give ADVICE, NOT to hand you the answer.

(function () {
  // Turn a result into a small text table that Claude can read.
  function resultAsText(result) {
    if (!result) return "(not run yet)";
    if (result.error) return "ERROR: " + result.error;
    if (!result.columns.length) return "(no table returned)";
    const lines = [result.columns.join(" | ")];
    result.rows.slice(0, 15).forEach((row) => lines.push(row.map((v) => (v === null ? "NULL" : v)).join(" | ")));
    if (result.rows.length > 15) lines.push(`... (${result.rows.length} rows in total)`);
    return lines.join("\n");
  }

  CodeLab.buildClaudePrompt = function ({ lesson, exercise, code, result, verdict }) {
    const language = lesson.language === "sql" ? "SQL" : "Python";
    const tables = lesson.language === "sql"
      ? CodeLab.sql.tables(lesson.database).map((t) => `${t.name}(${t.columns.join(", ")})`).join("\n")
      : "";
    return [
      `Hi Claude! I'm a beginner learning ${language} on my own practice website.`,
      `I'm working on a challenge and I want to LEARN, so please DO NOT give me the answer or write the solution code for me.`,
      `Instead, please:`,
      `1. Review my code: tell me what is right and what is wrong.`,
      `2. Give me a hint or a question that helps me find the fix myself.`,
      `3. Explain any idea I seem to misunderstand, in simple words.`,
      verdict.ok
        ? `4. The checker says my code is correct. Is there a cleaner way to write it? Describe it, don't write it.`
        : `4. Tell me what I should practice to get better at this.`,
      ``,
      `## Lesson`,
      lesson.title,
      ``,
      `## The challenge`,
      exercise.task.replace(/\*\*/g, ""),
      ``,
      ...(tables ? [`## Tables I can use`, tables, ``] : []),
      `## My code`,
      "```" + lesson.language,
      code,
      "```",
      ``,
      `## What happened`,
      `Checker said: ${verdict.ok ? "CORRECT" : "NOT YET (" + verdict.message + ")"}`,
      `Result:`,
      "```",
      resultAsText(result),
      "```",
    ].join("\n");
  };

  // Copy text to the clipboard. Returns true if it worked.
  CodeLab.copyText = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Older way, for browsers that block the new one.
      const box = document.createElement("textarea");
      box.value = text;
      document.body.appendChild(box);
      box.select();
      const worked = document.execCommand("copy");
      box.remove();
      return worked;
    }
  };
})();
