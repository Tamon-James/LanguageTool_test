
const textarea = document.getElementById("inputText");
const errorsDiv = document.getElementById("errors");

// ---------- 自作タイプミス辞書(chatGPT出力) ----------
const SIMPLE_MISTAKES = [
  { wrong: "こんにちわ", correct: "こんにちは", reason: "挨拶の送り仮名" },
  { wrong: "しゅた",     correct: "した", reason: "タイプ誤り" },
  { wrong: "行くを",     correct: "行くのを", reason: "助詞の誤用" },
  { wrong: "食べれる", correct: "食べられる", reason: "ら抜き言葉" },
  { wrong: "見れる", correct: "見られる", reason: "ら抜き言葉" },
  { wrong: "来れる", correct: "来られる", reason: "ら抜き言葉" },
  { wrong: "寝れる", correct: "寝られる", reason: "ら抜き言葉" },
  { wrong: "行けれる", correct: "行けられる", reason: "ら抜き言葉（二重活用）" },
  { wrong: "忘れないようにする事", correct: "忘れないようにすること", reason: "送り仮名「事→こと」" },
  { wrong: "出来る", correct: "できる", reason: "常用表記ではひらがな推奨" },
  { wrong: "下さい", correct: "ください", reason: "送り仮名（命令形ではなく補助動詞）" },
  { wrong: "お世話に成ります", correct: "お世話になります", reason: "送り仮名の誤り（成→な）" },
  { wrong: "確認致します", correct: "確認いたします", reason: "送り仮名の誤り（致→いた）" },
  { wrong: "連絡致します", correct: "連絡いたします", reason: "送り仮名の誤り（致→いた）" },
  { wrong: "今日学校行く", correct: "今日学校に行く", reason: "助詞「に」の脱落" },
  { wrong: "彼が言った事", correct: "彼が言ったこと", reason: "送り仮名（事→こと）" },
  { wrong: "明日行く時", correct: "明日行くとき", reason: "送り仮名（時→とき）" },
  { wrong: "間違えた場合", correct: "間違った場合", reason: "動詞活用の誤用（「間違える」は自動詞）" },
  { wrong: "間違えないように", correct: "間違わないように", reason: "動詞活用の誤用" },
  { wrong: "食べれる", correct: "食べられる", reason: "ら抜き言葉" },
  { wrong: "見れる", correct: "見られる", reason: "ら抜き言葉" },
  { wrong: "出れる", correct: "出られる", reason: "ら抜き言葉" },
  { wrong: "寝れる", correct: "寝られる", reason: "ら抜き言葉" },
  { wrong: "来れる", correct: "来られる", reason: "ら抜き言葉" },
  { wrong: "知らさせていただく", correct: "知らせていただく", reason: "ら入り言葉" },
  { wrong: "行かさせていただく", correct: "行かせていただく", reason: "ら入り言葉" },
  { wrong: "読まさせていただく", correct: "読ませていただく", reason: "ら入り言葉" },
  { wrong: "行く事が出来ます", correct: "行くことができます", reason: "助詞・表記の誤り" },
  { wrong: "出来るだけ早く", correct: "できるだけ早く", reason: "表記の誤り" },
  { wrong: "宜しくお願いします", correct: "よろしくお願いします", reason: "表記の誤り（常用漢字）" },
  { wrong: "必ずしも〜とは限らない", correct: "かならずしも〜とは限らない", reason: "ひらがな表記が適切" },
  { wrong: "お早うございます", correct: "おはようございます", reason: "仮名遣いの誤り" },
  { wrong: "お世話に成ります", correct: "お世話になります", reason: "誤用（成る→なる）" },
  { wrong: "間違え易い", correct: "間違えやすい", reason: "送り仮名の誤り" },
  { wrong: "気ずく", correct: "気づく", reason: "ず/づの誤用" },
  { wrong: "つずける", correct: "つづける", reason: "ず/づの誤用" },
  { wrong: "はなぢ", correct: "はなじ", reason: "ず/づの誤用（鼻血）" },
  { wrong: "おとずれる", correct: "おとづれる", reason: "ず/づの誤用" },
  { wrong: "いちず", correct: "いちづ", reason: "ず/づの誤用（例外的）" },
  { wrong: "ひとづて", correct: "ひとずて", reason: "ず/づの誤用（例外的）" },
  { wrong: "〜したずら", correct: "〜いたずら", reason: "ず/づの誤用" },
  { wrong: "つずみ", correct: "つづみ", reason: "ず/づの誤用（鼓）" },
  { wrong: "出れるようにする", correct: "出られるようにする", reason: "ら抜き言葉" },
  { wrong: "来れる人", correct: "来られる人", reason: "ら抜き言葉" },
  { wrong: "寝れる場所", correct: "寝られる場所", reason: "ら抜き言葉" },
  { wrong: "見れる映画", correct: "見られる映画", reason: "ら抜き言葉" },
  { wrong: "歩けれる", correct: "歩けられる", reason: "ら抜き言葉" },
  { wrong: "行かさせられる", correct: "行かせられる", reason: "ら入り言葉" },
  { wrong: "読まさせられる", correct: "読ませられる", reason: "ら入り言葉" },
  { wrong: "書かさせられる", correct: "書かせられる", reason: "ら入り言葉" },
  { wrong: "食べさせらさせる", correct: "食べさせる", reason: "ら入り言葉" },
  { wrong: "使わさせてもらう", correct: "使わせてもらう", reason: "ら入り言葉" },
  { wrong: "気が付かない", correct: "気がつかない", reason: "表記の揺れ" },
  { wrong: "決っている", correct: "決まっている", reason: "誤変換" },
  { wrong: "貸して貰う", correct: "貸してもらう", reason: "助詞の誤り" },
  { wrong: "知らしていただく", correct: "知らせていただく", reason: "誤用" },
  { wrong: "見させていただく", correct: "見せていただく", reason: "誤用" },
  { wrong: "お世話に成る", correct: "お世話になる", reason: "誤変換" },
  { wrong: "本を読んずに寝る", correct: "本を読まずに寝る", reason: "ず/づの誤り" },
  { wrong: "手をつずける", correct: "手をつづける", reason: "ず/づの誤り" },
  { wrong: "はなず", correct: "はなづ", reason: "ず/づの誤り" },
  { wrong: "ひとずて", correct: "ひとづて", reason: "ず/づの誤り" },
  { wrong: "いちづける", correct: "位置づける", reason: "ず/づの誤り" },
  { wrong: "かんずめ", correct: "缶づめ", reason: "ず/づの誤り" },
  { wrong: "ことずける", correct: "言づける", reason: "ず/づの誤り" },
  { wrong: "ずらす", correct: "づらす", reason: "ず/づの誤り" },
  { wrong: "目に付く", correct: "目につく", reason: "表記ゆれ" },
  { wrong: "聞いとく", correct: "聞いておく", reason: "省略誤用" },
  { wrong: "行っとく", correct: "行っておく", reason: "省略誤用" },
  { wrong: "来んかった", correct: "来なかった", reason: "方言的誤用" },
  { wrong: "行かんかった", correct: "行かなかった", reason: "方言的誤用" },
  { wrong: "言わんかった", correct: "言わなかった", reason: "方言的誤用" },
  { wrong: "無いです", correct: "ありません", reason: "丁寧語の誤用" },
  { wrong: "よろしかったでしょうか", correct: "よろしいでしょうか", reason: "敬語の誤用" },
  { wrong: "起きれる", correct: "起きられる", reason: "ら抜き言葉" },
  { wrong: "遊べれる", correct: "遊べられる", reason: "ら抜き言葉" },
  { wrong: "決めれる", correct: "決められる", reason: "ら抜き言葉" },
  { wrong: "行かれると思う", correct: "行けると思う", reason: "表記の揺れ" },
  { wrong: "食べさせれる", correct: "食べさせられる", reason: "ら抜き言葉" },
  { wrong: "書かさせる", correct: "書かせる", reason: "ら入り言葉" },
  { wrong: "読まさせる", correct: "読ませる", reason: "ら入り言葉" },
  { wrong: "話させらさせる", correct: "話させる", reason: "ら入り言葉" },
  { wrong: "作らさせてもらう", correct: "作らせてもらう", reason: "ら入り言葉" },
  { wrong: "気が付く", correct: "気がつく", reason: "表記ゆれ" },
  { wrong: "間違えやすい", correct: "間違いやすい", reason: "送り仮名の誤り" },
  { wrong: "確かめれる", correct: "確かめられる", reason: "ら抜き言葉" },
  { wrong: "信じれる", correct: "信じられる", reason: "ら抜き言葉" },
  { wrong: "出来れる", correct: "できる", reason: "ら抜き言葉" },
  { wrong: "助けれる", correct: "助けられる", reason: "ら抜き言葉" },
  { wrong: "見させれる", correct: "見させられる", reason: "ら抜き言葉" },
  { wrong: "来させれる", correct: "来させられる", reason: "ら抜き言葉" },
  { wrong: "寝させれる", correct: "寝させられる", reason: "ら抜き言葉" },
  { wrong: "やらせれる", correct: "やらせられる", reason: "ら抜き言葉" },
  { wrong: "書けれる", correct: "書けられる", reason: "ら抜き言葉" },
  { wrong: "読めれる", correct: "読められる", reason: "ら抜き言葉" },
  { wrong: "聞けれる", correct: "聞けられる", reason: "ら抜き言葉" },
  { wrong: "話せれる", correct: "話せられる", reason: "ら抜き言葉" },
  { wrong: "立てれる", correct: "立てられる", reason: "ら抜き言葉" },
  { wrong: "使えれる", correct: "使えられる", reason: "ら抜き言葉" },
  { wrong: "習えれる", correct: "習えられる", reason: "ら抜き言葉" },
  { wrong: "読まれれる", correct: "読まれられる", reason: "ら抜き言葉" },
  { wrong: "書かれれる", correct: "書かれられる", reason: "ら抜き言葉" },
  { wrong: "行かれれる", correct: "行かれられる", reason: "ら抜き言葉" },
  { wrong: "見られれる", correct: "見られられる", reason: "ら抜き言葉" },
  { wrong: "書き間違えれる", correct: "書き間違えられる", reason: "ら抜き言葉" },
  { wrong: "！れ", correct: "！！！", reason: "フリック入力ミス" },
  { wrong: "？る", correct: "？", reason: "「フリック入力ミス" },
  { wrong: "。る", correct: "。", reason: "フリック入力ミス" }
];

