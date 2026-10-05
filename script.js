const $ = s => document.querySelector(s);
const rnd = a => a[Math.floor(Math.random() * a.length)];
const shuf = a => a.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
const app = h => { $('#app').innerHTML = h; scrollTo(0, 0); };
const go = (v, a) => ({ home, courses, course, kana, quizSetup, trace, progress })[v](a);

// ---------- Données ----------
const parse = (s, i) => s.split(' ').map(t => { const m = t.match(/^([\u3040-\u309f]+)([a-z]+)$/); return { k: m[1], r: m[2], s: i + 1 }; });
const ALL = HIRAGANA.flatMap(parse);
let S;
try { S = JSON.parse(localStorage.getItem('jp')); } catch (e) {}
S = S || { quiz: [], ok: 0, ko: 0, c: {}, st: [], sel: [1, 2] };
const save = () => { try { localStorage.setItem('jp', JSON.stringify(S)); } catch (e) {} };

// ---------- Sélection des séries ----------
function picker() {
  return `<div class="pick">${HIRAGANA.map((s, i) => { const p = parse(s, i);
    return `<label><input type="checkbox" value="${i + 1}" ${S.sel.includes(i + 1) ? 'checked' : ''}> Série ${i + 1} : ${p.map(c => c.k).join(' ')} <small>${p.map(c => c.r.toUpperCase()).join(' ')}</small></label>`; }).join('')}</div>
    <div class="row"><button onclick="selAll(1)">Tout sélectionner</button><button onclick="selAll(0)">Tout désélectionner</button></div>`;
}
const selAll = v => document.querySelectorAll('.pick input').forEach(i => i.checked = !!v);
function chosen() {
  S.sel = [...document.querySelectorAll('.pick input:checked')].map(x => +x.value); save();
  if (!S.sel.length) { alert('Choisis au moins une série.'); return null; }
  return ALL.filter(c => S.sel.includes(c.s));
}

// ---------- Pages ----------
function home() {
  app(`<h1>🇯🇵 Révision Japonais</h1><p class="sub">日本語を勉強しよう</p>
  <div class="grid"><button onclick="go('courses')">📚<b>Cours</b></button><button onclick="go('kana')">あ<b>Hiragana</b></button>
  <button onclick="go('quizSetup')">📝<b>Quiz</b></button><button onclick="go('progress')">📊<b>Progression</b></button></div>`);
}
function courses() {
  app(`<h2>📚 Cours</h2><div class="list">${COURSES.map(c => `<button onclick="go('course',${c.n})">Cours ${c.n} — <span>${c.title}</span></button>`).join('')}</div>`);
}
function course(n) {
  const c = COURSES.find(x => x.n == n);
  app(`<h2>Cours ${n} — ${c.title}</h2><div class="row"><button onclick="document.body.classList.toggle('rev')">👁 Mode révision (masque romaji/français)</button><button class="red" onclick="courseQuiz(${n})">📝 Quiz du cours</button></div>` +
    c.sections.map(s => `<section><h3>${s.t}</h3>${s.h || ''}${s.v ? `<table><tr><th>Japonais<th>Romaji<th>Français</tr>${s.v.map(r => `<tr><td class="jp">${r[0]}<td class="h">${r[1]}<td class="h">${r[2]}</tr>`).join('')}</table>` : ''}</section>`).join(''));
}
document.addEventListener('click', e => e.target.classList.contains('h') && e.target.classList.toggle('on'));

function kana() {
  app(`<h2>あ Hiragana</h2><div class="row"><button class="red" onclick="go('quizSetup')">📝 Quiz</button><button onclick="go('trace')">✍️ Mode tracé</button></div>` +
    HIRAGANA.map((s, i) => `<section><h3>Série ${i + 1}</h3><div class="chart">${parse(s, i).map(c => `<div><b>${c.k}</b><small>${c.r}</small></div>`).join('')}</div></section>`).join(''));
}

