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

  // ======================== Nuclear Energy ========================
  // const messages = [
  //   {
  //     speaker: "賛成派",
  //     side: "left",
  //     text:
  //       "原子力エネルギーは、現代社会において必要不可欠な選択肢です。須藤元気氏が述べたように、「エネルギー安全保障と現実的対応の観点から原発は必要」との考えは、地政学的な現状を考慮した上での合理的な判断です。再生可能エネルギーだけでは、急増する電力需要を賄うことは難しいため、原子力は安定した電力供給源として重要です。もちろん、リスクや環境への影響は考慮すべきですが、安全性を確保した上での原発の活用は、持続可能な未来に向けた現実的な選択肢です。"
  //   },
  //   {
  //     speaker: "反対派",
  //     side: "right",
  //     text:
  //       "原子力エネルギーの必要性を主張する須藤元気氏の意見には賛同できません。原発は、過去の事故や放射性廃棄物の処理問題からも明らかなように、深刻なリスクを伴います。特に、福島第一原発の事故は、原発の安全性に対する信頼を大きく損ないました。また、再生可能エネルギーの技術は急速に進化しており、太陽光や風力などのクリーンエネルギーが電力供給の主力となる可能性が高まっています。原発に依存するのではなく、持続可能なエネルギー政策を推進すべきです。"
  //   }
  // ];

//  ======================== Self-Driving Cars ========================
    const messages = [
    {
      speaker: "賛成派",
      side: "left",
      text:
        "自動運転車の開発は、交通事故の減少や交通渋滞の緩和に寄与する可能性があります。Turingのデモ車は、音声指示を認識し、状況に応じた判断を行う能力を持っています。これは、従来のセンサーやマップに依存する方法よりも柔軟性が高く、実用化が進めば安全性が向上するでしょう。また、LLMを活用することで、より人間に近い判断が可能になる点も注目すべきです。確かに、現在の技術には課題がありますが、Turingの取り組みは未来の自動運転の可能性を広げる重要な一歩です。"
    },
    {
      speaker: "反対派",
      side: "right",
      text:
        "自動運転車の開発には多くのリスクが伴います。Turingのデモ車が音声指示を認識し、状況に応じた判断を行う能力を持つとされていますが、実際には「約6秒かかる」という遅延があるため、緊急時の対応が不十分です。この遅延は、事故を引き起こす可能性を高めます。また、AIによる判断が「トロッコ問題」に直面することは、倫理的な問題を引き起こし、責任の所在が不明確になります。自動運転車は、技術的な進歩があっても、依然として安全性や倫理的な課題を解決する必要があります。"
    }
  ];

  //======================== Surveilance state ========================


  // agents/topics optional (kept for your UI)
  const agents = [
    { name: "賛成派", side: "left" },
    { name: "反対派", side: "right" }
  ];

  return { topics: [], agents, messages };
}
