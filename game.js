'use strict';
/* nation3 — 삼국시대 배경의 오리지널 턴제 전략 게임 */

// ===================== 데이터 =====================
const FACTIONS = [
  { id: 'cao',   name: '조조군',   ruler: '조조',   color: '#4f7fe0', note: '중원의 강자. 인재가 풍부하다. (보통)' },
  { id: 'liu',   name: '유비군',   ruler: '유비',   color: '#3fa866', note: '도시는 하나뿐이지만 맹장이 있다. (어려움)' },
  { id: 'sun',   name: '손책군',   ruler: '손책',   color: '#d9503f', note: '강동의 호랑이. 후방이 안전하다. (쉬움)' },
  { id: 'yuan',  name: '원소군',   ruler: '원소',   color: '#c9a227', note: '하북 최대 세력. 병력이 많다. (쉬움)' },
  { id: 'biao',  name: '유표군',   ruler: '유표',   color: '#9166cc', note: '형주의 부유한 땅. 장수가 부족하다. (보통)' },
  { id: 'zhang', name: '유장군',   ruler: '유장',   color: '#2aa3a3', note: '험준한 익주. 군주가 유약하다. (보통)' },
  { id: 'ma',    name: '마등군',   ruler: '마등',   color: '#b5651d', note: '서량의 기병. 땅이 척박하다. (어려움)' },
  { id: 'lu',    name: '여포군',   ruler: '여포',   color: '#d4488f', note: '천하무쌍. 사방이 적이다. (매우 어려움)' },
  { id: 'gong',  name: '공손찬군', ruler: '공손찬', color: '#7d8a99', note: '북방의 백마장군. 원소와 맞닿아 있다. (어려움)' },
  { id: 'han',   name: '한 조정',  ruler: '하진',   color: '#c4c9d6', note: '기울어 가는 황실.' },
  { id: 'huang', name: '황건군',   ruler: '장각',   color: '#f0dc3c', note: '누런 두건의 봉기군.' },
  { id: 'dong',  name: '동탁군',   ruler: '동탁',   color: '#5b3a8c', note: '낙양을 장악한 폭군.' },
  { id: 'shu',   name: '원술군',   ruler: '원술',   color: '#e08a2e', note: '남양의 야심가.' },
  { id: 'tao',   name: '도겸군',   ruler: '도겸',   color: '#74b816', note: '서주의 온건한 태수.' },
];
const F = Object.fromEntries(FACTIONS.map(f => [f.id, f]));

// 이름, x, y, 세력, 인구(천), 농업, 상업, 성벽, 병력
const CITY_DEF = [
  ['북평', 800,  70, 'gong', 140, 45, 40, 50, 14000],
  ['남피', 700, 140, 'yuan', 220, 60, 55, 55, 16000],
  ['업',   610, 195, 'yuan', 260, 65, 60, 70, 18000],
  ['평원', 725, 215, 'yuan', 150, 50, 45, 40,  8000],
  ['진양', 510, 130, 'yuan', 120, 40, 35, 50,  8000],
  ['복양', 655, 270, 'lu',   180, 55, 50, 50, 15000],
  ['진류', 585, 305, 'cao',  230, 60, 60, 55, 16000],
  ['허창', 560, 365, 'cao',  200, 60, 55, 50,  9000],
  ['낙양', 480, 295, null,   160, 45, 55, 60,     0],
  ['장안', 365, 290, null,   170, 50, 55, 65,     0],
  ['천수', 265, 265, 'ma',    90, 35, 30, 45,  9000],
  ['무위', 180, 170, 'ma',    80, 30, 30, 40, 13000],
  ['한중', 320, 365, null,   130, 55, 40, 60,     0],
  ['성도', 230, 465, 'zhang',280, 75, 60, 60, 17000],
  ['강주', 325, 510, 'zhang',160, 55, 45, 50,  9000],
  ['영안', 410, 455, null,    80, 35, 30, 55,     0],
  ['완',   500, 385, null,   170, 55, 50, 45,     0],
  ['양양', 500, 445, 'biao', 250, 65, 65, 65, 16000],
  ['강릉', 475, 515, 'biao', 200, 60, 55, 55, 10000],
  ['장사', 525, 585, 'biao', 170, 60, 45, 45,  9000],
  ['강하', 585, 485, 'biao', 150, 50, 50, 50,  9000],
  ['여남', 615, 420, null,   180, 60, 45, 40,     0],
  ['수춘', 690, 400, null,   200, 60, 55, 55,     0],
  ['하비', 745, 320, 'liu',  210, 60, 60, 55, 13000],
  ['북해', 800, 235, null,   130, 50, 45, 45,     0],
  ['건업', 765, 455, 'sun',  220, 60, 65, 60, 15000],
  ['오',   825, 510, 'sun',  190, 65, 60, 45,  8000],
  ['시상', 665, 535, 'sun',  140, 50, 45, 50,  9000],
];
CITY_DEF.forEach(d => { [d[1], d[2]] = P(...CITY_LL[d[0]]); });
const CNAME = CITY_DEF.map(d => d[0]);

const ROADS = ['북평-남피', '북평-진양', '남피-업', '남피-평원', '업-평원', '업-진양', '업-복양', '평원-북해',
  '평원-복양', '진양-낙양', '복양-진류', '복양-하비', '진류-허창', '진류-낙양', '허창-낙양', '허창-완',
  '허창-여남', '낙양-장안', '낙양-완', '장안-천수', '장안-한중', '천수-무위', '천수-한중', '한중-성도',
  '성도-강주', '강주-영안', '영안-강릉', '완-양양', '양양-강릉', '양양-강하', '강릉-장사', '장사-시상',
  '강하-시상', '강하-여남', '여남-수춘', '수춘-하비', '수춘-건업', '하비-북해', '건업-오', '건업-시상'];
const ADJ = CNAME.map(() => []);
ROADS.forEach(r => {
  const [a, b] = r.split('-').map(n => CNAME.indexOf(n));
  if (a < 0 || b < 0) throw new Error('잘못된 길: ' + r);
  ADJ[a].push(b); ADJ[b].push(a);
});

