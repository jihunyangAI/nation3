'use strict';
/* nation3 — 시나리오·인사·계략·외교·상인·재해 등 확장 시스템 */

// ===================== 시나리오 =====================
const BASE_FACTION = Object.fromEntries(FACTIONS.map(f => [f.id, { name: f.name, ruler: f.ruler }]));
// 초기 시나리오에만 등장하는 인물: 이름, 세력, 도시, 통솔, 무력, 지략, 내정, 인덕
const EARLY_OFFICERS = [
  ['동탁', null, '천수', 78, 86, 62, 45, 20], ['이유', null, '천수', 45, 30, 88, 70, 25], ['화웅', null, '천수', 70, 90, 30, 25, 40], ['이각', null, '천수', 68, 76, 35, 25, 25],
  ['곽사', null, '천수', 66, 74, 30, 22, 25], ['장제', null, '천수', 72, 72, 50, 45, 55], ['번조', null, '천수', 65, 72, 30, 30, 40], ['서영', null, '낙양', 80, 72, 65, 50, 50],
  ['장각', null, '업', 72, 25, 86, 70, 92], ['장보', null, '업', 66, 58, 72, 40, 60], ['장량', null, '업', 68, 70, 50, 35, 55], ['장만성', null, '완', 60, 68, 35, 25, 45],
  ['파재', null, '여남', 62, 66, 45, 30, 50], ['정원지', null, '평원', 55, 68, 25, 20, 35], ['관해', null, '북해', 58, 82, 30, 20, 50], ['주창', null, '여남', 52, 84, 35, 30, 70],
  ['배원소', null, '여남', 48, 66, 25, 20, 40], ['요화', null, '양양', 64, 70, 55, 50, 65], ['하진', null, '낙양', 45, 50, 30, 40, 45], ['황보숭', null, '낙양', 88, 72, 72, 70, 82],
  ['주준', null, '낙양', 84, 74, 68, 65, 76], ['노식', null, '낙양', 82, 55, 80, 85, 88], ['왕윤', null, '낙양', 40, 25, 82, 78, 70], ['정원', null, '진양', 66, 70, 42, 40, 50],
  ['손견', null, '하비', 90, 88, 70, 62, 86], ['조무', null, '하비', 62, 68, 40, 35, 62], ['원술', null, '완', 60, 58, 55, 45, 30], ['장훈', null, '완', 66, 64, 45, 35, 40],
  ['유언', null, '성도', 52, 35, 72, 78, 62], ['도겸', null, '하비', 50, 35, 58, 72, 70], ['조표', null, '하비', 48, 62, 28, 25, 25], ['진등', null, '하비', 72, 55, 80, 82, 70],
  ['변장', null, '무위', 58, 52, 50, 45, 45],
];
// 아직 어린 인물은 이 해가 되면 재야에 나타난다
const DEBUT = { 조운: 187, 주유: 190, 손책: 190, 곽가: 190, 서서: 190, 마초: 192, 여몽: 195, 마대: 195, 노숙: 195, 위연: 195, 법정: 195, 제갈량: 197, 방통: 198, 손권: 198, 육손: 200, 사마의: 200, 마량: 205, 등애: 215, 강유: 218 };

const SCENARIOS = [
  {
    id: 's184', name: '황건 봉기', year: 184, desc: '누런 두건이 일어났다. 영웅들은 관군과 손잡고 첫발을 내딛는다.', early: true, rulers: { ma: '한수', sun: '손견', zhang: '유언' }, bonus: { huang: 6000 },
    pacts: [['han', 'cao'], ['han', 'liu'], ['han', 'sun'], ['han', 'dong'], ['cao', 'liu'], ['cao', 'sun'], ['liu', 'sun']], pactMonths: 36,
    own: {
      han: ['낙양', '장안', '한중', '성도', '강주', '영안', '양양', '강릉', '장사', '강하', '시상', '건업', '오', '수춘', '진류', '진양', '북해'],
      huang: ['업', '남피', '평원', '복양', '여남', '완'], cao: ['허창'], liu: ['북평'], sun: ['하비'], dong: ['천수'], ma: ['무위'],
    },
    off: {
      han: ['하진', '황보숭', '주준', '노식', '왕윤', '정원', '여포', '장료', '고순', '유언', '유표', '채모', '괴월', '문빙', '황충', '유장', '장임', '엄안', '황권', '공융', '진궁', '장소', '원소', '원술', '도겸', '공손찬'],
      huang: ['장각', '장보', '장량', '장만성', '파재', '정원지', '관해', '주창', '배원소', '요화'], cao: ['조조', '하후돈', '하후연', '조인', '조홍'],
      liu: ['유비', '관우', '장비', '간옹'], sun: ['손견', '정보', '황개', '한당', '조무'], dong: ['동탁', '이유', '이각', '곽사', '장제', '번조', '화웅'], ma: ['한수', '마등', '변장'],
    },
  },
  {
    id: 's189', name: '반동탁 연합', year: 189, desc: '동탁이 낙양을 장악했다. 제후들이 연합해 맞선다.', early: true, rulers: { sun: '손견', zhang: '유언' },
    pacts: [['yuan', 'cao'], ['yuan', 'shu'], ['cao', 'sun'], ['shu', 'sun'], ['cao', 'liu'], ['liu', 'gong']], pactMonths: 24,
    own: {
      dong: ['낙양', '장안', '천수', '진양'], yuan: ['남피', '업'], cao: ['진류'], shu: ['완', '여남'], sun: ['장사'], liu: ['평원'], gong: ['북평'],
      biao: ['양양', '강릉'], zhang: ['성도', '강주', '영안', '한중'], ma: ['무위'], tao: ['하비', '수춘'],
    },
    off: {
      dong: ['동탁', '이유', '화웅', '이각', '곽사', '장제', '번조', '여포', '고순', '장료', '가후', '서영'], yuan: ['원소', '전풍', '안량', '문추', '저수', '심배', '곽도', '장합', '고람'],
      cao: ['조조', '하후돈', '하후연', '조인', '조홍', '악진', '전위', '우금'], shu: ['원술', '기령', '장훈'], sun: ['손견', '정보', '황개', '한당', '조무'], liu: ['유비', '관우', '장비', '간옹'],
      gong: ['공손찬', '전예', '조운'], biao: ['유표', '채모', '괴월', '문빙', '황충', '황조'], zhang: ['유언', '유장', '장임', '엄안', '황권', '장송'], ma: ['마등', '한수', '방덕'], tao: ['도겸', '미축', '조표', '진등'],
    },
    gone: ['장각', '장보', '장량', '장만성', '파재', '정원지', '하진', '정원'],
  },
  { id: 's194', name: '군웅할거', year: 194, desc: '아홉 세력이 천하를 다툰다. 빈 땅이 많다.' },
  {
    id: 's200', name: '관도 전야', year: 200, desc: '하북의 원소와 중원의 조조가 맞선다.',
    own: {
      cao: ['허창', '진류', '복양', '낙양', '하비', '완', '수춘', '북해'], yuan: ['업', '남피', '평원', '진양', '북평'], liu: ['여남'],
      sun: ['건업', '오', '시상'], biao: ['양양', '강릉', '장사', '강하'], zhang: ['성도', '강주', '영안'], ma: ['무위', '천수', '장안'],
    },
    off: {
      cao: ['조조', '하후돈', '하후연', '순욱', '조인', '조홍', '정욱', '악진', '순유', '곽가', '가후', '서황', '허저', '우금', '장료', '장수'],
      yuan: ['원소', '전풍', '안량', '장합', '문추', '저수', '심배', '곽도', '고람'], liu: ['유비', '관우', '장비', '미축', '간옹', '조운'],
      sun: ['손책', '주유', '장소', '정보', '손권', '한당', '황개', '태사자', '주태', '여몽', '노숙'],
      biao: ['유표', '채모', '괴월', '문빙', '황충', '위연', '황조', '감녕'], zhang: ['유장', '장임', '법정', '황권', '장송', '엄안', '이엄'],
      ma: ['마등', '마초', '방덕', '한수', '마대'],
    },
    gone: ['여포', '진궁', '고순', '공손찬', '전위', '기령'],
  },
  {
    id: 's207', name: '적벽 전야', year: 207, desc: '북방을 평정한 조조가 남쪽을 노린다.', rulers: { sun: '손권' },
    own: {
      cao: ['허창', '진류', '복양', '낙양', '업', '남피', '평원', '진양', '북평', '북해', '하비', '수춘', '여남', '완', '장안'],
      liu: ['강하'], sun: ['건업', '오', '시상'], biao: ['양양', '강릉', '장사'], zhang: ['성도', '강주', '영안'], ma: ['무위', '천수'],
    },
    off: {
      cao: ['조조', '하후돈', '하후연', '순욱', '조인', '조홍', '정욱', '악진', '순유', '가후', '서황', '허저', '우금', '장료', '장합', '고람', '사마의'],
      liu: ['유비', '관우', '장비', '미축', '간옹', '조운', '제갈량', '서서'],
      sun: ['손권', '주유', '장소', '정보', '한당', '황개', '주태', '여몽', '노숙', '감녕', '육손'],
      biao: ['유표', '채모', '괴월', '문빙', '황충', '위연', '마량'], zhang: ['유장', '장임', '법정', '황권', '장송', '엄안', '이엄'],
      ma: ['마등', '마초', '방덕', '한수', '마대'],
    },
    gone: ['여포', '진궁', '고순', '공손찬', '전위', '기령', '손책', '원소', '전풍', '안량', '문추', '저수', '심배', '곽도', '곽가', '태사자', '황조', '장수'],
  },
  {
    id: 's215', name: '삼국정립', year: 215, desc: '천하가 셋으로 나뉘었다.', rulers: { sun: '손권' },
    own: {
      cao: ['북평', '남피', '업', '평원', '진양', '복양', '진류', '허창', '낙양', '장안', '천수', '무위', '한중', '완', '여남', '수춘', '하비', '북해', '양양'],
      liu: ['성도', '강주', '영안', '강릉', '장사'], sun: ['건업', '오', '시상', '강하'],
    },
    off: {
      cao: ['조조', '하후돈', '하후연', '조인', '조홍', '정욱', '악진', '가후', '서황', '허저', '우금', '장료', '장합', '사마의', '방덕'],
      liu: ['유비', '관우', '장비', '미축', '간옹', '조운', '제갈량', '황충', '위연', '법정', '황권', '엄안', '이엄', '마초', '마대', '마량'],
      sun: ['손권', '장소', '정보', '한당', '황개', '주태', '여몽', '감녕', '육손'],
    },
    gone: ['여포', '진궁', '고순', '공손찬', '전위', '기령', '손책', '원소', '전풍', '안량', '문추', '저수', '심배', '곽도', '곽가', '태사자', '황조', '장수',
      '순욱', '순유', '주유', '노숙', '방통', '유표', '채모', '괴월', '문빙', '유장', '장임', '장송', '마등', '한수', '공융', '고람', '서서'],
  },
];

