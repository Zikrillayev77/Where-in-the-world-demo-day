const countries = [
  { code: "jp", name: "Yaponiya" },
  { code: "br", name: "Braziliya" },
  { code: "eg", name: "Misr" },
  { code: "au", name: "Avstraliya" },
  { code: "ca", name: "Kanada" },
  { code: "fr", name: "Fransiya" },
  { code: "in", name: "Hindiston" },
  { code: "za", name: "Janubiy Afrika" },
  { code: "mx", name: "Meksika" },
  { code: "no", name: "Norvegiya" },
  { code: "tr", name: "Turkiya" },
  { code: "ar", name: "Argentina" },
  { code: "kr", name: "Janubiy Koreya" },
  { code: "it", name: "Italiya" },
  { code: "de", name: "Germaniya" },
  { code: "ke", name: "Keniya" }
];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const quiz = shuffle(countries).slice(0, 10).map(correct => {
  const others = shuffle(countries.filter(c => c.name !== correct.name)).slice(0, 3);
  const options = shuffle([correct, ...others]);
  return { code: correct.code, answer: correct.name, options: options.map(o => o.name) };
});

let current = 0;
let score = 0;
let answered = false;

const root = document.getElementById("game-root");

function render() {
  if (current >= quiz.length) {
    renderEnd();
    return;
  }
  const q = quiz[current];
  answered = false;
  root.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
      <span style="font-size:13px; color:var(--color-text-secondary);">Savol ${current + 1} / ${quiz.length}</span>
      <span style="font-size:13px; font-weight:500;">Ball: ${score}</span>
    </div>
    <div style="height:4px; background:var(--color-background-secondary); border-radius:4px; margin-bottom:2rem; overflow:hidden;">
      <div style="height:100%; width:${(current / quiz.length) * 100}%; background:var(--color-text-info);"></div>
    </div>
    <div style="display:flex; justify-content:center; margin-bottom:1.5rem;">
      <span class="fi fi-${q.code}" style="font-size:90px; box-shadow:0 0 0 0.5px var(--color-border-tertiary);"></span>
    </div>
    <p style="text-align:center; font-size:16px; color:var(--color-text-secondary); margin-bottom:1.5rem;">Bu qaysi davlat bayrog'i?</p>
    <div id="options" style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px;"></div>
    <p id="feedback" style="text-align:center; min-height:24px; margin-top:1.25rem; font-size:14px; font-weight:500;"></p>
  `;
  const optsEl = root.querySelector("#options");
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.style.padding = "12px";
    btn.style.fontSize = "14px";
    btn.onclick = () => selectAnswer(opt, btn);
    optsEl.appendChild(btn);
  });
}

function selectAnswer(opt, btn) {
  if (answered) return;
  answered = true;
  const q = quiz[current];
  const feedback = root.querySelector("#feedback");
  const buttons = root.querySelectorAll("#options button");
  buttons.forEach(b => {
    if (b.textContent === q.answer) {
      b.style.borderColor = "var(--color-border-success)";
      b.style.background = "var(--color-background-success)";
      b.style.color = "var(--color-text-success)";
    }
  });
  if (opt === q.answer) {
    score++;
    feedback.textContent = "To'g'ri!";
    feedback.style.color = "var(--color-text-success)";
  } else {
    btn.style.borderColor = "var(--color-border-danger)";
    btn.style.background = "var(--color-background-danger)";
    btn.style.color = "var(--color-text-danger)";
    feedback.textContent = "Noto'g'ri. To'g'ri javob: " + q.answer;
    feedback.style.color = "var(--color-text-danger)";
  }
  setTimeout(() => { current++; render(); }, 1100);
}

function renderEnd() {
  const pct = Math.round((score / quiz.length) * 100);
  let msg;
  if (pct >= 90) msg = "Ajoyib! Siz haqiqiy geografiya ustasisiz.";
  else if (pct >= 60) msg = "Yaxshi natija!";
  else msg = "Yana urinib ko'ring, yaxshilanasiz!";
  root.innerHTML = `
    <div style="text-align:center; padding:2rem 0;">
      <p style="font-size:14px; color:var(--color-text-secondary); margin-bottom:8px;">Natija</p>
      <p style="font-size:36px; font-weight:500; margin-bottom:8px;">${score} / ${quiz.length}</p>
      <p style="font-size:15px; color:var(--color-text-secondary); margin-bottom:1.5rem;">${msg}</p>
      <button id="restart" style="padding:10px 20px;">Qayta boshlash</button>
    </div>
  `;
  root.querySelector("#restart").onclick = () => {
    location.reload();
  };
}

const darkModeBtn = document.getElementById('dark-mode-btn');

darkModeBtn.addEventListener('click', () => {
 
  document.documentElement.classList.toggle('dark');

  
  if (document.documentElement.classList.contains('dark')) {
    darkModeBtn.innerText = "Light Mode";
  } else {
    darkModeBtn.innerText = "Dark Mode";
  }
});


render();