const ST = ['통솔', '무력', '지략', '내정', '인덕'];
// 이름, 세력(null=재야), 도시, 통솔, 무력, 지략, 내정, 인덕
const OFF_DEF = [
  ['조조', 'cao', '진류', 96, 72, 92, 94, 95], ['하후돈', 'cao', '진류', 88, 90, 58, 60, 78],
  ['하후연', 'cao', '진류', 86, 89, 52, 50, 70], ['순욱', 'cao', '진류', 55, 20, 95, 97, 88],
  ['전위', 'cao', '진류', 60, 96, 30, 25, 60], ['조인', 'cao', '허창', 87, 84, 60, 55, 72],
  ['조홍', 'cao', '허창', 75, 78, 45, 50, 60], ['정욱', 'cao', '허창', 70, 40, 90, 80, 65],
  ['악진', 'cao', '허창', 80, 84, 50, 45, 62],
  ['유비', 'liu', '하비', 78, 74, 74, 78, 99], ['관우', 'liu', '하비', 94, 97, 76, 62, 90],
  ['장비', 'liu', '하비', 84, 98, 35, 25, 50], ['미축', 'liu', '하비', 30, 25, 65, 84, 80],
  ['간옹', 'liu', '하비', 35, 30, 68, 72, 75],
  ['손책', 'sun', '건업', 92, 92, 70, 68, 92], ['주유', 'sun', '건업', 95, 70, 96, 84, 90],
  ['장소', 'sun', '건업', 30, 15, 85, 95, 80], ['정보', 'sun', '건업', 82, 78, 72, 65, 78],
  ['손권', 'sun', '오', 76, 65, 80, 88, 92], ['한당', 'sun', '오', 76, 82, 50, 45, 65],
  ['황개', 'sun', '시상', 80, 82, 62, 55, 75], ['태사자', 'sun', '시상', 84, 93, 62, 50, 78],
  ['원소', 'yuan', '업', 82, 68, 72, 75, 88], ['전풍', 'yuan', '업', 60, 30, 94, 88, 70],
  ['안량', 'yuan', '업', 80, 94, 40, 30, 55], ['장합', 'yuan', '업', 88, 90, 70, 55, 72],
  ['문추', 'yuan', '남피', 78, 95, 35, 25, 50], ['저수', 'yuan', '남피', 72, 35, 92, 86, 74],
  ['심배', 'yuan', '평원', 70, 55, 80, 78, 60], ['곽도', 'yuan', '평원', 45, 40, 78, 70, 45],
  ['고람', 'yuan', '진양', 74, 85, 45, 40, 55],
  ['유표', 'biao', '양양', 60, 40, 72, 85, 82], ['채모', 'biao', '양양', 78, 68, 66, 60, 45],
  ['괴월', 'biao', '양양', 55, 30, 88, 84, 65], ['문빙', 'biao', '강릉', 82, 82, 58, 55, 70],
  ['황충', 'biao', '장사', 86, 93, 60, 50, 75], ['위연', 'biao', '장사', 82, 91, 65, 40, 45],
  ['황조', 'biao', '강하', 68, 66, 45, 40, 40],
  ['유장', 'zhang', '성도', 40, 30, 50, 65, 70], ['장임', 'zhang', '성도', 85, 86, 72, 55, 72],
  ['법정', 'zhang', '성도', 70, 35, 94, 80, 55], ['황권', 'zhang', '성도', 72, 50, 82, 82, 75],
  ['장송', 'zhang', '성도', 30, 20, 88, 82, 40], ['엄안', 'zhang', '강주', 80, 84, 66, 60, 78],
  ['마등', 'ma', '무위', 80, 84, 50, 55, 82], ['마초', 'ma', '무위', 88, 97, 45, 30, 78],
  ['방덕', 'ma', '무위', 82, 94, 60, 40, 70], ['한수', 'ma', '천수', 78, 72, 78, 60, 65],
  ['마대', 'ma', '천수', 75, 82, 52, 45, 68],
  ['여포', 'lu', '복양', 90, 100, 30, 20, 40], ['진궁', 'lu', '복양', 75, 50, 90, 80, 70],
  ['장료', 'lu', '복양', 92, 92, 78, 60, 80], ['고순', 'lu', '복양', 86, 86, 55, 45, 72],
  ['공손찬', 'gong', '북평', 80, 84, 60, 50, 65], ['조운', 'gong', '북평', 90, 96, 76, 65, 88],
  ['전예', 'gong', '북평', 76, 70, 78, 75, 72],
  // 재야
  ['제갈량', null, '양양', 92, 40, 100, 96, 92], ['방통', null, '장사', 78, 35, 97, 85, 70],
  ['서서', null, '여남', 80, 65, 92, 80, 78], ['사마의', null, '낙양', 96, 60, 98, 92, 75],
  ['순유', null, '허창', 70, 35, 93, 88, 75], ['곽가', null, '진류', 65, 25, 97, 82, 72],
  ['가후', null, '장안', 78, 45, 97, 85, 55], ['서황', null, '장안', 88, 90, 72, 50, 70],
  ['노숙', null, '수춘', 82, 55, 92, 90, 88], ['기령', null, '수춘', 76, 84, 40, 30, 55],
  ['여몽', null, '건업', 90, 82, 88, 70, 78], ['육손', null, '오', 94, 65, 95, 86, 85],
  ['감녕', null, '강하', 84, 94, 70, 35, 55], ['장수', null, '완', 76, 84, 55, 45, 60],
  ['강유', null, '천수', 88, 88, 90, 68, 75], ['마량', null, '강릉', 50, 30, 86, 90, 82],
  ['주태', null, '시상', 78, 91, 45, 35, 70], ['공융', null, '북해', 40, 30, 75, 88, 80],
  ['우금', null, '평원', 82, 78, 68, 55, 60], ['등애', null, '한중', 90, 84, 90, 78, 65],
  ['이엄', null, '영안', 80, 82, 78, 80, 60], ['허저', null, '여남', 62, 95, 28, 20, 62],
];

// ===================== 상태 =====================
let G = null;
let UI = null;
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ok = msg => ({ ok: true, msg });
const fail = msg => ({ ok: false, msg });

function newGame(player, scenarioId, custom) {
  const cities = CITY_DEF.map((d, i) => ({
    id: i, name: d[0], x: d[1], y: d[2], owner: d[3], pop: d[4] * 1000, farm: d[5], trade: d[6], wall: d[7],
    troops: d[8], loyal: d[3] ? 60 : 50, train: d[3] ? 50 : 0, gold: d[3] ? 1500 : 500, food: d[3] ? 25000 : 8000,
  }));
  const officers = OFF_DEF.map((d, i) => ({
    id: i, name: d[0], faction: d[1], city: CNAME.indexOf(d[2]), st: d.slice(3, 8), acted: false,
    ruler: !!d[1] && F[d[1]].ruler === d[0], dead: false,
  }));
  G = { year: 194, month: 1, player, cities, officers, allies: [], log: [], over: null, rel: {}, advisor: {}, spy: {}, price: 1 };
  const sc = scenarioOf(scenarioId);
  setupScenario(sc);
  if (custom && player) addCustomOfficer(custom);
  log(`${sc.year}년 ${sc.name}: ${sc.desc}`, 'sys');
  return G;
}