function applyScenarioNames(sc) {
  FACTIONS.forEach(f => {
    const ruler = (sc.rulers && sc.rulers[f.id]) || BASE_FACTION[f.id].ruler;
    f.ruler = ruler;
    f.name = ruler === BASE_FACTION[f.id].ruler ? BASE_FACTION[f.id].name : ruler + '군';
  });
}
const scenarioOf = id => SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
function scenarioFactions(sc) {
  return FACTIONS.filter(f => (sc.own ? !!sc.own[f.id] : CITY_DEF.some(d => d[3] === f.id)));
}

function setupScenario(sc) {
  applyScenarioNames(sc);
  G.scenario = sc.id;
  G.year = sc.year;
  G.cities.forEach(c => {
    Object.assign(c, { tax: 1, flood: ri(30, 60), horse: c.owner ? 9000 : 0, bow: c.owner ? 9000 : 0, gov: null, deleg: false });
  });
  if (sc.early) {
    EARLY_OFFICERS.forEach(d => G.officers.push({
      id: G.officers.length, name: d[0], faction: null, city: CNAME.indexOf(d[2]), st: d.slice(3, 8), acted: false, ruler: false, dead: false,
    }));
  }
  G.officers.forEach(o => {
    o.loyal = ri(62, 92);
    o.die = sc.year + ri(14, 48);
  });
  if (sc.own) {
    const def = {};
    CITY_DEF.forEach(d => { def[d[0]] = d[8]; });
    G.cities.forEach(c => { c.owner = null; c.troops = 0; c.train = 0; c.gold = 500; c.food = 8000; c.horse = 0; c.bow = 0; c.loyal = 50; });
    Object.entries(sc.own).forEach(([f, names]) => names.forEach(n => {
      Object.assign(G.cities[CNAME.indexOf(n)], {
        owner: f, troops: Math.max(def[n], 9000) + (names.length <= 5 ? 7000 : 0) + ((sc.bonus && sc.bonus[f]) || 0), train: 55, gold: 2000, food: 30000, horse: 9000, bow: 9000, loyal: 62,
      });
    }));
    G.officers.forEach(o => { o.faction = null; o.ruler = false; });
    (sc.gone || []).forEach(n => {
      const o = G.officers.find(x => x.name === n);
      if (o) { o.dead = true; o.city = -1; }
    });
    Object.entries(sc.off).forEach(([f, names]) => {
      const cs = sc.own[f].map(n => CNAME.indexOf(n));
      names.forEach((n, i) => {
        const o = G.officers.find(x => x.name === n);
        if (!o) return;
        o.dead = false; o.faction = f; o.city = cs[i % cs.length]; o.ruler = n === F[f].ruler;
      });
    });
  }
  if (!sc.own) G.officers.forEach(o => { o.ruler = !!o.faction && F[o.faction].ruler === o.name; });
  G.officers.forEach(o => {
    if (o.ruler) o.loyal = 100;
    const y = DEBUT[o.name];
    if (sc.early && y > sc.year && !o.faction && !o.dead) {
      o.debut = y; o.debutCity = o.city; o.dead = true; o.city = -1; o.die = y + ri(25, 50);
    }
  });
  (sc.pacts || []).forEach(([a, b]) => {
    G.allies.push({ a, b, until: now() + sc.pactMonths, kind: 'ally' });
    addRel(a, b, 20);
  });
  setupFeatures(sc);
}

function addCustomOfficer(cu) {
  const city = G.cities.find(c => c.owner === G.player);
  G.officers.push({
    id: G.officers.length, name: cu.name, faction: G.player, city: city.id, st: cu.st, acted: false,
    ruler: false, dead: false, loyal: 100, die: G.year + 60, custom: true,
  });
}

