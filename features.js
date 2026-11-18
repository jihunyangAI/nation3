'use strict';
/* nation3 — 역사 이벤트, 보물, 황제·관직, 수전, 무장별 병력, 혈연, 혼인 */

const offNamed = n => G.officers.find(o => o.name === n);
const activeOff = n => { const o = offNamed(n); return o && !o.dead && !o.debut ? o : null; };
const isRulerNamed = n => { const o = activeOff(n); return !!(o && o.ruler && o.faction); };
const cityNamed = n => G.cities[CNAME.indexOf(n)];
const sameSide = (...l) => { const a = l.map(activeOff); return a.every(o => o && o.faction && o.faction === a[0].faction); };

// ===================== 혈연·의형제 =====================
const KIN = [['유비', '관우', '장비'], ['조조', '하후돈', '하후연', '조인', '조홍'], ['손견', '손책', '손권'], ['원소', '원술'], ['마등', '마초', '마대'], ['유언', '유장'], ['장각', '장보', '장량'], ['동탁', '이유']];
function isKin(a, b) {
  if (a === b) return false;
  return KIN.some(g => g.includes(a) && g.includes(b)) || G.bonds.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}
function rulerOf(f) { return G.officers.find(o => o.ruler && o.faction === f && !o.dead) || null; }
function kinAdj(o, f) {
  const mine = rulerOf(f), old = o.faction && o.faction !== f ? rulerOf(o.faction) : null;
  return (mine && isKin(o.name, mine.name) ? 0.3 : 0) - (old && isKin(o.name, old.name) ? 0.35 : 0);
}
function actBond(c, o) {
  const r = rulerOf(G.player);
  if (!r || r.city !== c.id) return fail('군주가 이 도시에 있어야 합니다.');
  if (o.ruler) return fail('군주 자신과는 결의할 수 없습니다.');
  if (isKin(o.name, r.name)) return fail('이미 형제나 다름없는 사이입니다.');
  if (o.loyal < 90) return fail(`충성이 90 이상이어야 합니다. (현재 ${o.loyal})`);
  if (G.bonds.filter(b => b.includes(r.name)).length >= 2) return fail('의형제는 두 명까지 맺을 수 있습니다.');
  if (c.gold < 500) return fail('금이 부족합니다. (500 필요)');
  c.gold -= 500; G.bonds.push([r.name, o.name]); o.loyal = 100;
  return ok(`${r.name}과(와) ${o.name}이(가) 의형제를 맺었습니다!`);
}

// ===================== 보물 =====================
// 이름, 능력치 번호, 상승치, 전장 이동 보너스, 주인 후보, 숨겨진 도시
const ITEMS = [
  ['적토마', 1, 3, 2, ['동탁', '여포', '관우'], '장안'], ['적로', 0, 2, 1, ['유비'], '양양'], ['절영', 0, 2, 1, ['조조'], '허창'],
  ['청룡언월도', 1, 5, 0, ['관우'], '하비'], ['장팔사모', 1, 5, 0, ['장비'], '하비'], ['방천화극', 1, 5, 0, ['여포'], '복양'], ['쌍고검', 1, 3, 0, ['유비'], '평원'],
  ['의천검', 0, 4, 0, ['조조'], '진류'], ['청강검', 1, 4, 0, [], '허창'], ['고정도', 1, 4, 0, ['손견', '손책', '손권'], '건업'],
  ['손자병법', 2, 5, 0, [], '오'], ['오자병법', 0, 5, 0, [], '업'], ['맹덕신서', 2, 4, 0, ['조조'], '진류'], ['태평요술서', 2, 6, 0, ['장각'], '업'],
  ['춘추좌씨전', 2, 3, 0, ['관우'], '낙양'], ['논어', 3, 4, 0, [], '북해'], ['사민월령', 3, 5, 0, [], '성도'], ['옥새', 4, 8, 0, [], '낙양'],
];
function giveItem(it, o) {
  if (it.hold !== null) { const p = G.officers[it.hold]; if (!p.dead) p.st[it.s] -= it.b; }
  it.hold = o.id; it.city = null; o.st[it.s] += it.b;
}
const itemsOf = o => G.items.filter(i => i.hold === o.id);
const itemMove = o => itemsOf(o).reduce((n, i) => n + i.mv, 0);
function searchItem(o, c) {
  const l = G.items.filter(i => i.hold === null && i.city === c.id);
  if (!l.length || Math.random() > (o.st[2] + o.st[3]) / 320) return null;
  const it = l[ri(0, l.length - 1)];
  giveItem(it, o);
  return it;
}
function sweepItems() {
  G.items.forEach(it => {
    if (it.hold !== null && G.officers[it.hold].dead) { it.hold = null; it.city = ri(0, G.cities.length - 1); }
  });
}