const now = () => G.year * 12 + G.month;
function log(msg, cls) {
  G.log.push({ t: `${G.year}년 ${G.month}월`, msg, cls: cls || '' });
  if (G.log.length > 150) G.log.shift();
}
const factionCities = f => G.cities.filter(c => c.owner === f);
const alive = f => G.cities.some(c => c.owner === f);
const cityOfficers = cid => {
  const own = G.cities[cid].owner;
  return own ? G.officers.filter(o => o.city === cid && o.faction === own && !o.dead) : [];
};
function rulerCharm(f) {
  const r = G.officers.find(o => o.ruler && o.faction === f && !o.dead);
  return (r ? r.st[4] : 60) + (G.title ? titleLv(f) : 0);
}
const isAllied = (a, b) => G.allies.some(x => (x.a === a && x.b === b) || (x.a === b && x.b === a));
const isHostile = (f, c) => c.owner !== f && !(c.owner && isAllied(f, c.owner));
const fname = f => (f ? F[f].name : '공백지');

// ===================== 내정·인사 =====================
const DEV = { farm: '개간', trade: '상업', wall: '축성', loyal: '순찰', flood: '치수' };
const DEVLABEL = { farm: '농업', trade: '상업', wall: '성벽', loyal: '민심', flood: '치수' };

function actDevelop(o, kind) {
  const c = G.cities[o.city];
  if (c.gold < 100) return fail('금이 부족합니다. (100 필요)');
  if (c[kind] >= 100) return fail(`${DEVLABEL[kind]}은(는) 이미 최고 수준입니다.`);
  const stat = kind === 'wall' ? (o.st[0] + o.st[3]) / 2 : kind === 'loyal' ? (o.st[3] + o.st[4]) / 2 : o.st[3];
  const inc = Math.max(1, Math.round(stat / 14 + rnd(0, 2)));
  c.gold -= 100;
  c[kind] = clamp(c[kind] + inc, 0, 100);
  o.acted = true;
  return ok(`${o.name}: ${c.name}의 ${DEVLABEL[kind]} +${inc} (현재 ${c[kind]})`);
}

function recruitMax(o, c) {
  return Math.max(0, Math.floor(Math.min(c.gold / 0.3, c.pop - 30000, o.st[4] * 60 + 1000) / 100) * 100);
}
function actRecruit(o, n) {
  const c = G.cities[o.city];
  n = Math.min(Math.floor((n | 0) / 100) * 100, recruitMax(o, c));
  if (n < 100) return fail('징병할 수 없습니다. (금·인구 부족)');
  c.gold -= Math.round(n * 0.3);
  c.pop -= n;
  c.train = Math.round((c.train * c.troops + 20 * n) / (c.troops + n));
  c.troops += n;
  c.loyal = clamp(c.loyal - Math.ceil(n / 1000), 0, 100);
  o.acted = true;
  return ok(`${o.name}: ${c.name}에서 병사 ${n.toLocaleString()}명 징병`);
}

function actTrain(o) {
  const c = G.cities[o.city];
  if (c.troops <= 0) return fail('훈련할 병사가 없습니다.');
  if (c.train >= 100) return fail('훈련도가 이미 최고입니다.');
  const inc = Math.round(o.st[0] / 10 + o.st[1] / 20);
  c.train = clamp(c.train + inc, 0, 100);
  o.acted = true;
  return ok(`${o.name}: ${c.name}의 훈련도 +${inc} (현재 ${c.train})`);
}

function actSearch(o) {
  const c = G.cities[o.city];
  o.acted = true;
  const found = searchItem(o, c);
  if (found) return ok(`${o.name}이(가) 보물 ${found.name}을(를) 찾아냈습니다!`);
  const pool = G.officers.filter(x => !x.faction && !x.dead && x.city === c.id);
  if (pool.length && Math.random() < (o.st[2] + o.st[4]) / 220) {
    const t = pool[ri(0, pool.length - 1)];
    const p = clamp((rulerCharm(o.faction) + o.st[4]) / 220, 0.2, 0.95);
    if (Math.random() < p) {
      t.faction = o.faction; t.acted = true;
      return ok(`${o.name}이(가) 재야의 인재 ${t.name}을(를) 등용했습니다!`);
    }
    return ok(`${o.name}이(가) ${t.name}을(를) 찾아냈으나 출사를 거절당했습니다.`);
  }
  if (Math.random() < 0.3) {
    const g = ri(50, 200);
    c.gold += g;
    return ok(`${o.name}: 탐색 중 금 ${g}을(를) 얻었습니다.`);
  }
  return ok(`${o.name}: 아무것도 찾지 못했습니다.`);
}

function actMove(from, to, ids, troops, gold, food) {
  if (from.owner !== to.owner || !ADJ[from.id].includes(to.id)) return fail('이동할 수 없는 곳입니다.');
  const offs = ids.map(i => G.officers[i]).filter(o => o && o.city === from.id && !o.acted);
  if (!offs.length) return fail('수송을 맡을 무장을 선택하세요.');
  troops = clamp(troops | 0, 0, from.troops); gold = clamp(gold | 0, 0, from.gold); food = clamp(food | 0, 0, from.food);
  if (troops > 0) to.train = Math.round((to.train * to.troops + from.train * troops) / (to.troops + troops));
  from.troops -= troops; to.troops += troops;
  from.gold -= gold; to.gold += gold;
  from.food -= food; to.food += food;
  offs.forEach(o => { o.city = to.id; o.acted = true; });
  return ok(`${offs.map(o => o.name).join('·')}: ${from.name} → ${to.name} 이동 (병력 ${troops.toLocaleString()})`);
}

function actAlliance(o, target) {
  const c = G.cities[o.city];
  if (c.gold < 500) return fail('금이 부족합니다. (500 필요)');
  if (isAllied(o.faction, target)) return fail('이미 동맹 중입니다.');
  c.gold -= 500; o.acted = true;
  const mine = factionCities(o.faction).length, theirs = factionCities(target).length;
  const p = clamp(0.25 + (o.st[2] + o.st[4]) / 400 + (getRel(o.faction, target) - 50) / 120 - (mine > theirs * 2 ? 0.2 : 0), 0.05, 0.9);
  if (Math.random() < p) {
    G.allies.push({ a: o.faction, b: target, until: now() + 24, kind: 'ally' });
    addRel(o.faction, target, 10);
    return ok(`${o.name}의 설득으로 ${F[target].name}과(와) 2년간 동맹을 맺었습니다.`);
  }
  return ok(`${F[target].name}이(가) 동맹 제안을 거절했습니다.`);
}