// ---------- 簡易ルール関数 ----------
function runSimpleChecks(text) {
  const findings = [];
  const lower = text;

  SIMPLE_MISTAKES.forEach(entry => {
    if (lower.includes(entry.wrong)) {
      findings.push({
        source: "simple",
        wrong: entry.wrong,
        suggestion: entry.correct,
        message: `${entry.wrong} → ${entry.correct} (${entry.reason})`
      });
    }
  });

  // 追加のヒューリスティック例：連続同語の検出
  const duplicateWordMatch = text.match(/([^\s。、]{2,10})\1/g);
  if (duplicateWordMatch) {
    duplicateWordMatch.forEach(m => {
      findings.push({
        source: "heuristic",
        wrong: m,
        suggestion: m.slice(0, m.length/2),
        message: `重複表現: "${m}" は冗長な可能性があります。`
      });
    });
  }

  // 句読点抜けチェック（句点や読点が一切ない長文）
  if (text.length > 80 && !(/[。、]/.test(text))) {
    findings.push({
      source: "heuristic",
      wrong: null,
      suggestion: null,
      message: "長文ですが句読点が見当たりません。読点・句点を適切に入れると読みやすくなります。"
    });
  }

  return findings;
}

// ---------- LanguageTool API 呼び出し ----------
async function callLanguageTool(text) {
  const url = "https://api.languagetool.org/v2/check";
  const params = new URLSearchParams();
  params.append("text", text);
  params.append("language", "ja");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });
  if (!res.ok) {
    throw new Error(`LanguageTool API error: ${res.status}`);
  }
  return res.json();
}