// ===================== 황제·작위·관직 =====================
const TITLES = [['태수', 0], ['자사', 3], ['주목', 5], ['장군', 7], ['대장군', 10], ['공', 14], ['왕', 18], ['황제', 22]];
const RANKS = [null, { n: '편장군', cmd: 1, need: 2, max: 99 }, { n: '중랑장', cmd: 2, need: 3, max: 6 }, { n: '장군', cmd: 3, need: 4, max: 3 }, { n: '대장군', cmd: 5, need: 5, max: 1 }];
const titleLv = f => G.title[f] || 0;
const titleName = f => TITLES[titleLv(f)][0];
const empCity = () => G.cities[G.emp];
const holdsEmperor = f => empCity().owner === f && titleLv(f) < 7;
function titleNeed(f) {
  const next = TITLES[titleLv(f) + 1];
  return next ? { name: next[0], cities: Math.max(1, next[1] - (holdsEmperor(f) ? 3 : 0)), gold: (titleLv(f) + 1) * 400 } : null;
}
function actTitle(f, c) {
  const n = titleNeed(f);
  if (!n) return fail('더 오를 자리가 없습니다.');
  if (factionCities(f).length < n.cities) return fail(`도시 ${n.cities}개가 필요합니다.`);
  if (c.gold < n.gold) return fail(`금이 부족합니다. (${n.gold} 필요)`);
  c.gold -= n.gold; G.title[f] = titleLv(f) + 1;
  G.officers.forEach(o => { if (o.faction === f && !o.ruler) o.loyal = clamp(o.loyal + 5, 0, 100); });
  if (n.name === '황제') FACTIONS.forEach(x => { if (x.id !== f && alive(x.id)) addRel(f, x.id, -15); });
  log(`${F[f].ruler}이(가) ${n.name}의 자리에 올랐습니다!`, 'big');
  return ok(`${F[f].ruler}: ${n.name}에 올랐습니다.`);
}
function setRank(o, r) {
  const old = RANKS[o.rank || 0], nw = RANKS[r];
  o.st[0] += (nw ? nw.cmd : 0) - (old ? old.cmd : 0); o.rank = r;
}
function actRank(o, r) {
  const k = RANKS[r], f = o.faction;
  if (titleLv(f) < k.need) return fail(`군주가 ${TITLES[k.need][0]} 이상이어야 합니다.`);
  if (o.ruler) return fail('군주에게는 줄 수 없습니다.');
  if ((o.rank || 0) === r) return fail('이미 그 관직에 있습니다.');
  if (G.officers.filter(x => x.faction === f && !x.dead && x.rank === r).length >= k.max) return fail(`${k.n} 자리가 찼습니다.`);
  setRank(o, r); o.loyal = clamp(o.loyal + 10, 0, 100);
  return ok(`${o.name}을(를) ${k.n}에 임명했습니다. (통솔 +${k.cmd})`);
}
function actEdict(o, kind, t) {
  const c = G.cities[o.city], f = o.faction;
  if (empCity().owner !== f) return fail('황제를 모시고 있어야 합니다.');
  if (c.gold < 500) return fail('금이 부족합니다. (500 필요)');
  if (!alive(t) || t === f) return fail('대상이 없습니다.');
  c.gold -= 500; o.acted = true;
  if (kind === 'peace') {
    if (isAllied(f, t)) return ok(`${F[t].name}과(와)는 이미 협정 중입니다.`);
    G.allies.push({ a: f, b: t, until: now() + 12, kind: 'truce' });
    return ok(`칙명으로 ${F[t].name}과(와) 12개월간 정전했습니다.`);
  }
  FACTIONS.forEach(x => { if (x.id !== t && alive(x.id)) addRel(x.id, t, -12); });
  factionCities(t).forEach(x => { x.loyal = Math.max(0, x.loyal - 5); });
  return ok(`칙명으로 ${F[t].name}을(를) 역적으로 선포했습니다!`);
}

// ===================== 혼인 =====================
function actMarriage(o, t) {
  const c = G.cities[o.city], f = o.faction, key = relKey(f, t);
  if (G.marry.includes(key)) return fail('이미 혼인 관계입니다.');
  if (getRel(f, t) < 55) return fail(`우호가 55 이상이어야 합니다. (현재 ${getRel(f, t)})`);
  if (c.gold < 1000) return fail('금이 부족합니다. (1,000 필요)');
  c.gold -= 1000; o.acted = true;
  if (Math.random() >= clamp(0.35 + getRel(f, t) / 200 + rulerCharm(f) / 500, 0.1, 0.92)) { addRel(f, t, -3); return ok(`${F[t].name}이(가) 혼담을 거절했습니다.`); }
  G.marry.push(key);
  G.allies = G.allies.filter(x => relKey(x.a, x.b) !== key);
  G.allies.push({ a: f, b: t, until: now() + 60, kind: 'ally' });
  addRel(f, t, 20);
  return ok(`${F[t].name}과(와) 혼인을 맺었습니다! (5년 동맹)`);
}