// ===================== 전투 =====================
const TACTIC = { charge: '돌격', volley: '사격', ploy: '계략', guard: '수비' };
const MAX_ROUND = 12;

function makeArmy(offs, troops, train, faction) {
  const mx = i => (offs.length ? Math.max(...offs.map(o => o.st[i])) : 40);
  const champ = offs.length ? offs.reduce((a, b) => (b.st[1] > a.st[1] ? b : a)) : null;
  return { faction, offs, troops, start: troops, morale: 100, train, cmd: mx(0), war: mx(1), int: mx(2), champ };
}

function createBattle(from, to, offs, troops) {
  from.troops -= troops;
  const defOffs = cityOfficers(to.id).sort((a, b) => b.st[0] - a.st[0]).slice(0, 5);
  syncMen(from); syncMen(to);
  const b = {
    from: from.id, to: to.id, wall: to.wall, round: 0, log: [], dueled: false, winner: null,
    att: makeArmy(offs, troops, from.train, from.owner),
    def: makeArmy(defOffs, to.troops, to.train, to.owner),
  };
  applyNaval(b);
  return b;
}

function strike(me, en, my, their) {
  const base = me.troops * (0.6 + me.train / 250) * (0.5 + me.morale / 200) * rnd(0.85, 1.15);
  let dmg = 0, hit = 0, self = 0, note = '';
  if (my === 'charge') {
    const m = their === 'ploy' ? 1.5 : their === 'guard' ? 0.5 : their === 'volley' ? 1.1 : 1;
    dmg = base * 0.13 * (me.war / 80) * m;
  } else if (my === 'volley') {
    dmg = base * 0.09 * (me.cmd / 80) * (their === 'guard' ? 0.7 : 1);
  } else if (my === 'guard') {
    dmg = base * 0.05 * (me.cmd / 80) * (their === 'charge' ? 1.8 : 1);
    self = 4;
  } else {
    const p = clamp(50 + (me.int - en.int) / 1.2 + (their === 'guard' ? 25 : 0) - (their === 'charge' ? 30 : 0), 5, 95);
    if (Math.random() * 100 < p) { dmg = en.troops * 0.1 + base * 0.04; hit = 15; note = '성공'; }
    else { self = -8; note = '실패'; }
  }
  return { dmg, hit, self, note };
}

function checkEnd(b) {
  if (b.winner) return;
  const A = b.att, D = b.def;
  if (A.troops <= 0 || A.morale <= 0) { b.winner = 'def'; b.log.push('▶ 공격군이 무너졌습니다. 수비군의 승리!'); }
  else if (D.troops <= 0 || D.morale <= 0) { b.winner = 'att'; b.log.push('▶ 수비군이 무너졌습니다. 성이 함락되었습니다!'); }
  else if (b.round >= MAX_ROUND) { b.winner = 'def'; b.log.push('▶ 공성이 길어져 공격군이 철수합니다.'); }
}

function battleRound(b, ta, td) {
  if (b.winner) return;
  b.round++;
  const A = b.att, D = b.def;
  const ra = strike(A, D, ta, td), rd = strike(D, A, td, ta);
  const toD = Math.min(D.troops, Math.round(ra.dmg / (1 + b.wall / 200) * (td === 'guard' && ta !== 'ploy' ? 0.5 : 1)));
  const toA = Math.min(A.troops, Math.round(rd.dmg * (ta === 'guard' && td !== 'ploy' ? 0.5 : 1)));
  const la = toA / A.troops, ld = toD / D.troops;
  A.troops -= toA; D.troops -= toD;
  A.morale = clamp(A.morale + ra.self - rd.hit - (la > ld ? 6 : 0), 0, 120);
  D.morale = clamp(D.morale + rd.self - ra.hit - (ld > la ? 6 : 0), 0, 120);
  const tag = (t, r) => TACTIC[t] + (r.note ? `(${r.note})` : '');
  b.log.push(`${b.round}합 │ 공격 ${tag(ta, ra)} vs 수비 ${tag(td, rd)} │ 공격군 -${toA.toLocaleString()}, 수비군 -${toD.toLocaleString()}`);
  checkEnd(b);
}

function battleDuel(b, side) {
  if (b.dueled || b.winner) return;
  b.dueled = true;
  const me = b[side], en = b[side === 'att' ? 'def' : 'att'];
  if (!me.champ || !en.champ) { b.log.push('일기토에 나설 장수가 없습니다.'); return; }
  const a = me.champ, e = en.champ;
  if (e.st[1] < a.st[1] - 8) {
    en.morale = clamp(en.morale - 6, 0, 120);
    b.log.push(`${a.name}이(가) 일기토를 청했으나 ${e.name}은(는) 응하지 않았습니다. (적 사기 -6)`);
  } else if (Math.random() < clamp(0.5 + (a.st[1] - e.st[1]) / 40, 0.05, 0.95)) {
    en.morale = clamp(en.morale - 22, 0, 120); me.morale = clamp(me.morale + 8, 0, 120);
    b.log.push(`일기토! ${a.name}이(가) ${e.name}을(를) 물리쳤습니다! (적 사기 -22)`);
  } else {
    me.morale = clamp(me.morale - 22, 0, 120); en.morale = clamp(en.morale + 8, 0, 120);
    b.log.push(`일기토! ${a.name}이(가) ${e.name}에게 패했습니다... (아군 사기 -22)`);
  }
  checkEnd(b);
}

function aiTactic(me, en, isDef) {
  const w = {
    charge: 2 + (me.war - 70) / 10,
    volley: 2,
    ploy: 1.5 + (me.int - en.int) / 10,
    guard: (isDef ? 2.5 : 0.8) + (me.morale < 40 ? 1 : 0),
  };
  let sum = 0;
  for (const k in w) { w[k] = Math.max(0.2, w[k]); sum += w[k]; }
  let r = Math.random() * sum;
  for (const k in w) { r -= w[k]; if (r <= 0) return k; }
  return 'volley';
}

function destroyFaction(f, by) {
  G.officers.forEach(o => {
    if (o.faction !== f) return;
    o.faction = null;
    if (o.ruler) { o.dead = true; o.city = -1; }
  });
  G.allies = G.allies.filter(x => x.a !== f && x.b !== f);
  log(`${F[f].name}이(가) ${F[by].name}에게 멸망했습니다.`, 'big');
  if (f === G.player) G.over = 'lose';
}

