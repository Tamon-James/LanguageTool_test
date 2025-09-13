async function checkJapanese(text) {
    const res = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            text: text,
            language: "ja"
        })
    });
    return res.json();
}

document.getElementById("inputText").addEventListener("input", async (e) => {
    const text = e.target.value;
    const errorDiv = document.getElementById("errors");

    if (text.trim() === "") {
        errorDiv.innerHTML = "";
        return;
    }

    try {
        const result = await checkJapanese(text);

        if (result.matches.length === 0) {
            errorDiv.innerHTML = "<p>✅ 問題は見つかりませんでした。</p>";
        } else {
            errorDiv.innerHTML = result.matches.map(err =>
                `<div class="error">❌ ${err.message}<br>
                 👉 候補: ${err.replacements.map(r => r.value).join(", ")}</div>`
            ).join("");
        }
    } catch (err) {
        errorDiv.innerHTML = `<p style="color:red;">⚠ APIに接続できませんでした。</p>`;
        console.error(err);
    }
});