// ---------- Quiz ----------
function quizSetup() {
  app(`<h2>📝 Quiz Hiragana</h2>${picker()}
  <h3>Type</h3><select id="qt"><option value="1">1 · Hiragana → Romaji</option><option value="2">2 · Romaji → Hiragana</option><option value="3">3 · Reconnaissance rapide</option><option value="4">4 · Série complète (tous les caractères)</option></select>
  <h3>Nombre de questions (types 1 à 3)</h3><select id="qn"><option>5</option><option selected>10</option><option>20</option></select>
  <div class="row"><button class="red" onclick="startQuiz()">Commencer</button></div>`);
}
function startQuiz() {
  const p = chosen(); if (!p) return;
  const t = +$('#qt').value; let n = t == 4 ? p.length : +$('#qn').value, items = [];
  while (items.length < n) items.push(...shuf(p));
  items = items.slice(0, n);
  const qs = items.map(c => {
    const dir = t == 4 ? rnd([1, 2]) : (t == 2 ? 2 : 1);
    const other = ALL.filter(x => x.k != c.k);
    const d = shuf(other.filter(x => p.includes(x))).concat(shuf(other.filter(x => !p.includes(x)))).slice(0, 3);
    const o = shuf([c, ...d]);
    return dir == 2
      ? { c, big: c.r.toUpperCase(), q: `Quel Hiragana correspond à ${c.r.toUpperCase()} ?`, o: o.map(x => x.k), a: c.k }
      : { c, big: c.k, q: t == 3 ? 'Lecture ? (réponse rapide)' : 'Quel est ce caractère ?', o: o.map(x => x.r.toUpperCase()), a: c.r.toUpperCase() };
  });
  runQuiz(qs, 'Hiragana', t == 3, [...new Set(p.map(c => c.s))]);
}
function courseQuiz(n) {
  const c = COURSES.find(x => x.n == n), V = c.sections.flatMap(s => s.v || []), all = COURSES.flatMap(x => x.sections.flatMap(s => s.v || []));
  const qs = shuf(V).slice(0, 10).map(r => ({ big: r[0], q: 'Que signifie cette expression ?', a: r[2],
    o: shuf([r[2], ...shuf([...new Set(all.map(x => x[2]))].filter(x => x != r[2])).slice(0, 3)]) }));
  (c.q || []).forEach(x => qs.push({ big: '', q: x[0], o: shuf(x.slice(1)), a: x[1] }));
  runQuiz(shuf(qs), 'Cours ' + n);
}
let Q;
function runQuiz(qs, label, fast, sets) { Q = { qs, i: 0, ok: 0, bad: [], label, fast, sets }; ask(); }
function ask() {
  const q = Q.qs[Q.i];
  app(`<div class="bar"><i style="width:${Q.i / Q.qs.length * 100}%"></i></div><p class="sub">Question ${Q.i + 1} / ${Q.qs.length}</p>
  <div class="big ${q.big.length > 3 ? 'sm' : ''}">${q.big}</div><h3 class="c">${q.q}</h3>
  <div class="opts">${q.o.map((o, j) => `<button onclick="pick(${j})">${'ABCD'[j]}. ${o}</button>`).join('')}</div><div id="fb" class="c"></div>`);
}
function pick(j) {
  const q = Q.qs[Q.i], ok = q.o[j] == q.a;
  document.querySelectorAll('.opts button').forEach((b, x) => { b.disabled = true; if (q.o[x] == q.a) b.classList.add('good'); else if (x == j) b.classList.add('bad'); });
  S[ok ? 'ok' : 'ko']++;
  if (q.c) { const s = S.c[q.c.k] = S.c[q.c.k] || { ok: 0, ko: 0 }; s[ok ? 'ok' : 'ko']++; }
  if (ok) Q.ok++; else Q.bad.push(q);
  save();
  $('#fb').innerHTML = `<p class="${ok ? 'g' : 'r'}">${ok ? '✅ Correct !' : '❌ Incorrect — réponse : ' + q.a}</p>` + (Q.fast && ok ? '' : '<button class="red" onclick="next()">Suivant</button>');
  if (Q.fast && ok) setTimeout(next, 600);
}
function next() { Q.i++; Q.i < Q.qs.length ? ask() : endQuiz(); }
function endQuiz() {
  const t = Q.qs.length, p = Math.round(Q.ok / t * 100);
  S.quiz.push({ d: Date.now(), s: Q.ok, t, l: Q.label });
  if (Q.sets) S.st = [...new Set([...S.st, ...Q.sets])];
  save();
  app(`<h1>🎉 Résultat</h1><div class="big">${Q.ok} / ${t}</div><h2 class="c" style="border:0">${p} %</h2>
  ${Q.bad.length ? `<h3>À revoir</h3><div class="chips">${Q.bad.map(q => `<span><b>${q.c ? q.c.k : q.big}</b>${q.c ? q.c.r : q.a}</span>`).join('')}</div>` : '<p class="c">Sans faute, bravo !</p>'}
  <div class="row"><button class="red" onclick="go('quizSetup')">Rejouer</button><button onclick="go('home')">Accueil</button></div>`);
}