async function finishBattle(b) {
  const from = G.cities[b.from], to = G.cities[b.to], A = b.att, D = b.def;
  if (b.winner !== 'att') {
    from.troops += Math.round(A.troops * 0.85);
    to.troops = D.troops;
    log(`${F[A.faction].name}의 ${to.name} 공격이 실패했습니다.`, 'war');
    return;
  }
  const old = to.owner;
  const defOffs = old ? G.officers.filter(o => o.city === to.id && o.faction === old && !o.dead) : [];
  to.owner = A.faction;
  to.troops = A.troops + Math.round(Math.max(0, D.troops) * 0.3);
  to.train = A.train;
  if (old) {
    to.wall = Math.max(0, to.wall - 10); to.loyal = Math.max(0, to.loyal - 10);
    to.farm = Math.max(0, to.farm - 4); to.trade = Math.max(0, to.trade - 4);
  }
  A.offs.forEach(o => { o.city = to.id; });
  log(`${F[A.faction].name}이(가) ${to.name}을(를) ${old ? F[old].name + '에게서 빼앗았습니다' : '점령했습니다'}.`, 'war');
  to.deleg = false; to.gov = null;
  if (old) {
    addRel(A.faction, old, -10);
    const refuge = factionCities(old), gone = !refuge.length, caught = [];
    if (gone) destroyFaction(old, A.faction);
    defOffs.forEach(o => {
      if (o.dead) return;
      if (gone || (!o.ruler && Math.random() < 0.4)) { caught.push(o); return; }
      const near = refuge.filter(c => ADJ[to.id].includes(c.id)), l = near.length ? near : refuge;
      o.city = l[ri(0, l.length - 1)].id;
    });
    await handleCaptives(caught, A.faction, gone ? null : old, to, refuge);
  }
  if (G.player && G.cities.every(c => c.owner === G.player)) G.over = 'win';
}

async function resolveBattle(b) {
  if (b.def.troops <= 0) b.winner = 'att';
  else if (UI && G.player && (b.att.faction === G.player || b.def.faction === G.player)) await UI.battle(b);
  else while (!b.winner) battleRound(b, aiTactic(b.att, b.def, false), aiTactic(b.def, b.att, true));
  await finishBattle(b);
}

async function startAttack(from, to, ids, troops, help) {
  if (!ADJ[from.id].includes(to.id) || !isHostile(from.owner, to)) return fail('공격할 수 없는 곳입니다.');
  const offs = ids.map(i => G.officers[i]).filter(o => o && o.city === from.id && !o.acted).slice(0, 5);
  troops = clamp(Math.floor((troops | 0) / 100) * 100, 0, from.troops);
  if (!offs.length) return fail('출진할 무장을 선택하세요.');
  troops = Math.min(troops, Math.floor(commandCap(offs) / 100) * 100);
  if (troops < 100) return fail('병력이 부족합니다.');
  offs.forEach(o => { o.acted = true; });
  log(`${F[from.owner].name}의 ${offs[0].name} 등이 병력 ${troops.toLocaleString()}으로 ${to.name}(${fname(to.owner)})에 출진!`, 'war');
  const b = createBattle(from, to, offs, troops);
  if (help) {
    const c = ADJ[to.id].map(i => G.cities[i]).find(x => x.owner && x.owner !== from.owner && x.owner !== to.owner && x.troops > 4000 && G.allies.some(a => a.kind === 'ally' && ((a.a === from.owner && a.b === x.owner) || (a.b === from.owner && a.a === x.owner))));
    if (c) {
      const n = Math.floor(c.troops * 0.25 / 100) * 100;
      c.troops -= n; b.att.troops += n; b.att.start += n; addRel(from.owner, c.owner, -3);
      log(`동맹 ${F[c.owner].name}이(가) ${c.name}에서 원군 ${n.toLocaleString()}을(를) 보냈습니다.`, 'sys');
    }
  }
  await resolveBattle(b);
  return ok('전투가 끝났습니다.');
}

// ===================== AI =====================
function frontDist(f) {
  const d = G.cities.map(() => 99), q = [];
  G.cities.forEach(c => {
    if (c.owner === f && ADJ[c.id].some(i => isHostile(f, G.cities[i]))) { d[c.id] = 0; q.push(c.id); }
  });
  while (q.length) {
    const x = q.shift();
    for (const n of ADJ[x]) if (G.cities[n].owner === f && d[n] > d[x] + 1) { d[n] = d[x] + 1; q.push(n); }
  }
  return d;
}

let aiAttacks = 0; // 세력당 한 달에 벌이는 대규모 공세 수 제한
async function aiTurn(f) {
  aiAttacks = 0;
  aiStrategy(f);
  for (const c of factionCities(f)) {
    if (G.over) return;
    await aiCity(f, c, true);
  }
}

async function aiCity(f, c, war) {
  {
    if (c.owner !== f) return;
    let offs = cityOfficers(c.id).filter(o => !o.acted).sort((a, b) => b.st[0] - a.st[0]);
    if (!offs.length) return;
    const targets = ADJ[c.id].map(i => G.cities[i]).filter(t => isHostile(f, t) && aiMayAttack(f, t));

    // 출진 판단
    if (war && targets.length && c.troops >= 2500) {
      const q = 0.6 + c.train / 250;
      const power = t => t.troops * (1 + t.wall / 200) * (0.6 + t.train / 250) / q;
      targets.sort((a, b) => power(a) - power(b));
      const t = targets[0];
      const others = Math.max(0, ...targets.filter(x => x !== t && x.owner).map(x => x.troops));
      if (t.troops === 0) {
        const send = Math.min(3000, Math.floor(c.troops * 0.4 / 100) * 100);
        if (send >= 500) await startAttack(c, t, [offs[offs.length - 1].id], send);
      } else {
        const send = Math.floor(c.troops * 0.8 / 100) * 100;
        if (aiAttacks < 1 + (Math.random() < 0.25 ? 1 : 0) && send > power(t) * 1.1 && c.troops - send >= others * 0.2 && Math.random() < 0.6) {
          aiAttacks++;
          await startAttack(c, t, offs.slice(0, 5).map(o => o.id), send);
        }
      }
      if (G.over) return;
    }
    if (c.owner !== f) return;
    offs = cityOfficers(c.id).filter(o => !o.acted);

    // 후방 → 전방 수송
    if (!targets.length && c.troops > 2000 && offs.length) {
      const d = frontDist(f);
      const dest = ADJ[c.id].map(i => G.cities[i]).filter(x => x.owner === f && d[x.id] < d[c.id]).sort((a, b) => d[a.id] - d[b.id])[0];
      if (dest) {
        const movers = offs.filter(o => !o.ruler).slice(0, Math.max(1, Math.floor(offs.length / 2)));
        if (movers.length) actMove(c, dest, movers.map(o => o.id), Math.floor(c.troops * 0.7), Math.floor(c.gold * 0.3), Math.floor(c.food * 0.3));
        offs = cityOfficers(c.id).filter(o => !o.acted);
      }
    }

    for (const o of offs) {
      const n = Math.min(recruitMax(o, c), 3000);
      if (c.loyal < 40 && c.gold >= 100) actDevelop(o, 'loyal');
      else if (n >= 500 && c.gold >= 700 && c.troops < 14000 + Math.min(factionCities(f).length, 8) * 1000 && c.loyal > 45 && (targets.length || Math.random() < 0.25)) actRecruit(o, n);
      else if (c.train < 75 && c.troops > 0) actTrain(o);
      else if (Math.random() < 0.12) {
        const r = actSearch(o);
        if (r.msg.includes('등용')) log(`${F[f].name}: ${r.msg}`);
      } else if (c.gold >= 100) {
        const kinds = ['farm', 'trade', 'wall', 'loyal', 'flood'].filter(k => c[k] < 100).sort((a, b) => c[a] - c[b]);
        if (kinds.length) actDevelop(o, kinds[0]);
      }
    }
  }
}

