// src/mock/mockAPI.jsx
export async function getArticle() {
  const res = await fetch("/News.html");
  if (!res.ok) throw new Error("Failed to load News.html");
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const title = doc.querySelector("header h1")?.textContent.trim() ?? "Untitled";
  const metaText = doc.querySelector(".meta")?.textContent.trim() ?? "";
  const parts = metaText.split("・").map(s => s.trim());
  const source = parts[0] || "";
  const topic  = parts[1] || "";
  const date   = parts[2] || null;
  const articleEl = doc.querySelector("article");
  const content = articleEl ? articleEl.textContent.trim() : "(No content)";
  return { id: "news-1", title, source, topic, date, content };
}

export async function generateDebate({ userPosition } = {}) {
  // tiny delay to show "生成中..."
  await new Promise(r => setTimeout(r, 600));

  const messages = [
    {
      speaker: "賛成派",
      side: "left",
      text:
        "原子力エネルギーは、現代社会において必要不可欠な選択肢です。須藤元気氏が述べたように、「エネルギー安全保障と現実的対応の観点から原発は必要」との考えは、地政学的な現状を考慮した上での合理的な判断です。再生可能エネルギーだけでは、急増する電力需要を賄うことは難しいため、原子力は安定した電力供給源として重要です。もちろん、リスクや環境への影響は考慮すべきですが、安全性を確保した上での原発の活用は、持続可能な未来に向けた現実的な選択肢です。"
    },
    {
      speaker: "反対派",
      side: "right",
      text:
        "原子力エネルギーの必要性を主張する須藤元気氏の意見には賛同できません。原発は、過去の事故や放射性廃棄物の処理問題からも明らかなように、深刻なリスクを伴います。特に、福島第一原発の事故は、原発の安全性に対する信頼を大きく損ないました。また、再生可能エネルギーの技術は急速に進化しており、太陽光や風力などのクリーンエネルギーが電力供給の主力となる可能性が高まっています。原発に依存するのではなく、持続可能なエネルギー政策を推進すべきです。"
    }
  ];

  // agents/topics optional (kept for your UI)
  const agents = [
    { name: "賛成派", side: "left" },
    { name: "反対派", side: "right" }
  ];

  return { topics: [], agents, messages };
}