// ===================== 관계·직책 =====================
const relKey = (a, b) => (a < b ? a + '|' + b : b + '|' + a);
const getRel = (a, b) => { const v = G.rel[relKey(a, b)]; return v === undefined ? 50 : v; };
const addRel = (a, b, d) => { G.rel[relKey(a, b)] = clamp(getRel(a, b) + d, 0, 100); };
const validOff = (id, f) => { const o = G.officers[id]; return o && !o.dead && o.faction === f ? o : null; };
const getAdvisor = f => (G.advisor[f] === undefined ? null : validOff(G.advisor[f], f));
function getGov(c) {
  const o = c.gov === null ? null : validOff(c.gov, c.owner);
  return o && o.city === c.id ? o : null;
}
function dist(a, b) {
  if (a === b) return 0;
  const d = { [a]: 0 }, q = [a];
  while (q.length) {
    const x = q.shift();
    for (const n of ADJ[x]) if (d[n] === undefined) { d[n] = d[x] + 1; if (n === b) return d[n]; q.push(n); }
  }
  return 99;
}
const canSee = (f, c) => c.owner === f || (c.owner && isAllied(f, c.owner)) || (G.spy[f + ':' + c.id] || 0) > now();

// 군사의 예측: 지략이 낮을수록 빗나간다
function advise(f, p) {
  const a = getAdvisor(f);
  if (!a) return '군사가 없어 가늠할 수 없습니다.';
  const err = (100 - a.st[2]) / 100 * 0.9 * rnd(-1, 1);
  const q = p + err;
  const word = q >= 0.75 ? '틀림없이 성공합니다' : q >= 0.5 ? '해볼 만합니다' : q >= 0.3 ? '쉽지 않습니다' : '그만두시는 편이 낫습니다';
  return `군사 ${a.name}: "${word}."`;
}

// ===================== 인사 =====================
function actReward(c, o) {
  if (c.gold < 200) return fail('금이 부족합니다. (200 필요)');
  if (o.ruler) return fail('군주에게는 포상할 수 없습니다.');
  if (o.loyal >= 100) return fail(`${o.name}의 충성은 이미 최고입니다.`);
  c.gold -= 200;
  const inc = ri(6, 12);
  o.loyal = clamp(o.loyal + inc, 0, 100);
  return ok(`${o.name}에게 금 200을 내렸습니다. 충성 +${inc} (현재 ${o.loyal})`);
}
function tryRecruit(o, f) {
  const p = clamp(rulerCharm(f) / 170 + (100 - o.loyal) / 220 - (o.ruler ? 0.3 : 0) + kinAdj(o, f), 0.05, 0.92);
  if (Math.random() >= p) return false;
  o.faction = f; o.ruler = false; o.loyal = ri(50, 70); o.acted = true;
  return true;
}
function succeed(f) {
  const c = G.officers.filter(o => o.faction === f && !o.dead).sort((a, b) => (b.st[4] + b.st[0]) - (a.st[4] + a.st[0]))[0];
  if (!c) return;
  c.ruler = true; c.loyal = 100; F[f].ruler = c.name;
  log(`${c.name}이(가) ${F[f].name}의 뒤를 이었습니다.`, 'big');
}
function killOfficer(o, why) {
  const f = o.faction, wasRuler = o.ruler;
  o.dead = true; o.ruler = false; o.faction = null; o.city = -1;
  if (f) log(`${F[f].name}의 ${o.name}이(가) ${why}.`, wasRuler ? 'big' : '');
  if (f && wasRuler) succeed(f);
}

async function handleCaptives(list, winner, loser, city, refuge) {
  for (const o of list) {
    if (o.dead) continue;
    let act;
    if (winner === G.player && UI) act = await UI.captive(o, winner);
    else act = o.loyal < 70 || rulerCharm(winner) > 80 ? 'recruit' : 'free';
    if (act === 'kill') {
      killOfficer(o, '처형되었습니다');
      if (loser && alive(loser)) addRel(winner, loser, -15);
      continue;
    }
    if (act === 'recruit' && tryRecruit(o, winner)) {
      o.city = city.id;
      log(`사로잡힌 ${o.name}이(가) ${F[winner].name}에 투항했습니다.`);
      continue;
    }
    if (act === 'recruit') log(`${o.name}이(가) 투항을 거부했습니다.`);
    if (loser && o.faction === loser && refuge.length) {
      o.city = refuge[ri(0, refuge.length - 1)].id;
      addRel(winner, loser, 3);
    } else { o.faction = null; o.ruler = false; }
  }
}

// ===================== 계략 =====================
const SCHEME = {
  rumor: { n: '유언비어', cost: 200, d: '민심과 인구를 떨어뜨립니다.' },
  fire: { n: '방화', cost: 300, d: '금·군량을 태우고 성벽을 허뭅니다.' },
  sow: { n: '이간', cost: 200, d: '적장의 충성을 떨어뜨립니다.', off: true },
  lure: { n: '회유', cost: 500, d: '적장을 아군으로 끌어들입니다.', off: true },
  spy: { n: '첩자', cost: 100, d: '12개월간 그 도시의 내부를 살핍니다.' },
};
function schemeChance(o, kind, c, t) {
  const guard = Math.max(30, ...cityOfficers(c.id).map(x => x.st[2]));
  let p = 0.5 + (o.st[2] - guard) / 90;
  if (kind === 'spy') p += 0.3;
  if (kind === 'sow' && t) p += (70 - t.loyal) / 200;
  if (kind === 'lure' && t) p = 0.15 + (o.st[4] + rulerCharm(o.faction) - 120) / 250 + (65 - t.loyal) / 80 + kinAdj(t, o.faction);
  return clamp(p, 0.05, 0.95);
}
function actScheme(o, kind, c, t) {
  const home = G.cities[o.city], s = SCHEME[kind];
  if (!c.owner || !isHostile(o.faction, c)) return fail('대상이 될 수 없는 도시입니다.');
  if (dist(o.city, c.id) > 2) return fail('너무 멀리 있는 도시입니다. (2칸 이내)');
  if (home.gold < s.cost) return fail(`금이 부족합니다. (${s.cost} 필요)`);
  if (s.off && (!t || t.dead || t.faction !== c.owner || t.city !== c.id)) return fail('대상 무장이 없습니다.');
  if (kind === 'lure' && t.ruler) return fail('군주는 회유할 수 없습니다.');
  home.gold -= s.cost; o.acted = true;
  if (Math.random() >= schemeChance(o, kind, c, t)) {
    addRel(o.faction, c.owner, -4);
    return ok(`${o.name}의 ${s.n}이(가) ${c.name}에서 발각되어 실패했습니다.`);
  }
  addRel(o.faction, c.owner, -2);
  if (kind === 'rumor') {
    const d = ri(6, 14); c.loyal = Math.max(0, c.loyal - d); c.pop = Math.max(10000, Math.round(c.pop * 0.97));
    return ok(`${o.name}: ${c.name}에 소문이 퍼져 민심 -${d}`);
  }
  if (kind === 'fire') {
    const g = Math.round(c.gold * 0.25), fd = Math.round(c.food * 0.25);
    c.gold -= g; c.food -= fd; c.wall = Math.max(0, c.wall - 5);
    return ok(`${o.name}: ${c.name}에 불을 놓아 금 ${num(g)}, 군량 ${num(fd)} 소실`);
  }
  if (kind === 'sow') {
    const d = ri(10, 22); t.loyal = Math.max(0, t.loyal - d);
    return ok(`${o.name}: ${t.name}과(와) 주군 사이를 벌려 놓았습니다. (충성 -${d})`);
  }
  if (kind === 'lure') {
    t.faction = o.faction; t.city = o.city; t.loyal = ri(50, 70); t.acted = true;
    return ok(`${o.name}의 설득으로 ${t.name}이(가) 귀순했습니다!`);
  }
  G.spy[o.faction + ':' + c.id] = now() + 12;
  return ok(`${o.name}: ${c.name}에 첩자를 심었습니다.`);
}

