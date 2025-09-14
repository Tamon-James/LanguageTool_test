const input = document.getElementById("inputText");
const preview = document.getElementById("preview");
const previewContainer = document.getElementById("previewContainer");
const togglePreviewBtn = document.getElementById("togglePreview");

const tooltip = document.getElementById("tooltip");
let currentError = null;

// 自作簡易辞書
// 誤字の仮データ（学習用）
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
  { wrong: "？る", correct: "？", reason: "フリック入力ミス" },
  { wrong: "。る", correct: "。", reason: "フリック入力ミス" }
];

// LanguageTool APIでチェック
async function checkWithLanguageTool(text) {
  try {
    const res = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        text: text,
        language: "ja"
      })
    });
    const data = await res.json();
    return data.matches.map(m => ({
      wrong: text.substring(m.offset, m.offset + m.length),
      correct: m.replacements.length > 0 ? m.replacements[0].value : "(提案なし)",
      reason: m.message
    }));
  } catch (e) {
    console.error("LanguageTool API error:", e);
    return [];
  }
}

// プレビュー更新（誤字＋繰り返し検出）
function updatePreview(text, externalErrors = []) {
  let html = text;

  // 1. 自作辞書＋API
  [...dictionary, ...externalErrors].forEach(item => {
    if (!item.wrong) return;
    const regex = new RegExp(item.wrong, "g");
    html = html.replace(
      regex,
      `<span class="error" data-correct="${item.correct}" data-reason="${item.reason}">${item.wrong}</span>`
    );
  });

  // 2. 繰り返し検出（日本語文字2〜10文字の連続）
  const duplicateRegex = /([^\s。、]{2,10})\1/g;
  html = html.replace(duplicateRegex, (match) => {
    return `<span class="error" data-correct="${match.slice(0, match.length/2)}" data-reason="繰り返しがあります">${match}</span>`;
  });

  preview.innerHTML = html;

  // 3. 誤字クリックで吹き出し表示
  document.querySelectorAll(".error").forEach(el => {
    el.addEventListener("click", () => {
      currentError = el;
      document.getElementById("reason").textContent = "理由: " + el.dataset.reason;
      document.getElementById("correct").textContent = el.dataset.correct;

      const rect = el.getBoundingClientRect();
      tooltip.style.top = (window.scrollY + rect.top - 5) + "px";
      tooltip.style.left = (window.scrollX + rect.left - 270) + "px";
      tooltip.style.display = "block";
    });
  });
}

// 入力ごとにプレビュー更新
input.addEventListener("input", async () => {
  const text = input.value;
  updatePreview(text); // 自作辞書チェック

  // APIチェック結果を反映
  const apiErrors = await checkWithLanguageTool(text);
  if (apiErrors.length > 0) {
    updatePreview(text, apiErrors);
  }
});

// プレビューボタンで表示切替（左右半画面）
togglePreviewBtn.addEventListener("click", () => {
  const isHidden = previewContainer.style.display === "none";
  previewContainer.style.display = isHidden ? "block" : "none";
  document.getElementById("container").classList.toggle("halfscreen", isHidden);
  togglePreviewBtn.textContent = isHidden ? "プレビュー非表示" : "プレビュー表示";
});

// 吹き出しボタン処理（置き換え＆テキストエリアも更新）
document.getElementById("replaceBtn").addEventListener("click", () => {
  if (currentError) {
    const correctText = currentError.dataset.correct;
    const spanText = currentError.innerText;
    // プレビュー内を置き換え
    currentError.outerHTML = correctText;
    // テキストエリア内も置き換え
    input.value = input.value.replace(spanText, correctText);
    tooltip.style.display = "none";
    // 更新後に再度プレビュー更新
    updatePreview(input.value);
  }
});

// 吹き出しボタン処理（無視）
document.getElementById("ignoreBtn").addEventListener("click", () => {
  if (currentError) {
    currentError.style.color = "inherit";
    currentError.style.textDecoration = "none";
    currentError.classList.remove("error");
    tooltip.style.display = "none";
  }
});

// 吹き出し外クリックで閉じる
document.addEventListener("click", (e) => {
  if (!tooltip.contains(e.target) && !e.target.classList.contains("error")) {
    tooltip.style.display = "none";
  }
});