// ---------- UI表示 ----------
function render(findings, ltMatches) {
  let html = "";

  if (findings.length) {
    findings.forEach(f => {
      html += `<div class="errorItem"><div class="small">${escapeHtml(f.message)}</div>`;
      if (f.suggestion) html += `<div class="small">候補: <span class="candidate">${escapeHtml(f.suggestion)}</span></div>`;
      html += `</div>`;
    });
  }

  // LanguageTool の結果表示
  if (ltMatches && ltMatches.length) {
    ltMatches.forEach(m => {
      const msg = m.message || "文法チェック";
      const replacements = (m.replacements || []).map(r => escapeHtml(r.value)).join(", ");
      html += `<div class="errorItem"><div class="small">❗ ${escapeHtml(msg)}</div>`;
      if (replacements) html += `<div class="small">候補: <span class="candidate">${replacements}</span></div>`;
      html += `</div>`;
    });
  }

  if (!findings.length && (!ltMatches || ltMatches.length === 0)) {
    html = `<div class="infoItem"><div class="small">✅ 問題は見つかりませんでした（ただし検出できない誤りもあります）</div></div>`;
  }

  errorsDiv.innerHTML = html;
}

// HTMLエスケープ（簡易）
function escapeHtml(s) {
  return (s || "").toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// デバウンス関数
function debounce(fn, delay = 700) {
  let t = null;
  return function(...args) {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

// メインチェック処理 (デバウンス付き)
const doCheck = debounce(async function(text) {
  if (!text || !text.trim()) {
    errorsDiv.innerHTML = "";
    return;
  }

  // 1) 自作シンプルチェック（高速・ローカル）
  const simpleFindings = runSimpleChecks(text);

  // 2) LanguageTool を呼ぶ（ネットワーク）
  let ltMatches = [];
  try {
    const ltRes = await callLanguageTool(text);
    ltMatches = ltRes.matches || [];
  } catch (err) {
    ltMatches = [];
    simpleFindings.unshift({
      source: "system",
      message: "⚠️ LanguageTool API に接続できませんでした。自作ルールのみで表示しています。"
    });
    console.error(err);
  }

  // 結果を表示
  render(simpleFindings, ltMatches);
}, 700);

// イベントリスナ
textarea.addEventListener("input", (e) => {
  const text = e.target.value;
  doCheck(text);
});

// 初期のヒント表示
errorsDiv.innerHTML = `<div class="infoItem"><div class="small">テスト: 「こんにちわ」「よみました」「行くを」「毎日毎日」等で検出。入力が止まってから検出。</div></div>`;