// ===================== 월말 처리 =====================
function monthEnd() {
  for (const c of G.cities) {
    if (!c.owner) continue;
    c.gold += Math.round((c.trade * 10 + c.pop / 1000) * TAX[c.tax].gold);
    c.food -= Math.round(c.troops * 0.08);
    if (G.month === 9) {
      const h = Math.round((c.farm * 450 + c.pop / 15) * TAX[c.tax].food);
      c.food += h;
      if (c.owner === G.player) log(`${c.name}: 가을걷이로 군량 ${h.toLocaleString()} 수확`);
    }
    if (c.food < 0) {
      c.food = 0; c.troops = Math.round(c.troops * 0.9); c.loyal = Math.max(0, c.loyal - 3);
      if (c.owner === G.player) log(`${c.name}: 군량이 떨어져 병사들이 흩어지고 있습니다!`, 'war');
    }
    c.pop = clamp(Math.round(c.pop * (1 + (c.loyal - 45) / 4000)), 10000, 600000);
    if (c.loyal < 30 && Math.random() < 0.1) {
      c.pop = Math.round(c.pop * 0.95); c.gold = Math.round(c.gold * 0.8);
      if (c.owner === G.player) log(`${c.name}에서 민란이 일어났습니다!`, 'war');
    }
  }
  monthExtras();
  sweepItems();
  G.officers.forEach(o => { o.acted = false; });
  G.month++;
  if (G.month > 12) { G.month = 1; G.year++; }
  G.allies = G.allies.filter(x => {
    if (x.until > now()) return true;
    if (x.a === G.player || x.b === G.player) log(`${F[x.a === G.player ? x.b : x.a].name}과(와)의 동맹 기한이 끝났습니다.`, 'sys');
    return false;
  });
}

// ===================== 화면 =====================
let sel = 0, busy = false, flash = '';
const $ = id => document.getElementById(id);
const num = n => Math.round(n).toLocaleString();
const short = n => (n >= 10000 ? (n / 10000).toFixed(1) + '만' : String(n));
const SAVE_KEY = 'nation3_save_v4';

function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch (e) { /* 저장 불가 환경 */ } }
function load() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    if (!s) return false;
    G = JSON.parse(s);
    applyScenarioNames(scenarioOf(G.scenario));
    G.officers.forEach(o => { if (o.ruler && o.faction) F[o.faction].ruler = o.name; });
    return true;
  } catch (e) { return false; }
}

function openModal(html) { $('modalBox').innerHTML = html; $('modal').classList.remove('hidden'); }
function closeModal() { $('modal').classList.add('hidden'); }

function startGame(id) {
  newGame(id, pendingScenario, pendingCustom);
  pendingCustom = null;
  sel = G.cities.find(c => c.owner === id).id;
  closeModal(); save(); render(); focusMap();
}
function continueGame() {
  if (!load()) return;
  const mine = G.cities.find(c => c.owner === G.player);
  sel = mine ? mine.id : 0;
  closeModal(); render(); focusMap();
  if (G.over) showOver();
}
function showOver() {
  openModal(G.over === 'win'
    ? `<h2>천하통일!</h2><p>${G.year}년 ${G.month}월, ${titleName(G.player)} ${F[G.player].ruler}의 깃발이 온 천하에 나부낍니다.</p><button class="wide" onclick="showStart()">새 게임</button>`
    : `<h2>멸망</h2><p>${F[G.player].name}의 꿈은 여기서 끝났습니다...</p><button class="wide" onclick="showStart()">새 게임</button>`);
}

function render() {
  const f = F[G.player], mine = factionCities(G.player);
  $('date').textContent = `${G.year}년 ${G.month}월`;
  $('summary').innerHTML = `<b style="color:${f.color}">${f.name}</b> · ${titleName(G.player)} · 도시 ${mine.length}/${G.cities.length} · 병력 ${num(mine.reduce((s, c) => s + c.troops, 0))} · 무장 ${G.officers.filter(o => o.faction === G.player).length}`;
  $('endBtn').disabled = busy || !!G.over;
  $('endBtn').textContent = busy ? '다른 세력 행동 중…' : '턴 종료 ▶';
  renderMap(); renderCity(); renderLog();
}