// ===================== 수전 =====================
const NAVAL_ROADS = ['강주-영안', '영안-강릉', '강하-시상', '시상-건업', '건업-오', '수춘-건업', '양양-강릉', '양양-강하', '강릉-장사', '장사-시상', '수춘-하비'];
const navalKey = (a, b) => [a, b].sort().join('-');
const NAVAL_SET = new Set(NAVAL_ROADS.map(r => navalKey(...r.split('-'))));
const PORTS = new Set([...NAVAL_ROADS.flatMap(r => r.split('-')), '북해']);
const isNavalRoad = (a, b) => NAVAL_SET.has(navalKey(a.name, b.name));
const NAVY = { 주유: 20, 감녕: 18, 채모: 18, 주태: 16, 여몽: 16, 황개: 16, 한당: 14, 정보: 14, 손견: 12, 육손: 12, 손책: 10, 문빙: 10, 황조: 10, 손권: 8, 노숙: 8, 제갈량: 5 };
const navyOf = o => clamp(Math.round((o.st[0] + o.st[2]) / 2 + (NAVY[o.name] === undefined ? -8 : NAVY[o.name])), 20, 110);
function applyNaval(b) {
  const from = G.cities[b.from], to = G.cities[b.to];
  if (!isNavalRoad(from, to)) return;
  b.naval = true;
  [[b.att, from], [b.def, to]].forEach(([a, c]) => {
    a.shipF = 0.75 + 0.25 * Math.min(1, c.ships / Math.max(1, a.troops));
    const nv = a.offs.length ? Math.max(...a.offs.map(navyOf)) : 35;
    a.cmd = Math.round(nv * a.shipF); a.war = Math.round((a.war + nv) / 2 * a.shipF);
  });
}
function actShips(o) {
  const c = G.cities[o.city];
  if (!PORTS.has(c.name)) return fail(`${c.name}에는 조선소를 둘 물길이 없습니다.`);
  if (c.gold < 300) return fail('금이 부족합니다. (300 필요)');
  const n = 500 + o.st[3] * 10;
  c.gold -= 300; c.ships += n; o.acted = true;
  return ok(`${o.name}: 전선 ${num(n)}척분을 건조했습니다.`);
}

// ===================== 무장별 병력 =====================
const capOf = o => o.st[0] * 120;
const commandCap = offs => offs.reduce((n, o) => n + capOf(o), 0);
function syncMen(c) {
  const l = cityOfficers(c.id);
  if (!l.length) return;
  if (!c.manual) {
    const sum = commandCap(l) || 1;
    l.forEach(o => { o.men = Math.min(capOf(o), Math.floor(c.troops * capOf(o) / sum / 100) * 100); });
    return;
  }
  l.forEach(o => { o.men = Math.min(o.men || 0, capOf(o)); });
  const total = l.reduce((n, o) => n + o.men, 0);
  if (total > c.troops) l.forEach(o => { o.men = Math.floor(o.men * c.troops / total / 100) * 100; });
}

