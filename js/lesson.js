// lesson.js — the lesson screen: the 5 tabs, Theory, Examples and the Ready Check quiz.
// (Practice and Boss Challenge live in exercises.js.)

(function () {
  const P = CodeLab.progress, esc = CodeLab.esc, fmt = CodeLab.fmt, S = CodeLab.screens;

  const STAGES = [
    { name: "Theory", icon: "📖" },
    { name: "Examples", icon: "🔍" },
    { name: "Practice", icon: "🏋️" },
    { name: "Boss Challenge", icon: "👾" },
    { name: "Ready Check", icon: "🧠" },
  ];

  // Find a lesson in the catalog → { mod, entry, next }
  function findInCatalog(id) {
    for (const mod of CodeLab.catalog) {
      const i = mod.lessons.findIndex((l) => l.id === id);
      if (i >= 0) return { mod, entry: mod.lessons[i], next: mod.lessons[i + 1] };
    }
    return null;
  }

  // Has this part (1 to 5) been finished?
  function stageDone(lesson, save, n) {
    if (n <= 2) return !!save.seen[n];
    if (n === 3) return lesson.practice.every((_, i) => save.practice[i]);
    if (n === 4) return save.challenge;
    return save.quizPassed;
  }

  S.lesson = async function (app, id, stage) {
    const myRoute = CodeLab.routeId;
    const found = findInCatalog(id);
    if (!found || !found.entry.file) {
      app.innerHTML = `<p class="card">Lesson not found. <a href="#/">← Back home</a></p>`;
      return;
    }
    app.innerHTML = `<p class="loading">⏳ Loading the lesson and starting the database engine…</p>`;

    // Load the lesson file, its sample database and the SQL engine.
    let lesson;
    try {
      await CodeLab.loadScript(found.entry.file);
      lesson = CodeLab.lessons[id];
      await CodeLab.loadScript(CodeLab.databaseFiles[lesson.database]);
      await CodeLab.sql.load();
    } catch (e) {
      app.innerHTML = `<div class="card out error">😵 Could not load this lesson (${esc(e.message)}).<br>
        The SQL engine downloads from the internet the first time. Check your connection and refresh.</div>`;
      return;
    }
    if (myRoute !== CodeLab.routeId) return;   // the player already went to another page

    stage = Math.min(Math.max(stage, 1), 5);
    const save = P.lesson(id);
    save.seen[stage] = true;
    P.save();

    const tabsHTML = () => STAGES.map((s, i) => {
      const n = i + 1;
      return `<li><a href="#/lesson/${id}/${n}" class="${n === stage ? "active" : ""}">
        ${stageDone(lesson, save, n) ? "✅" : s.icon} <span class="stage-name">${n}. ${s.name}</span></a></li>`;
    }).join("");

    app.innerHTML = `
      <nav class="crumbs"><a href="#/">← Home</a> · ${esc(found.mod.title)}</nav>
      <h1>${esc(lesson.title)}</h1>
      <ol class="stages">${tabsHTML()}</ol>
      <div id="stage"></div>
      <div class="stage-nav">
        ${stage > 1 ? `<a class="btn" href="#/lesson/${id}/${stage - 1}">← Back</a>` : "<span></span>"}
        ${stage < 5 ? `<a class="btn primary" href="#/lesson/${id}/${stage + 1}">Next: ${STAGES[stage].name} →</a>` : ""}
      </div>`;

    const ctx = { found, refreshTabs: () => { app.querySelector(".stages").innerHTML = tabsHTML(); } };
    const box = app.querySelector("#stage");
    const parts = [theory, examples, CodeLab.exercises.practice, CodeLab.exercises.challenge, quiz];
    parts[stage - 1](box, lesson, save, ctx);
  };

  // Part 1: Theory. Strings are paragraphs; { analogy } and { code } are special boxes.
  function theory(box, lesson) {
    box.innerHTML = `<article class="card theory">${lesson.theory.map((p) => {
      if (p.analogy) return `<div class="analogy">${fmt(p.analogy)}</div>`;
      if (p.code) return `<pre class="snippet"><code>${esc(p.code)}</code></pre>`;
      return `<p>${fmt(p)}</p>`;
    }).join("")}</article>`;
  }

  // Part 2: Examples. Real code you can run (and change!) + line-by-line explanation.
  function examples(box, lesson) {
    box.innerHTML = `<p class="muted">The result below each example is real: it comes from running the code.
      Try changing the code and pressing ▶ Run again!</p>` +
      lesson.examples.map((ex, i) => `<article class="card example">
        <h2>Example ${i + 1}: ${esc(ex.title)}</h2>
        <div class="ed"></div>
        <button class="btn run">▶ Run</button>
        <div class="result"></div>
        <h3>Line by line</h3>
        <ul>${ex.lines.map((l) => `<li>${fmt(l)}</li>`).join("")}</ul>
        ${ex.note ? `<p class="note">💡 ${fmt(ex.note)}</p>` : ""}
      </article>`).join("");

    box.querySelectorAll(".example").forEach((card, i) => {
      const run = () => {
        card.querySelector(".result").innerHTML = CodeLab.exercises.resultHTML(CodeLab.exercises.run(lesson, editor.get()));
      };
      const editor = CodeLab.makeEditor(card.querySelector(".ed"), { code: lesson.examples[i].code, onRun: run });
      card.querySelector(".run").onclick = run;
      run();   // show the result straight away
    });
  }

  // Part 5: Ready Check — a short quiz to prove you're ready for the next lesson.
  function quiz(box, lesson, save, ctx) {
    const total = lesson.quiz.length;
    const needed = Math.ceil(total * 0.8);   // 80% to pass (4 out of 5)
    box.innerHTML = `<article class="card">
      <h2>🧠 Ready Check</h2>
      <p>Get at least <strong>${needed} of ${total}</strong> right to prove you're ready for the next lesson.
      You can retry as many times as you want.</p>
      <form>${lesson.quiz.map((q, qi) => `<fieldset class="q">
        <legend>${qi + 1}. ${fmt(q.q)}</legend>
        ${q.options.map((o, oi) => `<label class="opt"><input type="radio" name="q${qi}" value="${oi}"> ${fmt(o)}</label>`).join("")}
        <div class="why"></div></fieldset>`).join("")}
        <button class="btn primary" type="submit">Check my answers</button>
      </form><div class="quiz-result"></div></article>`;

    const form = box.querySelector("form");
    form.onsubmit = (event) => {
      event.preventDefault();
      const answers = lesson.quiz.map((_, qi) => form.elements["q" + qi].value);
      if (answers.includes("")) { CodeLab.toast("Answer every question first 🙂"); return; }

      let score = 0;
      form.querySelectorAll(".q").forEach((field, qi) => {
        const q = lesson.quiz[qi], right = Number(answers[qi]) === q.answer;
        if (right) score++;
        field.className = "q " + (right ? "right" : "wrong");
        field.querySelector(".why").innerHTML = (right ? "✅ " : "❌ ") + fmt(q.why);
      });

      save.quizBest = Math.max(save.quizBest || 0, score);
      const out = box.querySelector(".quiz-result");
      if (score >= needed) {
        save.quizPassed = true;
        P.award(`${lesson.id}/quiz`, 20, score === total ? ["ready", "full-marks"] : ["ready"]);
        CodeLab.exercises.checkComplete(lesson, save);
        const next = ctx.found.next;
        out.innerHTML = `<div class="ok">🎉 ${score}/${total}: you're ready!
          ${save.challenge ? "" : `<br>Beat the <a href="#/lesson/${lesson.id}/4">👾 Boss Challenge</a> too, to complete the lesson.`}
          ${next && next.file ? `<br><a class="btn primary" href="#/lesson/${next.id}/1">Next lesson →</a>` : "<br>Next lesson coming soon!"}</div>`;
      } else {
        out.innerHTML = `<div class="bad">${score}/${total}. Almost! Read the explanations above,
          review the <a href="#/lesson/${lesson.id}/1">📖 Theory</a>, then try again.</div>`;
      }
      P.save();
      ctx.refreshTabs();
    };
  }
})();
