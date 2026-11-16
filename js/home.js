// home.js — the top bar, the "Who's playing?" screen, and the Home screen.

(function () {
  const P = CodeLab.progress, esc = CodeLab.esc, fmt = CodeLab.fmt;
  const S = (CodeLab.screens = {});

  // Top bar: logo + XP, streak, level and the current player.
  S.topBar = function () {
    const bar = document.getElementById("topbar");
    const name = P.current();
    let html = `<a class="logo" href="#/">CODE<span>LAB</span></a>`;
    if (name) {
      html += `<div class="stats">
        <span title="Experience points">⭐ ${P.xp()} XP</span>
        <span title="Days in a row">🔥 ${P.streak()}</span>
        <span title="Level">Lv ${P.level()}<span class="rank"> · ${P.rank()}</span></span>
        <button class="chip" id="switch" title="Switch player">${P.avatar(name)} ${name} ▾</button>
      </div>`;
    }
    bar.innerHTML = html;
    const btn = bar.querySelector("#switch");
    if (btn) btn.onclick = () => { P.logout(); CodeLab.go("#/"); };
  };

  // "Who's playing?" screen.
  S.picker = function (app) {
    app.innerHTML = `<section class="picker">
      <h1>Who's playing?</h1>
      <p class="muted">Each player has their own XP, streak and badges.</p>
      <div class="picker-cards">${P.players.map((p) => {
        const save = P.peek(p.name);
        return `<button class="player-card" data-name="${p.name}">
          <span class="avatar">${p.avatar}</span><strong>${p.name}</strong>
          <span class="muted">Lv ${P.levelFor(save.xp)} · ${save.xp} XP</span></button>`;
      }).join("")}</div></section>`;
    app.querySelectorAll(".player-card").forEach((b) => {
      b.onclick = () => { P.choose(b.dataset.name); CodeLab.go("#/"); };
    });
  };

  // Home: badges + modules with their lessons.
  S.home = function (app) {
    const name = P.current(), save = P.data();
    let html = `<section class="hero"><h1>Welcome, ${name}! ${P.avatar(name)}</h1>
      <p>Each lesson has 5 parts: 📖 Theory → 🔍 Examples → 🏋️ Practice → 👾 Boss Challenge → 🧠 Ready Check.
      Beat the Boss and pass the Ready Check to complete a lesson.</p></section>`;

    html += `<section class="card"><h2>Badges</h2><div class="badges">${Object.entries(P.badges).map(([id, b]) =>
      `<div class="badge ${save.badges.includes(id) ? "got" : ""}" title="${esc(b.desc)}"><span>${b.icon}</span><small>${b.name}</small></div>`
    ).join("")}</div></section>`;

    for (const mod of CodeLab.catalog) {
      const done = mod.lessons.filter((l) => P.lessonDone(l.id)).length;
      const pct = Math.round((done / mod.lessons.length) * 100);
      html += `<section class="card">
        <h2>${mod.icon} ${esc(mod.title)}</h2><p class="muted">${fmt(mod.description)}</p>
        <div class="bar"><div style="width:${pct}%"></div></div>
        <small class="muted">${done} of ${mod.lessons.length} lessons complete</small>
        <ol class="lesson-list">${mod.lessons.map((l) => {
          if (!l.file) return `<li class="soon">🔒 ${esc(l.title)} <small>coming soon</small></li>`;
          const icon = P.lessonDone(l.id) ? "✅" : P.lessonStarted(l.id) ? "▶️" : "⭐";
          return `<li><a href="#/lesson/${l.id}/1">${icon} ${esc(l.title)}</a></li>`;
        }).join("")}</ol></section>`;
    }

    html += `<p class="center"><button class="link" id="reset">Reset ${name}'s progress</button></p>`;
    app.innerHTML = html;
    app.querySelector("#reset").onclick = () => {
      if (confirm(`Erase ALL of ${name}'s XP, badges and lessons? This can't be undone.`)) { P.reset(); CodeLab.go("#/"); }
    };
  };
})();