// ---------- Mode tracé ----------
let T;
function trace(start) {
  if (!start) return app(`<h2>✍️ Mode tracé</h2>${picker()}<div class="row"><button class="red" onclick="trace(1)">Commencer</button></div>`);
  const p = chosen(); if (!p) return;
  T = { p, c: rnd(p), st: [], g: true }; tUI();
}
function tUI() {
  app(`<h2>Trace : <span class="jp">${T.c.k}</span> <small>(${T.c.r.toUpperCase()})</small></h2><canvas id="cv"></canvas>
  <div class="row"><button onclick="T.st.pop();tDraw()">Effacer</button><button onclick="T.st=[];tDraw()">Recommencer</button><button onclick="T.g=!T.g;tDraw()">Guide</button><button class="red" onclick="tNext()">Suivant</button></div>`);
  const cv = $('#cv'), w = Math.min(420, innerWidth - 40); cv.width = cv.height = w;
  const pt = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  let d = false;
  cv.onpointerdown = e => { d = true; cv.setPointerCapture(e.pointerId); T.st.push([pt(e)]); tDraw(); };
  cv.onpointermove = e => { if (d) { T.st[T.st.length - 1].push(pt(e)); tDraw(); } };
  cv.onpointerup = cv.onpointercancel = () => d = false;
  tDraw();
}
function tNext() { T.c = rnd(T.p.length > 1 ? T.p.filter(x => x.k != T.c.k) : T.p); T.st = []; tUI(); }
function tDraw() {
  const cv = $('#cv'), x = cv.getContext('2d'), w = cv.width;
  x.clearRect(0, 0, w, w);
  if (T.g) { x.fillStyle = '#e6e6e6'; x.font = `${w * .75}px "Noto Sans JP",sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(T.c.k, w / 2, w / 2); }
  x.strokeStyle = '#000'; x.lineWidth = 8; x.lineCap = x.lineJoin = 'round';
  T.st.forEach(s => { x.beginPath(); x.moveTo(...s[0]); s.forEach(p => x.lineTo(...p)); x.lineTo(...s[s.length - 1]); x.stroke(); });
}

// ---------- Progression ----------
function progress() {
  const done = c => S.c[c.k] && S.c[c.k].ok >= 2 && S.c[c.k].ok > S.c[c.k].ko;
  const pc = Math.round(ALL.filter(done).length / ALL.length * 100), n = S.ok + S.ko;
  const diff = c => S.c[c.k].ko - S.c[c.k].ok;
  const hard = ALL.filter(c => S.c[c.k] && S.c[c.k].ko > 0).sort((a, b) => diff(b) - diff(a)).slice(0, 12);
  app(`<h2>📊 Progression</h2><h3>Progression Hiragana : ${pc} %</h3><div class="bar"><i style="width:${pc}%"></i></div>
  <p>Quiz terminés : <b>${S.quiz.length}</b><br>Réussies : <b class="g">${S.ok}</b> · Ratées : <b class="r">${S.ko}</b>${n ? ` · Taux : <b>${Math.round(S.ok / n * 100)} %</b>` : ''}<br>
  Séries étudiées : <b>${S.st.length ? S.st.sort((a, b) => a - b).join(', ') : 'aucune'}</b></p>
  <h3>À retravailler</h3>${hard.length ? `<div class="chips">${hard.map(c => `<span><b>${c.k}</b>${c.r}</span>`).join('')}</div>` : '<p>Rien pour l\'instant.</p>'}
  <h3>Derniers scores</h3>${S.quiz.slice(-5).reverse().map(q => `<p>${new Date(q.d).toLocaleDateString('fr-FR')} · ${q.l} : <b>${q.s} / ${q.t}</b></p>`).join('') || '<p>Aucun quiz pour l\'instant.</p>'}
  <div class="row"><button onclick="if(confirm('Tout effacer ?')){localStorage.removeItem('jp');location.reload()}">Réinitialiser</button></div>`);
}

home();