// ===================== 역사 이벤트 =====================
const EVQ = [];
function crown(f, name) {
  const o = activeOff(name);
  if (!o) return;
  const cur = rulerOf(f), home = cur ? cur.city : factionCities(f)[0] && factionCities(f)[0].id;
  if (o.faction !== f) { o.faction = f; if (home !== undefined) o.city = home; }
  if (cur) cur.ruler = false;
  o.ruler = true; o.loyal = 100; F[f].ruler = name;
}
const notPlayer = n => { const o = activeOff(n); return o && o.faction !== G.player; };
const EVENTS = [
  { id: 'oath', when: () => G.year <= 189 && sameSide('유비', '관우', '장비'), run() {
    G.bonds.push(['유비', '관우'], ['유비', '장비'], ['관우', '장비']);
    ['관우', '장비'].forEach(n => { offNamed(n).loyal = 100; });
    return { title: '도원결의', scene: 'peach', text: '복숭아꽃 흐드러진 동산에서 유비, 관우, 장비가 하늘에 맹세했다. "한날한시에 태어나지는 못했어도, 한날한시에 죽기를 원하노라."', who: '유비' };
  } },
  { id: 'jiao', when: () => G.year === 184 && G.month >= 10 && isRulerNamed('장각') && notPlayer('장각'), run() {
    killOfficer(offNamed('장각'), '병으로 세상을 떠났습니다');
    factionCities('huang').forEach(c => { c.loyal = Math.max(0, c.loyal - 12); c.troops = Math.round(c.troops * 0.85); });
    return { title: '큰 스승의 죽음', scene: 'moon', text: '황건의 수령 장각이 병으로 쓰러졌다. 누런 두건의 무리가 크게 흔들린다.' };
  } },
  { id: 'hare', when: () => G.year <= 191 && sameSide('동탁', '여포'), run() {
    giveItem(G.items.find(i => i.name === '적토마'), offNamed('여포')); offNamed('여포').loyal = 90;
    return { title: '적토마', scene: 'court', text: '동탁이 하루에 천 리를 달리는 명마 적토마를 내리자, 여포가 그의 수하로 들어왔다.' };
  } },
  { id: 'move', when: () => G.year >= 190 && G.emp === CNAME.indexOf('낙양') && cityNamed('낙양').owner === 'dong' && cityNamed('장안').owner === 'dong', run() {
    const c = cityNamed('낙양');
    G.emp = CNAME.indexOf('장안'); c.pop = Math.round(c.pop * 0.6); c.wall = Math.max(0, c.wall - 15); c.loyal = Math.max(0, c.loyal - 20);
    return { title: '장안 천도', scene: 'fire', text: '동탁이 황제를 끌고 장안으로 옮겼다. 낙양은 불길에 휩싸였다.' };
  } },
  { id: 'chain', when: () => G.year >= 192 && isRulerNamed('동탁') && notPlayer('동탁') && sameSide('동탁', '여포') && factionCities('dong').length > 1, run() {
    const lu = offNamed('여포'), city = G.cities[lu.city], others = factionCities('dong').filter(c => c !== city);
    if (!alive('lu') && city.owner === 'dong') {
      const stay = cityOfficers(city.id).filter(o => o !== lu && o.name !== '동탁');
      city.owner = 'lu'; city.gov = null; lu.faction = 'lu'; lu.ruler = true; lu.loyal = 100; F.lu.ruler = '여포';
      stay.forEach(o => { if (o.name === '장료' || o.name === '고순') o.faction = 'lu'; else o.city = others[0].id; });
      const d = offNamed('동탁'); if (d.city === city.id) d.city = others[0].id;
    } else { lu.faction = null; }
    killOfficer(offNamed('동탁'), '여포의 창에 쓰러졌습니다');
    return { title: '연환계', scene: 'moon', text: '왕윤의 계책에 초선이 나섰고, 질투에 눈먼 여포가 끝내 양아버지 동탁을 찔렀다.' };
  } },
  { id: 'east', when: () => G.year >= 196 && G.emp === CNAME.indexOf('장안') && cityNamed('허창').owner !== 'dong', run() {
    G.emp = CNAME.indexOf('허창');
    const o = cityNamed('허창').owner;
    return { title: '황제의 귀환', scene: 'court', text: `황제가 고생 끝에 장안을 벗어나 허창에 닿았다.${o ? ` ${F[o].name}이(가) 황제를 맞아들였다.` : ''}` };
  } },
  { id: 'sunce', when: () => G.year >= 200 && isRulerNamed('손책') && notPlayer('손책'), run() {
    if (activeOff('손권')) crown('sun', '손권');
    killOfficer(offNamed('손책'), '자객의 화살에 세상을 떠났습니다');
    if (activeOff('손권') && !rulerOf('sun')) crown('sun', '손권');
    return { title: '소패왕의 죽음', scene: 'moon', text: '강동의 호랑이 손책이 젊은 나이에 쓰러졌다. 아우 손권이 뒤를 잇는다.' };
  } },
  { id: 'guandu', when: () => G.year >= 200 && G.month >= 10 && alive('cao') && alive('yuan') && factionCities('cao').some(c => ADJ[c.id].some(i => G.cities[i].owner === 'yuan')), run() {
    const c = factionCities('yuan').sort((a, b) => b.food - a.food)[0];
    c.food = Math.round(c.food * 0.35); factionCities('yuan').forEach(x => { x.loyal = Math.max(0, x.loyal - 6); });
    return { title: '오소의 불길', scene: 'fire', text: `허유의 밀고로 ${F.cao.name}이 ${F.yuan.name}의 군량고를 습격했다. ${c.name}의 군량이 잿더미가 되었다.` };
  } },
  { id: 'cottage', repeat: true, when: () => G.year >= 198 && !G.ev.cottageEnd && isRulerNamed('유비') && (() => { const k = activeOff('제갈량'); return k && !k.faction; })(), run() {
    const liu = offNamed('유비'), f = liu.faction;
    const go = () => {
      G.ev.visits = (G.ev.visits || 0) + 1;
      if (G.ev.visits < 3) return;
      const k = offNamed('제갈량');
      k.faction = f; k.city = liu.city; k.loyal = 100; G.ev.cottageEnd = true;
      log(`제갈량이 ${F[f].name}에 출사했습니다!`, 'big');
    };
    const n = (G.ev.visits || 0) + 1;
    const text = ['융중의 초가에 와룡이 산다는 말을 듣고 유비가 길을 나서려 한다.', '눈보라를 뚫고 다시 찾아가려 한다. 관우와 장비는 못마땅한 얼굴이다.', '세 번째 길이다. 이번에는 와룡이 낮잠에서 깨어날까?'][n - 1];
    return { title: `삼고초려 (${n}/3)`, scene: 'cottage', text, who: '유비', choices: [{ label: '찾아간다', fn: go }, { label: '그만둔다', fn: () => { G.ev.cottageEnd = true; } }] };
  } },
  { id: 'pact', when: () => G.year >= 207 && alive('cao') && alive('sun') && alive('liu') && factionCities('cao').length >= 10, run() {
    G.allies = G.allies.filter(x => relKey(x.a, x.b) !== relKey('sun', 'liu'));
    G.allies.push({ a: 'sun', b: 'liu', until: now() + 36, kind: 'ally' }); addRel('sun', 'liu', 25);
    return { title: '손유 동맹', scene: 'court', text: '거대한 적 앞에서 손씨와 유비가 손을 잡았다. 강동의 뜻이 하나로 모인다.' };
  } },
  { id: 'cliff', when: () => G.ev.pact && G.year >= 208 && G.month >= 11 && alive('cao') && alive('sun') && factionCities('cao').some(c => PORTS.has(c.name) || ADJ[c.id].some(i => PORTS.has(G.cities[i].name))), run() {
    const rate = G.player === 'cao' ? 0.75 : 0.5;
    factionCities('cao').filter(c => PORTS.has(c.name) || ADJ[c.id].some(i => G.cities[i].owner === 'sun' || G.cities[i].owner === 'liu')).forEach(c => { c.troops = Math.round(c.troops * rate); c.ships = Math.round(c.ships * 0.2); });
    return { title: '적벽대전', scene: 'fire', text: '동남풍이 불자 황개의 불배가 돌진했다. 쇠사슬에 묶인 함대가 강 위에서 타오른다.' };
  } },
  { id: 'caodie', when: () => G.year >= 220 && isRulerNamed('조조') && notPlayer('조조'), run() {
    killOfficer(offNamed('조조'), '병으로 세상을 떠났습니다');
    return { title: '난세의 간웅, 지다', scene: 'moon', text: '천하를 뒤흔든 조조가 낙양에서 눈을 감았다.' };
  } },
  { id: 'liudie', when: () => G.year >= 223 && isRulerNamed('유비') && notPlayer('유비'), run() {
    killOfficer(offNamed('유비'), '백제성에서 세상을 떠났습니다');
    return { title: '백제성의 유언', scene: 'moon', text: '유비가 뒷일을 맡기고 숨을 거두었다.' };
  } },
];
function checkEvents() {
  for (const e of EVENTS) {
    if (G.over || (G.ev[e.id] && !e.repeat) || !e.when()) continue;
    G.ev[e.id] = true;
    const r = e.run();
    log(`【${r.title}】 ${r.text}`, 'big');
    const live = UI && G.player;
    if (r.choices && !(live && r.who && activeOff(r.who) && activeOff(r.who).faction === G.player)) { r.choices[0].fn(); r.choices = null; }
    if (live) EVQ.push(r);
  }
}
const SCENES = {
  peach: '<rect width="280" height="90" fill="#cfe6f0"/><rect y="66" width="280" height="24" fill="#9dbb78"/><rect x="60" y="34" width="8" height="36" fill="#6b4a2c"/><rect x="205" y="30" width="8" height="40" fill="#6b4a2c"/><circle cx="64" cy="28" r="24" fill="#f3a9c0"/><circle cx="209" cy="24" r="26" fill="#f7bdd0"/><circle cx="118" cy="60" r="6" fill="#e8c39e"/><circle cx="140" cy="58" r="6" fill="#c9553f"/><circle cx="162" cy="60" r="6" fill="#3a3028"/><rect x="112" y="66" width="12" height="14" fill="#3f8a55"/><rect x="134" y="64" width="12" height="16" fill="#2f6e3e"/><rect x="156" y="66" width="12" height="14" fill="#2b2b33"/>',
  fire: '<rect width="280" height="90" fill="#2a1420"/><rect y="62" width="280" height="28" fill="#1f3a52"/><path d="M30 64l14-14 30 0 14 14zM120 64l14-14 30 0 14 14zM205 64l12-12 28 0 12 12z" fill="#3a2a1c"/><path d="M45 50c-6-16 8-18 6-34 14 10 22 20 14 34zM135 50c-8-18 10-22 8-40 16 14 24 26 14 40zM220 52c-6-14 6-18 6-30 12 10 18 20 12 30z" fill="#f07a2c"/><path d="M52 50c-2-8 4-10 4-16 6 6 8 10 5 16zM143 50c-2-10 5-12 5-20 7 7 9 13 6 20zM226 52c-2-7 3-9 3-14 5 5 7 9 4 14z" fill="#ffd25a"/>',
  cottage: '<rect width="280" height="90" fill="#dfe8ee"/><rect y="66" width="280" height="24" fill="#f6f8fa"/><path d="M96 46l44-26 44 26z" fill="#fff" stroke="#8d8a80"/><rect x="108" y="46" width="64" height="24" fill="#a58a62"/><rect x="133" y="54" width="14" height="16" fill="#4d3a26"/><circle cx="36" cy="16" r="2" fill="#fff"/><circle cx="60" cy="34" r="2" fill="#fff"/><circle cx="216" cy="22" r="2" fill="#fff"/><circle cx="244" cy="44" r="2" fill="#fff"/><circle cx="196" cy="10" r="2" fill="#fff"/>',
  court: '<rect width="280" height="90" fill="#7a2e26"/><rect x="50" y="34" width="180" height="40" fill="#b5462f"/><path d="M34 34l106-24 106 24z" fill="#d9b25a"/><rect x="74" y="34" width="8" height="40" fill="#e9dfc6"/><rect x="198" y="34" width="8" height="40" fill="#e9dfc6"/><rect x="124" y="50" width="32" height="24" fill="#2b1a14"/><rect y="74" width="280" height="16" fill="#c9b78e"/>',
  moon: '<rect width="280" height="90" fill="#141c30"/><circle cx="216" cy="26" r="16" fill="#efe6c4"/><circle cx="208" cy="22" r="15" fill="#141c30"/><path d="M0 90l50-34 40 20 50-30 54 28 40-16 46 32z" fill="#0a0f1c"/><circle cx="50" cy="20" r="1.500" fill="#fff"/><circle cx="110" cy="30" r="1.500" fill="#fff"/><circle cx="150" cy="14" r="1.500" fill="#fff"/>',
};
async function playEvents() {
  while (EVQ.length && UI && !G.over) {
    const e = EVQ.shift();
    await new Promise(res => {
      window._ev = i => { if (e.choices && e.choices[i]) e.choices[i].fn(); closeModal(); res(); };
      const btn = e.choices ? e.choices.map((c, i) => `<button onclick="_ev(${i})">${c.label}</button>`).join('') : '<button onclick="_ev(0)">계속</button>';
      openModal(`<svg class="scene" viewBox="0 0 280 90" aria-hidden="true">${SCENES[e.scene]}</svg><h2 style="margin-top:10px">${e.title}</h2><p>${e.text}</p><div class="row">${btn}</div>`);
    });
  }
}