function renderCity() {
  const c = G.cities[sel], mine = c.owner === G.player;
  if (c.owner) syncMen(c);
  const offs = cityOfficers(c.id).sort((a, b) => b.ruler - a.ruler || b.st[0] - a.st[0]);
  const ally = c.owner && c.owner !== G.player && isAllied(G.player, c.owner);
  const see = !c.owner || canSee(G.player, c), gov = c.owner ? getGov(c) : null, adv = c.owner ? getAdvisor(c.owner) : null;
  const bar = v => `<span class="bar"><i style="width:${v}%"></i></span> ${v}`;
  let h = `<h2><span class="dot" style="background:${c.owner ? F[c.owner].color : '#a59c88'}"></span>${c.name} <small>${provinceOf(c.name)} · ${fname(c.owner)}${ally ? ' · 동맹' : ''}</small><button class="mapback" onclick="backToMap()">지도</button></h2>
    <table class="stats"><tr><td>인구</td><td>${num(c.pop)}</td><td>병력</td><td>${num(c.troops)}</td></tr>
    <tr><td>금</td><td>${see ? num(c.gold) : '???'}</td><td>군량</td><td>${see ? num(c.food) : '???'}</td></tr>
    <tr><td>군마</td><td>${see ? num(c.horse) : '???'}</td><td>강노</td><td>${see ? num(c.bow) : '???'}</td></tr>
    <tr><td>전선</td><td>${see ? num(c.ships) : '???'}${PORTS.has(c.name) ? ' ⚓' : ''}</td><td>황제</td><td>${G.emp === c.id ? '★ 이곳에 계심' : empCity().name}</td></tr>
    <tr><td>농업</td><td>${bar(c.farm)}</td><td>상업</td><td>${bar(c.trade)}</td></tr>
    <tr><td>성벽</td><td>${bar(c.wall)}</td><td>민심</td><td>${bar(c.loyal)}</td></tr>
    <tr><td>훈련</td><td>${see ? bar(c.train) : '???'}</td><td>치수</td><td>${bar(c.flood)}</td></tr>
    <tr><td>세율</td><td>${see ? TAX[c.tax].n : '???'}${c.deleg ? ' · 위임' : ''}</td><td>인접</td><td>${ADJ[c.id].map(i => `<a onclick="selectCity(${i})">${G.cities[i].name}</a>`).join(' ')}</td></tr></table>`;
  if (mine && !G.over) {
    const dis = busy ? 'disabled' : '';
    const B = (k, t, x) => `<button ${dis} ${x ? 'class="atk"' : ''} onclick="cmd('${k}')">${cmdIcon(k)}${t}</button>`;
    h += `<div class="cmds">${B('farm', '개간')}${B('trade', '상업')}${B('wall', '축성')}${B('loyal', '순찰')}${B('flood', '치수')}
      ${B('recruit', '징병')}${B('train', '훈련')}${B('attack', '출진', 1)}${B('move', '이동')}${B('search', '탐색')}
      ${B('scheme', '계략')}${B('diplo', '외교')}${B('trade2', '상인')}${B('reward', '포상')}${B('appoint', '임명')}
      ${B('tax', '세율')}${B('deleg', c.deleg ? '위임 해제' : '위임')}
      ${B('ships', '조선')}${B('men', '배속')}${B('treasure', '보물')}${B('title', '작위')}${B('edict', '칙명')}${B('bond', '결의')}</div>`;
  }
  if (flash) h += `<div class="flash">${flash}</div>`;
  if (offs.length) {
    h += `<table class="offs pick"><tr><th>무장</th>${ST.map(s => `<th>${s}</th>`).join('')}<th>충성</th><th>병력</th><th></th></tr>
      ${offs.map(o => `<tr class="${o.acted ? 'acted' : ''}" onclick="showOfficer(${o.id})"><td>${o.ruler ? '★' : ''}${o.name}${adv === o ? ' <small>군</small>' : ''}${gov === o ? ' <small>태</small>' : ''}</td>${o.st.map(v => `<td class="${v >= 90 ? 'hi' : ''}">${v}</td>`).join('')}<td>${see && !o.ruler ? o.loyal : o.ruler ? '—' : '?'}</td><td>${see ? short(o.men || 0) : '?'}</td><td>${mine ? (o.acted ? '완료' : '대기') : ''}</td></tr>`).join('')}</table>`;
  } else h += `<p class="dim">${c.owner ? '주둔 무장이 없습니다.' : '주인 없는 땅입니다. 인접한 아군 도시에서 출진하면 점령할 수 있습니다.'}</p>`;
  $('cityPanel').innerHTML = h;
}

function renderLog() {
  $('log').innerHTML = G.log.slice(-60).reverse().map(l => `<div class="${l.cls}"><span>${l.t}</span> ${l.msg}</div>`).join('');
}

function done(r) {
  flash = r.msg;
  if (r.ok) log(r.msg);
  closeModal(); render();
}

