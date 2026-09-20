# Linux Intent

**A plain-English lookup for Linux commands.** Type what you want to do, get the command, no memorizing flags required.

![License: MIT](https://img.shields.io/badge/license-MIT-22e5a6)
![No dependencies](https://img.shields.io/badge/dependencies-none-22e5a6)
![Vanilla JS](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-22e5a6)

> No backend. No database. No AI calls. No login. Just a hardcoded list of commands matched against what you type, running entirely in your browser.

**Live demo:** [add your GitHub Pages link here once it's live]

---

### Screenshot

<img width="600" height="300" alt="image" src="https://github.com/user-attachments/assets/359103a2-709f-42e8-ad96-6b855fccfd2d" />
<img width="600" height="300" alt="image" src="https://github.com/user-attachments/assets/c8cd3d32-7b09-4f2f-9d00-f7f64b777699" />
<img width="600" height="300" alt="image" src="https://github.com/user-attachments/assets/d295f70e-c481-4074-9a73-741c002bb4e3" />




---

## Features

- 🔍 **Search** — describe what you want to do ("delete a folder", "check running processes") and get the matching command, with flags, examples, and related commands
- 🗂 **Categories** — browse commands grouped by what they do
- 📋 **Cheat Sheet** — every command on one page, grouped by category
- 🎯 **Practice** — a multiple-choice quiz: read a description, pick the matching command
- ⭐ **Favorites** — star commands to save them, persisted in your browser via `localStorage`
- 📎 **Copy buttons** on every command and example

## Getting started

No build step, no install. Clone it and open the file:

```bash
git clone https://github.com/YOUR-USERNAME/linux-intent.git
cd linux-intent
```

Then just open `index.html` in a browser.

To serve it locally instead (optional — only useful for testing things like clipboard behavior that can differ under `file://`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Project structure

```
index.html   — page structure and the six views (Search, Categories, Cheat Sheet, Practice, Favorites, About)
styles.css   — all styling and the color/typography system
app.js       — command data, search logic, rendering, and view switching
```

## Adding a command

All command data lives in `app.js`. You shouldn't need to touch `index.html` or `styles.css` to add one.

Each entry has the same shape:

```js
{
  id: "example",
  name: "Short display name",
  category: "Files",
  command: "example --flag value",
  description: "What this command does.",
  keywords: ["plain english phrase", "another phrase someone might type"],
  flags: [["--flag", "what the flag does"]],
  examples: ["example --flag value"],
  notes: "Anything worth calling out.",
  related: ["other-command-id"]
}
```

For a quick addition without the extra fields, use the `entry()` helper further down in `app.js`:

```js
entry("Short display name", "example --flag value", "What this command does.", ["plain english phrase", "another phrase"])
```

## Tech

Plain HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies. Fonts are IBM Plex Mono and IBM Plex Sans, loaded from Google Fonts.

## Contributing

This is a small, actively-growing reference — contributions are welcome.

- Found a wrong or outdated command? Open an issue.
- Want to add commands for a category that's thin? Pull requests welcome, just follow the entry shape above.
- Have an idea for a feature? Open an issue to discuss it first.

## License

MIT — do whatever you want with it.