// ===================== 시작 설정·월별·AI =====================
function setupFeatures(sc) {
  Object.assign(G, { graceUntil: now() + 12, items: [], title: {}, bonds: [], marry: [], ev: {}, emp: CNAME.indexOf(sc.year <= 189 ? '낙양' : sc.year <= 195 ? '장안' : '허창') });
  G.cities.forEach(c => { c.ships = c.owner && PORTS.has(c.name) ? 9000 : 0; c.manual = false; });
  G.officers.forEach(o => { o.rank = 0; o.men = 0; });
  ITEMS.forEach(([name, s, b, mv, who, home], id) => {
    const it = { id, name, s, b, mv, hold: null, city: CNAME.indexOf(home) };
    G.items.push(it);
    const o = who.map(activeOff).find(x => x && x.faction);
    if (o) giveItem(it, o);
  });
  FACTIONS.forEach(f => {
    const n = factionCities(f.id).length;
    if (n) G.title[f.id] = f.id === 'han' ? 6 : TITLES.reduce((lv, t, i) => (i < 6 && n >= t[1] ? i : lv), 0);
  });
}
function featureMonth() {
  sweepItems();
  G.officers.forEach(o => {
    if (o.dead || !o.faction || o.ruler) return;
    const r = rulerOf(o.faction);
    if (r && isKin(o.name, r.name)) o.loyal = Math.max(o.loyal, 90);
  });
  const e = empCity();
  if (e.owner && titleLv(e.owner) < 7) { e.gold += 150; e.loyal = clamp(e.loyal + 1, 0, 100); }
  checkEvents();
}
function featureAI(f) {
  const cs = factionCities(f), rich = cs.reduce((a, b) => (b.gold > a.gold ? b : a));
  const n = titleNeed(f);
  if (n && n.name !== '황제' && cs.length >= n.cities && rich.gold >= n.gold + 800) actTitle(f, rich);
  cs.forEach(c => { if (PORTS.has(c.name) && c.ships < 6000 && c.gold > 1500) { c.gold -= 300; c.ships += 800; } syncMen(c); });
  const top = G.officers.filter(o => o.faction === f && !o.dead && !o.ruler && !o.rank).sort((a, b) => b.st[0] - a.st[0])[0];
  if (top) for (let r = 4; r >= 1; r--) { if (actRank(top, r).ok) break; }
  const free = G.officers.find(o => o.faction === f && !o.dead && !o.acted && !o.ruler && G.cities[o.city].gold >= 1800);
  if (free && Math.random() < 0.02) {
    const t = FACTIONS.filter(x => x.id !== f && x.id !== G.player && alive(x.id)).sort((a, b) => getRel(f, b.id) - getRel(f, a.id))[0];
    if (t) { const r = actMarriage(free, t.id); if (r.msg.includes('맺었')) log(`${F[f].name}: ${r.msg}`, 'sys'); }
  }
}