// ===================== 외교 =====================
const power = f => factionCities(f).reduce((s, c) => s + c.troops, 0) + factionCities(f).length * 3000;
function actGift(o, t) {
  const c = G.cities[o.city];
  if (c.gold < 500) return fail('금이 부족합니다. (500 필요)');
  c.gold -= 500; o.acted = true;
  const d = Math.round(6 + o.st[4] / 12);
  addRel(o.faction, t, d);
  return ok(`${o.name}이(가) ${F[t].name}에 예물을 보냈습니다. (우호 +${d}, 현재 ${getRel(o.faction, t)})`);
}
function actTruce(o, t) {
  const c = G.cities[o.city];
  if (c.gold < 200) return fail('금이 부족합니다. (200 필요)');
  if (isAllied(o.faction, t)) return fail('이미 협정 중입니다.');
  c.gold -= 200; o.acted = true;
  if (Math.random() < clamp(0.2 + getRel(o.faction, t) / 120 + o.st[2] / 500, 0.1, 0.9)) {
    G.allies.push({ a: o.faction, b: t, until: now() + 6, kind: 'truce' });
    return ok(`${F[t].name}과(와) 6개월 정전했습니다.`);
  }
  return ok(`${F[t].name}이(가) 정전을 거절했습니다.`);
}
function actBreak(f, t) {
  const n = G.allies.length;
  G.allies = G.allies.filter(x => !((x.a === f && x.b === t) || (x.a === t && x.b === f)));
  if (n === G.allies.length) return fail('맺은 협정이 없습니다.');
  addRel(f, t, -25);
  return ok(`${F[t].name}과(와)의 협정을 파기했습니다. (우호 -25)`);
}
function surrenderChance(f, t) { return clamp((power(f) / Math.max(1, power(t)) - 3) * 0.1 + getRel(f, t) / 400, 0, 0.7); }
function actSurrender(o, t) {
  const c = G.cities[o.city], f = o.faction;
  if (c.gold < 300) return fail('금이 부족합니다. (300 필요)');
  if (power(f) < power(t) * 3) return fail('세력 차이가 3배 이상이어야 합니다.');
  c.gold -= 300; o.acted = true;
  if (Math.random() >= surrenderChance(f, t)) { addRel(f, t, -8); return ok(`${F[t].name}이(가) 항복 권고를 물리쳤습니다.`); }
  factionCities(t).forEach(x => { x.owner = f; x.deleg = false; });
  G.officers.forEach(x => { if (x.faction === t && !x.dead) { x.faction = f; x.ruler = false; x.loyal = ri(50, 70); } });
  G.allies = G.allies.filter(x => x.a !== t && x.b !== t);
  log(`${F[t].name}이(가) ${F[f].name}에 항복했습니다!`, 'big');
  if (G.player && G.cities.every(x => x.owner === G.player)) G.over = 'win';
  return ok(`${F[t].name}이(가) 항복했습니다!`);
}

// ===================== 상인 =====================
const foodRate = () => 10 / G.price;
function actTrade(o, kind, n) {
  const c = G.cities[o.city];
  n = Math.floor(n);
  if (!(n > 0)) return fail('수량을 입력하세요.');
  if (kind === 'sell') {
    if (c.food < n) return fail('군량이 부족합니다.');
    const g = Math.floor(n / foodRate() * 0.8);
    c.food -= n; c.gold += g; o.acted = true;
    return ok(`군량 ${num(n)}을(를) 팔아 금 ${num(g)}을(를) 얻었습니다.`);
  }
  if (c.gold < n) return fail('금이 부족합니다.');
  c.gold -= n; o.acted = true;
  if (kind === 'food') { const q = Math.floor(n * foodRate()); c.food += q; return ok(`금 ${num(n)}으로 군량 ${num(q)} 구입`); }
  const q = n * 2;
  c[kind] += q;
  return ok(`금 ${num(n)}으로 ${kind === 'horse' ? '군마' : '강노'} ${num(q)} 구입`);
}

// ===================== AI 전략 =====================
function aiStrategy(f) {
  const offs = G.officers.filter(o => o.faction === f && !o.dead);
  if (!offs.length) return;
  featureAI(f);
  if (!getAdvisor(f)) G.advisor[f] = offs.reduce((a, b) => (b.st[2] > a.st[2] ? b : a)).id;
  factionCities(f).forEach(c => {
    c.tax = c.loyal < 40 ? 0 : c.loyal > 70 ? 2 : 1;
    const here = cityOfficers(c.id);
    if (!getGov(c) && here.length) c.gov = here.reduce((a, b) => (b.st[3] > a.st[3] ? b : a)).id;
    here.filter(o => !o.ruler && o.loyal < 55 && c.gold >= 500).slice(0, 1).forEach(o => actReward(c, o));
    if (c.troops > 5000) {
      if (c.horse < 6000 && c.gold > 1500) { c.gold -= 300; c.horse += 600; }
      if (c.bow < 6000 && c.gold > 1500) { c.gold -= 300; c.bow += 600; }
    }
    if (c.food < c.troops * 0.6 && c.gold > 800) { c.gold -= 400; c.food += Math.floor(400 * foodRate()); }
  });
  const free = offs.filter(o => !o.acted && !o.ruler);
  if (!free.length) return;
  const o = free.reduce((a, b) => (b.st[2] > a.st[2] ? b : a));
  const home = G.cities[o.city];
  const foes = G.cities.filter(c => c.owner && isHostile(f, c) && dist(o.city, c.id) <= 2);
  if (foes.length && o.st[2] >= 70 && home.gold >= 800 && Math.random() < 0.15) {
    const c = foes[ri(0, foes.length - 1)];
    const r = actScheme(o, Math.random() < 0.5 ? 'rumor' : 'fire', c);
    if (c.owner === G.player) log(`${F[f].name}: ${r.msg}`, 'war');
  } else if (home.gold >= 1200 && Math.random() < 0.06) {
    const others = FACTIONS.filter(x => x.id !== f && x.id !== G.player && alive(x.id) && !isAllied(f, x.id));
    if (others.length) {
      const t = others.sort((a, b) => getRel(f, b.id) - getRel(f, a.id))[0].id;
      const r = getRel(f, t) >= 55 ? actAlliance(o, t) : actGift(o, t);
      if (r.msg.includes('동맹을 맺')) log(`${F[f].name}: ${r.msg}`, 'sys');
    }
  }
}

// ===================== 월별 사건 =====================
const TAX = [{ n: '낮음', gold: 0.7, food: 0.85, loyal: 1 }, { n: '보통', gold: 1, food: 1, loyal: 0 }, { n: '높음', gold: 1.4, food: 1.2, loyal: -2 }];

