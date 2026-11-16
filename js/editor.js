// editor.js — the code box where you type.
// It's a normal <textarea> with a few upgrades:
//   • line numbers on the left
//   • the Tab key inserts spaces (instead of jumping to the next button)
//   • Ctrl + Enter runs your code
//   • the box grows taller as you type more lines

CodeLab.makeEditor = function (container, options) {
  const { code = "", onRun, onChange } = options;

  container.innerHTML = `
    <div class="editor">
      <pre class="gutter" aria-hidden="true"></pre>
      <textarea spellcheck="false" autocapitalize="off" autocomplete="off"
                autocorrect="off" wrap="off" aria-label="Code editor"></textarea>
    </div>`;
  const textarea = container.querySelector("textarea");
  const gutter = container.querySelector(".gutter");
  textarea.value = code;

  // Redraw line numbers and grow the box to fit all lines.
  function update() {
    const lineCount = textarea.value.split("\n").length;
    gutter.textContent = Array.from({ length: lineCount }, (_, i) => i + 1).join("\n");
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  textarea.addEventListener("input", () => {
    update();
    if (onChange) onChange(textarea.value);
  });

  textarea.addEventListener("keydown", (event) => {
    // Tab → insert 2 spaces where the cursor is.
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      textarea.setRangeText("  ", textarea.selectionStart, textarea.selectionEnd, "end");
      textarea.dispatchEvent(new Event("input"));
    }
    // Ctrl + Enter (or Cmd + Enter on Mac) → run.
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && onRun) {
      event.preventDefault();
      onRun();
    }
  });

  update();

  // Give back a tiny "remote control" for this editor.
  return {
    get: () => textarea.value,
    set(value) { textarea.value = value; update(); },
  };
};