// ===================== 화면 =====================
function officerExtra(o) {
  const items = itemsOf(o).map(i => `${i.name}(${ST[i.s]}+${i.b}${i.mv ? `, 이동+${i.mv}` : ''})`);
  const kin = G.officers.filter(x => !x.dead && !x.debut && isKin(o.name, x.name)).map(x => x.name);
  return `<p class="dim">관직: ${o.rank ? RANKS[o.rank].n : '없음'} · 지휘 한도 ${num(capOf(o))} · 수전 ${navyOf(o)}<br>보물: ${items.join(', ') || '없음'}<br>혈연·의형제: ${kin.join(', ') || '없음'}</p>`;
}
function treasureForm() {
  const mine = G.items.filter(i => i.hold !== null && G.officers[i.hold].faction === G.player);
  const offs = G.officers.filter(o => o.faction === G.player && !o.dead);
  openModal(`<h2>보물</h2><p class="dim">보물은 탐색으로 찾거나 무장에게서 얻습니다. 내리면 충성이 15 오릅니다. 세상의 보물 ${G.items.length}점 중 ${mine.length}점 보유.</p>
    ${mine.length ? `<label>보물 <select id="it_i">${mine.map(i => `<option value="${i.id}">${i.name} (${ST[i.s]}+${i.b}) — ${G.officers[i.hold].name}</option>`).join('')}</select></label>
    <label>받을 무장 <select id="it_o">${offs.map(o => `<option value="${o.id}">${o.name}</option>`).join('')}</select></label>
    <div class="row"><button onclick="grantItem()">하사</button><button onclick="closeModal()">닫기</button></div>` : '<button class="wide" onclick="closeModal()">닫기</button>'}`);
}
function grantItem() {
  const it = G.items[+$('it_i').value], o = G.officers[+$('it_o').value];
  if (it.hold === o.id) return alertLine('이미 그 무장이 가지고 있습니다.');
  giveItem(it, o);
  if (!o.ruler) o.loyal = clamp(o.loyal + 15, 0, 100);
  done(ok(`${o.name}에게 ${it.name}을(를) 내렸습니다.`));
}
function titleForm(c) {
  const n = titleNeed(G.player), l = cityOfficers(c.id).filter(o => !o.ruler);
  openModal(`<h2>작위·관직</h2><p>군주 작위: <b>${titleName(G.player)}</b>${empCity().owner === G.player ? ' · 황제를 모시는 중 (필요 도시 -3)' : ''}</p>
    ${n ? `<p class="dim">다음 작위 ${n.name}: 도시 ${n.cities}개, 금 ${num(n.gold)}</p><button class="wide" onclick="done(actTitle(G.player, G.cities[sel]))">${n.name}에 오르기</button>` : ''}
    ${l.length ? `<label>무장 <select id="rk_o">${l.map(o => `<option value="${o.id}">${o.name} (${o.rank ? RANKS[o.rank].n : '무관직'})</option>`).join('')}</select></label>
    <label>관직 <select id="rk_r">${RANKS.slice(1).map((k, i) => `<option value="${i + 1}">${k.n} (통솔 +${k.cmd}, 군주 ${TITLES[k.need][0]} 이상)</option>`).join('')}</select></label>
    <div class="row"><button onclick="done(actRank(G.officers[+$('rk_o').value], +$('rk_r').value))">임명</button><button onclick="closeModal()">닫기</button></div>` : '<button class="wide" onclick="closeModal()">닫기</button>'}`);
}
function menForm(c) {
  const l = cityOfficers(c.id);
  if (!l.length) { flash = '배속할 무장이 없습니다.'; return render(); }
  syncMen(c);
  openModal(`<h2>병력 배속 — 총 ${num(c.troops)}</h2><p class="dim">무장마다 통솔 ×120명까지 지휘합니다. 전투에서는 배속 비율대로 부대가 나뉩니다.</p>
    ${l.map(o => `<label>${o.name} <input id="mn_${o.id}" type="number" min="0" max="${capOf(o)}" step="100" value="${o.men}"> / ${num(capOf(o))}</label>`).join('')}
    <div class="row"><button onclick="saveMen()">저장</button><button onclick="autoMen()">자동 배분</button><button onclick="closeModal()">취소</button></div>`);
}
function saveMen() {
  const c = G.cities[sel], l = cityOfficers(c.id);
  l.forEach(o => { o.men = clamp(Math.floor((+$('mn_' + o.id).value || 0) / 100) * 100, 0, capOf(o)); });
  if (l.reduce((n, o) => n + o.men, 0) > c.troops) return alertLine(`도시 병력 ${num(c.troops)}을 넘었습니다.`);
  c.manual = true; done(ok(`${c.name}의 병력을 배속했습니다.`));
}
function autoMen() { const c = G.cities[sel]; c.manual = false; syncMen(c); done(ok('병력을 자동으로 배분했습니다.')); }

