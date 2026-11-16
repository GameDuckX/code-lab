// exercises.js — the Practice and Boss Challenge parts of a lesson:
// code box, Run & Check button, results table, hints and "Copy for Claude".

(function () {
  const P = CodeLab.progress, esc = CodeLab.esc, fmt = CodeLab.fmt;
  const X = (CodeLab.exercises = {});

  // Run code for a lesson. (Python will be added here in Step 4.)
  X.run = function (lesson, code) {
    return CodeLab.sql.run(lesson.database, code);
  };

  // Run YOUR code and the SOLUTION, then compare the results.
  X.check = function (lesson, exercise, code) {
    const actual = X.run(lesson, code);
    const expected = X.run(lesson, exercise.solution);
    return { actual, verdict: CodeLab.check.sql(actual, expected, exercise.orderMatters) };
  };

  // Turn a result into HTML: a table, an error, or a "nothing" message.
  X.resultHTML = function (r) {
    if (r.error) {
      return `<div class="out error"><strong>❌ Error:</strong> ${esc(r.error)}<br><small>${esc(CodeLab.check.explainError(r.error))}</small></div>`;
    }
    if (!r.columns.length) return `<div class="out muted">The code ran, but it didn't give back a table.</div>`;
    const MAX = 50;
    return `<div class="out"><div class="table-wrap"><table>
      <thead><tr>${r.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${r.rows.slice(0, MAX).map((row) => `<tr>${row.map((v) => `<td>${v === null ? "NULL" : esc(v)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div><small class="muted">${r.rows.length} row${r.rows.length === 1 ? "" : "s"}</small></div>`;
  };

  // The "📋 Tables you can use" box.
  X.tablesHTML = function (lesson) {
    return `<details class="card tables" open><summary>📋 Tables you can use</summary>
      ${CodeLab.sql.tables(lesson.database).map((t) => `<p><code><strong>${t.name}</strong> (${t.columns.join(", ")})</code></p>`).join("")}
    </details>`;
  };

  // One exercise card. Used by both Practice (with hints) and the Boss (no hints).
  function exerciseCard(card, lesson, ex, opts) {
    card.innerHTML = `
      <h2>${opts.label}</h2>
      <p class="task">${fmt(ex.task)}</p>
      <div class="ed"></div>
      <div class="actions">
        <button class="btn primary run">▶ Run &amp; Check</button>
        ${opts.hints ? `<button class="btn hint"></button>` : ""}
        ${opts.claude ? `<button class="btn copy">📋 Copy for Claude</button>` : ""}
      </div>
      <small class="muted">Tip: Ctrl + Enter also runs your code.</small>
      <div class="hints"></div><div class="result"></div><div class="verdict"></div>`;

    const editor = CodeLab.makeEditor(card.querySelector(".ed"), {
      code: P.getDraft(opts.key) ?? ex.starter ?? "",
      onRun: run,
      onChange: (code) => P.setDraft(opts.key, code),
    });
    let last = null;   // the last run (used by Copy for Claude)

    function run() {
      const code = editor.get();
      const verdictBox = card.querySelector(".verdict");
      if (!code.replace(/--.*$/gm, "").trim()) {   // only comments or empty?
        verdictBox.innerHTML = `<div class="bad">✍️ Write your code first, then press Run.</div>`;
        return;
      }
      const { actual, verdict } = X.check(lesson, ex, code);
      last = { code, result: actual, verdict };
      card.querySelector(".result").innerHTML = X.resultHTML(actual);
      if (opts.onAttempt) opts.onAttempt();
      if (verdict.ok) {
        const gained = opts.onSolved();
        verdictBox.innerHTML = `<div class="ok">✅ Correct! ${gained ? `+${gained} XP` : "(already solved before)"}</div>`;
      } else {
        verdictBox.innerHTML = `<div class="bad">🤔 Not yet. ${esc(verdict.message)}</div>`;
      }
    }
    card.querySelector(".run").onclick = run;

    // Hints: level 0 = none shown, 1 = nudge, 2 = bigger hint, 3 = solution.
    if (opts.hints) {
      const btn = card.querySelector(".hint");
      let level = opts.getHints();
      const show = () => {
        const parts = [];
        if (level >= 1) parts.push(`<div class="hint-box">💡 <strong>Nudge:</strong> ${fmt(ex.hints[0])}</div>`);
        if (level >= 2) parts.push(`<div class="hint-box">💡 <strong>Bigger hint:</strong> ${fmt(ex.hints[1])}</div>`);
        if (level >= 3) parts.push(`<div class="hint-box">🔓 <strong>Solution:</strong><pre><code>${esc(ex.solution)}</code></pre>
          <small>Type it yourself (no copy-paste): your fingers learn too!</small></div>`);
        card.querySelector(".hints").innerHTML = parts.join("");
        btn.textContent = ["💡 Hint (1 of 3)", "💡 Bigger hint (2 of 3)", "🔓 Show solution (3 of 3)", "All hints shown"][level];
        btn.disabled = level >= 3;
      };
      btn.onclick = () => {
        if (level === 2 && !confirm("Show the full solution? You'll get 5 XP instead of 10 for this one.")) return;
        level++;
        opts.setHints(level);
        show();
      };
      show();
    }

    // Copy for Claude: copy a review request (not an answer request).
    if (opts.claude) {
      card.querySelector(".copy").onclick = async () => {
        if (!last || last.code !== editor.get()) run();
        if (!last) return;
        const text = CodeLab.buildClaudePrompt({ lesson, exercise: ex, ...last });
        const worked = await CodeLab.copyText(text);
        CodeLab.toast(worked ? "📋 Copied! Paste it into a chat with Claude." : "Couldn't copy automatically, sorry.");
      };
    }
  }

  // Part 3: Practice.
  X.practice = function (box, lesson, save, ctx) {
    box.innerHTML = `<p class="muted">Solve each exercise. Stuck? Press 💡 Hint: first a small nudge, then a bigger hint,
      then the solution (you still get 5 XP).</p>` + X.tablesHTML(lesson) +
      lesson.practice.map(() => `<article class="card exercise"></article>`).join("");

    box.querySelectorAll(".exercise").forEach((card, i) => {
      exerciseCard(card, lesson, lesson.practice[i], {
        key: `${lesson.id}/practice/${i}`,
        label: `Exercise ${i + 1} of ${lesson.practice.length}${save.practice[i] ? " ✅" : ""}`,
        hints: true,
        getHints: () => save.hints[i] || 0,
        setHints: (n) => { save.hints[i] = n; P.save(); },
        onSolved() {
          save.practice[i] = true;
          const peeked = (save.hints[i] || 0) >= 3;
          const gained = P.award(`${lesson.id}/practice/${i}`, peeked ? 5 : 10, ["lift-off"]);
          const allDone = lesson.practice.every((_, j) => save.practice[j]);
          const noPeeks = lesson.practice.every((_, j) => (save.hints[j] || 0) < 3);
          if (allDone && noPeeks) P.giveBadge("no-peek");
          P.save();
          ctx.refreshTabs();
          return gained;
        },
      });
    });
  };

  // Part 4: Boss Challenge. No hints, only the checker and Copy for Claude.
  X.challenge = function (box, lesson, save, ctx) {
    box.innerHTML = `<div class="boss-banner">👾 BOSS LEVEL 👾</div>
      <p class="muted center">No hints here. The checker tells you if you're right.
      Stuck? Press "Copy for Claude" and paste it into Claude to get advice (not the answer).</p>` +
      X.tablesHTML(lesson) + `<article class="card exercise boss"></article>`;

    exerciseCard(box.querySelector(".boss"), lesson, lesson.challenge, {
      key: `${lesson.id}/challenge`,
      label: `Boss Challenge${save.challenge ? " ✅" : ""}`,
      claude: true,
      onAttempt() { if (!save.challenge) { save.challengeTries++; P.save(); } },
      onSolved() {
        const firstTry = !save.challenge && save.challengeTries === 1;
        save.challenge = true;
        const gained = P.award(`${lesson.id}/challenge`, 25, firstTry ? ["boss", "perfect"] : ["boss"]);
        X.checkComplete(lesson, save);
        P.save();
        ctx.refreshTabs();
        return gained;
      },
    });
  };

  // A lesson is complete when the Boss is beaten AND the Ready Check is passed.
  X.checkComplete = function (lesson, save) {
    if (save.complete || !save.challenge || !save.quizPassed) return;
    save.complete = true;
    P.award(`${lesson.id}/complete`, 50);
    CodeLab.toast("🏆 **Lesson complete!** +50 XP");
  };
})();