function disaster(c) {
  const mine = c.owner === G.player, m = G.month, say = (t, cls) => { if (mine) log(`${c.name}: ${t}`, cls || 'war'); };
  const roll = Math.random();
  if (m >= 6 && m <= 8 && roll < 0.4) {
    const k = (100 - c.flood) / 100;
    if (Math.random() < k) {
      c.pop = Math.max(10000, Math.round(c.pop * (1 - 0.08 * k))); c.farm = Math.max(0, c.farm - Math.round(8 * k)); c.food = Math.round(c.food * (1 - 0.3 * k));
      say('홍수가 났습니다!');
    } else say('큰비가 왔으나 제방이 버텼습니다.', 'sys');
  } else if (m >= 7 && m <= 9 && roll < 0.65) {
    c.food = Math.round(c.food * 0.7); c.farm = Math.max(0, c.farm - 3); say('메뚜기 떼가 들판을 휩쓸었습니다!');
  } else if ((m <= 3 || m === 12) && roll < 0.4) {
    c.pop = Math.max(10000, Math.round(c.pop * 0.94)); c.troops = Math.round(c.troops * 0.93); say('역병이 돕니다!');
  } else if (c.loyal < 45 && roll < 0.8) {
    c.gold = Math.round(c.gold * 0.85); c.troops = Math.round(c.troops * 0.97); c.loyal = Math.max(0, c.loyal - 2); say('도적 떼가 창궐합니다!');
  } else if (m === 8 && roll > 0.8) {
    c.food += c.farm * 150; say('풍년의 조짐이 보입니다.', 'sys');
  }
}

// 황건 봉기 시나리오: 한 조정은 황건군만 토벌하다가 189년에 무너져 군웅으로 갈라진다
const HAN_HEIRS = { 낙양: 'dong', 장안: 'dong', 진양: 'dong', 진류: 'cao', 성도: 'zhang', 강주: 'zhang', 영안: 'zhang', 한중: 'zhang', 양양: 'biao', 강릉: 'biao', 장사: 'biao', 강하: 'biao', 건업: 'sun', 오: 'sun', 시상: 'sun', 완: 'shu', 여남: 'shu', 수춘: 'shu', 업: 'yuan', 평원: 'yuan', 복양: 'yuan', 남피: 'gong', 북해: 'tao' };
const HAN_FOLLOW = { 유표: 'biao', 채모: 'biao', 괴월: 'biao', 문빙: 'biao', 황충: 'biao', 유언: 'zhang', 유장: 'zhang', 장임: 'zhang', 엄안: 'zhang', 황권: 'zhang', 여포: 'dong', 장료: 'dong', 고순: 'dong', 원소: 'yuan', 원술: 'shu', 도겸: 'tao', 공손찬: 'gong' };
const hanIsPassive = () => G.scenario === 's184' && !G.collapsed && G.player !== 'han';
const aiMayAttack = (f, t) => !(t.owner && t.owner === G.player && now() < G.graceUntil) && (f !== 'han' || !hanIsPassive() || !t.owner || t.owner === 'huang');
function hanCollapse() {
  G.collapsed = true;
  const people = G.officers.filter(o => o.faction === 'han' && !o.dead);
  const can = f => alive(f) || people.some(o => o.name === F[f].ruler);
  factionCities('han').forEach(c => {
    const h = HAN_HEIRS[c.name];
    c.owner = h && can(h) ? h : null;
    if (!c.owner) c.troops = 0;
    c.gov = null; c.deleg = false;
  });
  people.forEach(o => {
    const h = HAN_FOLLOW[o.name], cs = h ? factionCities(h) : [];
    o.ruler = false;
    if (o.name === '하진') { o.dead = true; o.faction = null; o.city = -1; return; }
    if (cs.length) { o.faction = h; o.city = cs[0].id; o.ruler = o.name === F[h].ruler; o.loyal = o.ruler ? 100 : ri(60, 85); } else o.faction = null;
  });
  G.allies = G.allies.filter(x => x.a !== 'han' && x.b !== 'han');
  log('황실이 무너졌습니다. 천하가 군웅의 손으로 갈라집니다!', 'big');
}

function monthExtras() {
  featureMonth();
  if (hanIsPassive() && G.year >= 189) { if (alive('han')) hanCollapse(); else G.collapsed = true; }
  G.officers.forEach(o => {
    if (o.debut && o.debut <= G.year) { o.dead = false; o.city = o.debutCity; delete o.debut; delete o.debutCity; }
  });
  G.price = clamp(G.price + rnd(-0.12, 0.12) - (G.month === 9 ? 0.15 : 0), 0.6, 1.6);
  for (const c of G.cities) {
    if (!c.owner) continue;
    c.loyal = clamp(c.loyal + TAX[c.tax].loyal, 0, 100);
    const g = getGov(c);
    if (g && Math.random() < g.st[3] / 300) {
      const k = ['farm', 'trade', 'loyal', 'flood'][ri(0, 3)];
      c[k] = clamp(c[k] + 1, 0, 100);
    }
  }
  if (Math.random() < 0.45) {
    const owned = G.cities.filter(c => c.owner);
    if (owned.length) disaster(owned[ri(0, owned.length - 1)]);
  }
  for (const o of G.officers) {
    if (o.dead) continue;
    if (G.year >= o.die && Math.random() < 0.08) { if (o.faction) killOfficer(o, '세상을 떠났습니다'); else { o.dead = true; o.city = -1; } continue; }
    if (!o.faction || o.ruler) continue;
    if (Math.random() < 0.15) o.loyal = clamp(o.loyal + (rulerCharm(o.faction) >= 75 ? 1 : -1), 0, 100);
    if (o.loyal < 35 && Math.random() < 0.07) {
      const f = o.faction, foes = ADJ[o.city].map(i => G.cities[i]).filter(c => c.owner && c.owner !== f);
      if (foes.length && Math.random() < 0.5) {
        const c = foes[ri(0, foes.length - 1)];
        o.faction = c.owner; o.city = c.id; o.loyal = ri(50, 70);
        log(`${F[f].name}의 ${o.name}이(가) ${F[c.owner].name}(으)로 넘어갔습니다!`, 'war');
      } else { o.faction = null; log(`${F[f].name}의 ${o.name}이(가) 관직을 버리고 떠났습니다.`, 'war'); }
    }
  }
  // 인재의 자진 출사, 무장이 없는 세력 구제
  FACTIONS.forEach(f => {
    if (!alive(f.id)) return;
    const none = !G.officers.some(o => o.faction === f.id && !o.dead);
    if (!none && Math.random() > 0.04) return;
    const cs = factionCities(f.id).map(c => c.id);
    const pool = G.officers.filter(o => !o.faction && !o.dead && (none || cs.includes(o.city)));
    if (!pool.length) return;
    const o = pool[ri(0, pool.length - 1)];
    o.faction = f.id; o.loyal = ri(60, 80);
    if (!cs.includes(o.city)) o.city = cs[0];
    if (none) { o.ruler = true; o.loyal = 100; F[f.id].ruler = o.name; }
    log(`${o.name}이(가) ${F[f.id].name}을(를) 찾아와 출사했습니다.`, f.id === G.player ? 'big' : '');
  });
}

