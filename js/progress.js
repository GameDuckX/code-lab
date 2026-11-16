// progress.js — remembers who is playing and what they have done.
// Everything is saved in localStorage: a small notebook the browser keeps
// for this website. Each player gets their own page in that notebook.

// The (function () { ... })(); wrapper keeps our variables private to this file,
// so they can't clash with variables in other files.
(function () {
  const PREFIX = "codelab.v1.";   // every saved item's name starts with this
  const XP_PER_LEVEL = 100;

  const PLAYERS = [
    { name: "Bruno", avatar: "🧑‍🚀" },
    { name: "Titi", avatar: "👾" },
  ];

  // Rank names: level 1 = Youngling, level 2 = Padawan, ... level 6+ = Legend.
  const RANKS = ["Youngling", "Padawan", "Knight", "Master", "Grand Master", "Legend"];

  const BADGES = {
    "lift-off":   { icon: "🚀", name: "Lift Off",       desc: "Solve your first exercise" },
    "boss":       { icon: "👾", name: "Boss Defeated",  desc: "Beat your first Boss Challenge" },
    "perfect":    { icon: "🎯", name: "Perfect Run",    desc: "Beat a Boss Challenge on the first try" },
    "no-peek":    { icon: "🥷", name: "Ninja",          desc: "Finish a lesson's practice without opening a solution" },
    "ready":      { icon: "🧠", name: "Ready for More", desc: "Pass a Ready Check" },
    "full-marks": { icon: "⭐", name: "Full Marks",     desc: "Get every Ready Check question right" },
    "combo-3":    { icon: "🔥", name: "Combo x3",       desc: "Practice 3 days in a row" },
    "combo-7":    { icon: "⚡", name: "Combo x7",       desc: "Practice 7 days in a row" },
  };

  let player = null;  // the name of who is playing right now
  let data = null;    // that player's saved progress

  // localStorage can fail (private window, blocked storage), so we "try" carefully.
  function read(key) {
    try { return JSON.parse(localStorage.getItem(PREFIX + key)); } catch (e) { return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* not saved, but the site still works */ }
  }

  // What a brand-new player's save looks like.
  function emptySave() {
    return { xp: 0, streak: 0, lastDay: null, badges: [], done: {}, lessons: {}, drafts: {} };
  }
  function loadSave(name) {
    return Object.assign(emptySave(), read("save." + name) || {});
  }

  // Dates as text like "2026-11-16" (using the computer's own time zone).
  function dayText(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }
  function today() { return dayText(new Date()); }
  function yesterday() { const d = new Date(); d.setDate(d.getDate() - 1); return dayText(d); }

  function levelFor(xp) { return Math.floor(xp / XP_PER_LEVEL) + 1; }

  // Called whenever the player earns something: keeps the daily streak going.
  function updateStreak() {
    if (data.lastDay === today()) return;                       // already counted today
    data.streak = data.lastDay === yesterday() ? data.streak + 1 : 1;
    data.lastDay = today();
    if (data.streak >= 3) giveBadge("combo-3");
    if (data.streak >= 7) giveBadge("combo-7");
  }

  function giveBadge(id) {
    if (data.badges.includes(id)) return;
    data.badges.push(id);
    CodeLab.toast(`${BADGES[id].icon} New badge: **${BADGES[id].name}**`);
  }

  CodeLab.progress = {
    players: PLAYERS,
    badges: BADGES,

    // On start-up: remember who played last time.
    init() {
      const saved = read("player");
      if (PLAYERS.some((p) => p.name === saved)) this.choose(saved);
    },
    current() { return player; },
    avatar(name) { return PLAYERS.find((p) => p.name === name).avatar; },
    choose(name) { player = name; write("player", name); data = loadSave(name); },
    logout() { player = null; data = null; write("player", null); },
    peek(name) { return loadSave(name); },     // read someone's save without switching
    data() { return data; },
    save() { if (player) write("save." + player, data); },

    xp() { return data.xp; },
    levelFor,
    level() { return levelFor(data.xp); },
    rank() { return RANKS[Math.min(this.level(), RANKS.length) - 1]; },
    // The streak only counts if you played today or yesterday.
    streak() { return data.lastDay === today() || data.lastDay === yesterday() ? data.streak : 0; },

    // Progress for one lesson (created the first time it's needed).
    lesson(id) {
      if (!data.lessons[id]) {
        data.lessons[id] = { seen: {}, practice: {}, hints: {}, challenge: false, challengeTries: 0, quizBest: null, quizPassed: false, complete: false };
      }
      return data.lessons[id];
    },
    lessonStarted(id) { return !!data.lessons[id]; },
    lessonDone(id) { return !!(data.lessons[id] && data.lessons[id].complete); },

    // Give XP for something ONLY ONCE. "key" is a unique name like "sql-01-select/practice/2".
    // Returns how much XP was given (0 if it was already given before).
    award(key, xp, badgeIds = []) {
      if (data.done[key]) return 0;
      const oldLevel = this.level();
      data.done[key] = true;
      data.xp += xp;
      updateStreak();
      badgeIds.forEach(giveBadge);
      if (this.level() > oldLevel) CodeLab.toast(`🆙 Level up! You're now **Lv ${this.level()} · ${this.rank()}**`);
      this.save();
      CodeLab.screens.topBar();   // refresh the XP numbers at the top
      return xp;
    },
    giveBadge(id) { giveBadge(id); this.save(); },

    // Drafts: the code you typed in an exercise, so it's still there next time.
    getDraft(key) { return data.drafts[key]; },
    setDraft(key, code) { data.drafts[key] = code; this.save(); },

    reset() { data = emptySave(); this.save(); },
  };
})();