Object.assign(EXTRA_CMD, {
  ships: (c, offs) => pickOfficer('조선 — 금 300', offs, '내정이 높을수록 많이 건조합니다. 물길이 닿는 도시에서만 가능합니다.', o => done(actShips(o))),
  edict: (c, offs) => {
    if (empCity().owner !== G.player) { flash = `황제를 모셔야 합니다. 현재 황제는 ${empCity().name}에 있습니다.`; return render(); }
    pickOfficer('칙명 — 금 500', offs, '황제의 이름으로 명을 내립니다.', o => {
      openModal(`<h2>칙명 — ${o.name}</h2><label>대상 <select id="ed_f">${FACTIONS.filter(f => f.id !== G.player && alive(f.id)).map(f => `<option value="${f.id}">${f.name}</option>`).join('')}</select></label>
        <div class="row"><button class="atk" onclick="done(actEdict(G.officers[${o.id}],'rebel',$('ed_f').value))">역적 선포</button><button onclick="done(actEdict(G.officers[${o.id}],'peace',$('ed_f').value))">정전 명령</button><button onclick="closeModal()">취소</button></div>`);
    });
  },
});
Object.assign(FREE_CMD, {
  treasure: () => treasureForm(),
  title: c => titleForm(c),
  men: c => menForm(c),
  bond(c) {
    const l = cityOfficers(c.id).filter(o => !o.ruler);
    if (!l.length) { flash = '결의할 무장이 없습니다.'; return render(); }
    pickOfficer('의형제 결의 — 금 500', l, '군주와 같은 도시에 있고 충성 90 이상인 무장과 맺습니다. 의형제는 배신하지 않고, 전장에서 곁에 있으면 강해집니다.', o => done(actBond(c, o)));
  },
});
Object.assign(CMD_ICONS, {
  ships: '<path d="M1 10h14l-2.500 4h-9z" fill="#8a5a2c" stroke="#4d3218"/><rect x="7.300" y="1" width="1.400" height="9" fill="#5f3d1c"/><path d="M9 2l5 6H9zM7 3L3 8h4z" fill="#f0e8d4"/>',
  edict: '<rect x="2" y="3" width="12" height="10" fill="#e0b84a" stroke="#8f6c1e"/><path d="M4 6h8M4 8.500h8M4 11h4" stroke="#7a241b"/><path d="M1 1h14v2.500H1zM1 12.500h14V15H1z" fill="#8a2d22"/>',
  treasure: '<rect x="1.500" y="7" width="13" height="7.500" fill="#8a5a2c" stroke="#4d3218"/><path d="M1.500 7a6.500 5 0 0 1 13 0z" fill="#a8743c" stroke="#4d3218"/><rect x="6.500" y="6" width="3" height="3.500" fill="#e0b84a" stroke="#8f6c1e" stroke-width=".6"/>',
  title: '<path d="M2 13L1 4l4 3.500L8 2l3 5.500L15 4l-1 9z" fill="#e0b84a" stroke="#8f6c1e"/><circle cx="8" cy="10" r="1.500" fill="#c9412f"/>',
  men: '<circle cx="4.500" cy="5" r="2.300" fill="#e8c39e"/><circle cx="11.500" cy="5" r="2.300" fill="#e8c39e"/><circle cx="8" cy="6.500" r="2.600" fill="#f0d2b0"/><path d="M1 14c0-3 1.500-5 3.500-5M15 14c0-3-1.500-5-3.500-5" stroke="#4f7fe0" stroke-width="2" fill="none"/><path d="M3.500 15c0-4 2-6 4.500-6s4.500 2 4.500 6z" fill="#6f9bf0"/>',
  bond: '<path d="M8 14C3 10.500 1 8 1 5.300 1 3 3 1.800 4.700 2 6.300 2.200 7.400 3.300 8 4.500 8.600 3.300 9.700 2.200 11.300 2 13 1.800 15 3 15 5.300 15 8 13 10.500 8 14z" fill="#e0603f" stroke="#8a2d22"/>',
});