// ===================== 화면: 초상·효과음 =====================
function portrait(o, size) {
  let h = 7;
  for (const ch of o.name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const pick = a => { h = (h * 16807 + 11) % 2147483647; return a[h % a.length]; };
  const skin = pick(['#e8c39e', '#dfb48a', '#d2a273', '#eccdaa']), hair = pick(['#231a14', '#3a2a1c', '#4a3626', '#2c2c34']);
  const hat = o.st[1] >= o.st[2] ? pick(['#8a2d22', '#3f5f8c', '#7a6a2a', '#555d66']) : pick(['#2e3f55', '#4b3a63', '#27564a', '#f0e8d4']);
  const px = [];
  const put = (x, y, w, h2, c) => px.push(`<rect x="${x}" y="${y}" width="${w}" height="${h2}" fill="${c}"/>`);
  put(0, 0, 12, 12, '#3a3226'); put(1, 9, 10, 3, hat); put(3, 2, 6, 7, skin); put(2, 3, 1, 4, hair); put(9, 3, 1, 4, hair);
  put(2, 0, 8, 3, hat); put(5, 0, 2, 1, '#d9b25a');
  put(4, 5, 1, 1, '#1a1410'); put(7, 5, 1, 1, '#1a1410'); put(4, 4, 1, 1, hair); put(7, 4, 1, 1, hair); put(5, 7, 2, 1, '#a0614a');
  if (o.st[0] + o.st[1] > 150) { put(4, 8, 4, 1, hair); put(5, 9, 2, 2, hair); }
  return `<svg class="face" width="${size}" height="${size}" viewBox="0 0 12 12" shape-rendering="crispEdges">${px.join('')}</svg>`;
}

// ===================== 화면: 명령 아이콘 =====================
const CMD_ICONS = {
  farm: '<rect x="1" y="11" width="14" height="4" fill="#8a5a2c"/><path d="M2 12h2v1H2zM7 13h2v1H7zM12 12h2v1h-2z" fill="#5f3d1c"/><rect x="7" y="5" width="2" height="6" fill="#5fae4c"/><path d="M8 7C5 7 3 5 3 2c3 0 5 2 5 5zM8 6c0-3 2-5 5-5 0 3-2 5-5 5z" fill="#7fcb62"/>',
  trade: '<circle cx="8" cy="8" r="6.5" fill="#e0b84a" stroke="#8f6c1e"/><circle cx="8" cy="8" r="4.6" fill="none" stroke="#b98f2c" stroke-width=".7"/><rect x="6.5" y="6.5" width="3" height="3" fill="#3d3327" stroke="#8f6c1e" stroke-width=".6"/>',
  wall: '<path d="M1 15V3h3v2h2V3h4v2h2V3h3v12z" fill="#a39b8a" stroke="#4d463a"/><path d="M1.500 8h13M1.500 11.500h4M10.500 11.500h4M4 8v3.500M12 8v3.500" stroke="#6f685a" fill="none"/><path d="M6 15v-3a2 2 0 0 1 4 0v3z" fill="#3a2a1c"/>',
  loyal: '<rect x="7" y="0" width="2" height="2" fill="#8f7a52"/><rect x="5" y="2" width="6" height="1.500" fill="#5f3d1c"/><rect x="3.500" y="3.500" width="9" height="8" rx="3" fill="#e0603f" stroke="#8a2d22"/><rect x="6.500" y="5" width="3" height="5" rx="1.500" fill="#ffd77a"/><rect x="5" y="11.500" width="6" height="1.500" fill="#5f3d1c"/><rect x="7" y="13" width="2" height="3" fill="#d9b25a"/>',
  flood: '<rect x="1" y="1" width="14" height="4" fill="#9a8763" stroke="#5f5238"/><path d="M1 8.500q1.750-2 3.500 0t3.500 0 3.500 0 3.500 0M1 12q1.750-2 3.500 0t3.500 0 3.500 0 3.500 0" fill="none" stroke="#62b4dc" stroke-width="1.800" stroke-linecap="round"/>',
  recruit: '<path d="M1 15c0-4 2-5 4.500-5S10 11 10 15z" fill="#4f7fe0"/><circle cx="5.500" cy="6.500" r="3" fill="#e8c39e"/><path d="M2.300 6a3.200 3.200 0 0 1 6.400 0z" fill="#b3372b"/><rect x="5" y="1" width="1" height="2" fill="#d9b25a"/><path d="M12 3v6M9 6h6" stroke="#7fcb62" stroke-width="2"/>',
  train: '<circle cx="8" cy="8" r="7" fill="#f0e8d4" stroke="#6b5632"/><circle cx="8" cy="8" r="4.600" fill="#c9412f"/><circle cx="8" cy="8" r="2.600" fill="#f0e8d4"/><circle cx="8" cy="8" r="1.100" fill="#c9412f"/>',
  attack: '<path d="M2 2l10 10M14 2L4 12" stroke="#e4e8ec" stroke-width="2"/><path d="M9 13l4-4M3 9l4 4" stroke="#d9b25a" stroke-width="1.800"/><path d="M12 12l2.500 2.500M4 12l-2.500 2.500" stroke="#7a4b24" stroke-width="2"/>',
  move: '<path d="M1 6h7V2l7 6-7 6v-4H1z" fill="#7fcb62" stroke="#3f7a35" stroke-linejoin="round"/>',
  search: '<circle cx="6.500" cy="6.500" r="4.500" fill="#a9d6e5" stroke="#e4e8ec" stroke-width="2"/><path d="M10 10l4.500 4.500" stroke="#a8743c" stroke-width="2.600" stroke-linecap="round"/>',
  scheme: '<path d="M8 11L1 5c3-4 11-4 14 0z" fill="#f0e8d4" stroke="#8f8468"/><path d="M8 11L4.500 2.800M8 11V2M8 11l3.500-8.200" stroke="#a89a80" stroke-width=".8"/><rect x="7" y="11" width="2" height="4.500" fill="#a8743c"/>',
  diplo: '<rect x="3" y="2" width="10" height="12" fill="#efe2bd" stroke="#8f7a52"/><rect x="1" y="1" width="14" height="2.500" rx="1" fill="#a8743c"/><rect x="1" y="12.500" width="14" height="2.500" rx="1" fill="#a8743c"/><path d="M5 6h6M5 8h6M5 10h3" stroke="#6b5632"/><rect x="9.500" y="9" width="2.500" height="2.500" fill="#c9412f"/>',
  trade2: '<path d="M6 4h4l1-3H5zM5.500 4C2 7 1 10 2 13c.500 1.500 2 2 3 2h6c1 0 2.500-.5 3-2 1-3 0-6-3.500-9z" fill="#c9a26a" stroke="#6b4a24"/><rect x="5.500" y="3.500" width="5" height="1.200" fill="#8a2d22"/><circle cx="8" cy="10" r="2.600" fill="#e0b84a" stroke="#8f6c1e"/>',
  reward: '<path d="M4 1h3l2 6H6zM12 1H9L7 7h3z" fill="#c9412f" stroke="#7a241b" stroke-width=".6"/><circle cx="8" cy="10.500" r="4.800" fill="#e0b84a" stroke="#8f6c1e"/><path d="M8 7.500l.9 1.900 2.100.3-1.500 1.400.4 2.100L8 12.200l-1.900 1 .4-2.100L5 9.700l2.100-.3z" fill="#fff0b8"/>',
  appoint: '<rect x="6" y="1" width="4" height="3" rx="1" fill="#a8743c"/><rect x="7" y="4" width="2" height="3" fill="#7a4b24"/><rect x="2.500" y="7" width="11" height="4" fill="#d9b25a" stroke="#8f6c1e"/><rect x="2" y="12" width="12" height="3" fill="#c9412f" stroke="#7a241b"/>',
  tax: '<rect x="1" y="2" width="14" height="12" fill="#3a2a1c" stroke="#a8743c" stroke-width="1.500"/><path d="M2 5.500h12M2 8h12M2 10.500h12" stroke="#a89a80" stroke-width=".7"/><path d="M4 4.500h2v2H4zM9 4.500h2v2H9zM6 7h2v2H6zM11 7h2v2h-2zM3 9.500h2v2H3zM8 9.500h2v2H8z" fill="#e0b84a"/>',
  deleg: '<path d="M3 1h7l3 3v11H3z" fill="#efe2bd" stroke="#8f7a52"/><path d="M10 1v3h3" fill="#d6c79c" stroke="#8f7a52"/><path d="M5 9.500l2.200 2.300L11 7" fill="none" stroke="#3f9a45" stroke-width="2"/>',
};
const cmdIcon = k => (CMD_ICONS[k] ? `<svg class="cicon" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">${CMD_ICONS[k]}</svg>` : '');

// ===================== 화면: 시작 =====================
let pendingScenario = 's194', pendingCustom = null;
function showStart() {
  if (typeof showMenuBg === 'function') showMenuBg();
  let has = false;
  try { has = !!localStorage.getItem(SAVE_KEY); } catch (e) { /* 무시 */ }
  openModal(`<h2>nation3</h2><p class="dim">시대를 고르세요. 모든 도시를 손에 넣으면 천하통일입니다.</p>
    ${has ? '<button class="wide" onclick="continueGame()">▶ 저장된 게임 이어하기</button>' : ''}
    <div class="flist">${SCENARIOS.map(s => `<button class="fbtn" onclick="showFactions('${s.id}')"><b>${s.year}년 ${s.name}</b><br><small>${s.desc}</small></button>`).join('')}</div>`);
}
function showFactions(id) {
  pendingScenario = id;
  const sc = scenarioOf(id);
  applyScenarioNames(sc);
  const count = f => (sc.own ? sc.own[f.id].length : CITY_DEF.filter(d => d[3] === f.id).length);
  openModal(`<h2>${sc.year}년 ${sc.name}</h2><p class="dim">이끌 세력을 고르세요.${pendingCustom ? ` 신무장 <b>${pendingCustom.name}</b>이(가) 합류합니다.` : ''}</p>
    <div class="flist">${scenarioFactions(sc).map(f => `<button class="fbtn" style="border-left:8px solid ${f.color}" onclick="startGame('${f.id}')"><b>${f.name}</b> <span class="dim">도시 ${count(f)}</span><br><small>군주 ${f.ruler}</small></button>`).join('')}</div>
    <div class="row"><button onclick="showCreate()">신무장 만들기</button><button onclick="showStart()">뒤로</button></div>`);
}
const CUSTOM_POINTS = 360;
function showCreate() {
  openModal(`<h2>신무장 만들기</h2><p class="dim">능력치 합계 ${CUSTOM_POINTS} 이하, 각 항목 1~95</p>
    <label>이름 <input id="cu_n" maxlength="6" value="${pendingCustom ? pendingCustom.name : ''}"></label>
    ${ST.map((s, i) => `<label>${s} <input id="cu_${i}" type="number" min="1" max="95" value="${pendingCustom ? pendingCustom.st[i] : 72}"></label>`).join('')}
    <div class="row"><button onclick="saveCustom()">확정</button><button onclick="showFactions(pendingScenario)">취소</button></div>`);
}
function saveCustom() {
  const name = $('cu_n').value.trim(), st = ST.map((s, i) => clamp(+$('cu_' + i).value | 0, 1, 95));
  if (!name || !/^[가-힣A-Za-z0-9]+$/.test(name)) return alertLine('이름은 한글·영문·숫자로 입력하세요.');
  const sum = st.reduce((a, b) => a + b, 0);
  if (sum > CUSTOM_POINTS) return alertLine(`합계가 ${sum}입니다. ${CUSTOM_POINTS} 이하로 줄이세요.`);
  pendingCustom = { name, st };
  showFactions(pendingScenario);
}

// ===================== 화면: 추가 명령 =====================
const fOpts = list => list.map(f => `<option value="${f.id}">${f.name} (우호 ${getRel(G.player, f.id)})</option>`).join('');

function schemeForm(id) {
  const o = G.officers[id];
  const ts = G.cities.filter(c => c.owner && isHostile(G.player, c) && dist(o.city, c.id) <= 2);
  if (!ts.length) return done(fail('2칸 안에 대상 도시가 없습니다.'));
  openModal(`<h2>계략 — ${o.name}</h2>
    <label>종류 <select id="sc_k" onchange="schemeRefresh(${id})">${Object.entries(SCHEME).map(([k, s]) => `<option value="${k}">${s.n} (금 ${s.cost})</option>`).join('')}</select></label>
    <label>도시 <select id="sc_c" onchange="schemeRefresh(${id})">${ts.map(c => `<option value="${c.id}">${c.name} (${fname(c.owner)})</option>`).join('')}</select></label>
    <label id="sc_ow">무장 <select id="sc_o" onchange="schemeRefresh(${id})"></select></label>
    <p class="dim" id="sc_d"></p><div class="flash" id="sc_a"></div>
    <div class="row"><button onclick="schemeGo(${id})">실행</button><button onclick="closeModal()">취소</button></div>`);
  schemeRefresh(id, true);
}
function schemeRefresh(id, first) {
  const o = G.officers[id], k = $('sc_k').value, c = G.cities[+$('sc_c').value], s = SCHEME[k];
  $('sc_ow').style.display = s.off ? '' : 'none';
  if (s.off && (first || document.activeElement !== $('sc_o'))) {
    $('sc_o').innerHTML = cityOfficers(c.id).filter(x => k !== 'lure' || !x.ruler).map(x => `<option value="${x.id}">${x.name}</option>`).join('');
  }
  const t = s.off ? G.officers[+$('sc_o').value] : null;
  $('sc_d').textContent = s.d;
  $('sc_a').textContent = s.off && !t ? '대상 무장이 없습니다.' : advise(G.player, schemeChance(o, k, c, t));
}
function schemeGo(id) {
  const k = $('sc_k').value, s = SCHEME[k];
  done(actScheme(G.officers[id], k, G.cities[+$('sc_c').value], s.off ? G.officers[+$('sc_o').value] : null));
}

function diploForm(id) {
  const fs = FACTIONS.filter(f => f.id !== G.player && alive(f.id));
  if (!fs.length) return done(fail('상대할 세력이 없습니다.'));
  openModal(`<h2>외교 — 사자 ${G.officers[id].name}</h2>
    <label>상대 <select id="dp_f">${fOpts(fs)}</select></label>
    <div class="cmds">
      <button onclick="diplo(${id},'gift')">예물<small>금 500</small></button><button onclick="diplo(${id},'ally')">동맹<small>금 500</small></button>
      <button onclick="diplo(${id},'truce')">정전<small>금 200</small></button><button onclick="diplo(${id},'sur')">항복 권고<small>금 300</small></button>
      <button onclick="diplo(${id},'marry')">혼인<small>금 1,000</small></button><button onclick="diplo(${id},'break')">협정 파기<small>무료</small></button></div>
    <div class="row"><button onclick="closeModal()">취소</button></div>`);
}
function diplo(id, k) {
  const o = G.officers[id], t = $('dp_f').value;
  done(k === 'gift' ? actGift(o, t) : k === 'ally' ? actAlliance(o, t) : k === 'truce' ? actTruce(o, t) : k === 'sur' ? actSurrender(o, t) : k === 'marry' ? actMarriage(o, t) : actBreak(G.player, t));
  if (G.over) showOver();
}

function tradeForm(id) {
  const c = G.cities[G.officers[id].city];
  openModal(`<h2>상인 — 시세 금 1 = 군량 ${foodRate().toFixed(1)}</h2>
    <p class="dim">금 ${num(c.gold)} · 군량 ${num(c.food)} · 군마 ${num(c.horse)} · 강노 ${num(c.bow)}<br>군마는 기병, 강노는 궁병 편성에 쓰입니다. 금 1당 2개를 삽니다.</p>
    <label>거래 <select id="tr_k"><option value="food">군량 사기 (금 입력)</option><option value="sell">군량 팔기 (군량 입력)</option><option value="horse">군마 사기 (금 입력)</option><option value="bow">강노 사기 (금 입력)</option></select></label>
    <label>수량 <input id="tr_n" type="number" min="1" step="100" value="500"></label>
    <div class="row"><button onclick="done(actTrade(G.officers[${id}], $('tr_k').value, +$('tr_n').value))">거래</button><button onclick="closeModal()">취소</button></div>`);
}

const EXTRA_CMD = {
  scheme: (c, offs) => pickOfficer('계략', offs, '지략이 높을수록 성공하기 쉽습니다.', o => schemeForm(o.id)),
  diplo: (c, offs) => pickOfficer('외교', offs, '지략과 인덕이 높은 사자가 유리합니다.', o => diploForm(o.id)),
  trade: (c, offs) => pickOfficer('상인', offs, '거래를 맡을 무장을 고르세요.', o => tradeForm(o.id)),
};
const FREE_CMD = {
  reward(c) {
    const l = cityOfficers(c.id).filter(o => !o.ruler);
    if (!l.length) { flash = '포상할 무장이 없습니다.'; return render(); }
    pickOfficer('포상 — 금 200', l, '충성이 낮은 무장은 떠나거나 적에게 넘어갑니다. ' + l.map(o => `${o.name} ${o.loyal}`).join(' · '), o => done(actReward(c, o)));
  },
  appoint(c) {
    const l = cityOfficers(c.id), a = getAdvisor(G.player), g = getGov(c);
    if (!l.length) { flash = '임명할 무장이 없습니다.'; return render(); }
    openModal(`<h2>임명</h2><p class="dim">현재 군사: ${a ? a.name : '없음'} · ${c.name} 태수: ${g ? g.name : '없음'}<br>군사는 계략의 성패를 조언하고, 태수는 매달 도시를 조금씩 발전시킵니다.</p>
      <label>무장 <select id="ap_o">${l.map(o => `<option value="${o.id}">${o.name} (지략 ${o.st[2]} · 내정 ${o.st[3]})</option>`).join('')}</select></label>
      <div class="row"><button onclick="G.advisor[G.player]=+$('ap_o').value;done(ok(G.officers[+$('ap_o').value].name+'을(를) 군사로 임명했습니다.'))">군사로</button>
      <button onclick="G.cities[sel].gov=+$('ap_o').value;done(ok(G.officers[+$('ap_o').value].name+'을(를) 태수로 임명했습니다.'))">태수로</button><button onclick="closeModal()">취소</button></div>`);
  },
  tax(c) {
    openModal(`<h2>${c.name} 세율</h2><p class="dim">세율이 높으면 수입이 늘지만 민심이 매달 떨어집니다.</p>
      <div class="cmds">${TAX.map((t, i) => `<button onclick="G.cities[sel].tax=${i};done(ok('${c.name}의 세율을 ${t.n}(으)로 정했습니다.'))">${t.n}<small>수입 ×${t.gold} · 민심 ${t.loyal >= 0 ? '+' : ''}${t.loyal}</small></button>`).join('')}</div>
      <div class="row"><button onclick="closeModal()">취소</button></div>`);
  },
  deleg(c) { c.deleg = !c.deleg; flash = `${c.name}: ${c.deleg ? '태수에게 내정을 맡깁니다. (출진은 하지 않습니다)' : '위임을 해제했습니다.'}`; render(); },
};
function showInfo() {
  const rows = FACTIONS.filter(f => alive(f.id)).sort((a, b) => power(b.id) - power(a.id)).map(f => `<tr><td style="color:${f.color}">${f.name}</td><td>${f.ruler}</td><td>${factionCities(f.id).length}</td><td>${num(factionCities(f.id).reduce((s, c) => s + c.troops, 0))}</td><td>${G.officers.filter(o => o.faction === f.id && !o.dead).length}</td><td>${f.id === G.player ? '—' : getRel(G.player, f.id)}${isAllied(G.player, f.id) ? ' 협정' : ''}</td></tr>`).join('');
  const mine = G.officers.filter(o => o.faction === G.player && !o.dead).sort((a, b) => b.st[0] - a.st[0]);
  openModal(`<h2>천하 정세</h2><table class="offs"><tr><th>세력</th><th>군주</th><th>도시</th><th>병력</th><th>무장</th><th>우호</th></tr>${rows}</table>
    <h3 style="margin-top:14px">아군 무장 ${mine.length}명</h3><table class="offs pick"><tr><th>무장</th>${ST.map(s => `<th>${s}</th>`).join('')}<th>충성</th><th>위치</th></tr>
    ${mine.map(o => `<tr onclick="selectCity(${o.city});closeModal()"><td>${o.name}</td>${o.st.map(v => `<td>${v}</td>`).join('')}<td>${o.loyal}</td><td>${G.cities[o.city].name}</td></tr>`).join('')}</table>
    <button class="wide" onclick="closeModal()">닫기</button>`);
}
function showOfficer(id) {
  const o = G.officers[id], see = o.faction === G.player;
  openModal(`<div class="row" style="align-items:center;margin:0 0 10px">${portrait(o, 96)}<div><h2 style="margin:0">${o.name}</h2><div class="dim">${o.faction ? F[o.faction].name : '재야'}${o.ruler ? ' · 군주' : ''}${getAdvisor(o.faction) === o ? ' · 군사' : ''}</div>${see && !o.ruler ? `<div>충성 ${o.loyal}</div>` : ''}</div></div>
    <table class="stats">${ST.map((s, i) => `<tr><td>${s}</td><td><span class="bar"><i style="width:${o.st[i]}%"></i></span> ${o.st[i]}</td></tr>`).join('')}</table>${officerExtra(o)}
    <button class="wide" onclick="closeModal()">닫기</button>`);
}
function uiCaptive(o, f) {
  return new Promise(resolve => {
    window._cap = v => { closeModal(); resolve(v); };
    openModal(`<div class="row" style="align-items:center;margin:0 0 10px">${portrait(o, 72)}<div><h2 style="margin:0">포로 ${o.name}</h2><div class="dim">통${o.st[0]} 무${o.st[1]} 지${o.st[2]} 내${o.st[3]} 덕${o.st[4]}</div></div></div>
      <div class="row"><button onclick="_cap('recruit')">등용</button><button onclick="_cap('free')">석방</button><button class="atk" onclick="_cap('kill')">처형</button></div>`);
  });
}
