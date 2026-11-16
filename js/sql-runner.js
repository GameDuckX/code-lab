// sql-runner.js — runs SQL inside your browser using sql.js.
// sql.js is a real database engine (SQLite) turned into a web file,
// so no server is needed. We download it the first time a SQL lesson opens.

(function () {
  // EXACT version, so the site never changes behaviour by surprise.
  const VERSION = "1.15.2";
  const CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/" + VERSION + "/";

  let SQL = null;       // the engine, once it's loaded
  let loading = null;   // the "loading ticket", so we only download once

  // Build a FRESH copy of a sample database, do something with it, then throw it away.
  // Fresh every time = you can never break the data, even with a bad query.
  function withDatabase(dbName, work) {
    const db = new SQL.Database();
    try {
      db.exec(CodeLab.databases[dbName]);   // create the tables and rows
      return work(db);
    } catch (error) {
      return { error: error.message };
    } finally {
      db.close();
    }
  }

  CodeLab.sql = {
    // Download sql.js (only the first time).
    load() {
      if (!loading) {
        loading = CodeLab.loadScript(CDN + "sql-wasm.js")
          .then(() => window.initSqlJs({ locateFile: (file) => CDN + file }))
          .then((engine) => { SQL = engine; })
          .catch((error) => { loading = null; throw error; });   // allow a retry
      }
      return loading;
    },

    // Used by the test page in Node.js / special cases: give it an engine directly.
    useEngine(engine) { SQL = engine; loading = Promise.resolve(); },

    // Run some SQL. Gives back the LAST table it produced:
    //   { columns: ["title"], rows: [["Toy Story"], ...] }   or   { error: "..." }
    run(dbName, code) {
      return withDatabase(dbName, (db) => {
        let last = { columns: [], rows: [] };
        // A query box can contain several statements; we go through them one by one.
        for (const statement of db.iterateStatements(code)) {
          const columns = statement.getColumnNames();
          const rows = [];
          while (statement.step()) rows.push(statement.get());
          if (columns.length) last = { columns, rows };
        }
        return last;
      });
    },

    // List the tables and their columns, e.g. [{ name: "movies", columns: ["id", "title", ...] }]
    tables(dbName) {
      return withDatabase(dbName, (db) => {
        const names = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY rowid")[0].values.map((r) => r[0]);
        return names.map((name) => ({
          name,
          columns: db.exec(`PRAGMA table_info(${name})`)[0].values.map((r) => r[1]),
        }));
      });
    },
  };
})();
