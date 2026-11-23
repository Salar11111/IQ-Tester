<div align="center">

# 🧠 IQ Tester

**Thirty questions, six categories, twenty minutes — and a proper results page at the end.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![No build step](https://img.shields.io/badge/build-none-16A34A)

</div>

---

## ✨ Why IQ Tester?

It is a timed quiz that runs entirely in the browser. No account, no server, no install: open one HTML file and you are taking the test. The interesting part is the feedback — instead of a bare score, the results screen shows a bell curve, a per-category breakdown and a history of past attempts kept in `localStorage`.

The code is deliberately small and readable: a question bank, an engine for the timer and answers, a results module for scoring and charts, and a thin app module for moving between screens.

### 🧩 What's inside

- ⏱️ **Timed run** — thirty questions in twenty minutes, five from each of six categories.
- 📊 **Real results** — overall score, a bell curve and a category-by-category breakdown.
- 🕘 **Attempt history** — past runs stay in `localStorage` on the same device.
- 🧭 **Six categories** — pattern recognition, logical reasoning, spatial awareness, numerical ability, verbal intelligence and memory & attention.
- 🪶 **Zero dependencies** — plain HTML, CSS and JavaScript.

---

## 🚀 Run it

Open `index.html` in a browser. That is the entire setup.

---

## 🗂 Files

| File | Role |
| --- | --- |
| `index.html` | Screens |
| `css/styles.css` | Layout |
| `js/questions.js` | Question bank |
| `js/engine.js` | Timer, question order and recorded answers |
| `js/results.js` | Score, charts and saved history |
| `js/app.js` | Screen navigation |

---

## 🗺 Roadmap ideas

- 🔀 Shuffle question order per attempt
- 🧩 Difficulty levels and category-only runs
- 📤 Export results as JSON
- ♿ Keyboard-only navigation and reduced-motion polish

---

<div align="center">

No server, no install, no excuses. Built with plain HTML, CSS and JavaScript.

</div>