let pickCb = null;
function pickOfficer(title, offs, hint, cb) {
  pickCb = cb;
  openModal(`<h2>${title}</h2><p class="dim">${hint}</p>
    <table class="offs pick"><tr><th>무장</th>${ST.map(s => `<th>${s}</th>`).join('')}</tr>
    ${offs.map(o => `<tr onclick="pickCb(G.officers[${o.id}])"><td>${o.name}</td>${o.st.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>
    <button onclick="closeModal()">취소</button>`);
}
const offChecks = offs => `<div class="checks">${offs.map(o => `<label><input type="checkbox" name="off" value="${o.id}"> ${o.name} <small>통${o.st[0]} 무${o.st[1]} 지${o.st[2]}</small></label>`).join('')}</div>`;
const checked = () => [...document.querySelectorAll('input[name=off]:checked')].map(e => +e.value);

function cmd(kind) {
  if (busy || G.over) return;
  const c = G.cities[sel];
  if (FREE_CMD[kind]) return FREE_CMD[kind](c);
  const offs = cityOfficers(c.id).filter(o => !o.acted);
  if (kind === 'trade2' && offs.length) return EXTRA_CMD.trade(c, offs);
  if (EXTRA_CMD[kind] && kind !== 'trade' && offs.length) return EXTRA_CMD[kind](c, offs);
  if (!offs.length) { flash = '행동할 수 있는 무장이 없습니다.'; return render(); }
  if (DEV[kind]) return pickOfficer(`${DEV[kind]} — 금 100`, offs, kind === 'wall' ? '통솔과 내정이 높을수록 효과적입니다.' : kind === 'loyal' ? '내정과 인덕이 높을수록 효과적입니다.' : '내정이 높을수록 효과적입니다.', o => done(actDevelop(o, kind)));
  if (kind === 'train') return pickOfficer('훈련', offs, '통솔과 무력이 높을수록 효과적입니다.', o => done(actTrain(o)));
  if (kind === 'search') return pickOfficer('탐색', offs, '지략과 인덕이 높을수록 재야 인재를 찾기 쉽습니다.', o => done(actSearch(o)));
  if (kind === 'recruit') {
    return pickOfficer('징병 — 병사 1명당 금 0.3', offs, '인덕이 높을수록 한 번에 많이 모을 수 있습니다. 민심이 조금 떨어집니다.', o => {
      const mx = recruitMax(o, c);
      if (mx < 100) return done(fail('징병할 수 없습니다. (금·인구 부족)'));
      openModal(`<h2>징병 — ${o.name}</h2><p>최대 ${num(mx)}명</p>
        <input id="rn" type="number" min="100" max="${mx}" step="100" value="${mx}">
        <div class="row"><button onclick="done(actRecruit(G.officers[${o.id}], +$('rn').value))">징병</button><button onclick="closeModal()">취소</button></div>`);
    });
  }
  if (kind === 'move') {
    const dests = ADJ[c.id].map(i => G.cities[i]).filter(x => x.owner === G.player);
    if (!dests.length) { flash = '인접한 아군 도시가 없습니다.'; return render(); }
    return openModal(`<h2>이동 — ${c.name}에서</h2>
      <label>목적지 <select id="mv_to">${dests.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}</select></label>
      ${offChecks(offs)}
      <label>병력 <input id="mv_t" type="number" min="0" max="${c.troops}" step="100" value="0"> / ${num(c.troops)}</label>
      <label>금 <input id="mv_g" type="number" min="0" max="${c.gold}" step="100" value="0"> / ${num(c.gold)}</label>
      <label>군량 <input id="mv_f" type="number" min="0" max="${c.food}" step="1000" value="0"> / ${num(c.food)}</label>
      <div class="row"><button onclick="doMove()">이동</button><button onclick="closeModal()">취소</button></div>`);
  }
  if (kind === 'attack') {
    const ts = ADJ[c.id].map(i => G.cities[i]).filter(x => isHostile(G.player, x));
    if (!ts.length) { flash = '공격할 수 있는 인접 도시가 없습니다.'; return render(); }
    const def = Math.floor(c.troops * 0.7 / 100) * 100;
    return openModal(`<h2>출진 — ${c.name}에서</h2>
      <label>목표 <select id="at_to">${ts.map(d => `<option value="${d.id}">${isNavalRoad(c, d) ? '⚓수전 ' : ''}${d.name} (${fname(d.owner)}, 병력 ${num(d.troops)}, 성벽 ${d.wall})</option>`).join('')}</select></label>
      <p class="dim">무장은 최대 5명. 출진 병력은 무장들의 지휘 한도(통솔 ×120) 합계까지입니다.</p>
      ${offChecks(offs)}
      <label>병력 <input id="at_t" type="number" min="100" max="${c.troops}" step="100" value="${def}"> / ${num(c.troops)}</label>
      <label><input type="checkbox" id="at_help"> 동맹군에게 원군 요청 (목표에 인접한 동맹 도시)</label>
      <div class="row"><button class="atk" onclick="doAttack()">출진!</button><button onclick="closeModal()">취소</button></div>`);
  }
}

function doMove() {
  done(actMove(G.cities[sel], G.cities[+$('mv_to').value], checked(), +$('mv_t').value, +$('mv_g').value, +$('mv_f').value));
}
async function doAttack() {
  const ids = checked(), to = G.cities[+$('at_to').value], troops = +$('at_t').value, help = $('at_help').checked;
  if (ids.length > 5) { alertLine('무장은 5명까지 출진할 수 있습니다.'); return; }
  closeModal();
  busy = true;
  const r = await startAttack(G.cities[sel], to, ids, troops, help);
  busy = false;
  flash = r.ok ? (to.owner === G.player ? `${to.name}을(를) 손에 넣었습니다!` : `${to.name} 공략에 실패했습니다.`) : r.msg;
  save(); render();
  if (G.over) showOver();
}
function alertLine(msg) {
  const box = $('modalBox');
  let e = box.querySelector('.flash');
  if (!e) { e = document.createElement('div'); e.className = 'flash'; box.appendChild(e); }
  e.textContent = msg;
}

function uiBattle(b) {
  return new Promise(resolve => {
    const side = b.att.faction === G.player ? 'att' : 'def';
    const other = side === 'att' ? 'def' : 'att';
    const to = G.cities[b.to];
    const army = (a, label, isMe) => `<div class="army ${isMe ? 'me' : ''}">
      <h3 style="color:${a.faction ? F[a.faction].color : '#aaa'}">${label} · ${fname(a.faction)}</h3>
      <div>${a.offs.map(o => o.name).join(' · ') || '수비대'}</div>
      <div class="big">${num(a.troops)} <small>/ ${num(a.start)}</small></div>
      <div>사기 <span class="bar"><i style="width:${Math.min(100, a.morale)}%"></i></span> ${Math.round(a.morale)}</div>
      <small>통솔 ${a.cmd} · 무력 ${a.war} · 지략 ${a.int} · 훈련 ${a.train}</small></div>`;
    const draw = () => {
      openModal(`<h2>⚔ ${to.name} 공방전 <small>${b.round}/${MAX_ROUND}합 · 성벽 ${b.wall}</small></h2>
        <div class="armies">${army(b.att, '공격', side === 'att')}${army(b.def, '수비', side === 'def')}</div>
        <div class="blog" id="blog">${b.log.map(l => `<div>${l}</div>`).join('') || '<div class="dim">전술을 고르세요. 돌격은 계략을 꺾고, 수비는 돌격을 막아내며, 계략은 수비를 무너뜨립니다. 사격은 무난합니다.</div>'}</div>
        ${b.winner
          ? `<button class="wide" onclick="_bend()">${b.winner === side ? '승리!' : '패배...'} — 닫기</button>`
          : `<div class="cmds">
              <button onclick="_bt('charge')">돌격<small>무력</small></button><button onclick="_bt('volley')">사격<small>통솔</small></button>
              <button onclick="_bt('ploy')">계략<small>지략</small></button><button onclick="_bt('guard')">수비<small>통솔</small></button>
              <button ${b.dueled ? 'disabled' : ''} onclick="_bduel()">일기토<small>1회</small></button>
              ${side === 'att' ? '<button onclick="_bret()">퇴각</button>' : ''}</div>`}`);
      const e = $('blog'); e.scrollTop = e.scrollHeight;
    };
    window._bt = t => {
      if (b.winner) return;
      const ai = aiTactic(b[other], b[side], other === 'def');
      if (side === 'att') battleRound(b, t, ai); else battleRound(b, ai, t);
      draw();
    };
    window._bduel = () => { battleDuel(b, side); draw(); };
    window._bret = () => { b.winner = 'def'; b.log.push('▶ 공격군이 퇴각했습니다.'); draw(); };
    window._bend = () => { closeModal(); resolve(); };
    draw();
  });
}

async function endTurn() {
  if (busy || G.over) return;
  busy = true; flash = ''; render();
  for (const c of factionCities(G.player)) if (c.deleg) await aiCity(G.player, c, false);
  for (const f of FACTIONS) {
    if (f.id === G.player || !alive(f.id)) continue;
    await aiTurn(f.id);
    if (G.over) break;
  }
  if (!G.over) monthEnd();
  await playEvents();
  busy = false;
  if (!G.cities[sel]) sel = 0;
  save(); render();
  if (G.over) showOver();
}

if (typeof document !== 'undefined') {
  UI = { battle: b => uiBattleEntry(b), captive: (o, f) => uiCaptive(o, f) };
  window.addEventListener('DOMContentLoaded', () => { initMap(); showStart(); });
  document.addEventListener('keydown', e => {
    if ((e.key === 'e' || e.key === 'E') && G && $('modal').classList.contains('hidden')) endTurn();
  });
}
if (typeof module !== 'undefined') {
  module.exports = { newGame, aiTurn, monthEnd, alive, factionCities, FACTIONS, state: () => G };
}
